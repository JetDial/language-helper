/* data-scripts.js — the writing systems, for the Write tab.
 *
 * Each group row: [ character, name/romanization, pronunciation, strokes, note ]
 * `strokes` and `note` are optional.
 */

const SCRIPTS = {

  hiragana: {
    lang: 'ja',
    name: 'Hiragana',
    native: 'ひらがな',
    intro: 'The everyday Japanese syllable alphabet: 46 signs, each one a whole '
         + 'syllable. Learn these first — you can write any Japanese word with '
         + 'them, even before you know a single kanji.',
    tips: [
      'Strokes always go left to right, top to bottom.',
      'Two small marks (゛) turn k→g, s→z, t→d, h→b. A small circle (゜) turns h→p.',
      'A small ゃゅょ after a sign squashes two syllables into one: き + ゃ = kya.'
    ],
    groups: [
      { name: 'Vowels', items: [
        ['あ', 'a', 'a', 3, 'An "A" with a looping tail.'],
        ['い', 'i', 'i', 2, 'Two strokes leaning together.'],
        ['う', 'u', 'u', 2, 'A little hook with a hat.'],
        ['え', 'e', 'e', 2, 'A ninja star shape.'],
        ['お', 'o', 'o', 3, 'Like あ but with a flying dot.']
      ]},
      { name: 'K row', items: [
        ['か', 'ka', 'ka', 3], ['き', 'ki', 'ki', 4], ['く', 'ku', 'ku', 1],
        ['け', 'ke', 'ke', 3], ['こ', 'ko', 'ko', 2]
      ]},
      { name: 'S row', items: [
        ['さ', 'sa', 'sa', 3], ['し', 'shi', 'Si', 1], ['す', 'su', 'su', 2],
        ['せ', 'se', 'se', 3], ['そ', 'so', 'so', 1]
      ]},
      { name: 'T row', items: [
        ['た', 'ta', 'ta', 4], ['ち', 'chi', 'tSi', 2], ['つ', 'tsu', 'tsu', 1],
        ['て', 'te', 'te', 1], ['と', 'to', 'to', 2]
      ]},
      { name: 'N row', items: [
        ['な', 'na', 'na', 4], ['に', 'ni', 'ni', 3], ['ぬ', 'nu', 'nu', 2],
        ['ね', 'ne', 'ne', 2], ['の', 'no', 'no', 1]
      ]},
      { name: 'H row', items: [
        ['は', 'ha', 'ha', 3], ['ひ', 'hi', 'hi', 1], ['ふ', 'fu', 'fu', 4],
        ['へ', 'he', 'he', 1], ['ほ', 'ho', 'ho', 4]
      ]},
      { name: 'M row', items: [
        ['ま', 'ma', 'ma', 3], ['み', 'mi', 'mi', 2], ['む', 'mu', 'mu', 3],
        ['め', 'me', 'me', 2], ['も', 'mo', 'mo', 3]
      ]},
      { name: 'Y row', items: [
        ['や', 'ya', 'ja', 3], ['ゆ', 'yu', 'ju', 2], ['よ', 'yo', 'jo', 2]
      ]},
      { name: 'R row', items: [
        ['ら', 'ra', 'ra', 2], ['り', 'ri', 'ri', 2], ['る', 'ru', 'ru', 1],
        ['れ', 're', 're', 2], ['ろ', 'ro', 'ro', 1]
      ]},
      { name: 'W row & N', items: [
        ['わ', 'wa', 'wa', 2], ['を', 'wo', 'o', 3, 'Only used as a grammar particle.'],
        ['ん', 'n', 'n', 1, 'The only sign that is a lone consonant.']
      ]},
      { name: 'With marks (dakuten)', items: [
        ['が', 'ga', 'ga'], ['ぎ', 'gi', 'gi'], ['ぐ', 'gu', 'gu'], ['げ', 'ge', 'ge'], ['ご', 'go', 'go'],
        ['ざ', 'za', 'za'], ['じ', 'ji', 'dZi'], ['ず', 'zu', 'zu'], ['ぜ', 'ze', 'ze'], ['ぞ', 'zo', 'zo'],
        ['だ', 'da', 'da'], ['で', 'de', 'de'], ['ど', 'do', 'do'],
        ['ば', 'ba', 'ba'], ['び', 'bi', 'bi'], ['ぶ', 'bu', 'bu'], ['べ', 'be', 'be'], ['ぼ', 'bo', 'bo'],
        ['ぱ', 'pa', 'pa'], ['ぴ', 'pi', 'pi'], ['ぷ', 'pu', 'pu'], ['ぺ', 'pe', 'pe'], ['ぽ', 'po', 'po']
      ]}
    ]
  },

  katakana: {
    lang: 'ja',
    name: 'Katakana',
    native: 'カタカナ',
    intro: 'Same 46 syllables as hiragana, different shapes. Katakana is used '
         + 'for words borrowed from other languages — so your own name is '
         + 'written in katakana.',
    tips: [
      'Shapes are angular and made of short, straight strokes.',
      'A long dash ー stretches the vowel: コーヒー = kōhī (coffee).',
      'Most foreign words get an extra vowel added: "milk" becomes ミルク mi-ru-ku.'
    ],
    groups: [
      { name: 'Vowels', items: [
        ['ア', 'a', 'a', 2], ['イ', 'i', 'i', 2], ['ウ', 'u', 'u', 3],
        ['エ', 'e', 'e', 3], ['オ', 'o', 'o', 3]
      ]},
      { name: 'K row', items: [
        ['カ', 'ka', 'ka', 2], ['キ', 'ki', 'ki', 3], ['ク', 'ku', 'ku', 2],
        ['ケ', 'ke', 'ke', 3], ['コ', 'ko', 'ko', 2]
      ]},
      { name: 'S row', items: [
        ['サ', 'sa', 'sa', 3], ['シ', 'shi', 'Si', 3, 'Strokes sweep upward — compare ツ.'],
        ['ス', 'su', 'su', 2], ['セ', 'se', 'se', 2], ['ソ', 'so', 'so', 2]
      ]},
      { name: 'T row', items: [
        ['タ', 'ta', 'ta', 3], ['チ', 'chi', 'tSi', 3],
        ['ツ', 'tsu', 'tsu', 3, 'Strokes come down — compare シ.'],
        ['テ', 'te', 'te', 3], ['ト', 'to', 'to', 2]
      ]},
      { name: 'N row', items: [
        ['ナ', 'na', 'na', 2], ['ニ', 'ni', 'ni', 2], ['ヌ', 'nu', 'nu', 2],
        ['ネ', 'ne', 'ne', 4], ['ノ', 'no', 'no', 1]
      ]},
      { name: 'H row', items: [
        ['ハ', 'ha', 'ha', 2], ['ヒ', 'hi', 'hi', 2], ['フ', 'fu', 'fu', 1],
        ['ヘ', 'he', 'he', 1], ['ホ', 'ho', 'ho', 4]
      ]},
      { name: 'M row', items: [
        ['マ', 'ma', 'ma', 2], ['ミ', 'mi', 'mi', 3], ['ム', 'mu', 'mu', 2],
        ['メ', 'me', 'me', 2], ['モ', 'mo', 'mo', 3]
      ]},
      { name: 'Y row', items: [
        ['ヤ', 'ya', 'ja', 2], ['ユ', 'yu', 'ju', 2], ['ヨ', 'yo', 'jo', 3]
      ]},
      { name: 'R row', items: [
        ['ラ', 'ra', 'ra', 2], ['リ', 'ri', 'ri', 2], ['ル', 'ru', 'ru', 2],
        ['レ', 're', 're', 1], ['ロ', 'ro', 'ro', 3]
      ]},
      { name: 'W row & N', items: [
        ['ワ', 'wa', 'wa', 2], ['ヲ', 'wo', 'o', 3], ['ン', 'n', 'n', 2, 'Compare ソ — ン sweeps up.']
      ]}
    ]
  },

  kanji: {
    lang: 'ja',
    name: 'Starter kanji',
    native: '漢字',
    intro: 'Kanji are borrowed Chinese characters that carry meaning rather '
         + 'than sound. Each has several readings depending on the word. These '
         + 'are the first ones every learner meets.',
    tips: [
      'Write top to bottom, left to right, horizontal before vertical.',
      'An enclosing box is drawn before whatever goes inside it, and closed last.',
      'Stroke count is how kanji are looked up — count as you write.'
    ],
    groups: [
      { name: 'Numbers', items: [
        ['一', 'ichi — one', 'i.tSi', 1], ['二', 'ni — two', 'ni', 2],
        ['三', 'san — three', 'san', 3], ['四', 'shi/yon — four', 'jon', 5],
        ['五', 'go — five', 'go', 4], ['六', 'roku — six', 'ro.ku', 4],
        ['七', 'nana — seven', 'na.na', 2], ['八', 'hachi — eight', 'ha.tSi', 2],
        ['九', 'kyū — nine', 'kju:', 2], ['十', 'jū — ten', 'dZu:', 2]
      ]},
      { name: 'Nature', items: [
        ['日', 'hi/nichi — sun, day', 'hi', 4], ['月', 'tsuki — moon, month', 'tsu.ki', 4],
        ['火', 'hi/ka — fire', 'hi', 4], ['水', 'mizu — water', 'mi.zu', 4],
        ['木', 'ki — tree', 'ki', 4], ['金', 'kane — metal, money', 'ka.ne', 8],
        ['土', 'tsuchi — earth', 'tsu.tSi', 3], ['山', 'yama — mountain', 'ja.ma', 3],
        ['川', 'kawa — river', 'ka.wa', 3], ['田', 'ta — rice field', 'ta', 5]
      ]},
      { name: 'People & things', items: [
        ['人', 'hito — person', 'hi.to', 2], ['口', 'kuchi — mouth', 'ku.tSi', 3],
        ['目', 'me — eye', 'me', 5], ['手', 'te — hand', 'te', 4],
        ['大', 'ōkii — big', 'o:.ki:', 3], ['小', 'chiisai — small', 'tSi:.sai', 3],
        ['中', 'naka — middle', 'na.ka', 4], ['上', 'ue — above', 'u.e', 3],
        ['下', 'shita — below', 'Si.ta', 3], ['本', 'hon — book, origin', 'hon', 5]
      ]}
    ]
  },

  hangul: {
    lang: 'ko',
    name: 'Hangul',
    native: '한글',
    intro: 'Hangul was invented on purpose in 1443 to be easy — the consonant '
         + 'shapes are pictures of where your tongue goes. Most people learn to '
         + 'read it in an afternoon.',
    tips: [
      'Letters stack into square blocks, one block per syllable: ㅎ+ㅏ+ㄴ = 한.',
      'Read a block left to right, then top to bottom.',
      'A block always starts with a consonant. If the syllable really starts with '
        + 'a vowel, ㅇ fills the slot silently.'
    ],
    groups: [
      { name: 'Basic consonants', items: [
        ['ㄱ', 'giyeok — g/k', 'k', 1, 'The shape of the tongue at the back.'],
        ['ㄴ', 'nieun — n', 'n', 1, 'Tongue tip against the ridge.'],
        ['ㄷ', 'digeut — d/t', 't', 2], ['ㄹ', 'rieul — r/l', 'r', 3],
        ['ㅁ', 'mieum — m', 'm', 3, 'A closed mouth.'],
        ['ㅂ', 'bieup — b/p', 'p', 4], ['ㅅ', 'siot — s', 's', 2],
        ['ㅇ', 'ieung — silent / ng', 'N', 1, 'Silent at the start, "ng" at the end.'],
        ['ㅈ', 'jieut — j', 'tS', 3], ['ㅊ', 'chieut — ch', 'tS', 4],
        ['ㅋ', 'kieuk — k', 'k', 2], ['ㅌ', 'tieut — t', 't', 3],
        ['ㅍ', 'pieup — p', 'p', 4], ['ㅎ', 'hieut — h', 'h', 3]
      ]},
      { name: 'Tense consonants', items: [
        ['ㄲ', 'ssang-giyeok — kk', 'k'], ['ㄸ', 'ssang-digeut — tt', 't'],
        ['ㅃ', 'ssang-bieup — pp', 'p'], ['ㅆ', 'ssang-siot — ss', 's'],
        ['ㅉ', 'ssang-jieut — jj', 'tS']
      ]},
      { name: 'Vowels', items: [
        ['ㅏ', 'a', 'a', 2], ['ㅑ', 'ya', 'ja', 3], ['ㅓ', 'eo', 'O', 2],
        ['ㅕ', 'yeo', 'jO', 3], ['ㅗ', 'o', 'o', 2], ['ㅛ', 'yo', 'jo', 3],
        ['ㅜ', 'u', 'u', 2], ['ㅠ', 'yu', 'ju', 3],
        ['ㅡ', 'eu', '@', 1, 'Lips flat and wide.'], ['ㅣ', 'i', 'i', 1]
      ]},
      { name: 'Combined vowels', items: [
        ['ㅐ', 'ae', 'E'], ['ㅔ', 'e', 'e'], ['ㅚ', 'oe', 'we'],
        ['ㅟ', 'wi', 'wi'], ['ㅢ', 'ui', '@i'], ['ㅘ', 'wa', 'wa'], ['ㅝ', 'wo', 'wO']
      ]},
      { name: 'Blocks in action', items: [
        ['한', 'han', 'han', 0, 'ㅎ + ㅏ + ㄴ'],
        ['글', 'geul', 'g@l', 0, 'ㄱ + ㅡ + ㄹ'],
        ['사', 'sa', 'sa', 0, 'ㅅ + ㅏ'],
        ['랑', 'rang', 'raN', 0, 'ㄹ + ㅏ + ㅇ'],
        ['김', 'gim', 'kim', 0, 'ㄱ + ㅣ + ㅁ'],
        ['치', 'chi', 'tSi', 0, 'ㅊ + ㅣ']
      ]}
    ]
  },

  cyrillic: {
    lang: 'ru',
    name: 'Cyrillic',
    native: 'Кириллица',
    intro: 'Thirty-three letters. Some are old friends, some are false friends '
         + '(Р is r, С is s, Н is n), and a few are brand new shapes.',
    tips: [
      'Watch the false friends: В=v, Н=n, Р=r, С=s, У=u, Х=kh.',
      'ь does not make a sound — it softens the letter before it, like adding a tiny y.',
      'Unstressed о drifts toward "a", which is why stress matters so much.'
    ],
    groups: [
      { name: 'Familiar shapes', items: [
        ['А а', 'a', 'a'], ['К к', 'ka', 'k'], ['М м', 'em', 'm'],
        ['О о', 'o', 'o'], ['Т т', 'te', 't'], ['Е е', 'ye', 'je']
      ]},
      { name: 'False friends', items: [
        ['В в', 've', 'v'], ['Н н', 'en', 'n'], ['Р р', 'er', 'r'],
        ['С с', 'es', 's'], ['У у', 'u', 'u'], ['Х х', 'kha', 'x'],
        ['И и', 'i', 'i'], ['Й й', 'short i', 'j']
      ]},
      { name: 'New shapes', items: [
        ['Б б', 'be', 'b'], ['Г г', 'ge', 'g'], ['Д д', 'de', 'd'],
        ['Ё ё', 'yo', 'jo'], ['Ж ж', 'zhe', 'Z'], ['З з', 'ze', 'z'],
        ['Л л', 'el', 'l'], ['П п', 'pe', 'p'], ['Ф ф', 'ef', 'f'],
        ['Ц ц', 'tse', 'ts'], ['Ч ч', 'che', 'tS'], ['Ш ш', 'sha', 'S'],
        ['Щ щ', 'shcha', 'S'], ['Э э', 'e', 'E'], ['Ю ю', 'yu', 'ju'],
        ['Я я', 'ya', 'ja'], ['Ы ы', 'y', 'i', 0, 'Say "ee" with your tongue pulled back.']
      ]},
      { name: 'Silent signs', items: [
        ['Ь ь', 'soft sign', '', 0, 'Softens the letter before it.'],
        ['Ъ ъ', 'hard sign', '', 0, 'Keeps the letter before it hard.']
      ]}
    ]
  },

  greek: {
    lang: 'el',
    name: 'Greek alphabet',
    native: 'Ελληνικό αλφάβητο',
    intro: 'Twenty-four letters, capital and small. You already know many of '
         + 'them from maths and science.',
    tips: [
      'Σ is written ς at the end of a word — same letter, different tail.',
      'Some pairs make one sound: ου = oo, αι = eh, ει/οι = ee, μπ = b, ντ = d.',
      'The accent mark tells you which syllable to stress. Always trust it.'
    ],
    groups: [
      { name: 'Letters', items: [
        ['Α α', 'alpha', 'a'], ['Β β', 'beta — v', 'v'], ['Γ γ', 'gamma', 'G'],
        ['Δ δ', 'delta — soft th', 'D'], ['Ε ε', 'epsilon', 'e'], ['Ζ ζ', 'zeta', 'z'],
        ['Η η', 'eta — ee', 'i'], ['Θ θ', 'theta — th', 'T'], ['Ι ι', 'iota', 'i'],
        ['Κ κ', 'kappa', 'k'], ['Λ λ', 'lambda', 'l'], ['Μ μ', 'mu', 'm'],
        ['Ν ν', 'nu', 'n'], ['Ξ ξ', 'xi — ks', 'ks'], ['Ο ο', 'omicron', 'o'],
        ['Π π', 'pi', 'p'], ['Ρ ρ', 'rho — r', 'r'], ['Σ σ/ς', 'sigma', 's'],
        ['Τ τ', 'tau', 't'], ['Υ υ', 'upsilon — ee', 'i'], ['Φ φ', 'phi — f', 'f'],
        ['Χ χ', 'chi — scrapey h', 'x'], ['Ψ ψ', 'psi — ps', 'ps'], ['Ω ω', 'omega', 'o']
      ]},
      { name: 'Pairs that fuse', items: [
        ['ου', 'oo', 'u'], ['αι', 'eh', 'e'], ['ει', 'ee', 'i'], ['οι', 'ee', 'i'],
        ['μπ', 'b', 'b'], ['ντ', 'd', 'd'], ['γκ', 'g', 'g'], ['τσ', 'ts', 'ts']
      ]}
    ]
  },

  devanagari: {
    lang: 'hi',
    name: 'Devanagari',
    native: 'देवनागरी',
    intro: 'Letters hang from a horizontal line. Each consonant already contains '
         + 'the vowel "a"; other vowels are written as marks hooked onto it.',
    tips: [
      'क is "ka", not "k". To get other vowels, add a sign: का ki की कु कू के को.',
      'The little stroke ् (halant) under a consonant deletes its built-in vowel.',
      'Draw the letter first, then the top line last — like ruling off a word.'
    ],
    groups: [
      { name: 'Vowels', items: [
        ['अ', 'a', 'a'], ['आ', 'aa', 'a:'], ['इ', 'i', 'i'], ['ई', 'ii', 'i:'],
        ['उ', 'u', 'u'], ['ऊ', 'uu', 'u:'], ['ए', 'e', 'e:'], ['ऐ', 'ai', 'E'],
        ['ओ', 'o', 'o:'], ['औ', 'au', 'O']
      ]},
      { name: 'K & CH groups', items: [
        ['क', 'ka', 'ka'], ['ख', 'kha', 'kHa'], ['ग', 'ga', 'ga'], ['घ', 'gha', 'gHa'],
        ['च', 'cha', 'tSa'], ['छ', 'chha', 'tSHa'], ['ज', 'ja', 'dZa'], ['झ', 'jha', 'dZHa']
      ]},
      { name: 'T & D groups', items: [
        ['ट', 'ta (curled tongue)', 'ta'], ['ठ', 'tha', 'tHa'],
        ['ड', 'da (curled tongue)', 'da'], ['ढ', 'dha', 'dHa'],
        ['त', 'ta (soft)', 'ta'], ['थ', 'tha', 'tHa'], ['द', 'da (soft)', 'da'],
        ['ध', 'dha', 'dHa'], ['न', 'na', 'na']
      ]},
      { name: 'P group & rest', items: [
        ['प', 'pa', 'pa'], ['फ', 'pha', 'pHa'], ['ब', 'ba', 'ba'], ['भ', 'bha', 'bHa'],
        ['म', 'ma', 'ma'], ['य', 'ya', 'ja'], ['र', 'ra', 'ra'], ['ल', 'la', 'la'],
        ['व', 'va', 'va'], ['श', 'sha', 'Sa'], ['ष', 'sha', 'Sa'], ['स', 'sa', 'sa'],
        ['ह', 'ha', 'ha']
      ]},
      { name: 'Vowel signs on क', items: [
        ['क', 'ka', 'ka'], ['का', 'kaa', 'ka:'], ['कि', 'ki', 'ki'], ['की', 'kii', 'ki:'],
        ['कु', 'ku', 'ku'], ['कू', 'kuu', 'ku:'], ['के', 'ke', 'ke:'], ['कै', 'kai', 'kE'],
        ['को', 'ko', 'ko:'], ['कौ', 'kau', 'kO'], ['क्', 'k (no vowel)', 'k']
      ]}
    ]
  },

  arabic: {
    lang: 'ar',
    name: 'Arabic letters',
    native: 'الحروف العربية',
    intro: 'Twenty-eight letters written right to left. Letters join to their '
         + 'neighbours, so each one has a slightly different look at the start, '
         + 'middle and end of a word.',
    tips: [
      'Six letters (ا د ذ ر ز و) never join to the left — the word breaks after them.',
      'Short vowels are normally left out; you learn them with the word.',
      'Dots are the whole difference between ب ت ث — count them carefully.'
    ],
    groups: [
      { name: 'Letters', items: [
        ['ا', 'alif', 'a:'], ['ب', 'ba', 'b'], ['ت', 'ta', 't'], ['ث', 'tha', 'T'],
        ['ج', 'jim', 'dZ'], ['ح', 'ha (breathy)', 'H'], ['خ', 'kha', 'x'],
        ['د', 'dal', 'd'], ['ذ', 'dhal', 'D'], ['ر', 'ra', 'r'], ['ز', 'zay', 'z'],
        ['س', 'sin', 's'], ['ش', 'shin', 'S'], ['ص', 'sad (heavy s)', 's'],
        ['ض', 'dad (heavy d)', 'd'], ['ط', 'ta (heavy)', 't'], ['ظ', 'za (heavy)', 'D'],
        ['ع', 'ayn', '3'], ['غ', 'ghayn', 'G'], ['ف', 'fa', 'f'], ['ق', 'qaf', 'q'],
        ['ك', 'kaf', 'k'], ['ل', 'lam', 'l'], ['م', 'mim', 'm'], ['ن', 'nun', 'n'],
        ['ه', 'ha', 'h'], ['و', 'waw', 'w'], ['ي', 'ya', 'j']
      ]},
      { name: 'Joining shapes of ب', items: [
        ['ب', 'on its own', 'b'], ['بـ', 'at the start', 'b'],
        ['ـبـ', 'in the middle', 'b'], ['ـب', 'at the end', 'b']
      ]},
      { name: 'Short vowel marks', items: [
        ['بَ', 'fatha — ba', 'ba'], ['بِ', 'kasra — bi', 'bi'], ['بُ', 'damma — bu', 'bu'],
        ['بْ', 'sukun — b alone', 'b'], ['بّ', 'shadda — doubled', 'bb']
      ]}
    ]
  },

  pinyin: {
    lang: 'zh',
    name: 'Pinyin & tones',
    native: '拼音',
    intro: 'Pinyin spells Mandarin with Latin letters — but several letters do '
         + 'not say what you expect. Get these right and your pronunciation '
         + 'jumps immediately.',
    tips: [
      'The tone mark sits on the vowel: mā má mǎ mà are four different words.',
      'q, x, j are said with the tongue flat and the lips smiling.',
      'zh, ch, sh, r are said with the tongue curled back.'
    ],
    groups: [
      { name: 'Tricky beginnings', items: [
        ['b', 'like p without the puff', 'b'], ['p', 'p with a strong puff', 'pH'],
        ['z', 'like "ds"', 'ts'], ['c', 'like "ts" with a puff', 'ts'],
        ['zh', 'j, tongue curled back', 'dZ'], ['ch', 'ch, tongue curled back', 'tS'],
        ['sh', 'sh, tongue curled back', 'S'], ['r', 'between r and zh', 'Z'],
        ['j', 'j, tongue flat and smiling', 'dZ'], ['q', 'ch, tongue flat and smiling', 'tS'],
        ['x', 'sh, tongue flat and smiling', 'S']
      ]},
      { name: 'Tricky endings', items: [
        ['-i (after zh ch sh r z c s)', 'a buzzing held sound', '@'],
        ['ü', 'ee with rounded lips', 'y'], ['e', 'like the vowel in "duh"', '@'],
        ['ian', 'sounds like "yen"', 'jen'], ['ong', 'oong', 'oN'],
        ['ui', 'way', 'wei'], ['iu', 'yo', 'jou']
      ]},
      { name: 'The four tones', items: [
        ['mā 妈', '1st — high and flat (mother)', 'ma'],
        ['má 麻', '2nd — rising, like a question (hemp)', 'ma'],
        ['mǎ 马', '3rd — dipping down then up (horse)', 'ma'],
        ['mà 骂', '4th — sharp falling (to scold)', 'ma'],
        ['ma 吗', 'neutral — light and quick (question word)', 'ma']
      ]}
    ]
  },

  hanzi: {
    lang: 'zh',
    name: 'Starter characters',
    native: '汉字',
    intro: 'Chinese characters are built from a small set of repeating parts. '
         + 'Learn the parts and the thousands stop looking random.',
    tips: [
      'Stroke order: top to bottom, left to right, horizontal before vertical.',
      'An enclosing box is closed last — write 口 as left, top-and-right, then the base.',
      'Many characters pair a meaning part with a sound part: 妈 = 女 (woman) + 马 (mǎ).'
    ],
    groups: [
      { name: 'Numbers', items: [
        ['一', 'yī — one', 'i', 1], ['二', 'èr — two', 'ar', 2], ['三', 'sān — three', 'san', 3],
        ['四', 'sì — four', 's@', 5], ['五', 'wǔ — five', 'u', 4], ['六', 'liù — six', 'ljou', 4],
        ['七', 'qī — seven', 'tSi', 2], ['八', 'bā — eight', 'ba', 2],
        ['九', 'jiǔ — nine', 'dZjou', 2], ['十', 'shí — ten', 'S@', 2]
      ]},
      { name: 'Everyday characters', items: [
        ['人', 'rén — person', 'Z@n', 2], ['大', 'dà — big', 'da', 3],
        ['小', 'xiǎo — small', 'Sjau', 3], ['中', 'zhōng — middle', 'dZoN', 4],
        ['国', 'guó — country', 'gwo', 8], ['日', 'rì — sun, day', 'Z@', 4],
        ['月', 'yuè — moon, month', 'ye', 4], ['水', 'shuǐ — water', 'Swei', 4],
        ['火', 'huǒ — fire', 'hwo', 4], ['山', 'shān — mountain', 'San', 3],
        ['好', 'hǎo — good', 'hau', 6], ['我', 'wǒ — I, me', 'wo', 7]
      ]}
    ]
  }
};

const SCRIPT_ORDER = ['hiragana', 'katakana', 'kanji', 'hangul', 'pinyin', 'hanzi',
                      'cyrillic', 'greek', 'devanagari', 'arabic'];
