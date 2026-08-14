/* recordings.js — real human voices, from the audio/ folder.
 *
 * Synthesised speech is a stand-in. A recording of an actual native speaker
 * saying the word is the real thing, and no amount of respelling beats it.
 *
 * tools/get-recordings.py fills audio/ with clips from Wikimedia Commons —
 * mostly Lingua Libre, where volunteers record their own language word by word
 * — and writes an index next to them. If the folder is not there, nothing here
 * does anything and the app falls back to speech as before.
 *
 * The index is loaded two ways so that it works however the page is opened:
 * audio/index.js sets a global (fine over file://), and audio/index.json is
 * fetched as a fallback (needed when the folder was filled after load).
 */

const Recordings = (function () {
  let index = null;          // { lang: { word: filename } }
  let source = {};           // { lang: { word: 'human' | 'made' } }
  let ready = false;
  const listeners = [];

  function announce() { listeners.forEach(fn => fn()); }

  function adopt(data, sources) {
    if (!data) return;
    index = {};
    Object.keys(data).forEach(k => { if (k[0] !== '_') index[k] = data[k]; });
    source = sources || data._source || {};
    ready = true;
    announce();
  }

  /**
   * 'human' — a recording of a person saying the word.
   * 'made'  — generated on this computer by Piper.
   * The difference matters: a synthetic clip must never be presented as a
   * native speaker.
   */
  function sourceOf(lang, word) {
    return (source[lang] && source[lang][word]) || 'human';
  }

  function load() {
    if (window.RECORDINGS) { adopt(window.RECORDINGS, window.RECORDINGS_SOURCE); return; }
    fetch('audio/index.json')
      .then(r => (r.ok ? r.json() : null))
      .then(adopt)
      .catch(() => { ready = true; announce(); });     // no folder: that is fine
  }

  function has(lang, word) {
    return !!(index && index[lang] && index[lang][word]);
  }

  function urlFor(lang, word) {
    if (!has(lang, word)) return null;
    return 'audio/' + encodeURIComponent(lang) + '/' + encodeURIComponent(index[lang][word]);
  }

  function count(lang) {
    if (!index) return 0;
    if (lang) return Object.keys(index[lang] || {}).length;
    return Object.keys(index).reduce((n, k) => n + Object.keys(index[k]).length, 0);
  }

  function languages() { return index ? Object.keys(index).filter(k => count(k)) : []; }

  let current = null;
  function stop() {
    if (current) { current.pause(); current = null; }
  }

  /**
   * Play the recording for a word. Returns a promise that resolves true when
   * it really played — a clip listed in the index but missing from disk must
   * not swallow the word silently, so failure hands back false and the caller
   * falls through to speech.
   */
  function play(lang, word, opts) {
    opts = opts || {};
    const url = urlFor(lang, word);
    if (!url) return Promise.resolve(false);

    stop();
    const audio = new Audio(url);
    audio.playbackRate = opts.rate && opts.rate < 1 ? Math.max(0.5, opts.rate) : 1;
    current = audio;

    return audio.play()
      .then(() => true)
      .catch(() => false);
  }

  function onReady(fn) { listeners.push(fn); if (ready) fn(); }

  load();
  return { has, urlFor, play, stop, count, languages, sourceOf, onReady,
           get loaded() { return ready; } };
})();
