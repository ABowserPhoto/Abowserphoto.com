#!/usr/bin/env python3
"""Convert public photographs to descriptive WebP files under about 200 KB."""

from __future__ import annotations

import json
import re
import unicodedata
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ALT_PATH = ROOT / "lib" / "image-alts.json"
MAX_BYTES = 200 * 1024
ORDINALS_DE = [
    "Erstes",
    "Zweites",
    "Drittes",
    "Viertes",
    "Fünftes",
    "Sechstes",
    "Siebtes",
    "Achtes",
    "Neuntes",
    "Zehntes",
    "Elftes",
    "Zwölftes",
]
ORDINALS_EN = [
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
    "Ninth",
    "Tenth",
    "Eleventh",
    "Twelfth",
]

EXPLICIT: dict[str, tuple[str, dict[str, str]]] = {
    "logo/SigSeriesLogoThickArtboard 4.png": (
        "logo/aaron-bowser-photography-logo.webp",
        {
            "de": "Aaron Bowser Photography Logo",
            "en": "Aaron Bowser Photography Logo",
        },
    ),
    "about/Aaron0018_1.jpg": (
        "about/portraet-aaron-bowser.webp",
        {
            "de": "Porträt von Aaron Bowser, Fotograf mit Studios in Hagen und Solingen.",
            "en": "Portrait of Aaron Bowser, photographer with studios in Hagen and Solingen.",
        },
    ),
    "business-portraits/portfolio/Thomas_Metzner_Business_64.jpg": (
        "business-portraits/portfolio/businessportrait-thomas-metzner.webp",
        {
            "de": "Business-Porträt von Thomas Metzner in dunkler Kleidung vor einem ruhigen Hintergrund.",
            "en": "Business portrait of Thomas Metzner in dark clothing against a quiet background.",
        },
    ),
    "real-estate/hero/1920×1080.png": (
        "real-estate/hero/immobilien-signet-ab-photography.webp",
        {
            "de": "Signet AB Photography für die Immobilienfotografie.",
            "en": "AB Photography mark for the real-estate work.",
        },
    ),
    "real-estate/hero/Immo_1920x1080_Schrift_farbig_Rot_bg copy 2.png": (
        "real-estate/hero/immobilienfotografie-nrw-hero.webp",
        {
            "de": "Schriftzug zur Immobilienfotografie von Aaron Bowser Photography in Nordrhein-Westfalen.",
            "en": "Title card for Aaron Bowser Photography real-estate work in North Rhine-Westphalia.",
        },
    ),
    "real-estate/hero/airportCity_d_149.jpg": (
        "real-estate/hero/immobilienfoto-airport-city.webp",
        {
            "de": "Immobilienfoto einer Gewerbefläche im Airport City.",
            "en": "Photograph of a commercial property at Airport City.",
        },
    ),
    "real-estate/hero/Westfalenstr. 23, Lüdenscheid_339 1.jpg": (
        "real-estate/hero/immobilienfoto-luedenscheid-westfalenstrasse.webp",
        {
            "de": "Immobilienfoto eines Objekts in der Westfalenstraße in Lüdenscheid.",
            "en": "Photograph of a property on Westfalenstraße in Lüdenscheid.",
        },
    ),
    "commercial/hero/landingPage1600.jpg": (
        "commercial/hero/commercial-fotografie-hero.webp",
        {
            "de": "Commercial-Fotografie von Aaron Bowser Photography.",
            "en": "Commercial photograph by Aaron Bowser Photography.",
        },
    ),
    "commercial/services/Beauty.jpg": (
        "commercial/services/beauty-fotografie.webp",
        {
            "de": "Beauty-Fotografie mit kontrolliertem Licht.",
            "en": "Beauty photograph made with controlled light.",
        },
    ),
    "commercial/services/Editorial.jpg": (
        "commercial/services/editorial-fotografie.webp",
        {
            "de": "Editorial-Aufnahme aus einer Commercial-Produktion.",
            "en": "Editorial frame from a commercial production.",
        },
    ),
    "commercial/services/Fashion_Photography.jpg": (
        "commercial/services/fashion-fotografie.webp",
        {
            "de": "Fashion-Fotografie mit Blick auf Schnitt und Haltung.",
            "en": "Fashion photograph focused on cut and posture.",
        },
    ),
    "commercial/services/Portraits_&_Model_Portfolios.jpg": (
        "commercial/services/portraet-und-modelportfolio.webp",
        {
            "de": "Porträt aus einem Model-Portfolio.",
            "en": "Portrait from a model portfolio.",
        },
    ),
    "commercial/services/Product_Photography.jpg": (
        "commercial/services/produktfotografie.webp",
        {
            "de": "Produktfotografie vor einem ruhigen Hintergrund.",
            "en": "Product photograph against a quiet background.",
        },
    ),
    "real-estate/services/Interior.jpg": (
        "real-estate/services/innenaufnahmen-immobilie.webp",
        {
            "de": "Innenaufnahme einer Immobilie mit Tageslicht.",
            "en": "Interior photograph of a property in daylight.",
        },
    ),
    "real-estate/services/exterior.jpg": (
        "real-estate/services/aussenaufnahmen-immobilie.webp",
        {
            "de": "Außenaufnahme einer Immobilie.",
            "en": "Exterior photograph of a property.",
        },
    ),
    "real-estate/services/twilight_sessions.jpg": (
        "real-estate/services/twilight-immobilie.webp",
        {
            "de": "Twilight-Aufnahme einer Immobilie in der Dämmerung.",
            "en": "Twilight photograph of a property at dusk.",
        },
    ),
    "real-estate/services/Agent_Branding.jpg": (
        "real-estate/services/makler-branding.webp",
        {
            "de": "Porträt für das Branding eines Maklers.",
            "en": "Portrait for an estate agent's branding.",
        },
    ),
    "real-estate/services/Drone_Photography.jpg": (
        "real-estate/services/drohnenfotografie-immobilie.webp",
        {
            "de": "Luftaufnahme einer Immobilie aus der Drohnenfotografie.",
            "en": "Aerial photograph of a property.",
        },
    ),
    "real-estate/services/360°_Virtual_Tours.png": (
        "real-estate/services/360-grad-rundgang.webp",
        {
            "de": "Vorschaubild eines 360-Grad-Rundgangs durch eine Immobilie.",
            "en": "Preview of a 360-degree tour through a property.",
        },
    ),
    "real-estate/services/Cinematic_Highlight_Videos.jpg": (
        "real-estate/services/highlight-video-immobilie.webp",
        {
            "de": "Standbild aus einem Highlight-Video einer Immobilie.",
            "en": "Still from a property highlight video.",
        },
    ),
    "real-estate/services/Digital_Room_Staging.jpg": (
        "real-estate/services/digitales-homestaging.webp",
        {
            "de": "Beispiel für digitales Homestaging eines Raums.",
            "en": "Example of digital staging in a room.",
        },
    ),
    "real-estate/services/staging-before.jpg": (
        "real-estate/services/homestaging-vorher.webp",
        {
            "de": "Raum vor dem digitalen Homestaging.",
            "en": "Room before digital staging.",
        },
    ),
    "real-estate/services/staging-after.jpg": (
        "real-estate/services/homestaging-nachher.webp",
        {
            "de": "Derselbe Raum nach dem digitalen Homestaging.",
            "en": "The same room after digital staging.",
        },
    ),
}

