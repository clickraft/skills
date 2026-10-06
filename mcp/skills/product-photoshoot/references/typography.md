# Typography: the three-case rule

By default the model composes the whole frame. Asking it to "leave empty space"
backfires: it paints a flat colored band or a dull gradient strip, and that always looks
wrong. So text handling follows exactly three cases.

## Case 1 — the user gave exact words for the image

The user quoted the text ("headline: 'New Drop'", "add 'Sale ends Friday'"). Put the
words straight into the prompt as part of the scene. Keep them verbatim, in the user's
language and spelling, inside double quotes.

```
[TYPOGRAPHY]
The words "New Drop" appear as integrated typography in the scene, set in
{{bold grotesque sans / refined high-contrast serif / hand-lettered script / clean
geometric sans}}, placed {{where it sits naturally — on a wall sign, across the sky,
printed on a card, beside the product}}, in a color that reads clearly against its
background.
```

Short text renders best: keep it to a few words per image. Longer copy is better added
by the user afterwards (Case 2).

## Case 2 — the user will add text later

Only when the user says so explicitly ("I'll add the headline in Figma", "need room for
copy", "leave space for the CTA"):

```
[COMPOSITION FOR TEXT OVERLAY]
Keep one region of the frame quiet and tonally even — a soft gradient of sky, a
defocused background, a smooth stretch of surface — so text can be laid over it later.
That region still belongs to the scene; it is not an empty box.
```

Also add the overlay-space lines from `negative-prompts.md`. Never use phrases like
"blank negative space" or "reserved white area" — they invite the flat band.

## Case 3 — the user said nothing about text (default)

Do not mention text, captions or overlay areas at all. Let the model fill the frame.
