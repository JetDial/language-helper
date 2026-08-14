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
  nl: {
    name: 'Dutch', native: 'Nederlands', flag: '🇳🇱',
    note: 'Dutch conventions: "sj" = sh, "tsj" = ch, "j" = y, "oe" = oo, '
        + '"ch/g" = the scrapey h.',
    map: {
      a: 'a', e: 'e', E: 'è', i: 'i', I: 'i', o: 'o', O: 'o', u: 'oe', U: 'oe',
      '@': 'e', y: 'u', 2: 'eu',
      'a:': 'aa', 'e:': 'ee', 'i:': 'ie', 'o:': 'oo', 'u:': 'oe',
      ai: 'aai', ei: 'ee', oi: 'oi', au: 'au', ou: 'ou',
      p: 'p', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', q: 'k', "'": '',
      3: '', H: 'h', f: 'f', v: 'v', T: 'th', D: 'd', s: 's', z: 'z',
      S: 'sj', Z: 'zj', x: 'ch', G: 'g', h: 'h', m: 'm', n: 'n', N: 'ng',
      J: 'nj', l: 'l', r: 'r', R: 'r', w: 'w', j: 'j',
      ts: 'ts', dz: 'ds', tS: 'tsj', dZ: 'dzj'
    }
  },

  /* ------------------------------------------------------------------ */
  pl: {
    aspirate: 'drop',
    name: 'Polish', native: 'Polski', flag: '🇵🇱',
    note: 'Polish conventions: "sz" = sh, "cz" = ch, "ż" = zh, "w" = v, "j" = y.',
    map: {
      a: 'a', e: 'e', E: 'e', i: 'i', I: 'y', o: 'o', O: 'o', u: 'u', U: 'u',
      '@': 'y', y: 'iu', 2: 'e',
      ai: 'aj', ei: 'ej', oi: 'oj', au: 'au', ou: 'ou',
      aN: 'ą', eN: 'ę', oN: 'on', uN: 'un', iN: 'in',
      p: 'p', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', q: 'k', "'": '',
      3: '', H: 'h', f: 'f', v: 'w', T: 't', D: 'd', s: 's', z: 'z',
      S: 'sz', Z: 'ż', x: 'ch', G: 'g', h: 'h', m: 'm', n: 'n', N: 'ng',
      J: 'ń', l: 'l', r: 'r', R: 'r', w: 'ł', j: 'j',
      ts: 'c', dz: 'dz', tS: 'cz', dZ: 'dż'
    }
  },

  /* ------------------------------------------------------------------ */
  cs: {
    aspirate: 'drop',
    name: 'Czech', native: 'Čeština', flag: '🇨🇿',
    note: 'Czech conventions: "š" = sh, "č" = ch, "ž" = zh, "j" = y, "ch" = the scrapey h.',
    map: {
      a: 'a', e: 'e', E: 'e', i: 'i', I: 'i', o: 'o', O: 'o', u: 'u', U: 'u',
      '@': 'e', y: 'u', 2: 'e',
      ai: 'aj', ei: 'ej', oi: 'oj', au: 'au', ou: 'ou',
      p: 'p', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', q: 'k', "'": '',
      3: '', H: 'h', f: 'f', v: 'v', T: 't', D: 'd', s: 's', z: 'z',
      S: 'š', Z: 'ž', x: 'ch', G: 'g', h: 'h', m: 'm', n: 'n', N: 'ng',
      J: 'ň', l: 'l', r: 'r', R: 'ř', w: 'v', j: 'j',
      ts: 'c', dz: 'dz', tS: 'č', dZ: 'dž'
    }
  },

  /* ------------------------------------------------------------------ */
  hu: {
    aspirate: 'drop',
    name: 'Hungarian', native: 'Magyar', flag: '🇭🇺',
    note: 'Hungarian conventions: "s" = sh, "sz" = s, "cs" = ch, "zs" = zh, "j" = y.',
    map: {
      a: 'a', e: 'e', E: 'e', i: 'i', I: 'i', o: 'o', O: 'o', u: 'u', U: 'u',
      '@': 'a', y: 'ü', 2: 'ö',
      'a:': 'á', 'e:': 'é', 'i:': 'í', 'o:': 'ó', 'u:': 'ú',
      ai: 'aj', ei: 'ej', oi: 'oj', au: 'au', ou: 'ou',
      p: 'p', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', q: 'k', "'": '',
      3: '', H: 'h', f: 'f', v: 'v', T: 't', D: 'd', s: 'sz', z: 'z',
      S: 's', Z: 'zs', x: 'h', G: 'g', h: 'h', m: 'm', n: 'n', N: 'ng',
      J: 'ny', l: 'l', r: 'r', R: 'r', w: 'v', j: 'j',
      ts: 'c', dz: 'dz', tS: 'cs', dZ: 'dzs'
    }
  },

  /* ------------------------------------------------------------------ */
  tr: {
    aspirate: 'drop',
    name: 'Turkish', native: 'Türkçe', flag: '🇹🇷',
    note: 'Turkish conventions: "ş" = sh, "ç" = ch, "c" = j, "y" = y, "ı" = the back "uh".',
    map: {
      a: 'a', e: 'e', E: 'e', i: 'i', I: 'ı', o: 'o', O: 'o', u: 'u', U: 'u',
      '@': 'ı', y: 'ü', 2: 'ö',
      ai: 'ay', ei: 'ey', oi: 'oy', au: 'av', ou: 'ov',
      p: 'p', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', q: 'k', "'": '',
      3: '', H: 'h', f: 'f', v: 'v', T: 't', D: 'd', s: 's', z: 'z',
      S: 'ş', Z: 'j', x: 'h', G: 'ğ', h: 'h', m: 'm', n: 'n', N: 'ng',
      J: 'ny', l: 'l', r: 'r', R: 'r', w: 'v', j: 'y',
      ts: 'ts', dz: 'dz', tS: 'ç', dZ: 'c'
    }
  },

  /* ------------------------------------------------------------------ */
  ro: {
    aspirate: 'drop',
    name: 'Romanian', native: 'Română', flag: '🇷🇴',
    note: 'Romanian conventions: "ș" = sh, "ț" = ts, "ce/ci" = ch, "ge/gi" = j, "ă" = uh.',
    map: {
      a: 'a', e: 'e', E: 'e', i: 'i', I: 'i', o: 'o', O: 'o', u: 'u', U: 'u',
      '@': 'ă', y: 'iu', 2: 'ă',
      ai: 'ai', ei: 'ei', oi: 'oi', au: 'au', ou: 'ou',
      p: 'p', b: 'b', t: 't', d: 'd', k: 'c', g: 'g', q: 'c', "'": '',
      3: '', H: 'h', f: 'f', v: 'v', T: 't', D: 'd', s: 's', z: 'z',
      S: 'ș', Z: 'j', x: 'h', G: 'g', h: 'h', m: 'm', n: 'n', N: 'ng',
      J: 'ni', l: 'l', r: 'r', R: 'r', w: 'u', j: 'i',
      ts: 'ț', dz: 'dz', tS: 'ci', dZ: 'gi'
    },
    fixups: [[/c(?=[ei])/g, 'ch'], [/g(?=[ei])/g, 'gh']]
  },

  /* ------------------------------------------------------------------ */
  fi: {
    aspirate: 'drop',
    name: 'Finnish', native: 'Suomi', flag: '🇫🇮',
    note: 'Finnish is one letter per sound, and a doubled letter is simply held longer, '
        + 'so respellings here are unusually exact.',
    map: {
      a: 'a', e: 'e', E: 'ä', i: 'i', I: 'i', o: 'o', O: 'o', u: 'u', U: 'u',
      '@': 'a', y: 'y', 2: 'ö',
      ai: 'ai', ei: 'ei', oi: 'oi', au: 'au', ou: 'ou',
      p: 'p', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', q: 'k', "'": '',
      3: '', H: 'h', f: 'f', v: 'v', T: 't', D: 'd', s: 's', z: 's',
      S: 'sh', Z: 'zh', x: 'h', G: 'g', h: 'h', m: 'm', n: 'n', N: 'ng',
      J: 'nj', l: 'l', r: 'r', R: 'r', w: 'v', j: 'j',
      ts: 'ts', dz: 'ds', tS: 'ts', dZ: 'dz'
    },
    longVowel: 'double'
  },

  /* ------------------------------------------------------------------ */
  sq: {
    aspirate: 'drop',
    name: 'Albanian', native: 'Shqip', flag: '🇦🇱',
    note: 'Albanian conventions: "sh" = sh, "ç" = ch, "xh" = j, "gj" = soft g, "ë" = uh.',
    map: {
      a: 'a', e: 'e', E: 'e', i: 'i', I: 'i', o: 'o', O: 'o', u: 'u', U: 'u',
      '@': 'ë', y: 'y', 2: 'ë',
      ai: 'aj', ei: 'ej', oi: 'oj', au: 'au', ou: 'ou',
      p: 'p', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', q: 'k', "'": '',
      3: '', H: 'h', f: 'f', v: 'v', T: 'th', D: 'dh', s: 's', z: 'z',
      S: 'sh', Z: 'zh', x: 'h', G: 'gj', h: 'h', m: 'm', n: 'n', N: 'ng',
      J: 'nj', l: 'l', r: 'r', R: 'rr', w: 'u', j: 'j',
      ts: 'c', dz: 'x', tS: 'ç', dZ: 'xh'
    }
  },

  /* ------------------------------------------------------------------ */
  af: {
    name: 'Afrikaans', native: 'Afrikaans', flag: '🇿🇦',
    note: 'Afrikaans conventions: "sj" = sh, "tj" = ch, "j" = y, "g" = the scrapey h.',
    map: {
      a: 'a', e: 'e', E: 'è', i: 'i', I: 'i', o: 'o', O: 'o', u: 'oe', U: 'oe',
      '@': 'e', y: 'u', 2: 'eu',
      ai: 'ai', ei: 'ei', oi: 'oi', au: 'ou', ou: 'ou',
      p: 'p', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', q: 'k', "'": '',
      3: '', H: 'h', f: 'f', v: 'v', T: 't', D: 'd', s: 's', z: 'z',
      S: 'sj', Z: 'zj', x: 'g', G: 'g', h: 'h', m: 'm', n: 'n', N: 'ng',
      J: 'nj', l: 'l', r: 'r', R: 'r', w: 'w', j: 'j',
      ts: 'ts', dz: 'ds', tS: 'tj', dZ: 'dj'
    }
  },

  /* ------------------------------------------------------------------ */
  yo: {
    aspirate: 'drop',
    name: 'Yoruba', native: 'Yorùbá', flag: '🇳🇬',
    note: 'Yoruba conventions: "ṣ" = sh, "ẹ" = open eh, "ọ" = open aw. Tone marks '
        + 'are not shown here, only the sounds.',
    map: {
      a: 'a', e: 'e', E: 'ẹ', i: 'i', I: 'i', o: 'o', O: 'ọ', u: 'u', U: 'u',
      '@': 'a', y: 'u', 2: 'e',
      ai: 'ai', ei: 'ei', oi: 'oi', au: 'au', ou: 'ou',
      aN: 'an', eN: 'en', oN: 'on', uN: 'un', iN: 'in',
      p: 'p', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', q: 'k', "'": '',
      3: '', H: 'h', f: 'f', v: 'f', T: 't', D: 'd', s: 's', z: 's',
      S: 'ṣ', Z: 'j', x: 'h', G: 'g', h: 'h', m: 'm', n: 'n', N: 'n',
      J: 'ny', l: 'l', r: 'r', R: 'r', w: 'w', j: 'y',
      ts: 'ts', dz: 'dz', tS: 'ṣ', dZ: 'j'
    }
  },

  /* ------------------------------------------------------------------ */
  so: {
    aspirate: 'drop',
    name: 'Somali', native: 'Soomaali', flag: '🇸🇴',
    note: 'Somali conventions: "sh" = sh, "c" = the throat squeeze, "x" = breathy h, '
        + '"q" = the deep k, "dh" = a curled d.',
    map: {
      a: 'a', e: 'e', E: 'e', i: 'i', I: 'i', o: 'o', O: 'o', u: 'u', U: 'u',
      '@': 'a', y: 'u', 2: 'e',
      ai: 'ay', ei: 'ey', oi: 'oy', au: 'aw', ou: 'ow',
      p: 'b', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', q: 'q', "'": "'",
      3: 'c', H: 'x', f: 'f', v: 'f', T: 't', D: 'dh', s: 's', z: 's',
      S: 'sh', Z: 'j', x: 'kh', G: 'gh', h: 'h', m: 'm', n: 'n', N: 'n',
      J: 'ny', l: 'l', r: 'r', R: 'r', w: 'w', j: 'y',
      ts: 'ts', dz: 'dz', tS: 'ch', dZ: 'j'
    },
    longVowel: 'double'
  },

  /* ---------- writing systems that are not the Latin alphabet ---------- */

  ru_cyr: {
    aspirate: 'drop',
    name: 'Russian (Cyrillic)', native: 'Русский', flag: '🇷🇺',
    note: 'Foreign words written out in Cyrillic letters, the way a Russian newspaper '
        + 'spells a foreign name. Cyrillic has no "th" and no "h", so т and х stand in.',
    map: {
      a: 'а', e: 'е', E: 'э', i: 'и', I: 'и', o: 'о', O: 'о',
      u: 'у', U: 'у', '@': 'а', y: 'ю', 2: 'ё',
      ai: 'ай', ei: 'ей', oi: 'ой', au: 'ау', ou: 'оу',
      aN: 'ан', eN: 'эн', oN: 'он', uN: 'ун', iN: 'ин',
      p: 'п', b: 'б', t: 'т', d: 'д', k: 'к', g: 'г', q: 'к', "'": '',
      3: '', H: 'х', f: 'ф', v: 'в', T: 'т', D: 'д', s: 'с', z: 'з',
      S: 'ш', Z: 'ж', x: 'х', G: 'г', h: 'х', m: 'м', n: 'н',
      N: 'нг', J: 'нь', l: 'л', r: 'р', R: 'р', w: 'в', j: 'й',
      ts: 'ц', dz: 'дз', tS: 'ч', dZ: 'дж'
    },
    capsStress: false
  },

  el_gr: {
    aspirate: 'drop',
    name: 'Greek (Greek letters)', native: 'Ελληνικά', flag: '🇬🇷',
    note: 'Foreign words written out in Greek letters. Greek has no sh, and no b, d or g '
        + 'on their own, so μπ, ντ and γκ do that job.',
    map: {
      a: 'α', e: 'ε', E: 'ε', i: 'ι', I: 'ι', o: 'ο', O: 'ο',
      u: 'ου', U: 'ου', '@': 'α', y: 'ιου', 2: 'ε',
      ai: 'άι', ei: 'έι', oi: 'όι', au: 'άου', ou: 'όου',
      p: 'π', b: 'μπ', t: 'τ', d: 'ντ', k: 'κ', g: 'γκ',
      q: 'κ', "'": '', 3: '', H: 'χ', f: 'φ', v: 'β', T: 'θ', D: 'δ',
      s: 'σ', z: 'ζ', S: 'σ', Z: 'ζ', x: 'χ', G: 'γ', h: 'χ',
      m: 'μ', n: 'ν', N: 'γκ', J: 'νι', l: 'λ', r: 'ρ',
      R: 'ρ', w: 'ου', j: 'ι',
      ts: 'τσ', dz: 'τζ', tS: 'τσ', dZ: 'τζ'
    },
    capsStress: false
  },

  ar_arab: {
    aspirate: 'drop',
    rtl: true,
    name: 'Arabic (Arabic letters)', native: 'العربية', flag: '🇸🇦',
    note: 'Foreign words written out in Arabic letters, using ا و ي for the vowels the way '
        + 'Arabic newspapers spell foreign names. Sounds Arabic does not have (p, v, g) '
        + 'borrow the nearest letter.',
    map: {
      a: 'ا', e: 'ي', E: 'ي', i: 'ي', I: 'ي', o: 'و', O: 'و',
      u: 'و', U: 'و', '@': 'ا', y: 'و', 2: 'و',
      ai: 'اي', ei: 'يي', oi: 'وي', au: 'او', ou: 'وو',
      aN: 'ان', eN: 'ين', oN: 'ون', uN: 'ون', iN: 'ين',
      p: 'ب', b: 'ب', t: 'ت', d: 'د', k: 'ك', g: 'ج', q: 'ق',
      "'": 'ء', 3: 'ع', H: 'ح', f: 'ف', v: 'ف', T: 'ث', D: 'ذ',
      s: 'س', z: 'ز', S: 'ش', Z: 'ج', x: 'خ', G: 'غ', h: 'ه',
      m: 'م', n: 'ن', N: 'نغ', J: 'ني', l: 'ل', r: 'ر',
      R: 'ر', w: 'و', j: 'ي',
      ts: 'تس', dz: 'دز', tS: 'تش', dZ: 'ج'
    },
    capsStress: false
  },

  hi_deva: {
    name: 'Hindi (Devanagari)', native: 'हिन्दी', flag: '🇮🇳',
    note: 'Foreign words written out in Devanagari, with the vowel signs hooked onto '
        + 'the consonants exactly as Hindi does it.',
    map: {
      a: '', 'a:': 'ा', e: 'े', 'e:': 'े', E: 'ै', i: 'ि', 'i:': 'ी',
      I: 'ि', o: 'ो', 'o:': 'ो', O: 'ौ', u: 'ु', 'u:': 'ू', U: 'ु',
      '@': '', y: 'ू', 2: 'े',
      ai: 'ै', ei: 'े', oi: 'ॉय', au: 'ौ', ou: 'ो',
      aN: 'ं', eN: 'ें', oN: 'ों', uN: 'ूं', iN: 'ीं',
      p: 'प', b: 'ब', t: 'त', d: 'द', k: 'क', g: 'ग', q: 'क',
      "'": '', 3: '', H: 'ह', f: 'फ़', v: 'व', T: 'थ', D: 'ध',
      s: 'स', z: 'ज़', S: 'श', Z: 'ज़', x: 'ख', G: 'ग', h: 'ह',
      m: 'म', n: 'न', N: 'ं', J: 'ञ', l: 'ल', r: 'र', R: 'र',
      w: 'व', j: 'य',
      ts: 'त्स', dz: 'ड्ज', tS: 'च', dZ: 'ज',
      pH: 'फ', bH: 'भ', tH: 'थ', dH: 'ध', kH: 'ख', gH: 'घ',
      tSH: 'छ', dZH: 'झ'
    },
    /* Devanagari is a syllable script: a lone vowel needs its own full letter, a
     * vowel after a consonant is a sign hanging off it, and a consonant with no
     * vowel of its own takes the little stroke that silences it. */
    independent: {
      a: 'अ', 'a:': 'आ', e: 'ए', 'e:': 'ए', E: 'ऐ', i: 'इ',
      'i:': 'ई', I: 'इ', o: 'ओ', 'o:': 'ओ', O: 'औ', u: 'उ',
      'u:': 'ऊ', U: 'उ', '@': 'अ', y: 'ऊ', 2: 'ए',
      ai: 'ऐ', ei: 'ए', oi: 'ऑय', au: 'औ', ou: 'ओ',
      aN: 'अं', eN: 'एं', oN: 'ओं', uN: 'ऊं', iN: 'ईं'
    },
    syllable: function (s, tokens) {
      var VIRAMA = '्';
      var vi = -1;
      for (var i = 0; i < tokens.length; i++) { if (isVowelToken(tokens[i])) { vi = i; break; } }

      var onset = vi === -1 ? tokens : tokens.slice(0, vi);
      var coda = vi === -1 ? [] : tokens.slice(vi + 1);
      var self = this;
      var letters = function (list) {
        return list.map(function (t) { return spellToken(t, self); }).join(VIRAMA);
      };

      var out = letters(onset);
      if (vi === -1) return out ? out + VIRAMA : out;

      var vowel = tokens[vi];
      out += onset.length
        ? spellToken(vowel, this)
        : (this.independent[vowel] || this.independent[vowel.replace(':', '')] || '');
      if (coda.length) out += letters(coda) + VIRAMA;
      return out;
    },
    capsStress: false
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

const ORTHOGRAPHY_ORDER = [
  'ht', 'en', 'es', 'fr', 'pt', 'it', 'de', 'nl', 'af', 'pl', 'cs', 'hu', 'ro',
  'tr', 'sq', 'fi', 'tl', 'id', 'sw', 'yo', 'so', 'vi',
  'ru_cyr', 'el_gr', 'ar_arab', 'hi_deva'
];

/** Voice hint for reading a respelling aloud in the user's own language. */
const ORTH_VOICE = {
  en: 'en-US', ht: 'ht-HT', es: 'es-ES', fr: 'fr-FR', pt: 'pt-BR', it: 'it-IT',
  de: 'de-DE', nl: 'nl-NL', af: 'af-ZA', pl: 'pl-PL', cs: 'cs-CZ', hu: 'hu-HU',
  ro: 'ro-RO', tr: 'tr-TR', sq: 'sq-AL', fi: 'fi-FI', tl: 'fil-PH', id: 'id-ID',
  sw: 'sw-KE', yo: 'yo-NG', so: 'so-SO', vi: 'vi-VN',
  ru_cyr: 'ru-RU', el_gr: 'el-GR', ar_arab: 'ar-SA', hi_deva: 'hi-IN'
};
