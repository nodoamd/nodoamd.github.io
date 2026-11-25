#!/usr/bin/env python3
"""Build display renditions for BetterWLPRS.

Masters are never overwritten. Homepage stills, GIF loops and local setup
clips are read from disk. The autoplaying homepage videos live on R2; this
script downloads them to a temp dir, writes a lighter playback file plus a
poster, and leaves the R2 object as the master.

Quality was chosen by inspecting encodes, not by a single crushed preset:
- still WebP q=82, AVIF CRF 30 (libaom still-picture)
- GIF loops: H.264 CRF 20 and VP9 CRF 32, source frame rate
- hero clip (seen up to ~800px): 1600px, 60fps, CRF 22, audio kept
- slider clips (seen around 380px): 960px, 30fps, CRF 23, no audio
"""

from __future__ import annotations

import json
import shutil
import subprocess
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "img" / "display"
TMP = Path("/tmp/wlprs-display-src")
R2 = "https://pub-cde9de8c9c464454b83b3dd0e1793e1b.r2.dev/"

STILLS = [
    "img/mgsdelta.png",
    "img/ACOdissey-Vertical-Village-WLPR-08.png",
    "img/sanfracampview.jpg",
]
GIFS = [
    "img/spidersky.gif",
    "img/arkham.gif",
    "img/marcussittedahh.gif",
    "img/samsittedahh.gif",
    "img/lessgo.gif",
    "img/samsatori.gif",
]
LOCAL_VIDEOS = [
    "img/setupkindle.mp4",
    "img/setupmarkus.mp4",
    "img/setupmarkus2.mp4",
]
# id, object key, keep audio, max width, max fps, crf
REMOTE_CLIPS = [
    ("deathstranding-samwindy", "Deathstranding-Samwindy-Videowlpr-83.mp4", True, 1600, 60, 22),
    ("metroexodus-03", "Metroexodus 03-119.mp4", False, 960, 30, 23),
    ("skyrim-04", "Skyrim Videowlpr 04-166.mp4", False, 960, 30, 23),
    ("witcher-1917", "The Witcher 3 2025.10.02 - 19.17.38.01-183.mp4", False, 960, 30, 23),
    ("arkham-01", "Batman-Arkhamknight-Videowlpr-01-(Cropped)-66.mp4", False, 960, 30, 23),
    ("sm2-skyview", "Sm2-Skyview-Videowlpr 2-164.mp4", False, 960, 30, 23),
    ("madmax-moon", "Mad-Max-Moonlighthouse-Videowlpr-115.mp4", False, 960, 30, 23),
    ("prey-2017", "Prey (2017) 2025.09.08 - 18.00.41.02 - Trm-143.mp4", False, 960, 30, 23),
    ("specops-03", "Specops Videowlpr 03-174.mp4", False, 960, 30, 23),
]
STILL_WIDTHS = (640, 960, 1280)


def run(cmd: list[str]) -> None:
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        tail = (proc.stderr or proc.stdout or "")[-2000:]
        raise RuntimeError(f"command failed ({proc.returncode}): {' '.join(cmd[:6])}\n{tail}")


def probe(path: Path) -> dict:
    proc = subprocess.run(
        [
            "ffprobe", "-v", "error", "-show_entries",
            "format=duration,size:stream=codec_type,codec_name,width,height,avg_frame_rate",
            "-of", "json", str(path),
        ],
        capture_output=True, text=True, check=True,
    )
    data = json.loads(proc.stdout or "{}")
    streams = data.get("streams") or []
    video = next((s for s in streams if s.get("codec_type") == "video"), {})
    rate = video.get("avg_frame_rate") or "0/1"
    num, den = rate.split("/")
    fps = float(num) / float(den) if den and float(den) else 0.0
    fmt = data.get("format") or {}
    return {
        "width": int(video.get("width") or 0),
        "height": int(video.get("height") or 0),
        "fps": round(fps, 3),
        "duration": float(fmt.get("duration") or 0),
        "has_audio": any(s.get("codec_type") == "audio" for s in streams),
        "bytes": path.stat().st_size,
    }


def dominant(path: Path) -> str:
    proc = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-vf", "scale=1:1,format=rgb24",
         "-frames:v", "1", "-f", "rawvideo", "-"],
        capture_output=True,
    )
    raw = proc.stdout[:3]
    if len(raw) < 3:
        return "#14121c"
    return "#{:02x}{:02x}{:02x}".format(raw[0], raw[1], raw[2])


def even(value: int) -> int:
    return max(2, value - (value % 2))


def still_targets(width: int) -> list[int]:
    cap = min(width, 1280)
    widths = [w for w in STILL_WIDTHS if w < width - 4]
    if cap not in widths:
        widths.append(cap)
    return sorted(set(widths))


