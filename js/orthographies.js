/* orthographies.js — "how do *I* already spell that sound?"
 *
 * One entry per language the user might speak. Each `map` turns a phoneme
 * token into letters that someone literate in that language will read
 * correctly on the first try. Missing tokens are derived by sound.js, so a
 * map only needs the sounds where it differs from the obvious.
 *
 *   capsStress   uppercase the stressed syllable (default true)
 *   longVowel    'same' | 'double' | 'repeatLast'  (default 'same')
 *   syllable(s)  hook run on each finished syllable
 *   fixups       regex cleanups per syllable
 *   finalFixups  regex cleanups on the run-together form
 */

const ORTHOGRAPHIES = {

  /* ------------------------------------------------------------------ */
  en: {
    name: 'English',
    native: 'English',
    flag: '🇺🇸',
    note: 'Classic dictionary-style respelling: sh, ch, oo, ay.',
    map: {
      a: 'ah', 'a:': 'ah', e: 'eh', 'e:': 'ay', E: 'eh', i: 'ee', 'i:': 'ee',
      I: 'ih', o: 'oh', 'o:': 'oh', O: 'aw', u: 'oo', 'u:': 'oo', U: 'uu',
      '@': 'uh', y: 'ew', 2: 'ur',
      ai: 'eye', ei: 'ay', oi: 'oy', au: 'ow', ou: 'oh',
      aN: 'ahn', eN: 'ehn', oN: 'ohn', uN: 'oon', iN: 'een',
      p: 'p', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', q: 'k', "'": "'",
      3: "'", H: 'h', f: 'f', v: 'v', T: 'th', D: 'th', s: 's', z: 'z',
      S: 'sh', Z: 'zh', x: 'kh', G: 'gh', h: 'h', m: 'm', n: 'n', N: 'ng',
      J: 'ny', l: 'l', r: 'r', R: 'r', w: 'w', j: 'y',
      ts: 'ts', dz: 'dz', tS: 'ch', dZ: 'j'
    },
    fixups: [
      [/eeee/g, 'ee'], [/ahah/g, 'ah'],
      [/eye(?=[bcdfghjklmnpqrstvwxz])/g, 'y'],
      [/^([^aeiou]*)y([bcdfgklmnprstvz])$/, '$1y$2e']
    ]
  },

  /* ------------------------------------------------------------------ */
  ht: {
    aspirate: 'drop',
    name: 'Haitian Creole',
    native: 'Kreyòl Ayisyen',
    flag: '🇭🇹',
    note: 'Kreyòl spelling is one letter per sound, so respellings here are '
        + 'unusually exact. "ou" = oo, "è" = open eh, "ò" = aw, "j" = zh.',
    map: {
      a: 'a', e: 'e', E: 'è', i: 'i', I: 'i', o: 'o', O: 'ò', u: 'ou',
      U: 'ou', '@': 'e', y: 'i', 2: 'e',
      ai: 'ay', ei: 'ey', oi: 'oy', au: 'aw', ou: 'ow',
      aN: 'an', eN: 'en', oN: 'on', uN: 'oun', iN: 'in',
      p: 'p', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', q: 'k', "'": '',
      3: '', H: 'h', f: 'f', v: 'v', T: 't', D: 'd', s: 's', z: 'z',
      S: 'ch', Z: 'j', x: 'h', G: 'g', h: 'h', m: 'm', n: 'n', N: 'ng',
      J: 'ny', l: 'l', r: 'r', R: 'r', w: 'w', j: 'y',
      ts: 'ts', dz: 'dz', tS: 'tch', dZ: 'dj'
    },
    /* In Kreyòl a vowel followed by n inside a syllable *is* the nasal vowel:
     * "an" is nasal, "àn" is ah plus a real n. So whenever the sounds really
     * are vowel + consonant n, the grave accent has to break the pair apart
     * or a Kreyòl reader will nasalise it by mistake.
     *
     * Sounds that are genuinely nasal vowels (Japanese さん, French bon) are
     * written with the nasal tokens aN/eN/oN in the data, never as a + n, so
     * they never reach this rule. */
    syllable: function (s, tokens) {
      const vi = tokens.findIndex(t => t === 'a' || t === 'o');
      if (vi === -1) return s;
      const next = tokens[vi + 1];
      if (next !== 'n' && next !== 'm') return s;
      return s.replace(/a(?=[nm])/, 'à').replace(/o(?=[nm])/, 'ò');
    }
  },

  /* ------------------------------------------------------------------ */
  es: {
    aspirate: 'drop',
    name: 'Spanish',
    native: 'Español',
    flag: '🇪🇸',
    note: 'Read every letter the Spanish way. "j" is the throaty h, "sh" is '
        + 'borrowed (Spanish has no native sh sound).',
    map: {
      a: 'a', e: 'e', E: 'e', i: 'i', I: 'i', o: 'o', O: 'o', u: 'u', U: 'u',
      '@': 'a', y: 'iu', 2: 'e',
      ai: 'ai', ei: 'ei', oi: 'oi', au: 'au', ou: 'ou',
      p: 'p', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', q: 'k', "'": '',
      3: '', H: 'j', f: 'f', v: 'v', T: 'z', D: 'd', s: 's', z: 's',
      S: 'sh', Z: 'sh', x: 'j', G: 'g', h: 'j', m: 'm', n: 'n', N: 'ng',
      J: 'ñ', l: 'l', r: 'r', R: 'rr', w: 'u', j: 'y',
      ts: 'ts', dz: 'ds', tS: 'ch', dZ: 'y'
    },
    fixups: [
      [/k(?=[ei])/g, 'qu'], [/g(?=[ei])/g, 'gu'],
      [/^rr/, 'r'], [/^w/, 'hu'], [/qu(?=[^ei])/g, 'cu']
    ]
  },

  /* ------------------------------------------------------------------ */
  fr: {
    aspirate: 'drop',
    name: 'French',
    native: 'Français',
    flag: '🇫🇷',
    note: 'French spelling conventions: "ou" = oo, "u" = the tight u, '
        + '"ch" = sh, "j" = zh, "gn" = ny.',
    map: {
      a: 'a', e: 'é', E: 'è', i: 'i', I: 'i', o: 'o', O: 'o', u: 'ou',
      U: 'ou', '@': 'e', y: 'u', 2: 'eu',
      ai: 'aï', ei: 'éï', oi: 'oï', au: 'aou', ou: 'o',
      aN: 'an', eN: 'in', oN: 'on', uN: 'oun', iN: 'in',
      p: 'p', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', q: 'k', "'": '',
      3: '', H: 'h', f: 'f', v: 'v', T: 's', D: 'z', s: 'ss', z: 'z',
      S: 'ch', Z: 'j', x: 'kh', G: 'g', h: 'h', m: 'm', n: 'n', N: 'ng',
      J: 'gn', l: 'l', r: 'r', R: 'r', w: 'ou', j: 'y',
      ts: 'ts', dz: 'dz', tS: 'tch', dZ: 'dj'
    },
    fixups: [[/^ss/, 's'], [/g(?=[ei])/g, 'gu'], [/ouou/g, 'ou']]
  },

  /* ------------------------------------------------------------------ */
  pt: {
    aspirate: 'drop',
    name: 'Portuguese',
    native: 'Português',
    flag: '🇧🇷',
    note: 'Brazilian conventions: "ch" = sh, "j" = zh, "nh" = ny, "rr" = the '
        + 'breathy h, "ã/õ" = nasal.',
    map: {
      a: 'a', e: 'e', E: 'é', i: 'i', I: 'i', o: 'o', O: 'ó', u: 'u', U: 'u',
      '@': 'e', y: 'u', 2: 'eu',
      ai: 'ai', ei: 'ei', oi: 'oi', au: 'au', ou: 'ou',
      aN: 'ã', eN: 'em', oN: 'õ', uN: 'um', iN: 'im',
      p: 'p', b: 'b', t: 't', d: 'd', k: 'c', g: 'g', q: 'c', "'": '',
      3: '', H: 'rr', f: 'f', v: 'v', T: 's', D: 'd', s: 'ss', z: 'z',
      S: 'ch', Z: 'j', x: 'rr', G: 'g', h: 'rr', m: 'm', n: 'n', N: 'ng',
      J: 'nh', l: 'l', r: 'r', R: 'rr', w: 'u', j: 'i',
      ts: 'ts', dz: 'dz', tS: 'tch', dZ: 'dj'
    },
    fixups: [
      [/c(?=[ei])/g, 'qu'], [/g(?=[ei])/g, 'gu'],
      [/^ss/, 's'], [/^rr/, 'r']
    ]
  },

  /* ------------------------------------------------------------------ */
  it: {
    aspirate: 'drop',
    name: 'Italian',
    native: 'Italiano',
    flag: '🇮🇹',
    note: 'Italian conventions: "c" before e/i = ch, "gh/ch" keep the hard '
        + 'sound, "gn" = ny, "sc" before e/i = sh.',
    map: {
      a: 'a', e: 'e', E: 'e', i: 'i', I: 'i', o: 'o', O: 'o', u: 'u', U: 'u',
      '@': 'a', y: 'u', 2: 'e',
      ai: 'ai', ei: 'ei', oi: 'oi', au: 'au', ou: 'ou',
      p: 'p', b: 'b', t: 't', d: 'd', k: 'c', g: 'g', q: 'c', "'": '',
      3: '', H: 'h', f: 'f', v: 'v', T: 's', D: 'd', s: 's', z: 's',
      S: 'sc', Z: 'g', x: 'ch', G: 'gh', h: 'h', m: 'm', n: 'n', N: 'ng',
      J: 'gn', l: 'l', r: 'r', R: 'rr', w: 'u', j: 'i',
      ts: 'z', dz: 'z', tS: 'c', dZ: 'g'
    },
    fixups: [
      [/c(?=[^eiaou]|$)/g, 'ch'],            /* keep k sound before a gap  */
      [/sc(?![ei])/g, 'sci'],
      [/^([cg])(?=[aou])/, '$1i']
    ]
  },

  /* ------------------------------------------------------------------ */
  de: {
    name: 'German',
    native: 'Deutsch',
    flag: '🇩🇪',
    note: 'German conventions: "sch" = sh, "z" = ts, "w" = v, "ch" = the '
        + 'scrapey h, "ei" = eye, "eu" = oy.',
    map: {
      a: 'a', e: 'e', E: 'ä', i: 'i', 'i:': 'ie', I: 'i', o: 'o', O: 'o',
      u: 'u', U: 'u', '@': 'e', y: 'ü', 2: 'ö',
      ai: 'ei', ei: 'eh', oi: 'eu', au: 'au', ou: 'oh',
      p: 'p', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', q: 'k', "'": '',
      3: '', H: 'h', f: 'f', v: 'w', T: 'th', D: 'd', s: 'ss', z: 's',
      S: 'sch', Z: 'j', x: 'ch', G: 'g', h: 'h', m: 'm', n: 'n', N: 'ng',
      J: 'nj', l: 'l', r: 'r', R: 'r', w: 'u', j: 'j',
      ts: 'z', dz: 'ds', tS: 'tsch', dZ: 'dsch'
    },
    fixups: [[/^ss/, 's']]
  },

  /* ------------------------------------------------------------------ */
  tl: {
    aspirate: 'drop',
    name: 'Tagalog / Filipino',
    native: 'Tagalog',
    flag: '🇵🇭',
    note: 'Filipino spelling is close to one letter per sound. "ng" is a '
        + 'single letter you already say at the start of words.',
    map: {
      a: 'a', e: 'e', E: 'e', i: 'i', I: 'i', o: 'o', O: 'o', u: 'u', U: 'u',
      '@': 'a', y: 'yu', 2: 'e',
      ai: 'ay', ei: 'ey', oi: 'oy', au: 'aw', ou: 'ow',
      p: 'p', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', q: 'k', "'": '-',
      3: '', H: 'h', f: 'f', v: 'v', T: 't', D: 'd', s: 's', z: 's',
      S: 'sh', Z: 'sy', x: 'kh', G: 'g', h: 'h', m: 'm', n: 'n', N: 'ng',
      J: 'ny', l: 'l', r: 'r', R: 'r', w: 'w', j: 'y',
      ts: 'ts', dz: 'ds', tS: 'ts', dZ: 'dy'
    },
    longVowel: 'double'
  },

  /* ------------------------------------------------------------------ */
  id: {
    name: 'Indonesian / Malay',
    native: 'Bahasa Indonesia',
    flag: '🇮🇩',
    note: 'Indonesian conventions: "sy" = sh, "c" = ch, "j" = j, "ny" = ny, '
        + '"kh" = the scrapey h. Plain "e" is the lazy vowel; "é" is sharp.',
    map: {
      a: 'a', e: 'é', E: 'é', i: 'i', I: 'i', o: 'o', O: 'o', u: 'u', U: 'u',
      '@': 'e', y: 'u', 2: 'e',
      ai: 'ai', ei: 'ei', oi: 'oi', au: 'au', ou: 'ou',
      p: 'p', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', q: 'k', "'": 'k',
      3: '', H: 'h', f: 'f', v: 'v', T: 't', D: 'd', s: 's', z: 'z',
      S: 'sy', Z: 'zy', x: 'kh', G: 'gh', h: 'h', m: 'm', n: 'n', N: 'ng',
      J: 'ny', l: 'l', r: 'r', R: 'r', w: 'w', j: 'y',
      ts: 'ts', dz: 'dz', tS: 'c', dZ: 'j'
    },
    longVowel: 'double'
  },

  /* ------------------------------------------------------------------ */
  sw: {
    name: 'Swahili',
    native: 'Kiswahili',
    flag: '🇰🇪',
    note: 'Swahili spelling is one sound per letter: "ch", "sh", "ny", '
        + '"ng\'" and "dh/th" all say exactly what they look like.',
    map: {
      a: 'a', e: 'e', E: 'e', i: 'i', I: 'i', o: 'o', O: 'o', u: 'u', U: 'u',
      '@': 'a', y: 'u', 2: 'e',
      ai: 'ai', ei: 'ei', oi: 'oi', au: 'au', ou: 'ou',
      p: 'p', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', q: 'k', "'": '',
      3: '', H: 'h', f: 'f', v: 'v', T: 'th', D: 'dh', s: 's', z: 'z',
      S: 'sh', Z: 'zh', x: 'kh', G: 'gh', h: 'h', m: 'm', n: 'n', N: "ng'",
      J: 'ny', l: 'l', r: 'r', R: 'r', w: 'w', j: 'y',
      ts: 'ts', dz: 'dz', tS: 'ch', dZ: 'j'
    },
    longVowel: 'double'
  },

  /* ------------------------------------------------------------------ */
  vi: {
    aspirate: 'drop',
    name: 'Vietnamese',
    native: 'Tiếng Việt',
    flag: '🇻🇳',
    note: 'Vietnamese conventions: "ê" = eh, "ơ" = the lazy vowel, "d/gi" = '
        + 'y, "kh" = scrapey h, "ng/nh" = the nasal endings.',
    map: {
      a: 'a', e: 'ê', E: 'e', i: 'i', I: 'i', o: 'ô', O: 'o', u: 'u', U: 'u',
      '@': 'ơ', y: 'uy', 2: 'ơ',
      ai: 'ai', ei: 'ây', oi: 'oi', au: 'ao', ou: 'ô',
      p: 'p', b: 'b', t: 't', d: 'đ', k: 'c', g: 'g', q: 'c', "'": '',
      3: '', H: 'h', f: 'ph', v: 'v', T: 'th', D: 'd', s: 's', z: 'd',
      S: 'sh', Z: 'gi', x: 'kh', G: 'g', h: 'h', m: 'm', n: 'n', N: 'ng',
      J: 'nh', l: 'l', r: 'r', R: 'r', w: 'o', j: 'y',
      ts: 'ts', dz: 'd', tS: 'ch', dZ: 'gi'
    },
    fixups: [[/c(?=[êei])/g, 'k']]
  }
};

const ORTHOGRAPHY_ORDER = ['ht', 'en', 'es', 'fr', 'pt', 'it', 'de', 'tl', 'id', 'sw', 'vi'];

/** Voice hint for reading a respelling aloud in the user's own language. */
const ORTH_VOICE = {
  en: 'en-US', ht: 'fr-FR', es: 'es-ES', fr: 'fr-FR', pt: 'pt-BR', it: 'it-IT',
  de: 'de-DE', tl: 'fil-PH', id: 'id-ID', sw: 'sw-KE', vi: 'vi-VN'
};
