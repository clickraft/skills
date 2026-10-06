---
version: 0.8.0
name: production-recipe
description: |
  Build a production Recipe with the Clickraft CLI: a reusable catalog-shoot style
  (product and model slots, the photos to take, styling, scene) that Clickraft applies to
  many products. Reads the schema and the catalog, writes the Recipe as JSON, creates a
  draft, has Clickraft plan the photos, makes the sample images on the user's word, and
  hands the user the link where they approve the images and save it.

  Use when: "build me a Recipe", "create a Recipe in this style", "a shoot style for my
  catalog", "product-page photos for every product", "front, back and detail shots",
  "PDP style", "make a Recipe like my summer one", "change my Recipe draft", "plan the
  photos", "make the sample images". Use it whenever the user wants one repeatable look
  for many products, even if they never say "Recipe".

  NOT for: a single one-off image (use `generate-image`), a workflow graph (use
  `clickraft-workflow-authoring`), or running a production with a saved Recipe — that
  happens in Clickraft after the hand-over.
argument-hint: "[style brief] [--draft <uuid>]"
allowed-tools: Bash(clickraft:*), Write, Read
---

# Build a production Recipe with the Clickraft CLI

A **Recipe** is a reusable shoot style: which product and model **slots** a look has, the
**photos** to take (front, back, detail…), the styling, the scene and the aspect ratio.
Once saved in Clickraft, it is applied to many products in a production.

The division of work is fixed:

- **You** write the Recipe as JSON, create a **draft**, have Clickraft plan its photos,
  and, when the user agrees to the price, have Clickraft make its sample images.
- **The user** opens the draft's link in Clickraft, approves the sample images, saves the
  Recipe, and continues to Products there. No command approves images, saves a Recipe or
  runs a production. Do not promise any of that from the CLI.

So every run of this skill ends with the draft's `webUrl` in your reply.

## The method

1. **Read the contract**: `clickraft recipe schema --json`. Everything you need is in
   `data`: `schemas.recipe` (JSON Schema), `rules` (what the schema cannot express),
   `vocabulary` (views, aspect ratios, this organization's `facets`, `products` and
   `models` with their ids) and `example` (a valid recipe). Never hardcode ids or facet
   values; take them from here.
2. **Look at what exists** when the user refers to it ("like my summer Recipe"):
   `clickraft recipe list --json`, then `clickraft recipe get <id> --json` and start from
   its `data.recipe`.
3. **Write the request file** (Write tool): `{ "recipe": {...}, "bindings": {...} }`.
   Start from `data.example.recipe` or the Recipe you read, and change it to the brief.
   Field guide and worked examples: [references/recipe-format.md](references/recipe-format.md).
4. **Create the draft**: `clickraft recipe draft create --file recipe.json --idempotency-key <key> --json`.
   Creating calls no model and charges nothing. Keep `data.id` and `data.webUrl`. Every
   write returns the draft's new `data.revision`, and a plan counts as a write: always
   pass the latest revision to the next command.
5. **Fix any refusal and create again**. A refused create stores nothing (see "Errors").
6. **Plan the photos** when the hero product and the model are bound:
   `clickraft recipe draft plan <id> --revision <n> --idempotency-key <key> --json`.
   This uses the organization's **Utility Units** (its AI allowance), not credits. Do not
   ask first; say it in the reply that reports the plan. It usually takes seconds and can
   take a few minutes.
   Give the command a long timeout (up to 5 minutes) or run it in the background; do not
   let a short tool timeout kill it.
7. **Offer the sample images** (credits; see "Sample images"). Make them only if the user
   agrees to the price; otherwise hand over, and they are made in Clickraft.
8. **Report and hand over**: a short summary of the Recipe (photos, styling, scene), each
   planned photo's framing from `data.plan.shots[]`, the example product and model you
   bound, the images if you made them, then the link, in the user's language: "Open it in
   Clickraft to approve the images and save the Recipe: `<webUrl>`".

## Bindings: the example the images are made with

`bindings` maps every slot key to an id, or `null`. They are only the example used for
the Recipe's sample images: the user can change them in Clickraft, and picks the real
products later, in the production.

- **Take ids only from `vocabulary.products` and `vocabulary.models`.** That is exactly
  what the server accepts. Do not bind an id found with `product list`: it also returns
  products the Recipe catalog leaves out (such as `sourceType: "system"` copies), and the
  server refuses those.
- **Products: decide, do not ask.** Match the brief against `vocabulary.products[].title`
  and bind the best fit. When several fit equally ("my linen shirts"), pick one: any of
  them is a valid example. Say which one you picked.
