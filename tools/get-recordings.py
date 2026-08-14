#!/usr/bin/env python3
"""Download real human pronunciations into the audio/ folder.

Every clip is a recording of an actual native speaker, taken from Wikimedia
Commons — mostly from Lingua Libre, a project where volunteers record their own
language word by word. They are free to use; the licence and the speaker's name
for every file are written into audio/CREDITS.md.

    python tools/get-recordings.py ja ru ko          # a few languages
    python tools/get-recordings.py --all             # everything the site knows
    python tools/get-recordings.py --list            # what is available

Run it once, and the site plays real voices from then on, offline and with no
account, no key and nothing sent anywhere at play time. Anything with no
recording falls back to the computer's own speech as before.

Only the standard library is needed.
"""

import argparse
import json
import os
import re
import sys
import time
import unicodedata
import urllib.parse
import urllib.request

# Windows consoles still default to a codepage that cannot print Cyrillic or
# kana, and this script prints words in every script there is.
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
AUDIO = os.path.join(ROOT, 'audio')
JS = os.path.join(ROOT, 'js')

API = 'https://commons.wikimedia.org/w/api.php'
UA = 'SoundItOut/1.0 (personal language-learning site; local use)'

# Lingua Libre tags recordings with a three-letter code; Wiktionary files use
# the two-letter one as a filename prefix.
ISO3 = {
    'ja': 'jpn', 'ko': 'kor', 'zh': 'cmn', 'ru': 'rus', 'ar': 'ara', 'hi': 'hin',
    'el': 'ell', 'es': 'spa', 'fr': 'fra', 'en': 'eng', 'pt': 'por', 'it': 'ita',
    'de': 'deu', 'nl': 'nld', 'af': 'afr', 'sv': 'swe', 'no': 'nor', 'da': 'dan',
    'fi': 'fin', 'pl': 'pol', 'cs': 'ces', 'sk': 'slk', 'hu': 'hun', 'ro': 'ron',
    'hr': 'hrv', 'sr': 'srp', 'bg': 'bul', 'uk': 'ukr', 'sq': 'sqi', 'ca': 'cat',
    'tr': 'tur', 'he': 'heb', 'fa': 'fas', 'ur': 'urd', 'bn': 'ben', 'mr': 'mar',
    'ne': 'nep', 'ta': 'tam', 'th': 'tha', 'vi': 'vie', 'id': 'ind', 'tl': 'tgl',
    'sw': 'swa', 'yo': 'yor', 'ha': 'hau', 'zu': 'zul', 'am': 'amh', 'so': 'som',
    'ka': 'kat', 'hy': 'hye', 'mn': 'mon', 'ht': 'hat', 'eo': 'epo',
}

AUDIO_EXT = ('.wav', '.ogg', '.oga', '.opus', '.flac', '.mp3')

# Wikimedia will sometimes ask for a ten-minute wait. Sitting there is worse
# than stopping: the run saves as it goes, so picking it up later costs nothing.
MAX_WAIT = 60


class Throttled(Exception):
    def __init__(self, seconds):
        super(Throttled, self).__init__(seconds)
        self.seconds = seconds

# Some Wiktionary recordings name the accent as well as the language, as in
# Sw-ke-maji.flac or En-us-water.ogg.
REGIONS = {
    'en': ['us', 'uk', 'gb', 'ca', 'au'], 'sw': ['ke', 'tz'], 'pt': ['br', 'pt'],
    'es': ['mx', 'es', 'ar'], 'fr': ['fr', 'ca'], 'de': ['at', 'ch'],
    'zh': ['cn', 'tw'], 'nl': ['nl', 'be'], 'ar': ['eg'],
}


# ---------------------------------------------------------------- word lists

def read(path):
    with open(path, encoding='utf-8') as fh:
        return fh.read()


ROW3 = re.compile(r"\[\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'")
ROW2 = re.compile(r"\[\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*\]")
LANG_KEY = re.compile(r"^  ([a-z_]{2,8}): \{", re.M)


def unescape(s):
    return s.replace("\\'", "'").replace('\\\\', '\\')


