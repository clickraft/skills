# Recipe format: field guide and worked examples

The authority is `clickraft recipe schema --json`: `data.schemas.recipe` is generated from
the server's own validation, and `data.rules` lists what a schema cannot express. This
page explains the fields and gives two complete request files. Every id below is a
placeholder: replace it with an id from `data.vocabulary`.

## The request file

```json
{ "recipe": { ... }, "bindings": { "hero": "<product-id>", "model": "<model-id>" } }
```

`runChoices` is optional (see "Variation options"). The file for `recipe draft update`
holds only the parts that change, and never `revision`.

## Recipe fields

| Field | What to write |
| --- | --- |
| `name` | What the user calls it. Max 120 chars. |
| `intent` | One sentence: what the photos are for. |
| `styling` | What is worn or shown, in visible terms, with no props unless the brief adds them. A top or bottom hero leaves the rest of the outfit open: describe the other garments plainly ("plain light-sand trousers, barefoot"), or give them a product slot. No brand names. |
| `scene` | Background, set and light. |
| `exclusions` | Things never to show (`"jewelry"`, `"hats"`). Up to 15, may be empty. |
| `aspectRatio` | One of `vocabulary.aspectRatios`: `2:3`, `3:4`, `1:1`, `4:5`. |
| `looksPerHero` | Looks per product, 1–5. Default to 1. |
| `slots` | 1–6 product slots and at most 1 character slot (see below). |
| `heroSlotKey` | The key of a **required** product slot. |
| `modelSlotKey` | The character slot's key, or `null` for product-only Recipes. |
| `shotDirections` | 1–12 photos (see below). |
| `variationPolicy` | `subtle` (default) or `creative` for a directed Recipe; `close` only with `direction.mode: "replay"`. |
| `direction` | The concept of the set (see "Direction"). Write it on every new Recipe. |
| `outfitStructures` | Leave out unless `vocabulary.products[].facetValues` carry the facet values that would pick a structure. |

Leave each photo's `evidence` out: it needs a reference image, which the CLI cannot attach.

### Direction

Clickraft makes every look of a production with a per-look director. In a **directed**
Recipe (the default) you write the concept and the director invents each look's pose
inside it, so a catalog grid stays consistent without every look being a copy. A Recipe
without `direction` is a legacy one that copies the pose written in its descriptions.
`data.rules` holds the full contract; in short:

- `recipe.direction`: `mode` (`directed`; `replay` only when the user asks to copy exact
  poses), `story`, `energy`, `expressions`, `gazes`, `setPieces` (studio items such as a
  cube, at most 3, never forbidden by an exclusion, and visible in `scene`) and `smiles`
  (`true` only when the user asks for smiles).
- Every on-model photo gets a `direction`: `fixed` (what keeps it the same photo in every
  look: crop, camera height, view), 1–4 pose `families` in visible terms, `vary` and
  `avoid`. A family has `key`, `label`, `direction`, `energy` (`dynamic` for movement or
  low poses, at most one per look; `still` otherwise), and optionally `requires` /
  `favours` (hero product words), `fixes` (`hands`, `gaze`) and `needsSlotKey`.
- Product-only photos get no `direction`.
- Garment words (mini, linen, pleat) appear only in a family's `requires` and `favours`,
  never in the recipe's prose: the bound products supply the garment.

### Slots

```json
{ "key": "hero", "label": "Hero product", "kind": "product", "cadence": "per_item",
  "required": true, "constraint": null }
```

- `key`: starts with a letter; letters, digits, `_`, `-`; max 64. Unique.
- `kind`: `product` or `character` (the model).
- `cadence`: `per_item` changes with every product in a production (the hero);
  `per_batch` is chosen once per production (the model, or a fixed accessory);
  `fixed` is burned in and never offered for choice.
- `constraint`: `null`, or `{ "facetKey": "<key>", "values": ["<value>", ...] }` where both
  come from `vocabulary.facets`. A closed facet allows only its listed values. A bound
  product must carry one of the values, so add a constraint only when some
  `vocabulary.products[].facetValues` carry it. In an untagged catalog
  (`facetValues: {}`) a constrained slot accepts no product.

### Photos (`shotDirections`)

```json
{ "key": "front", "view": "front", "presentation": "on-model",
  "purpose": "Show the full silhouette and fit",
  "description": "Full-length, model facing the camera, relaxed stance, arms loose",
  "referenceId": null, "referenceImageIndex": null }
```

- `view`: `front`, `back`, `detail` or `three-quarter`.
- `presentation`: `on-model` (default) or `product-only`. A product-only photo is a
  flat-lay (`front`/`back`) or a macro (`detail`), with no person and no scene. For a
  detail photo, choose `on-model` when the setting is part of the look (a beach at
  sunset), and `product-only` for a clean studio macro.