SUBJECTS = [
    ("cellavent", "Produktfoto für Cellavent", "Product photograph for Cellavent", "produktfoto-cellavent"),
    ("cellevant", "Produktfoto für Cellavent", "Product photograph for Cellavent", "produktfoto-cellavent"),
    ("elagance", "Produktfoto der Flasche Elegance", "Product photograph of the Elegance bottle", "produktfoto-elegance"),
    ("elegance", "Produktfoto der Flasche Elegance", "Product photograph of the Elegance bottle", "produktfoto-elegance"),
    ("whyk", "Fashion-Editorial für Why K", "Fashion editorial for Why K", "fashion-editorial-why-k"),
    ("delaurent", "Fashion-Editorial für DeLaurent", "Fashion editorial for DeLaurent", "fashion-editorial-delaurent"),
    ("darya", "Porträt von Darya Litviakova", "Portrait of Darya Litviakova", "portraet-darya-litviakova"),
    ("imanelle_beach", "Fashion-Aufnahme von Imanelle am Strand", "Fashion photograph of Imanelle on the beach", "fashion-imanelle-strand"),
    ("imanelle_produkt", "Produktfoto mit Imanelle", "Product photograph with Imanelle", "produktfoto-imanelle"),
    ("iman_beauty", "Beauty-Aufnahme von Iman", "Beauty photograph of Iman", "beauty-iman"),
    ("imanelle", "Fashion-Aufnahme von Imanelle", "Fashion photograph of Imanelle", "fashion-imanelle"),
    ("margarita", "Beauty-Aufnahme von Margarita Terpugova", "Beauty photograph of Margarita Terpugova", "beauty-margarita-terpugova"),
    ("marsela", "Fashion-Porträt von Marsela", "Fashion portrait of Marsela", "fashion-portraet-marsela"),
    ("naya", "Fashion-Porträt von Naya", "Fashion portrait of Naya", "fashion-portraet-naya"),
    ("nina", "Porträt von Nina", "Portrait of Nina", "portraet-nina"),
    ("jananeupert", "Business-Porträt von Jana Neupert", "Business portrait of Jana Neupert", "businessportrait-jana-neupert"),
    ("businessportrait", "Business-Porträt von Jana Neupert", "Business portrait of Jana Neupert", "businessportrait-jana-neupert"),
    ("carina", "Fashion-Editorial mit Carina Amber", "Fashion editorial with Carina Amber", "fashion-editorial-carina-amber"),
    ("alexandria", "Fashion-Porträt von Alexandria Allerding", "Fashion portrait of Alexandria Allerding", "fashion-portraet-alexandria-allerding"),
    ("carolinezoe", "Porträt von Caroline Zoe", "Portrait of Caroline Zoe", "portraet-caroline-zoe"),
    ("caroline", "Porträt von Caroline Zoe", "Portrait of Caroline Zoe", "portraet-caroline-zoe"),
    ("christoph", "Porträt von Christoph Ostenfelder", "Portrait of Christoph Ostenfelder", "portraet-christoph-ostenfelder"),
    ("julia", "Porträt von Julia", "Portrait of Julia", "portraet-julia"),
    ("lara", "Porträt von Lara", "Portrait of Lara", "portraet-lara"),
    ("monja", "Porträt von Monja", "Portrait of Monja", "portraet-monja"),
    ("peak", "Fashion-Aufnahme für Peak", "Fashion photograph for Peak", "fashion-peak"),
    ("diane", "Porträt von Diane", "Portrait of Diane", "portraet-diane"),
    ("lindaklein", "Fashion-Beauty-Aufnahme von Linda Klein", "Fashion beauty photograph of Linda Klein", "fashion-beauty-linda-klein"),
    ("sportfashion", "Fashion-Beauty-Aufnahme von Linda Klein", "Fashion beauty photograph of Linda Klein", "fashion-beauty-linda-klein"),
    ("racheal", "Fashion-Editorial mit Racheal Gausi-Höpfner", "Fashion editorial with Racheal Gausi-Hoepfner", "fashion-editorial-racheal-gausi-hoepfner"),
    ("gausi", "Fashion-Editorial mit Racheal Gausi-Höpfner", "Fashion editorial with Racheal Gausi-Hoepfner", "fashion-editorial-racheal-gausi-hoepfner"),
    ("severin", "Fashion-Aufnahme von Severin", "Fashion photograph of Severin", "fashion-severin"),
    ("valentina", "Fashion-Editorial der Kollektion Valentina", "Fashion editorial of the Valentina collection", "fashion-editorial-valentina"),
    ("gertrudes", "Porträt von Gertrudes", "Portrait of Gertrudes", "portraet-gertrudes"),
    ("high life", "Fashion-Editorial High Life", "High Life fashion editorial", "fashion-editorial-high-life"),
    ("highlife", "Fashion-Editorial High Life", "High Life fashion editorial", "fashion-editorial-high-life"),
    ("nikibeach", "Fashion-Editorial am Strand", "Fashion editorial on the beach", "fashion-editorial-strand"),
    ("emiliia", "Fashion-Editorial mit Emiliia", "Fashion editorial with Emiliia", "fashion-editorial-emiliia"),
    ("mafoudia", "Porträt von Dya Mafoudia", "Portrait of Dya Mafoudia", "portraet-dya-mafoudia"),
    ("djflvr", "Konzertfoto von DJ Flvr und dem One Violin Orchestra", "Concert photograph of DJ Flvr and the One Violin Orchestra", "konzertfoto-dj-flvr"),
    ("violin", "Konzertfoto von DJ Flvr und dem One Violin Orchestra", "Concert photograph of DJ Flvr and the One Violin Orchestra", "konzertfoto-dj-flvr"),
    ("alecia", "Porträt von Alecia", "Portrait of Alecia", "portraet-alecia"),
    ("minisession", "Porträt aus einer kurzen Studiosession", "Portrait from a short studio session", "portraet-studiosession"),
    ("imirage", "Editorial-Seite im Magazin IMIRAGE", "Editorial page in IMIRAGE magazine", "editorial-imirage"),
    ("mariam", "Hochzeitsfoto von Mariam", "Wedding photograph of Mariam", "hochzeitsfoto-mariam"),
]


