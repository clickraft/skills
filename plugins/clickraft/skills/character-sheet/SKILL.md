---
version: 0.8.1
name: character-sheet
description: |
  Build a consistent character sheet (model sheet, turnaround, expression sheet,
  split-screen sheet) from a brief. Fills a fixed slot-based prompt with an
  unretouched-realism layer, in one of five styles (photoreal-unretouched, editorial,
  anime/2D, 3D-stylized, game-concept), and on request renders it with `clickraft
  generate create`, optionally locked to a trained identity or a photo.

  Use when: "character sheet", "char sheet", "model sheet", "reference sheet",
  "turnaround", "expression sheet", "character reference", "consistent character",
  "same character in every view", "front, side and back of my character", or any ask to
  describe one character across several views or poses.

  NOT for: a single one-off picture with no multi-view layout (use `generate-image`),
  video, or a repeatable catalog shoot for many products (use `production-recipe`).

  Chain with: `generate-image` and the video skills — the finished sheet's result URL
  becomes `--reference-image` so later images and clips keep the same character.
argument-hint: "[character brief] [--style <preset>] [--layout <split-screen|turnaround|expression|wardrobe|triple>] [--brand-model <uuid>[:pose]] [--reference-image <url|path>] [generate]"
allowed-tools: Bash(clickraft:*), Read
---

# Character sheets with the Clickraft CLI

A character sheet shows **one** character, unchanged, across several views on a clean
studio backdrop. The value of this skill is the fixed slot order below plus a realism
layer that removes the airbrushed, plastic look image models drift toward. Never write a
sheet prompt freehand — fill the slots in order.

Two modes:

- **Mode A — Prompt (default).** Return one finished, copy-paste-ready English prompt.
- **Mode B — Generate.** Only when the user explicitly says generate / make it / run it /
  render it (any language). Build the prompt exactly as in Mode A, then render it
  (see "Invocation").

## Quick start

```bash
clickraft generate create --json --no-wait --model-slug nano-banana-2 --resolution 2K \
  --aspect-ratio 16:9 --prompt "<assembled sheet prompt>"
clickraft generate wait <data.jobId> --json --output ./clickraft-output/
```

Open `data.savedPath` (Read) and check the sheet before replying: one character only,
same face and outfit in every panel, correct layout, no stray text.

## Ground rules

These override the brief unless the user explicitly asks otherwise.

1. **Realistic means unretouched.** For photoreal styles, "real" is never "flawless".
   Pores, small asymmetries, matte skin, makeup (if the character wears any) slightly
   uneven, no glare, no smoothing. The realism module in `references/style-presets.md` is mandatory for the
   photoreal preset.
2. **Original characters, or identities the user owns.** Never reproduce a celebrity or
   a copyrighted character. A named star or franchise is at most a loose mood — build a
   distinct face. Identity locking (`--brand-model`, or a photo via `--reference-image`)
   is only for the user's own trained brand model or a person the user has the right to
   depict; for anything else, use the photo as style/mood only and say so.
3. **Adults look adult.** For adult characters, ask for grown-up bone structure: a
   defined jaw and cheekbones, longer face proportions, no soft round babyface. Models
   drift young; bias the wording mature.
4. **Nothing drifts between rounds.** When revising an existing character, restate every
   established detail (face, hair, body, outfit, accessories, jewelry) and change only
   what the user asked for.

## UX rules

1. Be concise. No raw IDs, no JSON, no model names or pipeline mechanics in chat. In
   Mode A, show the prompt in one code block and one line on the chosen style + layout.
   In Mode B, show the saved path, the image URL and a one-line read of the result.
2. Reply in the user's language. The prompt sent to `--prompt` is always English —
   translate the brief. CLI flags stay English.
3. Polling is silent. No status narration while a job runs.
4. After a Mode B result, offer **one** round of targeted fixes in a single line (for
   example "more skin texture", "tighten the outfit", "right panel as a face close-up").

## When to ask

Default: act. Ask at most two short questions, and only if they block assembly:

