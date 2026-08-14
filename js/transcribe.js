/* transcribe.js — turn real text in a foreign script into sounds.
 *
 * These converters are rule-based, not dictionaries, so they work on any text
 * you paste. Each returns a pronunciation string that sound.js can respell
 * into whatever language the user reads.
 *
 * Accuracy notes are surfaced in the UI: some scripts (Arabic, Russian) leave
 * information out of the writing that a reader is expected to know.
 */

/* ---------- shared helpers --------------------------------------------- */

/* How many of the consonants sitting between two vowels belong to the second
 * syllable. One normally, but two when they make a cluster a syllable can
 * comfortably start with — so привет is pri-vyet, not priv-yet. */
const GLIDES = ['j', 'w', 'l', 'r', 'R'];
function onsetSize(tokens, from, to) {
  if (to - from >= 2 && GLIDES.includes(tokens[to - 1]) && !GLIDES.includes(tokens[to - 2])) return 2;
  return 1;
}

/** Group a flat token list into syllables: one vowel each, maximal onset. */
function autoSyllabify(tokens) {
  const vowelAt = tokens.map(isVowelToken);
  const nuclei = [];
  vowelAt.forEach((v, i) => { if (v) nuclei.push(i); });
  if (!nuclei.length) return tokens.length ? [tokens] : [];

  const sylls = [];
  for (let n = 0; n < nuclei.length; n++) {
    const here = nuclei[n];
    const prev = n === 0 ? -1 : nuclei[n - 1];
    const next = n === nuclei.length - 1 ? tokens.length : nuclei[n + 1];

    /* onset: consonants since the previous vowel, minus those left as coda */
    let onsetStart;
    if (n === 0) onsetStart = 0;
    else {
      const gap = here - prev - 1;
      onsetStart = gap <= 1 ? prev + 1 : here - onsetSize(tokens, prev + 1, here);
    }
    let end = here + 1;
    if (n === nuclei.length - 1) end = tokens.length;                 // trailing coda
    else {
      const gap = nuclei[n + 1] - here - 1;
      end = gap <= 1 ? here + 1 : nuclei[n + 1] - onsetSize(tokens, here + 1, nuclei[n + 1]);
    }
    sylls.push(tokens.slice(onsetStart, end));
  }
  return sylls;
}

function joinSyllables(sylls, stressIndex) {
  return sylls
    .map((s, i) => (i === stressIndex ? 'ˈ' : '') + s.join(''))
    .filter(s => s !== '')
    .join('.');
}

function tokensToPron(tokens, stressSyllable) {
  const clean = tokens.filter(Boolean);
  if (!clean.length) return '';
  return joinSyllables(autoSyllabify(clean), stressSyllable);
}

/* ---------- Japanese: kana --------------------------------------------- */

const KANA = {
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'さ': 'sa', 'し': 'Si', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'ざ': 'za', 'じ': 'dZi', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'た': 'ta', 'ち': 'tSi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'だ': 'da', 'ぢ': 'dZi', 'づ': 'zu', 'で': 'de', 'ど': 'do',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ja', 'ゆ': 'ju', 'よ': 'jo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'ゐ': 'wi', 'ゑ': 'we', 'を': 'o', 'ん': 'n',
  'ぁ': 'a', 'ぃ': 'i', 'ぅ': 'u', 'ぇ': 'e', 'ぉ': 'o',
  'ゔ': 'vu'
};
const SMALL_Y = { 'ゃ': 'a', 'ゅ': 'u', 'ょ': 'o' };
const HUSHING = ['S', 'dZ', 'tS', 'J'];

/** Katakana share codepoints with hiragana, 0x60 higher. */
function kataToHira(ch) {
  const c = ch.codePointAt(0);
  return (c >= 0x30a1 && c <= 0x30f6) ? String.fromCodePoint(c - 0x60) : ch;
}

