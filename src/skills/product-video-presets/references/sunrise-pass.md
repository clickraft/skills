# Sunrise Pass (`sunrise-pass`)

**What the viewer sees:** Light moving from darkness to warm sunrise.

## Parameters

| Stage | Setting | Value |
|---|---|---|
| 1 — start frame | model / resolution | `nano-banana-pro` / `2K` |
| 1 — start frame | aspect ratio | same as the video (default `3:4`) |
| 1 — start frame | prompt | start-frame prompt below (shared, see [start-frame.md](start-frame.md)) |
| 2 — video | model | `seedance-2-standard-i2v` |
| 2 — video | input | <cli>`--start-frame <stage-1 resultUrl>`</cli><mcp>`startFrame: <stage-1 resultUrl>`</mcp> |
| 2 — video | duration | `6` seconds |
| 2 — video | aspect ratio | `3:4` default; user may override (1:1, 9:16, 16:9, 4:3, 21:9) |
| 2 — video | resolution | `720p` (the source spec is 1080p; 720p is our maximum) |
| 2 — video | audio | silent — the prompt asks for no sound, and a live test clip came out silent |
| — | typical cost | ~400 (start frame) + ~3630 (video) ≈ 4030 credits; always quote the live estimate |

## Stage 1 prompt — start frame

```text
Turn the attached photo into the opening frame of a product film. The product in the photo is the ground truth: reproduce it exactly. Cut it out and stand it upright, whole and uncropped, centered both horizontally and vertically in the frame, on a seamless studio sweep in one solid color, with the floor curving into the back wall without a visible seam. Take that color from the product itself: pick its most distinctive brand or accent hue from the packaging, label, logo or material, and fall back to a neutral black, white or gray only when the product shows no real color. If the product would blend into the backdrop, shift the same hue slightly lighter or darker so its edges stay crisp; never bring in a new color. Size the product so its full height spans roughly 60 to 70 percent of the frame height (for a product wider than it is tall, its full width spans that share of the frame width), with even breathing room on every side for camera movement; do not inherit the photo's crop, framing or camera height, and frame it straight on from about its own mid-height. Light it with soft, controlled studio light and give it a single believable contact shadow on the floor. Keep its shape, proportions, construction, materials, colors, logo position and every line of label text identical to the photo. Do not redesign, simplify, restyle, rewrite, crop, tilt, open, duplicate or warp it. No props, people, hands, scenery, patterns, gradients, added text, captions, borders, watermarks or other products. Photorealistic, sharp and stable, ready to serve as the first frame of an animation.
```

## Stage 2 prompt — motion

```text
A 6-second premium product film that opens on the supplied start frame and treats it as the exact reference for the product. The light shifts gradually like a sunrise, from cool darkness to warm directional light. The product emerges naturally as shadows move across it and finishes in a bright, premium hero look. The product must remain exactly the product in the first frame from start to finish: same outline, proportions, materials, colors, logo position and packaging, with every word of the label crisp and unchanged. Motion is smooth and physically believable, consistent from frame to frame, with steady edges and one coherent lighting setup. No morphing, melting, warping, duplicating, swapping or redesigning the product. No people, hands, invented claims, extra logos, on-screen text, captions, watermarks or other products. Silent clip: no music, no voice, no sound design. Close on a clean, steady product frame that works as a social post.
```

## Notes

- A lighting preset: the clip opens darker than the start frame and brightens back to it, so the first second is intentionally dim.
- Keep the prepared backdrop color through the clip (only the passing light effect may change it briefly).
- Send both prompts unchanged; put user wishes (ratio, count) into <cli>flags</cli><mcp>request fields</mcp>, not into the prompt.
