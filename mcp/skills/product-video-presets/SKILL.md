---
version: 0.8.1
name: product-video-presets
description: |
  One-shot product videos from a single product photo with Clickraft. 18 named
  motion presets (spin, push-in, crane reveal, light sweep, liquid wrap, whip pan...).
  Each preset first prepares a clean start frame (product on a backdrop in its own brand
  color), then animates it into a 6-second silent clip that keeps the product, logo and
  label exactly as they are.

  Use when: "make a product video", "animate my product", "spin my product", "360 of
  this bottle", "push in on the product", "product reveal video", "light sweep over the
  packaging", "liquid splash video of my product", "whip pan to the product", "a short
  product clip for Reels/TikTok", or any preset name (/product-spin, /crane-reveal,
  /macro-glide, /paint-wave...).

  NOT for: still product photos (use `generate-image`), multi-scene ads, talking or
  presenter videos, editing an existing video, or videos with music or voice-over.

  Chain with: `generate-image` when the user has no product photo yet (make one, then
  run a preset on its result).
argument-hint: "[preset id] [product photo or product name] [aspect ratio W:H]"
---

# Product video presets with Clickraft

Each preset turns **one product photo** into **one short product video**. It runs in two
stages: a hidden start-frame still, then the video animated from that still.

## Quick start

```text
// Stage 1: start frame (internal, never delivered)
generate_create({ modelSlug: "nano-banana-pro", referenceImages: ["<photo URL>"],
  resolution: "2K", aspectRatio: "3:4",
  prompt: "<start-frame prompt from the preset file>",
  requestId: "<new id>", timeoutSeconds: 60 })
generate_wait({ jobId, timeoutSeconds: 60 })   // only if it came back still running; repeat

// Stage 2: quote the cost, wait for the user's go, then submit
generate_estimate({ modelSlug: "seedance-2-standard-i2v",
  startFrame: "<stage-1 resultUrl>", durationSeconds: 6, aspectRatio: "3:4",
  resolution: "720p", prompt: "<motion prompt from the preset file>" })
generate_create({ <same fields as the estimate>, requestId: "<new id>", wait: false })
generate_wait({ jobId, timeoutSeconds: 60 })   // repeat on the same jobId until done
```

Both prompts for every preset are in its file under `references/` (catalog below). Send
them unchanged.

## Preset catalog

All 18 presets share the same pipeline and defaults. Only the motion differs.

| Preset | What the viewer sees | File |
|---|---|---|
| `crane-reveal` | The camera rises vertically to uncover the product | [references/crane-reveal.md](references/crane-reveal.md) |
| `detail-scan` | Real product details revealed one after another | [references/detail-scan.md](references/detail-scan.md) |
| `floating-roll` | Slow weightless roll in zero gravity | [references/floating-roll.md](references/floating-roll.md) |
| `half-turn` | Smooth 180-degree product turn | [references/half-turn.md](references/half-turn.md) |
| `impact` | A burst of particles frozen around the product | [references/impact.md](references/impact.md) |
| `label-trace` | Close camera move along the logo and label | [references/label-trace.md](references/label-trace.md) |
| `light-sweep` | One band of light sweeping across the product | [references/light-sweep.md](references/light-sweep.md) |
| `liquid-wrap` | Liquid ribbons flowing around the product | [references/liquid-wrap.md](references/liquid-wrap.md) |
| `macro-glide` | Macro glide over the product surface | [references/macro-glide.md](references/macro-glide.md) |
| `paint-wave` | A wave of colored paint rolling past | [references/paint-wave.md](references/paint-wave.md) |
| `product-spin` | Clean 360-degree turntable spin | [references/product-spin.md](references/product-spin.md) |
| `pull-back` | Camera pulls back to reveal the scene | [references/pull-back.md](references/pull-back.md) |
| `push-in` | Slow, steady push toward the product | [references/push-in.md](references/push-in.md) |
| `shadow-motion` | Graphic shadows drifting across the product | [references/shadow-motion.md](references/shadow-motion.md) |
| `sunrise-pass` | Darkness turning into warm sunrise light | [references/sunrise-pass.md](references/sunrise-pass.md) |
| `texture-track` | Close tracking move along a material texture | [references/texture-track.md](references/texture-track.md) |
| `topdown-dive` | Overhead view diving into a close angle | [references/topdown-dive.md](references/topdown-dive.md) |
| `whip-pan` | Fast whip pan that lands on the product | [references/whip-pan.md](references/whip-pan.md) |