def word_lists():
    """{lang: [(written, romanisation), ...]} pulled from the site's own data."""
    out = {}

    # the nine full phrasebooks: rows are [written, translit, pron, meaning, cat]
    src = read(os.path.join(JS, 'data-words.js'))
    for m in LANG_KEY.finditer(src):
        code = m.group(1)
        block = src[m.end():]
        end = block.find('\n  },')
        block = block[:end if end != -1 else len(block)]
        start = block.find('words: [')
        if start == -1:
            continue
        rows = [(unescape(a), unescape(b)) for a, b, _ in ROW3.findall(block[start:])]
        if rows:
            out.setdefault(code, []).extend(rows)

    # the wide tier: rows are [written, pron] or [written, translit, pron]
    src = read(os.path.join(JS, 'data-core.js'))
    for m in LANG_KEY.finditer(src):
        code = m.group(1)
        block = src[m.end():]
        end = block.find('\n  },')
        block = block[:end if end != -1 else len(block)]
        start = block.find('core: [')
        if start == -1:
            continue
        body = block[start:]
        rows = [(unescape(a), unescape(b)) for a, b, _ in ROW3.findall(body)]
        rows += [(unescape(a), unescape(a)) for a, _ in ROW2.findall(body)]
        if rows:
            out.setdefault(code, []).extend(rows)

    for code in out:                       # drop duplicates, keep order
        seen, keep = set(), []
        for w in out[code]:
            if w[0] not in seen:
                seen.add(w[0])
                keep.append(w)
        out[code] = keep
    return out


# ---------------------------------------------------------------- searching

def api(params, tries=4):
    """One call to Commons, backing off politely when told to slow down."""
    params = dict(params, format='json', formatversion='2')
    url = API + '?' + urllib.parse.urlencode(params)
    delay = 2
    for attempt in range(tries):
        req = urllib.request.Request(url, headers={'User-Agent': UA})
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError as exc:
            if exc.code not in (429, 503) or attempt == tries - 1:
                raise
            wait = int(exc.headers.get('Retry-After') or 0) or delay
            if wait > MAX_WAIT:
                raise Throttled(wait)
            print('    (asked to wait %ds)' % wait)
            time.sleep(wait)
            delay *= 2
    return {}


def norm(s):
    """Fold a word down so spellings can be compared loosely."""
    s = unicodedata.normalize('NFKD', s.lower())
    s = ''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^\w]+", '', s, flags=re.UNICODE)


def matches(title, word, roman, lang):
    """
    Is this file really a recording of this word in this language?

    Commons search is loose — asking for the Hindi word for water returns a
    dozen clips of a running tap. So a file is only accepted when the title
    carries both a language marker and the word itself.
    """
    stem, ext = os.path.splitext(title)
    if ext.lower() not in AUDIO_EXT:
        return 0
    iso3 = ISO3.get(lang, '')
    wants = {norm(word), norm(roman)} - {''}

    # Lingua Libre:  LL-Q7737 (rus)-Speaker-привет.wav
    ll = re.match(r'^LL-Q\d+\s*\(([a-z]{3})\)-([^-]+)-(.+)$', stem)
    if ll:
        if iso3 and ll.group(1) != iso3:
            return 0
        said = re.sub(r'\(.*?\)', '', ll.group(3))
        return 3 if norm(said) in wants else 0

    # Wiktionary:  Ja-arigato.oga, Ru-привет.ogg, Sw-ke-maji.flac
    wik = re.match(r'^([A-Za-z]{2})(?:-[a-z]{2})?-(.+)$', stem)
    if wik and wik.group(1).lower() == lang.lower():
        return 2 if norm(wik.group(2)) in wants else 0

    # a bare filename that is just the word
    if norm(stem) in wants:
        return 1
    return 0


def describe(page, word, roman, lang):
    """Turn an API page into a candidate clip, or None if it is not a match."""
    title = page['title'][len('File:'):]
    score = matches(title, word, roman, lang)
    if not score:
        return None
    info = (page.get('imageinfo') or [{}])[0]
    meta = info.get('extmetadata', {})
    url = info.get('url', '').split('?')[0]
    if not url:
        return None
    return {
        'title': title, 'url': url, 'score': score,
        'licence': meta.get('LicenseShortName', {}).get('value', 'see Commons'),
        'author': re.sub(r'<[^>]+>', '', meta.get('Artist', {}).get('value', '')).strip(),
    }


def guess_titles(word, roman, lang):
    """
    Wiktionary names its recordings predictably — Ru-привет.ogg, Ja-arigato.oga
    — so most words can be found by asking for the exact filename. Fifty of
    those fit in a single request, which is far kinder to the API (and far
    faster) than one search per word.
    """
    prefixes = [lang.capitalize()] + ['%s-%s' % (lang.capitalize(), r)
                                      for r in REGIONS.get(lang, [])]
    out = []
    for form in {word, roman} - {''}:
        if '"' in form or '|' in form:
            continue
        for prefix in prefixes:
            for ext in ('.ogg', '.oga', '.wav', '.flac'):
                out.append('File:%s-%s%s' % (prefix, form, ext))
    return out


