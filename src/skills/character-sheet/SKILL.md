---
version: 0.8.0
name: character-sheet
surfaces: [cli, mcp]
description: |
  Build a consistent character sheet (model sheet, turnaround, expression sheet,
  split-screen sheet) from a brief. Fills a fixed slot-based prompt with an
  unretouched-realism layer, in one of five styles (photoreal-unretouched, editorial,
  anime/2D, 3D-stylized, game-concept), and on request renders it with <cli>`clickraft</cli><mcp>`generate_create`,</mcp>
  <cli>generate create`, </cli>optionally locked to a trained identity or a photo.

  Use when: "character sheet", "char sheet", "model sheet", "reference sheet",
  "turnaround", "expression sheet", "character reference", "consistent character",
  "same character in every view", "front, side and back of my character", or any ask to
  describe one character across several views or poses.

  NOT for: a single one-off picture with no multi-view layout (use `generate-image`),
  video, or a repeatable catalog shoot for many products (use <cli>`production-recipe`</cli><mcp>the recipe_* tools</mcp>).

  Chain with: `generate-image` and the video skills — the finished sheet's result URL
  becomes <cli>`--reference-image`</cli><mcp>a `referenceImages` entry</mcp> so later images and clips keep the same character.
<cli>
argument-hint: "[character brief] [--style <preset>] [--layout <split-screen|turnaround|expression|wardrobe|triple>] [--brand-model <uuid>[:pose]] [--reference-image <url|path>] [generate]"
allowed-tools: Bash(clickraft:*), Read
</cli>
---

# Character sheets with <cli>the Clickraft CLI</cli><mcp>Clickraft</mcp>

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

<cli>
```bash
clickraft generate create --json --no-wait --model-slug nano-banana-2 --resolution 2K \
  --aspect-ratio 16:9 --prompt "<assembled sheet prompt>"
clickraft generate wait <data.jobId> --json --output ./clickraft-output/
```

Open `data.savedPath` (Read) and check the sheet before replying: one character only,
same face and outfit in every panel, correct layout, no stray text.
</cli>
<mcp>
```
generate_create({ modelSlug: "nano-banana-2", resolution: "2K", aspectRatio: "16:9",
  prompt: "<assembled sheet prompt>", requestId: "<unique id>" })
```

If it comes back still `queued` or `processing`, call
`generate_wait({ jobId, timeoutSeconds: 60 })`, and again until it finishes.

Look at the result's small preview and check the sheet before replying: one character
only, same face and outfit in every panel, correct layout, no stray text. The preview is
small, so never claim fine facial detail is verified from it.
</mcp>

## Ground rules

These override the brief unless the user explicitly asks otherwise.

1. **Realistic means unretouched.** For photoreal styles, "real" is never "flawless".
   Pores, small asymmetries, matte skin, makeup (if the character wears any) slightly
   uneven, no glare, no smoothing. The realism module in `references/style-presets.md` is mandatory for the
   photoreal preset.
2. **Original characters, or identities the user owns.** Never reproduce a celebrity or
   a copyrighted character. A named star or franchise is at most a loose mood — build a
   distinct face. Identity locking (<cli>`--brand-model`</cli><mcp>`brandModels`</mcp>, or a photo via <cli>`--reference-image`</cli><mcp>`referenceImages`</mcp>)
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
   In Mode B, <cli>show the saved path, the image URL and</cli><mcp>the generation widget shows the image; add</mcp> a one-line read of the result.
2. Reply in the user's language. The prompt sent to <cli>`--prompt`</cli><mcp>`generate_create`</mcp> is always English —
   translate the brief. <cli>CLI flags</cli><mcp>Field values such as slugs and ratios</mcp> stay English.
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
  <cli>`clickraft brand-model list --json`, read `data[].id` and `data[].name` (`data` is the</cli><mcp>call `brand_model_list()`, read `brandModels[].id` and `brandModels[].name`.</mcp>
  <cli>list). </cli>One match → use it. Several → ask which one.

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

**When identity comes from a <cli>flag</cli><mcp>reference</mcp>** (<cli>`--brand-model`</cli><mcp>`brandModels`</mcp> or a person photo), shrink slots 3–6
to "the person from the reference, keeping their exact face, skin tone and hair" plus any
styling change the user asked for. Re-describing the face in words fights the reference
and causes drift. Wardrobe, body pose, style and layout slots stay fully written.

## Model selection

Check the live catalog when a choice depends on constraints:
<cli>
`clickraft models list --category image --json` → `data.models[]`
(`constraints.capabilities`: allowed `aspectRatio` and `resolution` values).
</cli>
<mcp>
`models_list({ slug })` returns that model's constraints (allowed aspect ratios and
resolutions).
</mcp>

- **`nano-banana-2`** — default for every style. <cli>`--resolution 2K`</cli><mcp>`resolution: "2K"`</mcp> (sheets have many small
  faces; 1K loses them). Accepts reference images and brand models.
