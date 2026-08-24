# Hidden Archive — Faceless Video Pipeline

End-to-end faceless YouTube Shorts / TikTok video generator for the Hidden Archive channel. One command in, one MP4 out.

## What it does

```
"The Lead Masks Case Brazil 1966"
              ↓
         LLM (script)           ← writes 6-scene JSON
              ↓
       ElevenLabs (Brian)       ← narrates each scene
              ↓
        Pexels (b-roll)         ← fetches vertical stock footage
              ↓
           ffmpeg               ← Ken Burns + burned captions + grade + noise
              ↓
          final.mp4             ← 1080x1920, ~60 sec, ready to upload
```

## Setup (one time, ~5 min)

```bash
# 1. Install Python deps
pip install -r requirements.txt

# 2. Make sure ffmpeg is installed
ffmpeg -version    # should print version info
# macOS:  brew install ffmpeg
# Ubuntu: sudo apt install ffmpeg

# 3. Get API keys
#    ElevenLabs:  https://elevenlabs.io/app/settings/api-keys
#    Pexels:      https://www.pexels.com/api/  (free)
#    Script LLM:  provider console of your choice

# 4. Set up env
cp .env.example .env
# edit .env, paste your keys
```

## Run

```bash
python pipeline.py lead_masks_1966 "The Lead Masks Case, Brazil 1966 - two electronic technicians found dead on Vintem Hill wearing lead masks, no cause of death"
```

Output ends up at `cases/lead_masks_1966/final.mp4`.

The script also drops:
- `script.json` — the scene-by-scene JSON the LLM wrote (edit and re-run scenes if you want)
- `audio/scene_NN.mp3` — narration per scene
- `visuals/scene_NN_raw.mp4` — raw Pexels b-roll
- `visuals/scene_NN_final.mp4` — composed scene clips
- `captions/scene_NN.srt` — burned-in caption SRT

## Customize the look

Everything visual lives in `brand.json`:

- **Voice**: `voice_id` (currently Brian, `nPczCjzI2devNBz1zQrb`). Swap for any ElevenLabs voice ID.
- **Captions**: `caption_style.fontname`, `fontsize`, `margin_v`, `words_per_chunk`
- **Color grade**: `color_grade` — currently `contrast=1.12:saturation=0.82:gamma=0.95` (cold, slightly desaturated, documentary feel)
- **Film noise**: `film_noise` — set to empty string `""` if you don't want grain
- **Resolution / fps**: `[1080, 1920]` and `25` (TikTok/Shorts standard)

## Arabic channel (الأرشيف المخفي)

Make a copy of `brand.json` as `brand-ar.json`:

```json
{
  "channel_name": "الأرشيف المخفي",
  "tagline": "قضايا حقيقية. بلا أجوبة.",
  "language": "ar",
  "voice_id": "<an Arabic ElevenLabs voice ID>",
  ...
}
```

Edit `pipeline.py` line `BRAND_FILE = Path(__file__).parent / "brand.json"` to point at it, or pass it via env var.

The `subtitles` filter handles RTL automatically; you may want to bump `fontsize` and use a font that supports Arabic (e.g. Tajawal, Cairo).

## Iteration tips

- **First run is the editor's test.** Watch `final.mp4`, then go edit `script.json` directly and re-run individual stages if a scene is off. Add a `--from-script` flag if you want to skip script regeneration (easy hack — `if script_json_exists: load it`).
- **Bad b-roll?** Re-run with a different `broll_keywords` value. The Pexels API picks the first match; you can also widen `per_page` and randomize.
- **Voice off?** Tweak `voice_settings.style` (0.0 = flat narrator, 0.3+ = more theatrical). For pure dread go `stability: 0.55, style: 0.05`.
- **Add a music bed:** drop an MP3 in `assets/bed.mp3` and add a final ffmpeg pass that mixes it in at the dB level from `background_music_db`. (Left out of v1 for simplicity.)

## Cost per video

| Step | Cost |
|---|---|
| LLM script (~1500 tokens) | ~$0.02 |
| ElevenLabs narration (~800 chars) | ~$0.12 |
| Pexels b-roll | $0.00 |
| **Total** | **~$0.14** |

## Next upgrades when you want them

1. **`--from-script` flag** to re-run downstream without regenerating script (5 min add)
2. **Music bed mixer** with ducking under narration (15 min add)
3. **Batch mode**: feed a CSV of topics, output a folder of MP4s overnight
4. **Auto-thumbnail**: LLM picks the most dramatic frame + overlays case title in VT323
5. **YouTube/TikTok upload via API** (the last manual step you'd still be doing)
