# Prompt blocks, casting and edit prompts

Every main-render prompt is assembled from the 11 blocks below, **in this order**, as one
English paragraph per block. Copy the fixed sentences as written and fill every `<slot>`;
a prompt never leaves the skill with an unfilled `<...>`.

Precedence for every field: what the user asked for, then what you read from their
reference thumbnail, then the default listed here.

## Contents

- The 11 blocks
- Field defaults
- Identity lock
- Emotion presets
- Camera takes
- Split frames
- Reference thumbnail: the extraction contract
- Surgical tweak prompts
- 3D logo prompt
- Locked hand-off from another skill

## The 11 blocks

**Reference manifest (only with 2 or more reference images).** Before block 1, one line
that numbers each attached image in the order you pass the `--reference-image` flags,
faces first:
`ATTACHED IMAGES: image 1 is the face of CHARACTER 1; image 2 is the face of CHARACTER 2; image 3 is the brand logo.`
A trained identity passed with `--brand-model` is not an attached image; name it in
block 4 as "the trained identity" instead of an image number.

**1. Frame.** Always first.
`High-impact video thumbnail, built like a poster: photoreal, bold and instantly readable, not a quiet film still. <ratio> aspect ratio. One continuous image: no split screen, no diagonal seam, every element shares the same space and light.`
- For 9:16 add: `Framing adapted to a tall canvas, with the faces in the upper two thirds.` With nobody in frame say `the hero subject` instead of `the faces`.
- A split layout replaces this block (see "Split frames").
- Framework 8 (graphic or chart) replaces it with a clean graphic brief, for example:
  `Clean, bold explanatory graphic for a video thumbnail: <the chart or diagram>, flat shapes, two or three strong colors, generous empty space. <ratio> aspect ratio. Not a photograph.`
  It then drops blocks 10 and 11.

**2. Scene brief.** Only when the user described the content (a video title or topic counts),
or the reference gave a brief.
`SCENE, to be shown exactly as described: <scene in English>.`

**3. Text.** Always present. The default line:
`No text, no readable UI labels, no watermark.`
- Text baked in on an explicit ask (see [headline-text.md](headline-text.md)):
  `HEADLINE baked into the image, spelled exactly "<TEXT>": huge, heavy sans-serif letters, <style cue>, placed in open space so it never covers a face. No other text anywhere, no watermark.`
  `<style cue>` is the chosen headline style in a few words (see headline-text.md); the
  default is Bold White: `white with a thick black outline and a hard drop shadow`.
- An explicitly requested text-carrying framework (message bubble, review card, news band, day badge, map label):
  `ON-IMAGE ELEMENT: a <generic element> showing exactly "<short text>", neutral generic styling with no real brand, app, channel or network name or logo. No other text, no watermark.`
  Keep the words short and true to the video.

**4. Subjects.** Whenever a person or creature is in frame. Up to 3 characters.
- A person with a face photo or trained identity: one identity-lock paragraph each (below).
- A generated person (only when the user chose that): describe them in plain prose here,
  never in block 5, and end with `Expression: <phrase>.`
- Close the block with the size rule and the sharpness line:
  `The subject is the dominant hero of the frame: chest-up or tighter, filling roughly 40 to 60 percent of the image, in the foreground and clearly separated from the background, never small or pushed into a corner. Every face is in crisp focus.`

**5. Key elements.** Signature props or effects that make the idea pop (the oversized
object, the repeated items, the route on the map). Describe them as objects, without any
words or logos printed on them.

**6. Logo.** Only when the user supplied one.
- 2D: `The attached logo appears exactly as supplied, with its shapes, colors and proportions untouched, placed flat at a strong focal point with a light drop shadow, never over a face.`
- 3D (after the 3D logo step): `The attached 3D logo sits in the scene as a real physical object: glossy and dimensional, lit by the same key and rim light as the subject, with a soft contact shadow, placed at a strong focal point, never over a face.`

**7. Location.** Only when known: place, time of day, weather, atmosphere.

**8. Composition.** Always.
Default: `The subject is large and dominant, chest-up or medium close-up, filling about 40 to 60 percent of the frame on a third, camera at eye level, strong separation from the background, shallow depth with one accent element in the near foreground.`

**9. Background.** Always. Blended, never divided.
Default: `Background: a bold, saturated color field with a punchy gradient that suits the subject's colors, strong contrast, a soft vignette and a gentle falloff at the edges.`

