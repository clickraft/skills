# Storyboard board — raw, cleanup, inspection

The board is one wide image: a single row of equal 9:16 panels ("slots") that maps the
beats of ONE clip, left to right. The video engine reads it as a narrative map, not as
frames to copy. Slot count comes from the format profile (8 for review and try-on, 4
for product, unboxing and tutorial). For a review or try-on clip under 8 s, use 4 slots
— eight cuts in a few seconds read as flicker.

The `website` format has no board. The one-take clip variant uses the opening-frame
variant at the end of this file instead of a strip.

## Calls

```bash
# raw board
clickraft generate create --json --no-wait --model-slug gpt-image-2.5-sunburst \
  --quality high --aspect-ratio 21:9 \
  --reference-image <product> --reference-image <creator> [--reference-image <prev cleaned board>] \
  --prompt "<board prompt>"
# cleanup edit of that board
clickraft generate create --json --no-wait --model-slug gpt-image-2.5-sunburst \
  --quality high --aspect-ratio 21:9 --reference-image <raw board resultUrl> \
  --prompt "<cleanup prompt>"
```

Wait for each with `generate wait <jobId> --json --timeout 100 --output ./clickraft-output/`.
Keep the raw and the cleaned `data.resultUrl` as separate ledger entries; never label
the raw board as cleaned.

## Reference order

Declare references at the top of the prompt in the exact order of the flags:

| Present | @Image1 | @Image2 | @Image3 |
|---|---|---|---|
| product + creator (+ previous part's board) | product | creator | previous cleaned board |
| creator only (+ previous) | creator | previous cleaned board | — |
| product only (product format, + previous) | product | previous cleaned board | — |
| unboxing with a real package photo | product | creator | package |

Drop what is absent and renumber.

## What every board prompt must say

**Geometry.** Exactly the format's number of equal 9:16 vertical panels in ONE
horizontal row, thin white gutters, white background, overall 21:9. No second row, no
grid, no extra panels, no empty placeholder panels.

**No text.** No headings, numbers, captions, badges, watermarks or any lettering on the
sheet — except the product's own real label, a garment's large fictional print, and in
`tutorial` only the one `Step N — Heading` caption per panel.

**Creator.** "@ImageN is the creator: the same person in every panel, same face, hair,
body, skin tone and outfit." Never re-describe their age, ethnicity or features. Same
outfit throughout unless the story changes place.

**Setting and light.** Inherit the room and light direction from the creator image (or
the previous board). Cool neutral daylight from one window; no golden hour, no studio
light. Phone-photo look: deep focus, slight wide-lens edges (never fisheye), faint
shadow noise, real pores, no bokeh, no beauty filter, no cinematic grade. No mirrors or
reflections — they spawn extra limbs.

**Product.** "@ImageN is the product: show only its visible front as in @ImageN, the
same angle in every panel — never rotated to an unseen side." Realistic size against
the hand, in centimetres from the product description; if the label is small, the
camera moves closer instead of enlarging the product. Exactly one unit in any panel
where it appears, and no look-alike objects nearby. It is either held cleanly, fully
hidden in a closed bag or box, or absent — never half out of a bag, balanced, wedged or
floating. One state per panel (cap on or off, never both); a state change is the action
of a panel. Missing features stay missing (no cord on a cordless product).

**Panels must differ.** Each adjacent pair changes camera position, distance and action,
or the video engine morphs them together instead of cutting:

- alternate selfie (one arm holds the phone, out of frame) and static camera (phone on a
  surface, both hands free) where the action allows;
- rotate the distance band — tight/macro, medium, wide — never the same band twice in a
  row, each band used at least once (twice with 8 slots);
- a different physical action every panel; shift angle or micro-location when the
  story allows;
- write the distance in every panel: TIGHT CLOSE-UP, MACRO, MEDIUM CLOSE-UP, MEDIUM,
  WAIST-UP, THREE-QUARTER, FULL-BODY WIDE.

**Two hands.** Name each hand's job in every panel. Selfie = one hand busy with the
phone, so the other holds at most one object. Any two-handed action (open, twist,
apply while holding) is a static-camera panel. Never more than two hand roles at once —
rest the product on a surface rather than invent a third hand; split multi-step actions
across panels.

**Safe handling.** Rigid bottles and devices are held, cradled, tapped, presented — never
squeezed or bent. Soft tubes may be gently squeezed. Garments are worn, smoothed,
adjusted. Food is bitten, poured, scooped. When unsure, hold and present.

**Performance.** Under the natural register, frame one is already mid-moment; each
panel gets a different small live reaction (a quick grin, a surprised blink, a lean
toward the lens); one human-scale peak on the reveal or result panel paired with one
body movement (lean back, hand to cheek); a warm, settled last panel. Hyped and calm
registers only on their signals (see the monologue reference).

Close the prompt with a short rules line restating: panel count and row, 21:9, no text,
same person, two hands, product scale and single unit, no mirrors, no extra brands.

## Cleanup pass (mandatory)

Cleanup is a second edit of the finished raw board — inspection alone is not cleanup.
Pass the raw board's `data.resultUrl` as the only reference and this instruction, in
substance:

> Keep this storyboard exactly as it is — the same panel layout and count, framing,
> camera distances, poses, people, faces and face proportions, bodies, outfits, product
> shape and its real label. Change only surface realism: true skin and material texture,
> soft natural daylight, faint phone-sensor noise, the look of an unedited phone photo,
> deep focus. Remove any waxy skin, filter smoothing, oversaturation, glow, halos or
> over-sharpening, and any shallow-focus blur. Add no text or watermark.

In `tutorial` add: keep each `Step N — Heading` caption exactly as written, same font
and position. Never erase real product branding.

## Inspection (before anything uses the cleaned board)

Open the cleaned board with Read and check:

- the right number of panels, in one row, nothing blank;
- the same creator in every panel (face, hair, outfit), no extra people;
- the product matches the reference — shape, colour, label — at a believable size,
  one unit, correct state order (sealed box before reveal; cap off only after it is
  removed);
- adjacent panels clearly differ in distance and action;
- no stray text (tutorial: each caption present, spelled right, same style);
- hands: no third hand, no fused fingers.

If a check fails, redo that stage once (a raw-board defect → new raw board, then a new
cleanup; a cleanup-only defect → new cleanup). If it still fails, or cleanup is
refused, stop and tell the user. Never send a raw board to the video stage.

## Opening-frame variant (one-take clips)

For a single uninterrupted shot on `seedance-2.5-i2v`, make one 9:16 opening still
instead of a strip: same calls with `--aspect-ratio 9:16`, the same reference order, and
a prompt for one frame — the first moment of the take, mid-action, the product (if any)
already in a natural position. Run the same cleanup and inspection. The cleaned frame
becomes `--start-frame`.
