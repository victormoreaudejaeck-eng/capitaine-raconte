#!/usr/bin/env python3
"""Pipeline complet : scenes.json -> voix -> timeline -> animation -> musique -> MP4 final.

usage: python3 build.py <histoire>     ex: python3 build.py titanic  (lit stories/<histoire>/scenes.json)
"""
import json, subprocess, sys, wave, os, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
STORY = sys.argv[1] if len(sys.argv) > 1 else "titanic"
OUT = os.path.join(HERE, "out", STORY)
os.makedirs(OUT, exist_ok=True)
os.makedirs(os.path.join(HERE, "videos"), exist_ok=True)
PAD_BEFORE, PAD_AFTER = 0.5, 0.8


def sh(*cmd):
    subprocess.run(cmd, check=True)


def wav_dur(p):
    with wave.open(p) as w:
        return w.getnframes() / w.getframerate()


_kokoro = None


def tts_kokoro(text, out_wav):
    """Voix neuronale hors-ligne Kokoro (voix française ff_siwis)."""
    global _kokoro
    from kokoro_onnx import Kokoro
    import soundfile as sf
    if _kokoro is None:
        _kokoro = Kokoro(os.path.join(HERE, "models/kokoro.onnx"), os.path.join(HERE, "models/voices.bin"))
    samples, sr = _kokoro.create(text, voice="ff_siwis", speed=0.95, lang="fr-fr")
    raw = out_wav + ".raw.wav"
    sf.write(raw, samples, sr)
    sh("ffmpeg", "-y", "-loglevel", "error", "-i", raw,
       "-af", "aresample=44100,highpass=f=70,acompressor=threshold=0.1:ratio=3,loudnorm=I=-16",
       "-ac", "1", out_wav)
    os.remove(raw)


# ---------- ElevenLabs (voix principale) ----------
# La clé API est injectée par le proxy de l'environnement (header xi-api-key).
# En local : export ELEVEN_API_KEY=... et elle sera envoyée directement.
ELEVEN_VOICE = os.environ.get("ELEVEN_VOICE", "nPczCjzI2devNBz1zQrb")  # Brian (grave)          # voice_id choisi
ELEVEN_MODEL = os.environ.get("ELEVEN_MODEL", "eleven_multilingual_v2")
VOICE_SETTINGS = {"stability": 0.4, "similarity_boost": 0.75, "style": 0.4, "use_speaker_boost": True, "speed": 1.05}


def tts_eleven(text, out_wav):
    import urllib.request
    body = json.dumps({"text": text, "model_id": ELEVEN_MODEL, "voice_settings": VOICE_SETTINGS,
                       "language_code": "fr"}).encode()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVEN_VOICE}?output_format=mp3_44100_128",
        data=body, headers={"Content-Type": "application/json", "Accept": "audio/mpeg",
                            "xi-api-key": os.environ.get("ELEVEN_API_KEY", "proxy-injected")})
    mp3 = out_wav + ".mp3"
    with urllib.request.urlopen(req, timeout=120) as r, open(mp3, "wb") as f:
        f.write(r.read())
    sh("ffmpeg", "-y", "-loglevel", "error", "-i", mp3,
       "-af", "aresample=44100,highpass=f=70,acompressor=threshold=0.12:ratio=2.5,loudnorm=I=-15",
       "-ac", "1", out_wav)
    os.remove(mp3)


def trim_tail(path, gap=0.25, max_tail=1.2, thr_db=-45):
    """Supprime les bruits parasites isolés après la dernière phrase (et coupe le silence final)."""
    import numpy as np
    with wave.open(path) as w:
        sr, n, ch = w.getframerate(), w.getnframes(), w.getnchannels()
        a = np.frombuffer(w.readframes(n), np.int16).astype(np.float32)
    win = int(sr * 0.02)
    env = np.array([np.sqrt(np.mean((a[j:j+win] / 32768) ** 2)) for j in range(0, len(a) - win, win)])
    loud = 20 * np.log10(env + 1e-9) > thr_db
    idx = np.where(loud)[0]
    if len(idx) == 0:
        return
    end = idx[-1]
    # remonte tant qu'un bloc sonore court est séparé du reste par un vrai silence
    while True:
        prev = idx[idx < end]
        segs = np.where(np.diff(idx) > gap / 0.02)[0]
        if len(segs) == 0:
            break
        last_start = idx[segs[-1] + 1]
        if (len(loud) - last_start) * 0.02 <= max_tail and (idx[-1] - last_start) * 0.02 < 0.6:
            idx = idx[idx < last_start]
            end = idx[-1]
        else:
            break
    cut = min(len(a), (end + 1) * win + int(sr * 0.12))
    a = a[:cut]
    fade = int(sr * 0.04)
    a[-fade:] *= np.linspace(1, 0, fade)
    with wave.open(path, "wb") as w:
        w.setnchannels(ch); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes(a.astype(np.int16).tobytes())


