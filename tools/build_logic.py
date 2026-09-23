#!/usr/bin/env python3
"""Consolidate the GLG engine into a single self-contained logic file.

Inputs:
  - tools/data/glg-data.json            (extracted data bundle -> GLG_DATA)
  - tools/enginejs/engine-hash.js
  - tools/enginejs/engine-core.js
  - tools/enginejs/engine-spdx.js
  - tools/enginejs/engine-compat.js
  - tools/enginejs/engine-validate.js
  - tools/enginejs/engine-export.js

Output:
  - tools/glg-logic.js   (single file: GLG_DATA embedded + one GLGEngine namespace)
"""
import io
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(HERE, "data", "glg-data.json")
SRC_DIR = os.path.join(HERE, "enginejs")
OUT_PATH = os.path.join(HERE, "glg-logic.js")

# Load order: hash first (other modules use NS.Hashing at runtime), then core
# (ClauseDatabase/LicenseCompiler), then spdx, compat, validate, export.
ORDER = [
    "engine-hash.js",
    "engine-core.js",
    "engine-spdx.js",
    "engine-compat.js",
    "engine-validate.js",
    "engine-export.js",
]

# Minimal JSON-to-ES5 declaration. We do a small amount of hardening for `</script>`
# safety when this later gets inlined into index.html.
def js_string(value) -> str:
    s = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    s = s.replace("</", "<\\/")
    return s


def build() -> None:
    with io.open(DATA_PATH, "r", encoding="utf-8") as fh:
        data = json.load(fh)

    name = data.get("title", "GLG")
    version = data.get("version", "1.0.0")
    description = data.get("description", "")

    header = (
        "/* GLG logic bundle\n"
        " * ===============\n"
        " * Name: %s\n"
        " * Version: %s\n"
        " * Description: %s\n"
        " *\n"
        " * Self-contained single-file port of the GLG (Granular License\n"
        " * Generator) Rust engine. Runs fully offline in-browser.\n"
        " *\n"
        " * Depends on: nothing. Declares global `GLG_DATA` and `GLGEngine`.\n"
        " */\n" % (name, version, description)
    )

    parts = [header]
    parts.append("var GLG_DATA = %s;\n" % js_string(data))

    for fname in ORDER:
        path = os.path.join(SRC_DIR, fname)
        with io.open(path, "r", encoding="utf-8") as fh:
            content = fh.read().rstrip() + "\n"
        parts.append("// ---- %s ----" % fname)
        parts.append(content)

    body = "\n".join(parts) + "\n"

    with io.open(OUT_PATH, "w", encoding="utf-8") as fh:
        fh.write(body)

    print("Wrote %s (%.1f KB)" % (os.path.relpath(OUT_PATH, HERE), len(body.encode("utf-8")) / 1024.0))


if __name__ == "__main__":
    try:
        build()
    except Exception:
        print("ERROR: build failed", file=sys.stderr)
        raise