**10. Lighting.** Whenever a person is in frame (skip it for framework 8 and for a
non-photoreal hand-off).
`Thumbnail lighting on the subject: a strong key light that shapes the face with crisp highlights and controlled falloff, a soft glowing fill that lifts the shadows, and a back light plus hair light that draw a clean bright rim around the hair, shoulders and outline, lifting the subject off the background.`
- Colored rim, only when the user names a rim color: replace the last clause with
  `a back light plus hair light in <color> that draw a vivid colored rim around the hair, shoulders and outline, with a faint matching glow.`
  Rim colors: electric ice blue (`#4DA6FF`), hot neon magenta (`#FF3DBE`), toxic neon lime
  (`#C8FF2E`), warm amber gold (`#FFB63D`), pure white. The key and fill never change color.

**11. Grade.** Always last.
`Color grade: vivid and high-contrast, bright clean exposure, rich saturated colors, deep blacks and bright highlights, crisp and glossy, everything graded as one image. <ratio>.`
Use a soft, low-contrast grade instead only when the user asks for a calm, muted,
premium or aesthetic look.

## Field defaults

Apply a default only when both the user and the reference left the field empty.

| Field | Default |
|---|---|
| Aspect ratio | `16:9` |
| Takes | 1 |
| Emotion | `shock` when a person is in frame; nobody in frame means no emotion axis |
| Background | the block 9 default line |
| Composition | the block 8 default line |
| Key elements | the most concrete, drawable noun of the topic, oversized and flying toward the camera; leave out when it would repeat the subject |
| Location | leave block 7 out |

## Identity lock

Soft wording such as "keep the face the same" lets the model drift toward a generic face.
For every person with a face photo, write:

> CHARACTER <N>: the person in attached image <K>. IDENTITY LOCK: render this exact person
> as a photographic likeness, with the same skull and bone structure, eye shape, nose,
> lips, jaw, skin tone, hairline and hair texture as the photo. Do not beautify, do not
> blend with other faces, do not restyle the face; anyone who knows them should recognize
> them instantly. Expression: <phrase>.

For a trained identity (`--brand-model`) use the same paragraph with "the trained identity"
in place of "the person in attached image K".

Drift still happens now and then. The fix is a re-render, not an apology.

## Emotion presets

The Expression slot takes the phrase after the dash. A phrase the user writes replaces it
word for word.

| Preset | Expression phrase |
|---|---|
| shock | mouth dropped open in a gasp, eyes wide |
| hype | huge ecstatic grin, eyes blazing with excitement |
| fear | frozen terrified stare, breath held |
| confusion | one eyebrow raised, head slightly tilted, puzzled |
| determination | jaw set, eyes locked on target |
| smug | small knowing smirk |
| charisma | calm magnetic gaze, relaxed brows, the faintest composed half smile, confident and never aggressive |
| disgust | recoiling grimace, nose wrinkled |
| awe | jaw dropped, eyes shining with wonder |
| rage | teeth bared, furious glare |
| laugh | head thrown back in a full laugh |

`charisma` is the calm positive option; use it instead of `determination` when the user
wants confident but friendly. When the user asks for N emotions without naming them, take
the first N of this order: shock, hype, rage, awe, laugh, fear, smug, charisma, confusion,
determination, disgust. When you offer emotions as choices, always include "something else
(describe it)".

When a reference thumbnail was analyzed, append its `emotion_detail` sentence only to the
variants that use the reference's own emotion.

## Camera takes

Take 1 is the designed framing and adds nothing. Takes 2 to 4 each add one line at the end
of block 8:

- Take 2: `ALTERNATE TAKE: low-angle hero shot, camera below eye level looking up, the subject towering over the frame, the background stretching upward, same scene and lighting.`
- Take 3: `ALTERNATE TAKE: tight punch-in, the face and expression filling more than half the frame, the background reduced to soft blurred context, same scene and lighting.`
- Take 4: `ALTERNATE TAKE: wider, more dynamic shot with a slight camera tilt, more of the setting visible, the subject anchored on a third, strong sense of motion across the frame, same scene and lighting.`

Variants = emotions x takes, capped at 16. Variants differ only in the Expression phrase
and the take line; everything else in the prompt is identical.

## Split frames

