"""
Renders public/og.png — the link-preview card — from code rather than from a model.

Rendered, not generated, for the reason the plan gives: a card drawn from the same tokens as
the site is always current and always on-brand, where a generated image drifts the moment the
copy changes. Re-run it when the pitch or the figures change:

    python3 scripts/og.py public/og.png

It draws with the system UI fonts rather than the site's own, because those ship as woff2 and
PIL cannot read them. The art pass replaces this with a build-time render in the real faces;
until then this is honest, legible, and a great deal better than a broken preview.
"""

import sys

from PIL import Image, ImageDraw, ImageFont

OUT = sys.argv[1]
W, H = 1200, 630
INK, SURFACE, HI, LO, ACCENT, ADD = '#1b1e24', '#21252b', '#d7dae0', '#90949d', '#61afef', '#98c379'

def font(path, size, index=0):
    try:
        return ImageFont.truetype(path, size, index=index)
    except Exception:
        return ImageFont.load_default()

display = font('/System/Library/Fonts/SFNS.ttf', 84)
mono = font('/System/Library/Fonts/SFNSMono.ttf', 24)
mono_sm = font('/System/Library/Fonts/SFNSMono.ttf', 21)
body = font('/System/Library/Fonts/SFNS.ttf', 30)

im = Image.new('RGB', (W, H), INK)
d = ImageDraw.Draw(im)

# A hairline grid, the same technical substrate the page wears.
for x in range(0, W, 60):
    d.line([(x, 0), (x, H)], fill='#20242b', width=1)
for y in range(0, H, 60):
    d.line([(0, y), (W, y)], fill='#20242b', width=1)

PAD = 72
d.rectangle([0, 0, 6, H], fill=ACCENT)

d.text((PAD, 86), 'BEIRUT, LEBANON', font=mono_sm, fill=LO)
d.text((PAD, 134), 'Ibrahim Ismail', font=display, fill=HI)
d.text((PAD, 246), 'Senior Full-Stack Engineer', font=body, fill=ACCENT)

d.line([(PAD, 316), (W - PAD, 316)], fill='#343a45', width=1)

for i, line in enumerate([
    'Authorization engines, service contracts and encrypted',
    'channels on the server. Extension platforms, native',
    'bridges and micro-frontends on the client.',
]):
    d.text((PAD, 348 + i * 40), line, font=body, fill=LO)

# The one measured claim, in the diff colour it wears on the page.
d.text((PAD, 508), '+ 6 years', font=mono, fill=ADD)
d.text((PAD, 552), 'ibrahimismail.dev', font=mono, fill=LO)

im.save(OUT, 'PNG', optimize=True)
print(OUT, im.size)
