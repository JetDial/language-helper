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
import subprocess

_ffmpeg = None               # path to a usable ffmpeg binary, resolved once


def _ffmpeg_path():
    """An ffmpeg binary if one is available, or None. Best-effort: trimming
    is a nicety, not a requirement, so its absence never fails a generation."""
    global _ffmpeg
    if _ffmpeg is None:
        try:
            import imageio_ffmpeg
            _ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
        except Exception:
            _ffmpeg = ''
    return _ffmpeg or None


def trim_silence(path):
    """Cut the dead air Edge tends to pad every clip with -- often close to a
    full second trailing a short word -- down to a natural, brief pause.

    Silent by design if ffmpeg is not available: this is a polish step, and a
    clip with extra silence at the end is still a correct clip.
    """
    ffmpeg = _ffmpeg_path()
    if not ffmpeg:
        return
    tmp = path + '.trim.mp3'
    try:
        proc = subprocess.run(
            [ffmpeg, '-y', '-i', path, '-af',
             'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05:'
             'stop_periods=1:stop_threshold=-45dB:stop_silence=0.15',
             tmp],
            capture_output=True, timeout=30)
        if proc.returncode == 0 and os.path.exists(tmp) and os.path.getsize(tmp) > 200:
            os.replace(tmp, path)
        elif os.path.exists(tmp):
            os.remove(tmp)
    except Exception:
        if os.path.exists(tmp):
            os.remove(tmp)

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
        # Edge sometimes reports success while writing nothing (a bare,
        # unpronounceable Korean consonant jamo is one real case of this).
        # Writing to a temp name and only replacing `path` on success means a
        # failure here can never destroy whatever was already there.
        tmp = path + '.new.mp3'
        try:
            asyncio.run(_say(text, self._voice, tmp))
        except Exception as exc:
            if os.path.exists(tmp):
                os.remove(tmp)
            err = str(exc).strip()
            line = err.splitlines()[-1] if err else ''
            return False, (line or type(exc).__name__)[:160]
        if not os.path.exists(tmp) or os.path.getsize(tmp) < 1000:
            if os.path.exists(tmp):
                os.remove(tmp)
            return False, 'no audio came back'
        trim_silence(tmp)
        if not os.path.exists(tmp) or os.path.getsize(tmp) < 200:
            if os.path.exists(tmp):
                os.remove(tmp)
            return False, 'silent after trimming'
        os.replace(tmp, path)
        return True, os.path.getsize(path)
