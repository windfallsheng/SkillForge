#!/usr/bin/env python3
"""Extract text, tables, and images from a .docx file.

Usage:
    python3 extract_docx.py input.docx [--media-dir /tmp/docx-extract] > /tmp/extracted.json

Output JSON:
    {
      "texts":  ["段落1", ...],                 # 正文段落（不含表格内文本）
      "tables": [["单元格", ...], ...],          # 表格内容，行优先（每行一个数组）
      "media":  ["word/media/image1.png", ...], # 图片在 zip 内的路径
      "media_dir": "/tmp/docx-extract" or null  # 图片落盘目录，供 Read 工具查看
    }
"""
import sys
import os
import json
import zipfile
import xml.etree.ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'


def para_text(p):
    return ''.join(n.text or '' for n in p.iter(W + 't')).strip()


def cell_text(tc):
    return ''.join(n.text or '' for n in tc.iter(W + 't')).strip()


def main(path):
    z = zipfile.ZipFile(path)
    tree = ET.fromstring(z.read('word/document.xml'))
    body = tree.find(W + 'body')

    texts, tables = [], []
    for el in body:
        if el.tag == W + 'p':
            t = para_text(el)
            if t:
                texts.append(t)
        elif el.tag == W + 'tbl':
            rows = []
            for tr in el.findall(W + 'tr'):
                rows.append([cell_text(tc) for tc in tr.findall(W + 'tc')])
            tables.append(rows)

    media = [n for n in z.namelist() if n.startswith('word/media/') and not n.endswith('/')]

    media_dir = None
    if '--media-dir' in sys.argv:
        media_dir = sys.argv[sys.argv.index('--media-dir') + 1]
        os.makedirs(media_dir, exist_ok=True)
        for n in media:
            with open(os.path.join(media_dir, os.path.basename(n)), 'wb') as f:
                f.write(z.read(n))

    print(json.dumps({'texts': texts, 'tables': tables, 'media': media,
                      'media_dir': media_dir}, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python3 extract_docx.py input.docx [--media-dir /path]',
              file=sys.stderr)
        sys.exit(1)
    main(sys.argv[1])
