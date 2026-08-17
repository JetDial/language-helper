#!/usr/bin/env python3
"""Speak every word, into the same audio/ folder the site reads.

Four engines. Three run entirely on your own machine with no account, no key
and nothing sent anywhere:

  eSpeak NG  --engine espeak, pip install espeakng-loader
      Tiny and covers every language on this site, Japanese included. It sounds
      robotic — it builds speech out of formants rather than recorded human
      sound — but it says the right sounds, which is what you need when you are
      learning a word. Nothing to download per language.

  Piper      --engine piper, pip install piper-tts
      A neural engine that sounds close to a real person, for 47 of the
      languages here. Not Japanese. Downloads a 40-70 MB voice per language.

  Coqui      --engine coqui, pip install coqui-tts
      The best-sounding fully offline engine. Heaviest to install (pulls in
      PyTorch); see tools/coqui_engine.py.

The fourth is not offline — it is a free online service, not a download:

  edge-tts   --engine edge, pip install edge-tts
      Microsoft Edge's own online neural voices: the most natural-sounding of
      the four, and the only one that covers Mongolian, Somali,
      Tagalog/Filipino and Zulu. No account, no key, but each word is a
      network call while this tool runs — the clip it saves then plays back
      offline from audio/ forever after, same as the other three.

    python tools/make-voices.py --check           # what each engine can do
    python tools/make-voices.py ja ko ru          # a few languages
    python tools/make-voices.py --all             # every language at once
    python tools/make-voices.py es --engine piper
    python tools/make-voices.py yo ha --engine edge

This fills the same audio/ folder as get-recordings.py, so the two work
together: recordings of real people are kept and never overwritten, and the
engine covers every word that has none. The site plays whatever is there, and
marks which is which.
"""

import argparse
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
AUDIO = os.path.join(ROOT, 'audio')
VOICE_DIR = os.path.join(HERE, 'piper-voices')

for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# get-recordings.py has the word-list reader and the index writer; its filename
# has a dash in it, so it is loaded by path rather than imported by name.
import importlib.util                                    # noqa: E402
_spec = importlib.util.spec_from_file_location('getrec', os.path.join(HERE, 'get-recordings.py'))
getrec = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(getrec)

sys.path.insert(0, HERE)
import espeak_engine                                     # noqa: E402
import coqui_engine                                      # noqa: E402
import edge_engine                                       # noqa: E402

# One good default voice per language. Any other name from --voices works too.
DEFAULT_VOICE = {
    'ar': 'ar_JO-kareem-medium', 'bg': 'bg_BG-dimitar-medium',
    'bn': 'bn_BD-google-medium', 'ca': 'ca_ES-upc_ona-medium',
    'cs': 'cs_CZ-jirka-medium', 'da': 'da_DK-talesyntese-medium',
    'de': 'de_DE-thorsten-medium', 'el': 'el_GR-rapunzelina-low',
    'en': 'en_US-lessac-medium', 'es': 'es_ES-davefx-medium',
    'fa': 'fa_IR-amir-medium', 'fi': 'fi_FI-harri-medium',
    'fr': 'fr_FR-siwis-medium', 'he': 'he_IL-saspeech-medium',
    'hi': 'hi_IN-pratham-medium', 'hu': 'hu_HU-anna-medium',
    'hy': 'hy_AM-gor-medium', 'id': 'id_ID-news_tts-medium',
    'is': 'is_IS-salka-medium', 'it': 'it_IT-paola-medium',
    'ka': 'ka_GE-natia-medium', 'ko': 'ko_KR-kss-medium',
    'ml': 'ml_IN-arjun-medium', 'mr': 'mr_IN-google-medium',
    'ne': 'ne_NP-chitwan-medium', 'nl': 'nl_NL-mls-medium',
    'no': 'no_NO-talesyntese-medium', 'pl': 'pl_PL-gosia-medium',
    'pt': 'pt_BR-faber-medium', 'ro': 'ro_RO-mihai-medium',
    'ru': 'ru_RU-irina-medium', 'sk': 'sk_SK-lili-medium',
    'sl': 'sl_SI-artur-medium', 'sq': 'sq_AL-edon-medium',
    'sr': 'sr_RS-serbski_institut-medium', 'sv': 'sv_SE-nst-medium',
    'sw': 'sw_CD-lanfrica-medium', 'tr': 'tr_TR-dfki-medium',
    'uk': 'uk_UA-tetiana-high', 'ur': 'ur_PK-fasih-medium',
    'vi': 'vi_VN-vais1000-medium', 'zh': 'zh_CN-huayan-medium',
}


