# -*- coding: utf-8 -*-
"""Drive eSpeak NG directly, without needing the command-line program.

eSpeak NG is a small, free, open-source speech engine that covers over a
hundred languages — including every one on this site, Japanese among them,
which the neural engines mostly do not have. It sounds robotic, because it
builds speech out of formants rather than recorded human sound, but it says the
right sounds, which is the part that matters when you are learning a word.

    pip install espeakng-loader

That ships the library and its data, so nothing has to be installed system-wide.
Here we call its C interface and collect the samples ourselves rather than
letting it play out of the speakers, which is what lets us write WAV files.
"""

import ctypes
import os
import wave

AUDIO_OUTPUT_RETRIEVAL = 1
espeakCHARS_UTF8 = 1
espeakRATE, espeakVOLUME, espeakPITCH, espeakWORDGAP = 1, 2, 3, 7

SYNTH_CB = ctypes.CFUNCTYPE(ctypes.c_int, ctypes.POINTER(ctypes.c_short),
                            ctypes.c_int, ctypes.c_void_p)

# eSpeak's own names for the languages this site teaches. The first one that
# the engine accepts wins; anything with no match is reported and skipped.
LANG_CANDIDATES = {
    'ja': ['ja'], 'ko': ['ko'], 'zh': ['cmn', 'zh'], 'ru': ['ru'], 'ar': ['ar'],
    'hi': ['hi'], 'el': ['el'], 'es': ['es', 'es-419'], 'fr': ['fr', 'fr-fr'],
    'en': ['en-us', 'en'], 'pt': ['pt-br', 'pt'], 'it': ['it'], 'de': ['de'],
    'nl': ['nl'], 'af': ['af'], 'sv': ['sv'], 'no': ['nb', 'no'], 'da': ['da'],
    'fi': ['fi'], 'pl': ['pl'], 'cs': ['cs'], 'sk': ['sk'], 'hu': ['hu'],
    'ro': ['ro'], 'hr': ['hr'], 'sr': ['sr'], 'bg': ['bg'], 'uk': ['uk'],
    'sq': ['sq'], 'ca': ['ca'], 'tr': ['tr'], 'he': ['he'], 'fa': ['fa'],
    'ur': ['ur'], 'bn': ['bn'], 'mr': ['mr'], 'ne': ['ne'], 'ta': ['ta'],
    'th': ['th'], 'vi': ['vi', 'vi-vn-x-central'], 'id': ['id'],
    'tl': ['tl', 'fil'], 'sw': ['sw'], 'yo': ['yo'], 'ha': ['ha'], 'zu': ['zu'],
    'am': ['am'], 'so': ['so'], 'ka': ['ka'], 'hy': ['hy', 'hy-arevmda'],
    'mn': ['mn'], 'ht': ['ht', 'fr'], 'eo': ['eo'],
}


class Espeak(object):
    def __init__(self, rate=150, gap=0):
        import espeakng_loader

        lib = str(espeakng_loader.get_library_path())
        data = str(espeakng_loader.get_data_path())
        try:
            os.add_dll_directory(os.path.dirname(lib))       # Windows
        except (AttributeError, OSError):
            pass

        self.dll = ctypes.CDLL(lib)
        self.dll.espeak_Initialize.restype = ctypes.c_int
        self.sample_rate = self.dll.espeak_Initialize(
            AUDIO_OUTPUT_RETRIEVAL, 0, data.encode(), 0)
        if self.sample_rate < 1:
            raise RuntimeError('espeak-ng would not start up')

        self._chunks = []
        # the callback has to be kept alive for as long as the engine is used,
        # or Python will collect it and the engine will call into freed memory
        self._cb = SYNTH_CB(self._on_audio)
        self.dll.espeak_SetSynthCallback(self._cb)

        self.dll.espeak_SetParameter(espeakRATE, rate, 0)    # words per minute
        if gap:
            self.dll.espeak_SetParameter(espeakWORDGAP, gap, 0)

    def _on_audio(self, wav, numsamples, events):
        if numsamples > 0:
            self._chunks.append(ctypes.string_at(wav, numsamples * 2))
        return 0

    def set_language(self, code):
        """Try our language code against eSpeak's names. Returns the name used."""
        for candidate in LANG_CANDIDATES.get(code, [code]):
            if self.dll.espeak_SetVoiceByName(candidate.encode()) == 0:
                return candidate
        return None

    def say(self, text, path):
        del self._chunks[:]
        raw = text.encode('utf-8')
        rc = self.dll.espeak_Synth(raw, len(raw) + 1, 0, 0, 0,
                                   espeakCHARS_UTF8, None, None)
        self.dll.espeak_Synchronize()
        if rc != 0:
            return False, 'engine returned %s' % rc

        data = b''.join(self._chunks)
        if len(data) < 400:                                  # under ~10ms
            return False, 'no audio came back'
        with wave.open(path, 'wb') as out:
            out.setnchannels(1)
            out.setsampwidth(2)
            out.setframerate(self.sample_rate)
            out.writeframes(data)
        return True, len(data)


def available():
    try:
        import espeakng_loader                                # noqa: F401
        return True
    except ImportError:
        return False
