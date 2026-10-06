# Clip prompt — one Seedance prompt per clip

One plain-text prompt, no JSON, no fences. **Hard limit: 2,000 characters** (engine limit
2,048). That is tight for eight cuts, so every sentence must add motion, sound or
continuity — never re-describe what the board already shows.

## Calls

Default (board-driven, internal hard cuts):

```bash
clickraft generate create --json --no-wait --model-slug seedance-2.5-r2v --task reference \
  --aspect-ratio 9:16 --resolution 720p --duration-seconds <4-15> \
  --reference-image <cleaned board> --reference-image <creator> [--reference-image <product>] \
  --prompt "<clip prompt>"
```

`@Image1` is the cleaned board, `@Image2` the creator, `@Image3` the product (omit and
renumber what is absent; `product` format: board, then product). One-take variant:
`seedance-2.5-i2v --start-frame <cleaned opening frame>` with the same ratio, resolution
and duration, and the one-shot structure below. Both render native audio.

## Structure (board-driven)

```text
@Image1 is the storyboard (beats left to right), @Image2 the creator, @Image3 the product.
Look: vertical phone UGC, [light from the board], [camera cadence: SELFIE handheld | STATIC locked-off | MIXED, switching per cut].
Story: [one sentence: what happens across the cuts]. [persona sentence]. [register line].
Cut 1 (0-1.9s) [DISTANCE, POV]: [motion already under way, each hand's job, 2 micro-reactions]. Hard cut to.
Cut 2 (1.9-3.8s) [DISTANCE, POV]: [...]. Hard cut to.
... one cut per slot ...
Cut N (x-end) [DISTANCE, POV]: [...].
Setting: [room, light direction, the few props in the board].
Audio: [She|He] speaks to camera, phone-mic sound with natural room tone[, accent line]: "[the line, verbatim]"
[Music: only if asked — genre, low under the voice, no lyrics.]
Clear undistorted face, same outfit throughout, [camera tail]. No on-screen text, no subtitles, no watermark, no brand logos except the product's own label, no bokeh, no film grain, no slow motion, no beauty filter, no extra hands or limbs, no mirrors.
```

- **Cuts = slots**, in board order. Split the duration evenly (8 cuts: about 1 s each at
  8 s, 1.25 s at 10 s, 1.5 s at 12 s, 1.9 s at 15 s; 4 cuts: a quarter each); the spans
  add up exactly to the clip length. `Hard cut to.` between every pair, none after the
  last.
- **Never** let two neighbouring cuts share both POV and distance — that morphs.
- **Register line**: natural (default) — "a natural, engaged creator, real reactions,
  lively but never screaming"; hyped only on hype signals; omit for calm briefs.
- **Camera tail**: selfie-only "slight handheld shake from her grip"; static-only "camera
  locked off, no movement at all"; mixed "handheld in selfie cuts, locked off in static
  cuts". Never write handheld, shake, drift or sway inside a static cut.
- **Selfie cuts**: the camera IS the phone. Never show the phone, its screen, a
  reflection or someone looking at a phone. An arm at the frame edge is fine.

## Per-cut writing

- Frame one is already moving and the first word lands within 0.4 s. The only allowed
  delays: the frozen-reaction hook (≤ 0.7 s) and a product cold open (first words on the
  cut into Cut 2).
- Each cut: the motion that happens during it, each hand's job (≤ 2 roles), two or three
  micro-reactions from the register (grin breaking, quick nod, laugh through the nose,
  lean toward the lens), and the product position when present.
- Expressions change across cuts; never the same twice. One honest peak, paired with a
  body movement, on the reveal or result. One small unguarded beat per clip (a glance
  away and back, a self-correction). One playful beat unless the brief is calm or
  luxurious.
- Product actions: one per cut (one press, one swipe, one sip). If it starts closed, the
  cap comes off as its own motion before any use; afterwards the cap is never mentioned
  again and never goes back on. Apply to the right place — perfume to wrist or neck,
  lipstick to lips, cream via fingertip, drinks to the mouth. Never "again",
  "repeatedly" or "back and forth".
- Closing clip: the last cut ends mid-motion, loop-ready. A pick-up move (she reaches
  past the lens and the frame lifts into a close selfie) may replace the final
  `Hard cut to.` when that boundary goes static → selfie with no state change.

## Audio line

- The line exactly as written in the monologue step — never reworded here.
- A clip that opens a video may start with one or two bracketed sounds, e.g.
  `[*soft laugh*] [*quick gasp*]` (natural) — none for calm briefs, none in later parts.
- Lips need rest: leave at least one beat with the mouth closed between phrases.
- An accent, when opted in, is described with strong qualities in the Audio line and the
  tail adds "no neutral or generic accent".
- No "silent" switch exists: for wordless shapes write "no voice, no music, only the
  named sounds" and tell the user the clip may still carry ambient sound.

## One-shot structure (i2v and website)

```text
One continuous shot, no cuts. Vertical 9:16, medium shot, the creator filling about two thirds of the frame, head centred, eyes to the lens, phone propped up at a [real home spot], natural light.
[persona sentence]. Talking to camera with natural hand gestures, [accent], pace varying between quicker connecting phrases and slower key words, about 2.5 words per second.
Audio: phone-mic voice with the room's own quiet ambience, no music: "[the line, verbatim]"
[Format-specific bans.] Clear undistorted face, consistent outfit, no on-screen text, no subtitles, no extra hands.
```

## Pre-submit check (rewrite once on any failure)

- ≤ 2,000 characters;
- every attached `@ImageN` declared, in flag order;
- cut count = slot count, spans sum to the duration, `Hard cut to.` count = cuts − 1;
  one-shot prompts contain no "cut", "slot" or "board";
- the line matches the monologue verbatim; no banned opener or phrase; no claim outside
  `approved_claims`;
- no static cut contains motion words; no selfie cut mentions the phone;
- format bans present (see the profile).
