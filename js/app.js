/* app.js — the interface.
 *
 * Two settings drive everything: the language you speak (which alphabet the
 * respelling is written in) and the language you are learning.
 */

/* ---------- tiny DOM helpers -------------------------------------------- */

const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ---------- state -------------------------------------------------------- */

const state = {
  speaks: MyWords.prefs().speaks || 'ht',
  learning: MyWords.prefs().learning || 'ja',
  tab: 'learn',
  category: 'all',
  script: null,
  openBreakdowns: {},
  trainer: { queue: [], at: 0, source: 'words' },
  quiz: { mode: 'hear', q: null, asked: 0, right: 0 }
};

const orth = () => MyWords.orthographyFor(state.speaks);
const orthName = () => (ORTHOGRAPHIES[state.speaks] || ORTHOGRAPHIES.en).name;
const myVoice = () => ORTH_VOICE[state.speaks] || 'en-US';
const targetVoice = () => (LANGUAGES[state.learning] || {}).voice;
const isRTL = () => state.learning === 'ar';

/** The respelling for a word: the user's own if they wrote one. */
function sayOf(scriptForm, pron) {
  const mine = MyWords.getWord(state.speaks, state.learning, scriptForm);
  if (mine && mine.spell) return { text: mine.spell, own: true, pron: pron || mine.pron };
  if (pron) return { text: respell(pron, orth()).text, own: false, pron: pron };
  return { text: '', own: false, pron: '' };
}

/* Phrasebook lookup by written form, so pasted text can borrow its sounds. */
const _pbCache = {};
function phrasebook(lang) {
  if (!_pbCache[lang]) {
    const m = {};
    (LANGUAGES[lang] ? LANGUAGES[lang].words : []).forEach(w => {
      m[w[0]] = { pron: w[2], translit: w[1], meaning: w[3] };
    });
    Object.keys(PRON_EXTRA[lang] || {}).forEach(k => {
      if (!m[k]) m[k] = { pron: PRON_EXTRA[lang][k], translit: '', meaning: (GLOSS[lang] || {})[k] || '' };
    });
    _pbCache[lang] = m;
  }
  return _pbCache[lang];
}

/** Best pronunciation we can find for a piece of text in the current language. */
function pronFor(text) {
  const saved = MyWords.getWord(state.speaks, state.learning, text);
  if (saved && saved.pron) return saved.pron;
  const pb = phrasebook(state.learning)[text];
  if (pb) return pb.pron;
  const tr = TRANSCRIBERS[state.learning];
  if (tr) { try { return tr.run(text) || ''; } catch (e) { return ''; } }
  return '';
}

/* ---------- sound playback ---------------------------------------------- */

/**
 * Say a word. Hands over the sounds, not the letters, so that when there is no
 * voice for the language being learned the sounds can be re-spelled for a
 * voice that does exist rather than being read out in a spelling it cannot
 * pronounce.
 */
function playTarget(scriptText, pron, rate) {
  const res = Speech.speakWord(scriptText, pron, targetVoice(), {
    rate: rate || 1, preferTag: myVoice()
  });
  if (res.how === 'fallback') noteFallback(res);
  if (res.how === 'silent') noteSilent();
  return res.how;
}

/** Read back something the user wrote in their own spelling. */
function playMine(text, rate) {
  if (!canReadMySpelling()) { noteCannotReadMine(); return false; }
  Speech.speakOwn(text, myVoice(), { rate: rate || 1 });
  return true;
}

/** Only true when a voice exists that can actually read the user's spelling. */
function canReadMySpelling() {
  const reader = Speech.readerFor(myVoice());
  return !!reader && reader.orth === state.speaks;
}

function setStatus(cls, text, title) {
  const b = $('#voice-status');
  b.classList.remove('ok', 'warn');
  if (cls) b.classList.add(cls);
  $('#voice-label').textContent = text;
  if (title) b.title = title;
}

function noteFallback(res) {
  const spelling = ORTHOGRAPHIES[res.orth].name;
  setStatus('warn',
    'no ' + LANGUAGES[state.learning].name + ' voice — sounding it out in ' + spelling,
    'This computer has no ' + LANGUAGES[state.learning].name + ' voice, so the word is '
    + 'respelled for the ' + res.voice.name + ' voice (' + spelling + ' spelling) and read '
    + 'aloud with that. It is an imitation, not the real accent.');
}

function noteSilent() {
  setStatus('warn', 'no sounds saved for that one yet',
    'Nothing is known about how that word sounds, so nothing is played rather than '
    + 'guessing. Click the word to write down how it sounds and it will be spoken from then on.');
}

function noteCannotReadMine() {
  setStatus('warn', 'no ' + orthName() + ' voice to read your spelling back',
    'Your own spelling can only be read back by a voice for ' + orthName()
    + ', and this computer has none installed.');
}