function jaWordToPron(word) {
  const chars = Array.from(word).map(kataToHira);
  const sylls = [];
  let pendingSokuon = false;

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];

    if (ch === 'っ') { pendingSokuon = true; continue; }

    if (ch === 'ー' || ch === '－') {            // long-vowel dash
      if (sylls.length) sylls[sylls.length - 1] = lengthenLast(sylls[sylls.length - 1]);
      continue;
    }
    /* Moraic ん is only a plain "n" when a coronal follows (こんにちは). Before
     * m/b/p it turns into m, and anywhere else — end of word, before a vowel,
     * before k/s/h — it is a nasal vowel, so the vowel before it is nasalised
     * instead of a consonant being added. */
    if (ch === 'ん') {
      if (!sylls.length) { sylls.push('n'); continue; }
      const after = KANA[chars[i + 1]] || '';
      const head = after ? tokenizeSyllable(after)[0] : '';
      if (['n', 't', 'd', 'r', 'ts', 'tS', 'dZ', 'z'].includes(head)) sylls[sylls.length - 1] += 'n';
      else if (['m', 'b', 'p'].includes(head)) sylls[sylls.length - 1] += 'm';
      else sylls[sylls.length - 1] = nasalizeLast(sylls[sylls.length - 1]);
      continue;
    }

    let syl = KANA[ch];
    if (!syl) continue;

    /* き + ゃ = kya, し + ゃ = sha */
    const nxt = chars[i + 1];
    if (nxt && SMALL_Y[nxt] && syl.endsWith('i')) {
      const onset = syl.slice(0, -1);
      syl = HUSHING.includes(onset) ? onset + SMALL_Y[nxt] : onset + 'j' + SMALL_Y[nxt];
      i++;
    }
    if (pendingSokuon) {
      const first = tokenizeSyllable(syl)[0];
      if (sylls.length) sylls[sylls.length - 1] += first;
      pendingSokuon = false;
    }
    /* あ after お-row, う after う-row etc. lengthens instead of restarting */
    if (sylls.length && (ch === 'う' || ch === 'あ' || ch === 'い')) {
      const prevVowel = lastVowelOf(sylls[sylls.length - 1]);
      if ((ch === 'う' && (prevVowel === 'o' || prevVowel === 'u')) ||
          (ch === 'あ' && prevVowel === 'a') ||
          (ch === 'い' && prevVowel === 'i')) {
        sylls[sylls.length - 1] = lengthenLast(sylls[sylls.length - 1]);
        continue;
      }
    }
    sylls.push(syl);
  }
  return sylls.filter(Boolean).join('.');
}

function lastVowelOf(syl) {
  const toks = tokenizeSyllable(syl);
  for (let i = toks.length - 1; i >= 0; i--) if (isVowelToken(toks[i])) return toks[i].replace(':', '');
  return '';
}
const TO_NASAL = { 'a': 'aN', 'a:': 'aN', 'e': 'eN', 'e:': 'eN', 'E': 'eN',
                   'o': 'oN', 'o:': 'oN', 'O': 'oN', 'u': 'uN', 'u:': 'uN',
                   'i': 'iN', 'i:': 'iN' };
function nasalizeLast(syl) {
  const toks = tokenizeSyllable(syl);
  for (let i = toks.length - 1; i >= 0; i--) {
    if (TO_NASAL[toks[i]]) { toks[i] = TO_NASAL[toks[i]]; return toks.join(''); }
  }
  return syl + 'n';
}

function lengthenLast(syl) {
  const toks = tokenizeSyllable(syl);
  for (let i = toks.length - 1; i >= 0; i--) {
    if (isVowelToken(toks[i]) && !toks[i].endsWith(':')) { toks[i] += ':'; break; }
  }
  return toks.join('');
}

/* ---------- Korean: hangul --------------------------------------------- */

const KO_INITIAL = ['k', 'kk', 'n', 't', 'tt', 'r', 'm', 'p', 'pp', 's', 'ss',
                    '', 'tS', 'ttS', 'tS', 'k', 't', 'p', 'h'];
