---
name: design-tokens
description: Check and maintain the portfolio design token system. Use when implementing new components, translating Paper/Figma designs into code, changing colors, typography, spacing, radii, shadows, or adding component-level visual values.
---

# Design Tokens

## Instructions

Before adding visual values to the portfolio:

1. Read `DESIGN_SYSTEM.md`.
2. Check `app/globals.css` for existing CSS custom properties.
3. Use existing tokens when the role matches, including close visual matches.
4. Avoid adding tiny variations of greys, borders, radii, shadows, or type sizes.
5. If a new token is truly needed, propose the token name, value, and use before hardcoding it.
6. When adding a token, update both `app/globals.css` and `DESIGN_SYSTEM.md`.

## Token Preference

Prefer role-based tokens:

- Good: `--accent`, `--surface-raised`, `--border-raised`
- Avoid: `--orange`, `--black-panel`, `--grey-444`

## Paper-To-Code Workflow

When a Paper export includes inline values:

1. Map every repeated color, font, spacing value, radius, and shadow to the closest existing token.
2. Preserve values only when they are structurally important, like the 35px tile unit.
3. Document any intentional consolidation in `DESIGN_SYSTEM.md`.

Example: Paper's `#8C8786` secondary nav text should use `--muted` instead of becoming a new grey token.