- **Style** — only when the brief gives no hint (no "anime", "3D", "photo", "concept
  art", no reference). Offer `[photoreal / anime / 3D / game concept]`; otherwise default
  to `photoreal-unretouched`.
- **Prompt or render** — only when it is unclear whether they want the image. Default is
  Mode A.
- **Which identity** — the user says "my model" / "my face" / names a brand model:
  `clickraft brand-model list --json`, read `data[].id` and `data[].name` (`data` is the
  list). One match → use it. Several → ask which one.

Never ask about aspect ratio or resolution; the layout decides them. If the user pasted
an existing character description, keep every physical detail as written.

## Workflow

1. **Read the brief.** Pull out identity, wardrobe, style, and whether a photo or brand
   model supplies the face. If revising, carry every prior detail forward (rule 4).
   A brand mention ("for my coffee brand") means brand colours and wardrobe cues in the
   wardrobe slot; logos and wordmarks stay out of the sheet and are added later
   (`references/layouts.md` § Exclusion tail).
2. **Pick a style preset** → realism/render, lighting and quality-tail modules.
   See `references/style-presets.md`.
3. **Pick a layout** → opening clause, aspect ratio, layout-specific exclusions.
   Default `split-screen`. See `references/layouts.md`.
4. **Fill the slots in order** (below). Every detail concrete — fabric, cut, color,
   finish. "Nice top" or "pretty face" is never acceptable.
5. **Append the exclusion tail** (`references/layouts.md` § Exclusion tail).
6. **Output** one paragraph. In Mode B, render it.

A fill-in template and a worked example are in `references/prompt-skeleton.md`.

## Slot architecture

Image models weight early words more: layout and identity first, quality last. One
paragraph, comma-separated, in this order:

| # | Slot | What goes in it |
|---|---|---|
| 1 | Layout clause | From the chosen layout, verbatim from `references/layouts.md` |
| 2 | Consistency anchor | "the same original [subject] in every panel", seamless white studio backdrop, clean character-sheet presentation |
| 3 | Identity | Age band, skin tone, heritage if relevant — respectful and specific |
| 4 | Face | Shape, jaw, cheekbones, nose, lips with finish; mature structure for adults |
| 5 | Eyes | Shape, tilt, color — plus the low-glare clause for realistic styles |
| 6 | Brows and hair | Brows; hair color + undertone + length + style + **finish** + parting; hair accessory |
| 7 | Realism / render module | From the style preset |
| 8 | Body | Build and proportions |
| 9 | Wardrobe, head to toe | Top → layers → bottoms → belt → shoes → jewelry → bag (write "no bag" if none) |
| 10 | Lighting module | From the style preset |
| 11 | Quality tail | From the style preset |
| 12 | Exclusion tail | Base + layout + style + adult + originality items |

The physical description is written **once**; the consistency anchor makes it apply to
every panel. Hair finish and specific fabrics are what sell realism — never skip them.

**When identity comes from a flag** (`--brand-model` or a person photo), shrink slots 3–6
to "the person from the reference, keeping their exact face, skin tone and hair" plus any
styling change the user asked for. Re-describing the face in words fights the reference
and causes drift. Wardrobe, body pose, style and layout slots stay fully written.

## Model selection

Check the live catalog when a choice depends on constraints:
`clickraft models list --category image --json` → `data.models[]`
(`constraints.capabilities`: allowed `aspectRatio` and `resolution` values).

- **`nano-banana-2`** — default for every style. `--resolution 2K` (sheets have many small
  faces; 1K loses them). Accepts reference images and brand models.
- **`nano-banana-pro`** — escalation: the user asks for best/highest quality, wants 4K,
  or a `nano-banana-2` sheet drifted (faces differ between panels). `--resolution 2K` or
  `4K`.
- **`gpt-image-2.5-sunburst`** — alternative when a supplied photo must be followed very
  closely (strong subject preservation, up to 8 refs). `--quality high`; no
  `--resolution` (size follows the ratio).

A user-named slug always wins; the CLI validates it. Neither default model takes a
separate negative-prompt field, so the exclusion tail stays inline in the prompt.

## Identity input

| Source | Flag | Notes |
|---|---|---|
| Trained brand model | `--brand-model <uuid>` (default) or `<uuid>:<pose>` | Pose names: `front`, `3/4-right`, `right`, `left`, `3/4-left`, `back`, `face-closeup`, `hands`, `approved`. One flag per identity; up to 3 **different** brand models per call. |
| A photo | `--reference-image <url\|path>` | Repeatable, up to 8. Local paths auto-upload. |
| A previous sheet | `--reference-image <resultUrl>` | For revisions: keeps the character, change one thing. |
| Text only | none | Original character built entirely from the slots. |

Brand-model rules (checked against CLI 0.21.0):

- **One flag per identity.** Repeating the same uuid with different poses is rejected
  (`Duplicate brand model ID`). The views of a turnaround come from the layout clause,
  not from extra flags — pass the identity once.
- **Default to the bare uuid** for every layout — the server then uses the model's
  primary image. A pose works only if that specific model has an image of that angle
  stored, and there is no way to list them; many user-trained models have none, not even
  `front`. Models with `source: "system"` (the shared catalog, from `brand-model list`
  `data[].source`) reject every pose.
- **A pose only on request.** When the user asks for a specific angle, check it first
  with the free `clickraft generate estimate --json` using the same flags. If that
  returns `E_BRAND_MODEL_POSE_NOT_FOUND`, drop the pose and use the bare uuid.

Garment or accessory from the catalog: add `--product <uuid>` and name it in the
wardrobe slot ("wearing the referenced jacket").

## Invocation

Mode B, one sheet — submit with `--no-wait`, then wait on the job (a blocking create can
outlive the agent shell and orphan the job):

```bash
clickraft generate create --json --no-wait \
  --model-slug nano-banana-2 --resolution 2K --aspect-ratio 16:9 \
  [--brand-model <uuid>] [--reference-image <url|path>] \
  --prompt "<assembled sheet prompt>"
clickraft generate wait <data.jobId> --json --output ./clickraft-output/
```

Run the wait as its own command, not after `&&`: a timed-out wait exits non-zero. Budget
about 2 minutes per sheet. Jobs can sit `queued` for several minutes and an account's
jobs may run one after another, so several timed-out waits in a row are normal — wait
again on the same jobId.

Aspect ratio comes from the layout (`references/layouts.md`): multi-panel sheets 16:9
(3:2 also fine), a single portrait 2:3 or 3:4.

Several sheets at once (e.g. three outfits as separate sheets): there is no batch
command. Submit each with its own `generate create --json --no-wait …`, keep a list of
sheet → `data.jobId`, then `clickraft generate wait <jobId> --json --output
./clickraft-output/` per job. If a wait times out, wait again on the same jobId — never
resubmit.

Result: `data.resultUrl` (signed, stable), `data.savedPath` (local file).

## Revisions

Use the previous sheet's `data.resultUrl` as `--reference-image`, restate the full
prompt with only the requested change, and keep the same model, layout and aspect ratio.
Typical fixes:

- Plastic skin → strengthen the realism module, add imperfection anchors.
- Faces differ between panels → repeat "the exact same face in every panel", move the
  consistency anchor earlier, or escalate to `nano-banana-pro`.
- Seated, cropped or extra figures in split-screen → re-check the framing rules and the
  split-screen exclusions in `references/layouts.md`.
- Looks too young → add the mature-structure wording and the adult exclusions.

## Chaining into other Clickraft skills

A finished sheet is a consistency asset. Its `data.resultUrl` is a valid
`--reference-image` (images) or `--start-frame` (image-to-video) for later calls:

- **`generate-image`** — scenes, ads or social posts with the same character: pass the
  sheet URL as `--reference-image` and write "the character from the reference sheet"
  instead of re-describing them. Add `--product` to put them in the user's product.
- **Video skills** — use the sheet as a reference for reference-to-video models, or
  render a single-pose still from it first and use that as `--start-frame`.
- **`production-recipe`** — a sheet built on a brand model is a good visual check of the
  identity before it is used as the model slot of a catalog Recipe.

Tell the user they can keep the sheet link to reuse the character later.

## Cost handling

- One 2K sheet: submit without estimating.
- **4K, or more than 3 sheets in one go:** run `clickraft generate estimate --json` with
  the same flags first and say "this will use N credits" (`data.creditCost`) — inform,
  don't ask.
- User asks about cost: same estimate, quote `data.creditCost`; `data.affordable` /
  `data.blockedReason` say whether it can run now.
- Never pre-check balance on every call, and never downgrade the model silently.

## Error handling

| `error.code` | What to do |
|---|---|
| `E_AUTH_TOKEN_MISSING` / `E_AUTH_TOKEN_EXPIRED` | Tell the user to run `clickraft login`. Do not retry. |
| `E_INSUFFICIENT_CREDITS` | Say the account is short on credits and point to billing. Do not retry. |
| `E_RATE_LIMITED` | Wait `error.retry_after_ms` (default 1000) and retry once. |
| `E_MODEL_NOT_FOUND` | Re-list with `clickraft models list --category image --json` and pick another slug. |
| `E_GEN_CONTENT_REFUSAL` | The model refused. Check for a real-person or franchise likeness, or revealing wardrobe; rephrase and ask the user before resubmitting. |
| `E_BRAND_MODEL_POSE_NOT_FOUND` | That model has no image of that angle (system models take no pose at all). Drop the `:pose` suffix and use the bare uuid. |
| `E_TIMEOUT` (exit 6) | Not a failure — the job keeps running. Run `generate wait <same jobId>` again; never re-create the job. |

A rejected flag combination (duplicate or too many brand models, unsupported aspect
ratio or resolution) comes back as `E_INPUT_INVALID_FORMAT`: re-read the model's
constraints and adjust.

## Compatibility

Requires `@clickraft/cli` `>= 0.21.0` (`--output`, `generate estimate`, brand-model
pose suffixes).

Shell note: when you do pass a pose in zsh, write `"${UUID}:front"`, not `$UUID:front` — zsh reads `:f…` after a
bare variable as a modifier and mangles the uuid.
