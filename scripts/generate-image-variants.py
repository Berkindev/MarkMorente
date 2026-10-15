#!/usr/bin/env python3
"""Generate the downscaled catalog image variants the site renders.

WHY THIS EXISTS
---------------
Catalog masters under public/collections/<code>/ are 800x1200 WebP and are
served with `unoptimized` (a deliberate choice — it bypasses Vercel's Image
Optimization quota, see CLAUDE.md). `unoptimized` means no srcset, so a single
file has to serve whatever slot it lands in. Previously the 800px master was
also used for 267px grid cards and 80px gallery thumbnails, which made
/collections ship 5.4MB and the worst product page 1.5MB.

So each slot gets a pre-generated file sized for it:

    foo.webp          800px   product-detail main image (the master)
    foo-card.webp     480px   grid cards (~267px desktop / ~159px mobile)
    foo-thumb.webp    160px   product gallery strip (64-80px)

lib/images.ts maps a master path to its variants. If a variant is missing the
page renders a 404 image, so RUN THIS AFTER ADDING OR REPLACING ANY CATALOG
IMAGE:

    python3 scripts/generate-image-variants.py

Existing variants are skipped unless they are older than their master, so
re-running is cheap. Use --force to rebuild everything.

Requires Pillow:  pip3 install Pillow
"""
import argparse
import json
import os
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow gerekli:  pip3 install Pillow")

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(REPO)

CARD = {"suffix": "card", "width": 480, "quality": 78}
THUMB = {"suffix": "thumb", "width": 160, "quality": 76}

# Fabric tiles are hard-coded in app/page.tsx rather than driven by JSON.
# Keep this list in sync with FabricsSection there.
FABRIC_IMAGES = [
    "/collections/S05/navy-blue-three-piece-mens-suit-01.webp",
    "/collections/S06/charcoal-grey-three-piece-mens-suit-01.webp",
    "/collections/S03/ivory-linen-two-piece-mens-summer-suit-01.webp",
]


def variant_rel(rel, suffix):
    base, ext = os.path.splitext(rel)
    return f"{base}-{suffix}{ext}"


def generate(rel, spec, force):
    src = "public" + rel
    dst = "public" + variant_rel(rel, spec["suffix"])
    if not os.path.exists(src):
        return "missing"
    if (
        not force
        and os.path.exists(dst)
        and os.path.getmtime(dst) >= os.path.getmtime(src)
    ):
        return "skipped"
    im = Image.open(src).convert("RGB")
    if im.width <= spec["width"]:
        return "skipped"
    height = max(1, round(im.height * spec["width"] / im.width))
    im.resize((spec["width"], height), Image.LANCZOS).save(
        dst, "WEBP", quality=spec["quality"], method=6
    )
    return "written"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="rebuild every variant")
    args = ap.parse_args()

    products = json.load(open("collections.json"))["products"]
    cats_raw = json.load(open("categories.json"))
    categories = cats_raw.get("page", {}).get(
        "categories", cats_raw.get("categories", [])
    )

    # Anything that renders inside a grid card.
    card_images = sorted(
        {p["images"][0] for p in products}
        | {c["image"] for c in categories if c.get("image")}
        | set(FABRIC_IMAGES)
    )
    # Every image, because the gallery strip renders all of a product's images.
    thumb_images = sorted({i for p in products for i in p["images"]})

    missing = []
    for images, spec in ((card_images, CARD), (thumb_images, THUMB)):
        counts = {"written": 0, "skipped": 0, "missing": 0}
        for rel in images:
            result = generate(rel, spec, args.force)
            counts[result] += 1
            if result == "missing":
                missing.append(rel)
        print(
            f"{spec['suffix']:>5} ({spec['width']}px): "
            f"{counts['written']} uretildi, {counts['skipped']} atlandi, "
            f"{counts['missing']} kaynak yok"
        )

    if missing:
        print("\nKAYNAK BULUNAMADI (collections.json bunlara isaret ediyor):")
        for rel in sorted(set(missing)):
            print("  " + rel)
        return 1
    print("\nTamam — tum varyantlar guncel.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
