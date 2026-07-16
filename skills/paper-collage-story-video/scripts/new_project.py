#!/usr/bin/env python3
"""Copy the bundled Remotion template into a new project directory."""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--name", default="paper-collage-story-video")
    args = parser.parse_args()

    template = Path(__file__).resolve().parents[1] / "assets" / "remotion-template"
    output = args.output.expanduser().resolve()
    if not template.is_dir():
        raise SystemExit(f"Template not found: {template}")
    if output.exists():
        raise SystemExit(f"Refusing to overwrite existing path: {output}")

    shutil.copytree(template, output)
    package_path = output / "package.json"
    package = json.loads(package_path.read_text(encoding="utf-8"))
    package["name"] = args.name
    package_path.write_text(
        json.dumps(package, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Created Remotion project: {output}")


if __name__ == "__main__":
    main()