function updateVoiceStatus() {
  if (!Speech.supported()) { setStatus('', 'this browser has no speech'); return; }
  if (!Speech.list.length) { setStatus('', 'no voices installed'); return; }

  const target = LANGUAGES[state.learning].name;
  if (Speech.hasVoiceFor(targetVoice())) {
    setStatus('ok', target + ' voice ready',
      'Words are spoken by a real ' + target + ' voice.');
    return;
  }
  const reader = Speech.readerFor(myVoice());
  setStatus('warn',
    'no ' + target + ' voice — sounding it out' + (reader ? ' in ' + ORTHOGRAPHIES[reader.orth].name : ''),
    'This computer has no ' + target + ' voice. Words are respelled for a voice that is '
    + 'installed' + (reader ? ' (' + reader.voice.name + ')' : '') + ' and read aloud with that, '
    + 'which is an imitation rather than the real accent.\n\nWindows: Settings → Time & language '
    + '→ Language & region → Add a language, and tick the speech option.');
}

/* ---------- the word editor dialog --------------------------------------- */

let dialogCtx = null;

function openWordDialog(ctx) {
  dialogCtx = ctx;                       // { script, pron, translit, meaning, onSave }
  const dlg = $('#word-dialog');
  const saved = MyWords.getWord(state.speaks, state.learning, ctx.script);
  const guess = ctx.pron ? respell(ctx.pron, orth()).text : '';

  $('#wd-title').textContent = saved ? 'Your spelling' : 'Write it your way';
  const sc = $('#wd-script');
  sc.textContent = ctx.script;
  sc.classList.toggle('rtl', isRTL());
  $('#wd-translit').textContent = ctx.translit || (ctx.pron ? pronToIpa(ctx.pron) : '');
  $('#wd-meaning-hint').textContent = ctx.meaning || 'meaning not known yet';
  $('#wd-suggest').textContent = guess || '—';
  $('#wd-spell').value = (saved && saved.spell) || '';
  $('#wd-spell').placeholder = guess || 'write it however it sounds to you';
  $('#wd-meaning').value = (saved && saved.meaning) || ctx.meaning || '';
  $('#wd-delete').style.display = saved ? '' : 'none';

  dlg.showModal();
  setTimeout(() => $('#wd-spell').focus(), 30);
}

function wireDialog() {
  const dlg = $('#word-dialog');
  $('#wd-play').onclick = () => {
    playTarget(dialogCtx.script, dialogCtx.pron);
  };
  $('#wd-play-slow').onclick = () => {
    playTarget(dialogCtx.script, dialogCtx.pron, 0.6);
  };
  $('#wd-cancel').onclick = () => dlg.close();
  $('#wd-save').onclick = () => {
    const spell = $('#wd-spell').value.trim();
    const meaning = $('#wd-meaning').value.trim();
    if (spell || meaning) {
      MyWords.setWord(state.speaks, state.learning, dialogCtx.script, {
        spell, meaning, pron: dialogCtx.pron || '', translit: dialogCtx.translit || ''
      });
    }
    dlg.close();
    if (dialogCtx.onSave) dialogCtx.onSave();
    refreshCount();
    render();
  };
  $('#wd-delete').onclick = () => {
    MyWords.deleteWord(state.speaks, state.learning, dialogCtx.script);
    dlg.close();
    if (dialogCtx.onSave) dialogCtx.onSave();
    refreshCount();
    render();
  };
  $('#wd-spell').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); $('#wd-save').click(); }
  });
}

/* ---------- Learn tab ----------------------------------------------------- */

function renderLearn() {
  const root = $('#tab-learn');
  root.innerHTML = '';
  const lang = LANGUAGES[state.learning];

  const lede = el('div', 'lede');
  lede.innerHTML = '<strong>' + esc(lang.name) + '</strong> — ' + esc(lang.note)
    + '<br><br>Every word below is stored as <em>sounds</em>, then written back out using '
    + '<strong>' + esc(orthName()) + '</strong> spelling. Tap <b>make it mine</b> on any card to replace '
    + 'our guess with however you would write it.';
  root.appendChild(lede);

  /* category filter */
  const chips = el('div', 'chips');
  const cats = ['all'].concat(Object.keys(CATEGORIES).filter(c => lang.words.some(w => w[4] === c)));
  cats.forEach(c => {
    const b = el('button', 'chip' + (state.category === c ? ' is-active' : ''),
      c === 'all' ? 'Everything' : CATEGORIES[c]);
    b.onclick = () => { state.category = c; renderLearn(); };
    chips.appendChild(b);
  });
  root.appendChild(chips);

  const grid = el('div', 'grid');
  wordsOf(state.learning)
    .filter(w => state.category === 'all' || w.cat === state.category)
    .forEach(w => grid.appendChild(wordCard(w)));
  root.appendChild(grid);
}