- **`nano-banana-pro`** — escalation: the user asks for best/highest quality, wants 4K,
  or a `nano-banana-2` sheet drifted (faces differ between panels). <cli>`--resolution 2K`</cli><mcp>`resolution` `2K`</mcp> or
  `4K`.
- **`gpt-image-2.5-sunburst`** — alternative when a supplied photo must be followed very
  closely (strong subject preservation, up to 8 refs). <cli>`--quality high`</cli><mcp>`quality: "high"`</mcp>; no
  <cli>`--resolution`</cli><mcp>`resolution`</mcp> (size follows the ratio).

A user-named slug always wins; the <cli>CLI</cli><mcp>server</mcp> validates it. Neither default model takes a
separate negative-prompt field, so the exclusion tail stays inline in the prompt.

## Identity input

| Source | <cli>Flag</cli><mcp>Field</mcp> | Notes |
|---|---|---|
| Trained brand model | <cli>`--brand-model <uuid>` (default) or `<uuid>:<pose>`</cli><mcp>`brandModels: [{ id }]` (default) or `[{ id, imageType: "<pose>" }]`</mcp> | Pose names: `front`, `3/4-right`, `right`, `left`, `3/4-left`, `back`, `face-closeup`, `hands`, `approved`. One <cli>flag</cli><mcp>entry</mcp> per identity; up to 3 **different** brand models per call. |
| A photo | <cli>`--reference-image <url\|path>`</cli><mcp>`referenceImages: [url]`</mcp> | <cli>Repeatable, up</cli><mcp>Up</mcp> to 8. <cli>Local paths auto-upload.</cli><mcp>URLs only: the user's own files go through `upload_widget` first (see below).</mcp> |
| A previous sheet | <cli>`--reference-image <resultUrl>`</cli><mcp>`referenceImages: [<resultUrl>]`</mcp> | For revisions: keeps the character, change one thing. |
| Text only | none | Original character built entirely from the slots. |

<mcp>
For a photo the user attached or has on their device, call
`upload_widget({ accept: "image", maxFiles, label })` as the only tool in that turn, then
wait for the user's next message, which lists the uploaded URLs. If you already hold the
image bytes, `upload({ contentBase64, filename })` returns a URL instead. Never ask the
user for base64.

</mcp>
Brand-model rules<cli> (checked against CLI 0.21.0)</cli>:

- **One <cli>flag</cli><mcp>entry</mcp> per identity.** Repeating the same uuid with different poses is rejected
  (`Duplicate brand model ID`). The views of a turnaround come from the layout clause,
  not from extra <cli>flags</cli><mcp>entries</mcp> — pass the identity once.
- **Default to <cli>the bare uuid</cli><mcp>only the `id`</mcp>** for every layout — the server then uses the model's
  primary image. A pose works only if that specific model has an image of that angle
  stored, and there is no way to list them; many user-trained models have none, not even
  `front`. Models with `source: "system"` (the shared catalog, from <cli>`brand-model list`</cli><mcp>`brand_model_list`</mcp>
  <cli>`data[].source`</cli><mcp>`brandModels[].source`</mcp>) reject every pose.
- **A pose only on request.** When the user asks for a specific angle, check it first
  with the free <cli>`clickraft generate estimate --json` using the same flags</cli><mcp>`generate_estimate` using the same fields</mcp>. If that
  returns <cli>`E_BRAND_MODEL_POSE_NOT_FOUND`</cli><mcp>`BRAND_MODEL_POSE_NOT_FOUND`</mcp>, drop the pose and use <cli>the bare uuid</cli><mcp>only the `id`</mcp>.

Garment or accessory from the catalog: add <cli>`--product <uuid>`</cli><mcp>`products: [{ id }]` (find it with `product_list({ search })`)</mcp> and name it in the
wardrobe slot ("wearing the referenced jacket").

## Invocation

<cli>
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
</cli>
<mcp>
Mode B, one sheet (`brandModels` and `referenceImages` only when the identity comes from
them):

```
generate_create({ modelSlug: "nano-banana-2", resolution: "2K", aspectRatio: "16:9",
  brandModels: [{ id: "<brand model id>" }],
  referenceImages: ["<photo URL>"],
  prompt: "<assembled sheet prompt>", requestId: "<unique id>" })
```

It holds about 25 seconds, then returns the job. If it is still `queued` or `processing`,
call `generate_wait({ jobId, timeoutSeconds: 60 })`; when that time runs out it returns
the job still running, which is not an error. Jobs can sit `queued` for several minutes
and an account's jobs may run one after another, so several such waits in a row are
normal — wait again on the same `jobId`, never submit again.

Give each intended sheet its own `requestId`. If a call fails in transport, retry with
the SAME `requestId`: the server returns the original job instead of charging again.
</mcp>

Aspect ratio comes from the layout (`references/layouts.md`): multi-panel sheets 16:9
(3:2 also fine), a single portrait 2:3 or 3:4.

<cli>
Several sheets at once (e.g. three outfits as separate sheets): there is no batch
command. Submit each with its own `generate create --json --no-wait …`, keep a list of
sheet → `data.jobId`, then `clickraft generate wait <jobId> --json --output
./clickraft-output/` per job. If a wait times out, wait again on the same jobId — never
resubmit.