def slugify(value: str) -> str:
    value = value.lower().replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("ß", "ss")
    value = unicodedata.normalize("NFKD", value)
    value = "".join(char for char in value if not unicodedata.combining(char))
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return re.sub(r"-+", "-", value).strip("-")


def ordinal(index: int, language: str) -> str:
    words = ORDINALS_DE if language == "de" else ORDINALS_EN
    if index < len(words):
        return words[index]
    return f"Aufnahme {index + 1}" if language == "de" else f"Photograph {index + 1}"


def sentence(base: str, index: int, total: int, language: str) -> str:
    text = base if base.endswith(".") else f"{base}."
    if total == 1:
        return text
    word = ordinal(index, language)
    if language == "de":
        head = base.split()[0].lower()
        feminine = head.endswith("aufnahme") or head.endswith("seite")
        feminine_map = {
            "Erstes": "Erste",
            "Zweites": "Zweite",
            "Drittes": "Dritte",
            "Viertes": "Vierte",
            "Fünftes": "Fünfte",
            "Sechstes": "Sechste",
            "Siebtes": "Siebte",
            "Achtes": "Achte",
            "Neuntes": "Neunte",
            "Zehntes": "Zehnte",
            "Elftes": "Elfte",
            "Zwölftes": "Zwölfte",
        }
        if feminine and word in feminine_map:
            word = feminine_map[word]
        return f"{word} {text[0].upper() + text[1:]}"
    return f"{word} {text[0].lower() + text[1:]}"