function wordCard(w) {
  const card = el('div', 'wcard');
  const say = sayOf(w.script, w.pron);

  const scriptLine = el('div', 'script' + (isRTL() ? ' rtl' : ''), w.script);
  card.appendChild(scriptLine);
  card.appendChild(el('div', 'translit', w.translit));

  const mine = el('div', 'mine');
  const span = el('span', say.own ? 'own' : '', say.text);
  mine.appendChild(span);
  card.appendChild(mine);

  card.appendChild(el('div', 'meaning', w.meaning));

  const row = el('div', 'row');
  const hear = el('button', 'btn small', '▶ Hear it');
  hear.onclick = () => playTarget(w.script, w.pron);
  row.appendChild(hear);

  const slow = el('button', 'btn small ghost', 'Slowly');
  slow.onclick = () => playTarget(w.script, w.pron, 0.6);
  row.appendChild(slow);

  const mineBtn = el('button', 'btn small ghost', say.own ? 'Edit mine' : 'Make it mine');
  mineBtn.onclick = () => openWordDialog({
    script: w.script, pron: w.pron, translit: w.translit, meaning: w.meaning
  });
  row.appendChild(mineBtn);

  const bd = el('button', 'btn small ghost', 'Break it down');
  bd.onclick = () => {
    state.openBreakdowns[w.id] = !state.openBreakdowns[w.id];
    renderLearn();
  };
  row.appendChild(bd);

  if (say.own) row.appendChild(el('span', 'tag', 'yours'));
  card.appendChild(row);

  if (state.openBreakdowns[w.id]) card.appendChild(breakdownBlock(w.pron));
  return card;
}

function breakdownBlock(pron) {
  const box = el('div', 'breakdown');
  const rows = el('div', 'syl-row');
  breakdown(pron, orth()).forEach(syl => {
    const s = el('div', 'syl' + (syl.stress ? ' stress' : ''));
    s.appendChild(el('b', null, syl.spelled));
    s.appendChild(el('small', null, syl.sounds.map(x => x.ipa).join('')));
    s.title = syl.sounds.map(x => x.ipa + ' = ' + (x.letters || '–') + (x.hint ? ' (' + x.hint + ')' : '')).join('\n');
    s.onclick = () => playTarget(syl.spelled, syl.sounds.map(x => x.token).join(''), 0.8);
    rows.appendChild(s);
  });
  box.appendChild(rows);
  const legend = el('p', 'wd-meta', 'Tap a syllable to hear it read in your spelling. '
    + 'Hover to see which sound each piece is.');
  box.appendChild(legend);
  return box;
}

/* ---------- Write tab ----------------------------------------------------- */

function renderWrite() {
  const root = $('#tab-write');
  root.innerHTML = '';

  const forLang = (LANGUAGES[state.learning].scripts || []);
  const others = SCRIPT_ORDER.filter(s => !forLang.includes(s));
  if (!state.script || !SCRIPTS[state.script]) state.script = forLang[0] || 'hiragana';

  if (!forLang.length) {
    const l = el('div', 'lede');
    l.innerHTML = '<strong>' + esc(LANGUAGES[state.learning].name) + '</strong> uses the same alphabet you '
      + 'already write with, so there is no new script to learn. The scripts below belong to the other '
      + 'languages — have a look anyway.';
    root.appendChild(l);
  }

  const chips = el('div', 'chips');
  forLang.concat(others).forEach(key => {
    const s = SCRIPTS[key];
    if (!s) return;
    const b = el('button', 'chip' + (state.script === key ? ' is-active' : ''),
      (LANGUAGES[s.lang] ? LANGUAGES[s.lang].flag + ' ' : '') + s.name);
    b.onclick = () => { state.script = key; state.char = null; renderWrite(); };
    chips.appendChild(b);
  });
  root.appendChild(chips);

  const s = SCRIPTS[state.script];
  const lede = el('div', 'lede');
  lede.innerHTML = '<strong>' + esc(s.name) + '</strong> · ' + esc(s.native) + ' — ' + esc(s.intro);
  root.appendChild(lede);

  const tips = el('ul', 'tips');
  s.tips.forEach(t => tips.appendChild(el('li', null, t)));
  root.appendChild(tips);

  const wrap = el('div', 'charwrap');
  const left = el('div');
  s.groups.forEach(g => {
    left.appendChild(el('h3', 'section-title', g.name));
    const grid = el('div', 'chargrid');
    g.items.forEach(item => grid.appendChild(charCell(item, s)));
    left.appendChild(grid);
  });
  wrap.appendChild(left);

  const studio = el('div', 'studio');
  studio.id = 'studio';
  wrap.appendChild(studio);
  root.appendChild(wrap);

  if (!state.char) state.char = s.groups[0].items[0];
  renderStudio(s);
}

function charCell(item, script) {
  const [ch, rom, pron] = item;
  const cell = el('div', 'cell' + (state.char && state.char[0] === ch ? ' is-active' : ''));
  const g = el('div', 'glyph' + (script.lang === 'ar' ? ' rtl' : ''), ch);
  cell.appendChild(g);
  cell.appendChild(el('div', 'rom', rom));
  const say = pron ? respell(pron, orth()).text : '';
  cell.appendChild(el('div', 'say', say));
  cell.onclick = () => {
    state.char = item;
    renderWrite();
    playTarget(ch, pron);
  };
  return cell;
}

