#!/usr/bin/env python3
"""Download Roboto woff2 weights (400/500/700/900) into a fonts directory.

Usage:
    python3 download_roboto.py /path/to/assets/fonts
"""
import os
import sys
import urllib.request
import ssl

try:
    ssl._create_default_https_context = ssl._create_unverified_context
except Exception:
    pass

BASE = 'https://cdn.jsdelivr.net/npm/@fontsource/roboto@5.2.6/files/roboto-latin-{w}-normal.woff2'
WEIGHTS = ['400', '500', '700', '900']


def main(outdir):
    os.makedirs(outdir, exist_ok=True)
    for w in WEIGHTS:
        dst = os.path.join(outdir, f'roboto-latin-{w}-normal.woff2')
        if os.path.exists(dst) and os.path.getsize(dst) > 10000:
            print('skip (exists):', dst)
            continue
        url = BASE.format(w=w)
        print('downloading:', url)
        urllib.request.urlretrieve(url, dst)
        print('saved:', dst, os.path.getsize(dst), 'bytes')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python3 download_roboto.py /path/to/assets/fonts', file=sys.stderr)
        sys.exit(1)
    main(sys.argv[1])