- `purpose`: why the photo exists, one line. `description`: the crop, then camera height,
  angle and lens look, up to 1500 chars. In a directed Recipe it never states a pose,
  hands, gaze or expression: the photo's `direction` covers those. Light and backdrop go
  in `scene`, once for the whole set.
- `referenceId` and `referenceImageIndex`: always `null` from the CLI.
- Photo 1 anchors the rest: later on-model photos follow it unless `"followsAnchor": false`.

### Variation options

An optional wish ("may smile on some runs") is an option on that photo, never part of its
description. A photo may offer up to 2 options with up to 3 choices each, picked per
production:

```json
"variationOptions": [
  { "key": "expression", "label": "Expression", "defaultChoice": "off", "allowAuto": true,
    "choices": [
      { "key": "neutral", "label": "Neutral", "instruction": "A neutral, relaxed expression with the mouth closed" },
      { "key": "smile", "label": "Soft smile", "instruction": "A soft, natural closed-mouth smile" } ] } ]
```

`defaultChoice` is `off` (keep the base direction), `auto` (the per-look director picks;
needs `allowAuto`) or a choice key. `runChoices` pre-selects choices for the sample images:
`{ "front": { "expression": "smile" } }`. Skip both unless the user asks for options.

## Example 1: product-page shots on one model

Front, back and a fabric macro. The shirt changes per product, the rest of the outfit is
described in `styling`, and one model is used for the whole production. The front photo
offers three pose families (one with movement, one on a studio cube the scene shows), the
back two, and the macro none.

```json
{
  "recipe": {
    "name": "Linen studio PDP",
    "intent": "Product-page photographs on one model, consistent across the catalog",
    "styling": "The selected shirt worn simply, untucked, with plain light-grey trousers; no jewelry",
    "scene": "Seamless warm-white studio backdrop and floor with a plain white studio cube to one side, soft directional key light from the left",
    "exclusions": ["jewelry", "hats"],
    "aspectRatio": "3:4",
    "looksPerHero": 1,
    "slots": [
      { "key": "hero", "label": "Shirt", "kind": "product", "cadence": "per_item",
        "required": true, "constraint": null },
      { "key": "model", "label": "Model", "kind": "character", "cadence": "per_batch",
        "required": true, "constraint": null }
    ],
    "heroSlotKey": "hero",
    "modelSlotKey": "model",
    "variationPolicy": "subtle",
    "direction": {
      "mode": "directed",
      "story": "A calm, modern product page: one model in a bright studio, relaxed and confident",
      "energy": "Mostly still and relaxed, with a gentle step on some looks",
      "expressions": ["neutral", "relaxed"],
      "gazes": ["to camera", "slightly off camera"],
      "setPieces": ["plain white studio cube"],
      "smiles": false
    },
    "shotDirections": [
      { "key": "front", "view": "front", "presentation": "on-model",
        "purpose": "Show the full silhouette and fit",
        "description": "Full-length, head to feet with footwear, even margins above the head and below the feet; eye-level camera, straight on, natural lens look without distortion",
        "referenceId": null, "referenceImageIndex": null,
        "direction": {
          "fixed": "Full-length head to feet, eye-level straight-on camera, front view",
          "families": [
            { "key": "relaxed-stand", "label": "Relaxed stand", "energy": "still",
              "direction": "Weight on one leg, shoulders loose, arms relaxed at the sides or one hand resting at the hip" },
            { "key": "easy-step", "label": "Easy step", "energy": "dynamic",
              "direction": "Mid-step toward the camera, arms swinging naturally, the shirt moving with the stride",
              "favours": ["fluid", "relaxed"] },
            { "key": "seated-cube", "label": "Seated on the cube", "energy": "still",
              "direction": "Sitting upright on the edge of the studio cube, legs angled to one side, hands resting on the knees" }
          ],
          "vary": ["pose family", "head turn", "hand placement"],
          "avoid": "Arms covering the front of the shirt"
        } },
      { "key": "back", "view": "back", "presentation": "on-model",
        "purpose": "Show the back of the shirt",
        "description": "Full-length from behind, head to feet, same camera height, distance and light as the front photo",
        "referenceId": null, "referenceImageIndex": null,
        "direction": {
          "fixed": "Full-length from behind, same camera height and distance as the front photo",
          "families": [
            { "key": "back-stand", "label": "Standing, back to camera", "energy": "still",
              "direction": "Standing square to the camera with the back fully visible, arms relaxed" },
            { "key": "over-shoulder", "label": "Look over the shoulder", "energy": "still",
              "direction": "Back to the camera, head turned over one shoulder toward the camera, shoulders level",
              "fixes": ["gaze"] }
          ],
          "vary": ["head turn", "arm position"],
          "avoid": "Turning the body so the back of the shirt is no longer square to the camera"
        } },
      { "key": "detail", "view": "detail", "presentation": "product-only",
        "purpose": "Show the fabric and finish up close",
        "description": "Macro of the weave and a seam, filling the frame; camera close and slightly angled, soft raking light",
        "referenceId": null, "referenceImageIndex": null }
    ]
  },
  "bindings": {
    "hero": "00000000-0000-4000-8000-000000000001",
    "model": "00000000-0000-4000-8000-000000000002"
  }
}
```