const KO_VOWEL = ['a', 'E', 'ja', 'jE', 'O', 'e', 'jO', 'je', 'o', 'wa', 'wE',
                  'we', 'jo', 'u', 'wO', 'we', 'wi', 'ju', '@', '@i', 'i'];
const KO_FINAL = ['', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm', 'l',
                  'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', 't', 'N', 't', 't',
                  'k', 't', 'p', 't'];

function koWordToPron(word) {
  const blocks = [];
  for (const ch of word) {
    const code = ch.codePointAt(0) - 0xac00;
    if (code < 0 || code > 11171) continue;
    blocks.push({
      onset: KO_INITIAL[Math.floor(code / 588)],
      vowel: KO_VOWEL[Math.floor((code % 588) / 28)],
      coda: KO_FINAL[code % 28]
    });
  }
  /* A final consonant slides into the next block when that block starts with
   * the silent ㅇ — this is why 한국어 is said "han-gu-geo". */
  for (let i = 0; i < blocks.length - 1; i++) {
    if (blocks[i].coda && blocks[i].coda !== 'N' && blocks[i + 1].onset === '') {
      blocks[i + 1].onset = blocks[i].coda === 'l' ? 'l' : voiceCoda(blocks[i].coda);
      blocks[i].coda = '';
    }
  }
  /* A stop before a nasal turns into the matching nasal: 감사합니다 is said
   * "hamnida", never "hapnida". This one is compulsory in Korean. */
  const TO_NASAL_KO = { p: 'm', t: 'n', k: 'N' };
  for (let i = 0; i < blocks.length - 1; i++) {
    const nextOnset = blocks[i + 1].onset;
    if (TO_NASAL_KO[blocks[i].coda] && (nextOnset === 'n' || nextOnset === 'm')) {
      blocks[i].coda = TO_NASAL_KO[blocks[i].coda];
    }
  }
  /* The plain stops are voiced once a word is under way — the first ㄱ of
   * 한국 is a k, the second sounds like g. */
  for (let i = 1; i < blocks.length; i++) {
    const prev = blocks[i - 1];
    const open = prev.coda === '' || ['n', 'm', 'N', 'l'].includes(prev.coda);
    if (open) blocks[i].onset = voiceCoda(blocks[i].onset);
  }
  return blocks.map(b => b.onset + b.vowel + b.coda).filter(Boolean).join('.');
}
function voiceCoda(c) { return { k: 'g', t: 'd', p: 'b', tS: 'dZ' }[c] || c; }

/* ---------- Russian: Cyrillic ------------------------------------------ */

const RU = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'je', 'ё': 'jo',
  'ж': 'Z', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'x', 'ц': 'ts', 'ч': 'tS', 'ш': 'S', 'щ': 'S', 'ъ': '',
  'ы': 'i', 'ь': '', 'э': 'E', 'ю': 'ju', 'я': 'ja'
};

function ruWordToPron(word) {
  const chars = Array.from(word.toLowerCase());
  let out = '';
  chars.forEach((ch, i) => {
    let s = RU[ch];
    if (s === undefined) return;
    /* After a consonant, е/я/ю/ё soften it rather than starting a new
     * syllable — and that softening is exactly what a learner hears as a
     * little "y". Keep it, except after ж, ш and ц, which never soften. */
    if ((ch === 'е' || ch === 'я' || ch === 'ю' || ch === 'ё') && i > 0) {
      const prevSound = RU[chars[i - 1]];
      if (prevSound === 'Z' || prevSound === 'S' || prevSound === 'ts') s = s.slice(1);
    }
    /* ь softens the consonant before it, which sounds like a faint y */
    if (ch === 'ь' && i < chars.length - 1 && !isVowelToken(RU[chars[i + 1]] || '')) s = 'j';
    out += s;
  });
  return tokensToPron(tokenizeSyllable(out));
}

