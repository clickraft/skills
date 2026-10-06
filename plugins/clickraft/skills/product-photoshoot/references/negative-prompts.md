# Negative prompts

Every prompt ends with ONE `[AVOID]` block. Build it from the universal list plus the
conditional lists that apply, plus the mode-specific lines in the mode file. Merge, do
not repeat phrases.

## Universal — always

```
[AVOID]
no AI artifacts, no smeared or warped lettering, no invented words in the image,
no plastic or waxy surfaces, no cartoon rendering,
no extra or fused fingers, no extra limbs, no melting geometry, no duplicated objects,
no overcooked HDR, no halos, no oversharpening,
no flat fluorescent light, no harsh on-camera flash (unless the look calls for it),
no stock-photo posing, no cliché layouts,
no unrelated logos, no watermarks, no signatures,
no artificial sheen on skin or hair, no doll-like faces, no airbrushing,
no flat solid bands, no empty rectangles, no dead gradient patches that do not belong
to the scene.
```

## People in frame — add when hands, faces or bodies appear

```
no uncanny faces, no distorted facial structure, no mismatched eyes,
no extra teeth, no melted features, no broken fingers or hands,
no plastic or orange skin, no over-smoothed retouch,
no glassy doll eyes, no misplaced features, no rubbery skin,
no warped glasses or jewelry, no stiff unnatural posture.
```

## Labels and branding — add when the product carries text or a logo

```
no distorted label text, no scrambled letters, no made-up brand names,
no melted type, no doubled labels, no invented logos.
```

## Stock feel — add for ad, hero-banner and lifestyle work

```
no generic stock-photo look, no synthetic catalog feel,
no over-staged arrangement, no impossibly spotless rooms,
no forced symmetry where real life would be uneven,
no clip-art, no flat illustration mixed into the photo,
no visibly pasted-in background.
```

## Aesthetic mixing — add for restyle

```
commit fully to the new look: no half-finished transformation,
no blend of two aesthetics, no original styling leaking through unchanged.
```

## Overlay space — add only for typography Case 2

```
the calm area is part of the actual scene — sky, defocused background, surface
texture or atmospheric falloff — never a hard-edged solid block, never an artificial
strip, never an empty zone that looks cropped in from elsewhere.
```

## Assembly order

1. Universal (always)
2. People in frame (hands, faces, bodies)
3. Labels and branding (visible label or logo)
4. Stock feel (ad-creative-pack, hero-banner, lifestyle-scene, pinterest-pin, carousel)
5. Aesthetic mixing (restyle)
6. Overlay space (user said they will add text afterwards)
7. Mode-specific lines from the mode file
