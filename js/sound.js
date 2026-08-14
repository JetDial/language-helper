/* sound.js — the phoneme layer.
 *
 * Every word in this app is stored as a sequence of sounds, never as text.
 * A pronunciation looks like:   "kon.ni.tSi.wa"   or   "a.ri.ˈga.to:"
 *   .   separates syllables
 *   ˈ   marks the stressed syllable
 * Each syllable is a run of phoneme tokens, longest-match tokenized.
 *
 * Orthographies (orthographies.js) turn those tokens into letters that a
 * speaker of a given language already knows how to read.
 */

/* ---------- the inventory ---------------------------------------------- */

const PHON_INFO = {
  /* vowels */
  'a':  { ipa: 'a',  hint: 'open "ah"',            like: 'f_ther' },
  'a:': { ipa: 'aː', hint: 'held-out "ah"',        like: 'f_ther, longer' },
  'e':  { ipa: 'e',  hint: 'pure "eh", no glide',  like: 'caf_' },
  'e:': { ipa: 'eː', hint: 'held-out "eh"',        like: 'caf_, longer' },
  'E':  { ipa: 'ɛ',  hint: 'open "eh"',            like: 'b_d' },
  'i':  { ipa: 'i',  hint: '"ee"',                 like: 'mach_ne' },
  'i:': { ipa: 'iː', hint: 'held-out "ee"',        like: 's_e, longer' },
  'I':  { ipa: 'ɪ',  hint: 'short lax "ih"',       like: 's_t' },
  'o':  { ipa: 'o',  hint: 'pure "oh", no glide',  like: 'g_' },
  'o:': { ipa: 'oː', hint: 'held-out "oh"',        like: 'g_, longer' },
  'O':  { ipa: 'ɔ',  hint: 'open "aw"',            like: 'th_ught' },
  'u':  { ipa: 'u',  hint: '"oo"',                 like: 'fl_te' },
  'u:': { ipa: 'uː', hint: 'held-out "oo"',        like: 'f_d, longer' },
  'U':  { ipa: 'ʊ',  hint: 'short lax "uu"',       like: 'b_k' },
  '@':  { ipa: 'ə',  hint: 'lazy middle vowel',    like: 's_fa' },
  'y':  { ipa: 'y',  hint: '"ee" with rounded lips', like: 'French t_' },
  '2':  { ipa: 'ø',  hint: '"eh" with rounded lips', like: 'French bl_' },
  'ai': { ipa: 'aɪ', hint: 'glide ah→ee',          like: 'pr_ce' },
  'ei': { ipa: 'eɪ', hint: 'glide eh→ee',          like: 'f_ce' },
  'oi': { ipa: 'ɔɪ', hint: 'glide aw→ee',          like: 'ch_ce' },
  'au': { ipa: 'aʊ', hint: 'glide ah→oo',          like: 'm_th' },
  'ou': { ipa: 'oʊ', hint: 'glide oh→oo',          like: 'g_t' },
  'aN': { ipa: 'ã',  hint: '"ah" through the nose', like: 'French bl_c' },
  'eN': { ipa: 'ɛ̃',  hint: '"eh" through the nose', like: 'French p_n' },
  'oN': { ipa: 'õ',  hint: '"oh" through the nose', like: 'French b_' },
  'uN': { ipa: 'ũ',  hint: '"oo" through the nose', like: 'Portuguese um' },
  'iN': { ipa: 'ĩ',  hint: '"ee" through the nose', like: 'Hindi nah_' },

  /* consonants */
  'p':  { ipa: 'p',  hint: 'p' },
  'b':  { ipa: 'b',  hint: 'b' },
  't':  { ipa: 't',  hint: 't' },
  'd':  { ipa: 'd',  hint: 'd' },
  'k':  { ipa: 'k',  hint: 'k' },
  'g':  { ipa: 'g',  hint: 'hard g' },
  'q':  { ipa: 'q',  hint: 'k made deep in the throat', like: 'Arabic qaf' },
  "'":  { ipa: 'ʔ',  hint: 'catch in the throat',  like: 'uh_oh' },
  '3':  { ipa: 'ʕ',  hint: 'throat squeeze',       like: 'Arabic ayn' },
  'H':  { ipa: 'ħ',  hint: 'breathy throat h',     like: 'Arabic ha' },
  'f':  { ipa: 'f',  hint: 'f' },
  'v':  { ipa: 'v',  hint: 'v' },
  'T':  { ipa: 'θ',  hint: 'tongue-tip th',        like: '_ink' },
  'D':  { ipa: 'ð',  hint: 'buzzing th',           like: '_is' },
  's':  { ipa: 's',  hint: 's' },
  'z':  { ipa: 'z',  hint: 'z' },
  'S':  { ipa: 'ʃ',  hint: 'sh' },
  'Z':  { ipa: 'ʒ',  hint: 'the s in "measure"' },
  'x':  { ipa: 'x',  hint: 'scrapey h',            like: 'Bach' },
  'G':  { ipa: 'ɣ',  hint: 'voiced scrapey g',     like: 'Greek γάλα' },
  'h':  { ipa: 'h',  hint: 'h' },
  'm':  { ipa: 'm',  hint: 'm' },
  'n':  { ipa: 'n',  hint: 'n' },
  'N':  { ipa: 'ŋ',  hint: 'ng' },
  'J':  { ipa: 'ɲ',  hint: 'ny',                   like: 'ca_on' },
  'l':  { ipa: 'l',  hint: 'l' },
  'r':  { ipa: 'ɾ',  hint: 'quick tapped r',       like: 'Spanish pero' },
  'R':  { ipa: 'r',  hint: 'rolled or throaty r' },
  'w':  { ipa: 'w',  hint: 'w' },
  'j':  { ipa: 'j',  hint: 'y as in "yes"' },
  'ts': { ipa: 'ts', hint: 'ts',                   like: 'ca_s' },
  'dz': { ipa: 'dz', hint: 'dz',                   like: 'ki_s' },
  'tS': { ipa: 'tʃ', hint: 'ch' },
  'dZ': { ipa: 'dʒ', hint: 'j as in "jam"' },
  'tSH': { ipa: 'tʃʰ', hint: 'ch with a puff of air' },
  'dZH': { ipa: 'dʒʱ', hint: 'j with a puff of air' },
  'pH': { ipa: 'pʰ', hint: 'p with a puff of air' },
  'bH': { ipa: 'bʱ', hint: 'b with a puff of air' },
  'tH': { ipa: 'tʰ', hint: 't with a puff of air' },
  'dH': { ipa: 'dʱ', hint: 'd with a puff of air' },
  'kH': { ipa: 'kʰ', hint: 'k with a puff of air' },
  'gH': { ipa: 'gʱ', hint: 'g with a puff of air' }
};

