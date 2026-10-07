---
version: 0.8.1
name: ugc-video
description: |
  Produce a creator-style (UGC) short video with the Clickraft CLI: one continuous
  vertical clip up to 15 seconds with native spoken audio. Six formats: creator review
  (default), product-only voiceover, unboxing, try-on, step-by-step tutorial, and a
  website tour built on the user's real screenshots. Locks one consenting or generated
  adult creator, builds and cleans a storyboard image, writes a script fitted to the
  length, and renders the clip once the user approves the price.

  Use when: "UGC video", "UGC ad for my product", "creator review video", "TikTok-style
  review", "unboxing video", "try-on video", "fit check", "tutorial video with steps",
  "product voiceover ad", "talking-head ad for my website".

  NOT for: editing an existing clip (use `ad-multiplier`), still images (use
  `generate-image`), a silent product commercial, scripts only, fake testimonials, a
  real person's likeness without consent, or one stitched video longer than 15 s.

  Chain with: `ad-multiplier` to make versions of the finished clip.
argument-hint: "[brief] [--product <uuid>|product photo|url] [creator photo] [duration 4-15s]"
allowed-tools: Bash(clickraft:*), Read
---

# UGC video with the Clickraft CLI

One shared pipeline, six format profiles. Pick exactly one format from what the user
wants to see; **review** is the default for an unspecified UGC request.

| Format | What the viewer sees | Profile |
|---|---|---|
| review | One adult creator talks to camera and demonstrates a product, or tells a story with no product | [references/formats/review.md](references/formats/review.md) |
| product | The product is the hero; an off-screen voice narrates; nobody speaks on camera | [references/formats/product.md](references/formats/product.md) |
| unboxing | A creator opens a sealed package and reacts | [references/formats/unboxing.md](references/formats/unboxing.md) |
| try-on | A creator wears a garment or accessory and shows fit and texture | [references/formats/try-on.md](references/formats/try-on.md) |
| tutorial | A creator demonstrates real use, each step labelled `Step N — Heading` | [references/formats/tutorial.md](references/formats/tutorial.md) |
| website | A creator talks about a site, using the user's real screenshots | [references/formats/website.md](references/formats/website.md) |

A product URL identifies a product; it does not make the video a website tour. Read only
the selected profile plus the shared references it names.

## Scope: one clip, at most 15 seconds

The engine renders 4–15 seconds per clip, with sound. This skill delivers **one
continuous clip**. There is no stitching, trimming or caption burning here. If the user
wants 30 or 45 seconds, say so plainly and offer either one 15-second cut, or a series of
separate clips (part 1, part 2…) that they assemble in their own editor — each part is
planned, priced and approved on its own (see "Series of parts").

## Quick start

```bash
clickraft generate create --json --no-wait --model-slug nano-banana-pro --resolution 2K \
  --aspect-ratio 3:4 --prompt "<creator portrait>"                       # if no creator image
clickraft generate create --json --no-wait --model-slug gpt-image-2.5-sunburst \
  --quality high --aspect-ratio 21:9 --reference-image <product> \
  --reference-image <creator> --prompt "<board prompt>"                  # raw board
clickraft generate create --json --no-wait --model-slug gpt-image-2.5-sunburst \
  --quality high --aspect-ratio 21:9 --reference-image <raw board resultUrl> \
  --prompt "<cleanup prompt>"                                            # cleaned board
clickraft generate estimate --json --model-slug seedance-2.5-r2v --task reference \
  --aspect-ratio 9:16 --resolution 720p --duration-seconds 12 \
  --reference-image <cleaned board> --reference-image <creator> \
  --reference-image <product> --prompt "<clip prompt>"                   # quote, wait for go
```

Then the same flags with `generate create --no-wait`, and `generate wait` per job.

## UX rules

1. Be concise. No raw IDs, job IDs, model names, prompts, boards or JSON in chat unless
   the user asks to see the board.
2. Reply in the user's language. Prompts go to the CLI in English. Spoken lines default
   to English with a neutral American accent unless the user asks otherwise.
3. Ask every missing item in ONE message. The only sanctioned second question is the
   video price confirmation.
4. Never ask about models, boards, slot counts, aspect ratio (always 9:16), resolution,
   audio or cuts. Those are locked.
5. Polling is silent.

## Safety and truth gate — before intake

