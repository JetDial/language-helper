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

There are three ways this site can say a word, best first.

### 1. A recording of a real person

The best pronunciation is not synthesised at all. `tools/get-recordings.py`
downloads clips of actual native speakers from Wikimedia Commons — most of them
from Lingua Libre, where volunteers record their own language word by word —
and drops them in `audio/`:

```
python tools/get-recordings.py --list        # the language codes
python tools/get-recordings.py ja ru ko      # a few languages
python tools/get-recordings.py --all         # everything
python tools/get-recordings.py --repair      # rebuild the index from the folder
```

Free, permanently licensed, no account and no key. Once downloaded it all works
offline, and nothing is sent anywhere when you press play. The tool is
resumable — stop it and run it again whenever. Every speaker and licence is
recorded in `audio/CREDITS.md`, and the words that have one are marked
**● real voice** in the app.

Coverage varies a lot by language: common words in well-covered languages
(Russian, German, French, Swahili) usually have one, rarer words and smaller
languages often do not. Anything without a recording falls back to speech.

The clips are not in git — they are other people's recordings and can run to
hundreds of megabytes. Run the tool to create the folder.

### 2. Coqui TTS — the best-sounding offline engine

[Coqui TTS](https://github.com/idiap/coqui-ai-TTS) is a neural engine that runs
locally. It is the heaviest of the three — it pulls in PyTorch, and each voice
is its own download — and the best sounding.

```
pip install coqui-tts[codec,ja]
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu
python tools/make-voices.py --engine coqui --check
python tools/make-voices.py --engine coqui ja ko ru
```

It uses Coqui's own single-language models by default. Its best model, **XTTS
v2**, covers seventeen languages at once and sounds better still, but it is
released under a licence that permits **non-commercial use only** — so the tool
will not download it until you have read that licence and passed
`--accept-licence`. It never agrees on your behalf.

Notes from getting it working here: it needs `transformers` below version 5,
the `codec` extra for audio, and the `ja` extra before it will speak Japanese.
Meta's MMS models (`fairseq`), which would add another fifty languages, are
served from a host that refused the download here — the tool falls back
automatically.

### 3. eSpeak NG — every word, every language, offline

[eSpeak NG](https://github.com/espeak-ng/espeak-ng) is a tiny free speech engine
that covers **47 of the 53 languages here, Japanese included**. It sounds
robotic — it builds speech out of formants rather than recorded human sound —
but it says the right sounds, which is the part that matters when you are
learning a word, and it works for every word offline.

```
pip install espeakng-loader
python tools/make-voices.py --check      # which languages it can speak
python tools/make-voices.py --all        # speak every word, about 23 MB
```

No per-language download, no binary to install: `espeakng-loader` ships the
library and its data, and the tool calls it directly. It skips anything that
already has audio, so human recordings are never painted over.

Missing from eSpeak: Hausa, Mongolian, Somali, Tagalog, Yoruba and Zulu.

### 4. Piper, a middle option

[Piper](https://github.com/OHF-Voice/piper1-gpl) is an open-source neural
speech engine that runs on your own machine. It sounds far closer to a person
than the voices Windows ships, it is free, and it never sends anything
anywhere. It covers **47 of the languages here** — but not Japanese.

```
pip install piper-tts
python tools/make-voices.py --voices     # every voice it has
python tools/make-voices.py es ru de     # speak those languages
```

It writes into the same `audio/` folder, so it fills in every word that has no
human recording, and leaves the human ones alone. The first run for a language
downloads a 40-70 MB voice, then works offline forever. Generated words are
marked **● offline voice** rather than ● real voice — synthetic is synthetic,
and the app does not pretend otherwise.

**For Japanese**, which Piper has no voice for: install the Windows Japanese
speech pack, use Chrome's built-in Google voice, or try
[VOICEVOX](https://voicevox.hiroshiba.jp/) — free, excellent, Japanese-only.

Also worth knowing: **RHVoice** installs as a Windows voice, so it turns up in
the browser by itself — good for Russian, Ukrainian, Georgian and Esperanto.

### 5. A real voice for the language

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

### 6. Sounding it out

When there is no recording and no voice for the language, the app does **not** read the respelling on the screen out
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
js/recordings.js     real human clips from the audio/ folder
js/speech.js         speaking, and the fallback voice
tools/get-recordings.py  downloads human recordings from Wikimedia Commons
tools/make-voices.py     speaks every word with eSpeak NG or Piper
tools/espeak_engine.py   drives the eSpeak NG library directly
tools/coqui_engine.py    picks and drives Coqui's models
js/app.js            the interface
```