- **The model: ask unless you know.** `vocabulary.models[]` has only a `name` and an
  `imageUrl`, so you cannot see who fits the brief, and a name says nothing reliable about
  a person. Bind the model the user named, or the one in `exampleBindings` of a Recipe
  they pointed you to. Otherwise ask one question before creating: 3–4 names, plus
  "choose in Clickraft" (which leaves `model` as `null`).
- If you send `bindings`, include every slot key. Omit `bindings` and every slot starts
  `null`. One product cannot fill two slots.
- Planning needs the hero **and** the model bound. If either is `null`, skip step 6 and
  hand over the link: the user binds them in Clickraft, and planning starts there.

Leave every slot's `constraint` as `null` unless the user asks to limit a slot to a kind
of product **and** some `vocabulary.products[].facetValues` carry that value. Many
catalogs are untagged (`facetValues: {}`), and a constrained slot then accepts no product
at all.

## Changing an existing draft

1. `clickraft recipe draft get <id> --json` for the current `data.revision`. Never reuse
   a revision from earlier in the conversation; the user may have edited the draft in the
   browser since.
2. Write a file with only what changes: any of `recipe`, `bindings`, `runChoices`. The
   revision goes on the command line, never in the file:
   `clickraft recipe draft update <id> --revision <n> --file change.json --idempotency-key <key> --json`.
3. On `E_RECIPE_DRAFT_CONFLICT` (exit 7), read the draft again and re-apply your change
   to the new version. The person's edits win; never overwrite them blindly.

