---
version: 0.8.1
name: ad-multiplier
surfaces: [cli, mcp]
description: |
  Turn one existing 4–15 second ad clip into several independently edited versions with
  <cli>the Clickraft CLI</cli><mcp>Clickraft</mcp>. Each version keeps the source's motion, framing, cuts, timing and
  aspect ratio, and changes only what the user asked: people, products, objects,
  clothing, backgrounds, attributes or one targeted piece of on-screen text, several
  edits per version if needed. Generates adult replacement people when no reference
  is supplied.

  Use when: "multiply my ad", "multiply my video", "make 5 versions of this ad",
  "same ad with different people", "swap the product in this clip", "regenerate my
  ad with these models", "version this video for each market".

  NOT for: making a new video from scratch (use `ugc-video`), trimming, stitching or
  re-cutting footage, sources longer than 15 seconds, captions or soundtrack changes,
  still images (use `generate-image`), or every combination of two asset lists.

  Chain with: `generate-image` for a one-off still. A finished `<cli>data.</cli>resultUrl` can be
  the source of a further edit.
<cli>
argument-hint: "[source video path|url] [what changes per version] [--reference-image <url|path>]..."
allowed-tools: Bash(clickraft:*), Read
</cli>
---

# Ad multiplier with <cli>the Clickraft CLI</cli><mcp>Clickraft</mcp>

One source clip in, `N` edited clips out. `N` always counts finished videos — never
people, assets or operations. One version may carry several edits at once. Every version
is its own independent edit of the same source.

<cli>
Engine: `seedance-2.5-r2v` with `--task editing`. It edits exactly ONE
`--reference-video` and keeps its motion, camera, cuts and timing; the output has the
source's length and aspect ratio. Replacement references go in as `--reference-image`
and are cited in the prompt as `@Image1`, `@Image2`… in the order passed. That holds
only while every reference is a `--reference-image`: the server always numbers
`--brand-model` images first, then `--reference-image` URLs, then `--product` images
last, whatever the flag order — so keep catalog products and brand models as
`--reference-image` URLs here. The source is always `@Video1`.
</cli>
<mcp>
Engine: `seedance-2.5-r2v` with `task: 'editing'`. It edits exactly ONE clip in
`referenceVideos` and keeps its motion, camera, cuts and timing; the output has the
source's length and aspect ratio. Replacement references go in `referenceImages` and
are cited in the prompt as `@Image1`, `@Image2`… in array order. That holds only while
every reference is in `referenceImages`: the server always numbers `brandModels` images
first, then `referenceImages` URLs, then `products` images last, whatever the field
order — so keep catalog products and brand models as `referenceImages` URLs here. The
source is always `@Video1`.
</mcp>

## Quick start

<cli>
```bash
clickraft generate estimate --json --model-slug seedance-2.5-r2v --task editing \
  --resolution 720p --reference-video ./ad.mp4 --reference-image ./model-a.png \
  --prompt "<edit prompt for version 1>"
# quote the total for all versions, wait for the user's go, then per version:
clickraft generate create --json --no-wait --model-slug seedance-2.5-r2v --task editing \
  --resolution 720p --reference-video <source> --reference-image <ref> --prompt "<prompt>"
clickraft generate wait <jobId> --json --timeout 100 --output ./clickraft-output/
```
</cli>
<mcp>
```text
upload_widget({ accept: 'video', maxFiles: 1, label: 'Ad clip to multiply' })   # alone in its turn
generate_estimate({ modelSlug: 'seedance-2.5-r2v', task: 'editing', resolution: '720p',
  referenceVideos: ['<source URL>'], referenceImages: ['<ref URL>'], prompt: '<edit prompt for version 1>' })
# quote the total for all versions, wait for the user's go, then all versions at once:
generate_batch({ requestId: '<run id>', requests: [
  { modelSlug: 'seedance-2.5-r2v', task: 'editing', resolution: '720p',
    referenceVideos: ['<source URL>'], referenceImages: ['<ref URL>'], prompt: '<prompt v1>' },
  { ... version 2 ... } ] })
generate_wait_batch({ jobIds: ['<v1 jobId>', '<v2 jobId>'], timeoutSeconds: 60 })
```
</mcp>

## UX rules

1. Be concise. No raw IDs, job IDs, model names, prompts or JSON in chat.
2. Reply in the user's language. Prompts go to <cli>the CLI</cli><mcp>the tools</mcp> in English; on-screen text the
   user wants written stays verbatim in its own language.
3. Ask everything that is missing in ONE message. Never re-ask what is already explicit.
4. Polling is silent. No status narration between waits.
5. Deliver results as "Version 1", "Version 2"… in the planned order.

## Hard limits

