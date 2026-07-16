#!/usr/bin/env python3
"""Split a strict green-screen grid into complete transparent PNG stickers."""

from __future__ import annotations

import argparse
import json
import shutil
import struct
import subprocess
from pathlib import Path


def png_size(path: Path) -> tuple[int, int]:
    header = path.read_bytes()[:24]
    if len(header) < 24 or header[:8] != b"\x89PNG\r\n\x1a\n":
        raise SystemExit("Sticker sheets must be PNG files")
    return struct.unpack(">II", header[16:24])


def run_ffmpeg(ffmpeg: str, source: Path, destination: Path, filtergraph: str) -> None:
    command = [
        ffmpeg,
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        str(source),
        "-vf",
        filtergraph,
        "-frames:v",
        "1",
        str(destination),
    ]
    subprocess.run(command, check=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--rows", required=True, type=int)
    parser.add_argument("--cols", required=True, type=int)
    parser.add_argument("--names", required=True, help="Comma-separated output stems in grid order")
    parser.add_argument("--sheet-output", type=Path)
    parser.add_argument("--similarity", type=float, default=0.18)
    parser.add_argument("--blend", type=float, default=0.06)
    parser.add_argument("--key-color", default="00ff00", help="Six-digit RGB hex key color")
    parser.add_argument("--ffmpeg", help="FFmpeg executable path")
    args = parser.parse_args()

    source = args.input.expanduser().resolve()
    if args.rows <= 0 or args.cols <= 0:
        raise SystemExit("--rows and --cols must be positive")
    names = [part.strip() for part in args.names.split(",")]
    expected = args.rows * args.cols
    if len(names) != expected or any(not name for name in names):
        raise SystemExit(f"Expected exactly {expected} non-empty names in grid order")
    ffmpeg = args.ffmpeg or shutil.which("ffmpeg")
    if not ffmpeg:
        raise SystemExit("FFmpeg not found; pass its full path with --ffmpeg")

    width, height = png_size(source)
    args.output.mkdir(parents=True, exist_ok=True)
    key_color = args.key_color.lower().removeprefix("#").removeprefix("0x")
    if len(key_color) != 6 or any(char not in "0123456789abcdef" for char in key_color):
        raise SystemExit("--key-color must be a six-digit RGB hex value")
    base_filter = f"chromakey=0x{key_color}:{args.similarity}:{args.blend},format=rgba"
    if args.sheet_output:
        sheet_output = args.sheet_output.expanduser().resolve()
        sheet_output.parent.mkdir(parents=True, exist_ok=True)
        run_ffmpeg(ffmpeg, source, sheet_output, base_filter)

    manifest = []
    for row in range(args.rows):
        for col in range(args.cols):
            index = row * args.cols + col
            left = round(col * width / args.cols)
            right = round((col + 1) * width / args.cols)
            top = round(row * height / args.rows)
            bottom = round((row + 1) * height / args.rows)
            cell_width = right - left
            cell_height = bottom - top
            destination = args.output / f"{names[index]}.png"
            filtergraph = (
                f"crop={cell_width}:{cell_height}:{left}:{top},"
                f"{base_filter}"
            )
            run_ffmpeg(ffmpeg, source, destination, filtergraph)
            manifest.append(
                {
                    "file": destination.name,
                    "grid": [row, col],
                    "box": [left, top, right, bottom],
                }
            )
            print(f"Wrote {destination.name} from row {row + 1}, column {col + 1}")

    (args.output / "stickers-manifest.json").write_text(
        json.dumps(
            {
                "source": str(source),
                "grid": [args.rows, args.cols],
                "similarity": args.similarity,
                "blend": args.blend,
                "keyColor": key_color,
                "stickers": manifest,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
