#!/usr/bin/env python3
"""
Hidden Archive - Faceless Video Pipeline
=========================================

Generates a complete vertical short (1080x1920) end-to-end:
  1. LLM writes the scene-by-scene JSON script
  2. ElevenLabs generates Brian-voice narration per scene
  3. Pexels supplies vertical b-roll per scene
  4. ffmpeg composites with Ken Burns zoom, burned captions,
     color grade, and film noise. Concats all scenes into final.mp4.

Usage:
  python pipeline.py <case_slug> "<topic prompt>"

Example:
  python pipeline.py lead_masks_1966 "The Lead Masks Case, Brazil 1966 - two electronic technicians found dead on Vintem Hill wearing lead masks"

Required env vars (put in .env or export):
  SCRIPT_API_KEY
  ELEVENLABS_API_KEY
  PEXELS_API_KEY
"""

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

import requests
from anthropic import Anthropic as _ScriptClient
from dotenv import load_dotenv

load_dotenv()

BRAND_FILE = Path(__file__).parent / "brand.json"
OUTPUT_BASE = Path(__file__).parent / "cases"


# ---------- utilities ----------

def log(stage, msg):
    print(f"[{stage}] {msg}", flush=True)


def run(cmd, **kwargs):
    """Run a subprocess command and raise if it fails."""
    result = subprocess.run(cmd, capture_output=True, text=True, **kwargs)
    if result.returncode != 0:
        print("FFMPEG/CMD ERROR:", result.stderr[-2000:], file=sys.stderr)
        raise RuntimeError(f"Command failed: {' '.join(str(c) for c in cmd)}")
    return result


def load_brand():
    with open(BRAND_FILE) as f:
        return json.load(f)


def setup_case(case_slug):
    case_dir = OUTPUT_BASE / case_slug
    (case_dir / "audio").mkdir(parents=True, exist_ok=True)
    (case_dir / "visuals").mkdir(parents=True, exist_ok=True)
    (case_dir / "captions").mkdir(parents=True, exist_ok=True)
    return case_dir


# ---------- step 1: script ----------

SYSTEM_PROMPT = """You write scripts for "{channel_name}", a faceless YouTube Shorts / TikTok channel about unsolved cases, cold cases, and unexplained mysteries.

Channel tagline: "{tagline}"
Channel tone: dark, documentary, slightly menacing. Documentary narrator energy. Short, declarative sentences. No filler, no "imagine this", no "today we'll explore". Get straight to the facts.

Output ONLY a single valid JSON object. No commentary, no markdown, no code fences. The exact schema:

{{
  "title": "short hook-style title for upload",
  "scenes": [
    {{
      "id": 1,
      "narration": "voiceover text - what the narrator says aloud",
      "duration_seconds": 4,
      "broll_keywords": "2-4 word search phrase for stock footage",
      "on_screen_text": "OPTIONAL short overlay text in CAPS or empty string"
    }}
  ]
}}

Hard rules:
- Exactly 6 scenes
- Scene 1 = HOOK (3-5 sec, shocking opener, ends with a question or unresolved fact)
- Scene 2 = SETUP (8-12 sec, names, date, location)
- Scene 3 = EVIDENCE (10-15 sec, physical clues, what was found)
- Scene 4 = ESCALATION (12-18 sec, weird details, witnesses, what makes it unexplainable)
- Scene 5 = CLIFFHANGER (8-12 sec, what's still unknown today)
- Scene 6 = OUTRO (3-4 sec, channel tagline + name)
- Total narration target: 55-60 seconds
- broll_keywords: must be searchable on stock sites (Pexels). Examples: "foggy hill night", "vintage typewriter", "old hospital corridor", "candle flickering dark". Avoid proper nouns and specific people.
- narration: write what's said aloud. No stage directions. No "[pause]".
- on_screen_text: use sparingly, mainly for dates, numbers, or stamps like "UNSOLVED", "1966", "NO CAUSE OF DEATH". Empty string if none.
"""


def generate_script(topic, brand):
    client = _ScriptClient(api_key=os.environ["SCRIPT_API_KEY"])
    system = SYSTEM_PROMPT.format(
        channel_name=brand["channel_name"],
        tagline=brand["tagline"],
    )
    msg = client.messages.create(
        model=brand["script_model"],
        max_tokens=2000,
        system=system,
        messages=[{"role": "user", "content": f"Write the script for this case: {topic}"}],
    )
    text = "".join(b.text for b in msg.content if b.type == "text").strip()
    # strip code fences if the model added any
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    return json.loads(text)


