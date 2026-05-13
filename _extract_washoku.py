# -*- coding: utf-8 -*-
"""Unpack washoku-nao-standalone.html into washoku-nao/ (run from repo root)."""
import base64
import gzip
import json
import re
import shutil
from pathlib import Path

SRC = Path(r"C:\Users\daisu\Downloads\washoku-nao-standalone.html")
OUT = Path(r"c:\Github\nao-LP\washoku-nao")


def slice_between(text: str, start_marker: str, end_marker: str) -> str:
    a = text.find(start_marker)
    if a < 0:
        raise ValueError(f"missing {start_marker!r}")
    a += len(start_marker)
    b = text.find(end_marker, a)
    if b < 0:
        raise ValueError(f"missing end after {start_marker!r}")
    return text[a:b].strip()


def sniff_extension(raw: bytes, mime: str) -> str:
    m = (mime or "").split(";")[0].strip().lower()
    if raw[:4] == b"wOF2":
        return ".woff2"
    if raw[:8] == b"\x89PNG\r\n\x1a\n":
        return ".png"
    if raw[:3] == b"\xff\xd8\xff":
        return ".jpg"
    if raw[:4] == b"RIFF" and len(raw) > 12 and raw[8:12] == b"WEBP":
        return ".webp"
    if raw[:5] == b"<?xml" or (raw.lstrip()[:1] == b"<" and b"<svg" in raw[:500]):
        return ".svg"
    if m.startswith("image/"):
        return {".png": ".png", "image/jpeg": ".jpg", "image/jpg": ".jpg"}.get(m, ".bin")
    if m.startswith("font/") or "woff" in m:
        return ".woff2" if "woff2" in m else ".woff"
    t = raw.lstrip()[:120]
    if t.startswith(b'"use strict"') or t.startswith(b"'use strict'") or t.startswith(b"(()=>"):
        return ".js"
    if b"function" in raw[:300] or b"var " in raw[:80]:
        return ".js"
    return ".bin"


def replace_uuid_refs(html: str, uuid: str, rel: str) -> str:
    """Only replace URL / src / href references, not arbitrary quoted UUIDs."""
    html = html.replace(f'url("{uuid}")', f'url("{rel}")')
    html = html.replace(f"url('{uuid}')", f"url('{rel}')")
    for attr in ("src", "href"):
        html = html.replace(f'{attr}="{uuid}"', f'{attr}="{rel}"')
        html = html.replace(f"{attr}='{uuid}'", f"{attr}='{rel}'")
    return html


