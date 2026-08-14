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

  /* Strip the marks that help a person read but derail a speech engine. The
   * capitals matter most: plenty of engines read an all-caps syllable as an
   * abbreviation and spell it out letter by letter. */
  function speakable(text) {
    return text
      .toLowerCase()
      .replace(/[-–—]/g, ' ')       // syllable dashes become little pauses
      .replace(/['ʼ`ː:?!]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
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

  return { supported, voiceFor, hasVoiceFor, readerFor, speak, speakWord, speakSentence, speakOwn,
           speakable, cancel, onVoices, get list() { return voices; } };
})();
