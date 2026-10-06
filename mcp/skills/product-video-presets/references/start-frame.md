# Start frame (stage 1, shared by every preset)

Every preset opens its video on a prepared still, not on the user's raw photo. The still
puts the product alone on a seamless backdrop in its own brand color, framed with room for
the camera to move. It is an internal dependency: never deliver it as a result, never show
it unless the user asks what went wrong. The generation widget shows it while it renders; that is expected.

## Parameters

| Setting | Value |
|---|---|
| Model | `nano-banana-pro` |
| Resolution | `2K` |
| Aspect ratio | the final video ratio (default `3:4`) — the start frame and the video must match |
| Input | `referenceImages: ["<url>"]` (the user's photo) or `products: [{ id, imageId? }]` (catalog product) |
| Count | one image |
| Cost | ~400 credits (verify with `generate_estimate`) |

## What the prompt does

1. Isolates the product, upright, fully visible, centered both horizontally and
   vertically — never inheriting the photo's crop, framing or camera height (a live test
   without this put the product low, off-centre and too small).
2. Places it on a seamless one-color sweep (floor curving into the wall).
3. Samples the backdrop color **from the product** — a brand or accent hue first, a neutral
   only when the product has no real color, and a lighter/darker shift of the same hue only
   when the edges would disappear.
4. Scales the product so its bounding box spans **60–70% of the frame height** (of the
   width for a product wider than tall), leaving motion-safe margin.
5. Soft studio light, one contact shadow.
6. Locks identity: shape, proportions, materials, colors, logo position, label text.
7. Forbids props, people, hands, scenery, patterns, gradients, text, borders, watermarks.

## Prompt (send unchanged)

```text
Turn the attached photo into the opening frame of a product film. The product in the photo is the ground truth: reproduce it exactly. Cut it out and stand it upright, whole and uncropped, centered both horizontally and vertically in the frame, on a seamless studio sweep in one solid color, with the floor curving into the back wall without a visible seam. Take that color from the product itself: pick its most distinctive brand or accent hue from the packaging, label, logo or material, and fall back to a neutral black, white or gray only when the product shows no real color. If the product would blend into the backdrop, shift the same hue slightly lighter or darker so its edges stay crisp; never bring in a new color. Size the product so its full height spans roughly 60 to 70 percent of the frame height (for a product wider than it is tall, its full width spans that share of the frame width), with even breathing room on every side for camera movement; do not inherit the photo's crop, framing or camera height, and frame it straight on from about its own mid-height. Light it with soft, controlled studio light and give it a single believable contact shadow on the floor. Keep its shape, proportions, construction, materials, colors, logo position and every line of label text identical to the photo. Do not redesign, simplify, restyle, rewrite, crop, tilt, open, duplicate or warp it. No props, people, hands, scenery, patterns, gradients, added text, captions, borders, watermarks or other products. Photorealistic, sharp and stable, ready to serve as the first frame of an animation.
```

## Check before stage 2

Look at the finished start frame's preview image (it is small: judge label text only as far as it is legible there) and confirm:

- **Identity:** the product matches the photo (same label text, same colors, nothing
  added or removed) and is whole.
- **Framing:** the centre of the product's bounding box sits at the centre of the frame,
  horizontally and vertically (within roughly a tenth of the frame either way), and the
  box spans 60–70% of the frame height (of the width for a wide product). Reject a frame
  where the product sits low, high or to one side, or is clearly smaller than that.
- **Backdrop:** one flat color.

If either identity or framing fails, re-run stage 1 once with the same prompt; if it
fails again, stop and tell the user the photo could not be prepared (suggest a clearer,
front-facing photo). Never send a failed or still-running start frame into stage 2.

## Loose pieces (lid, cap)

If the photo shows a separate piece lying beside the product — a jar's lid, a bottle's
cap — ask once whether to show the product closed. If yes, add one sentence to the end
of the stage-1 prompt: "Show the [lid/cap] fitted closed on the product." Otherwise keep
the prompt as is; the `product-spin` and `half-turn` motion prompts already hold
separate pieces resting in place as one rigid set (in a live spin test a lid lying beside a candle jar
stood up and floated mid-turn without that clause).
