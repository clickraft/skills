# Start frame (stage 1, shared by every preset)

Every preset opens its video on a prepared still, not on the user's raw photo. The still
puts the product alone on a seamless backdrop in its own brand color, framed with room for
the camera to move. It is an internal dependency: never deliver it as a result, never show
it unless the user asks what went wrong.

## Parameters

| Setting | Value |
|---|---|
| Model | `nano-banana-pro` |
| Resolution | `2K` |
| Aspect ratio | the final video ratio (default `3:4`) — the start frame and the video must match |
| Input | `--reference-image <url\|path>` (the user's photo) or `--product <uuid>[:imageId]` (catalog product) |
| Count | one image |
| Cost | ~400 credits (verify with `generate estimate`) |

## What the prompt does

1. Isolates the product, centered, upright, fully visible.
2. Places it on a seamless one-color sweep (floor curving into the wall).
3. Samples the backdrop color **from the product** — a brand or accent hue first, a neutral
   only when the product has no real color, and a lighter/darker shift of the same hue only
   when the edges would disappear.
4. Scales the product to **60–70% of the frame**, leaving motion-safe margin.
5. Soft studio light, one contact shadow.
6. Locks identity: shape, proportions, materials, colors, logo position, label text.
7. Forbids props, people, hands, scenery, patterns, gradients, text, borders, watermarks.

## Prompt (send unchanged)

```text
Turn the attached photo into the opening frame of a product film. The product in the photo is the ground truth: reproduce it exactly. Cut it out and stand it upright in the middle of the frame, whole and uncropped, on a seamless studio sweep in one solid color, with the floor curving into the back wall without a visible seam. Take that color from the product itself: pick its most distinctive brand or accent hue from the packaging, label, logo or material, and fall back to a neutral black, white or gray only when the product shows no real color. If the product would blend into the backdrop, shift the same hue slightly lighter or darker so its edges stay crisp; never bring in a new color. Size the product so it fills roughly 60 to 70 percent of the frame, with even breathing room on every side for camera movement. Light it with soft, controlled studio light and give it a single believable contact shadow on the floor. Keep its shape, proportions, construction, materials, colors, logo position and every line of label text identical to the photo. Do not redesign, simplify, restyle, rewrite, crop, tilt, open, duplicate or warp it. No props, people, hands, scenery, patterns, gradients, added text, captions, borders, watermarks or other products. Photorealistic, sharp and stable, ready to serve as the first frame of an animation.
```

## Check before stage 2

Open the saved file and confirm: the product matches the photo (same label text, same
colors, nothing added or removed), it is whole and centered, and the backdrop is one flat
color. If the product changed, re-run stage 1 once; if it fails again, stop and tell the
user the photo could not be prepared (suggest a clearer, front-facing photo). Never send a
failed or still-running start frame into stage 2.