# ---------- step 2: audio ----------

def generate_audio(scene, case_dir, brand):
    api_key = os.environ["ELEVENLABS_API_KEY"]
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{brand['voice_id']}"
    payload = {
        "text": scene["narration"],
        "model_id": brand["tts_model"],
        "voice_settings": brand["voice_settings"],
    }
    headers = {"xi-api-key": api_key, "Content-Type": "application/json"}
    r = requests.post(url, json=payload, headers=headers, timeout=120)
    r.raise_for_status()
    audio_path = case_dir / "audio" / f"scene_{scene['id']:02d}.mp3"
    audio_path.write_bytes(r.content)
    return audio_path


def get_audio_duration(audio_path):
    r = run([
        "ffprobe", "-i", str(audio_path),
        "-show_entries", "format=duration",
        "-v", "quiet", "-of", "csv=p=0",
    ])
    return float(r.stdout.strip())


# ---------- step 3: b-roll ----------

def fetch_broll(scene, case_dir):
    api_key = os.environ["PEXELS_API_KEY"]
    headers = {"Authorization": api_key}
    params = {
        "query": scene["broll_keywords"],
        "orientation": "portrait",
        "per_page": 8,
    }
    r = requests.get("https://api.pexels.com/videos/search", headers=headers, params=params, timeout=60)
    r.raise_for_status()
    data = r.json()
    videos = data.get("videos") or []

    if not videos:
        # fallback to landscape - we'll crop to vertical anyway
        params["orientation"] = "landscape"
        r = requests.get("https://api.pexels.com/videos/search", headers=headers, params=params, timeout=60)
        videos = r.json().get("videos") or []

    if not videos:
        raise RuntimeError(f"No Pexels b-roll for: {scene['broll_keywords']}")

    # Pick the highest-resolution HD/SD file from the first usable video
    video = videos[0]
    files = sorted(
        [f for f in video["video_files"] if f.get("file_type") == "video/mp4"],
        key=lambda f: (f.get("width") or 0) * (f.get("height") or 0),
        reverse=True,
    )
    file_url = files[0]["link"]

    out = case_dir / "visuals" / f"scene_{scene['id']:02d}_raw.mp4"
    with requests.get(file_url, stream=True, timeout=300) as resp:
        resp.raise_for_status()
        with open(out, "wb") as f:
            for chunk in resp.iter_content(8192):
                f.write(chunk)
    return out


# ---------- step 4: captions ----------

def format_srt_time(seconds):
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int(round((seconds - int(seconds)) * 1000))
    if ms == 1000:
        ms = 0
        s += 1
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def build_srt(narration, duration, words_per_chunk=3):
    words = re.findall(r"\S+", narration)
    if not words:
        return ""
    chunks = [" ".join(words[i:i + words_per_chunk]) for i in range(0, len(words), words_per_chunk)]
    chunk_dur = duration / len(chunks)
    lines = []
    for i, chunk in enumerate(chunks):
        start = i * chunk_dur
        end = min(duration, (i + 1) * chunk_dur)
        lines += [
            str(i + 1),
            f"{format_srt_time(start)} --> {format_srt_time(end)}",
            chunk.upper(),
            "",
        ]
    return "\n".join(lines)


def caption_force_style(brand):
    s = brand["caption_style"]
    return (
        f"FontName={s['fontname']},"
        f"FontSize={s['fontsize']},"
        f"PrimaryColour={s['primary_colour']},"
        f"OutlineColour={s['outline_colour']},"
        f"BorderStyle=1,"
        f"Outline={s['outline']},"
        f"Shadow={s['shadow']},"
        f"Alignment={s['alignment']},"
        f"MarginV={s['margin_v']},"
        f"Bold=1"
    )


# ---------- step 5: compose scene ----------

def ffmpeg_escape(text):
    """Escape text for use inside an ffmpeg filtergraph drawtext argument."""
    return (
        text.replace("\\", "\\\\")
            .replace(":", "\\:")
            .replace("'", "\u2019")
            .replace(",", "\\,")
    )