The shared start-frame step (what it does, its prompt, how to check it) is in
[references/start-frame.md](references/start-frame.md).

Picking a preset from loose wording: "360"/"turntable" → `product-spin`; "turn"/"show the
back" → `half-turn`; "zoom in" → `push-in`; "zoom out"/"reveal" → `pull-back`; "close-up of
the material" → `macro-glide` or `texture-track`; "show the logo/label" → `label-trace`;
"shine"/"reflection" → `light-sweep`; "splash"/"liquid" → `liquid-wrap`; "floating" →
`floating-roll`. No clear match → `push-in` (the safest for any label).

## UX rules

1. Be concise. No raw IDs, no JSON, no model names, no pipeline talk in chat. Say what
   the video shows; the clip plays in the generation widget, so do not paste its URL.
2. Detect the user's language and reply in it. The prompts sent to Clickraft stay English.
3. Do not offer prompt choices or a plan: the preset is the plan. Run it.
4. The start frame is an internal dependency. Never present it as a deliverable.
   The widget shows it as it renders; that is expected, but do not describe it or call it
   a result. The stage-2 widget is the deliverable; do not re-display it unless asked.
5. Polling is silent. No status narration while waiting.
6. If asked how a preset works, describe only the visible effect, not the prompts.
7. One video per request unless the user asks for more.

## When to ask

Default: act. Ask ONE question only when:

- There is no product image at all (no URL, upload or catalog product). Ask for a photo
  or a product name. An image pasted into the chat has no URL: open `upload_widget` so
  the user can add the file (see "Inputs").
- The product is named but `product_list({ search: "<name>" })` returns
  several matches: ask which one. The search often returns two products with the same
  title, so titles alone cannot disambiguate — pick the one whose image matches what the
  user showed, or show each candidate's primary image (or its image count and id
  suffix) and ask.
- The photo shows a loose lid or cap lying beside the product: ask once whether to show
  it closed (see [references/start-frame.md](references/start-frame.md)).
- The request fits no preset and is not a product clip (route to another skill instead).

The video cost confirmation (see "Cost handling") is always required.

Never ask about duration, resolution or audio.

## Inputs

| User gives | Stage 1 field |
|---|---|
| A file attached in the chat or on their device | `upload_widget({ accept: 'image', maxFiles: 1, label: 'Product photo' })` as the only tool in that turn; wait for the user's next message with the uploaded URL, then `referenceImages: ["<url>"]` |
| Image URL | `referenceImages: ["<url>"]` |
| Catalog product name | `product_list({ search: "<name>" })` → `products: [{ id }]` |
| Catalog product id | `products: [{ id, imageId? }]` |

Tools take URLs only. If no upload widget appears, ask for a public image URL. Use
`upload({ contentBase64, filename })` only when you already hold the file's bytes; never
ask the user for base64.

Upload each source once. If several videos come from the same photo, reuse the URL.

## Aspect ratio

Default `3:4`. User wording overrides it: square → `1:1`; full-screen Reel, Story or
TikTok → `9:16`; landscape, YouTube or website → `16:9`. The video model accepts `21:9`,
`16:9`, `4:3`, `1:1`, `3:4`, `9:16`. For `4:5` or `2:3` use `3:4` and say so in one line.
**Stage 1 and stage 2 must use the same ratio.** A new ratio needs a new start frame.

## Model selection

Fixed per stage. Do not run model discovery for a preset.

- **Stage 1:** `nano-banana-pro`, `resolution: "2K"`.
- **Stage 2:** `seedance-2-standard-i2v`, `durationSeconds: 6`, `resolution: "720p"`.
  - The preset spec is 1080p. Our maximum is **720p**. Tell the user once: "Rendered in
    720p (the highest available)."
  - **Audio:** the request has no audio-off switch, but the motion prompt's no-sound wording
    works: a live `product-spin` test came out silent (about −91 dB). No audio caveat is
    needed.
  - **Confirmed live** (staging, `product-spin`): `durationSeconds: 6` is accepted by
    `seedance-2-standard-i2v` even though its `constraints.modes` lists only 5 and 10,
    and a stage-1 `resultUrl` works directly as `startFrame`.
- Use `seedance-2.5-i2v` (higher fidelity, about 946 credits/s) only when the user asks
  for higher quality. Same fields, same prompts.