/* ---------- Greek ------------------------------------------------------ */

const EL_PAIRS = {
  'ου': 'u', 'ού': 'u', 'αι': 'e', 'αί': 'e', 'ει': 'i', 'εί': 'i',
  'οι': 'i', 'οί': 'i', 'υι': 'i', 'ευ': 'ev', 'εύ': 'ev', 'αυ': 'av',
  'αύ': 'av', 'μπ': 'b', 'ντ': 'd', 'γκ': 'g', 'γγ': 'Ng', 'τσ': 'ts', 'τζ': 'dz'
};
const EL = {
  'α': 'a', 'β': 'v', 'γ': 'G', 'δ': 'D', 'ε': 'e', 'ζ': 'z', 'η': 'i',
  'θ': 'T', 'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'ks',
  'ο': 'o', 'π': 'p', 'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'i',
  'φ': 'f', 'χ': 'x', 'ψ': 'ps', 'ω': 'o'
};
const EL_ACCENT = { 'ά': 'α', 'έ': 'ε', 'ή': 'η', 'ί': 'ι', 'ό': 'ο', 'ύ': 'υ', 'ώ': 'ω', 'ΐ': 'ι', 'ϊ': 'ι', 'ϋ': 'υ' };

function elWordToPron(word) {
  const raw = Array.from(word.toLowerCase());
  /* which letter carries the accent? */
  let accentAt = raw.findIndex(c => EL_ACCENT[c] || 'άέήίόύώ'.includes(c));
  const chars = raw.map(c => EL_ACCENT[c] || c);

  let out = '';
  let accentOffset = -1;
  for (let i = 0; i < chars.length; i++) {
    const pair = chars[i] + (chars[i + 1] || '');
    let piece = EL_PAIRS[pair];
    if (piece) {
      /* αυ/ευ go quiet before a voiceless sound */
      if ((pair === 'αυ' || pair === 'ευ') && 'θκξπστφχψ'.includes(chars[i + 2] || ''))
        piece = piece.slice(0, -1) + 'f';
      if (accentAt === i || accentAt === i + 1) accentOffset = out.length;
      out += piece;
      i++;
      continue;
    }
    const s = EL[chars[i]];
    if (s === undefined) continue;
    if (accentAt === i) accentOffset = out.length;
    out += s;
  }
  const tokens = tokenizeSyllable(out);
  const sylls = autoSyllabify(tokens);
  /* find which syllable holds the accented vowel */
  let stress = -1;
  if (accentOffset >= 0) {
    let seen = 0;
    const marker = tokenizeSyllable(out.slice(0, accentOffset)).length;
    sylls.forEach((syl, si) => {
      if (stress === -1 && seen + syl.length > marker) stress = si;
      seen += syl.length;
    });
  }
  return joinSyllables(sylls, stress);
}

/* ---------- Hindi: Devanagari ------------------------------------------ */

const HI_VOWEL = {
  'अ': 'a', 'आ': 'a:', 'इ': 'i', 'ई': 'i:', 'उ': 'u', 'ऊ': 'u:', 'ऋ': 'ri',
  'ए': 'e:', 'ऐ': 'E', 'ओ': 'o:', 'औ': 'O', 'ऑ': 'O'
};
const HI_MATRA = {
  'ा': 'a:', 'ि': 'i', 'ी': 'i:', 'ु': 'u', 'ू': 'u:', 'ृ': 'ri',
  'े': 'e:', 'ै': 'E', 'ो': 'o:', 'ौ': 'O', 'ॉ': 'O'
};
const HI_CONS = {
  'क': 'k', 'ख': 'kH', 'ग': 'g', 'घ': 'gH', 'ङ': 'N',
  'च': 'tS', 'छ': 'tSH', 'ज': 'dZ', 'झ': 'dZH', 'ञ': 'J',
  'ट': 't', 'ठ': 'tH', 'ड': 'd', 'ढ': 'dH', 'ण': 'n',
  'त': 't', 'थ': 'tH', 'द': 'd', 'ध': 'dH', 'न': 'n',
  'प': 'p', 'फ': 'pH', 'ब': 'b', 'भ': 'bH', 'म': 'm',
  'य': 'j', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'S', 'ष': 'S', 'स': 's',
  'ह': 'h', 'क़': 'q', 'ख़': 'x', 'ग़': 'G', 'ज़': 'z', 'ड़': 'r', 'ढ़': 'rH', 'फ़': 'f'
};
const NASALIZE = { 'a': 'aN', 'a:': 'aN', 'e': 'eN', 'e:': 'eN', 'E': 'eN',
                   'o': 'oN', 'o:': 'oN', 'O': 'oN', 'u': 'uN', 'u:': 'uN',
                   'i': 'iN', 'i:': 'iN' };

