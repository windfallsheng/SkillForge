#!/usr/bin/env python3
"""Embed Roboto woff2 fonts as base64 data URIs to produce a self-contained HTML.

Replaces url('assets/fonts/roboto-latin-{400,500,700,900}-normal.woff2')
with inline base64 data URIs, so the output HTML needs no external files.

Usage:
    python3 inline_fonts.py input.html output.html /path/to/assets/fonts
"""
import sys
import base64

WEIGHTS = ['400', '500', '700', '900']


def main(src, dst, fontdir):
    html = open(src, encoding='utf-8').read()
    for w in WEIGHTS:
        path = f"{fontdir.rstrip('/')}/roboto-latin-{w}-normal.woff2"
        data = 'data:font/woff2;base64,' + base64.b64encode(open(path, 'rb').read()).decode()
        html = html.replace(f"url('assets/fonts/roboto-latin-{w}-normal.woff2')",
                            f"url('{data}')")
    open(dst, 'w', encoding='utf-8').write(html)
    print(f'OK: {dst} ({len(html)} bytes, 4 Roboto weights embedded)')


if __name__ == '__main__':
    if len(sys.argv) < 4:
        print('Usage: python3 inline_fonts.py input.html output.html /path/to/assets/fonts',
              file=sys.stderr)
        sys.exit(1)
    main(sys.argv[1], sys.argv[2], sys.argv[3])
