# Image generation prompts

Keep one consistent art direction across all scenes:

> Chinese historical paper collage, colored woodblock print, ink linework, visible xuan-paper fibers, hand-torn paper edges, restrained vermilion and mineral pigments, editorial museum illustration, cinematic 16:9 composition, no photorealism.

## Background prompt template

```text
[time and place], [architecture and landscape], [weather and lighting].
Wide cinematic 16:9 environment plate with open foreground and center staging space.
Chinese historical paper collage, colored woodblock print, ink linework,
visible xuan-paper fibers and torn-paper borders.
No people, no animals, no ships or foreground story objects, no logos,
no captions, no readable text, no watermark.
```

Generate a background separately for every scene. Remove anything that should later animate as a sticker.

## Sticker-sheet prompt template

```text
Exactly four complete independent die-cut stickers on a pure solid #00ff00 background.
Strict 2×2 grid, one object centered in each cell: [object 1], [object 2],
[object 3], [object 4]. Every object is fully visible from edge to edge and has
one continuous thick white sticker outline. Objects and white outlines never touch,
overlap, crop, or cast shadows onto another cell. Large uninterrupted green gaps.
No environment, no scenery, no labels, no frame, no extra objects.
Chinese historical paper collage, colored woodblock print, ink linework,
visible xuan-paper fibers, consistent proportions and lighting.
```

Use fewer objects rather than allowing crowding. If an object contains multiple parts that must move together, require one continuous white outline around the whole logical sticker.

Use pure `#ff00ff` instead of green when a required subject has important green clothing or materials. Pass the matching value to `prepare_stickers.py --key-color ff00ff`.

## Quality checks

- The background contains no duplicated protagonist or story prop.
- Every sticker is fully inside the image.
- White outlines do not touch.
- The green gap remains visible between all stickers.
- Each sticker has one clear narrative purpose.
- Character clothing, face, and period details remain consistent across scenes.
- Regenerate a bad sheet instead of repairing a cropped or merged object with clip paths.

## Prompt record

Save the final prompts in `ASSET_PROMPTS.md` inside the generated project. Record the scene number, background prompt, sticker prompt, and output filenames.