If a value may have changed, check it with `models_list({ slug: "<slug>" })`, which
returns that model's constraints (`aspectRatio`, `duration`, `resolution`).

## Invocation

### Stage 1: start frame

```text
generate_create({ modelSlug: "nano-banana-pro", resolution: "2K", aspectRatio: "<ratio>",
  referenceImages: ["<photo URL>"],
  prompt: "<Stage 1 prompt from references/<preset>.md>",
  requestId: "<new id>", timeoutSeconds: 60 })
generate_wait({ jobId, timeoutSeconds: 60 })   // only while it is still running
```

For a catalog product, use `products: [{ id }]` in place of `referenceImages`.

- If a call returns the job still `queued`, `processing` or `uploading`, it is running:
  call `generate_wait` again on the **same** jobId. Never re-create. Budget about 2
  minutes for the start frame, including queue.
- An error, or `status` failed/cancelled: stop. Do not start stage 2.
- On success, look at the result's preview image and check it (see
  [references/start-frame.md](references/start-frame.md)), including centring and size;
  a low, off-centre or small product means one stage-1 regeneration (a new `requestId`).
  Keep its `resultUrl`.

### Stage 2: video

1. Run `generate_estimate` with the exact stage-2 fields (see the next
   section) and quote the price. Wait for the user's go.
2. Submit and wait:

```text
generate_create({ modelSlug: "seedance-2-standard-i2v",
  startFrame: "<stage-1 resultUrl>",
  durationSeconds: 6, aspectRatio: "<ratio>", resolution: "720p",
  prompt: "<Stage 2 prompt from references/<preset>.md>",
  requestId: "<new id>", wait: false })
generate_wait({ jobId, timeoutSeconds: 60 })   // repeat on the same jobId until done
```

If a call fails in transport, retry it with the same `requestId`: that returns the
original job instead of charging again.

- Video takes minutes: about 3–5 minutes of rendering once it starts, and a job can sit
  in `queued` (`startedAt` null) for several minutes first, behind the organisation's
  other jobs (they may run one after another, not in parallel). Several waits in a row
  that return it still running are normal. Call `generate_wait` on the same jobId until
  it is done. **Never** re-submit a running job; that charges again.
- Keep the backdrop color from stage 1. Only `light-sweep`, `shadow-motion` and
  `sunrise-pass` change the light for a moment, by design.
- The clip plays in the generation widget; you get only its poster frame. Reply with one
  line on what the clip shows, plus the 720p note the first time. Do not paste the URL.

### More than one video

After the quote is approved, submit the videos together with one
`generate_batch({ requests: [...], requestId })` (2 to 8 requests; they share one
widget), then `generate_wait_batch({ jobIds, timeoutSeconds: 60 })` until `allTerminal`.
An item with `jobId: null` failed to submit: report it in one line. Same preset and same
ratio: reuse one start frame. Different ratio: make a new
start frame for that ratio. Quote the total for all videos before you submit any.

## Cost handling

- **Stage 1** (~400 credits at 2K): submit without asking.
- **Stage 2** (6s at 720p ≈ 3630 credits on `seedance-2-standard-i2v`): always run
  `generate_estimate` with the same fields first. Quote `creditCost`
  and wait for a clear yes. If `affordable` is false, report `blockedReason`
  and stop.
- For several videos, add the estimates up and quote one total.
- Never switch to a cheaper model or a shorter duration without the user's consent.

## Error handling

Errors arrive in the tool's error text as `Error [CODE] (HTTP n)`.

| Code | What to do |
|---|---|
| `AUTH_TOKEN_MISSING` / `AUTH_TOKEN_EXPIRED` | Tell the user to reconnect the Clickraft connector. Do not retry. |
| `INSUFFICIENT_CREDITS` | Say how many credits are missing and give the pricing link from the error. Do not retry. |
| A wait returns the job still running | Not an error — the job keeps running. Call `generate_wait` on the same jobId again; never re-create the job. |
| `RATE_LIMITED` | Wait a moment and retry once with the same `requestId`. |
| `MODEL_NOT_FOUND` | Call `models_list({ category: "video" })` and pick the closest `*-i2v` slug. Tell the user. |
| `GEN_CONTENT_REFUSAL` | The model refused. With stage 1, ask for a different photo. With stage 2, say the preset could not run on this product. |

A failure in either stage: report it in one line. Do not swap in a different preset.