def find_by_title(batch, lookup):
    """batch: list of File: titles. lookup: title -> (word, roman, lang)."""
    found = {}
    data = api({'action': 'query', 'titles': '|'.join(batch),
                'prop': 'imageinfo', 'iiprop': 'url|mime|extmetadata'})
    for page in data.get('query', {}).get('pages', []):
        if page.get('missing'):
            continue
        key = lookup.get(page['title'])
        if not key:
            continue
        word, roman, lang = key
        clip = describe(page, word, roman, lang)
        if clip and (word not in found or clip['score'] > found[word]['score']):
            found[word] = clip
    return found


def find_by_search(word, roman, lang):
    """
    The slower route, for words with no predictable filename. This is what
    turns up the Lingua Libre recordings, which are the best of the lot.
    """
    q = 'filetype:audio intitle:"%s"' % word
    if roman and roman != word:
        q += ' OR intitle:"%s"' % roman
    try:
        data = api({'action': 'query', 'generator': 'search', 'gsrnamespace': 6,
                    'gsrlimit': 30, 'gsrsearch': q,
                    'prop': 'imageinfo', 'iiprop': 'url|mime|extmetadata'})
    except Exception as exc:
        print('    (search failed: %s)' % exc)
        return None

    best = None
    for page in data.get('query', {}).get('pages', []):
        clip = describe(page, word, roman, lang)
        if clip and (best is None or clip['score'] > best['score']):
            best = clip
    return best


def download(url, path, tries=4):
    """Fetch one clip, waiting it out if Wikimedia asks us to slow down."""
    delay = 3
    for attempt in range(tries):
        req = urllib.request.Request(url, headers={'User-Agent': UA})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                data = r.read()
            with open(path, 'wb') as fh:
                fh.write(data)
            return len(data)
        except urllib.error.HTTPError as exc:
            if exc.code not in (429, 503) or attempt == tries - 1:
                raise
            wait = int(exc.headers.get('Retry-After') or 0) or delay
            if wait > MAX_WAIT:
                raise Throttled(wait)
            print('    (busy, waiting %ds)' % wait)
            time.sleep(wait)
            delay *= 3
    raise RuntimeError('gave up')


# ---------------------------------------------------------------- the job

