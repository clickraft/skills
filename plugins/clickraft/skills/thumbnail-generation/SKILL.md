---
version: 0.8.1
name: thumbnail-generation
description: |
  Produce click-worthy YouTube and Instagram thumbnails and video covers with Clickraft:
  concept framework, casting, scene, 4K render, surgical tweaks, then headline text.
  Builds every prompt from a fixed 11-block structure with an identity lock for the
  user's face, emotion presets, camera takes and split frames.

  Use when: "make a YouTube thumbnail", "thumbnail for my video", "video cover",
  "Instagram cover", "Shorts cover", "viral thumbnail", "thumbnail like this one",
  "put my face on the thumbnail", "before and after thumbnail", "make it look shocked",
  "change the background of my thumbnail", "3D version of my logo for the thumbnail".

  NOT for: general images, posters or ads that are not video packaging (use
  `generate-image`), editing the video itself, or laying finished type over an image (no
  text-overlay tool exists here; this skill renders clean or bakes text in).

  Chain with: `generate-image` for unrelated stills; a calling skill may hand over a
  locked concept and hook for one render.
argument-hint: "[video topic or scene] [--headline \"<text>\"] [--aspect-ratio 16:9|9:16|4:5] [face photo, logo or example thumbnail]"
allowed-tools: Bash(clickraft:*), Read
---

# Thumbnails and video covers with the Clickraft CLI

The pipeline runs in a fixed order: **concept framework, casting, scene, 4K render,
surgical tweaks, text**. Every main render is one `nano-banana-pro` image at 4K, built
from the 11 prompt blocks in [references/prompt-blocks.md](references/prompt-blocks.md).

## Quick start

```bash
clickraft generate estimate --json --model-slug nano-banana-pro --resolution 4K \
  --aspect-ratio 16:9 --prompt "<assembled 11-block prompt>"
clickraft generate create --json --no-wait --model-slug nano-banana-pro --resolution 4K \
  --aspect-ratio 16:9 --reference-image ./face.jpg --prompt "<assembled 11-block prompt>"
clickraft generate wait <jobId> --json --timeout 100 --output ./clickraft-output/
```

Open `data.savedPath` with Read and run the post-render check before you show anything.

## UX rules

1. Be concise. No job IDs, model names, JSON or prompt text in chat. Show the saved path,
   the result URL and one line on what the image shows.
2. Reply in the user's language. Prompts sent with `--prompt` are always English; only
   text meant to appear on the image stays exactly as the user wrote it.
3. Ask only the gates below, together in one message when several apply, each as short
   labeled options. Never ask about anything that has a default.
4. Waiting is silent. No status narration while jobs run.
5. Never ship an image that failed the post-render check without saying so.

## When to ask

Collect what the message already gives you: topic or scene, face photos or trained
identity (0 to 3), an example thumbnail, a logo, a headline, aspect ratio, emotions, how
many variants. Defaults are in [references/prompt-blocks.md](references/prompt-blocks.md)
("Field defaults"). Then run these gates; a gate the user already answered is skipped.

1. **Who is in frame (always first, before any render).** If the concept has a person and
   no face photo or trained identity was given, ask once: "Do you want yourself (or a
   specific person) on the thumbnail? Send a face photo or name your trained model and
   I'll lock the identity. Or should it be a generated person, or no people at all?"
   - Face photo: `--reference-image <path|url>` plus an identity lock per person.
   - Trained identity: `clickraft brand-model list --json`, match by name (one match or a
     single model: use it), pass `--brand-model <uuid>`. On a name shared by several
     models, prefer the user's own (`source: "user"`) over shared system ones; if several
     of the user's own still match, show each one's `thumbnailUrl` (or, when that is null,
     its id suffix) and ask which.
   - Generated person: only on that explicit answer; describe them in prose in block 4.
   - No people: pick a people-free framework (landscape, product, graphic, map).
   Never invent a person silently, and never swap a supplied face for a stranger. For a
   set across several frameworks, ask this once before rendering any of them.
2. **Example thumbnail supplied.** Ask once: **Match it** (keep its style, composition and
   subject closely) or **Unique take** (loose inspiration only). "Like this" already means
   Match; "inspired by" already means Unique. If it shows a real person, Match still needs
   that person's own face photo; never generate a look-alike.
3. **How many.** If no count was given: one thumbnail, or a set of about 4 variants of the
   same concept (different emotions and/or camera takes)? Up to 16.
4. **Headline supplied.** Offer the two text paths from
   [references/headline-text.md](references/headline-text.md): (a) clean render, text added
   by them, with style specs; (b) text baked in and spell-checked.

## The pipeline

