#!/usr/bin/env python3
"""Studio 3D : script JSON -> voix ElevenLabs (avec minutage) -> plans calés -> rendu 3D -> sound design -> MP4.

usage: python3 studio3d/build3d.py <histoire>      (lit studio3d/stories/<histoire>.json)
"""
import base64, json, os, re, subprocess, sys, urllib.request
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
STORY = sys.argv[1] if len(sys.argv) > 1 else "bullimore"
OUT = os.path.join(ROOT, "out", "3d_" + STORY)
os.makedirs(OUT, exist_ok=True)
SR, FPS = 44100, 30
VOICE = os.environ.get("ELEVEN_VOICE", "nPczCjzI2devNBz1zQrb")  # Brian
SETTINGS = {"stability": 0.38, "similarity_boost": 0.75, "style": 0.5, "use_speaker_boost": True, "speed": 1.04}
LEAD = 0.35   # silence before the first word
TAIL = 2.2    # held end card after the last word


def sh(*c):
    subprocess.run(c, check=True)


def tts(text):
    cache = os.path.join(OUT, "voice.json")
    key = json.dumps([VOICE, SETTINGS, text], ensure_ascii=False)
    if os.path.exists(cache):
        d = json.load(open(cache))
        if d.get("key") == key:
            print("  (voix en cache)")
            return d
    body = json.dumps({"text": text, "model_id": "eleven_multilingual_v2", "language_code": "fr", "voice_settings": SETTINGS}).encode()
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_128",
                                 data=body, headers={"Content-Type": "application/json", "xi-api-key": os.environ.get("ELEVEN_API_KEY", "proxy-injected")})
    with urllib.request.urlopen(req, timeout=300) as r:
        d = json.load(r)
    d["key"] = key
    json.dump(d, open(cache, "w"))
    return d


def load_wav(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()


# ---------------- sound design (all synthesized) ----------------
def env(n, a=0.01, r=0.3):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / max(r, 1e-4))
    return e


def lowpass(x, k):
    # simple one-pole IIR
    y = np.empty_like(x); acc = 0.0; a = k
    for i in range(len(x)):
        acc += a * (x[i] - acc); y[i] = acc
    return y


def lp_fast(x, cutoff):
    # FFT brickwall-ish lowpass (fast for long signals)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4)
    return np.fft.irfft(X, len(x)).astype(np.float32)


def noise(n, seed=1):
    return np.random.default_rng(seed).standard_normal(n).astype(np.float32)


def sfx_crack():
    n = int(SR * 1.4); x = noise(n, 3) * env(n, .002, .25)
    thump = np.sin(2 * np.pi * 55 * np.arange(n) / SR) * env(n, .005, .5)
    return (lp_fast(x, 2500) * .8 + thump * .9).astype(np.float32)


def sfx_boom():
    n = int(SR * 2.5); t = np.arange(n) / SR
    f = 70 * np.exp(-t * 1.5) + 30
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .003, .9) + lp_fast(noise(n, 5), 400) * env(n, .003, .4) * .6).astype(np.float32)


def sfx_whoosh(d=1.2):
    n = int(SR * d); t = np.arange(n) / SR
    e = np.sin(np.pi * t / d) ** 2
    return (lp_fast(noise(n, 7), 900) * e * 1.2).astype(np.float32)


def sfx_knocks(k=3, gap=.32):
    n = int(SR * (k * gap + .5)); out = np.zeros(n, np.float32)
    for i in range(k):
        m = int(SR * .25); t = np.arange(m) / SR
        hit = (np.sin(2 * np.pi * 140 * t) * .8 + np.sin(2 * np.pi * 310 * t) * .3) * env(m, .001, .06) + lp_fast(noise(m, 11 + i), 1800) * env(m, .001, .02) * .5
        s = int(SR * i * gap); out[s:s + m] += hit
    return out


def sfx_thunder():
    n = int(SR * 3); return (lp_fast(noise(n, 13), 220) * env(n, .05, 1.2) * 2.2).astype(np.float32)


def heartbeat(dur, bpm=62):
    n = int(SR * dur); out = np.zeros(n, np.float32); per = 60 / bpm
    m = int(SR * .18); t = np.arange(m) / SR; beat = np.sin(2 * np.pi * 48 * t) * env(m, .004, .07)
    k = 0.0
    while k < dur - .5:
        for off, g in ((0, 1.0), (.24, .7)):
            s = int(SR * (k + off));
            if s + m < n: out[s:s + m] += beat * g
        k += per
    return out


