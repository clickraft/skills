# Prompt skeleton and worked examples

## Fill-in template (photoreal, split-screen)

Replace each `[SLOT]`; keep everything else. Send as one line.

```
Two-panel character sheet: on the left, the character shown full length, standing
straight in a relaxed neutral pose facing the camera, both feet flat on the floor, arms
loose at the sides, framed from the top of the head to below the feet with the whole
body visible; on the right, a tight chest-up portrait of the same character, the same
original [SUBJECT] in both panels, one subject only, seamless white studio backdrop,
clean character-sheet presentation, [AGE BAND] with [SKIN TONE], [FACE SHAPE] with
[JAW] and [CHEEKBONES], [NOSE], [LIPS + finish], [EYE shape/color] with soft small
catchlights and no glare, [BROWS], [HAIR color/undertone/length/style/finish/parting],
true-to-life skin with fine pores, faint lines and small natural asymmetries, everyday
makeup blended slightly unevenly instead of a flawless base, [FLUSH / imperfection
anchor], a soft natural sheen only, no retouching, no smoothing, no beauty filter, no
airbrushed finish, no shine spots on the skin, matte-to-natural complexion, [BUILD] with
natural proportions, wearing [TOP], [LAYER], [BOTTOMS], [BELT], [SHOES], [JEWELRY],
[BAG or "no bag"], soft diffused studio light with no harsh reflections, anatomically
natural, premium commercial photography left unretouched, cinematic realism, 4K detail,
crisp focus on skin texture, one subject only, exactly one person, nobody else, no
duplicated figures, no mannequin, no reflections, no props, no furniture, an empty
seamless studio, left panel standing full length head to feet not cropped not seated,
right panel a close crop not a full body, no babyface, no plastic or glossy skin, an
original character that does not resemble any real celebrity, no text, no watermark,
no logos, no frame borders
```

## Worked example — text-only original character

Brief: "a woman in her thirties, Mediterranean, linen summer look, realistic."

Style `photoreal-unretouched`, layout `split-screen`, `nano-banana-2`, 2K, 16:9.

Slot fills:

- Identity: woman in her early thirties, warm olive skin
- Face: long oval face, defined angular jaw, high cheekbones, straight nose with a
  slight bump, medium-full lips in a muted terracotta tint with a satin finish, mature
  adult bone structure
- Eyes: almond-shaped, slightly downturned hazel eyes (+ low-glare clause)
- Brows / hair: full natural brows; dark chestnut hair with warm undertones, shoulder
  length, loose air-dried waves with a soft matte finish, middle parting
- Imperfection anchor: a few faint freckles across the nose
- Body: slim build, natural proportions
- Wardrobe: off-white relaxed linen shirt with rolled sleeves, sand-colored high-waisted
  linen trousers with pleats, thin tan leather belt, flat tan leather sandals, small gold
  hoop earrings, a thin gold chain, no bag

## Worked example — brand model, turnaround

Brief: "turnaround of my model in the black tracksuit, game concept style."

Style `game-concept`, layout `turnaround`. Slots 3–6 shrink to the reference wording:

```
Character turnaround sheet: four matching full-length views side by side and evenly
spaced — front, three-quarter, side profile and back, the same person from the
reference in every view, keeping their exact face, skin tone and hairstyle, seamless
white studio backdrop, clean character-sheet presentation, painterly game concept art,
semi-realistic rendering, orthographic model-sheet views, a strong readable silhouette,
materials clearly distinguished through surface detail, athletic build, wearing a black
zip-up track jacket with two white side stripes, matching black track pants with
elastic cuffs, white low-top sneakers, a thin silver chain, no bag, neutral even
concept-art lighting, professional character concept art, sharp, 4K, no extra
characters, no background props, no distorted anatomy, no text, no watermark, no logos,
no frame borders
```

```bash
clickraft generate create --json --model-slug nano-banana-2 --resolution 2K \
  --aspect-ratio 16:9 \
  --brand-model "${UUID}:front" \
  --prompt "<prompt above>" --output ./clickraft-output/
```

Pass the identity once — the CLI rejects the same uuid twice, so the four views come
from the layout clause. Drop `:front` for a system brand model.

## Revision example

User: "same character, swap the shirt for a navy knit polo."

Pass the previous sheet's `data.resultUrl` as `--reference-image`, resend the full
prompt with only the top changed ("a navy fine-knit short-sleeve polo with a three-button
placket"), same model, layout and ratio. Every other slot stays word for word.
