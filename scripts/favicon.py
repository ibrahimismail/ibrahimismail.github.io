"""
Draws the favicon set: the site's own motif, a prompt chevron and a block cursor.

    python3 scripts/favicon.py public

Hand-drawn rather than generated — a model cannot be trusted with two shapes that have to stay
legible at sixteen pixels, and the geometry here is shared with public/favicon.svg so the vector
and the rasters cannot drift.
"""
import io
import struct
import sys

from PIL import Image, ImageDraw

OUT = sys.argv[1].rstrip('/')

INK = (27, 30, 36)        # --ink-900
BLUE = (97, 175, 239)     # --accent
GREY = (215, 218, 224)    # --text-hi

def draw(size: int, bleed: bool, simple: bool = False) -> Image.Image:
    """Geometry authored on a 64 grid, scaled up and drawn at 4x for clean edges."""
    s = size * 4
    u = s / 64
    im = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    radius = 0 if bleed else 14 * u
    d.rounded_rectangle([0, 0, s - 1, s - 1], radius=radius, fill=INK)

    if simple:
        # At sixteen pixels the chevron and the cursor share about five pixels of width between
        # them and turn to mush. The cursor alone survives, and it is the half that means
        # something: a caret, and the I it stands in for.
        d.rounded_rectangle([25 * u, 12 * u, 39 * u, 52 * u], radius=2.5 * u, fill=BLUE)
        return im.resize((size, size), Image.LANCZOS)

    # The chevron: two strokes meeting at a point, round caps. Drawn large on the tile — at
    # sixteen pixels a generous margin is just four grey pixels nobody can resolve.
    w = max(2, round(8 * u))
    apex = (31 * u, 32 * u)
    for end in ((15 * u, 15 * u), (15 * u, 49 * u)):
        d.line([end, apex], fill=GREY, width=w, joint='curve')
    for point in ((15 * u, 15 * u), apex, (15 * u, 49 * u)):
        d.ellipse([point[0] - w / 2, point[1] - w / 2, point[0] + w / 2, point[1] + w / 2], fill=GREY)

    # The cursor: a filled block, which is also the I it stands in for.
    d.rounded_rectangle([39 * u, 13 * u, 50 * u, 51 * u], radius=2 * u, fill=BLUE)

    return im.resize((size, size), Image.LANCZOS)

def write_ico(path: str, images: list[Image.Image]) -> None:
    """
    Assembles the .ico by hand, because each size here is a different drawing and Pillow's ICO
    writer takes one image and resamples it — which would have put the simplified sixteen-pixel
    mark into every entry. Each frame goes in PNG-encoded, which every browser since Vista reads.
    """
    frames = []
    for image in images:
        buffer = io.BytesIO()
        image.save(buffer, format='PNG', optimize=True)
        frames.append((image.width, image.height, buffer.getvalue()))

    offset = 6 + 16 * len(frames)
    header = struct.pack('<HHH', 0, 1, len(frames))
    directory = b''
    for width, height, data in frames:
        directory += struct.pack(
            '<BBBBHHII', width % 256, height % 256, 0, 0, 1, 32, len(data), offset
        )
        offset += len(data)

    with open(path, 'wb') as file:
        file.write(header + directory + b''.join(data for _, _, data in frames))


write_ico(
    f'{OUT}/favicon.ico',
    [draw(16, bleed=False, simple=True), draw(32, bleed=False), draw(48, bleed=False)],
)
draw(180, bleed=True).convert('RGB').save(f'{OUT}/apple-touch-icon.png', optimize=True)

# A contact sheet, so the small sizes get judged at the size they are used.
sheet = Image.new('RGB', (420, 120), (240, 240, 241))
x = 20
for n in (16, 32, 64, 180):
    tile = draw(n, bleed=False, simple=n <= 16)
    sheet.paste(tile, (x, 60 - n // 2), tile)
    x += n + 28
sheet.save(f'{OUT}/favicon-sheet.png')
print('wrote favicon.ico (16/32/48) and apple-touch-icon.png')