- **One source, 4–15 seconds.** Longer sources are out of range here (the engine edits at
  most 15 s). Say so, give the accepted range, and ask the user to send a trimmed clip.
  Never trim, split, loop or speed up the source yourself — there is no editing tool.
- **Length check.** You cannot open the video. Use the length the user states; otherwise
  derive it from the first estimate (see Cost handling). If the server rejects the
  source as too long or too short, stop and report the range.
- **Zip, never multiply.** Ordered lists pair by position: version 1 gets the first
  person AND the first product, version 2 the second of each. Never build every
  combination of two lists. If the lists have different lengths and the user did not
  say how to pair them, ask one mapping question.
- **Captions survive.** Every caption, subtitle, title, label, logo, handle and other
  on-screen text stays exactly as in the source unless the user names that element as
  an edit target, or it is printed on something being replaced. Never remove, add or
  regenerate captions on your own.
- **Retry once.** A failed version is resubmitted at most once. Keep successes; report
  failures by version number.

## Safety and consent

Refuse, without workarounds, when any of these fail:

- **People.** A replacement must be a consenting adult the user may use, or an
  AI-generated adult (20+). Never put a real public figure, celebrity or private person
  into the ad without their consent, never use a supplied photo to impersonate its
  subject, and never place a minor. If a source person reads as under 20, require
  either a user-supplied adult reference or the user's explicit agreement to recast the
  role as an adult.
- **Truth.** Do not edit in fabricated endorsements, ratings, reviews, results,
  before/after claims or prices. A requested text edit uses the user's exact words.
- **Content.** No sexualised edits, no nudity, no edits that promote prohibited or
  age-restricted goods, no political persuasion, no deceptive impersonation of a brand
  the user does not represent.

## Intake (one turn)

As soon as a source arrives, collect whatever is still missing, all in one message:

1. **What changes per version** — the ordered list of versions or an explicit `N`, and
   for each: target (described plainly: "the woman in the grey jacket", "the can on the
   table"), operation (replace / add / remove / change attribute / change clothing /
   change background / change one named text element) and time range if partial.
2. **References** — does each replacement have an image (all, some, none)? If the user
   promises images, wait for them before any paid step.
3. **The source people you will replace** — since you cannot watch the clip, ask for a
   one-line description of each (visible hair, overall look) so generated replacements
   can be clearly different.
4. **Resolution** — `720p` (recommended) or `480p` (cheaper). 1080p is not available.

If a target, range or pairing is ambiguous, ask one bundled mapping question; never guess.

## Source and references

<cli>
- **Source video.** A local path can go straight into `--reference-video` (the CLI
  uploads it), or upload it once with `clickraft upload <file> --json` and reuse the
  returned URL for every version so it is not re-sent. A previous job's
  `data.resultUrl` is also valid.
- **User reference images.** Local paths or URLs into `--reference-image` (a local path
  uploads automatically, about 10 s each); up to 8 per call. Catalog products:
  `clickraft product list --json --search "<name>"`, then pass the primary
  `data.products[].images[].url` as a `--reference-image` so its `@ImageN` position
  stays explicit. The search often returns two products with the same title; titles
</cli>
<mcp>
- **Source video.** The tools take URLs only. When the user has the clip as a file (or
  attached it in chat), call `upload_widget({ accept: 'video', maxFiles: 1 })` as the
  only tool call in that turn, then wait for the user's follow-up message with the
  uploaded URL. Upload it once and reuse that URL in `referenceVideos` for every
  version. A previous job's `resultUrl` is also valid. A link to an outside site
  (a video platform, a shop page) is rejected — ask the user to upload the file instead.
- **User reference images.** URLs into `referenceImages`, up to 8 per call. For the
  user's own files, one `upload_widget({ accept: 'image', maxFiles: <count> })` turn
  collects them all; never ask for base64. Catalog products:
  `product_list({ search: '<name>' })`, then pass the primary
  `items[].images[].url` in `referenceImages` so its `@ImageN` position
  stays explicit. The search often returns two products with the same title; titles
</mcp>
  alone cannot tell them apart, so pick the one whose image matches what the user
  showed, or show each candidate's primary image (or its image count and id suffix) and
  ask. Keep one fixed order per version: user images first, then
  generated people.
- **Missing adult replacement people.** Follow
  [references/replacement-people.md](references/replacement-people.md): one generated
  portrait per missing person, shown to the user for approval before any video spend.
  Two people replaced in each of `N` versions with no references means `2N` distinct
  generated people. Generated people are for human roles only — never for products,
  animals, objects, backgrounds or text.

## Planning rules

- A person replacement swaps that person **everywhere** they appear in the clip. If the
  user asks to replace someone only in part of the clip, ask whether they want a full
  swap or just an attribute change (hair, clothing).
- A person reference image owns the person's **complete look** — face, hair, body,
  clothing, shoes, worn accessories. The source person's outfit does not carry over,
  unless the user names clothing to keep or attaches a separate outfit image for them.
