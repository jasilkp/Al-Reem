from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path

from PIL import Image


@dataclass(frozen=True)
class ProcessOptions:
    black_threshold: int
    padding_ratio: float
    output_size: int
    write_jpg_fallback: bool
    jpg_background: tuple[int, int, int]


def is_near_black(rgb: tuple[int, int, int], threshold: int) -> bool:
    r, g, b = rgb
    return r <= threshold and g <= threshold and b <= threshold


def floodfill_background_to_alpha(
    image_rgba: Image.Image, *, black_threshold: int
) -> Image.Image:
    """Remove near-black background that is *connected to the border*.

    This preserves dark pixels inside the dish that are not connected to edges.
    """
    if image_rgba.mode != "RGBA":
        image_rgba = image_rgba.convert("RGBA")

    width, height = image_rgba.size
    pixels = image_rgba.load()

    visited = [[False] * width for _ in range(height)]
    stack: list[tuple[int, int]] = []

    def try_push(x: int, y: int) -> None:
        if x < 0 or y < 0 or x >= width or y >= height:
            return
        if visited[y][x]:
            return
        r, g, b, a = pixels[x, y]
        if a == 0:
            visited[y][x] = True
            return
        if is_near_black((r, g, b), black_threshold):
            visited[y][x] = True
            stack.append((x, y))

    # Seed with border pixels that are near-black
    for x in range(width):
        try_push(x, 0)
        try_push(x, height - 1)
    for y in range(height):
        try_push(0, y)
        try_push(width - 1, y)

    # Flood fill
    while stack:
        x, y = stack.pop()
        r, g, b, a = pixels[x, y]
        if a != 0:
            pixels[x, y] = (r, g, b, 0)
        try_push(x - 1, y)
        try_push(x + 1, y)
        try_push(x, y - 1)
        try_push(x, y + 1)

    return image_rgba


def crop_to_visible_bounds(image_rgba: Image.Image, *, padding_ratio: float) -> Image.Image:
    if image_rgba.mode != "RGBA":
        image_rgba = image_rgba.convert("RGBA")

    alpha = image_rgba.split()[-1]
    bbox = alpha.getbbox()
    if bbox is None:
        return image_rgba

    left, top, right, bottom = bbox
    width, height = image_rgba.size

    pad = int(max(right - left, bottom - top) * padding_ratio)
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(width, right + pad)
    bottom = min(height, bottom + pad)

    return image_rgba.crop((left, top, right, bottom))


def pad_to_square(image_rgba: Image.Image) -> Image.Image:
    if image_rgba.mode != "RGBA":
        image_rgba = image_rgba.convert("RGBA")

    w, h = image_rgba.size
    size = max(w, h)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(image_rgba, ((size - w) // 2, (size - h) // 2))
    return canvas


def resize_to(image_rgba: Image.Image, *, output_size: int) -> Image.Image:
    if output_size <= 0:
        return image_rgba
    if image_rgba.size == (output_size, output_size):
        return image_rgba
    return image_rgba.resize((output_size, output_size), resample=Image.Resampling.LANCZOS)


def save_webp_rgba(image_rgba: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image_rgba.save(
        path,
        format="WEBP",
        lossless=False,
        quality=88,
        method=6,
        exact=True,
    )


def save_jpg_fallback(image_rgba: Image.Image, path: Path, *, background_rgb: tuple[int, int, int]) -> None:
    rgb = Image.new("RGB", image_rgba.size, background_rgb)
    rgb.paste(image_rgba, mask=image_rgba.split()[-1])
    rgb.save(path, format="JPEG", quality=88, optimize=True, progressive=True)


def process_one(input_path: Path, options: ProcessOptions) -> None:
    if not input_path.exists():
        raise FileNotFoundError(str(input_path))

    with Image.open(input_path) as img:
        rgba = img.convert("RGBA")

    rgba = floodfill_background_to_alpha(rgba, black_threshold=options.black_threshold)
    rgba = crop_to_visible_bounds(rgba, padding_ratio=options.padding_ratio)
    rgba = pad_to_square(rgba)
    rgba = resize_to(rgba, output_size=options.output_size)

    if input_path.suffix.lower() == ".webp":
        save_webp_rgba(rgba, input_path)
    else:
        # keep original extension format
        rgba.save(input_path)

    if options.write_jpg_fallback:
        jpg_path = input_path.with_suffix(".jpg")
        save_jpg_fallback(rgba, jpg_path, background_rgb=options.jpg_background)


def main() -> int:
    parser = argparse.ArgumentParser(description="Remove black background from menu dish images and crop/resize them.")
    parser.add_argument("paths", nargs="+", help="Image file paths to process (typically .webp).")
    parser.add_argument("--black-threshold", type=int, default=28, help="RGB threshold for " "near-black background (0-255).")
    parser.add_argument("--padding-ratio", type=float, default=0.02, help="Extra padding around detected content bbox.")
    parser.add_argument("--output-size", type=int, default=1024, help="Output square size in pixels.")
    parser.add_argument("--no-jpg", action="store_true", help="Do not generate/update .jpg fallback.")
    parser.add_argument("--jpg-bg", default="#101010", help="Background color for JPG fallback (hex, e.g. #101010).")

    args = parser.parse_args()

    jpg_bg = args.jpg_bg.lstrip("#")
    jpg_background = (int(jpg_bg[0:2], 16), int(jpg_bg[2:4], 16), int(jpg_bg[4:6], 16))

    options = ProcessOptions(
        black_threshold=args.black_threshold,
        padding_ratio=args.padding_ratio,
        output_size=args.output_size,
        write_jpg_fallback=not args.no_jpg,
        jpg_background=jpg_background,
    )

    for raw in args.paths:
        process_one(Path(raw), options)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
