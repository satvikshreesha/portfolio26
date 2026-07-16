# Design System

This file is the human-readable companion to the CSS custom properties in `app/globals.css`. When adding components or translating Paper designs into code, prefer these tokens before introducing new colors, type sizes, spacing, radii, or shadows.

## Principles

- Use the 35px tile as the default spatial unit when discussing grid placement and dimensions.
- Consolidate near-identical values instead of adding tiny variations.
- Add a new token only when the existing tokens cannot describe the intended role.
- Keep `DESIGN_SYSTEM.md` and `app/globals.css` in sync when tokens change.

## Colors

| Token | Value | Use |
| --- | --- | --- |
| `--background` | `#121212` | Main page background and base tile color |
| `--foreground` | `#ededed` | Primary body text |
| `--muted` | `#8f8f8f` | Secondary text and quiet metadata |
| `--hairline` | `#1c1c1c` | Grid strokes and low-contrast outlines |
| `--surface-raised` | `#000000` | Floating nav panels and raised controls |
| `--accent-surface` | `#221a19` | Active nav item background |
| `--accent` | `#fb7866` | Active nav label and future primary accents |
| `--text-nav` | `#aaaaaa` | Inactive nav item text |
| `--text-nav-active` | `#cccccc` | Active primary nav text and inactive primary nav hover text |
| `--border-raised` | `#444444` | Inner outlines on raised surfaces |
| `--hero-foreground` | `#faf3f3` | Hero intro text |
| `--hero-divider` | `#747474` | Hero intro rule |
| `--code-tag-surface` | `#2d2d2d` | Neutral code-tag container |
| `--code-tag-icon-surface` | `#868686` | Neutral code-tag icon tile |
| `--databricks-surface` | `#752c33` | Databricks badge container |
| `--databricks-red` | `#e23c2c` | Databricks mark background |
| `--databricks-text` | `#efddda` | Databricks badge text |

### Color Notes

- Paper used `#8C8786` for secondary nav text. Use `--muted` instead; it is visually close enough and avoids another grey token.
- The grid off-tile colors currently live in the `Grid Background` DialKit defaults: `#131111` and `#16161d`. Promote them to tokens only if they are reused outside the generated grid.

## Typography

| Token | Value | Use |
| --- | --- | --- |
| `--font-mono` | `JetBrains Mono`, `system-ui`, `sans-serif` | Navigation, labels, developer-tool UI, code-like interface text |
| `--font-sans` | `Inter`, `system-ui`, `sans-serif` | Hero intro and future editorial copy |

| Size | Value | Use |
| --- | --- | --- |
| Nav label | `16px / 20px` | Top navigation labels and compact metadata |
| Hero intro | `tileSize × 0.69 / tileSize × 0.86` | Hero title and body copy |

## Spacing

| Token | Value | Use |
| --- | --- | --- |
| `--tile` | `35px` | Default grid unit and square width/height |
| `--nav-height` | `43px` | Default fixed top nav height, derived from nav padding controls |

| Value | Use |
| --- | --- |
| `tileSize × 0.07` | Outer raised-control padding |
| `0px`, `tileSize × 0.59` | Default inner nav capsule padding |
| `7px`, `tileSize × 3` | Default nav bar page padding |
| `tileSize × 1` | Primary nav grouping gap |
| `tileSize × 1.27` | Work/Lab/Me capsule spacing |
| `tileSize × 1.56` | TLDR capsule internal spacing |

## Radius

| Token | Value | Use |
| --- | --- | --- |
| `--radius-sm` | `8px` | Inner controls |
| `--radius-md` | `11px` | Outer raised control shells |

## Shadows

| Token | Value | Use |
| --- | --- | --- |
| `--shadow-float` | `#00000033 0px 0px 12px 4px` | Floating nav cluster shadow |

## Components

### Grid Background

| Property | Value |
| --- | --- |
| Columns | Minimum `80`; expands to viewport width plus four overflow columns |
| Rows | Minimum `60`; expands if page content requires more vertical grid coverage |
| Tile size | Fixed at `35px` |
| Position | Starts below fixed nav and scrolls with content |
| Base tile | `#121212` |
| Off tile 1 | `#131111` |
| Off tile 2 | `#16161d` |
| Stroke | `#1c1c1c` |
| Fade overlay | Enabled on Work; disabled on Lab and Me so the grid stays visible through the viewport |
| Persistence | Generated background cells are not persisted to storage; the grid is decorative and route transitions should avoid large JSON writes |

### Top Nav

| Property | Value |
| --- | --- |
| Height | `43px` default, derived from the `Navbar` padding controls |
| Position | Fixed top |
| Background | `--background` |
| Outer outline | `2px solid --hairline` |
| Font | `--font-mono` |
| Primary routes | Work `/`, Lab `/lab`, Me `/me` |
| Active state | `--hairline` background, `--text-nav-active` text |
| Inactive state | `--text-nav` text |
| Inactive hover | `--text-nav-active` text, no fill |
| Secondary links | `--muted` text |
| Secondary link hover | Dashed underline using the link's current text color |
| Home mark | `SVK` in `--font-sans` at nav-label size by default; DialKit can restore the original overlapping squares |
| Active highlight motion | Shared Motion layout transition, disabled when the `Navbar` DialKit toggle is off or reduced motion is requested |
| Active highlight response | Primary nav updates optimistically on click so the highlight does not wait for heavier page content to mount |

### Hero Intro

| Property | Value |
| --- | --- |
| Position | Normal vertical page flow over scrolling grid |
| Default horizontal alignment | Nav page inset, aligned to the nav button's left edge |
| Default vertical offset | `navHeight + tileSize × 2.25` |
| Body line nudge | `tileSize × 0.25` default transform offset |
| Role line nudge | `tileSize × 0.15` default transform offset |
| Font | `--font-sans` |
| Code-tag label font | `--font-mono` |
| Text | `--hero-foreground` |
| Divider | `--hero-divider` |
| Code-tag surface | `--code-tag-surface` |
| Code-tag icon surface | `--code-tag-icon-surface` |

### Case Studies

| Property | Value |
| --- | --- |
| Position | Normal vertical page flow over fixed grid |
| Default horizontal alignment | Nav page inset |
| Default vertical offset | `navHeight + tileSize × 9` |
| Header font | `--font-mono` |
| Description/card title font | `--font-sans` |
| Company logos | Supplied standalone square assets, displayed at `tileSize × 0.54` without an additional badge wrapper |
| Placeholder images | Existing foreground/muted/hairline tokens, no extra image token |
| Project rows | Horizontally scroll within the viewport, scrollbars hidden |
| Cover images | Served through Next image optimization at the rendered card size |

### DialKit Controls

| Panel | Controls |
| --- | --- |
| `Navbar` | Nav vertical padding, outer shell padding, inner capsule vertical padding, item vertical padding, SVK/original home-mark toggle, and active-highlight motion toggle |

## Adding Tokens

Before adding a value:

1. Check whether an existing token already matches the role.
2. If a Paper export has a near-match, prefer the closest existing token unless the visual difference is intentional.
3. If a new token is needed, add it to `app/globals.css` and document it here in the correct section.
4. Name tokens by role, not by color appearance. Prefer `--accent` over `--coral`.