function renderStudio(script) {
  const studio = $('#studio');
  if (!studio) return;
  studio.innerHTML = '';
  const [ch, rom, pron, strokes, note] = state.char;

  studio.appendChild(el('h3', null, rom));
  const say = pron ? respell(pron, orth()).text : '';
  studio.appendChild(el('div', 'say-big', say || '—'));
  if (pron) studio.appendChild(el('div', 'wd-meta', pronToIpa(pron)));

  const box = el('div', 'trace-box');
  const canvas = el('canvas');
  canvas.width = 600; canvas.height = 600;
  box.appendChild(canvas);
  studio.appendChild(box);

  const row = el('div', 'row');
  const hear = el('button', 'btn small', '▶ Hear it');
  hear.onclick = () => playTarget(ch, pron);
  row.appendChild(hear);
  const clear = el('button', 'btn small ghost', 'Clear');
  const guide = el('button', 'btn small ghost', 'Hide guide');
  row.appendChild(clear); row.appendChild(guide);
  studio.appendChild(row);

  if (strokes) studio.appendChild(el('p', 'strokes', strokes + ' stroke' + (strokes > 1 ? 's' : '')
    + ' — count them as you copy it.'));
  if (note) studio.appendChild(el('p', 'note', note));

  studio.appendChild(el('p', 'wd-meta', 'Trace over the grey character with your mouse or finger. '
    + 'Copying the shape by hand is what makes it stick.'));

  mountTrace(canvas, ch, clear, guide, script.lang === 'ar');
}

/** A tracing pad: faint model character, grid, and freehand drawing on top. */
function mountTrace(canvas, ch, clearBtn, guideBtn, rtl) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  let strokes = [], current = null, showGuide = true;

  const ink = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#ffc857';
  const faint = getComputedStyle(document.body).getPropertyValue('--line').trim() || '#2c3348';
  const model = getComputedStyle(document.body).getPropertyValue('--ink-faint').trim() || '#6f7994';

  function paint() {
    ctx.clearRect(0, 0, W, W);

    ctx.strokeStyle = faint; ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, W - 2);
    ctx.setLineDash([8, 10]);
    ctx.beginPath();
    ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, W);
    ctx.moveTo(0, W / 2); ctx.lineTo(W, W / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    if (showGuide) {
      ctx.save();
      ctx.globalAlpha = 0.32;
      ctx.fillStyle = model;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.direction = rtl ? 'rtl' : 'ltr';
      ctx.font = '440px "Yu Gothic", "Meiryo", "Malgun Gothic", "Microsoft YaHei", '
               + '"Nirmala UI", "Segoe UI", "Traditional Arabic", serif';
      ctx.fillText(ch, W / 2, W / 2 + 20);
      ctx.restore();
    }

    ctx.strokeStyle = ink; ctx.lineWidth = 13;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    strokes.concat(current ? [current] : []).forEach(stroke => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      stroke.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    });
  }

  function at(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * W };
  }
  canvas.addEventListener('pointerdown', e => {
    canvas.setPointerCapture(e.pointerId);
    current = [at(e)]; paint();
  });
  canvas.addEventListener('pointermove', e => { if (current) { current.push(at(e)); paint(); } });
  const end = () => { if (current) { strokes.push(current); current = null; paint(); } };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('pointerleave', end);

  clearBtn.onclick = () => { strokes = []; current = null; paint(); };
  guideBtn.onclick = () => {
    showGuide = !showGuide;
    guideBtn.textContent = showGuide ? 'Hide guide' : 'Show guide';
    paint();
  };
  paint();
}

/* ---------- Read tab ------------------------------------------------------ */

