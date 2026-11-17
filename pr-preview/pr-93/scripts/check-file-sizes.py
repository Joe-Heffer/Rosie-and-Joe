#!/usr/bin/env python3
"""Fail if any tracked file exceeds its size budget.

Images are capped at 600 KB, other files at 200 KB. cake/ is a bundled
artifact outside site maintenance and is skipped. To fix an oversized image,
resize it to the largest size it is displayed at and quantise or re-encode it
(for example, a 256-colour PNG, or a JPEG at quality ~80).
"""
import subprocess
import sys
from pathlib import Path

KB = 1024
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif"}
IMAGE_LIMIT = 600 * KB
OTHER_LIMIT = 200 * KB
EXCLUDED_PREFIXES = ("cake/",)


def main():
    out = subprocess.run(
        ["git", "ls-files"], capture_output=True, text=True, check=True
    ).stdout.splitlines()
    failures = []
    for f in out:
        if f.startswith(EXCLUDED_PREFIXES) or not Path(f).is_file():
            continue
        size = Path(f).stat().st_size
        limit = IMAGE_LIMIT if Path(f).suffix.lower() in IMAGE_EXTS else OTHER_LIMIT
        if size > limit:
            failures.append((f, size, limit))
    if failures:
        print("Files over their size budget:")
        for f, size, limit in failures:
            print(f"  {f}: {size / KB:.0f} KB (limit {limit // KB} KB)")
        sys.exit(1)
    print("All tracked files are within their size budgets.")


if __name__ == "__main__":
    main()
