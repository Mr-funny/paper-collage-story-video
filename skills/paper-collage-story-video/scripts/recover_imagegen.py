#!/usr/bin/env python3
"""Recover ImageGen base64 images from a Codex session JSONL file."""

from __future__ import annotations

import argparse
import base64
import hashlib
import json
from pathlib import Path
from typing import Any, Iterator


def walk(value: Any, path: str = "payload") -> Iterator[tuple[str, str]]:
    if isinstance(value, dict):
        for key, child in value.items():
            yield from walk(child, f"{path}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, f"{path}[{index}]")
    elif isinstance(value, str):
        yield path, value


def decode_candidate(path: str, value: str) -> tuple[bytes, str] | None:
    encoded = value
    hinted_extension = ""
    if value.startswith("data:image/") and ";base64," in value:
        header, encoded = value.split(",", 1)
        subtype = header.split("/", 1)[1].split(";", 1)[0].lower()
        hinted_extension = "jpg" if subtype == "jpeg" else subtype
    elif not path.endswith(".result"):
        return None

    try:
        data = base64.b64decode(encoded, validate=False)
    except Exception:
        return None

    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        extension = "png"
    elif data.startswith(b"\xff\xd8\xff"):
        extension = "jpg"
    elif data.startswith((b"RIFF",)) and data[8:12] == b"WEBP":
        extension = "webp"
    else:
        return None
    return data, hinted_extension or extension


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("session", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--last", type=int, default=0, help="Keep only the last N unique images")
    parser.add_argument("--prefix", default="imagegen")
    args = parser.parse_args()

    session = args.session.expanduser().resolve()
    output = args.output.expanduser().resolve()
    output.mkdir(parents=True, exist_ok=True)

    recovered: list[dict[str, Any]] = []
    seen: set[str] = set()
    with session.open("r", encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, 1):
            try:
                record = json.loads(line)
            except json.JSONDecodeError:
                continue
            payload = record.get("payload", {})
            for source_path, value in walk(payload):
                candidate = decode_candidate(source_path, value)
                if candidate is None:
                    continue
                data, extension = candidate
                digest = hashlib.sha256(data).hexdigest()
                if digest in seen:
                    continue
                seen.add(digest)
                recovered.append(
                    {
                        "data": data,
                        "extension": extension,
                        "sha256": digest,
                        "line": line_number,
                        "timestamp": record.get("timestamp"),
                        "source": source_path,
                    }
                )

    if args.last > 0:
        recovered = recovered[-args.last :]
    if not recovered:
        raise SystemExit("No unique ImageGen base64 images found")

    manifest = []
    for index, item in enumerate(recovered, 1):
        filename = f"{args.prefix}-{index:03d}.{item['extension']}"
        destination = output / filename
        destination.write_bytes(item.pop("data"))
        manifest.append({"file": filename, **item})
        print(f"Recovered {filename} from line {item['line']} ({item['source']})")

    (output / "imagegen-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


if __name__ == "__main__":
    main()