function hiWordToPron(word) {
  const chars = Array.from(word);
  const sylls = [];
  let cluster = '';      // consonants stacked up, still waiting for a vowel

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (HI_CONS[ch] !== undefined) {
      const nxt = chars[i + 1];
      /* ् cancels the built-in vowel, so this consonant joins the next one */
      if (nxt === '्') { cluster += HI_CONS[ch]; i++; continue; }
      if (HI_MATRA[nxt] !== undefined) {
        sylls.push(cluster + HI_CONS[ch] + HI_MATRA[nxt]);
        cluster = ''; i++; continue;
      }
      sylls.push(cluster + HI_CONS[ch] + 'a');   // the built-in "a"
      cluster = '';
      continue;
    }
    if (HI_VOWEL[ch] !== undefined) {
      if (cluster) { sylls.push(cluster); cluster = ''; }
      sylls.push(HI_VOWEL[ch]);
      continue;
    }
    if (ch === 'ं' || ch === 'ँ') {          // nasal mark
      const last = sylls.length - 1;
      if (last >= 0) {
        const toks = tokenizeSyllable(sylls[last]);
        for (let k = toks.length - 1; k >= 0; k--) {
          if (isVowelToken(toks[k]) && NASALIZE[toks[k]]) { toks[k] = NASALIZE[toks[k]]; break; }
        }
        sylls[last] = toks.join('');
      }
      continue;
    }
    if (ch === 'ः') { sylls.push('h'); continue; }
  }
  if (cluster) {                             // a word ending on a bare consonant
    if (sylls.length) sylls[sylls.length - 1] += cluster;
    else sylls.push(cluster);
  }

  /* Hindi drops the built-in "a" at the end of a word: नाम is naam, not naama */
  if (sylls.length > 1) {
    const lastIdx = sylls.length - 1;
    if (/^[^aeiouEOIU@0-9:]+a$/.test(sylls[lastIdx].replace(/H/g, 'h'))) {
      const merged = sylls[lastIdx].slice(0, -1);
      sylls.pop();
      sylls[sylls.length - 1] += merged;
    }
  }
  return sylls.filter(Boolean).join('.');
}

/* ---------- Arabic ------------------------------------------------------ */

const AR = {
  'ا': 'a:', 'أ': "'", 'إ': "'", 'آ': "'a:", 'ب': 'b', 'ت': 't', 'ة': 'a',
  'ث': 'T', 'ج': 'dZ', 'ح': 'H', 'خ': 'x', 'د': 'd', 'ذ': 'D', 'ر': 'r',
  'ز': 'z', 'س': 's', 'ش': 'S', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'D',
  'ع': '3', 'غ': 'G', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm',
  'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'j', 'ى': 'a:', 'ء': "'", 'ؤ': "'", 'ئ': "'"
};
const AR_MARK = { 'َ': 'a', 'ِ': 'i', 'ُ': 'u', 'ً': 'an', 'ٍ': 'in', 'ٌ': 'un', 'ْ': '' };