def property_copy(stem: str) -> tuple[str, str, str] | None:
    low = slugify(stem)
    streets = [
        ("rummenohler", "Immobilienfoto eines Objekts in der Rummenohler Straße in Hagen", "Photograph of a property on Rummenohler Straße in Hagen", "immobilienfoto-hagen-rummenohler-strasse"),
        ("schlossstr", "Immobilienfoto eines Objekts in der Schlossstraße in Arnsberg", "Photograph of a property on Schlossstraße in Arnsberg", "immobilienfoto-arnsberg-schlossstrasse"),
        ("schloss10", "Immobilienfoto eines Objekts am Schloss in Hamm", "Photograph of a property by the Schloss in Hamm", "immobilienfoto-hamm-schloss"),
        ("vereinstr", "Immobilienfoto eines Objekts in der Vereinsstraße in Krefeld", "Photograph of a property on Vereinsstraße in Krefeld", "immobilienfoto-krefeld-vereinsstrasse"),
        ("westfalen", "Immobilienfoto eines Objekts in der Westfalenstraße in Lüdenscheid", "Photograph of a property on Westfalenstraße in Lüdenscheid", "immobilienfoto-luedenscheid-westfalenstrasse"),
        ("wilhelm-busch", "Immobilienfoto eines Objekts in der Wilhelm-Busch-Straße", "Photograph of a property on Wilhelm-Busch-Straße", "immobilienfoto-wilhelm-busch-strasse"),
        ("kronen", "Immobilienfoto eines Objekts in der Kronenstraße in Dortmund", "Photograph of a property on Kronenstraße in Dortmund", "immobilienfoto-dortmund-kronenstrasse"),
        ("bockeldamm", "Immobilienfoto eines Objekts am Bockeldamm in Bönen", "Photograph of a property on Bockeldamm in Bönen", "immobilienfoto-boenen-bockeldamm"),
        ("dieringhauser", "Immobilienfoto eines Objekts in der Dieringhauser Straße", "Photograph of a property on Dieringhauser Straße", "immobilienfoto-dieringhauser-strasse"),
        ("reitweg", "Immobilienfoto eines Objekts am Reitweg in Dortmund", "Photograph of a property on Reitweg in Dortmund", "immobilienfoto-dortmund-reitweg"),
        ("oenekinger", "Immobilienfoto eines Objekts am Önekinger Weg in Lüdenscheid", "Photograph of a property on Önekinger Weg in Lüdenscheid", "immobilienfoto-luedenscheid-oenekinger-weg"),
        ("airport", "Immobilienfoto einer Gewerbefläche im Airport City", "Photograph of a commercial property at Airport City", "immobilienfoto-airport-city"),
        ("badezimmer", "Innenaufnahme eines Badezimmers", "Interior photograph of a bathroom", "innenaufnahme-badezimmer"),
        ("dji", "Luftaufnahme einer Immobilie", "Aerial photograph of a property", "luftaufnahme-immobilie"),
    ]
    for key, de, en, filename in streets:
        if key in low:
            return de, en, filename
    return None


