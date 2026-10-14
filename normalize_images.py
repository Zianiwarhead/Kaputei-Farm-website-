#!/usr/bin/env python3
"""
normalize_images.py - put every product cutout on the same square canvas.

For each transparent PNG it: trims the empty margin, scales the product to a
consistent size, centres it on a square transparent canvas, and saves a WebP.
Front and back images of one product therefore line up, so the hover swap on
the product cards doesn't jump. Your source PNGs are never modified.

Setup (once):
    pip install pillow

Test on a few products first, then open <dst>\\preview.html and hover the tiles:
    python normalize_images.py --src public\\products --dst public\\products_new --only tomato-ketchup,teas,honey --preview

Whole batch:
    python normalize_images.py --src public\\products --dst public\\products_new --preview
"""
import argparse
import sys
from pathlib import Path

from PIL import Image

# Product slugs = the filename prefix used in seed.sql
SLUGS = [
    "barbecue-sauce", "cheese-sauce", "chilli-sauce", "choma-sauce", "chutney",
    "honey", "hot-sweet-sauce", "hotels-catering", "jalapenos", "jams",
    "mayonnaise", "mustard", "pasta-sauces", "pestos", "pickles", "pizza-sauce",
    "salad-dressings", "salsa-kachumbari", "sundried-tomatoes", "teas",
    "tomato-ketchup", "tomato-sauce", "worcestershire-sauce",
]


def group_of(stem):
    """'hotels-catering-tomato-sauce' -> 'hotels-catering' (longest slug wins)."""
    for slug in sorted(SLUGS, key=len, reverse=True):
        if stem == slug or stem.startswith(slug + "-"):
            return slug
    return stem  # unknown file: its own group


def trim(im):
    """Crop away fully/almost transparent margins."""
    im = im.convert("RGBA")
    mask = im.getchannel("A").point(lambda v: 255 if v > 10 else 0)
    box = mask.getbbox()
    return im.crop(box) if box else im
def write_preview(dst, files):
    groups = {}
    for p in files:
        groups.setdefault(group_of(p.stem), []).append(p.stem)
    tiles = []
    for g, stems in sorted(groups.items()):
        front = g if g in stems else stems[0]
        back = next((s for s in stems if s.endswith("-back")), None)
        imgs = f'<img class="f" src="{front}.webp">'
        if back:
            imgs += f'<img class="b" src="{back}.webp">'
        note = "hover: front/back" if back else "no back image"
        tiles.append(f'<div class="tile">{imgs}<span>{g} ({note})</span></div>')
    html = """<!doctype html><meta charset="utf-8"><title>Image preview</title>
<style>
body{font-family:system-ui,sans-serif;background:#fff5ec;margin:24px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px}
.tile{position:relative;aspect-ratio:1;border-radius:20px;overflow:hidden;
  background:linear-gradient(135deg,#c8252c,#7b3a18)}
.tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;transition:opacity .35s}
.tile .b{opacity:0}
.tile:hover .b{opacity:1}
.tile:hover .f{opacity:0}
.tile span{position:absolute;left:10px;bottom:8px;font-size:12px;color:#fff;
  background:rgba(0,0,0,.45);padding:2px 8px;border-radius:10px}
</style><div class="grid">""" + "".join(tiles) + "</div>"
    (dst / "preview.html").write_text(html, encoding="utf-8")


def main():
    ap = argparse.ArgumentParser(description="Normalize product cutouts onto one canvas.")
    ap.add_argument("--src", required=True, help="folder with the transparent PNGs")
    ap.add_argument("--dst", required=True, help="output folder (must differ from --src)")
    ap.add_argument("--canvas", type=int, default=1000, help="square canvas size in px (default 1000)")
    ap.add_argument("--fill", type=float, default=0.82,
                    help="product size as a fraction of the canvas (default 0.82)")
    ap.add_argument("--quality", type=int, default=85, help="WebP quality (default 85)")
    ap.add_argument("--mode", choices=["fit", "group"], default="fit",
                    help="fit: each image scaled to the same box (default). "
                         "group: every image of a product shares one scale")
    ap.add_argument("--only", default="", help="comma-separated product slugs to process")
    ap.add_argument("--preview", action="store_true", help="also write preview.html")
    a = ap.parse_args()

    src, dst = Path(a.src), Path(a.dst)
    if not src.is_dir():
        sys.exit(f"Source folder not found: {src}")
    if src.resolve() == dst.resolve():
        sys.exit("--dst must be a different folder than --src")
    dst.mkdir(parents=True, exist_ok=True)

    only = {s.strip() for s in a.only.split(",") if s.strip()}
    files = sorted(p for p in src.glob("*.png") if not only or group_of(p.stem) in only)
    if not files:
        sys.exit("No matching PNG files found.")

    box = int(a.canvas * a.fill)
    trimmed = {p: trim(Image.open(p)) for p in files}
    fit = {p: min(box / im.width, box / im.height) for p, im in trimmed.items()}

    if a.mode == "group":
        shared = {}
        for p, s in fit.items():
            g = group_of(p.stem)
            shared[g] = min(shared.get(g, s), s)
        scale = {p: shared[group_of(p.stem)] for p in files}
    else:
        scale = fit

    before = after = 0
    upscaled = []
    for p, im in trimmed.items():
        s = scale[p]
        if s > 1.15:
            upscaled.append(p.name)
        w, h = max(1, round(im.width * s)), max(1, round(im.height * s))
        im = im.resize((w, h), Image.LANCZOS)
        canvas = Image.new("RGBA", (a.canvas, a.canvas), (0, 0, 0, 0))
        canvas.alpha_composite(im, ((a.canvas - w) // 2, (a.canvas - h) // 2))
        out = dst / (p.stem + ".webp")
        canvas.save(out, "WEBP", quality=a.quality, method=6)
        before += p.stat().st_size
        after += out.stat().st_size

    if a.preview:
        write_preview(dst, files)

    print(f"Done: {len(files)} files -> {dst}")
    print(f"Size: {before / 1e6:.1f} MB (PNG) -> {after / 1e6:.1f} MB (WebP)")
    if upscaled:
        print(f"\nUpscaled by more than 15% (source may be too small, check these for softness):")
        for n in upscaled:
            print("  ", n)
    if a.preview:
        print(f"\nOpen {dst / 'preview.html'} in your browser and hover the tiles.")


if __name__ == "__main__":
    main()