def encode_still(rel: str) -> dict:
    src = ROOT / rel
    info = probe(src)
    slug = src.stem.lower().replace(" ", "-")
    folder = OUT / "stills"
    folder.mkdir(parents=True, exist_ok=True)
    widths = still_targets(info["width"])
    webps = []
    avifs = []
    for width in widths:
        webp = folder / f"{slug}-{width}.webp"
        avif = folder / f"{slug}-{width}.avif"
        scale = f"scale={width}:-2:flags=lanczos"
        run(["ffmpeg", "-y", "-i", str(src), "-vf", scale, "-frames:v", "1",
             "-c:v", "libwebp", "-quality", "82", str(webp)])
        run(["ffmpeg", "-y", "-i", str(src), "-vf", scale, "-frames:v", "1",
             "-c:v", "libaom-av1", "-still-picture", "1", "-cpu-used", "6",
             "-crf", "30", "-b:v", "0", "-pix_fmt", "yuv420p", str(avif)])
        webps.append({"width": width, "path": webp.relative_to(ROOT).as_posix(), "bytes": webp.stat().st_size})
        avifs.append({"width": width, "path": avif.relative_to(ROOT).as_posix(), "bytes": avif.stat().st_size})
    lqip = folder / f"{slug}-lqip.webp"
    run(["ffmpeg", "-y", "-i", str(src), "-vf", "scale=32:-2:flags=lanczos,gblur=sigma=2",
         "-frames:v", "1", "-c:v", "libwebp", "-quality", "45", str(lqip)])
    return {
        "kind": "still",
        "master": rel,
        "masterBytes": info["bytes"],
        "width": info["width"],
        "height": info["height"],
        "color": dominant(src),
        "lqip": lqip.relative_to(ROOT).as_posix(),
        "lqipBytes": lqip.stat().st_size,
        "webp": webps,
        "avif": avifs,
    }


def encode_gif(rel: str) -> dict:
    src = ROOT / rel
    info = probe(src)
    slug = src.stem.lower().replace(" ", "-")
    folder = OUT / "loops"
    folder.mkdir(parents=True, exist_ok=True)
    vf = "scale=trunc(iw/2)*2:trunc(ih/2)*2:flags=lanczos"
    if info["fps"] > 30:
        vf += ",fps=30"
    mp4 = folder / f"{slug}.mp4"
    webm = folder / f"{slug}.webm"
    poster = folder / f"{slug}-poster.webp"
    run(["ffmpeg", "-y", "-i", str(src), "-an", "-movflags", "+faststart", "-pix_fmt", "yuv420p",
         "-vf", vf, "-c:v", "libx264", "-preset", "fast", "-crf", "20", str(mp4)])
    run(["ffmpeg", "-y", "-i", str(src), "-an", "-vf", vf, "-c:v", "libvpx-vp9",
         "-crf", "32", "-b:v", "0", "-row-mt", "1", "-deadline", "good", "-cpu-used", "4", str(webm)])
    ss = "0.4" if info["duration"] < 1 else str(min(1.2, info["duration"] * 0.25))
    run(["ffmpeg", "-y", "-ss", ss, "-i", str(src), "-frames:v", "1",
         "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2:flags=lanczos",
         "-c:v", "libwebp", "-quality", "82", str(poster)])
    webm_bytes = webm.stat().st_size
    mp4_bytes = mp4.stat().st_size
    if webm_bytes > mp4_bytes * 0.95:
        webm.unlink()
        webm_path = ""
        webm_bytes = 0
    else:
        webm_path = webm.relative_to(ROOT).as_posix()
    return {
        "kind": "loop",
        "master": rel,
        "masterBytes": info["bytes"],
        "width": info["width"],
        "height": info["height"],
        "color": dominant(poster),
        "poster": poster.relative_to(ROOT).as_posix(),
        "posterBytes": poster.stat().st_size,
        "mp4": mp4.relative_to(ROOT).as_posix(),
        "mp4Bytes": mp4_bytes,
        "webm": webm_path,
        "webmBytes": webm_bytes,
    }


