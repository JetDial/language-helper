# -*- coding: utf-8 -*-
"""Drive Microsoft Edge's online neural voices, via the free unofficial
edge-tts package.

edge-tts talks to the same text-to-speech service behind Edge's "Read aloud"
feature and Windows' own Natural voices — genuinely natural, native-sounding
voices, closer to a real person than any of the other three engines here. It
needs no account and no key.

    pip install edge-tts

The one real difference from the other engines: this is not offline. Turning
text into speech is a network call to Microsoft's service, made once per word
here. The clip it returns is then saved into audio/ and played back from
there afterwards exactly like the others — offline, forever, same as
eSpeak's or Piper's output — so the network is only needed while running this
tool, never when using the site.

edge-tts's catalogue covers well over a hundred languages, including four this
site has no other synthetic voice for at all: Mongolian, Somali,
Tagalog/Filipino and Zulu. It has none for Hausa or Yoruba either, so those
two stay silent (or a human recording, if get-recordings.py found one) no
matter which engine is used.
"""

import asyncio
import os

# Site language code -> the BCP-47 locale prefix Edge's catalogue uses, for
# the handful where they differ. Anything not listed here is tried as-is.
LOCALE = {
    'zh': 'zh-CN', 'pt': 'pt-BR', 'no': 'nb-NO', 'tl': 'fil-PH',
    'ht': 'fr-FR',            # no Haitian Creole voice exists; French is closest
}

_catalogue = None            # cached list of voice dicts, fetched once


def available():
    try:
        import edge_tts                                        # noqa: F401
        return True
    except ImportError:
        return False


def catalogue():
    """Every voice Edge currently offers, fetched once and cached."""
    global _catalogue
    if _catalogue is None:
        import edge_tts
        _catalogue = asyncio.run(edge_tts.list_voices())
    return _catalogue


def voice_for(lang):
    """The best Edge voice for a site language code, or None."""
    locale = LOCALE.get(lang, lang).lower()
    matches = [v for v in catalogue()
               if v['Locale'].lower() == locale
               or v['Locale'].lower().startswith(locale + '-')]
    if not matches:
        return None
    # A voice tagged "Multilingual" tends to be Microsoft's newest and best
    # for that locale; anything else is fine too, so it is a preference, not
    # a filter.
    matches.sort(key=lambda v: 0 if 'Multilingual'
                 in (v.get('VoiceTag', {}).get('VoicePersonalities') or []) else 1)
    return matches[0]['ShortName']


async def _say(text, voice, path):
    import edge_tts
    await edge_tts.Communicate(text, voice).save(path)


class Edge(object):
    def __init__(self):
        self._voice = None

    def set_language(self, code):
        """Try to find an Edge voice for this language. Returns its name, or None."""
        self._voice = voice_for(code)
        return self._voice

    def say(self, text, path):
        try:
            asyncio.run(_say(text, self._voice, path))
        except Exception as exc:
            text = str(exc).strip()
            line = text.splitlines()[-1] if text else ''
            return False, (line or type(exc).__name__)[:160]
        if not os.path.exists(path) or os.path.getsize(path) < 1000:
            return False, 'no audio came back'
        return True, os.path.getsize(path)