def run(args, **kw):
    return subprocess.run([sys.executable, '-m'] + args,
                          capture_output=True, text=True, **kw)


def have_piper():
    out = run(['piper', '--help'])
    return out.returncode == 0


def list_voices():
    out = run(['piper.download_voices'])
    names = sorted(set(re.findall(r'\b[a-z]{2}_[A-Z]{2}-[\w]+-(?:x_low|low|medium|high)\b',
                                  out.stdout + out.stderr)))
    return names


def ensure_voice(name):
    onnx = os.path.join(VOICE_DIR, name + '.onnx')
    if os.path.exists(onnx):
        return onnx
    os.makedirs(VOICE_DIR, exist_ok=True)
    print('  downloading the %s voice (once, then it is yours offline)' % name)
    out = run(['piper.download_voices', name, '--download-dir', VOICE_DIR])
    if not os.path.exists(onnx):
        print(out.stderr.strip()[-400:] or out.stdout.strip()[-400:])
        return None
    return onnx


def say(model, text, path):
    # Piper opens -f itself and writes as it goes, so a mid-synthesis crash
    # can leave a truncated file sitting at the real destination -- wiping
    # out whatever (possibly good) clip was there already. Writing to a temp
    # name and renaming only on success means a crash can never do that.
    tmp = path + '.new.wav'
    proc = subprocess.run(
        [sys.executable, '-m', 'piper', '-m', model, '-f', tmp],
        input=text, capture_output=True, text=True, encoding='utf-8')
    ok = os.path.exists(tmp) and os.path.getsize(tmp) > 1000
    if ok:
        os.replace(tmp, path)
    elif os.path.exists(tmp):
        os.remove(tmp)
    return ok, proc.stderr


def open_index():
    """The shared audio index, minus the bookkeeping keys."""
    os.makedirs(AUDIO, exist_ok=True)
    index_path = os.path.join(AUDIO, 'index.json')
    index = {}
    if os.path.exists(index_path):
        with open(index_path, encoding='utf-8') as fh:
            index = json.load(fh)
    credits = index.pop('_credits', {})
    index.pop('_source', None)
    return index_path, index, credits


def is_human(credits, lang, index, written):
    """True if the clip already on file for this word is a real recording.

    --replace exists to let a better *synthetic* engine redo a worse one's
    work, never to paint over an actual person -- so this is checked before
    any engine is allowed to overwrite something that is already there.
    """
    name = index.get(lang, {}).get(written)
    if not name:
        return False
    c = credits.get(lang, {}).get(name)
    return bool(c) and c.get('licence') != 'generated locally'


def check(args):
    """Report which languages the chosen engine can actually speak."""
    words = getrec.word_lists()
    if args.engine == 'piper':
        can = sorted(set(DEFAULT_VOICE) & set(words))
        cannot = sorted(set(words) - set(DEFAULT_VOICE))
        print('Piper can speak %d of the %d languages here.\n' % (len(can), len(words)))
    elif args.engine == 'coqui':
        can = sorted(set(coqui_engine.ISO3) & set(words))
        cannot = sorted(set(words) - set(coqui_engine.ISO3))
        best = sorted(set(coqui_engine.XTTS_LANGS) & set(words))
        print('Coqui can speak %d of the %d languages here.' % (len(can), len(words)))
        print('Its best model, XTTS, covers %d of them: %s\n' % (len(best), ' '.join(best)))
    elif args.engine == 'edge':
        can = sorted(l for l in words if edge_engine.voice_for(l))
        cannot = sorted(set(words) - set(can))
        print('edge-tts can speak %d of the %d languages here (checked online).\n'
              % (len(can), len(words)))
    else:
        engine = espeak_engine.Espeak(rate=args.rate)
        can, cannot = [], []
        for lang in sorted(words):
            (can if engine.set_language(lang) else cannot).append(lang)
        print('eSpeak NG can speak %d of the %d languages here.\n'
              % (len(can), len(words)))
    print('  yes: ' + ' '.join(can))
    if cannot:
        print('\n  no:  ' + ' '.join(cannot))
        print('\nThose keep whatever they already have: a human recording if one was '
              'downloaded, otherwise the browser sounding the word out.')
    return 0