function renderRead() {
  const root = $('#tab-read');
  root.innerHTML = '';
  const lang = LANGUAGES[state.learning];
  const tr = TRANSCRIBERS[state.learning];

  const lede = el('div', 'lede');
  lede.innerHTML = 'Paste anything written in <strong>' + esc(lang.name) + '</strong> and it comes back '
    + 'spelled the way you read, word by word, with meanings. Words you have taught it keep '
    + '<em>your</em> spelling. Click any word to correct it or add what it means.'
    + (tr ? '<br><br><span style="color:var(--ink-faint)">' + esc(tr.caution) + '</span>' : '');
  root.appendChild(lede);

  const field = el('label', 'field');
  field.appendChild(el('span', null, tr ? tr.label + ' — paste or type below' : 'Type below'));
  const ta = el('textarea');
  ta.rows = 3;
  ta.id = 'read-input';
  ta.placeholder = tr ? tr.placeholder : 'type a word or a sentence';
  ta.value = state.readText || '';
  field.appendChild(ta);
  root.appendChild(field);

  const row = el('div', 'chips');
  const go = el('button', 'btn primary', 'Sound it out');
  go.onclick = () => { state.readText = ta.value; renderRead(); };
  row.appendChild(go);
  if (tr) {
    const sample = el('button', 'btn ghost', 'Try an example');
    sample.onclick = () => { state.readText = tr.sample; renderRead(); };
    row.appendChild(sample);
  }
  const clear = el('button', 'btn ghost', 'Clear');
  clear.onclick = () => { state.readText = ''; renderRead(); };
  row.appendChild(clear);
  root.appendChild(row);

  ta.addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { state.readText = ta.value; renderRead(); }
  });

  if (!state.readText || !state.readText.trim()) return;

  const out = el('div', 'read-out');
  const pieces = segment(state.learning, state.readText.trim());
  const wordsBox = el('div', 'words' + (isRTL() ? ' rtl' : ''));
  const readLine = [];
  const readProns = [];
  const glossLine = [];

  pieces.forEach(piece => {
    if (piece.punct) { wordsBox.appendChild(el('div', 'word punct', piece.text)); return; }

    const text = piece.text;
    const pron = pronFor(text);
    const say = sayOf(text, pron);
    const meaning = lookup(state.learning, text, state.speaks);

    const w = el('div', 'word');
    w.appendChild(el('div', 'w-script' + (isRTL() ? ' rtl' : ''), text));
    const sayEl = el('div', 'w-say' + (say.own ? ' own' : ''), say.text || '?');
    w.appendChild(sayEl);
    if (meaning) {
      w.appendChild(el('div', 'w-mean' + (meaning.match === 'near' ? ' near' : ''),
        meaning.meaning + (meaning.match === 'near' ? ' (from ' + meaning.base + ')' : '')));
      glossLine.push(meaning.meaning.split(/[;/]/)[0].trim());
    } else {
      w.appendChild(el('div', 'w-mean unknown', '+ meaning'));
      glossLine.push('…');
    }
    w.title = 'Click to write it your way' + (pron ? '\nSounds: ' + pronToIpa(pron) : '');
    w.onclick = () => {
      playTarget(text, pron);
      openWordDialog({
        script: text, pron: pron,
        translit: (phrasebook(state.learning)[text] || {}).translit || '',
        meaning: meaning ? meaning.meaning : '',
        onSave: () => renderRead()
      });
    };
    wordsBox.appendChild(w);
    readLine.push(say.text || text);
    readProns.push(pron);
  });

  out.appendChild(wordsBox);

  const line = el('div', 'readline' + (isRTL() ? '' : ''), readLine.join('   '));
  out.appendChild(line);
  out.appendChild(el('div', 'gloss-line', 'Roughly: ' + glossLine.join(' · ')));

  const actions = el('div', 'chips');
  actions.style.marginTop = '14px';
  const hearAll = el('button', 'btn', '▶ Hear the whole thing');
  hearAll.onclick = () => {
    const res = Speech.speakSentence(state.readText.trim(), readProns, targetVoice(),
      { preferTag: myVoice(), rate: 0.95 });
    if (res.how === 'fallback') noteFallback(res);
    if (res.how === 'silent') noteSilent();
  };
  actions.appendChild(hearAll);

  const hearMine = el('button', 'btn ghost', '▶ Hear my spelling');
  hearMine.disabled = !canReadMySpelling();
  hearMine.title = hearMine.disabled
    ? 'Reading your own spelling back needs a ' + orthName() + ' voice, and this computer has none.'
    : 'Reads your spelling out loud with a ' + orthName() + ' voice.';
  hearMine.onclick = () => playMine(readLine.filter(t => t && t !== '?').join(', '), 0.95);
  actions.appendChild(hearMine);
  const teachAll = el('button', 'btn ghost', 'Teach me these words');
  teachAll.onclick = () => {
    state.trainer.source = 'read';
    state.trainer.custom = pieces.filter(p => !p.punct).map(p => ({
      script: p.text, pron: pronFor(p.text), translit: '',
      meaning: (lookup(state.learning, p.text, state.speaks) || {}).meaning || ''
    }));
    switchTab('mine');
  };
  actions.appendChild(teachAll);
  out.appendChild(actions);

  root.appendChild(out);
}

/* ---------- My spellings tab ---------------------------------------------- */

function renderMine() {
  const root = $('#tab-mine');
  root.innerHTML = '';

  const lede = el('div', 'lede');
  lede.innerHTML = 'This is your own spelling book for <strong>' + esc(LANGUAGES[state.learning].name)
    + '</strong>, written in <strong>' + esc(orthName()) + '</strong>. Teach it a word once and it '
    + 'uses your spelling everywhere — including on anything you paste into '
    + '<em>Read anything</em>. Change a <em>sound</em> instead and it fixes every word at once.';
  root.appendChild(lede);

  const cols = el('div', 'two-col');
  cols.appendChild(trainerBox());
  const right = el('div');
  right.appendChild(soundBox());
  right.appendChild(backupBox());
  cols.appendChild(right);
  root.appendChild(cols);

  root.appendChild(savedBox());
}