def commercial_copy(stem: str) -> tuple[str, str, str]:
    compact = slugify(stem).replace("-", "")
    low = stem.lower()
    for key, de, en, filename in SUBJECTS:
        if key.replace("-", "") in compact or key in low:
            return de, en, filename
    number = re.findall(r"\d{3,}", stem)
    marker = number[-1] if number else slugify(stem)[:24]
    return (
        f"Porträtaufnahme aus dem Archiv, Nummer {marker}",
        f"Portrait from the archive, number {marker}",
        f"portraet-archiv-{marker}",
    )


def describe(relative: str) -> tuple[str, str, str]:
    path = Path(relative)
    if relative.startswith("wedding/"):
        return commercial_copy(path.stem)
    if relative.startswith("real-estate/portfolio/"):
        found = property_copy(path.stem)
        if found:
            return found
        return (
            "Immobilienfoto aus dem Portfolio",
            "Property photograph from the portfolio",
            f"immobilienfoto-{slugify(path.stem)[:40]}",
        )
    if relative.startswith("commercial/portfolio/"):
        return commercial_copy(path.stem)
    return (
        "Fotografie von Aaron Bowser Photography",
        "Photograph by Aaron Bowser Photography",
        slugify(path.stem)[:48],
    )


def save_webp(image: Image.Image, destination: Path, max_side: int) -> None:
    prepared = image
    if prepared.mode not in ("RGB", "RGBA"):
        prepared = prepared.convert("RGBA" if "A" in prepared.getbands() else "RGB")
    longest = max(prepared.size)
    if longest > max_side:
        scale = max_side / longest
        prepared = prepared.resize(
            (max(1, int(prepared.width * scale)), max(1, int(prepared.height * scale))),
            Image.Resampling.LANCZOS,
        )

    quality = 78
    width, height = prepared.size
    while True:
        buffer = BytesIO()
        prepared.save(buffer, format="WEBP", quality=quality, method=6)
        if buffer.tell() <= MAX_BYTES or (quality <= 45 and max(width, height) <= 900):
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(buffer.getvalue())
            return
        if quality > 45:
            quality -= 6
            continue
        width = int(width * 0.85)
        height = int(height * 0.85)
        prepared = prepared.resize((max(1, width), max(1, height)), Image.Resampling.LANCZOS)


