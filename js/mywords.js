/* mywords.js — the user's own spellings.
 *
 * Two layers, both saved in the browser:
 *
 *   words   "ありがとう, to me, is written arigato-w"  — one word at a time,
 *           exact and personal. Always wins.
 *   sounds  "the sh sound, to me, is written ch"       — a personal tweak to
 *           the orthography, so it changes every word at once.
 *
 * Everything is keyed by the language being learned *and* the language the
 * user writes in, because the same person may spell things differently
 * depending on which of their languages they are leaning on.
 */

const MyWords = (function () {
  const KEY = 'langhelper.mywords.v1';
  const PREF = 'langhelper.prefs.v1';

  let db = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && parsed.words && parsed.sounds) return parsed;
    } catch (e) { /* corrupted or blocked storage — start clean */ }
    return { version: 1, words: {}, sounds: {} };
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(db)); return true; }
    catch (e) { return false; }
  }

  const wordKey = (speaks, learning) => speaks + '>' + learning;

  /* ---------- per-word spellings ---------------------------------------- */

  function bucket(speaks, learning) {
    const k = wordKey(speaks, learning);
    if (!db.words[k]) db.words[k] = {};
    return db.words[k];
  }

  /** entry: { spell, meaning, note, pron, translit, updated } */
  function getWord(speaks, learning, word) {
    const b = db.words[wordKey(speaks, learning)];
    return (b && b[word]) || null;
  }

  function setWord(speaks, learning, word, entry) {
    const b = bucket(speaks, learning);
    b[word] = Object.assign({}, b[word], entry, { updated: Date.now() });
    save();
    return b[word];
  }

  function deleteWord(speaks, learning, word) {
    const b = db.words[wordKey(speaks, learning)];
    if (b && b[word]) { delete b[word]; save(); }
  }

  function allWords(speaks, learning) {
    const b = db.words[wordKey(speaks, learning)] || {};
    return Object.keys(b)
      .map(w => Object.assign({ word: w }, b[w]))
      .sort((a, b2) => (b2.updated || 0) - (a.updated || 0));
  }

  function countWords(speaks, learning) {
    return Object.keys(db.words[wordKey(speaks, learning)] || {}).length;
  }

  /* ---------- per-sound spellings --------------------------------------- */

  function getSounds(speaks) { return db.sounds[speaks] || {}; }

  function setSound(speaks, token, letters) {
    if (!db.sounds[speaks]) db.sounds[speaks] = {};
    if (letters === '' || letters == null) delete db.sounds[speaks][token];
    else db.sounds[speaks][token] = letters;
    save();
  }

  function clearSounds(speaks) { delete db.sounds[speaks]; save(); }

  /**
   * The orthography to actually respell with: the built-in one for the
   * language the user reads, with their own sound choices layered on top.
   */
  function orthographyFor(speaks) {
    const base = ORTHOGRAPHIES[speaks] || ORTHOGRAPHIES.en;
    const mine = getSounds(speaks);
    if (!Object.keys(mine).length) return base;
    return Object.assign({}, base, { map: Object.assign({}, base.map, mine), personal: true });
  }

  /* ---------- preferences ------------------------------------------------ */

  function prefs() {
    try { return JSON.parse(localStorage.getItem(PREF)) || {}; } catch (e) { return {}; }
  }
  function setPref(k, v) {
    const p = prefs(); p[k] = v;
    try { localStorage.setItem(PREF, JSON.stringify(p)); } catch (e) { /* ignore */ }
  }

  /* ---------- moving it between machines --------------------------------- */

  function exportJSON() { return JSON.stringify(db, null, 2); }

  function importJSON(text, merge) {
    const incoming = JSON.parse(text);
    if (!incoming || !incoming.words) throw new Error('That file is not a spelling book.');
    if (!merge) { db = { version: 1, words: incoming.words, sounds: incoming.sounds || {} }; }
    else {
      Object.keys(incoming.words).forEach(k => {
        db.words[k] = Object.assign({}, db.words[k], incoming.words[k]);
      });
      Object.keys(incoming.sounds || {}).forEach(k => {
        db.sounds[k] = Object.assign({}, db.sounds[k], incoming.sounds[k]);
      });
    }
    save();
    return true;
  }

  function stats() {
    let words = 0;
    Object.values(db.words).forEach(b => { words += Object.keys(b).length; });
    let sounds = 0;
    Object.values(db.sounds).forEach(b => { sounds += Object.keys(b).length; });
    return { words, sounds };
  }

  return {
    getWord, setWord, deleteWord, allWords, countWords,
    getSounds, setSound, clearSounds, orthographyFor,
    prefs, setPref, exportJSON, importJSON, stats
  };
})();
