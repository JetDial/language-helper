# Sound It Out

A language-learning site that writes foreign words **the way you already read** —
if you write Kreyòl, English *nice* comes out as `nays`, and Japanese ありがとう
comes out as `a-ri-ga-to`, not as IPA and not as somebody else's romanisation.

Open `index.html` in a browser. There is no build step, no install, no server
required, and nothing is uploaded anywhere.

## What it does

**Learn** — a phrasebook for 53 languages. Each word shows the real writing,
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

**53 languages to learn.** Nine of them — Japanese, Korean, Mandarin, Russian,
Arabic, Hindi, Greek, Spanish and French — have a full phrasebook of 30-odd
words plus a rule-based reader for pasted text. The rest carry a core sixteen:
hello, goodbye, thank you, please, sorry, yes, no, water, food, friend, one,
two, three, love, how much, toilet.

Afrikaans · Albanian · Amharic · Arabic · Armenian · Bengali · Bulgarian ·
Catalan · Croatian · Czech · Danish · Dutch · English · Esperanto · Finnish ·
French · Georgian · German · Greek · Haitian Creole · Hausa · Hebrew · Hindi ·
Hungarian · Indonesian · Italian · Japanese · Korean · Mandarin · Marathi ·
Mongolian · Nepali · Norwegian · Persian · Polish · Portuguese · Romanian ·
Russian · Serbian · Slovak · Somali · Spanish · Swahili · Tagalog · Tamil ·
Thai · Turkish · Ukrainian · Urdu · Vietnamese · Yoruba · Zulu

**26 spellings to read in**, including four that are not the Latin alphabet:

* Latin — Haitian Creole, English, Spanish, French, Portuguese, Italian, German,
  Dutch, Afrikaans, Polish, Czech, Hungarian, Romanian, Turkish, Albanian,
  Finnish, Tagalog, Indonesian, Swahili, Yoruba, Somali, Vietnamese
* Cyrillic — Japanese respelled as ари-га-то for a Russian reader
* Greek letters, Arabic letters, and Devanagari, each writing foreign words the
  way that script normally borrows them

That is 1,300-odd language-and-spelling combinations, and every one is checked
to render cleanly.

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

**A web page can only use voices the computer already has.** This is the one
part the site genuinely cannot do for itself: there is no way to synthesise a
Japanese accent out of nothing. When a real voice for the language is installed,
that voice speaks the actual word and it sounds native. When it is not, you get
an imitation.

Click the status pill in the top bar for the voice panel: it lists all 53
languages and whether this computer can really speak each one, lets you choose
between voices when there are several, and gives the steps to install more.
Free, and it takes a minute:

* **Windows** — Settings → Time & language → Language & region → *Add a
  language*, tick *Speech* on the options screen, restart the browser. The
  newer "Natural" voices are excellent.
* **Chrome** — ships Google voices for dozens of languages with nothing to
  install. If a language looks missing, try the page in Chrome first.

Words are spoken by a real voice for the language when the machine has one
installed.

When it does not, the app does **not** read the respelling on the screen out
loud — that spelling was written for your eyes, and an English voice handed
`kòn-ni-tchi-wa` says something ridiculous. Instead the *sounds* are respelled
a second time for the language of whichever voice is actually installed, and
that is what gets spoken:

```
こんにちは   on screen (Kreyòl):  kòn-ni-tchi-wa
            to the speaker:      kohn-neecheewah     (an English voice)
```

The syllables are then run together into one word — a space would make the
engine read four chopped-up words instead of one flowing one — except where
joining them would blur two beats into one, as "ee" + "eh" would in いいえ.
Stress capitals are stripped too, because many engines read an all-caps
syllable as an abbreviation and spell it out.

A word whose sounds are not known stays silent rather than being guessed at,
and the app says so — that is the cue to click it and teach it. The dot in the
top bar always tells you which of the three is happening.

## Files

```
index.html
css/styles.css
js/sound.js          the sound inventory and the respelling engine
js/orthographies.js  how each language you might read writes each sound
js/data-words.js     the nine full phrasebooks
js/data-core.js      the other forty-four languages, sixteen words each
js/data-scripts.js   the writing systems
js/transcribe.js     real script -> sounds, by rule
js/dictionary.js     meanings, word splitting for Japanese and Chinese
js/mywords.js        your own spellings and meanings
js/speech.js         speaking, and the fallback voice
js/app.js            the interface
```
