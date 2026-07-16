---
name: paper-collage-story-video
description: Create short narrative paper-collage videos from a topic using ImageGen assets and Remotion. Use when the user asks to turn a historical event, biography, cultural subject, educational topic, or story prompt into a Chinese paper-cut or scrapbook-style video with explanatory captions, clean scene backgrounds, complete independent sticker cutouts, story-driven entrances, and a silent MP4; also use when adapting the established Tang-dynasty or Zheng He collage workflow.
---

# Paper Collage Story Video

Create the story before creating the images. Make every visual entrance support the active caption.

## Load supporting skills

- Load `imagegen` before generating or editing raster assets.
- Load `remotion-best-practices` before authoring, previewing, or rendering the video.
- Read [references/story-and-timing.md](references/story-and-timing.md) before writing the story JSON.
- Read [references/image-prompts.md](references/image-prompts.md) before generating assets.

## Defaults

Unless the user specifies otherwise, produce:

- 1920×1080, 30 fps, 12 seconds, H.264 MP4.
- No audio track.
- Three scenes and six Chinese explanatory captions.
- One clean background and one sticker sheet per scene.
- Two to four complete independent stickers per scene.

## Workflow

1. **Plan the narrative.** Write a factual three-act outline and six captions before generating images. Give each caption one clear narrative job. Avoid decorative copy that does not explain what happened.
2. **Create the project.** Copy the bundled Remotion project:

   ```bash
   python3 scripts/new_project.py --output /absolute/path/to/project --name topic-story-video
   ```

3. **Write the data files.** Replace `public/story/story.json` and `public/story/captions.json`. Keep captions in the Remotion `Caption` JSON shape. Use the schema and cadence in the story reference.
4. **Generate each scene background.** Generate an empty environment with no people, animals, vehicles, foreground story objects, logos, or readable text. Preserve open staging space.
5. **Generate each sticker sheet.** Use a pure `#00ff00` background, or pure `#ff00ff` when an important subject is green. Require complete non-touching objects, thick white sticker outlines, and large uninterrupted key-color gaps. Generate each logical object as one whole sticker.
6. **Recover ImageGen output when needed.** The built-in image tool can store PNG base64 in Codex session JSONL records. Recover it without printing the base64:

   ```bash
   python3 scripts/recover_imagegen.py /absolute/path/to/session.jsonl /absolute/path/to/raw-assets --last 6
   ```

7. **Remove green and split stickers.** Use the same strict grid requested in the prompt. The script relies only on FFmpeg and keeps every cell as one independent transparent PNG:

   ```bash
   python3 scripts/prepare_stickers.py sheet.png output-dir \
     --rows 2 --cols 2 --names hero,assistant,object,emblem \
     --key-color 00ff00 --sheet-output sheet-alpha.png
   ```

8. **Assemble the story.** Put each generated PNG into `public/assets/story/` and describe its placement and entrance in `story.json`.
9. **Enforce entrance semantics.** Give ordinary stickers different `entryFrame` values so they enter one by one. Allow the same entry frame only for a genuinely symmetrical pair, and give that pair the same non-empty `entranceGroup`.
10. **Validate before rendering.** Run:

   ```bash
   python3 scripts/validate_story.py /absolute/path/to/project
   pnpm run lint
   pnpm run stills
   ```

11. **Inspect keyframes.** Check at least one frame per scene. Confirm every sticker is a complete object, no source sheet is visible, captions remain in the bottom safe area, and entrances match the active caption. Fix the composition before rendering.
12. **Render and verify.** Run `pnpm run render`. Use Remotion FFprobe to confirm dimensions, 30 fps, duration, H.264, and exactly one video stream with no audio stream.

## Non-negotiable composition rules

- Never animate clip-path slices of a shared sticker sheet.
- Never place the whole sticker sheet in the final composition.
- Never let two unrelated stickers enter at the same time.
- Keep each person, ship, animal, prop, or emblem in its own transparent PNG.
- Let the subtitle explain the event; let the sticker entrance illustrate that sentence.
- Use a stamped/pressed scale-and-opacity entrance for titles and captions, not a generic sliding lower third.
- Preserve reading time. If the captions feel rushed, lengthen the video or simplify the sentences.
- Do not add audio unless the user explicitly requests it.

## Deliverables

Return the final silent MP4, one representative preview image, the caption JSON, the story JSON, the asset prompt record, and the project directory.