- `remove` describes what fills the gap. `add` states where, how big, how it moves.
  Attribute edits change only the named property.
- Resolve every choice before writing: the final prompt contains no "if", no
  alternatives, no open question.

## Prompt writing

Write one prompt per version from
[references/edit-prompt.md](references/edit-prompt.md). Hard checks before submitting:

- at most **2,000 characters** (the engine's limit is 2,048);
- every attached `@ImageN` cited at least once, no undeclared tag, no URL or ID;
- the caption-preservation sentence appears exactly once;
- every replaced person has an explicit "never appears" exclusion;
- tags written exactly `@Video1`, `@Image1` (case matters).

Rewrite a failing prompt once; if it still fails, drop that version and say so.

## Invocation and ledger

<cli>
Keep a ledger per version: index, edits, reference order, prompt, jobId, status,
attempts. Submit one version at a time, in order, each as its own request:

```bash
clickraft generate create --json --no-wait \
  --model-slug seedance-2.5-r2v --task editing --resolution 720p \
  --reference-video <source> \
  --reference-image <@Image1> --reference-image <@Image2> \
  --prompt "<validated prompt>"
```

Do not pass `--duration-seconds` or `--aspect-ratio`; editing inherits both from the
source. Record `data.jobId`, then:

```bash
clickraft generate wait <jobId> --json --timeout 100 --output ./clickraft-output/
```

- One wait per Bash call (calls die near 2 minutes), never chained with `&&`. A wait
  that times out (`E_TIMEOUT`, exit code 6) is not a failure: run `generate wait` again
  on the SAME jobId. Never resubmit a pending job — that charges again. After about 15
  waits on one job, tell the user it is still rendering and resume it on their next
  turn.
</cli>
<mcp>
Keep a ledger per version: index, edits, reference order, prompt, requestId, jobId,
status, attempts. Submit every approved version in one `generate_batch` call, one
request per version in version order (the batch `index` is version − 1), so they share
one widget; more than 8 versions go in several batches of up to 8. A single version is
one `generate_create` with `wait: false`. Each request:

```text
{ modelSlug: 'seedance-2.5-r2v', task: 'editing', resolution: '720p',
  referenceVideos: ['<source URL>'],
  referenceImages: ['<@Image1 URL>', '<@Image2 URL>'],
  prompt: '<validated prompt>' }
```

Give the batch its own `requestId` (each version is keyed by it plus its index). Do not
pass `durationSeconds` or `aspectRatio`; editing inherits both from the source. Record
each `jobs[].jobId` under its version; an item with `jobId: null` was not submitted —
read its `errorCode` and treat it as a failed attempt. Then:

```text
generate_wait_batch({ jobIds: ['<v1 jobId>', '<v2 jobId>', ...], timeoutSeconds: 60 })
```

- When the time runs out the tool returns the jobs still `queued` / `processing` /
  `uploading` — that is not an error. Call it again with the ids that are not finished.
  Never resubmit a pending job — that charges again. After about 15 waits, tell the
  user the versions are still rendering (the widget keeps updating on its own) and
  resume on their next turn.
- If a call fails in transport, retry it with the SAME `requestId`; the server returns
  the original jobs instead of charging again.
</mcp>
- A job can sit in `queued`<cli> (`startedAt` null)</cli> for several minutes before it starts, and
  an organisation's jobs may run one after another rather than in parallel. Video
  renders take roughly 3–5 minutes once started, so several timed-out waits in a row
  are normal; tell the user up front that each version can take several minutes plus
  queue time.<cli> You may still submit the next version before the previous one finishes;</cli>
<cli>
  keep each jobId under its index.
- A terminal failure gets one resubmission with the same plan; then report it.
</cli>
<mcp>
- A terminal failure gets one resubmission with the same plan, as its own
  `generate_create` with a new `requestId` (a new intended generation); then report it.
</mcp>

## Review and delivery

<cli>
The agent cannot play video. Check what you can: the job completed, the file saved
(`data.savedPath`), and the thumbnail if one is returned (`data.thumbnailUrl` — open the
saved image with Read when available). Say plainly that motion and identity were not
frame-checked.

Deliver in version order: saved path and result URL per version, then one line with
`completed/total`, any failed or still-pending versions, the resolution and the source
length. Hide prompts, references, model names and job IDs.
</cli>
<mcp>
The agent cannot play video. Check what you can: the job completed, and the poster
frame if one comes back with the result (call `generate_get({ id: <jobId> })` on a
finished version to see it; it is often missing). A poster frame is one small still —
it shows neither motion, lip-sync nor sound. Say plainly that motion and identity were
not frame-checked, and ask the user to play each version in the widget and review the
motion, the replaced people and the audio before using it.

The versions already show in the generation widget and update live — do not paste
their URLs or re-display them unless the user asks. If a version was resubmitted, call
`generate_show({ jobIds: [final ids in version order] })` once so the set reads
Version 1…N without the superseded attempt. Then one line with `completed/total`, any
failed or still-pending versions, the resolution and the source length. Hide prompts,
references, model names and job IDs.
</mcp>

**Audio note (always say it once).** The engine regenerates the soundtrack together with
the picture; there is no switch to keep the original audio track untouched. The prompt
asks for the source sound to be kept, but tell the user to listen, and to lay the
original audio back in their editor if it must match exactly.

## Cost handling

Video edits are expensive. Before submitting anything:

1. <cli>Run `clickraft generate estimate --json` with the exact flags of version 1.</cli><mcp>Call `generate_estimate` with the exact request of version 1 (it does not charge).</mcp>
2. Multiply `<cli>data.</cli>creditCost` by the number of versions (add the generated-person
   portraits, about 400 credits each), and quote the total.
3. **Wait for the user's go.** Do not submit until they agree. If `<cli>data.</cli>affordable` is
   false, report `<cli>data.</cli>blockedReason` and stop.

Editing is billed on the source length: at 720p it is roughly 1,136 credits per
(source seconds + 1) — a 10-second source is about 12,500 credits per version; 480p is
a little under half. The estimate is the authority; if a published rate (946/s) is
quoted elsewhere, trust the estimate. You can read the source length back from it:
`seconds ≈ creditCost / 1136 − 1` at 720p.

Never lower the resolution or drop versions to save credits without asking.

## Error handling

<cli>
| `error.code` | What to do |
|---|---|
| `E_AUTH_TOKEN_MISSING` / `E_AUTH_TOKEN_EXPIRED` | Tell the user to run `clickraft login`. Do not retry. |
| `E_INSUFFICIENT_CREDITS` | Stop. Say which versions finished and what the rest need; link to billing. Do not retry. |
| `E_TIMEOUT` (exit 6, from `generate wait`) | Not a failure — the job keeps running. Run `generate wait <same jobId>` again; never re-create the job. |
| `E_RATE_LIMITED` | Wait `error.retry_after_ms` (default 1000) and retry that one call once. |
| `E_MODEL_NOT_FOUND` | Re-check `clickraft models list --json`. If `seedance-2.5-r2v` or its `editing` task is gone, stop and tell the user; do not switch model. |
| `E_GEN_CONTENT_REFUSAL` | That version was refused for safety. Do not retry it as-is, do not drop references to get around it; tell the user. |
| Input / duration error on the source | Report the accepted 4–15 s range and ask for a trimmed clip. |
</cli>
<mcp>
Errors arrive as `Error [CODE] (HTTP n)` in the tool result (in a batch, as an item's
`errorCode`).

| Code | What to do |
|---|---|
| `AUTH_TOKEN_MISSING` / `AUTH_TOKEN_EXPIRED` | Tell the user to reconnect the Clickraft connector. Do not retry. |
| `INSUFFICIENT_CREDITS` | Stop. Say which versions finished and what the rest need; give the pricing link from the error. Do not retry. |
| `RATE_LIMITED` | Wait a few seconds and retry that one call once, with the same `requestId`. |
| `MODEL_NOT_FOUND` | Re-check `models_list({ slug: 'seedance-2.5-r2v' })`. If the model or its `editing` task is gone, stop and tell the user; do not switch model. |
| `GEN_CONTENT_REFUSAL` | That version was refused for safety. Do not retry it as-is, do not drop references to get around it; tell the user. |
| `REFERENCE_LIMIT_EXCEEDED` | More than 8 reference images in one version. Re-plan that version with fewer references; never drop one silently. |
| `INPUT_INVALID_FORMAT`, or a duration error on the source | A local path or outside link was passed (upload it first), or the source is out of range: report the accepted 4–15 s range and ask for a trimmed clip. |

A wait that runs out of time is not an error: the job is still running — wait again on
the same `jobId`, never re-create it.
</mcp>

## Compatibility

<cli>
Requires `@clickraft/cli` `>= 0.21.0` (`--task`, `--reference-video`, `--no-wait`,
`generate wait --output`, `generate estimate`). Check with `clickraft --version`. The
engine's limits can change: confirm once per session with `clickraft models list --json`
→ the `seedance-2.5-r2v` entry, `constraints.features.task.options` contains `editing`
and `constraints.limits.max_prompt_length` (2,048 today).
</cli>
<mcp>
The engine's limits can change: confirm once per session with
`models_list({ slug: 'seedance-2.5-r2v' })` — `constraints.features.task.options`
contains `editing` and `constraints.limits.max_prompt_length` (2,048 today).
</mcp>