def pad(dur, freqs, seed=0):
    n = int(SR * dur); t = np.arange(n) / SR; out = np.zeros(n, np.float32)
    for i, f in enumerate(freqs):
        for det in (-0.25, 0.25):
            out += (np.sin(2 * np.pi * (f + det) * t + seed + i) * (0.6 + 0.4 * np.sin(2 * np.pi * (0.07 + i * 0.013) * t))).astype(np.float32)
    fade = np.minimum(1, np.minimum(t / 1.5, (dur - t) / 1.5))
    return out / len(freqs) * fade


def place(track, clip, at, gain=1.0):
    s = int(SR * at)
    if s >= len(track): return
    e = min(len(track), s + len(clip)); track[s:e] += clip[:e - s] * gain


# ---------------- main ----------------
def main():
    story = json.load(open(os.path.join(HERE, "stories", STORY + ".json"), encoding="utf-8"))
    beats = story["beats"]
    text, offsets = "", []
    for b in beats:
        offsets.append(len(text)); text += b["say"].strip() + " "
    text = text.strip()
    print(f"{len(text)} caractères à générer")
    d = tts(text)
    mp3 = os.path.join(OUT, "voice.mp3"); open(mp3, "wb").write(base64.b64decode(d["audio_base64"]))
    al = d["alignment"]; chars = al["characters"]; cs = al["character_start_times_seconds"]; ce = al["character_end_times_seconds"]
    assert "".join(chars) == text, "alignment mismatch"
    voice = load_wav(mp3)
    vdur = len(voice) / SR

    # words
    words = []
    for m in re.finditer(r"\S+", text):
        a, b = m.start(), m.end() - 1
        disp = re.sub(r"^[«\"'(]+|[»\"'),.;:…]+$", "", m.group()).strip()
        if not disp: continue
        words.append({"text": disp.upper(), "start": LEAD + cs[a], "end": LEAD + ce[b] + .02})
    for i in range(len(words) - 1):
        words[i]["end"] = max(words[i]["end"], min(words[i + 1]["start"], words[i]["start"] + 1.2))

    # beats -> shots (cuts land on sentence starts)
    total = LEAD + vdur + TAIL
    bstart = [0.0] + [LEAD + cs[o] - .12 for o in offsets[1:]]
    bend = bstart[1:] + [total]
    shots, chips = [], []
    for b, s0, s1 in zip(beats, bstart, bend):
        n = len(b["shots"]); dd = (s1 - s0) / n
        for i, name in enumerate(b["shots"]):
            shots.append({"name": name, "start": s0 + i * dd, "dur": dd})
        if b.get("chip") and b["chip"] != "DAYS":
            chips.append({"text": b["chip"], "start": s0, "dur": s1 - s0})
    timeline = {"shots": shots, "words": words, "chips": chips, "total": total, "title1": story.get("title1", ""), "title2": story.get("title2", ""), "caption": story.get("caption")}
    json.dump(timeline, open(os.path.join(OUT, "timeline.json"), "w"), ensure_ascii=False, indent=1)
    print(f"durée {total:.1f}s, {len(shots)} plans (moy. {total/len(shots):.2f}s), {len(words)} mots")

    # ---------- audio ----------
    N = int(SR * total) + SR
    vtrack = np.zeros(N, np.float32); place(vtrack, voice, LEAD)
    music = np.zeros(N, np.float32); fx = np.zeros(N, np.float32)
    A, F, C, G, E = [110, 130.8, 164.8], [87.3, 110, 130.8], [130.8, 164.8, 196], [98, 123.5, 146.8], [82.4, 123.5, 164.8]
    rs = story.get("resolve_shot", "swim_under")
    rescue_t = next((s["start"] for s in shots if s["name"] == rs), total * .85)
    seg, k, prog = 0.0, 0, [A, F, C, G]
    while seg < rescue_t:
        dur = min(4.0, rescue_t - seg + 1.5); place(music, pad(dur + 1.5, prog[k % 4], k), seg, .55); seg += 4.0; k += 1
    seg = rescue_t
    for ch in ([C[0], E[1], G[2] * 2 / 1.5], [F[0] * 2, A[1] * 2, C[2]], [C[0], E[1], G[2] * 2 / 1.5]):
        if seg < total: place(music, pad(4.5, [f * 2 for f in ch], 9), seg, .7)
        seg += 4.0
    if total - seg > .5: place(music, pad(total - seg + 1, [261.6, 329.6, 392], 3), seg, .7)
    # low drone + sub pulse for tension
    t = np.arange(N) / SR
    drone = (np.sin(2 * np.pi * 55 * t) * .25 * (0.6 + 0.4 * np.sin(2 * np.pi * .11 * t))).astype(np.float32)
    drone[int(SR * rescue_t):] *= np.linspace(1, 0, N - int(SR * rescue_t)) ** 2
    music += drone
    for s in shots:
        n, at, dd = s["name"], s["start"], s["dur"]
        if n.startswith("storm") or n in ("hull_storm", "ocean_wide", "capsize", "title"):
            wind = lp_fast(noise(int(SR * dd) + SR, hash(n) % 999), 700) * .5
            wind *= np.minimum(1, np.minimum(np.arange(len(wind)) / (SR * .3), (len(wind) - np.arange(len(wind))) / (SR * .5)))
            place(fx, wind, at)
        if n in ("hull_storm", "storm_boat"): place(fx, sfx_thunder(), at + .1, .8)
        if n == "title": place(fx, sfx_boom(), at, 1.0)
        if n in ("cabin_shock", "keel_snap"): place(fx, sfx_crack(), at + dd * (.2 if n == "cabin_shock" else .25), 1.0)
        if n in ("capsize", "capsize_under"): place(fx, sfx_whoosh(1.6), at, .9)
        if n.startswith("pocket") or n == "knock_in": place(fx, heartbeat(dd + .2), at, .55)
        if n == "knock_out": place(fx, sfx_knocks(3), at + dd * .3, 1.0)
        if n == "knock_in": place(fx, sfx_knocks(3, .28), at + dd * .5, .8)
        if n in ("keel_under", "keel_snap", "capsize_under", "swim_under"):
            bub = lp_fast(noise(int(SR * dd), 21), 300) * .35; place(fx, bub, at)
        if n in ("plane_fly",):
            m = int(SR * dd); tt = np.arange(m) / SR
            place(fx, (np.sin(2 * np.pi * 92 * tt) * .2 + lp_fast(noise(m, 31), 500) * .4) * np.sin(np.pi * tt / dd), at)
    for s in shots:
        n, at, dd = s["name"], s["start"], s["dur"]
        if n in ("mc_wheel", "mc_wheel_empty", "mc_deck_empty", "mc_drift_far", "mc_lifeboat_gone", "mc_sounding_rod"):
            for k in range(int(dd / .9)):
                m = int(SR * .5); tt = np.arange(m) / SR
                creak = np.sin(2 * np.pi * (180 + 40 * np.sin(tt * 9)) * tt) * env(m, .05, .25) * .35 + lp_fast(noise(m, 41 + k), 600) * env(m, .02, .2) * .4
                place(fx, creak.astype(np.float32), at + .2 + k * .9, .7)
        if n == "mc_theory_vapors":
            m = int(SR * dd); hiss = noise(m, 51) - lp_fast(noise(m, 51), 2500); place(fx, (hiss * .25 * np.sin(np.pi * np.arange(m) / m)).astype(np.float32), at)
        if n in ("mc_hold_barrels", "mc_hold_water", "mc_cabin", "mc_logbook", "mc_log_close"):
            m = int(SR * dd); place(fx, (lp_fast(noise(m, 61), 250) * .4).astype(np.float32), at)
    # whoosh on every cut (subtle) for pace
    for s in shots[1:]: place(fx, sfx_whoosh(.35), s["start"] - .12, .25)
    # ducking: music & fx under the voice
    venv = np.convolve(np.abs(vtrack), np.ones(int(SR * .25)) / (SR * .25), "same")
    duck = 1 - .55 * np.clip(venv / (venv.max() * .25 + 1e-9), 0, 1)
    mix = vtrack * 1.0 + music * .32 * duck + fx * .5 * (0.65 + .35 * duck)
    mix = mix[:int(SR * total)]
    mix /= max(1e-6, np.abs(mix).max()) / .9
    rawwav = os.path.join(OUT, "mix_raw.wav")
    sh("ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", rawwav) if False else None
    p = subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-",
                        "-af", "loudnorm=I=-14:TP=-1.5:LRA=9", "-ar", str(SR), "-ac", "2", os.path.join(OUT, "mix.wav")], input=mix.astype(np.float32).tobytes())
    assert p.returncode == 0

    # ---------- render ----------
    silent = os.path.join(OUT, "video_silent.mp4")
    sh("node", os.path.join(HERE, "render3d.js"), os.path.join(OUT, "timeline.json"), silent, str(FPS), story.get("film", "film.html"))
    os.makedirs(os.path.join(ROOT, "videos"), exist_ok=True)
    final = os.path.join(ROOT, "videos", f"{STORY}.mp4")
    sh("ffmpeg", "-v", "error", "-y", "-i", silent, "-i", os.path.join(OUT, "mix.wav"), "-map", "0:v", "-map", "1:a",
       "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", final)
    print("✅", final)
    if story.get("thumb"):
        sh("python3", os.path.join(HERE, "thumb.py"), STORY)


if __name__ == "__main__":
    main()
