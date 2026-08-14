#!/usr/bin/env python3
"""Speak every word with Piper, into the same audio/ folder the site reads.

Piper is a free, open-source neural text-to-speech engine that runs entirely on
your own machine — no account, no key, nothing sent anywhere. It sounds close to
a real person, far better than the robotic voices Windows ships, and it covers
47 of the languages here.

    pip install piper-tts

    python tools/make-voices.py --voices              # which languages it has
    python tools/make-voices.py es                    # do Spanish
    python tools/make-voices.py es ru de --voice ru_RU-irina-medium

The first run for a language downloads its voice (40-70 MB) into
tools/piper-voices/ and then works offline forever.

This fills the same audio/ folder as get-recordings.py, so the two work
together: recordings of real people are kept, and Piper covers every word that
has none. The site plays whatever is there without caring which made it.

Piper has no Japanese voice. For Japanese, install the Windows Japanese speech
pack (Settings -> Time & language -> Language & region), use Chrome's built-in
Google voice, or try VOICEVOX, which is free and excellent but Japanese-only.
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


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('languages', nargs='*', help='language codes, e.g. es ru de')
    ap.add_argument('--voice', help='use this exact Piper voice for every language given')
    ap.add_argument('--voices', action='store_true', help='list every Piper voice and stop')
    ap.add_argument('--all', action='store_true', help='every language Piper can do')
    ap.add_argument('--replace', action='store_true',
                    help='overwrite words that already have audio (by default the '
                         'human recordings already there are kept)')
    args = ap.parse_args()

    if not have_piper():
        print('Piper is not installed. Run:\n\n    pip install piper-tts\n')
        return 1

    if args.voices:
        names = list_voices()
        print('%d Piper voices:\n' % len(names))
        for n in names:
            print('  ' + n)
        return 0

    words = getrec.word_lists()
    targets = args.languages
    if args.all:
        targets = sorted(set(DEFAULT_VOICE) & set(words))
    if not targets:
        ap.print_help()
        return 1

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