Result: `data.resultUrl` (signed, stable), `data.savedPath` (local file).
</cli>
<mcp>
Several sheets at once (e.g. three outfits as separate sheets): submit them together with
`generate_batch({ requests: [ …2–8 request objects… ], requestId })`. It returns at once
with `jobs[]` (`index`, `jobId`, `status`); an item with `jobId: null` failed to submit.
The sheets share one widget. To check them, call
`generate_wait_batch({ jobIds, timeoutSeconds: 60 })` until `allTerminal` is true —
never resubmit a job that is still running.

Result: the sheet renders in the generation widget, with a small preview for you. Its
`resultUrl` is signed and stable: use it for revisions and chaining, and don't paste it
unless the user asks. After revisions, call `generate_show({ jobIds: [final ids] })`
once to present the final set without the superseded attempts.
</mcp>

## Revisions

Use the previous sheet's <cli>`data.resultUrl` as `--reference-image`</cli><mcp>`resultUrl` in `referenceImages`</mcp>, restate the full
prompt with only the requested change, and keep the same model, layout and aspect ratio.
Typical fixes:

- Plastic skin → strengthen the realism module, add imperfection anchors.
- Faces differ between panels → repeat "the exact same face in every panel", move the
  consistency anchor earlier, or escalate to `nano-banana-pro`.
- Seated, cropped or extra figures in split-screen → re-check the framing rules and the
  split-screen exclusions in `references/layouts.md`.
- Looks too young → add the mature-structure wording and the adult exclusions.

## Chaining into other Clickraft skills

A finished sheet is a consistency asset. Its <cli>`data.resultUrl`</cli><mcp>`resultUrl`</mcp> is a valid
<cli>`--reference-image`</cli><mcp>`referenceImages` entry</mcp> (images) or <cli>`--start-frame`</cli><mcp>`startFrame`</mcp> (image-to-video) for later calls:

- **`generate-image`** — scenes, ads or social posts with the same character: pass the
  sheet URL as <cli>`--reference-image`</cli><mcp>a `referenceImages` entry</mcp> and write "the character from the reference sheet"
  instead of re-describing them. Add <cli>`--product`</cli><mcp>`products`</mcp> to put them in the user's product.
- **Video skills** — use the sheet as a reference for reference-to-video models, or
  render a single-pose still from it first and use that as <cli>`--start-frame`</cli><mcp>`startFrame`</mcp>.
- **<cli>`production-recipe`</cli><mcp>Production Recipes (the recipe_* tools)</mcp>** — a sheet built on a brand model is a good visual check of the
  identity before it is used as the model slot of a catalog Recipe.

Tell the user they can keep the sheet link to reuse the character later.

## Cost handling

- One 2K sheet: submit without estimating.
- **4K, or more than 3 sheets in one go:** <cli>run `clickraft generate estimate --json` with</cli><mcp>call `generate_estimate` (once per sheet) with</mcp>
  the same <cli>flags</cli><mcp>fields</mcp> first and say "this will use N credits" (<cli>`data.creditCost`</cli><mcp>`creditCost`</mcp>) — inform,
  don't ask.
- User asks about cost: same estimate, quote <cli>`data.creditCost`; `data.affordable` /</cli><mcp>`creditCost`; `affordable` /</mcp>
  <cli>`data.blockedReason`</cli><mcp>`blockedReason`</mcp> say whether it can run now.
- Never pre-check balance on every call, and never downgrade the model silently.

## Error handling

<cli>
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
</cli>
<mcp>
A failed call returns its error text as `Error [CODE] (HTTP n)`.

| Code | What to do |
|---|---|
| `AUTH_TOKEN_MISSING` / `AUTH_TOKEN_EXPIRED` | Tell the user to reconnect the Clickraft connector. Do not retry. |
| `INSUFFICIENT_CREDITS` | Stop. Say the account is short on credits and give the pricing link from the error. Do not retry. |
| `RATE_LIMITED` | Wait a moment and retry once with the same `requestId`. |
| `MODEL_NOT_FOUND` | Call `models_list({ category: "image" })` and pick another slug. |
| `GEN_CONTENT_REFUSAL` | The model refused. Check for a real-person or franchise likeness, or revealing wardrobe; rephrase and ask the user before resubmitting. |
| `BRAND_MODEL_POSE_NOT_FOUND` | That model has no image of that angle (system models take no pose at all). Drop `imageType` and use only the `id`. |
| `BRAND_MODEL_DUPLICATE_ID` | The same brand model is listed twice. Keep one entry per identity. |
| `REFERENCE_LIMIT_EXCEEDED` | Brand models, reference images and products together exceed the model's cap. Drop references. |

A rejected field combination (too many brand models, unsupported aspect ratio or
resolution) comes back as `INPUT_INVALID_FORMAT`: re-read the model's constraints with
`models_list({ slug })` and adjust.

A job still `queued` or `processing` when a wait ends is not an error: call
`generate_wait` again with the same `jobId`; never re-create it.
</mcp>