/* longest first, so "tS" wins over "t" and "a:" over "a" */
const PHON_TOKENS = Object.keys(PHON_INFO).sort((a, b) => b.length - a.length);

const VOWEL_TOKENS = new Set([
  'a', 'a:', 'e', 'e:', 'E', 'i', 'i:', 'I', 'o', 'o:', 'O', 'u', 'u:', 'U',
  '@', 'y', '2', 'ai', 'ei', 'oi', 'au', 'ou', 'aN', 'eN', 'oN', 'uN', 'iN'
]);

const NASAL_VOWELS = { 'aN': 'a', 'eN': 'E', 'oN': 'o', 'uN': 'u', 'iN': 'i' };
const ASPIRATES    = { 'pH': 'p', 'bH': 'b', 'tH': 't', 'dH': 'd', 'kH': 'k',
                       'gH': 'g', 'tSH': 'tS', 'dZH': 'dZ' };

function isVowelToken(t) { return VOWEL_TOKENS.has(t); }

/* ---------- reading a pronunciation string ------------------------------ */

function tokenizeSyllable(text) {
  const out = [];
  let i = 0;
  while (i < text.length) {
    let hit = null;
    for (const tok of PHON_TOKENS) {
      if (text.startsWith(tok, i)) { hit = tok; break; }
    }
    if (hit) {
      i += hit.length;
      /* any vowel can be written long with a trailing colon, not just the
       * few that have their own entry above */
      if (text[i] === ':' && VOWEL_TOKENS.has(hit) && !hit.endsWith(':')) { hit += ':'; i += 1; }
      out.push(hit);
    }
    else { out.push(text[i]); i += 1; }   // unknown char, kept so it is visible
  }
  return out;
}

/** Description of a token, working out long vowels that have no entry. */
function phonInfo(tok) {
  if (PHON_INFO[tok]) return PHON_INFO[tok];
  if (tok.endsWith(':') && PHON_INFO[tok.slice(0, -1)]) {
    const base = PHON_INFO[tok.slice(0, -1)];
    return { ipa: base.ipa + 'ː', hint: 'held-out ' + (base.hint || ''), like: base.like };
  }
  return null;
}