A change to what a photo shows (a binding, the scene, a photo's description) makes the
plan `stale`. Re-plan before handing over. A rename keeps the plan `current`.

To redo one photo's plan from the user's feedback:
`clickraft recipe draft plan <id> --revision <n> --shot <key> --feedback "<what to change>" --json`.
Re-plan only when the user asks for a change. Do not re-plan in a loop to polish.

## Sample images: credits, only on the user's word

The images cost **credits**. Every start carries the price the user agreed to, so ask
first, every time. Photo 1 comes first because every other photo copies its look.

1. **Price photo 1**: `clickraft recipe draft images estimate <id> --json`. Tell the user
   `data.credits` (photo 1) and `data.rest.credits` (the other photos, an estimate quoted
   exactly once photo 1 is accepted). If `data.ready` is false, `data.error` says why.
   If `data.affordable` is false, say why (`data.blockedReason`) and stop.
2. **On the user's word**, start it with exactly what the estimate returned:
   `clickraft recipe draft images start <id> --fingerprint <data.fingerprint> --max-credits <data.credits> --idempotency-key <key> --json`.
   Never raise `--max-credits` above the estimate.
3. **Wait and look**: `clickraft recipe draft images wait <id> --output ./recipe-images --json`.
   It waits up to 10 minutes by default: give the command a long timeout or run it in the
   background. Open the saved files (`data.saved[].path`) with Read and look at photo 1.
4. **Ask the user to accept photo 1**, describing it in a line or two. If they want it
   changed, photo 1 is redone in Clickraft (give the link); the CLI cannot redo photo 1,
   because every other photo would be made again.
5. **The rest**: estimate again (now the exact price of the other photos), tell the user,
   and on their word start with the new fingerprint. Starting the rest records that the
   user accepted photo 1. Clickraft makes them on its own, without a browser tab: `wait`
   again with `--output` and look at them.
6. **Redo one photo** (not photo 1) only when the user asks:
   `clickraft recipe draft images estimate <id> --redo <key> --json`, tell them the price
   (credits, plus Utility Units to rewrite its plan), then on their word
   `clickraft recipe draft images redo <id> --shot <key> --feedback "<their words>" --fingerprint <fp> --max-credits <n> --idempotency-key <key> --json`.
   Do not redo to polish on your own.

Good to know:

- A failed image is refunded. The next estimate offers it as `retry`. In the rest of the
  set, Clickraft retries a failed photo once by itself, then pauses with a reason
  (`data.set.reason`).
- `clickraft recipe draft images pause <id>` stops a running set; queued photos finish.
- A back, detail or three-quarter photo needs a verified photo of that side of the hero
  product. If the estimate says one is missing, tell the user: they add and scan it in
  Clickraft, or keep only front photos.

## Idempotency keys: retry without doing it twice

Pass `--idempotency-key` on create, update, plan, `images start` and `images redo`,
with one fresh value per intended
change (for example `recipe-<slug>-create-1`). If the command fails without an answer
(timeout, network error, or a message saying the request may still have completed),
**re-run it with the same key**: you get the original result instead of a second draft or
a second plan, or a second charge. Use a new key only for a new, different change. The
CLI never retries a plan, a start or a redo on its own; that decision is yours.

## UX rules

1. Be concise. No JSON dumps or raw ids beyond the draft link. Summarize the Recipe in a
   few lines.
2. Reply in the user's language. Write every recipe field in English except `name`,
   because Clickraft's photo director reads them. The `name` may follow the user's
   language.
3. Describe looks in visible terms: light, background, pose, framing, crop. Do not name
   brands the user does not sell.
4. Default to acting. A draft is free: create it, show it, adjust it. Ask only for a
   genuinely missing choice (see "Bindings"). Images are not free: never start or redo
   one without the user agreeing to its price.

## Response envelope

Draft commands (`create`, `get`, `update`, `plan`) return the draft in `data`:

| Field | Meaning |
| --- | --- |
| `id`, `revision` | The draft and the revision every change must name |
| `recipe`, `bindings`, `runChoices` | What the draft holds now |
| `plan.status` | `none`, `current` or `stale` |
| `plan.shots[]` | `key`, `view`, `summary`, `framing` per planned photo; `summary` and `framing` may be `null`. The prompts stay on the server. |
| `images.status`, `images.frames[]` | Sample images' progress (`images wait` gives the detail) |
| `openQuestions[]` | Questions from a draft started in the browser |
| `webUrl` | The link the user opens to approve and save |

`images estimate` returns `data.stage`, `ready`, `error`, `credits`, `fingerprint`,
`frames[]` (`shotKey`, `action`: `make`/`retry`/`keep`/`redo`, `credits`), `rest`,
`balance`, `affordable`, `blockedReason`. `images start`, `wait`, `redo` and `pause`
return the images: `data.stage` (`unplanned`, `anchor`, `anchor-running`, `set`,
`set-running`, `complete`), `shots[]` (`key`, `status`, `approved`, `imageUrl`,
`error`), `set` (`status`, `reason`) and `webUrl`; `wait --output` adds `saved[]`.

`recipe list` returns `data.items[]` (`id`, `name`, `version`, `shots[]`).
`recipe get` adds `recipe`, `exampleBindings`, `webUrl` (continue to Products with it)
and `editUrl` (the draft it was saved from). A draft appears in `recipe list` only after
the user saves it.

## Errors

| `error.code` | What to do |
| --- | --- |
| `E_INPUT_INVALID_FORMAT` | The file breaks the schema. `error.details.issues[]` gives `path` and `message` per field: fix those fields and create again. |
| `E_RECIPE_INVALID` | Valid JSON that does not fit this organization (unknown facet or value, a product or model not in the catalog, a slot rule, or planning without a bound hero and model). The message names the rule. Fix it from `recipe schema`. |
| `E_RECIPE_DRAFT_CONFLICT` | The draft changed since you read it. Get it again and re-apply (see above). |
| `E_IDEMPOTENCY_IN_PROGRESS` | The same request is still running (often a plan). Wait a minute, then `recipe draft get` (`plan.status` becomes `current`) or re-run with the same key. |
| `E_RECIPE_QUOTE_CHANGED` | The images or the price changed since the estimate (a photo finished, the plan changed). Nothing was charged. Estimate again, tell the user the new price, and start only on their word. |
| `E_INSUFFICIENT_CREDITS` | Not enough credits (`error.details.required`, `available`). Tell the user. Do not retry. |
| `E_PLAN_FEATURE_LOCKED` | The account's subscription lacks API access, or its Utility-Unit allowance for planning is used up. Tell the user. Do not retry. |
| `E_AUTH_TOKEN_SCOPE_INSUFFICIENT` | The token lacks a scope the message names (`recipes:*`, or `generations:write` for images). Tell the user to run `clickraft login --force-reauth`. |
| `E_NOT_FOUND` "Recipes are not enabled on this deployment yet" | The feature is off on this server. Tell the user and stop. |
| `E_NOT_FOUND` otherwise | Wrong id. Drafts and Recipes are visible only to the user who created them. |
| `E_RATE_LIMITED` | Wait `error.retry_after_ms` and retry once with the same key. |

Exit codes: 0 success, 1 server or runtime, 2 your input, 3 not logged in, 4 permission or subscription, 5 rate limit, 6 network, 7 conflict.

## Compatibility

Needs a `@clickraft/cli` release that ships the `recipe` commands (after 0.17.0). Check
with `clickraft recipe --help`. If the CLI answers `Unknown command`, tell the user to
update it (`npm install -g @clickraft/cli@latest`), then `clickraft login --force-reauth`
so the token carries the `recipes:read` and `recipes:write` scopes.

The sample images need `@clickraft/cli` 0.19.0 or later: check with
`clickraft recipe draft images --help`. On an older CLI, skip step 7 and hand over; the
user makes the images in Clickraft.
