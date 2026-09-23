"""Build a single self-contained HTML file: dist/glg.html
Embeds: CSS (static/style.css), shell body (src/html.rs),
        engine+data (tools/glg-logic.js), mapping (tools/mapping.js),
        app logic (static/app.js).

Usage: python tools/build_html.py
Output: dist/glg.html
"""
import os, time

base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def read(p):
    with open(os.path.join(base, p), 'r', encoding='utf-8') as f:
        return f.read()

css = read('static/style.css')
html_rs = read('src/html.rs')

body_start = html_rs.index('<body>') + len('<body>')
body_end = html_rs.index('</body>')
body_html = html_rs[body_start:body_end].strip()
# drop the script tag that referenced the old external app.js
body_html = body_html.replace('<script src="/app.js"></script>', '').strip()

engine_js = read('tools/glg-logic.js')
mapping_js = read('tools/mapping.js')
app_js = read('static/app.js')

out_path = os.path.join(base, 'dist', 'glg.html')

chunks = []
chunks.append('<!DOCTYPE html>\n<html lang="en" data-theme="dark">\n<head>\n')
chunks.append('    <meta charset="UTF-8">\n')
chunks.append('    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n')
chunks.append('    <meta name="theme-color" content="#0f1117">\n')
chunks.append('    <meta name="description" content="Granular License Generator - Create customized software licenses offline">\n')
chunks.append('    <meta name="apple-mobile-web-app-capable" content="yes">\n')
chunks.append('    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n')
chunks.append('    <title>GLG - Granular License Generator</title>\n')
chunks.append("    <link rel=\"icon\" type=\"image/svg+xml\" href=\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%236366f1'/><text x='16' y='23' font-size='20' text-anchor='middle' fill='white' font-family='monospace' font-weight='bold'>G</text></svg>\">\n")
chunks.append('    <style>\n')
chunks.append(css)
chunks.append('\n    </style>\n')
chunks.append('</head>\n<body>\n')
chunks.append(body_html)
chunks.append('\n\n    <script>\n')
chunks.append('/* ==== GLG engine + questionnaire data (glg-logic.js) ==== */\n')
chunks.append(engine_js)
chunks.append('\n/* ==== GLG mapping layer (mapping.js) ==== */\n')
chunks.append(mapping_js)
chunks.append('\n/* ==== GLG application logic (app.js) ==== */\n')
chunks.append(app_js)
chunks.append('\n    </script>\n')
chunks.append('</body>\n</html>\n')

html = ''.join(chunks)

with open(out_path, 'w', encoding='utf-8') as f:
    f.write(html)

size = os.path.getsize(out_path)
print(f'Built: {out_path}')
print(f'Size: {size / 1024:.1f} KB')