/* speech.js — reading things out loud.
 *
 * Two ways to hear a word:
 *   speakTarget()  the real language, in a real voice for it (if installed)
 *   speakOwn()     the respelling, read by a voice for the language you speak
 *
 * The second one is the fallback that makes this work on a machine with no
 * Japanese or Arabic voice: your own language's voice reading "a-ri-GA-to"
 * lands surprisingly close.
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

  /** Best voice for a BCP-47 tag, matching the base language if need be. */
  function voiceFor(tag) {
    if (!tag || !voices.length) return null;
    const want = tag.toLowerCase();
    const base = want.split('-')[0];
    return voices.find(v => v.lang.toLowerCase() === want)
        || voices.find(v => v.lang.toLowerCase().replace('_', '-') === want)
        || voices.find(v => v.lang.toLowerCase().split(/[-_]/)[0] === base)
        || null;
  }

  function hasVoiceFor(tag) { return !!voiceFor(tag); }

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

  /** Say it in the target language; fall back to the respelling if we must. */
  function speakTarget(text, tag, fallbackText, fallbackTag, opts) {
    if (hasVoiceFor(tag)) return speak(text, tag, opts) && 'target';
    if (fallbackText) { speak(fallbackText, fallbackTag, opts); return 'fallback'; }
    speak(text, tag, opts);
    return 'guess';
  }

  function speakOwn(text, tag, opts) {
    /* hyphens read as pauses in most engines, which is exactly what we want */
    return speak(text.replace(/-/g, ' '), tag, opts);
  }

  function onVoices(fn) { listeners.push(fn); if (voices.length) fn(voices); }

  return { supported, voiceFor, hasVoiceFor, speak, speakTarget, speakOwn, cancel, onVoices,
           get list() { return voices; } };
})();