function trainerQueue() {
  const src = state.trainer.source;
  if (src === 'read' && state.trainer.custom) return state.trainer.custom;
  if (src === 'chars') {
    const out = [];
    (LANGUAGES[state.learning].scripts || []).forEach(key => {
      const s = SCRIPTS[key];
      if (!s) return;
      s.groups.forEach(g => g.items.forEach(it => {
        if (it[2]) out.push({ script: it[0], pron: it[2], translit: it[1], meaning: '' });
      }));
    });
    return out;
  }
  return wordsOf(state.learning).map(w => ({
    script: w.script, pron: w.pron, translit: w.translit, meaning: w.meaning
  }));
}

function trainerBox() {
  const box = el('div', 'box');
  box.appendChild(el('h3', null, 'Teach it your spelling'));
  box.appendChild(el('p', 'hint', 'Hear the word, then write it the way it sounds to you. '
    + 'No rules — if "nayce" is how you would write it, write that.'));

  const chips = el('div', 'chips');
  [['words', 'Phrasebook words'], ['chars', 'Script characters'],
   ['read', 'Words from what I pasted']].forEach(([k, label]) => {
    if (k === 'read' && !(state.trainer.custom || []).length) return;
    if (k === 'chars' && !(LANGUAGES[state.learning].scripts || []).length) return;
    const b = el('button', 'chip' + (state.trainer.source === k ? ' is-active' : ''), label);
    b.onclick = () => { state.trainer.source = k; state.trainer.at = 0; renderMine(); };
    chips.appendChild(b);
  });
  box.appendChild(chips);

  const queue = trainerQueue();
  if (!queue.length) { box.appendChild(el('p', 'empty', 'Nothing to practise here yet.')); return box; }

  const at = Math.min(state.trainer.at, queue.length - 1);
  const item = queue[at];
  const saved = MyWords.getWord(state.speaks, state.learning, item.script);
  const guess = item.pron ? respell(item.pron, orth()).text : '';

  const card = el('div', 'trainer-card');
  card.appendChild(el('div', 'script' + (isRTL() ? ' rtl' : ''), item.script));
  if (item.translit) card.appendChild(el('div', 'translit', item.translit));
  if (item.meaning) card.appendChild(el('div', 'meaning', item.meaning));
  box.appendChild(card);

  const hearRow = el('div', 'chips');
  hearRow.style.justifyContent = 'center';
  const h1 = el('button', 'btn', '▶ Hear it');
  h1.onclick = () => playTarget(item.script, item.pron);
  const h2 = el('button', 'btn ghost', 'Slowly');
  h2.onclick = () => playTarget(item.script, item.pron, 0.6);
  hearRow.appendChild(h1); hearRow.appendChild(h2);
  box.appendChild(hearRow);

  const field = el('label', 'field');
  field.appendChild(el('span', null, 'Write it your way — our guess is "' + (guess || '?') + '"'));
  const input = el('input');
  input.value = (saved && saved.spell) || '';
  input.placeholder = guess;
  input.autocomplete = 'off'; input.spellcheck = false;
  field.appendChild(input);
  box.appendChild(field);

  const meanField = el('label', 'field');
  meanField.appendChild(el('span', null, 'What it means to you'));
  const meanInput = el('input');
  meanInput.value = (saved && saved.meaning) || item.meaning || '';
  meanInput.autocomplete = 'off';
  meanField.appendChild(meanInput);
  box.appendChild(meanField);

  const commit = (step) => {
    const spell = input.value.trim(), meaning = meanInput.value.trim();
    if (spell || meaning) {
      MyWords.setWord(state.speaks, state.learning, item.script, {
        spell, meaning, pron: item.pron || '', translit: item.translit || ''
      });
    }
    state.trainer.at = Math.max(0, Math.min(queue.length - 1, at + step));
    refreshCount();
    renderMine();
  };
  input.addEventListener('keydown', e => { if (e.key === 'Enter') commit(1); });

  const row = el('div', 'chips');
  const back = el('button', 'btn ghost', '← Back');
  back.disabled = at === 0;
  back.onclick = () => { state.trainer.at = at - 1; renderMine(); };
  const skip = el('button', 'btn ghost', 'Skip');
  skip.onclick = () => { state.trainer.at = at + 1; renderMine(); };
  const save = el('button', 'btn primary', 'Save & next →');
  save.onclick = () => commit(1);
  row.appendChild(back); row.appendChild(skip); row.appendChild(save);
  box.appendChild(row);

  const done = queue.filter(q => {
    const s = MyWords.getWord(state.speaks, state.learning, q.script);
    return s && s.spell;
  }).length;
  box.appendChild(el('p', 'trainer-progress',
    'Word ' + (at + 1) + ' of ' + queue.length + ' · you have written ' + done + ' of them yourself'));
  return box;
}