def run_coqui(args, words, targets):
    engine = coqui_engine.Coqui(prefer_xtts=not args.no_xtts,
                                accept_licence=args.accept_licence)
    index_path, index, credits = open_index()

    if not args.accept_licence and not args.no_xtts:
        wanted = [l for l in targets if l in coqui_engine.XTTS_LANGS]
        if wanted:
            print('XTTS, the best Coqui model, is under the Coqui Public Model '
                  'License:\n  https://coqui.ai/cpml\nIt permits non-commercial use '
                  'only. Read it, then re-run with --accept-licence to use it for\n  '
                  + ' '.join(wanted)
                  + '\nWithout that, the smaller per-language models are used, which '
                    'are CC BY-NC 4.0.\n')

    for lang in targets:
        if lang not in words:
            print('%s: not a language here' % lang)
            continue

        print('\n%s - loading %s' % (lang, engine.model_for(lang) or 'nothing'))
        ok, info = engine.load(lang)
        if not ok:
            print('  %s, skipping' % info)
            continue
        print('  using %s' % info)

        folder = os.path.join(AUDIO, lang)
        os.makedirs(folder, exist_ok=True)
        index.setdefault(lang, {})
        made = kept = 0

        for written, _roman in words[lang]:
            if index[lang].get(written) and (is_human(credits, lang, index, written) or not args.replace):
                kept += 1
                continue
            name = getrec.safe_name(written, '.wav')
            good, detail = engine.say(written, os.path.join(folder, name))
            if not good:
                print('  FAIL %-24s %s' % (written[:24], detail))
                continue
            index[lang][written] = name
            credits.setdefault(lang, {})[name] = {
                'word': written, 'file': 'made by Coqui TTS',
                'author': engine._model_name, 'licence': 'generated locally',
            }
            made += 1
            print('  ok   %-24s %.0f kB' % (written[:24], detail / 1024.0))

        getrec.save_all(index_path, index, credits)
        print('  %d spoken, %d already had audio, %d of %d words covered'
              % (made, kept, len(index[lang]), len(words[lang])))

    total = sum(len(v) for k, v in index.items() if not k.startswith('_'))
    print('\nDone. %d clips in audio/. Reload the site.' % total)
    return 0


def run_espeak(args, words, targets):
    engine = espeak_engine.Espeak(rate=args.rate)
    index_path, index, credits = open_index()
    source = {}
    for lang, files in credits.items():
        for c in files.values():
            source.setdefault(lang, {})[c['word']] = (
                'made' if c.get('licence') == 'generated locally' else 'human')

    for lang in targets:
        if lang not in words:
            print('%s: not a language here' % lang)
            continue
        voice = engine.set_language(lang)
        if not voice:
            print('\n%s - eSpeak has no voice for this one, skipping' % lang)
            continue

        print('\n%s - eSpeak voice "%s"' % (lang, voice))
        folder = os.path.join(AUDIO, lang)
        os.makedirs(folder, exist_ok=True)
        index.setdefault(lang, {})
        made = kept = 0

        for written, _roman in words[lang]:
            # Anything already there is either a recording of a person or a
            # better engine's work, so leave it alone unless asked not to.
            if index[lang].get(written) and (is_human(credits, lang, index, written) or not args.replace):
                kept += 1
                continue
            name = getrec.safe_name(written, '.wav')
            ok, info = engine.say(written, os.path.join(folder, name))
            if not ok:
                print('  FAIL %-24s %s' % (written[:24], info))
                continue
            index[lang][written] = name
            credits.setdefault(lang, {})[name] = {
                'word': written, 'file': 'made by eSpeak NG',
                'author': 'espeak-ng voice "%s"' % voice,
                'licence': 'generated locally',
            }
            made += 1

        getrec.save_all(index_path, index, credits)
        print('  %d spoken, %d already had audio, %d of %d words covered'
              % (made, kept, len(index[lang]), len(words[lang])))

    total = sum(len(v) for k, v in index.items() if not k.startswith('_'))
    print('\nDone. %d clips in audio/. Reload the site.' % total)
    return 0