def build_scene(scene, audio_path, raw_video, srt_path, case_dir, brand):
    duration = get_audio_duration(audio_path)
    W, H = brand["resolution"]
    fps = brand["fps"]
    out = case_dir / "visuals" / f"scene_{scene['id']:02d}_final.mp4"

    # Filter chain:
    # 1. scale + crop to vertical
    # 2. zoompan Ken Burns
    # 3. burn SRT captions
    # 4. drawtext on_screen_text if present
    # 5. color grade + noise
    zoom_frames = max(1, int(duration * fps))
    vf_parts = [
        f"scale={W}:{H}:force_original_aspect_ratio=increase",
        f"crop={W}:{H}",
        f"zoompan=z='min(zoom+0.0006,1.18)':d={zoom_frames}:s={W}x{H}:fps={fps}",
        f"subtitles='{srt_path.as_posix()}':force_style='{caption_force_style(brand)}'",
    ]

    on_screen = (scene.get("on_screen_text") or "").strip()
    if on_screen:
        font = brand.get("overlay_font", "")
        font_arg = f"fontfile='{font}':" if font and Path(font).exists() else ""
        vf_parts.append(
            f"drawtext={font_arg}"
            f"text='{ffmpeg_escape(on_screen)}':"
            f"fontsize=72:fontcolor=white:borderw=5:bordercolor=black:"
            f"box=1:boxcolor=red@0.35:boxborderw=18:"
            f"x=(w-text_w)/2:y=220"
        )

    vf_parts.append(brand["color_grade"])
    vf_parts.append(brand["film_noise"])
    vf = ",".join(vf_parts)

    cmd = [
        "ffmpeg", "-y",
        "-stream_loop", "-1", "-t", f"{duration:.3f}", "-i", str(raw_video),
        "-i", str(audio_path),
        "-filter_complex", f"[0:v]{vf}[v]",
        "-map", "[v]", "-map", "1:a",
        "-c:v", "libx264", "-preset", "medium", "-crf", "20",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-r", str(fps),
        "-shortest",
        str(out),
    ]
    run(cmd)
    return out


# ---------- step 6: concat ----------

def concat_scenes(scene_clips, case_dir):
    concat_list = case_dir / "concat.txt"
    with open(concat_list, "w") as f:
        for clip in scene_clips:
            f.write(f"file '{clip.resolve().as_posix()}'\n")

    final = case_dir / "final.mp4"
    run([
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0",
        "-i", str(concat_list),
        "-c:v", "libx264", "-preset", "medium", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        str(final),
    ])
    return final


# ---------- main ----------

def main():
    parser = argparse.ArgumentParser(description="Hidden Archive faceless video pipeline")
    parser.add_argument("case_slug", help="folder name, e.g. lead_masks_1966")
    parser.add_argument("topic", help="topic prompt for the script writer")
    args = parser.parse_args()

    for var in ("SCRIPT_API_KEY", "ELEVENLABS_API_KEY", "PEXELS_API_KEY"):
        if not os.environ.get(var):
            print(f"Missing env var: {var}", file=sys.stderr)
            sys.exit(1)

    brand = load_brand()
    case_dir = setup_case(args.case_slug)

    log("1/5", f"Generating script for: {args.topic}")
    script = generate_script(args.topic, brand)
    (case_dir / "script.json").write_text(json.dumps(script, indent=2))
    log("1/5", f"Title: {script['title']}")
    log("1/5", f"Scenes: {len(script['scenes'])}")

    scene_clips = []
    for scene in script["scenes"]:
        sid = scene["id"]
        log(f"2-4/5", f"Scene {sid}: {scene['narration'][:60]}...")

        log(f"2/5", f"  audio")
        audio_path = generate_audio(scene, case_dir, brand)
        duration = get_audio_duration(audio_path)

        log(f"3/5", f"  b-roll ({scene['broll_keywords']})")
        raw_video = fetch_broll(scene, case_dir)

        log(f"4/5", f"  captions + compose ({duration:.2f}s)")
        srt = build_srt(scene["narration"], duration, brand["caption_style"]["words_per_chunk"])
        srt_path = case_dir / "captions" / f"scene_{sid:02d}.srt"
        srt_path.write_text(srt, encoding="utf-8")

        clip = build_scene(scene, audio_path, raw_video, srt_path, case_dir, brand)
        scene_clips.append(clip)

    log("5/5", "Concatenating scenes into final.mp4")
    final = concat_scenes(scene_clips, case_dir)

    log("DONE", f"Output: {final}")
    log("DONE", f"Upload title: {script['title']}")


if __name__ == "__main__":
    main()