If any item fails, do not generate and do not route around it:

- **Creator.** Only a generated adult (21+) or a consenting adult the user is entitled
  to use. A supplied photo is not permission to impersonate its subject. Ask once when
  consent is unclear. Refuse public figures, celebrities, minors and deceptive identity
  use. Never imitate a real person's voice.
- **What is promoted.** Refuse political persuasion and prohibited or age-restricted
  goods: adult sexual content, gambling, drugs or prescription medicine, tobacco or
  nicotine, weapons, counterfeit or illicit goods, extremist material, high-risk or
  deceptive finance, malware or spyware, fraud, covert surveillance.
- **Claims.** `approved_claims` is the complete allowlist of product claims the user
  supplied. Use each verbatim; never strengthen, merge or derive new claims. With no
  allowlist, talk only about what is visible: materials, mechanics, texture, packaging.
- **No synthetic testimonials.** A generated creator is a host or demonstrator, never a
  customer. No invented purchases, ownership, results, before/after, ratings, reviews,
  social proof or personal history. First-person experience only when the user is the
  creator, wrote the exact script, and confirms it is true for them.
- **Framing.** Present product videos as a brand demo or sponsored creative. If the user
  asks for a post caption, include an ad / sponsorship disclosure.
- **Try-on extra.** Ordinary clothing, shoes, bags, jewellery only — no lingerie,
  underwear, sheer garments, sexualised styling or nudity.

## Intake

Parse the brief: format, duration, creator (photo, brand model, or desired gender for a
generated one), product (photo, catalog item or URL), approved claims, language, accent,
setting, mood, music, and any beat list. Classify how much direction the user gave:
`auto` (a few words), `guided` (tone or rough flow), `director` (a beat or shot list —
map it one-to-one).

Ask once, bundled, only for real gaps the selected format needs: duration (offer 8, 10,
12, 15 seconds), creator photo or gender, product (formats that require one), and the
format-specific items in the profile. Never invent a product for a productless review.

## Shared pipeline

1. **Product intake** — [references/product-intake.md](references/product-intake.md):
   one product reference URL, one canonical description, tier, category, use mechanic.
2. **Creator lock** — [references/creator.md](references/creator.md): the user's
   authorised photo, a brand-model portrait, or one generated portrait. One identity for
   the whole run; never regenerate it mid-run. Skipped in `product`.
3. **Script** — [references/monologue.md](references/monologue.md): persona, hook,
   word budget fitted to the duration, anti-slop pass, claim check.
4. **Board** — [references/board.md](references/board.md) plus the format's slot arc:
   raw storyboard → cleanup edit → visual inspection. Only the inspected cleaned board
   may seed the video. If cleanup fails, stop; never fall back to the raw board.
   Skipped in `website` (no board; the creator image drives the clip).
5. **Clip prompt** — [references/clip-prompt.md](references/clip-prompt.md): one prompt,
   cuts in board order, spoken line verbatim, ≤ 2,000 characters.
6. **Estimate, approval, render, review, deliver** — below.

## Model selection

Locked. Do not substitute; if a model is missing, stop and say so.

| Stage | Model | Flags |
|---|---|---|
| Generated creator portrait | `nano-banana-pro` | `--resolution 2K --aspect-ratio 3:4` (+ `--brand-model` when used) |
| Board and cleanup | `gpt-image-2.5-sunburst` | `--quality high --aspect-ratio 21:9` (no `--resolution`), up to 8 refs |
| Clip (default) | `seedance-2.5-r2v` | `--task reference --aspect-ratio 9:16 --resolution 720p --duration-seconds <4-15>`; refs in order cleaned board, creator, product |
| Clip (one-take variant) | `seedance-2.5-i2v` | `--start-frame <cleaned 9:16 opening frame> --aspect-ratio 9:16 --resolution 720p --duration-seconds <4-15>` |

Use the one-take variant only when the user wants a single uninterrupted shot with no
internal cuts; its start frame comes from the opening-frame variant in
[references/board.md](references/board.md). 720p is the ceiling (no 1080p).

Verify once per session with `clickraft models list --json`: `seedance-2.5-r2v` lists
`reference` in `constraints.features.task.options`, both Seedance entries accept `9:16`
and your duration, and `constraints.limits.max_prompt_length` (2,048 today) — keep clip
prompts under it.

