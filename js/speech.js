/* speech.js — reading things out loud, sensibly.
 *
 * A word is spoken by a real voice for its language whenever one is installed.
 * When one is not, we do NOT read the on-screen respelling aloud: that spelling
 * was written for the user's eyes, and handing "kòn-ni-tchi-wa" to an English
 * voice produces nonsense. Instead the *sounds* are respelled a second time,
 * for the language of whichever voice is actually going to read them, and that
 * is what gets spoken.
 *
 * So callers pass a pronunciation, never a pre-spelled string, and a word with
 * no known pronunciation stays silent rather than being guessed at.
 */

const Speech = (function () {
  let voices = [];
  const listeners = [];

  function refresh() {
    voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    listeners.forEach(fn => fn(voices));
  }
  if (window.speechSynthesis) {
    refresh();
    window.speechSynthesis.onvoiceschanged = refresh;
    /* Chrome sometimes fills the list a beat late */
    setTimeout(refresh, 250);
    setTimeout(refresh, 1200);
  }

  function supported() { return !!window.speechSynthesis; }

  /* A voice the user picked by hand for a given language, by voice name. */
  let chosen = {};
  function setChosen(map) { chosen = map || {}; }

  const langBase = (t) => String(t || '').toLowerCase().split(/[-_]/)[0];

  /**
   * How good a voice is for a tag. Anything at all beats nothing, but an exact
   * regional match beats a cousin, and the neural voices ("Natural", Google's)
   * beat the old robotic ones by a wide margin — which is the whole difference
   * between "sounds like a native speaker" and "sounds like a 1998 satnav".
   */
  function scoreVoice(v, tag) {
    const want = String(tag || '').toLowerCase().replace('_', '-');
    const have = v.lang.toLowerCase().replace('_', '-');
    if (langBase(have) !== langBase(want)) return -1;

    let score = have === want ? 100 : 50;
    const name = v.name.toLowerCase();
    if (/natural|neural/.test(name)) score += 30;
    if (/google/.test(name)) score += 22;
    if (/online/.test(name)) score += 14;
    if (v.localService === false) score += 8;
    if (v.default) score += 3;
    return score;
  }

  /** Every installed voice that can speak this language, best first. */
  function voicesFor(tag) {
    return voices
      .map(v => ({ v: v, s: scoreVoice(v, tag) }))
      .filter(x => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map(x => x.v);
  }

  /** Best voice for a tag — the user's pick for that language if they made one. */
  function voiceFor(tag) {
    if (!tag || !voices.length) return null;
    const list = voicesFor(tag);
    if (!list.length) return null;
    const pick = chosen[langBase(tag)];
    return (pick && list.find(v => v.name === pick)) || list[0];
  }

  function hasVoiceFor(tag) { return !!voiceFor(tag); }

  /** Which of a set of languages this computer can actually speak. */
  function coverage(tags) {
    const out = {};
    Object.keys(tags).forEach(k => {
      const list = voicesFor(tags[k]);
      out[k] = { count: list.length, best: list[0] || null };
    });
    return out;
  }

  function cancel() { if (window.speechSynthesis) window.speechSynthesis.cancel(); }

  function speak(text, tag, opts) {
    opts = opts || {};
    if (!supported() || !text) return false;
    cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = voiceFor(tag);
    if (v) { u.voice = v; u.lang = v.lang; }
    else if (tag) u.lang = tag;
    u.rate = opts.rate || 1;
    u.pitch = opts.pitch || 1;
    if (opts.onend) u.onend = opts.onend;
    window.speechSynthesis.speak(u);
    return true;
  }

  /* Which of our spelling systems a voice can actually read out loud. A voice
   * only says sensible things when it is fed spelling from its own language:
   * handing "kòn-ni-tchi-wa" to an English voice is how you get nonsense. */
  const VOICE_ORTH = {
    en: 'en', fr: 'fr', ht: 'ht', es: 'es', pt: 'pt', it: 'it', de: 'de',
    id: 'id', ms: 'id', sw: 'sw', tl: 'tl', fil: 'tl', vi: 'vi'
  };

  /** The voice we will read a respelling with, and the spelling it can read. */
  function readerFor(preferredTag) {
    const tryTags = [preferredTag, 'en-US', 'en-GB'];
    for (const tag of tryTags) {
      const v = voiceFor(tag);
      if (v) {
        const orth = VOICE_ORTH[v.lang.toLowerCase().split(/[-_]/)[0]];
        if (orth) return { voice: v, orth: orth };
      }
    }
    /* nothing familiar installed: use any voice whose spelling we know */
    for (const v of voices) {
      const orth = VOICE_ORTH[v.lang.toLowerCase().split(/[-_]/)[0]];
      if (orth) return { voice: v, orth: orth };
    }
    /* truly nothing: the default voice reading English spelling is the least
     * bad guess, since English respelling is the most widely legible */
    return voices.length ? { voice: voices[0], orth: 'en' } : null;
  }

  /* Turn a respelling meant for eyes into something an engine says smoothly.
   *
   * The syllable dashes have to go entirely, not become spaces: a space makes
   * the engine treat every syllable as a separate word and read "ah-ree-gah-toh"
   * as four chopped-up words instead of one flowing one. Capitals go too,
   * because plenty of engines read an all-caps syllable as an abbreviation and
   * spell it out letter by letter. */
  function speakable(text) {
    const clean = text.toLowerCase().replace(/['ʼ`ː:?!]/g, '');

    return clean.split(/\s+/).map(word => {
      const syllables = word.split(/[-–—]/).filter(Boolean);
      return syllables.reduce((acc, syl) => {
        if (!acc) return syl;
        /* Run them together — except where the join would blur two syllables
         * into one, as "ee" + "eh" would. There the break has to stay, because
         * いいえ really is two beats. */
        const collides = acc[acc.length - 1] === syl[0];
        return acc + (collides ? '-' : '') + syl;
      }, '');
    }).join(' ').trim();
  }

  /**
   * Say a word properly if a voice for its language exists; otherwise say the
   * *sounds*, respelled for whichever voice is going to read them.
   * Returns 'target', 'fallback' (with .orth) or 'silent'.
   */
  function speakWord(scriptText, pron, tag, opts) {
    opts = opts || {};
    if (hasVoiceFor(tag)) { speak(scriptText, tag, opts); return { how: 'target' }; }
    if (!pron) return { how: 'silent' };          // nothing to say is better than gibberish

    const reader = readerFor(opts.preferTag);
    if (!reader) return { how: 'silent' };
    const text = respell(pron, ORTHOGRAPHIES[reader.orth]).text;
    speak(speakable(text), reader.voice.lang, opts);
    return { how: 'fallback', orth: reader.orth, voice: reader.voice };
  }

  /** The same, for a run of words: unknown words are skipped, not invented. */
  function speakSentence(scriptText, prons, tag, opts) {
    opts = opts || {};
    if (hasVoiceFor(tag)) { speak(scriptText, tag, opts); return { how: 'target' }; }

    const known = prons.filter(Boolean);
    if (!known.length) return { how: 'silent' };
    const reader = readerFor(opts.preferTag);
    if (!reader) return { how: 'silent' };

    const text = known.map(p => speakable(respell(p, ORTHOGRAPHIES[reader.orth]).text)).join(', ');
    speak(text, reader.voice.lang, opts);
    return { how: 'fallback', orth: reader.orth, voice: reader.voice, skipped: prons.length - known.length };
  }

  /** Read text the user wrote themselves, in a voice for their own language. */
  function speakOwn(text, tag, opts) {
    return speak(speakable(text), tag, opts);
  }

  function onVoices(fn) { listeners.push(fn); if (voices.length) fn(voices); }

  return { supported, voiceFor, hasVoiceFor, voicesFor, coverage, setChosen, readerFor,
           speak, speakWord, speakSentence, speakOwn, speakable, cancel, onVoices,
           get list() { return voices; } };
})();
