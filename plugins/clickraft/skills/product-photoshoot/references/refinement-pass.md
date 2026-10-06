# Refinement pass

A refinement fixes ONE thing on one index: a defect you saw in the image, or a specific
correction the user asked for. It is not a re-roll and not a new idea.

## When to run

- You opened the result (Read on `data.savedPath`) and it fails a quality gate of the
  mode — run one.
- The user named a concrete change ("the label is blurry", "warmer light", "move the
  bottle left") — run one, even if you could not view the image.
- You could not view the image and the user named nothing — do not run one. Deliver and
  say it was not visually checked.
- The user says only "make it better" — ask one question about what to change.

## Step 1 — audit

Check only what the pixels show, against the mode's quality gates. A status, a URL or
the prompt is not evidence. Do not claim fine print is verified from a reduced view.

## Step 2 — choose the single biggest issue

| Issue | What it looks like |
|---|---|
| Flat light | No clear direction, mushy shadows, no separation |
| Plastic surface | Material looks rendered, not photographed |
| Warped text | Label letters bent, merged or invented |
| Anatomy | Fingers, eyes, ears, hairline wrong |
| Weak composition | Subject drifting, no clear focal point |
| Palette drift | Colors stray from the product or brand |
| Stock feel | Generic, over-staged |
| Artificial sheen | That too-smooth rendered glow |
| Half restyle | Original look still showing through (restyle) |
| Flat band | Empty solid strip or dead gradient, usually from an overlay request |
| Stray object | Studio gear (softbox, stand, reflector) or an unasked prop in frame |

Pick one. If two are equal, pick the one the user would notice first.

## Step 3 — write the fix prompt

```
Refine the reference image. Keep the subject, product, composition, framing and scene
exactly as they are. Change only this: {{one precise photographic instruction}}.
{{Mode-specific preservation line, e.g. "The product label, shape and color stay
identical."}}
Render at 2K resolution.
```

Fix language, in your own words per case:

- **Flat light** — set a key 45° from camera-left at about 4500K, add a stronger rim on
  the far side, deepen the contact shadow, widen the gap between highlight and shadow.
- **Plastic surface** — bring back real micro-texture: weave, grain, pores or brushed
  lines as the material demands; remove the rendered sheen.
- **Warped text** — make the label lettering crisp and fully legible, print-quality,
  each character intact and unmerged.
- **Anatomy** — correct the {{fingers / hand / eyes / ear}} to natural human
  proportions; keep the same person and pose.
- **Weak composition** — move the product to the {{left / right}} third and strengthen
  the focal hierarchy; nothing else moves.
- **Palette drift** — pull the palette back toward {{the product's colors / stated brand
  colors}}, reduce {{the drifting color}}, bring {{the accent}} forward.
- **Stock feel** — add one specific lived-in detail ({{name it}}) and natural
  asymmetry; less staged, more photographed.
- **Artificial sheen** — remove the smooth rendered glow, add fine film grain and real
  skin or material texture.
- **Half restyle** — keep the subject, push the new look harder: {{palette, surface,
  light}} fully committed, no trace of the old styling.
- **Flat band** — replace the empty {{top / bottom / side}} strip by continuing the real
  environment — sky, defocused room, surface — so the frame reads as one scene.
- **Stray object** — remove the {{softbox / light stand / prop}} and continue the
  surrounding backdrop and surface seamlessly where it stood; keep the light on the
  product as it is.

## Step 4 — submit

```bash
clickraft generate create --json --no-wait \
  --model-slug nano-banana-pro --resolution 2K --aspect-ratio <same ratio as the index> \
  --reference-image <latest completed data.resultUrl of THIS index> \
  --prompt "<fix prompt>"
clickraft generate wait <jobId> --json --timeout 90 --output ./clickraft-output/
```

- The single reference is the latest completed result of the same index — never another
  variant, never an older attempt that a later one replaced.
- Same ratio, same 2K, one image.
- Update the ledger: this jobId becomes the index's current result once it completes.

## Step 5 — re-audit

Open the new file. Major issue still there → one more refinement (two at most). All
gates pass → deliver. The fix actually needs a different mode or a new composition →
that is a new generation; explain and ask first.

## Budget

Three submissions per index: the first pass plus up to two refinements. Failed
submissions and retries count. A rewritten prompt does not reset the count. When the
budget is spent, deliver the best completed version and name what is still off.

## Don't refine when

- nothing was seen and nothing was asked;
- every inspected gate passes;
- the complaint is taste rather than a gate failure — deliver and ask;
- the change would replace the subject or composition — that is a new generation.

## Sets (carousel, ad pack)

Check the set first: same palette, same light direction, same surface across indexes.
If one index breaks it, refine only that index, quoting the locked visual system as its
preservation line. Never regenerate the whole set to fix one slide.

## Reporting

In the delivery line, name the defect and the fix briefly — "the first pass had flat
light on the left; refined with a stronger rim." Say "fixed" only if you looked at the
refined image; otherwise say the correction was applied but not visually checked.
