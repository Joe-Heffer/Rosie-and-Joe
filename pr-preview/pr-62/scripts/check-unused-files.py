#!/usr/bin/env python3
"""Fail if any tracked file under images/, css/ or js/ is never referenced
from any tracked HTML/CSS/JS file (by filename or path).

cake/index.html is excluded from the source corpus, matching the rest of
the repo's tooling. Files referenced only dynamically (e.g. an SVG sprite
fragment like images/icons.svg#icon-name) are still caught because the
check matches on filename, not on the exact reference syntax.
"""
import subprocess
import sys
from pathlib import Path

EXCLUDED_SOURCES = {"cake/index.html"}
EXCLUDED_ASSETS = {"images/.gitkeep"}


def tracked_files(*patterns):
    out = subprocess.run(
        ["git", "ls-files", *patterns], capture_output=True, text=True, check=True
    )
    return [line for line in out.stdout.splitlines() if line]


def main():
    assets = [
        f
        for f in tracked_files("images", "css", "js")
        if f not in EXCLUDED_ASSETS
    ]
    sources = [
        f
        for f in tracked_files("*.html", "*.css", "*.js")
        if f not in EXCLUDED_SOURCES
    ]

    source_text = {}
    for f in sources:
        source_text[f] = Path(f).read_text(encoding="utf-8", errors="ignore")

    unused = []
    for asset in assets:
        basename = Path(asset).name
        referenced = any(
            basename in text
            for other, text in source_text.items()
            if other != asset
        )
        if not referenced:
            unused.append(asset)

    if unused:
        print("Unused files found (not referenced from any HTML/CSS/JS source):")
        for f in unused:
            print(f"  {f}")
        sys.exit(1)

    print(f"No unused files found ({len(assets)} assets checked).")


if __name__ == "__main__":
    main()