def tts(text, out_wav, prev_text="", next_text=""):
    key = f"{ELEVEN_VOICE or 'kokoro'}|{json.dumps(VOICE_SETTINGS, sort_keys=True)}|{text}"
    cache = out_wav + ".key"
    if os.path.exists(out_wav) and os.path.exists(cache) and open(cache, encoding="utf-8").read() == key:
        print("  (voix en cache)")
    else:
        if ELEVEN_VOICE:
            tts_eleven(text, out_wav)
        else:
            tts_kokoro(text, out_wav)
        open(cache, "w", encoding="utf-8").write(key)
    trim_tail(out_wav)


def main():
    data = json.load(open(os.path.join(HERE, "stories", STORY, "scenes.json"), encoding="utf-8"))
    ship = {}
    if isinstance(data, dict):
        ship, scenes = data.get("ship", {}), data["scenes"]
    else:
        scenes = data
    timeline, t, parts = [], 0.0, []
    for i, s in enumerate(scenes):
        w = os.path.join(OUT, f"voice_{i:02d}.wav")
        tts(s["say"], w, scenes[i-1]["say"] if i else "", scenes[i+1]["say"] if i+1 < len(scenes) else "")
        d = wav_dur(w)
        dur = PAD_BEFORE + d + PAD_AFTER
        timeline.append({**s, "ship": ship, "start": t, "dur": dur, "speech": PAD_BEFORE + d})
        parts.append((w, t + PAD_BEFORE))
        t += dur
        print(f"{s['id']:<12} {dur:5.1f}s")
    total = t
    json.dump(timeline, open(os.path.join(OUT, "timeline.json"), "w"), ensure_ascii=False, indent=1)
    print(f"durée totale : {total:.1f}s")

    # piste voix : chaque phrase placée à son timecode
    inputs, filt = [], []
    for k, (w, start) in enumerate(parts):
        inputs += ["-i", w]
        filt.append(f"[{k}]adelay={int(start*1000)}|{int(start*1000)}[v{k}]")
    filt.append("".join(f"[v{k}]" for k in range(len(parts))) + f"amix=inputs={len(parts)}:normalize=0[vo]")
    voice = os.path.join(OUT, "voice.wav")
    sh("ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(filt),
       "-map", "[vo]", "-t", f"{total}", voice)

    # ambiance : vagues (bruit filtré) + nappe musicale mineure synthétisée
    amb = os.path.join(OUT, "ambience.wav")
    sh("ffmpeg", "-y", "-loglevel", "error",
       "-f", "lavfi", "-i", f"anoisesrc=color=brown:amplitude=0.5:d={total}",
       "-f", "lavfi", "-i", f"sine=f=110:d={total}",
       "-f", "lavfi", "-i", f"sine=f=130.81:d={total}",
       "-f", "lavfi", "-i", f"sine=f=164.81:d={total}",
       "-filter_complex",
       "[0]lowpass=f=500,volume='0.35+0.25*sin(2*PI*t/7)':eval=frame[w];"
       "[1][2][3]amix=inputs=3,volume='0.18*(0.6+0.4*sin(2*PI*t/11))':eval=frame,aecho=0.8:0.7:600:0.4[m];"
       f"[w][m]amix=inputs=2:normalize=0,afade=t=in:d=2,afade=t=out:st={total-3}:d=3[a]",
       "-map", "[a]", "-ac", "2", amb)

    silent = os.path.join(OUT, "video_silent.mp4")
    sh("node", os.path.join(HERE, "render.js"), os.path.join(OUT, "timeline.json"), silent, "30")

    final = os.path.join(HERE, "videos", f"{STORY}.mp4")
    sh("ffmpeg", "-y", "-loglevel", "error", "-i", silent, "-i", voice, "-i", amb,
       "-filter_complex",
       "[1]asplit[v1][v2];[2]volume=0.5[bg];[bg][v1]sidechaincompress=threshold=0.05:ratio=6:release=400[duck];"
       "[duck][v2]amix=inputs=2:normalize=0,alimiter=limit=0.95[a]",
       "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", final)
    print("✅", final)


if __name__ == "__main__":
    main()