function arWordToPron(word) {
  const chars = Array.from(word);
  const marked = chars.some(c => AR_MARK[c] !== undefined || c === 'ّ');
  let out = '';

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (ch === 'ّ') { continue; }                       // handled below
    let s = AR[ch];
    if (s === undefined) { if (AR_MARK[ch] !== undefined) out += AR_MARK[ch]; continue; }

    /* long vowels: و and ي act as u:/i: when they follow a consonant */
    if (ch === 'و' && i > 0 && !/[aiu]$/.test(out)) s = 'u:';
    if (ch === 'ي' && i > 0 && !/[aiu]$/.test(out)) s = 'i:';

    if (chars[i + 1] === 'ّ') s += s;                   // shadda doubles it
    out += s;

    if (!marked) {
      /* Unvocalised text: readers supply the short vowels from memory. We put
       * in a plain "a" so the word is at least sayable, and say so in the UI. */
      const nextIsVowelLetter = 'اوىآ'.includes(chars[i + 1] || '');
      const atEnd = i === chars.length - 1;
      if (!nextIsVowelLetter && !atEnd && !isVowelToken(s)) out += 'a';
    }
  }
  return tokensToPron(tokenizeSyllable(out));
}

/* ---------- Mandarin: pinyin ------------------------------------------- */

const ZH_INITIAL = {
  'b': 'b', 'p': 'pH', 'm': 'm', 'f': 'f', 'd': 'd', 't': 'tH', 'n': 'n',
  'l': 'l', 'g': 'g', 'k': 'kH', 'h': 'h', 'j': 'dZ', 'q': 'tS', 'x': 'S',
  'zh': 'dZ', 'ch': 'tS', 'sh': 'S', 'r': 'Z', 'z': 'ts', 'c': 'ts',
  's': 's', 'y': 'j', 'w': 'w'
};
const ZH_FINAL = {
  'a': 'a', 'o': 'o', 'e': '@', 'i': 'i', 'u': 'u', 'v': 'y', 'ü': 'y',
  'ai': 'ai', 'ei': 'ei', 'ao': 'au', 'ou': 'ou', 'an': 'an', 'en': '@n',
  'ang': 'aN', 'eng': '@N', 'ong': 'oN', 'er': 'ar',
  'ia': 'ja', 'ie': 'je', 'iao': 'jau', 'iu': 'jou', 'ian': 'jen', 'in': 'in',
  'iang': 'jaN', 'ing': 'iN', 'iong': 'joN', 'ua': 'wa', 'uo': 'wo',
  'uai': 'wai', 'ui': 'wei', 'uan': 'wan', 'un': 'w@n', 'uang': 'waN',
  'ueng': 'w@N', 'ue': 'ye', 'üe': 'ye', 'uan_v': 'yen', 'ün': 'yn', 'un_v': 'yn'
};
const ZH_TONE_MARKS = {
  'ā': ['a', 1], 'á': ['a', 2], 'ǎ': ['a', 3], 'à': ['a', 4],
  'ē': ['e', 1], 'é': ['e', 2], 'ě': ['e', 3], 'è': ['e', 4],
  'ī': ['i', 1], 'í': ['i', 2], 'ǐ': ['i', 3], 'ì': ['i', 4],
  'ō': ['o', 1], 'ó': ['o', 2], 'ǒ': ['o', 3], 'ò': ['o', 4],
  'ū': ['u', 1], 'ú': ['u', 2], 'ǔ': ['u', 3], 'ù': ['u', 4],
  'ǖ': ['ü', 1], 'ǘ': ['ü', 2], 'ǚ': ['ü', 3], 'ǜ': ['ü', 4]
};
const ZH_TONE_NAME = ['neutral', 'high and flat', 'rising', 'dipping', 'falling'];