function soundBox() {
  const box = el('div', 'box');
  box.appendChild(el('h3', null, 'Change a sound everywhere'));
  box.appendChild(el('p', 'hint', 'These are the letters we use for each sound when writing in '
    + orthName() + '. Overwrite any of them and every word in the app follows your choice.'));

  const mine = MyWords.getSounds(state.speaks);
  const table = el('table', 'sound-table');
  const head = el('tr');
  ['Sound', 'Ours', 'Yours'].forEach(h => head.appendChild(el('th', null, h)));
  table.appendChild(head);

  const shown = ['a', 'e', 'E', 'i', 'o', 'O', 'u', '@', 'ai', 'ei', 'au', 'ou', 'y', '2',
                 'S', 'Z', 'tS', 'dZ', 'ts', 'x', 'T', 'D', 'N', 'J', 'r', 'R', 'w', 'j', 'h', 'z', 'v'];
  const base = ORTHOGRAPHIES[state.speaks] || ORTHOGRAPHIES.en;
  shown.forEach(tok => {
    const info = PHON_INFO[tok];
    const tr = el('tr');
    const first = el('td');
    first.appendChild(el('span', 'ipa', info.ipa));
    first.appendChild(document.createTextNode(' ' + (info.hint || '')));
    tr.appendChild(first);
    tr.appendChild(el('td', 'def', spellToken(tok, base) || '–'));
    const td = el('td');
    const input = el('input');
    input.value = mine[tok] || '';
    input.placeholder = spellToken(tok, base);
    input.onchange = () => {
      MyWords.setSound(state.speaks, tok, input.value.trim());
      render();
    };
    td.appendChild(input);
    tr.appendChild(td);
    table.appendChild(tr);
  });
  box.appendChild(table);

  const reset = el('button', 'btn ghost small', 'Put every sound back');
  reset.style.marginTop = '12px';
  reset.onclick = () => { MyWords.clearSounds(state.speaks); render(); };
  box.appendChild(reset);
  return box;
}

function backupBox() {
  const box = el('div', 'box');
  box.style.marginTop = '20px';
  box.appendChild(el('h3', null, 'Back up your spellings'));
  const s = MyWords.stats();
  box.appendChild(el('p', 'hint', 'You have written ' + s.words + ' word'
    + (s.words === 1 ? '' : 's') + ' and changed ' + s.sounds + ' sound'
    + (s.sounds === 1 ? '' : 's') + '. They live in this browser only — download a copy to keep them safe.'));

  const row = el('div', 'chips');
  const dl = el('button', 'btn', 'Download a copy');
  dl.onclick = () => {
    const blob = new Blob([MyWords.exportJSON()], { type: 'application/json' });
    const a = el('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'my-spellings.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  row.appendChild(dl);

  const up = el('button', 'btn ghost', 'Load a copy');
  const file = el('input');
  file.type = 'file'; file.accept = 'application/json'; file.style.display = 'none';
  file.onchange = () => {
    const f = file.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        MyWords.importJSON(reader.result, true);
        refreshCount(); render();
      } catch (e) {
        alert('That file could not be read: ' + e.message);
      }
    };
    reader.readAsText(f);
  };
  up.onclick = () => file.click();
  row.appendChild(up); row.appendChild(file);
  box.appendChild(row);
  return box;
}

function savedBox() {
  const box = el('div', 'box');
  box.style.marginTop = '20px';
  const rows = MyWords.allWords(state.speaks, state.learning);
  box.appendChild(el('h3', null, 'Everything you have written (' + rows.length + ')'));

  if (!rows.length) {
    box.appendChild(el('p', 'empty', 'Nothing yet. Use the trainer above, or tap '
      + '"make it mine" on any word in the Learn tab.'));
    return box;
  }

  const list = el('div', 'saved-list');
  rows.forEach(r => {
    const row = el('div', 'saved-row');
    row.appendChild(el('div', 's-script' + (isRTL() ? ' rtl' : ''), r.word));
    const mid = el('div');
    mid.appendChild(el('div', 's-spell', r.spell || '—'));
    if (r.meaning) mid.appendChild(el('div', 's-mean', r.meaning));
    row.appendChild(mid);
    row.appendChild(el('div', 'spacer'));
    const play = el('button', 'btn small ghost', '▶');
    play.onclick = () => playTarget(r.word, r.pron);
    row.appendChild(play);
    const edit = el('button', 'btn small ghost', 'Edit');
    edit.onclick = () => openWordDialog({
      script: r.word, pron: r.pron, translit: r.translit, meaning: r.meaning
    });
    row.appendChild(edit);
    list.appendChild(row);
  });
  box.appendChild(list);
  return box;
}

/* ---------- Practice tab --------------------------------------------------- */

const QUIZ_MODES = {
  hear: 'Hear it → pick the writing',
  read: 'See the writing → pick the meaning',
  spell: 'See your spelling → pick the writing'
};