def trim_edge_clips(args, words, targets):
    """Re-trim clips Edge already made, in place, no network call.

    Edge tends to pad every clip with dead air -- often close to a full
    second trailing a short word -- and edge_engine.trim_silence() now cuts
    that down at generation time, but everything made before that existed
    still has it. This applies the same cut to what is already on disk.
    """
    index_path, index, credits = open_index()
    total_trimmed = total_skipped = 0
    for lang in targets:
        if lang not in words or lang not in index:
            continue
        folder = os.path.join(AUDIO, lang)
        lang_trimmed = lang_skipped = 0
        for written, _roman in words[lang]:
            name = index[lang].get(written)
            if not name or not name.endswith('.mp3'):
                continue
            c = credits.get(lang, {}).get(name, {})
            if 'edge-tts' not in c.get('file', ''):
                continue                   # only Edge's own output needs this
            path = os.path.join(folder, name)
            if not os.path.exists(path):
                continue
            before = os.path.getsize(path)
            edge_engine.trim_silence(path)
            after = os.path.getsize(path) if os.path.exists(path) else 0
            if after and after < before:
                lang_trimmed += 1
            else:
                lang_skipped += 1
        if lang_trimmed or lang_skipped:
            print('%s: trimmed %d clips, %d already tight' % (lang, lang_trimmed, lang_skipped))
        total_trimmed += lang_trimmed
        total_skipped += lang_skipped
    print('\nDone. %d trimmed, %d already tight or missing.' % (total_trimmed, total_skipped))
    return 0


