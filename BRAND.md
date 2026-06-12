# samuelcallahan.live — Brand Styles

Single source of truth for fonts, colors, and type scale. The implementation lives in `assets/brand.css`; link it on every page:

```html
<link rel="stylesheet" href="/assets/brand.css">
```

## Fonts

| Role | Family | Weight | Fallback |
|------|--------|--------|----------|
| Headings (h1–h5) | IM Fell Great Primer | 400 | Georgia, serif |
| Body | Noto Sans Meetei Mayek | 400 | system sans-serif |

Load via Google Fonts css2 API:

```css
@import url('https://fonts.googleapis.com/css2?family=IM+Fell+Great+Primer&family=Noto+Sans+Meetei+Mayek:wght@400&display=swap');
```

> **Note:** IM Fell Great Primer ships in weight 400 only — Google Fonts has no 700.
> Requesting `:700` via the old API silently drops the family entirely (verified
> 2026-06-11), so headings use 400. Do not "fix" this back to 700.

## Colors

| Token | Hex | Use |
|-------|-----|-----|
| `--text` | `#0d0604` | Body and heading text |
| `--background` | `#fefbfa` | Page background |
| `--primary` | `#cc6646` | Primary actions, links, emphasis |
| `--secondary` | `#9ae3b9` | Secondary surfaces, highlights |
| `--accent` | `#62bed4` | Accents, decorative touches |

## Type Scale

1.333 ratio (perfect fourth), 16px base (`html { font-size: 100% }`):

| Element | Size |
|---------|------|
| h1 | 4.210rem (67.36px) |
| h2 | 3.158rem (50.56px) |
| h3 | 2.369rem (37.92px) |
| h4 | 1.777rem (28.48px) |
| h5 | 1.333rem (21.28px) |
| body | 1rem (16px) |
| small | 0.750rem (12px) |