/** "a.ri.ˈga.to:" -> [{tokens:['a'],stress:false}, ...] */
function parsePron(pron) {
  return String(pron).split('.').filter(Boolean).map(raw => {
    const stress = raw.startsWith('ˈ') || raw.startsWith("\"");
    const body = stress ? raw.slice(1) : raw;
    return { tokens: tokenizeSyllable(body), stress };
  });
}

function pronToIpa(pron) {
  return parsePron(pron)
    .map(s => (s.stress ? 'ˈ' : '') + s.tokens.map(t => { const i = phonInfo(t); return i ? i.ipa : t; }).join(''))
    .join('.');
}

/* ---------- spelling a sound with one language's letters ---------------- */

/* Last-resort substitutions when an orthography has no letter for a sound. */
const NEAREST = {
  'q': 'k', "'": '', '3': '', 'H': 'h', 'G': 'g', 'x': 'h', 'T': 't', 'D': 'd',
  'Z': 'S', 'dz': 'z', 'R': 'r', 'I': 'i', 'U': 'u', '@': 'a', 'y': 'i', '2': 'e'
};

/**
 * Resolve one phoneme token to letters in `orth`.
 * Falls back through: explicit map -> structural rules -> nearest sound.
 */
function spellToken(tok, orth, seen) {
  seen = seen || new Set();
  if (seen.has(tok)) return '';
  seen.add(tok);

  if (orth.map[tok] !== undefined) return orth.map[tok];

  /* long vowels: "a:" */
  if (tok.length > 1 && tok.endsWith(':')) {
    const base = spellToken(tok.slice(0, -1), orth, seen);
    if (orth.longVowel === 'double') return base + base;
    if (orth.longVowel === 'repeatLast') return base + base.slice(-1);
    return base;
  }
  /* nasal vowels: "aN" -> vowel + n */
  if (NASAL_VOWELS[tok]) {
    return spellToken(NASAL_VOWELS[tok], orth, seen) + spellToken('n', orth, seen);
  }
  /* aspirates: "kH" -> k + h, unless this language has no way to write the
   * puff of air, in which case spelling it out only misleads the reader */
  if (ASPIRATES[tok]) {
    const base = spellToken(ASPIRATES[tok], orth, seen);
    return orth.aspirate === 'drop' ? base : base + spellToken('h', orth, seen);
  }
  if (NEAREST[tok] !== undefined) {
    return NEAREST[tok] === '' ? '' : spellToken(NEAREST[tok], orth, seen);
  }
  return tok;
}

/**
 * respell("a.ri.ˈga.to:", orth)
 *   -> { text: "a-ri-GA-to", plain: "arigato", syllables: [...] }
 */
function respell(pron, orth) {
  const sylls = parsePron(pron);
  const parts = sylls.map((syl, i) => {
    let s = syl.tokens.map(t => spellToken(t, orth)).join('');
    if (orth.syllable) {
      s = orth.syllable(s, syl.tokens, {
        index: i,
        last: i === sylls.length - 1,
        next: i + 1 < sylls.length ? sylls[i + 1].tokens : []
      });
    }
    (orth.fixups || []).forEach(([re, to]) => { s = s.replace(re, to); });
    return { tokens: syl.tokens, stress: syl.stress, spelled: s };
  });

  const showStress = orth.capsStress !== false && parts.length > 1 && parts.some(p => p.stress);
  const text = parts
    .map(p => (showStress && p.stress ? p.spelled.toUpperCase() : p.spelled))
    .join('-');

  let plain = parts.map(p => p.spelled).join('');
  (orth.finalFixups || []).forEach(([re, to]) => { plain = plain.replace(re, to); });

  return { text, plain, syllables: parts, stressed: showStress };
}

/** Per-syllable table used by the "break it down" panel. */
function breakdown(pron, orth) {
  return respell(pron, orth).syllables.map(syl => ({
    spelled: syl.spelled,
    stress: syl.stress,
    sounds: syl.tokens.map(t => ({
      token: t,
      letters: spellToken(t, orth),
      ipa: (phonInfo(t) || {}).ipa || t,
      hint: (phonInfo(t) || {}).hint || '',
      vowel: isVowelToken(t)
    }))
  }));
}
