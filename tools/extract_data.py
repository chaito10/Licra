#!/usr/bin/env python3
"""Extract GLG data from Rust sources into a single JSON bundle.

Pulls:
  - questionnaire.rs  -> questions (Rust struct literals -> JSON)
  - clauses.rs        -> CLAUSES_JSON (verbatim, parsed)
  - spdx.rs           -> EMBEDDED_SPDX_JSON (verbatim, parsed)
  - compatibility.rs  -> COMPATIBILITY_JSON (verbatim, parsed)
"""
import json
import re
import sys
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent / "src"
OUT = Path(__file__).resolve().parent.parent / "tools" / "data"


def rust_str_unescape(s):
    """Unescape the *contents* of a Rust string literal (no surrounding quotes)."""
    out = []
    i = 0
    n = len(s)
    while i < n:
        c = s[i]
        if c == "\\" and i + 1 < n:
            nxt = s[i + 1]
            mapping = {"n": "\n", "t": "\t", "r": "\r", '"': '"', "\\": "\\", "0": "\0"}
            if nxt in mapping:
                out.append(mapping[nxt])
                i += 2
                continue
            if nxt == "u" and i + 3 < n and s[i + 2] == "{":
                j = i + 3
                while j < n and s[j] != "}":
                    j += 1
                try:
                    out.append(chr(int(s[i + 3 : j], 16)))
                except ValueError:
                    out.append(s[i : j + 1])
                i = j + 1
                continue
            # unknown escape: keep both chars (best effort)
            out.append(nxt)
            i += 2
            continue
        out.append(c)
        i += 1
    return "".join(out)


def extract_raw_str(src_text, const_name):
    """Extract a `const NAME: &str = r#"..."#;` raw string."""
    start = src_text.index(const_name)
    marker = src_text.index('r#"', start) + 3
    end = src_text.index('"#', marker)
    return src_text[marker:end]


class RustStrScanner:
    """Scan text tracking brace/bracket depth while respecting Rust string literals."""

    def __init__(self, text):
        self.text = text

    def find_block(self, start_idx, open_ch, close_ch):
        """Return (content, end_idx_of_close) for the balanced block starting at start_idx
        where text[start_idx] == open_ch."""
        depth = 0
        i = start_idx
        n = len(self.text)
        in_str = False
        while i < n:
            c = self.text[i]
            if in_str:
                if c == "\\":
                    i += 2
                    continue
                if c == '"':
                    in_str = False
                i += 1
                continue
            if c == '"':
                in_str = True
                i += 1
                continue
            if c == open_ch:
                depth += 1
            elif c == close_ch:
                depth -= 1
                if depth == 0:
                    return self.text[start_idx + 1 : i], i
            i += 1
        raise ValueError("unbalanced block")


def parse_answer_value(expr):
    """Parse an AnswerValue expression into serde-style JSON."""
    expr = expr.strip()
    if not expr.startswith("AnswerValue::"):
        raise ValueError("not AnswerValue: " + expr)
    inner = expr[len("AnswerValue::") :]
    m = re.match(r"(\w+)\((.*)\)$", inner, re.S)
    if not m:
        raise ValueError("bad AnswerValue expr: " + expr)
    variant, args = m.group(1), m.group(2)
    if variant == "Boolean":
        return {"Boolean": args.strip() == "true"}
    if variant == "Number":
        return {"Number": int(args.strip())}
    if variant == "Text":
        m2 = re.match(r'"(.*)".into\(\)', args.strip(), re.S)
        return {"Text": rust_str_unescape(m2.group(1)) if m2 else ""}
    if variant == "Choice":
        m2 = re.match(r'"(.*)".into\(\)', args.strip(), re.S)
        return {"Choice": rust_str_unescape(m2.group(1)) if m2 else ""}
    if variant == "Date":
        m2 = re.match(r'"(.*)".into\(\)', args.strip(), re.S)
        return {"Date": rust_str_unescape(m2.group(1)) if m2 else ""}
    if variant == "MultiChoice":
        # args -> vec!["a".into(), "b".into()]
        items = []
        for m2 in re.finditer(r'"(.*?)"\.into\(\)', args, re.S):
            items.append(rust_str_unescape(m2.group(1)))
        return {"MultiChoice": items}
    raise ValueError("unknown AnswerValue variant: " + variant)


def split_top_level(s, sep=","):
    """Split a string on top-level sep (outside quotes/brackets/braces)."""
    parts = []
    depth = 0
    cur = []
    in_str = False
    i = 0
    n = len(s)
    while i < n:
        c = s[i]
        if in_str:
            cur.append(c)
            if c == "\\":
                cur.append(s[i + 1])
                i += 2
                continue
            if c == '"':
                in_str = False
            i += 1
            continue
        if c == '"':
            in_str = True
            cur.append(c)
            i += 1
            continue
        if c in "([{":
            depth += 1
        elif c in ")]}":
            depth -= 1
        if c == sep and depth == 0:
            parts.append("".join(cur))
            cur = []
            i += 1
            continue
        cur.append(c)
        i += 1
    parts.append("".join(cur))
    return [p.strip() for p in parts]