1. **Collect inputs and apply defaults** (above).
2. **Pick the concept.** Read
   [references/thumbnail-frameworks.md](references/thumbnail-frameworks.md). Sketch at least
   five concepts across frameworks, keep the one (or blend of two) that opens the strongest
   question. A text-carrying framework you chose yourself renders without its text.
3. **Read the example thumbnail** (if any) with Read and fill the extraction contract in
   [references/prompt-blocks.md](references/prompt-blocks.md). The example is looked at
   only: it is **never** passed as `--reference-image` or to any model.
4. **3D logo (only if the user wants their logo in 3D).** Submit the 3D logo prompt now:

   ```bash
   clickraft generate create --json --no-wait --model-slug gpt-image-2.5-sunburst \
     --quality high --aspect-ratio 1:1 --reference-image ./logo.png --prompt "<3D logo prompt>"
   ```

   Wait for it, check it, and use its `data.resultUrl` as the logo reference of every main
   render. A flat logo is passed as is.
5. **Assemble one prompt per variant** from blocks 1 to 11 in order (include and omit rules
   are in the reference). Variants = emotions x takes, capped at 16; with nobody in frame,
   variants = takes. Variants differ only in the Expression phrase and the take line.
6. **Estimate, then submit** (see "Cost handling" and "Invocation").
7. **Wait and check every image** (see "Post-render check").
8. **Deliver** every variant that passed. The user picks; no pick means all are delivered.
9. **Tweaks on request** (see "Surgical tweaks").

Before every `generate create`, confirm:

- [ ] Main render: `nano-banana-pro`, `--resolution 4K`. Tweak: `gpt-image-2.5-sunburst`.
      3D logo: `gpt-image-2.5-sunburst`.
- [ ] Block 1 (or its split or graphic replacement) opens the prompt; block 11 closes it.
- [ ] A person in frame has the lighting block and, with a face photo or trained identity,
      an identity lock.
- [ ] The example thumbnail is not among the `--reference-image` flags.
- [ ] One command renders one variant.
- [ ] No text ordered: the prompt contains `No text, no readable UI labels, no watermark.`

## Model selection

| Task | Model | Flags |
|---|---|---|
| Main render | `nano-banana-pro` | `--resolution 4K` always (its default is 1K), `--aspect-ratio` |
| Surgical tweak | `gpt-image-2.5-sunburst` | `--quality high`, `--aspect-ratio` same as the source, source `resultUrl` as `--reference-image` |
| Tweak fallback | `flux-kontext-pro` | one reference only; no 4:5 or 5:4 |
| 3D logo | `gpt-image-2.5-sunburst` | `--quality high --aspect-ratio 1:1`, flat logo as `--reference-image` |

Do not use `nano-banana-2` for the main render; this skill always uses the top tier. Do
not use `gpt-image-2` for the 3D logo or tweaks here: they need an input image, so use
`gpt-image-2.5-sunburst`. If a slug is rejected or a constraint matters (ratio, reference
count), check `clickraft models list --json --category image` and read
`data.models[].constraints.capabilities`.

Aspect ratios: 16:9 for YouTube (default), 9:16 for Shorts and Reels covers, 4:5 for
Instagram feed. `nano-banana-pro` also accepts 1:1, 2:3, 3:2, 3:4, 4:3, 5:4 and 21:9.

## Invocation

Submit every variant with its own command, all before waiting on any. Keep a ledger in
your notes: variant number, emotion, take, job id.

```bash
clickraft generate create --json --no-wait --model-slug nano-banana-pro --resolution 4K \
  --aspect-ratio 16:9 \
  --reference-image ./face-1.jpg --reference-image ./logo.png \
  --prompt "ATTACHED IMAGES: image 1 is the face of CHARACTER 1; image 2 is the brand logo. <blocks 1-11>"
```

- Reference order: faces in CHARACTER order, then the logo (flat file, or the 3D logo's
  `resultUrl`). With 2 or more images the prompt opens with the manifest line.
- Trained identity instead of a photo: `--brand-model <uuid>` (up to 3); the prompt names
  "the trained identity". Pass the bare uuid by default (the server uses the model's main
  image). Add a pose (`<uuid>:<pose>`, one of front, 3/4-right, right, left, 3/4-left,
  back, face-closeup, hands, approved) only when the user asks for an angle, and check it
  first with the free `generate estimate`: `E_BRAND_MODEL_POSE_NOT_FOUND` means that
  model has no such image (shared system models have none), so drop the pose.
- A catalog product as the hero: `--product <uuid>` (find it with
  `clickraft product list --json --search "<name>"`).
- Local paths are uploaded by the CLI and the same file is reused, so passing the same
  face to every variant costs nothing extra.

