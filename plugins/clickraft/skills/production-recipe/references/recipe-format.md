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
| `variationPolicy` | `close`, `subtle` (default) or `creative`: how far looks may differ. |

Leave out the recipe's `direction` and `outfitStructures`, and each photo's `direction`
and `evidence`. They belong to Recipes built from references in Clickraft.

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
- `purpose`: why the photo exists, one line. `description`: the photo in visible terms
  (framing, pose, light), up to 1500 chars.
- `referenceId` and `referenceImageIndex`: always `null` from the CLI.
- Photo 1 anchors the rest: later on-model photos follow it unless `"followsAnchor": false`.

### Variation options

A photo may offer up to 2 options with up to 3 choices each, picked per production:

```json
"variationOptions": [
  { "key": "hands", "label": "Hands", "defaultChoice": "pockets", "allowAuto": true,
    "choices": [
      { "key": "pockets", "label": "In pockets", "instruction": "Both hands in the trouser pockets" },
      { "key": "relaxed", "label": "Relaxed", "instruction": "Arms loose at the sides" } ] } ]
```

`runChoices` pre-selects them for the sample images:
`{ "front": { "hands": "relaxed" } }`. Skip both unless the user asks for options.

## Example 1: product-page shots on one model

Front, back and a fabric macro. The shirt changes per product, the rest of the outfit is
described in `styling`, and one model is used for the whole production.

```json
{
  "recipe": {
    "name": "Linen studio PDP",
    "intent": "Product-page photographs on one model, consistent across the catalog",
    "styling": "The selected shirt worn simply, untucked, with plain light-grey trousers; no jewelry or props",
    "scene": "Seamless warm-white studio backdrop, soft directional key light from the left",
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
    "shotDirections": [
      { "key": "front", "view": "front", "presentation": "on-model",
        "purpose": "Show the full silhouette and fit",
        "description": "Full-length, model facing the camera, relaxed natural stance, arms loose, garment construction readable",
        "referenceId": null, "referenceImageIndex": null },
      { "key": "back", "view": "back", "presentation": "on-model",
        "purpose": "Show the back of the shirt",
        "description": "Full-length from behind, same stance and light as the front photo",
        "referenceId": null, "referenceImageIndex": null },
      { "key": "detail", "view": "detail", "presentation": "product-only",
        "purpose": "Show the fabric and finish up close",
        "description": "Macro of the linen weave and a seam, soft raking light",
        "referenceId": null, "referenceImageIndex": null }
    ]
  },
  "bindings": {
    "hero": "00000000-0000-4000-8000-000000000001",
    "model": "00000000-0000-4000-8000-000000000002"
  }
}
```

## Example 2: eyewear, constrained hero, a choice of pose

The hero slot accepts only products whose `role` facet is `eyewear`. Use a constraint
like this only when `vocabulary.products` has products tagged with it. The first photo
offers a choice of expression.

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
    "variationPolicy": "close",
    "shotDirections": [
      { "key": "portrait", "view": "front", "presentation": "on-model",
        "purpose": "Show the frames face-on",
        "description": "Head-and-shoulders, model facing the camera, frames level, eyes visible through the lenses",
        "referenceId": null, "referenceImageIndex": null,
        "variationOptions": [
          { "key": "expression", "label": "Expression", "defaultChoice": "neutral", "allowAuto": true,
            "choices": [
              { "key": "neutral", "label": "Neutral", "instruction": "Calm neutral expression, mouth closed" },
              { "key": "smile", "label": "Soft smile", "instruction": "A soft closed-mouth smile" }
            ] }
        ] },
      { "key": "angle", "view": "three-quarter", "presentation": "on-model",
        "purpose": "Show the temple arms and profile",
        "description": "Head-and-shoulders, head turned three-quarters to the left, the temple arm visible",
        "referenceId": null, "referenceImageIndex": null },
      { "key": "detail", "view": "detail", "presentation": "product-only",
        "purpose": "Show the hinge and finish",
        "description": "Macro of the frames folded on the backdrop, focus on the hinge and the frame finish",
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
