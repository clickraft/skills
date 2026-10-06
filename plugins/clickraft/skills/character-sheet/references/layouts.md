# Layouts (views, poses, expressions) and the exclusion tail

The layout decides the opening clause (slot 1), the aspect ratio, and extra exclusions.
Default: `split-screen`.

| Layout | Aspect ratio | Brand-model pose (user-trained models only) |
|---|---|---|
| `split-screen` (default) | 16:9 (or 3:2) | `front` |
| `turnaround` | 16:9 | `front` (the side and back views come from the clause) |
| `expression` | 16:9 | `front` |
| `wardrobe` | 16:9 (21:9 on `nano-banana-pro` for 4+ outfits) | `front` |
| `triple` | 16:9 (or 3:2) | `front` |
| single portrait (one view only) | 2:3 or 3:4 | `front` or `3/4-right` |

System brand models (`source: "system"`) take no pose — pass the bare uuid.

Check the chosen model's allowed ratios with `clickraft models list --category image
--json` before using anything outside 16:9 / 3:2 / 2:3 / 3:4.

---

## `split-screen` (default)

> Two-panel character sheet: on the left, the character shown full length, standing
> straight in a relaxed neutral pose facing the camera, both feet flat on the floor,
> arms loose at the sides, framed from the top of the head to below the feet with the
> whole body visible; on the right, a tight chest-up portrait of the same character,

Right-panel variants: face-only close-up, chest-up portrait, beauty close-up.

**Framing rules — the part that breaks most often. Repeat them every time:**

- **Left panel always stands.** Never sitting, crouching, leaning or cropped. Include
  "standing, full length, head to feet, both feet in frame, not cropped, not seated".
- **Right panel is always a close crop** (face or chest-up), never a second full body.
- **Only the character.** Always add the split-screen exclusions below.

## `turnaround`

> Character turnaround sheet: four matching full-length views side by side and evenly
> spaced — front, three-quarter, side profile and back,

Best with `game-concept` or `3d-stylized`; works for photoreal too.

## `expression`

> Character expression sheet: one full-length reference view on the left, and on the
> right a grid of head-and-shoulders portraits of the same character showing different
> expressions — neutral, smiling, serious, surprised,

Swap the expression list for the user's own (e.g. angry, laughing, sad, thinking).
Keep it to 4–6 so faces stay large enough to read.

## `wardrobe`

> Character outfit sheet: the same character shown full length [N] times side by side,
> each in a different outfit,

Then describe each outfit in order, head to toe ("first outfit: …; second outfit: …").
The face/hair/body slots are written once and shared. Above 4 outfits, prefer separate
sheets (one `generate create` each) over one crowded image.

## `triple`

> Three-panel character sheet: a full-length view, a chest-up portrait, and a detail
> close-up of the face and accessories,

---

## Exclusion tail

Always end the prompt with the **base** items, then add whatever applies.

**Base (always):** no text, no watermark, no logos, no frame borders.

**Split-screen (always for that layout):** one subject only, exactly one person, only
the character in frame, nobody else, no duplicated figures, no mannequin, no
reflections, no props, no furniture, no background objects, an empty seamless studio,
left panel standing full length head to feet not cropped not seated, right panel a close
crop not a full body.

**Other layouts:** no extra characters, no background props.

**Adult characters:** no babyface, no childlike rounded proportions.

**Photoreal presets:** the extras listed under the preset in `style-presets.md`.

**Situational:** no bag, no branding, no harsh shadows, no distorted anatomy, no extra
fingers.

**Originality (always, unless identity is locked to the user's own brand model or
photo):** an original character that does not resemble any real celebrity or existing
copyrighted character.