def main():
    print("reading…")
    t = SRC.read_text(encoding="utf-8")
    print("chars", len(t))

    manifest = json.loads(slice_between(t, '<script type="__bundler/manifest">', "</script>"))
    ext_resources = json.loads(slice_between(t, '<script type="__bundler/ext_resources">', "</script>"))
    template = json.loads(slice_between(t, '<script type="__bundler/template">', "</script>"))

    print("assets", len(manifest), "ext map", len(ext_resources))

    id_by_uuid = {e["uuid"]: e["id"] for e in ext_resources}

    images_dir = OUT / "assets" / "images"
    fonts_dir = OUT / "assets" / "fonts"
    js_vendor = OUT / "js" / "vendor"
    for d in (images_dir, fonts_dir, js_vendor):
        d.mkdir(parents=True, exist_ok=True)

    uuid_to_rel: dict[str, str] = {}

    for uuid, entry in manifest.items():
        raw = base64.b64decode(entry["data"])
        if entry.get("compressed"):
            raw = gzip.decompress(raw)

        mime = entry.get("mime") or "application/octet-stream"
        ext = sniff_extension(raw, mime)

        logical = id_by_uuid.get(uuid)
        if logical:
            base = re.sub(r"[^a-zA-Z0-9._-]+", "_", logical) or uuid
        else:
            base = uuid

        if mime.startswith("image/") or ext in (".png", ".jpg", ".webp", ".svg"):
            sub = images_dir / f"{base}{ext}"
            rel = f"assets/images/{sub.name}"
        elif ext == ".js" or "javascript" in mime or "ecmascript" in mime:
            sub = js_vendor / f"{base}{ext}"
            rel = f"js/vendor/{sub.name}"
        else:
            sub = fonts_dir / f"{base}{ext}"
            rel = f"assets/fonts/{sub.name}"

        sub.write_bytes(raw)
        uuid_to_rel[uuid] = rel.replace("\\", "/")
        print("wrote", rel, len(raw))

    html = template
    for uuid, rel in uuid_to_rel.items():
        html = replace_uuid_refs(html, uuid, rel)

    # --- CSS: extract <style> blocks ---
    style_blocks = []
    for m in re.finditer(r"<style[^>]*>([\s\S]*?)</style>", html, re.I):
        block = m.group(1).strip()
        if block:
            style_blocks.append(block)

    full_css = "\n\n".join(style_blocks)
    html_wo_style = html
    for m in re.finditer(r"<style[^>]*>[\s\S]*?</style>", html, re.I):
        html_wo_style = html_wo_style.replace(m.group(0), "", 1)

    # Split @theme, :root, @font-face → variables.css; rest → style.css
    all_themes: list[str] = []
    all_roots: list[str] = []
    all_fonts: list[str] = []
    rest_chunks: list[str] = []
    def extract_braced_at_keyword(lines: list[str], keyword: str) -> tuple[list[str], list[str]]:
        """Pull blocks starting with @keyword { ... } into first list; return rest."""
        pulled: list[str] = []
        rest: list[str] = []
        i = 0
        while i < len(lines):
            line = lines[i]
            if re.match(rf"\s*{re.escape(keyword)}\s*{{", line):
                blk = [line]
                depth = line.count("{") - line.count("}")
                i += 1
                while i < len(lines):
                    blk.append(lines[i])
                    depth += lines[i].count("{") - lines[i].count("}")
                    i += 1
                    if depth <= 0:
                        break
                pulled.append("\n".join(blk))
                continue
            rest.append(line)
            i += 1
        return pulled, rest

    for block in style_blocks:
        lines = block.splitlines()
        root_buf: list[str] = []
        font_buf: list[str] = []
        theme_buf: list[str] = []
        rest = lines
        # :root { ... } — brace depth (single-line :root is common)
        i = 0
        tmp_rest: list[str] = []
        while i < len(rest):
            line = rest[i]
            if re.match(r"\s*:root\s*\{", line):
                rb = [line]
                depth = line.count("{") - line.count("}")
                i += 1
                while i < len(rest) and depth > 0:
                    rb.append(rest[i])
                    depth += rest[i].count("{") - rest[i].count("}")
                    i += 1
                root_buf.extend(rb)
                continue
            tmp_rest.append(line)
            i += 1
        rest = tmp_rest
        t1, rest = extract_braced_at_keyword(rest, "@theme")
        theme_buf.extend(t1)
        f1, rest = extract_braced_at_keyword(rest, "@font-face")
        font_buf.extend(f1)
        if theme_buf:
            all_themes.append("\n\n".join(theme_buf))
        if root_buf:
            all_roots.append("\n".join(root_buf))
        if font_buf:
            all_fonts.append("\n\n".join(font_buf))
        if rest:
            rest_chunks.append("\n".join(rest))

    variables_out = "\n\n".join(
        [x for x in all_themes + all_roots + all_fonts if x.strip()]
    ).strip() or "/* theme colors & fonts */\n"
    style_out = "\n\n".join(rest_chunks).strip() if rest_chunks else full_css
    if not style_out:
        style_out = full_css

    def fix_css_asset_urls(css: str) -> str:
        """css/*.css lives in css/ — assets/ must be ../assets/"""
        return (
            css.replace('url("assets/', 'url("../assets/')
            .replace("url('assets/", "url('../assets/")
        )

    variables_out = fix_css_asset_urls(variables_out)
    style_out = fix_css_asset_urls(style_out)

    # --- JS: document order, inline + external (local) → single main.js ---
    script_re = re.compile(r"<script([^>]*)>([\s\S]*?)</script>", re.I)
    main_parts: list[str] = []

    def is_http_src(val: str) -> bool:
        v = val.strip().lower()
        return v.startswith("http://") or v.startswith("https://") or v.startswith("//")

    for m in script_re.finditer(html_wo_style):
        attrs, body = m.group(1), m.group(2)
        if "__bundler" in attrs:
            continue
        src_m = re.search(r'\bsrc\s*=\s*("([^"]*)"|\'([^\']*)\')', attrs, re.I)
        src = (src_m.group(2) or src_m.group(3) or "").strip() if src_m else ""

        if src and not is_http_src(src):
            # Local file we wrote under washoku-nao/
            path = OUT / src.replace("/", "\\")
            if path.is_file():
                code = path.read_text(encoding="utf-8")
                main_parts.append(f"// --- from {src} ---\n{code}\n")
            else:
                print("WARN missing local script", src)
        elif src and is_http_src(src):
            # Keep CDN scripts in HTML — do not fold into main.js
            continue
        else:
            body = body.strip()
            if body:
                main_parts.append(f"// --- inline ({attrs.strip()}) ---\n{body}\n")

    main_js = "\n".join(main_parts)

    # Strip scripts we merged into main.js; keep only http(s) src scripts
    html_final = html_wo_style
    for m in script_re.finditer(html_wo_style):
        attrs = m.group(1)
        if "__bundler" in attrs:
            continue
        src_m = re.search(r'\bsrc\s*=\s*("([^"]*)"|\'([^\']*)\')', attrs, re.I)
        src = (src_m.group(2) or src_m.group(3) or "").strip() if src_m else ""
        if src and is_http_src(src):
            continue
        html_final = html_final.replace(m.group(0), "", 1)

    link_vars = '<link rel="stylesheet" href="css/variables.css">\n<link rel="stylesheet" href="css/style.css">'
    html_final = re.sub(r"(</head>)", f"  {link_vars}\n\\1", html_final, count=1, flags=re.I)

    script_tag = '\n<script defer src="js/main.js"></script>\n'
    html_final = re.sub(r"(</body>)", script_tag + r"\1", html_final, count=1, flags=re.I)
    html_final = re.sub(r"\n{3,}", "\n\n", html_final)

    (OUT / "css").mkdir(parents=True, exist_ok=True)
    (OUT / "js").mkdir(parents=True, exist_ok=True)

    (OUT / "css" / "variables.css").write_text(variables_out + "\n", encoding="utf-8")
    (OUT / "css" / "style.css").write_text(style_out + "\n", encoding="utf-8")
    (OUT / "js" / "main.js").write_text(main_js, encoding="utf-8")
    (OUT / "index.html").write_text(html_final.strip() + "\n", encoding="utf-8")

    # Merged local vendor JS into main.js — drop duplicate files
    vdir = OUT / "js" / "vendor"
    if vdir.is_dir():
        shutil.rmtree(vdir)

    print("done. main.js bytes", len(main_js.encode("utf-8")), "index len", len(html_final))


if __name__ == "__main__":
    main()