def parse_question_block(block):
    fields = {}
    for part in split_top_level(block, ","):
        if not part or ":" not in part:
            continue
        key, _, value = part.partition(":")
        key = key.strip()
        value = value.strip()
        if key in ("id", "title", "description", "tooltip", "help_text", "legal_implications"):
            m = re.match(r'"(.*)"\.into\(\)', value, re.S)
            fields[key] = rust_str_unescape(m.group(1)) if m else value
        elif key == "category":
            m = re.match(r"QuestionCategory::(\w+)", value)
            fields["category"] = m.group(1) if m else value
        elif key == "recommended_answer":
            fields["recommended_answer"] = parse_answer_value(value)
        elif key == "question_type":
            m = re.match(r"QuestionType::(\w+)", value)
            fields["question_type"] = m.group(1) if m else value
        elif key == "options":
            scanner = RustStrScanner(value)
            open_idx = value.index("[") if "[" in value else -1
            if open_idx == -1:
                fields["options"] = []
                continue
            _, end = scanner.find_block(open_idx, "[", "]")
            inner = value[open_idx + 1 : end]
            opts = []
            depth = 0
            i = 0
            in_str = False
            n = len(inner)
            starts = []
            while i < n:
                c = inner[i]
                if in_str:
                    if c == "\\":
                        i += 1
                    elif c == '"':
                        in_str = False
                    i += 1
                    continue
                if c == '"':
                    in_str = True
                    i += 1
                    continue
                if c == "{":
                    if depth == 0:
                        starts.append(i)
                    depth += 1
                elif c == "}":
                    depth -= 1
                    if depth == 0 and starts:
                        seg = inner[starts.pop() + 1 : i]
                        vals = {}
                        for f in split_top_level(seg, ","):
                            if ":" not in f:
                                continue
                            k, _, v = f.partition(":")
                            m2 = re.match(r'"(.*)"\.into\(\)', v.strip(), re.S)
                            vals[k.strip()] = rust_str_unescape(m2.group(1)) if m2 else ""
                        opts.append(vals)
                i += 1
            fields["options"] = opts
        elif key == "visible_if":
            if value == "none()":
                fields["visible_if"] = None
            else:
                m = re.match(r"vis_(eq|neq|gt|contains)\(([^,]+),\s*(.*)\)$", value, re.S)
                if not m:
                    raise ValueError("bad visible_if: " + value)
                op_map = {
                    "eq": "Equals",
                    "neq": "NotEquals",
                    "gt": "GreaterThan",
                    "lt": "LessThan",
                    "contains": "Contains",
                }
                qid = m.group(2).strip().split(".")[0].strip('"')
                fields["visible_if"] = {
                    "question_id": qid,
                    "operator": op_map[m.group(1)],
                    "value": parse_answer_value(m.group(3)),
                }
        elif key == "weight":
            fields["weight"] = int(value.strip())
    return fields


def parse_questions(text):
    marker = "questions: vec!["
    open_idx = text.index(marker) + len(marker) - 1  # points at '['
    # the vec closes at the `],` before `}` belonging to default()
    scanner = RustStrScanner(text)
    _, end = scanner.find_block(open_idx, "[", "]")
    body = text[open_idx + 1 : end]
    # split into Question { ... } blocks at brace depth 0
    blocks = []
    depth = 0
    i = 0
    n = len(body)
    in_str = False
    cur_start = None
    while i < n:
        c = body[i]
        if in_str:
            if c == "\\":
                i += 2
                continue
            if c == '"':
                in_str = False
            i += 1
            continue
        if c == '"':
            in_str = True
            i += 1
            continue
        if c == "{":
            if depth == 0:
                cur_start = i
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0 and cur_start is not None:
                blocks.append(body[cur_start + 1 : i])
                cur_start = None
        i += 1
    questions = []
    for b in blocks:
        if b.lstrip().startswith("Question"):
            b = b[len("Question") :].lstrip()
            if b.startswith("{"):
                b = b[1:]
        questions.append(parse_question_block(b))
    return questions


def load_json_str(raw):
    return json.loads(raw)


def main():
    q_text = (SRC / "questionnaire.rs").read_text(encoding="utf-8")
    cl_text = (SRC / "clauses.rs").read_text(encoding="utf-8")
    sp_text = (SRC / "spdx.rs").read_text(encoding="utf-8")
    co_text = (SRC / "compatibility.rs").read_text(encoding="utf-8")

    questions = parse_questions(q_text)
    clauses = load_json_str(extract_raw_str(cl_text, "CLAUSES_JSON"))
    spdx = load_json_str(extract_raw_str(sp_text, "EMBEDDED_SPDX_JSON"))
    compat = load_json_str(extract_raw_str(co_text, "COMPATIBILITY_JSON"))

    bundle = {
        "version": "1.0.0",
        "title": "Granular License Generator Questionnaire",
        "description": ("A comprehensive 300+ question questionnaire for generating precise, "
                        "granular software licenses."),
        "questions": questions,
        "clauses": clauses,
        "spdx": spdx,
        "compatibility": compat,
    }

    OUT.mkdir(parents=True, exist_ok=True)
    out_path = OUT / "glg-data.json"
    out_path.write_text(json.dumps(bundle, indent=None), encoding="utf-8")

    # compact inventory for building the id->key mapping
    inv_lines = []
    for q in questions:
        inv_lines.append(f'{q["id"]}\t{q["category"]}\t{q["question_type"]}\t{q["title"]}')
    (OUT / "question_inventory.tsv").write_text("\n".join(inv_lines) + "\n", encoding="utf-8")

    print(f"questions: {len(questions)}")
    print(f"clauses:   {len(clauses)}")
    print(f"spdx:      {len(spdx)}")
    cats = {}
    for q in questions:
        cats.setdefault(q["category"], 0)
        cats[q["category"]] += 1
    print(f"categories: {len(cats)}")
    for k in sorted(cats):
        print(f"  {k}: {cats[k]}")
    matrix = compat.get("matrix", {})
    print(f"compat matrix: {len(matrix)} entries")
    missing = [q["id"] for q in questions if not q.get("id")]
    print(f"questions missing id: {len(missing)}")
    print(f"wrote {out_path}")


if __name__ == "__main__":
    main()