#!/usr/bin/env python3
"""Speak every word, into the same audio/ folder the site reads.

Two free engines, both running entirely on your own machine with no account, no
key and nothing sent anywhere:

  eSpeak NG  (default)  pip install espeakng-loader
      Tiny and covers every language on this site, Japanese included. It sounds
      robotic — it builds speech out of formants rather than recorded human
      sound — but it says the right sounds, which is what you need when you are
      learning a word. Nothing to download per language.

  Piper      --engine piper, pip install piper-tts
      A neural engine that sounds close to a real person, for 47 of the
      languages here. Not Japanese. Downloads a 40-70 MB voice per language.

    python tools/make-voices.py --check           # what each engine can do
    python tools/make-voices.py ja ko ru          # a few languages
    python tools/make-voices.py --all             # every language at once
    python tools/make-voices.py es --engine piper

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

# One good default voice per language. Any other name from --voices works too.
DEFAULT_VOICE = {
    'ar': 'ar_JO-kareem-medium', 'bg': 'bg_BG-dimitar-medium',
    'bn': 'bn_BD-multi-medium', 'ca': 'ca_ES-upc_ona-medium',
    'cs': 'cs_CZ-jirka-medium', 'da': 'da_DK-talesyntese-medium',
    'de': 'de_DE-thorsten-medium', 'el': 'el_GR-rapunzelina-low',
    'en': 'en_US-lessac-medium', 'es': 'es_ES-davefx-medium',
    'fa': 'fa_IR-amir-medium', 'fi': 'fi_FI-harri-medium',
    'fr': 'fr_FR-siwis-medium', 'he': 'he_IL-saspeech-medium',
    'hi': 'hi_IN-pratham-medium', 'hu': 'hu_HU-anna-medium',
    'hy': 'hy_AM-hyvox-medium', 'id': 'id_ID-yudhistira-medium',
    'is': 'is_IS-salka-medium', 'it': 'it_IT-paola-medium',
    'ka': 'ka_GE-natia-medium', 'ko': 'ko_KR-kss-medium',
    'ml': 'ml_IN-arjun-medium', 'mr': 'mr_IN-priyamvada-medium',
    'ne': 'ne_NP-chitwan-medium', 'nl': 'nl_NL-mls-medium',
    'no': 'no_NO-talesyntese-medium', 'pl': 'pl_PL-gosia-medium',
    'pt': 'pt_BR-faber-medium', 'ro': 'ro_RO-mihai-medium',
    'ru': 'ru_RU-irina-medium', 'sk': 'sk_SK-lili-medium',
    'sl': 'sl_SI-artur-medium', 'sq': 'sq_AL-vocalstudio-medium',
    'sr': 'sr_RS-serbski_institut-medium', 'sv': 'sv_SE-nst-medium',
    'sw': 'sw_CD-lanfrica-medium', 'tr': 'tr_TR-dfki-medium',
    'uk': 'uk_UA-tetiana-high', 'ur': 'ur_PK-multi-medium',
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
    proc = subprocess.run(
        [sys.executable, '-m', 'piper', '-m', model, '-f', path],
        input=text, capture_output=True, text=True, encoding='utf-8')
    return os.path.exists(path) and os.path.getsize(path) > 1000, proc.stderr


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


def check(args):
    """Report which languages the chosen engine can actually speak."""
    words = getrec.word_lists()
    if args.engine == 'piper':
        can = sorted(set(DEFAULT_VOICE) & set(words))
        cannot = sorted(set(words) - set(DEFAULT_VOICE))
        print('Piper can speak %d of the %d languages here.\n' % (len(can), len(words)))
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
            if index[lang].get(written) and not args.replace:
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


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('languages', nargs='*', help='language codes, e.g. es ru de')
    ap.add_argument('--engine', choices=['espeak', 'piper'], default='espeak',
                    help='espeak covers every language including Japanese; piper '
                         'sounds better but has fewer (default: espeak)')
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
    args = ap.parse_args()

    if args.engine == 'espeak' and not espeak_engine.available():
        print('eSpeak NG is not installed. Run:\n\n    pip install espeakng-loader\n')
        return 1
    if args.engine == 'piper' and not have_piper():
        print('Piper is not installed. Run:\n\n    pip install piper-tts\n')
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
        targets = (sorted(set(espeak_engine.LANG_CANDIDATES) & set(words))
                   if args.engine == 'espeak'
                   else sorted(set(DEFAULT_VOICE) & set(words)))
    if not targets:
        ap.print_help()
        return 1

    if args.engine == 'espeak':
        return run_espeak(args, words, targets)

    os.makedirs(AUDIO, exist_ok=True)
    index_path = os.path.join(AUDIO, 'index.json')
    index = {}
    if os.path.exists(index_path):
        with open(index_path, encoding='utf-8') as fh:
            index = json.load(fh)
    credits = index.pop('_credits', {})
    index.pop('_source', None)

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
            if written in index[lang] and not args.replace:
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