## Invocation and ledger

Keep a ledger per stage: stage, prompt, reference order, jobId, status, attempts, and
for boards the raw and cleaned `resultUrl` separately. Every request is its own call:

```bash
clickraft generate create --json --no-wait <flags> --prompt "<prompt>"
clickraft generate wait <jobId> --json --timeout 100 --output ./clickraft-output/
```

- A completed job's `data.resultUrl` is a valid `--reference-image` / `--start-frame`.
- One wait per Bash call (calls die near 2 minutes), never chained with `&&`. A wait
  that times out (`E_TIMEOUT`, exit code 6) is not a failure: wait again on the SAME
  jobId. Never resubmit a pending job.
- A job can sit in `queued` (`startedAt` null) for several minutes, and an
  organisation's jobs may run one after another rather than in parallel, so several
  timed-out waits in a row are normal. Budget about 2 minutes per image stage and 3–5
  minutes for the clip once it starts, plus queue time; tell the user the run takes a
  while up front.
- Image stages run in order (creator → raw board → cleanup); each needs the previous
  result. Retry a technical failure once; a bare failure with no reason is "unknown" —
  check with `generate get <jobId> --json` before resubmitting.
- A safety refusal stops the dependent path. Do not swap models, drop references or
  regenerate the creator to get around it.

## Review and delivery

Open every saved image (creator, raw board, cleaned board) with Read before using it —
see the inspection list in [references/board.md](references/board.md). For the clip you
cannot play video: confirm completion and the saved file, open `data.thumbnailUrl` if
returned (it is often null — never depend on it), and say that speech, lip-sync and motion were not frame-checked. If the user
reports a defect, redo only that stage.

Deliver: saved path and result URL of the clip, its length, the exact spoken script
(useful for captions in their editor), and one line on format and look. On request, a
chat-only post package: a short caption with an ad disclosure, 3–5 hashtags, a pinned
comment idea. Hide models, boards, job IDs and pipeline steps.

Audio: the clip carries native speech and room sound. Music only when the user asked
for it. There is no audio-off switch; a "no music" request goes into the prompt.

## Series of parts (only when asked for more than 15 s)

Split the total into parts of 4–15 s with the fewest parts (e.g. 30 → 15 + 15,
24 → 12 + 12, 19 → 15 + 4). Each part is a full run of steps 3–6 with the same creator
and product. Part K's board takes the cleaned board of part K−1 as its last reference
for continuity; its script continues mid-thought (no greeting, no product
re-introduction). Price and approve each part, deliver each part separately, and tell
the user to join them in order.

## Cost handling

- Creator portrait ~400 credits, each board and cleanup ~50 credits (21:9 high). Image
  stages run without asking, but state "this run will use about N credits" when you
  first quote the video.
- **Video: always estimate and wait for the user's go.** Run
  `clickraft generate estimate --json` with the exact clip flags, quote
  `data.creditCost` (≈ 946 credits per second at 720p — a 12 s clip is about 11,350),
  and submit only after the user agrees. If `data.affordable` is false, report
  `data.blockedReason` and stop.
- Never lower resolution or duration to save credits without asking.

## Error handling

| `error.code` | What to do |
|---|---|
| `E_AUTH_TOKEN_MISSING` / `E_AUTH_TOKEN_EXPIRED` | Tell the user to run `clickraft login`. Do not retry. |
| `E_INSUFFICIENT_CREDITS` | Stop. Say which stages finished and what the rest needs; link to billing. Do not retry. |
| `E_TIMEOUT` (exit 6, from `generate wait`) | Not a failure — the job keeps running. Run `generate wait <same jobId>` again; never re-create the job. |
| `E_RATE_LIMITED` | Wait `error.retry_after_ms` (default 1000) and retry that call once. |
| `E_MODEL_NOT_FOUND` | Re-check `clickraft models list --json`. If a locked model is gone, stop and tell the user; do not substitute. |
| `E_GEN_CONTENT_REFUSAL` | That stage was refused for safety. Stop the dependent path; do not rephrase around the safety gate or drop references. Tell the user. |

## Compatibility

Requires `@clickraft/cli` `>= 0.21.0` (`--task`, `--start-frame`, `--no-wait`,
`generate wait --output`, `generate estimate`, `--quality`). Check with
`clickraft --version`.