/** One pinyin syllable (with or without a tone mark) -> [pron, tone] */
function zhSyllable(syl) {
  let tone = 0, base = '';
  for (const ch of syl.toLowerCase()) {
    const t = ZH_TONE_MARKS[ch];
    if (t) { base += t[0]; tone = t[1]; } else base += ch;
  }
  const m = base.match(/([1-5])$/);
  if (m) { tone = +m[1] % 5; base = base.slice(0, -1); }

  let initial = '';
  for (const cand of ['zh', 'ch', 'sh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l',
                      'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'y', 'w']) {
    if (base.startsWith(cand)) { initial = cand; break; }
  }
  let final = base.slice(initial.length);

  /* "u" after j/q/x/y is really ü */
  if (['j', 'q', 'x', 'y'].includes(initial) && final.startsWith('u')) final = 'ü' + final.slice(1);
  if (final === 'ün' || final === 'üan') final = final === 'ün' ? 'un_v' : 'uan_v';

  /* the buzzing -i after zh ch sh r z c s */
  let finalSound;
  if (final === 'i' && ['zh', 'ch', 'sh', 'r', 'z', 'c', 's'].includes(initial)) finalSound = '@';
  else finalSound = ZH_FINAL[final] !== undefined ? ZH_FINAL[final] : final;

  const initSound = ZH_INITIAL[initial] !== undefined ? ZH_INITIAL[initial] : initial;
  return [initSound + finalSound, tone];
}

function zhTextToPron(text) {
  const parts = text.trim().split(/\s+/).filter(Boolean);
  const prons = [], tones = [];
  parts.forEach(p => {
    const [pron, tone] = zhSyllable(p);
    if (pron) { prons.push(pron); tones.push(tone); }
  });
  return { pron: prons.join('.'), tones };
}

/* ---------- registry ---------------------------------------------------- */

const TRANSCRIBERS = {
  ja: {
    label: 'Japanese (kana)',
    placeholder: 'ありがとう  こんにちは  トウキョウ',
    sample: 'ひらがな と カタカナ',
    caution: 'Kana is worked out letter by letter. Common kanji words are known too; '
           + 'any other kanji has no reading until you teach it one — click it and write it down.',
    run: jaWordToPron
  },
  ko: {
    label: 'Korean (hangul)',
    placeholder: '안녕하세요  감사합니다',
    sample: '한국어 를 배워요',
    caution: 'Blocks are unpacked letter by letter, including the sliding final consonant.',
    run: koWordToPron
  },
  zh: {
    label: 'Mandarin (pinyin)',
    placeholder: 'ni3 hao3   xie4 xie   zhong1 guo2',
    sample: 'ni3 hao3 shi4 jie4',
    caution: 'Type pinyin with tone marks or numbers (hao3). Characters cannot be read without a dictionary.',
    run: t => zhTextToPron(t).pron,
    whole: true
  },
  ru: {
    label: 'Russian (Cyrillic)',
    placeholder: 'привет  спасибо  Москва',
    sample: 'добрый день друзья',
    caution: 'Russian does not write which syllable is stressed, and unstressed "о" drifts toward "a". Sounds are shown as spelled.',
    run: ruWordToPron
  },
  el: {
    label: 'Greek',
    placeholder: 'καλημέρα  ευχαριστώ',
    sample: 'καλησπέρα φίλε μου',
    caution: 'Accent marks are used to place the stress, so stressed syllables here are reliable.',
    run: elWordToPron
  },
  hi: {
    label: 'Hindi (Devanagari)',
    placeholder: 'नमस्ते  धन्यवाद',
    sample: 'मेरा नाम क्या है',
    caution: 'The built-in "a" is dropped at the end of a word, as Hindi speakers do.',
    run: hiWordToPron
  },
  ar: {
    label: 'Arabic',
    placeholder: 'مرحبا  شكرا',
    sample: 'كتب الطالب الدرس',
    caution: 'Without vowel marks, Arabic writing leaves the short vowels out. A plain "a" is filled in so the word is sayable — the real vowel may differ.',
    run: arWordToPron
  }
};