def safe_name(word, ext):
    stem = re.sub(r'[^\w]+', '_', word, flags=re.UNICODE).strip('_')
    return (stem or 'word')[:60] + ext


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('languages', nargs='*', help='language codes, e.g. ja ru ko')
    ap.add_argument('--all', action='store_true', help='every language the site knows')
    ap.add_argument('--list', action='store_true', help='show the language codes and stop')
    ap.add_argument('--fast', action='store_true',
                    help='exact filenames only; skips the slow search that finds '
                         'the Lingua Libre recordings')
    ap.add_argument('--pause', type=float, default=1.0, metavar='SECONDS',
                    help='wait between searches (default 1; raise it if Commons '
                         'starts asking you to slow down)')
    args = ap.parse_args()

    words = word_lists()

    if args.list:
        print('%d languages, %d words in total\n' % (len(words), sum(len(v) for v in words.values())))
        for code in sorted(words):
            print('  %-6s %3d words' % (code, len(words[code])))
        return 0

    targets = sorted(words) if args.all else args.languages
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
            print('%s: not a language here (try --list)' % lang)
            continue
        folder = os.path.join(AUDIO, lang)
        os.makedirs(folder, exist_ok=True)
        index.setdefault(lang, {})
        todo = [(w, r) for w, r in words[lang] if w not in index[lang]]
        found = len(words[lang]) - len(todo)
        print('\n%s - %d words (%d already done)' % (lang, len(words[lang]), found))

        def keep(written, clip):
            """Download one clip and note where it came from."""
            name = safe_name(written, os.path.splitext(clip['title'])[1])
            try:
                size = download(clip['url'], os.path.join(folder, name))
            except Throttled:
                raise                       # the caller stops the run cleanly
            except Exception as exc:
                print('  FAIL %-24s %s' % (written[:24], exc))
                return False
            index[lang][written] = name
            credits.setdefault(lang, {})[name] = {
                'word': written, 'file': clip['title'],
                'author': clip['author'], 'licence': clip['licence'],
            }
            print('  ok   %-24s %s (%.0f kB)' % (written[:24], clip['title'][:44], size / 1024.0))
            save_all(index_path, index, credits)     # a stopped run keeps its work
            return True

        # Pass one: exact filenames, fifty per request.
        lookup, batch = {}, []
        for written, roman in todo:
            for title in guess_titles(written, roman, lang):
                lookup[title] = (written, roman, lang)
                batch.append(title)
        hits, throttled = {}, None
        for i in range(0, len(batch), 50):
            try:
                hits.update(find_by_title(batch[i:i + 50], lookup))
            except Throttled as exc:
                throttled = exc
                break
            except Exception as exc:
                print('    (lookup failed: %s)' % exc)
            time.sleep(0.4)
        for written, clip in sorted(hits.items()):
            try:
                if keep(written, clip):
                    found += 1
            except Throttled as exc:
                throttled = exc
                break
            except Exception as exc:
                print('  FAIL %-24s %s' % (written[:24], exc))

        # Pass two: search for whatever is left. Slower, but this is where the
        # Lingua Libre recordings live, and those are the best of the lot.
        if not args.fast and not throttled:
            for written, roman in todo:
                if written in index[lang]:
                    continue
                try:
                    clip = find_by_search(written, roman, lang)
                    if clip and keep(written, clip):
                        found += 1
                    else:
                        print('  -    %-24s no recording' % written[:24])
                except Throttled as exc:
                    throttled = exc
                    break
                except Exception as exc:
                    print('  FAIL %-24s %s' % (written[:24], exc))
                time.sleep(args.pause)

        print('  %d of %d have a recording' % (found, len(words[lang])))

        if throttled:
            save_all(index_path, index, credits)
            print('\nCommons has asked for a %d second break, so stopping here.'
                  % throttled.seconds)
            print('Everything fetched so far is saved. Run the same command again '
                  'later and it carries on from where it stopped.')
            break

    save_all(index_path, index, credits)
    total = sum(len(v) for k, v in index.items() if k != '_credits')
    print('\nDone. %d recordings in audio/. Reload the site.' % total)
    return 0


def save_all(index_path, index, credits):
    """Write the index and the credits. Called as the run goes, not just at the
    end, so that stopping half way never loses what has been fetched."""
    # Which clips are a recording of a person and which were generated here.
    # The site says which out loud, and must never call a synthetic clip human.
    sources = {}
    for lang, files in credits.items():
        for name, c in files.items():
            kind = 'made' if c.get('licence') == 'generated locally' else 'human'
            sources.setdefault(lang, {})[c['word']] = kind

    out = dict(index)
    out['_credits'] = credits
    out['_source'] = sources
    with open(index_path, 'w', encoding='utf-8') as fh:
        json.dump(out, fh, ensure_ascii=False, indent=1, sort_keys=True)

    # The same index as a script, so the site can read it when the page is
    # opened straight from disk, where fetch() is not allowed to.
    plain = {k: v for k, v in index.items() if not k.startswith('_')}
    with open(os.path.join(AUDIO, 'index.js'), 'w', encoding='utf-8') as fh:
        fh.write('/* written by tools/get-recordings.py - do not edit */\n')
        fh.write('window.RECORDINGS = ')
        json.dump(plain, fh, ensure_ascii=False, indent=1, sort_keys=True)
        fh.write(';\n')
        fh.write('window.RECORDINGS_SOURCE = ')
        json.dump(sources, fh, ensure_ascii=False, indent=1, sort_keys=True)
        fh.write(';\n')

    lines = ['# Where these recordings came from', '',
             'Every clip here is a recording of a native speaker, downloaded from',
             'Wikimedia Commons — most of them from Lingua Libre, where volunteers',
             'record their own language word by word. Each file keeps the licence it',
             'was published under, listed below with the speaker.', '']
    for lang in sorted(credits):
        lines.append('## %s' % lang)
        for name in sorted(credits[lang]):
            c = credits[lang][name]
            lines.append('- **%s** — %s · %s · %s' % (
                c['word'], c['file'], c['author'] or 'see Commons', c['licence']))
        lines.append('')
    with open(os.path.join(AUDIO, 'CREDITS.md'), 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(lines))


if __name__ == '__main__':
    sys.exit(main())