## Example 2: eyewear, constrained hero, an optional smile

The hero slot accepts only products whose `role` facet is `eyewear`. Use a constraint
like this only when `vocabulary.products` has products tagged with it. The portrait may
smile on some runs: that is an option, off by default, not part of its description.

```json
{
  "recipe": {
    "name": "Eyewear portraits",
    "intent": "Close portraits that show how the frames sit on a face",
    "styling": "Only the selected frames; plain crew-neck top in a neutral colour",
    "scene": "Pale grey backdrop, soft frontal light with a gentle fill, no hard reflections on the lenses",
    "exclusions": ["hats", "earrings"],
    "aspectRatio": "4:5",
    "looksPerHero": 1,
    "slots": [
      { "key": "frames", "label": "Frames", "kind": "product", "cadence": "per_item",
        "required": true, "constraint": { "facetKey": "role", "values": ["eyewear"] } },
      { "key": "model", "label": "Model", "kind": "character", "cadence": "per_batch",
        "required": true, "constraint": null }
    ],
    "heroSlotKey": "frames",
    "modelSlotKey": "model",
    "variationPolicy": "subtle",
    "direction": {
      "mode": "directed",
      "story": "Quiet, close portraits where the frames are the first thing you see",
      "energy": "Still and composed",
      "expressions": ["neutral", "calm"],
      "gazes": ["to camera", "slightly off camera"],
      "setPieces": [],
      "smiles": false
    },
    "shotDirections": [
      { "key": "portrait", "view": "front", "presentation": "on-model",
        "purpose": "Show the frames face-on",
        "description": "Head-and-shoulders, the frames at the centre of the picture; camera at eye level, straight on, a slightly long lens look",
        "referenceId": null, "referenceImageIndex": null,
        "direction": {
          "fixed": "Head-and-shoulders, eye-level straight-on camera, front view",
          "families": [
            { "key": "square-on", "label": "Square on", "energy": "still",
              "direction": "Shoulders square to the camera, chin level, eyes visible through the lenses" },
            { "key": "hand-at-temple", "label": "Hand at the temple", "energy": "still",
              "direction": "One hand lightly touching the temple arm, elbow low and out of the centre",
              "fixes": ["hands"] }
          ],
          "vary": ["pose family", "slight head tilt"],
          "avoid": "Hair, hands or glare covering the frames"
        },
        "variationOptions": [
          { "key": "expression", "label": "Expression", "defaultChoice": "off", "allowAuto": true,
            "choices": [
              { "key": "neutral", "label": "Neutral", "instruction": "Calm neutral expression, mouth closed" },
              { "key": "smile", "label": "Soft smile", "instruction": "A soft closed-mouth smile" }
            ] }
        ] },
      { "key": "angle", "view": "three-quarter", "presentation": "on-model",
        "purpose": "Show the temple arms and profile",
        "description": "Head-and-shoulders, the face turned three-quarters so one temple arm is visible; camera at eye level",
        "referenceId": null, "referenceImageIndex": null,
        "direction": {
          "fixed": "Head-and-shoulders, three-quarter view, eye-level camera",
          "families": [
            { "key": "three-quarter-still", "label": "Three-quarter, still", "energy": "still",
              "direction": "Face turned three-quarters, shoulders following the head, gaze past the camera",
              "fixes": ["gaze"] }
          ],
          "vary": ["direction of the turn"],
          "avoid": "Turning so far that the front of the frames disappears"
        } },
      { "key": "detail", "view": "detail", "presentation": "product-only",
        "purpose": "Show the hinge and finish",
        "description": "Macro of the frames folded on the backdrop, focus on the hinge and the frame finish; camera close, slightly above",
        "referenceId": null, "referenceImageIndex": null }
    ]
  },
  "bindings": {
    "frames": "00000000-0000-4000-8000-000000000003",
    "model": "00000000-0000-4000-8000-000000000002"
  },
  "runChoices": { "portrait": { "expression": "neutral" } }
}
```