def run_edge(args, words, targets):
    engine = edge_engine.Edge()
    index_path, index, credits = open_index()

    # A word that is only ever spoken alone -- a bare alphabet letter, never
    # a real word in its own right -- comes back from Edge as little more
    # than silence: there is no sentence for the model to find prosody in.
    # Saying it twice reliably gives it enough to work with. Anything that is
    # *also* a real phrasebook word (many single kanji are both) is left
    # alone, since doubling would repeat a whole word, not a bare sound.
    phrasebook_texts = {w for rows in getrec.phrasebook_words().values() for w, _ in rows}
    speak_twice = {
        lang: {ch for ch, _ in rows if ch not in phrasebook_texts}
        for lang, rows in getrec.script_words(phonetic_only=True).items()
    }

    for lang in targets:
        if lang not in words:
            print('%s: not a language here' % lang)
            continue
        voice = engine.set_language(lang)
        if not voice:
            print('\n%s - edge-tts has no voice for this one, skipping' % lang)
            continue

        print('\n%s - Edge voice "%s"' % (lang, voice))
        folder = os.path.join(AUDIO, lang)
        os.makedirs(folder, exist_ok=True)
        index.setdefault(lang, {})
        made = kept = 0
        twice = speak_twice.get(lang, set())

        for written, _roman in words[lang]:
            if index[lang].get(written) and (is_human(credits, lang, index, written) or not args.replace):
                kept += 1
                continue
            name = getrec.safe_name(written, '.mp3')
            speak_text = written * 2 if written in twice else written
            ok, info = engine.say(speak_text, os.path.join(folder, name))
            if not ok:
                print('  FAIL %-24s %s' % (written[:24], info))
                continue
            index[lang][written] = name
            credits.setdefault(lang, {})[name] = {
                'word': written, 'file': 'made by edge-tts (Microsoft Edge, online)',
                'author': 'Edge voice "%s"' % voice,
                'licence': 'generated locally',
            }
            made += 1

        getrec.save_all(index_path, index, credits)
        print('  %d spoken, %d already had audio, %d of %d words covered'
              % (made, kept, len(index[lang]), len(words[lang])))

    total = sum(len(v) for k, v in index.items() if not k.startswith('_'))
    print('\nDone. %d clips in audio/. Reload the site.' % total)
    return 0


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('languages', nargs='*', help='language codes, e.g. es ru de')
    ap.add_argument('--engine', choices=['coqui', 'espeak', 'piper', 'edge'], default='coqui',
                    help='coqui sounds best offline and covers the most; espeak is '
                         'tiny and instant; piper is in between; edge sounds the most '
                         'natural of all but needs the internet while it runs '
                         '(default: coqui)')
    ap.add_argument('--accept-licence', '--accept-license', action='store_true',
                    dest='accept_licence',
                    help='accept the Coqui Public Model License for XTTS, which '
                         'permits non-commercial use only. Read it first; without '
                         'this the smaller per-language models are used instead.')
    ap.add_argument('--no-xtts', action='store_true',
                    help='use the smaller per-language Coqui models even for the '
                         'languages XTTS covers')
    ap.add_argument('--voice', help='use this exact Piper voice for every language given')
    ap.add_argument('--voices', action='store_true', help='list every Piper voice and stop')
    ap.add_argument('--check', action='store_true',
                    help='say which languages the chosen engine can speak, and stop')
    ap.add_argument('--all', action='store_true', help='every language the engine can do')
    ap.add_argument('--rate', type=int, default=150, metavar='WPM',
                    help='eSpeak speaking speed, words per minute (default 150; '
                         'its own default of 175 is fast for a learner)')
    ap.add_argument('--replace', action='store_true',
                    help='overwrite words that already have audio (by default the '
                         'human recordings already there are kept)')
    ap.add_argument('--trim', action='store_true',
                    help='re-trim the dead air off clips edge-tts already made, in '
                         'place, with no network call (--engine edge only)')
    args = ap.parse_args()

    if args.engine == 'coqui' and not coqui_engine.available():
        print('Coqui TTS is not installed. Run:\n\n'
              '    pip install coqui-tts\n'
              '    pip install torch torchaudio --index-url '
              'https://download.pytorch.org/whl/cpu\n')
        return 1
    if args.engine == 'espeak' and not espeak_engine.available():
        print('eSpeak NG is not installed. Run:\n\n    pip install espeakng-loader\n')
        return 1
    if args.engine == 'piper' and not have_piper():
        print('Piper is not installed. Run:\n\n    pip install piper-tts\n')
        return 1
    if args.engine == 'edge' and not edge_engine.available():
        print('edge-tts is not installed. Run:\n\n    pip install edge-tts\n')
        return 1

    if args.check:
        return check(args)

    if args.voices:
        names = list_voices()
        print('%d Piper voices:\n' % len(names))
        for n in names:
            print('  ' + n)
        return 0

    words = getrec.word_lists()
    targets = args.languages
    if args.all:
        if args.engine == 'espeak':
            targets = sorted(set(espeak_engine.LANG_CANDIDATES) & set(words))
        elif args.engine == 'coqui':
            targets = sorted(set(coqui_engine.ISO3) & set(words))
        elif args.engine == 'edge':
            targets = sorted(l for l in words if edge_engine.voice_for(l))
        else:
            targets = sorted(set(DEFAULT_VOICE) & set(words))
    if not targets:
        ap.print_help()
        return 1

    if args.trim:
        return trim_edge_clips(args, words, targets)

    if args.engine == 'espeak':
        return run_espeak(args, words, targets)
    if args.engine == 'coqui':
        return run_coqui(args, words, targets)
    if args.engine == 'edge':
        return run_edge(args, words, targets)

    index_path, index, credits = open_index()

    for lang in targets:
        if lang not in words:
            print('%s: not a language here' % lang)
            continue
        voice = args.voice or DEFAULT_VOICE.get(lang)
        if not voice:
            print('%s: Piper has no voice for this one, skipping' % lang)
            continue

        print('\n%s - %s' % (lang, voice))
        model = ensure_voice(voice)
        if not model:
            print('  could not get that voice, skipping')
            continue

        folder = os.path.join(AUDIO, lang)
        os.makedirs(folder, exist_ok=True)
        index.setdefault(lang, {})
        made = 0

        for written, _roman in words[lang]:
            if written in index[lang] and (is_human(credits, lang, index, written) or not args.replace):
                continue                       # a real recording beats a synthetic one
            name = getrec.safe_name(written, '.wav')
            ok, err = say(model, written, os.path.join(folder, name))
            if not ok:
                print('  FAIL %-24s %s' % (written[:24], (err or '').strip()[-90:]))
                continue
            index[lang][written] = name
            credits.setdefault(lang, {})[name] = {
                'word': written, 'file': 'made by Piper',
                'author': voice, 'licence': 'generated locally',
            }
            made += 1
            print('  ok   %-24s %s' % (written[:24], name))

        getrec.save_all(index_path, index, credits)
        print('  %d new, %d of %d words now have audio'
              % (made, len(index[lang]), len(words[lang])))

    total = sum(len(v) for k, v in index.items() if k != '_credits')
    print('\nDone. %d clips in audio/. Reload the site.' % total)
    return 0


if __name__ == '__main__':
    sys.exit(main())
