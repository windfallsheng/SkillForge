#!/usr/bin/env python3
"""Detect and install Source Han Sans SC (思源黑体) on macOS/Windows.

Checks common font directories first; if missing, downloads the official
Adobe Fonts release (2.005R, SIL OFL — free for commercial use), verifies
SHA-256, and installs the OTF weights to the user font directory.

Usage:
    python3 install_sourcehan.py
"""
import os
import sys
import shutil
import zipfile
import hashlib
import platform
import tempfile
import urllib.request

OFFICIAL = 'https://github.com/adobe-fonts/source-han-sans/releases/download/2.005R/09_SourceHanSansSC.zip'
MIRROR = 'https://ghfast.top/' + OFFICIAL  # GitHub 直连超时时使用
SHA256 = 'ef7364f7ac2564be1ae9c1d74276de2653fe38b73449070398c4fc0b7e032ff1'


def font_dirs():
    if platform.system() == 'Darwin':
        return [os.path.expanduser('~/Library/Fonts'), '/Library/Fonts']
    if platform.system() == 'Windows':
        return [os.path.join(os.environ.get('LOCALAPPDATA', os.path.expanduser('~')),
                             'Microsoft', 'Windows', 'Fonts')]
    return [os.path.expanduser('~/.fonts')]


def installed():
    for d in font_dirs():
        if os.path.isdir(d):
            for f in os.listdir(d):
                if f.lower().startswith('sourcehansans'):
                    return True
    return False


def main():
    if installed():
        print('OK: Source Han Sans SC already installed, nothing to do')
        return
    target = font_dirs()[0]
    os.makedirs(target, exist_ok=True)
    tmp = tempfile.mkdtemp(prefix='sourcehan-')
    zip_path = os.path.join(tmp, 'sourcehan.zip')
    for url in (MIRROR, OFFICIAL):
        try:
            print('downloading:', url)
            urllib.request.urlretrieve(url, zip_path)
            break
        except Exception as e:
            print('download failed:', e)
    else:
        print('ERROR: both sources failed, install manually from', OFFICIAL)
        sys.exit(1)
    h = hashlib.sha256(open(zip_path, 'rb').read()).hexdigest()
    if h != SHA256:
        print('ERROR: SHA-256 mismatch:', h, 'expected', SHA256)
        sys.exit(1)
    with zipfile.ZipFile(zip_path) as z:
        for n in z.namelist():
            if n.lower().endswith('.otf') and 'license' not in n.lower():
                base = os.path.basename(n)
                with z.open(n) as f, open(os.path.join(target, base), 'wb') as out:
                    out.write(f.read())
                print('installed:', base)
    shutil.rmtree(tmp, ignore_errors=True)
    print('DONE: 思源黑体已安装到', target, '— 重启浏览器后生效')
    print('NOTE: 严禁执行 atsutil databases -removeUser（会破坏字体数据库）')


if __name__ == '__main__':
    main()
