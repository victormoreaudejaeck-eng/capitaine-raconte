"""Synthèse vocale hors-ligne via libespeak-ng (fournie par le paquet pip espeakng-loader)."""
import ctypes, wave, sys
import espeakng_loader as L

lib = ctypes.CDLL(L.get_library_path())
CB = ctypes.CFUNCTYPE(ctypes.c_int, ctypes.POINTER(ctypes.c_short), ctypes.c_int, ctypes.c_void_p)
_buf = []

@CB
def _cb(wav, n, ev):
    if n > 0: _buf.append(ctypes.string_at(wav, n * 2))
    return 0

RATE = lib.espeak_Initialize(1, 500, L.get_data_path().encode(), 0)  # AUDIO_OUTPUT_RETRIEVAL
lib.espeak_SetSynthCallback(_cb)

def say(text, out, voice="fr", rate=150, pitch=38):
    _buf.clear()
    lib.espeak_SetVoiceByName(voice.encode())
    lib.espeak_SetParameter(1, rate, 0)   # espeakRATE
    lib.espeak_SetParameter(3, pitch, 0)  # espeakPITCH
    b = text.encode("utf-8")
    lib.espeak_Synth(b, len(b) + 1, 0, 0, 0, 0x10, None, None)  # espeakCHARS_UTF8
    lib.espeak_Synchronize()
    with wave.open(out, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(RATE); w.writeframes(b"".join(_buf))

if __name__ == "__main__":
    say(sys.argv[1], sys.argv[2])