A split layout is used **only** when the user asks for a layout ("split", "before and
after", "side by side", "versus screen") or the reference analysis returned
`split: true`. "X vs Y" as a scene is one shared frame with both subjects, not a split.

Panels: before/after and versus default to 2 (halves); 3 or more named states or contenders
become vertical panels.

Replace block 1 with:
`SPLIT-FRAME video thumbnail, <ratio> aspect ratio: the image is divided into <N> <halves | vertical panels> by clean bold seams, each panel a complete small scene, all panels sharing one premium grade.`
(For 9:16 add the tall-canvas sentence from block 1.)

Then add exactly one mode sentence:

- plain: `Each panel shows one side of the story: panel 1, <desc>; panel 2, <desc>; panel 3, <desc>.`
- before/after: `LEFT panel shows the BEFORE state: <desc>. RIGHT panel shows the AFTER state: <desc>. Push the contrast between the two states of the same change as far as it will go.`
- versus: `Each panel presents one contender, lit and framed like a fight poster: panel 1, <contender A>; panel 2, <contender B>. Equal visual weight, tension crackling across the seam.`
- custom: `<the user's own panel-by-panel description>.`

And always close with:
`No labels, captions, words or numbers on or between the panels; the comparison is purely visual. Every panel graded as one premium image.`

## Reference thumbnail: the extraction contract

Look at the user's example thumbnail yourself (open it with Read) and write down exactly
these fields as strict JSON, with no other keys. This JSON stays in your notes; it is never
shown to the user and the image itself is never passed to the generation model.

```json
{
  "brief": "one dense sentence describing the concept",
  "subject": "pose and action described generically, never who the person is",
  "elements": "signature props or effects",
  "location": "place, time, atmosphere, or empty",
  "composition": "framing, camera angle, scale, layering",
  "background": "color, texture, blur, falloff",
  "split": false,
  "split_count": 0,
  "person_count": 1,
  "emotion": "one of the 11 presets, or other",
  "emotion_detail": "one vivid sentence on eyes, brows, mouth and head angle"
}
```

Where each field goes: `brief` to block 2, `subject` to block 4 (as the pose of the
characters the user supplied; it never adds a person), `elements` to block 5, `location`
to block 7, `composition` to block 8, `background` to block 9, `split` and `split_count` to
the split rule, `emotion` and `emotion_detail` to the Expression slot.

- **Match** mode: drive blocks 2, 5, 7, 8 and 9 hard from these fields.
- **Unique** mode: borrow only the energy and color mood; write a fresh subject and
  composition from the user's topic.
- A `person_count` higher than the faces the user supplied becomes extra people described
  in prose only if the user asked for them.
- A field the user left empty and the reference filled can be phrased as an instruction,
  for example `Mirror the reference concept's framing: <composition>.`

## Surgical tweak prompts

Each tweak takes the finished image's `resultUrl` as its only `--reference-image` and
states that everything else stays as it is.

- **Expression swap:** `Edit only the person's facial expression, changing it to: <phrase>. Keep the identity, face structure, hair, pose, body, clothing, logo, background, lighting and composition exactly as they are in the image, and any headline text unchanged and spelled exactly. Only the expression changes; the thumbnail lighting stays intact.`
- **Background swap:** `Replace only the background with: <desc>. Keep the subject, face, identity, pose, clothing, logo and every foreground element exactly as they are, and any headline text unchanged and spelled exactly. Re-light the edges of the subject so the new background's light direction, color and rim light look natural, keeping the thumbnail lighting on the face.`
- **Background recolor:** `Shift only the background colors toward <color>. Keep the background's shapes, content and depth exactly; only the color changes. Keep any headline text unchanged and spelled exactly. Adjust the faint color spill on the subject's edges to match, but leave the key light and fill on the face untouched.`
- **Rim light recolor:** `Change only the color of the rim light (the back light and hair light tracing the hair, shoulders and outline) to <color phrase>. Do not change the key light or fill, the background, the pose, the identity, the clothing, the logo or the composition, and keep any headline text unchanged and spelled exactly.`

Tweaks chain: the accepted output's `resultUrl` becomes the source of the next tweak.

## 3D logo prompt

Submitted on its own, with the user's flat logo as the only `--reference-image`:

> Turn the attached flat logo into a premium 3D render. Extrude its exact shapes into
> glossy, solid volumes, keeping every letter, proportion and brand color exactly as in the
> original. High-end product-render finish: soft studio reflections, fine bevels, crisp
> edges. The logo floats centered on a plain dark neutral studio background with a soft
> contact shadow and generous margins. No added text, no watermark.

## Locked hand-off from another skill

When a calling skill passes a full, locked set of inputs (style, a 3 to 6 word hook,
render medium, whether to bake the hook, who is in frame, and a count of one), treat every
value as answered: do not reopen any question, render exactly one 16:9 image, and use
block 3's HEADLINE line with the hook spelled exactly.

For a medium that is not photoreal (paper collage, flat motion graphics, storybook,
cut-out):

- replace block 1 with `Video thumbnail made entirely in <medium>: <materials, palette and rendering as supplied>. <ratio> aspect ratio. Not photoreal, not a photograph.`;
- drop blocks 10 and 11, but keep the hero subject, the safe space for text, the palette
  and the bold small-size readability;
- render recurring characters in that medium with their exact design, silhouette, clothes,
  colors and facial features; never turn an illustrated character into a photoreal face.

A photoreal medium keeps all the normal blocks. If the baked hook is misspelled after the
re-render budget, deliver one clean render of the same concept and hand back the hook as
overlay copy (see [headline-text.md](headline-text.md)).
