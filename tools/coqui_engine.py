# -*- coding: utf-8 -*-
"""Drive Coqui TTS, the neural engine.

Coqui is the heaviest of the three engines and the best sounding. It runs
locally like the others — nothing is sent anywhere — but it pulls in PyTorch,
and each voice model is a download of its own.

    pip install coqui-tts

Two families of model are used here:

  XTTS v2      one model, seventeen languages, clearly the best quality of
               anything free. About 1.8 GB, and it is released under the Coqui
               Public Model License, which allows non-commercial use only. The
               licence has to be accepted before it will download, and this tool
               will not accept it on your behalf: pass --accept-licence once you
               have read it.

  Fairseq VITS Meta's MMS voices, one model per language at roughly 100-200 MB,
               covering far more languages than anything else here. Quality is
               below XTTS but well above eSpeak. Released CC BY-NC 4.0, so also
               non-commercial.

Neither licence is a problem for learning a language at home; both would be for
selling something. That is your call to make, not this script's.
"""

import os

# The languages XTTS v2 speaks, in its own naming.
XTTS_LANGS = {
    'en': 'en', 'es': 'es', 'fr': 'fr', 'de': 'de', 'it': 'it', 'pt': 'pt',
    'pl': 'pl', 'tr': 'tr', 'ru': 'ru', 'nl': 'nl', 'cs': 'cs', 'ar': 'ar',
    'zh': 'zh-cn', 'ja': 'ja', 'hu': 'hu', 'ko': 'ko', 'hi': 'hi',
}
XTTS_MODEL = 'tts_models/multilingual/multi-dataset/xtts_v2'

# Coqui's own single-language models, hosted on its GitHub releases. These need
# no licence click and are the fallback when XTTS is not wanted -- and the only
# option at all for languages XTTS does not speak.
NATIVE_MODEL = {
    'bg': 'tts_models/bg/cv/vits', 'cs': 'tts_models/cs/cv/vits',
    'da': 'tts_models/da/cv/vits', 'en': 'tts_models/en/ljspeech/vits',
    'es': 'tts_models/es/css10/vits', 'fr': 'tts_models/fr/css10/vits',
    'uk': 'tts_models/uk/mai/vits', 'zh': 'tts_models/zh-CN/baker/tacotron2-DDC-GST',
    'nl': 'tts_models/nl/css10/vits', 'de': 'tts_models/de/thorsten/vits',
    'ja': 'tts_models/ja/kokoro/tacotron2-DDC', 'tr': 'tts_models/tr/common-voice/glow-tts',
    'it': 'tts_models/it/mai_female/vits', 'hu': 'tts_models/hu/css10/vits',
    'el': 'tts_models/el/cv/vits', 'fi': 'tts_models/fi/css10/vits',
    'hr': 'tts_models/hr/cv/vits', 'pl': 'tts_models/pl/mai_female/vits',
    'pt': 'tts_models/pt/cv/vits', 'ro': 'tts_models/ro/cv/vits',
    'sk': 'tts_models/sk/cv/vits', 'sv': 'tts_models/sv/cv/vits',
    'ca': 'tts_models/ca/custom/vits', 'fa': 'tts_models/fa/custom/vits-female',
    'bn': 'tts_models/bn/custom/vits-female', 'ha': 'tts_models/hau/openbible/vits',
    'yo': 'tts_models/yor/openbible/vits',
}