def iter_sources() -> list[Path]:
    files: list[Path] = []
    for path in PUBLIC.rglob("*"):
        if not path.is_file() or path.name.startswith("."):
            continue
        if path.suffix.lower() in {".mp4", ".mov", ".webm", ".json"}:
            continue
        if "og" in path.parts:
            continue
        files.append(path)
    return files


def build_plan() -> list[tuple[Path, Path, dict[str, str]]]:
    groups: dict[str, list[tuple[Path, str, str, str]]] = {}
    explicit_plan: list[tuple[Path, Path, dict[str, str]]] = []

    for source in iter_sources():
        relative = source.relative_to(PUBLIC).as_posix()
        if relative in EXPLICIT:
            target, alt = EXPLICIT[relative]
            explicit_plan.append((source, PUBLIC / target, alt))
            continue
        de, en, filename = describe(relative)
        folder = source.parent.relative_to(PUBLIC).as_posix()
        groups.setdefault(f"{folder}/{filename}", []).append((source, de, en, filename))

    planned: list[tuple[Path, Path, dict[str, str]]] = list(explicit_plan)
    for key, items in groups.items():
        folder, filename = key.rsplit("/", 1)
        total = len(items)
        for index, (source, de, en, _) in enumerate(sorted(items, key=lambda item: item[0].name)):
            suffix = f"-{index + 1}" if total > 1 else ""
            target = PUBLIC / folder / f"{filename}{suffix}.webp"
            planned.append(
                (
                    source,
                    target,
                    {"de": sentence(de, index, total, "de"), "en": sentence(en, index, total, "en")},
                )
            )
    return planned


def font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for candidate in (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ):
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def write_og_image(source: Path) -> None:
    image = Image.open(source).convert("RGB")
    target_ratio = 1200 / 630
    width, height = image.size
    if width / height > target_ratio:
        new_width = int(height * target_ratio)
        left = (width - new_width) // 2
        image = image.crop((left, 0, left + new_width, height))
    else:
        new_height = int(width / target_ratio)
        top = (height - new_height) // 2
        image = image.crop((0, top, width, top + new_height))
    image = image.resize((1200, 630), Image.Resampling.LANCZOS)
    image = ImageEnhance.Brightness(image).enhance(0.72)
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for row in range(260):
        alpha = int(150 * (row / 260))
        draw.line([(0, 630 - row), (1200, 630 - row)], fill=(0, 0, 0, alpha))
    image = Image.alpha_composite(image.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(image)
    draw.text((56, 470), "Aaron Bowser Photography", font=font(42), fill=(244, 241, 237))
    draw.text((56, 530), "Studios in Hagen und Solingen", font=font(28), fill=(244, 241, 237))
    destination = PUBLIC / "og" / "aaron-bowser-photography-hagen-solingen.jpg"
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, format="JPEG", quality=82, optimize=True)


def main() -> None:
    Image.MAX_IMAGE_PIXELS = None
    og_source = PUBLIC / "real-estate/hero/Westfalenstr. 23, Lüdenscheid_339 1.jpg"
    write_og_image(og_source)
    plan = build_plan()
    alts: dict[str, dict[str, str]] = {}
    written: list[Path] = []
    for source, target, alt in plan:
        if target.exists() and target.resolve() != source.resolve():
            raise SystemExit(f"Target already exists: {target}")
        with Image.open(source) as image:
            image.load()
            max_side = 640 if "logo" in target.parts else 1600
            save_webp(image, target, max_side)
        alts["/" + target.relative_to(PUBLIC).as_posix()] = alt
        written.append(source)
        print(f"{source.relative_to(PUBLIC)} -> {target.relative_to(PUBLIC)} ({target.stat().st_size // 1024} KB)", flush=True)

    targets = {target.resolve() for _, target, _ in plan}
    for source in written:
        if source.resolve() not in targets and source.exists():
            source.unlink()

    ALT_PATH.write_text(json.dumps(alts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(alts)} alt texts")


if __name__ == "__main__":
    main()