Then, for each job id in the ledger:

```bash
clickraft generate wait <jobId> --json --timeout 100 --output ./clickraft-output/
```

If the wait ends before the job finishes (`E_TIMEOUT`, exit code 6), run the same `wait`
again. Jobs can sit queued for minutes and an account's jobs may run one after another, so
2 to 3 waits per 4K render are normal; budget about 2 minutes per image. Never resubmit a
job that timed out; that charges a second time. Don't chain anything after `wait` with
`&&`: its non-zero exit stops the chain.

## Post-render check

Open each saved file with Read and check:

1. With face photos or a trained identity: the face clearly matches the person.
2. No text ordered: no stray letters, labels or watermark anywhere.
3. Text ordered: the painted text matches the ordered string character for character
   ([references/headline-text.md](references/headline-text.md)).
4. The expression and the hero element still read when you imagine the image about 120 px
   wide. If they don't, the composition is wrong, not the resolution.

A failure means a fresh render of the **same** prompt, at most 2 per variant. Still
failing: say what is wrong and show the best attempt. Never deliver it silently.

## Surgical tweaks

For "make him look scared", "change the background to a desert", "make it blue", "change
the rim light to magenta": use the matching tweak prompt from
[references/prompt-blocks.md](references/prompt-blocks.md) on the picked image.

```bash
clickraft generate create --json --no-wait --model-slug gpt-image-2.5-sunburst \
  --quality high --aspect-ratio 16:9 --reference-image "<picked resultUrl>" \
  --prompt "<tweak prompt>"
```

- On a submit error or a missing model, retry once on `flux-kontext-pro` with the same
  prompt and reference (no `--quality`). It has no 4:5: use 3:4 and say so.
- Tweaks come back at about 2K (2048 x 1152 for 16:9), not 4K. Mention it once.
- A color-only ask ("make it blue") is a background recolor; a new place or new content
  ("a desert") is a background swap.
- Each accepted tweak's `resultUrl` is the source of the next one.
- Run the post-render check on every tweak. On an image that carries text, that includes
  the character-for-character text check again: a tweak can repaint the letters.

## Text

The default is a clean render with no text. Text goes into the image only on an explicit
ask, along one of the two paths in
[references/headline-text.md](references/headline-text.md). This skill cannot lay type over
a finished image: on path (a) the user sets the headline from the style specs you give
them; on path (b) the model paints it and you spell-check it.

## Delivery

For each delivered image: the saved path, the result URL, and one line describing it
(emotion, take, the idea in a few words). Then offer, in one line, the next useful step:
more emotions or takes, a tweak, or the headline styles. Do not mention models, credits per
job, job ids or prompt blocks unless asked.

## Cost handling

Every main render is 4K, so always estimate before submitting and state the total; don't
ask, inform. Run `clickraft generate estimate` with the same flags as one variant (plus
`--json`), read `data.creditCost`, multiply by the variant count, and say for example
"4 thumbnails, about 1,920 credits". Also give the worst case with the up to 2 re-renders
per variant the post-render check allows: one 4K variant can reach 3 x 480 = 1,440
credits, so 4 variants up to 5,760. At the time of writing a 4K `nano-banana-pro` image is
480 credits and a `gpt-image-2.5-sunburst` tweak at high quality is under 110. If
`data.affordable` is false, report `data.blockedReason` and stop. Never drop to 2K or a
cheaper model to save credits without the user's say.

## Error handling

| `error.code` | What to do |
|---|---|
| `E_AUTH_TOKEN_MISSING` / `E_AUTH_TOKEN_EXPIRED` | Tell the user to run `clickraft login`. Do not retry. |
| `E_INSUFFICIENT_CREDITS` | Say how many credits the set needs and that the account is short; link to billing. Do not retry. Already-submitted variants keep running; wait for them. |
| `E_TIMEOUT` (exit 6) | Not a failure: the job keeps running. Run `generate wait <same jobId>` again; never re-create the job. |
| `E_RATE_LIMITED` | Wait `error.retry_after_ms` (1000 if unset) and retry that one submit once. |
| `E_MODEL_NOT_FOUND` | Main render: list models and report; do not switch tiers silently. Tweak: use the `flux-kontext-pro` fallback. |
| `E_GEN_CONTENT_REFUSAL` | Usually a real person's likeness, violence or a brand. Soften that element and ask before resubmitting. |

## Compatibility

Requires `@clickraft/cli` `>= 0.21.0` (`generate estimate`, `--resolution 4K`, `--quality`,
`--output`, `generate wait --timeout`). Check with `clickraft --version`; if older, ask the
user to update the CLI.