# Three-letter codes for the fairseq models, which are named by ISO 639-3.
ISO3 = {
    'af': 'afr', 'am': 'amh', 'ar': 'ara', 'bg': 'bul', 'bn': 'ben', 'ca': 'cat',
    'cs': 'ces', 'da': 'dan', 'de': 'deu', 'el': 'ell', 'en': 'eng', 'eo': 'epo',
    'es': 'spa', 'fa': 'fas', 'fi': 'fin', 'fr': 'fra', 'ha': 'hau', 'he': 'heb',
    'hi': 'hin', 'hr': 'hrv', 'ht': 'hat', 'hu': 'hun', 'hy': 'hye', 'id': 'ind',
    'it': 'ita', 'ja': 'jpn', 'ka': 'kat', 'ko': 'kor', 'mn': 'mon', 'mr': 'mar',
    'ne': 'nep', 'nl': 'nld', 'no': 'nor', 'pl': 'pol', 'pt': 'por', 'ro': 'ron',
    'ru': 'rus', 'sk': 'slk', 'so': 'som', 'sq': 'sqi', 'sr': 'srp', 'sv': 'swe',
    'sw': 'swh', 'ta': 'tam', 'th': 'tha', 'tl': 'tgl', 'tr': 'tur', 'uk': 'ukr',
    'ur': 'urd', 'vi': 'vie', 'yo': 'yor', 'zh': 'cmn', 'zu': 'zul',
}


def describe_error(exc):
    """A one-line reason. Some failures (a bad download) carry no message at
    all, so fall back to the exception's type rather than crashing on an empty
    string while trying to report a problem."""
    text = str(exc).strip()
    line = text.splitlines()[-1] if text else ''
    return (line or type(exc).__name__)[:160]


def available():
    try:
        import TTS                                            # noqa: F401
        return True
    except ImportError:
        return False


class Coqui(object):
    """One model held open at a time; switching costs a reload."""

    def __init__(self, prefer_xtts=True, accept_licence=False, progress=False):
        self.prefer_xtts = prefer_xtts
        self.accept_licence = accept_licence
        self.progress = progress
        self._model_name = None
        self._tts = None
        self._speaker = None
        self._language = None

    def model_for(self, lang):
        """Which model would speak this language, or None.

        XTTS first if it is allowed, then a single-language model of Coqui's
        own, then Meta's MMS set -- which covers the most languages but is
        hosted somewhere that is often unreachable, so it is the last resort.
        """
        if self.prefer_xtts and self.accept_licence and lang in XTTS_LANGS:
            return XTTS_MODEL
        if lang in NATIVE_MODEL:
            return NATIVE_MODEL[lang]
        if self.prefer_xtts and lang in XTTS_LANGS:
            return XTTS_MODEL          # only XTTS has it; the licence gate applies
        iso3 = ISO3.get(lang)
        return 'tts_models/%s/fairseq/vits' % iso3 if iso3 else None

    def load(self, lang):
        """Get ready to speak `lang`. Returns (ok, message)."""
        name = self.model_for(lang)
        if not name:
            return False, 'Coqui has no model for this language'

        if name == XTTS_MODEL and not self.accept_licence:
            return False, ('XTTS needs its licence accepting first '
                           '(run again with --accept-licence)')

        if name != self._model_name:
            from TTS.api import TTS

            if name == XTTS_MODEL:
                # The library asks on the console otherwise, and this run may
                # not be interactive. Only ever set once the user has said yes.
                os.environ['COQUI_TOS_AGREED'] = '1'
            try:
                self._tts = TTS(name, progress_bar=self.progress)
            except Exception as exc:
                return False, describe_error(exc)
            self._model_name = name

            self._speaker = None
            speakers = getattr(self._tts, 'speakers', None) or []
            if len(speakers) > 0:
                self._speaker = speakers[0]

        self._language = XTTS_LANGS.get(lang) if name == XTTS_MODEL else None
        return True, name

    def say(self, text, path):
        kwargs = {'text': text, 'file_path': path}
        if self._language:
            kwargs['language'] = self._language
        if self._speaker:
            kwargs['speaker'] = self._speaker
        try:
            self._tts.tts_to_file(**kwargs)
        except Exception as exc:
            return False, describe_error(exc)
        if not os.path.exists(path) or os.path.getsize(path) < 1000:
            return False, 'no audio came back'
        return True, os.path.getsize(path)