def encode_local_video(rel: str) -> dict:
    src = ROOT / rel
    info = probe(src)
    slug = src.stem.lower().replace(" ", "-")
    folder = OUT / "clips"
    folder.mkdir(parents=True, exist_ok=True)
    poster = folder / f"{slug}-poster.webp"
    display = folder / f"{slug}.mp4"
    ss = "0.4" if info["duration"] < 1 else str(min(1.0, max(0.2, info["duration"] * 0.15)))
    run(["ffmpeg", "-y", "-ss", ss, "-i", str(src), "-frames:v", "1",
         "-vf", "scale=trunc(min(iw\\,960)/2)*2:-2:flags=lanczos",
         "-c:v", "libwebp", "-quality", "80", str(poster)])
    audio = ["-c:a", "aac", "-b:a", "96k"] if info["has_audio"] else ["-an"]
    run(["ffmpeg", "-y", "-i", str(src), "-movflags", "+faststart", "-pix_fmt", "yuv420p",
         "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2:flags=lanczos",
         "-c:v", "libx264", "-preset", "fast", "-crf", "22", "-profile:v", "high",
         *audio, str(display)])
    display_bytes = display.stat().st_size
    use_display = display_bytes < info["bytes"] * 0.9
    if not use_display:
        display.unlink()
    return {
        "kind": "local-video",
        "master": rel,
        "masterBytes": info["bytes"],
        "width": info["width"],
        "height": info["height"],
        "color": dominant(poster),
        "poster": poster.relative_to(ROOT).as_posix(),
        "posterBytes": poster.stat().st_size,
        "mp4": display.relative_to(ROOT).as_posix() if use_display else rel,
        "mp4Bytes": display_bytes if use_display else info["bytes"],
        "keptMasterForPlayback": not use_display,
    }


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 0:
        return
    tmp = dest.with_suffix(dest.suffix + ".part")
    run(["curl", "-fL", "--retry", "3", "--retry-delay", "2", "-A", "Mozilla/5.0",
         "--max-time", "300", "-o", str(tmp), url])
    tmp.replace(dest)


def encode_remote(spec: tuple) -> dict:
    slug, key, keep_audio, max_w, max_fps, crf = spec
    url = R2 + urllib.parse.quote(key, safe="")
    src = TMP / f"{slug}.mp4"
    download(url, src)
    info = probe(src)
    folder = OUT / "clips"
    folder.mkdir(parents=True, exist_ok=True)
    poster = folder / f"{slug}-poster.webp"
    display = folder / f"{slug}.mp4"
    width = even(min(max_w, info["width"] or max_w))
    vf = f"scale={width}:-2:flags=lanczos"
    if info["fps"] > max_fps:
        vf += f",fps={max_fps}"
    ss = "0.6" if info["duration"] < 1.2 else str(min(1.5, max(0.4, info["duration"] * 0.12)))
    run(["ffmpeg", "-y", "-ss", ss, "-i", str(src), "-frames:v", "1",
         "-vf", f"scale={min(960, width)}:-2:flags=lanczos",
         "-c:v", "libwebp", "-quality", "80", str(poster)])
    audio = ["-c:a", "aac", "-b:a", "128k"] if keep_audio else ["-an"]
    run(["ffmpeg", "-y", "-i", str(src), "-movflags", "+faststart", "-pix_fmt", "yuv420p",
         "-vf", vf, "-c:v", "libx264", "-preset", "fast", "-crf", str(crf),
         "-profile:v", "high", *audio, str(display)])
    return {
        "kind": "remote-video",
        "id": slug,
        "master": url,
        "masterBytes": info["bytes"],
        "width": info["width"],
        "height": info["height"],
        "fps": info["fps"],
        "duration": round(info["duration"], 2),
        "color": dominant(poster),
        "poster": poster.relative_to(ROOT).as_posix(),
        "posterBytes": poster.stat().st_size,
        "mp4": display.relative_to(ROOT).as_posix(),
        "mp4Bytes": display.stat().st_size,
        "profile": {"maxWidth": max_w, "maxFps": max_fps, "crf": crf, "audio": keep_audio},
    }


def main() -> None:
    if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
        raise SystemExit("ffmpeg and ffprobe are required")
    OUT.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(parents=True, exist_ok=True)
    manifest = {"stills": [], "loops": [], "localVideos": [], "remoteVideos": []}
    for rel in STILLS:
        print(f"still {rel}", flush=True)
        manifest["stills"].append(encode_still(rel))
    for rel in GIFS:
        print(f"gif {rel}", flush=True)
        manifest["loops"].append(encode_gif(rel))
    for rel in LOCAL_VIDEOS:
        print(f"local video {rel}", flush=True)
        manifest["localVideos"].append(encode_local_video(rel))
    print("remote clips", flush=True)
    with ThreadPoolExecutor(max_workers=3) as pool:
        futures = [pool.submit(encode_remote, spec) for spec in REMOTE_CLIPS]
        for future in as_completed(futures):
            item = future.result()
            manifest["remoteVideos"].append(item)
            print(f"  {item['id']}: {item['masterBytes']/1024/1024:.1f}MB -> {item['mp4Bytes']/1024/1024:.1f}MB", flush=True)
    manifest["remoteVideos"].sort(key=lambda item: item["id"])
    dest = OUT / "manifest.json"
    dest.write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"wrote {dest}")


if __name__ == "__main__":
    main()