function renderPractice() {
  const root = $('#tab-practice');
  root.innerHTML = '';

  const chips = el('div', 'chips');
  Object.keys(QUIZ_MODES).forEach(k => {
    const b = el('button', 'chip' + (state.quiz.mode === k ? ' is-active' : ''), QUIZ_MODES[k]);
    b.onclick = () => { state.quiz.mode = k; state.quiz.q = null; state.quiz.asked = 0; state.quiz.right = 0; renderPractice(); };
    chips.appendChild(b);
  });
  root.appendChild(chips);

  const pool = wordsOf(state.learning);
  if (pool.length < 4) { root.appendChild(el('p', 'empty', 'Not enough words to practise with.')); return; }
  if (!state.quiz.q) state.quiz.q = makeQuestion(pool);

  const q = state.quiz.q;
  const quiz = el('div', 'quiz');
  const card = el('div', 'quiz-q');

  if (state.quiz.mode === 'hear') {
    const play = el('button', 'btn primary', '▶ Play the word again');
    play.onclick = () => playTarget(q.answer.script, q.answer.pron);
    card.appendChild(play);
    card.appendChild(el('p', 'wd-meta', 'Which one did you hear?'));
    if (!q.played) { q.played = true; setTimeout(play.onclick, 260); }
  } else if (state.quiz.mode === 'read') {
    card.appendChild(el('div', 'big' + (isRTL() ? ' rtl' : ''), q.answer.script));
    card.appendChild(el('div', 'say', sayOf(q.answer.script, q.answer.pron).text));
  } else {
    card.appendChild(el('div', 'say', sayOf(q.answer.script, q.answer.pron).text));
    card.appendChild(el('p', 'wd-meta', 'Which writing says that?'));
  }
  quiz.appendChild(card);

  const opts = el('div', 'quiz-options');
  q.options.forEach(o => {
    const b = el('button', 'opt' + (isRTL() && state.quiz.mode !== 'read' ? ' rtl' : ''),
      state.quiz.mode === 'read' ? o.meaning : o.script);
    b.onclick = () => {
      if (q.done) return;
      q.done = true;
      state.quiz.asked++;
      const correct = o.id === q.answer.id;
      if (correct) state.quiz.right++;
      $$('.opt', opts).forEach((node, i) => {
        if (q.options[i].id === q.answer.id) node.classList.add('right');
        else if (q.options[i].id === o.id) node.classList.add('wrong');
      });
      playTarget(q.answer.script, q.answer.pron);
      setTimeout(() => { state.quiz.q = makeQuestion(pool); renderPractice(); }, correct ? 750 : 1500);
    };
    opts.appendChild(b);
  });
  quiz.appendChild(opts);

  quiz.appendChild(el('div', 'scoreline',
    state.quiz.asked ? state.quiz.right + ' right out of ' + state.quiz.asked : 'Pick an answer to begin.'));
  root.appendChild(quiz);
}

function makeQuestion(pool) {
  const shuffled = pool.slice().sort(() => Math.random() - 0.5);
  const answer = shuffled[0];
  const options = shuffled.slice(0, 4).sort(() => Math.random() - 0.5);
  return { answer, options, done: false, played: false };
}

/* ---------- shell ---------------------------------------------------------- */

function switchTab(tab) {
  state.tab = tab;
  $$('.tab').forEach(b => b.classList.toggle('is-active', b.dataset.tab === tab));
  $$('.panel').forEach(p => p.classList.toggle('is-active', p.id === 'tab-' + tab));
  render();
}

function refreshCount() {
  $('#mine-count').textContent = MyWords.countWords(state.speaks, state.learning);
}

function render() {
  refreshCount();
  updateVoiceStatus();
  ({ learn: renderLearn, write: renderWrite, read: renderRead,
     mine: renderMine, practice: renderPractice })[state.tab]();
}

function init() {
  const speaks = $('#speaks');
  ORTHOGRAPHY_ORDER.forEach(code => {
    const o = ORTHOGRAPHIES[code];
    const opt = el('option', null, o.flag + '  ' + o.name + (o.native !== o.name ? ' — ' + o.native : ''));
    opt.value = code;
    speaks.appendChild(opt);
  });
  speaks.value = ORTHOGRAPHIES[state.speaks] ? state.speaks : 'ht';
  state.speaks = speaks.value;
  speaks.onchange = () => {
    state.speaks = speaks.value;
    MyWords.setPref('speaks', state.speaks);
    render();
  };

  const learning = $('#learning');
  LANGUAGE_ORDER.forEach(code => {
    const l = LANGUAGES[code];
    const opt = el('option', null, l.flag + '  ' + l.name + ' — ' + l.native);
    opt.value = code;
    learning.appendChild(opt);
  });
  learning.value = LANGUAGES[state.learning] ? state.learning : 'ja';
  state.learning = learning.value;
  learning.onchange = () => {
    state.learning = learning.value;
    MyWords.setPref('learning', state.learning);
    state.script = null; state.char = null; state.category = 'all';
    state.trainer = { queue: [], at: 0, source: 'words' };
    state.quiz = { mode: state.quiz.mode, q: null, asked: 0, right: 0 };
    state.readText = '';
    render();
  };

  $$('.tab').forEach(b => { b.onclick = () => switchTab(b.dataset.tab); });
  $('#voice-status').onclick = () => { Speech.cancel(); updateVoiceStatus(); };
  Speech.onVoices(() => updateVoiceStatus());

  wireDialog();
  render();
}

document.addEventListener('DOMContentLoaded', init);
