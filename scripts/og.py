"""
Renders public/og.png — the link-preview card — from code rather than from a model.

    python3 scripts/og.py public/og.png

Rendered, not generated, for the reason the plan gives: a card drawn from the same tokens and
the same faces as the site is always current and always on-brand, where a generated image drifts
the moment the copy changes.

It draws in the site's real faces. @fontsource ships woff2 only and FreeType — which is what
Pillow draws through — cannot read it, so the two faces are decompressed to temporary ttf first.
That needs fonttools and brotli, which are dev-only: nothing here runs at build or at runtime.
"""

from __future__ import annotations  # the system python here is 3.9

import sys
import tempfile
from pathlib import Path

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

OUT = Path(sys.argv[1] if len(sys.argv) > 1 else 'public/og.png')
ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / 'node_modules' / '@fontsource-variable'

W, H = 1200, 630
INK = '#1b1e24'
SURFACE = '#21252b'
GRID = '#20242b'
HI = '#d7dae0'
LO = '#90949d'
ACCENT = '#61afef'
KEY = '#c678dd'
ADD = '#98c379'


def face(package: str, filename: str, size: int, weight: float | None = None):
    """A woff2 from node_modules, decompressed to ttf and loaded at `size`."""
    source = FONTS / package / 'files' / filename
    target = Path(tempfile.gettempdir()) / f'{source.stem}.ttf'
    if not target.exists():
        font = TTFont(str(source))
        font.flavor = None
        font.save(str(target))
    loaded = ImageFont.truetype(str(target), size)
    if weight is not None:
        try:
            loaded.set_variation_by_axes([weight])
        except Exception:
            pass  # A static build of the face is fine; it just ignores the axis.
    return loaded


display = face('bricolage-grotesque', 'bricolage-grotesque-latin-wght-normal.woff2', 86, 600)
mono = face('jetbrains-mono', 'jetbrains-mono-latin-wght-normal.woff2', 25, 400)
mono_sm = face('jetbrains-mono', 'jetbrains-mono-latin-wght-normal.woff2', 21, 400)

im = Image.new('RGB', (W, H), INK)
d = ImageDraw.Draw(im)

# The hairline grid the page wears, and the accent rule down the edge.
for x in range(0, W, 60):
    d.line([(x, 0), (x, H)], fill=GRID, width=1)
for y in range(0, H, 60):
    d.line([(0, y), (W, y)], fill=GRID, width=1)
d.rectangle([0, 0, 6, H], fill=ACCENT)

PAD = 76

# A tab bar, so the card is recognisably the same editor pane the page opens with.
d.rectangle([PAD, 64, W - PAD, 104], fill=SURFACE)
d.ellipse([PAD + 16, 79, PAD + 26, 89], fill=ACCENT)
d.text((PAD + 38, 74), 'profile.ts', font=mono_sm, fill=HI)
place = 'Beirut, Lebanon'
d.text((W - PAD - 16 - d.textlength(place, font=mono_sm), 74), place, font=mono_sm, fill=LO)

d.text((PAD, 140), 'Ibrahim Ismail', font=display, fill=HI)

# The pitch, as the masthead sets it: a block comment, server clause first.
d.text((PAD, 268), '/**', font=mono_sm, fill=LO)
for i, line in enumerate([
    '* Authorization engines, service contracts and',
    '*   encrypted channels on the server.',
    '* Extension platforms, native bridges and',
    '*   micro-frontends on the client.',
]):
    d.text((PAD, 302 + i * 36), line, font=mono, fill=HI)
d.text((PAD, 450), '*/', font=mono_sm, fill=LO)

# The status line, in the colours the page gives it.
y = 508
x = PAD
for text, colour, font in (
    ('const', KEY, mono),
    (' status', ACCENT, mono),
    (' = ', LO, mono),
    ("'Open to senior engineering roles'", ADD, mono),
):
    d.text((x, y), text, font=font, fill=colour)
    x += d.textlength(text, font=font)

d.text((PAD, 556), 'ibrahimismail.dev', font=mono_sm, fill=LO)

OUT.parent.mkdir(parents=True, exist_ok=True)
im.save(OUT, 'PNG', optimize=True)
print(f'{OUT} · {im.size[0]}x{im.size[1]} · {OUT.stat().st_size // 1024} kB')
