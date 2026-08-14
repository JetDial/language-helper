# Sound It Out

A language-learning site that writes foreign words **the way you already read** —
if you write Kreyòl, English *nice* comes out as `nays`, and Japanese ありがとう
comes out as `a-ri-ga-to`, not as IPA and not as somebody else's romanisation.

Open `index.html` in a browser. There is no build step, no install, no server
required, and nothing is uploaded anywhere.

## What it does

**Learn** — a phrasebook for nine languages. Each word shows the real writing,
the standard romanisation, and the respelling in *your* language's spelling.
"Break it down" splits a word into syllables and shows which sound each letter
is carrying.

**Write** — the writing systems themselves: hiragana, katakana, starter kanji,
Hangul, pinyin, Chinese characters, Cyrillic, Greek, Devanagari and Arabic.
Pick a character and trace it on the pad with a mouse or a finger, with stroke
counts and the sound written your way.

**Read anything** — paste real text in Japanese, Korean, Russian, Greek, Hindi
or Arabic (or type pinyin) and get it back word by word: the original writing,
your spelling, and what each word means. Click any word to fix the spelling or
add the meaning.

**My spellings** — the part that makes it yours. Two layers:

* *word by word* — hear a word, write it however it sounds to you, save it.
  From then on that word appears in your spelling everywhere in the app,
  including in anything you paste into Read anything.
* *sound by sound* — decide once that the "sh" sound is written `ch` for you,
  and every word in the app changes at once.

Both are stored in your browser. Use **Back up** to download a copy.

**Practice** — three quiz modes: hear it and pick the writing, read it and pick
the meaning, or see your own spelling and pick the writing.

## Languages

You can read in: Haitian Creole, English, Spanish, French, Portuguese, Italian,
German, Tagalog, Indonesian, Swahili, Vietnamese.

You can learn: Japanese, Korean, Mandarin, Russian, Arabic, Hindi, Greek,
Spanish, French.

## How it works

No word is stored as text. Every word is stored as a **sequence of sounds**:

```
ありがとう   ->   a.ri.ga.to:      ->   Kreyòl: a-ri-ga-to
                                  ->   English: ah-ree-gah-toh
                                  ->   Spanish: a-ri-ga-to
```

An *orthography* is a small table saying how one language writes each sound.
Adding a new language you can read means adding one table — around forty
entries — not re-writing the phrasebook. The same tables are what your personal
sound choices override.

Text you paste is turned into sounds by rule, not by a dictionary, so it works
on words the app has never seen: kana, Hangul blocks (including the sliding
final consonant and the compulsory nasal changes), Cyrillic, Greek digraphs and
accents, Devanagari conjuncts and the dropped final vowel, and Arabic roots.

### Where it is honest about being approximate

* Arabic normally leaves the short vowels out of the writing. A plain "a" is
  filled in so the word is sayable, and the app says so.
* Russian does not write which syllable is stressed, and unstressed о drifts
  toward "a" — words are shown as spelled.
* Chinese characters need a dictionary to read; common words are built in, and
  anything else you type as pinyin or teach it yourself.
* Meanings come from a built-in glossary of common words plus the phrasebook.
  Anything unknown is marked unknown rather than guessed at, and you can save
  your own meaning for it.

## Sound

Words are spoken by a real voice for the language when the machine has one
installed. When it does not, the app reads *your respelling* aloud using a
voice for the language you speak — which lands surprisingly close. The dot in
the top bar tells you which of the two is happening.

To add voices on Windows: Settings → Time & language → Language & region → Add
a language, and tick the speech option.

## Files

```
index.html
css/styles.css
js/sound.js          the sound inventory and the respelling engine
js/orthographies.js  how each language you might read writes each sound
js/data-words.js     the phrasebook
js/data-scripts.js   the writing systems
js/transcribe.js     real script -> sounds, by rule
js/dictionary.js     meanings, word splitting for Japanese and Chinese
js/mywords.js        your own spellings and meanings
js/speech.js         speaking, and the fallback voice
js/app.js            the interface
```
