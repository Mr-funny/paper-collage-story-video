#!/usr/bin/env python3
"""Validate narrative timing, assets, and sticker entrance semantics."""

from __future__ import annotations

import argparse
import json
from collections import defaultdict
from pathlib import Path


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("project", type=Path)
    parser.add_argument("--allow-placeholder", action="store_true")
    args = parser.parse_args()

    project = args.project.expanduser().resolve()
    public = project / "public"
    story_path = public / "story" / "story.json"
    captions_path = public / "story" / "captions.json"
    story = json.loads(story_path.read_text(encoding="utf-8"))
    captions = json.loads(captions_path.read_text(encoding="utf-8"))
    errors: list[str] = []

    duration_frames = int(story.get("durationInFrames", 0))
    fps = int(story.get("fps", 0))
    if duration_frames <= 0 or fps <= 0:
        fail(errors, "durationInFrames and fps must be positive")
    duration_ms = duration_frames / max(fps, 1) * 1000
    scenes = story.get("scenes", [])
    if len(scenes) < 2:
        fail(errors, "Use at least two scenes for a narrative video")

    sticker_ids: set[str] = set()
    for scene in scenes:
        scene_id = scene.get("id", "<unnamed>")
        start = int(scene.get("startFrame", -1))
        length = int(scene.get("durationInFrames", 0))
        if start < 0 or length <= 0 or start + length > duration_frames + 12:
            fail(errors, f"Scene {scene_id}: invalid frame range")
        background = scene.get("background", "")
        if not background:
            fail(errors, f"Scene {scene_id}: missing background")
        elif "placeholder" in background and not args.allow_placeholder:
            fail(errors, f"Scene {scene_id}: replace placeholder background")
        elif not (public / background).is_file():
            fail(errors, f"Scene {scene_id}: background not found: {background}")

        by_frame: dict[int, list[dict]] = defaultdict(list)
        for sticker in scene.get("stickers", []):
            sticker_id = sticker.get("id", "")
            if not sticker_id or sticker_id in sticker_ids:
                fail(errors, f"Scene {scene_id}: missing or duplicate sticker id {sticker_id!r}")
            sticker_ids.add(sticker_id)
            src = sticker.get("src", "")
            if "sheet" in Path(src).stem.lower():
                fail(errors, f"Sticker {sticker_id}: source sheets cannot appear in the composition")
            if "placeholder" in src and not args.allow_placeholder:
                fail(errors, f"Sticker {sticker_id}: replace placeholder asset")
            elif not (public / src).is_file():
                fail(errors, f"Sticker {sticker_id}: file not found: {src}")
            entry = int(sticker.get("entryFrame", -1))
            if entry < 0 or entry >= length:
                fail(errors, f"Sticker {sticker_id}: invalid entryFrame")
            by_frame[entry].append(sticker)

        ordered_frames = sorted(by_frame)
        for previous, current in zip(ordered_frames, ordered_frames[1:]):
            if current - previous < 8:
                fail(errors, f"Scene {scene_id}: unrelated entrances at {previous} and {current} are too rushed")
        for entry, stickers in by_frame.items():
            if len(stickers) == 1:
                continue
            groups = {sticker.get("entranceGroup") for sticker in stickers}
            if len(stickers) != 2 or len(groups) != 1 or None in groups or "" in groups:
                fail(errors, f"Scene {scene_id}: frame {entry} may only contain one named symmetrical pair")

    previous_end = 0
    for index, caption in enumerate(captions):
        start = int(caption.get("startMs", -1))
        end = int(caption.get("endMs", -1))
        text = str(caption.get("text", "")).strip()
        if not text or start < 0 or end <= start or end > duration_ms + 40:
            fail(errors, f"Caption {index + 1}: invalid text or timing")
        if start < previous_end:
            fail(errors, f"Caption {index + 1}: captions overlap")
        if index and start - previous_end > 350:
            fail(errors, f"Caption {index + 1}: unexplained caption gap exceeds 350 ms")
        previous_end = end
    if captions and duration_ms - previous_end > 350:
        fail(errors, "Final caption ends too early")

    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        raise SystemExit(1)
    print(
        f"Story validation passed: {len(scenes)} scenes, {len(captions)} captions, "
        f"{len(sticker_ids)} independent stickers"
    )


if __name__ == "__main__":
    main()
