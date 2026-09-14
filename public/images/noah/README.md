# Noah portrait variations

Noah's original photograph and ten AI-generated visual interpretations, collected for a future carousel that crossfades between styles. These are image assets; the carousel itself is not implemented by this addition.

## Files

| File | Style and generation direction |
| --- | --- |
| [noah-original.jpg](noah-original.jpg) | Original user-supplied photograph, uploaded as `2582.jpg`; unchanged JPEG, 1536 × 1530. |
| [noah-simpsons.png](noah-simpsons.png) | Revised Simpsons character design: yellow skin, exaggerated cartoon anatomy, simple cel shapes and broad tooth-band smile. Replaces the first, less stylized Simpsons attempt. |
| [noah-archer.png](noah-archer.png) | Archer-inspired adult animation: angular anatomy, controlled outlines and sculpted cel shading. This is the earlier, more anatomically faithful sample; no stronger redesign was generated for Archer. |
| [noah-bobs-burgers.png](noah-bobs-burgers.png) | Bob's Burgers character design: rounded head, long simple nose, dot pupils, thin outlines and simplified sloping shoulders. |
| [noah-pixar.png](noah-pixar.png) | Pixar-inspired 3D animated character: enlarged expressive features, sculpted forms, warm lighting and tactile materials. |
| [noah-8-bit.png](noah-8-bit.png) | Chunky 8-bit-inspired game portrait, prompted for large pixel clusters and a small flat palette. |
| [noah-16-bit.png](noah-16-bit.png) | 16-bit-inspired RPG portrait, prompted for richer color ramps, visible pixels and restrained dithering. |
| [noah-star-trek.png](noah-star-trek.png) | Live-action Star Trek interpretation: burgundy Starfleet command uniform, communicator badge and a teal-framed window into space. |
| [noah-rubber-hose.png](noah-rubber-hose.png) | 1930s rubber-hose cartoon: pie-cut eyes, elastic grin, exaggerated shapes and aged cel/print texture. |
| [noah-comic-book.png](noah-comic-book.png) | Superhero comic illustration: heroic facial construction, brush inks, graphic shadows and halftone printing. |
| [noah-starcraft.png](noah-starcraft.png) | Terran unit portrait: burgundy powered armor, industrial teal bulkhead and a compact name/status HUD reading “NOAH”, “TERRAN ENGINEER”, “HP 100/100” and a mineral cost of 50. |

All generated files are 1254 × 1254 PNGs. They have been copied directly from the generated outputs without resizing, recompression or manual retouching. The pixel-art names describe the requested visual styles, not verified NES/SNES hardware limits or actual 128/192-pixel source files.

## How they were made

- **Source:** the same original photograph supplied by Noah as `2582.jpg` (JPEG, 1536 × 1530). Every variant was generated directly from that photograph; variants were not chained through one another. The original is preserved without re-encoding as [noah-original.jpg](noah-original.jpg).
- **Creative direction:** Noah selected the styles, reviewed samples and asked for much stronger character redesign after the first Simpsons/Archer pair looked too much like filters.
- **Generation interface:** ChatGPT Work's built-in OpenAI image generation/editing tool, `image_gen.imagegen`, invoked by the Codex assistant with the original as a referenced image and a separate text prompt for each output.
- **Image model / version:** the OpenAI image model provided by ChatGPT in September 2026. The tool did not expose the exact backend model ID or version, so this is a date-based attribution rather than a claim about a specific GPT Image or DALL·E release.
- **Assistant / orchestration:** GPT-6 Astra in ChatGPT / Codex (identified by Noah for this session) prepared the prompts and invoked the image tool. GPT-6 Astra is credited for prompting and direction, separately from the image-generating backend.
- **Workflow:** built-in image editing, not the image-generation CLI or a separately configured API model. No seed or exact backend quality configuration was exposed, so byte-for-byte regeneration is not promised.
- **Repository preparation date:** 2026-09-14.

## Shared art direction

The intended effect is Noah shifting between visual worlds while retaining a recognizable portrait. Keep the high forehead, short brown buzz cut, black rectangular glasses, clean-shaven face and cheerful smile. Preserve the broad chest-up pose and the burgundy/black/teal color distribution.

The revised direction deliberately lets each medium reshape facial and body proportions so the character belongs in that world. Authentic character design takes precedence over tracing the photo or matching facial landmarks exactly. The latest Simpsons image, Bob's Burgers and Pixar samples established this stronger direction.

The teal door and rectangular window arrangement provide background continuity. They may become a starship viewport or industrial bulkhead where the setting calls for it. Starfleet uniforms and Terran armor replace the shirt while keeping its burgundy color. Game/card interpretations may use a compact name/cost/stats overlay; a full card with abilities and flavor text is unnecessary.

### Reusable prompt summary

This summarizes the prompts rather than reproducing every original tool call verbatim:

> Use the original portrait as identity and broad staging reference. Reimagine Noah as a character authentically native to [STYLE], using strong stylization rather than a photographic filter. Keep his glasses, very short brown hair, cheerful expression, similar chest-up pose, burgundy clothing with black accents, and the teal door/window arrangement. Let anatomy change to fit the character design. Redraw the entire setting in the target medium. Produce one standalone square portrait. Avoid extra people, collages and text unless a compact game HUD is part of the style.

Use the file table above for each style's additional instructions. Star Trek intentionally uses a live-action treatment; the early Archer sample retains the initial, stricter anatomy-matching direction. Style names identify the requested visual references; these are custom AI-generated portraits, not studio-produced artwork.

## Using these assets

Files in this directory are served at `/images/noah/`, for example `/images/noah/noah-simpsons.png`. Keep explicit filenames in any future carousel list rather than treating every file in the folder as a slide.

Use a consistent square display area. The original photograph is slightly wider than square (1536 × 1530). The generated portraits are approximately compositionally aligned rather than registered pixel-for-pixel. Review transitions when implementing the carousel, especially for exaggerated faces and the StarCraft HUD. Preserve these full-resolution generated files if making optimized web derivatives.

The set includes every generated style available at the time of this addition, using the revised Simpsons image instead of the superseded first attempt. Magic: The Gathering and other brainstormed styles have not yet been generated.

## Web-optimized derivatives

The home page hero carousel renders all eleven slides at once (they crossfade in place rather than mounting on demand), so serving these full-resolution PNGs/JPEG directly would mean ~17MB loaded eagerly on every visit. `web/` holds a resized (longest side capped at 600px, ample for the hero's largest on-screen size even at high pixel density) WebP copy of each file, generated with Pillow:

```python
from PIL import Image
import os

MAX_DIM = 600
for f in os.listdir("public/images/noah"):
    if not f.endswith((".png", ".jpg")):
        continue
    im = Image.open(f"public/images/noah/{f}").convert("RGB")
    w, h = im.size
    scale = MAX_DIM / max(w, h)
    if scale < 1:
        im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    im.save(f"public/images/noah/web/{os.path.splitext(f)[0]}.webp", "WEBP", quality=82, method=6)
```

This brings the set down to well under 1MB total. Regenerate `web/` (same command) if a source file in this directory is ever replaced or a new style is added; the hero references `web/*.webp`, never the full-resolution originals directly.
