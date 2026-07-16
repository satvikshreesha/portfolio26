# Portfolio Project — Agent Context

> **Read this file first.** Every Cursor agent working in this repo should treat this as the source of truth for goals, positioning, constraints, and taste — before proposing structure, visuals, or code.

---

## Owner

**Satvik Shreesha** — product designer based in Seattle, WA.

| | |
|---|---|
| **Email** | shreeshasatvik@gmail.com |
| **LinkedIn** | https://www.linkedin.com/in/satvik-shreesha/ |
| **X / Twitter** | `[TBD — add handle before publish]` |
| **Education** | Human Centered Design & Engineering (HCDE) @ UW Seattle |
| **Currently** | Incoming product design intern @ **Databricks** |
| **Seeking** | Design internships — Winter, Spring, Summer **2026** |

---

## Project intent

Build a **new** portfolio from scratch in this repo. The old site ([satvikshreesha.com](https://satvikshreesha.com)) is **abandoned** — do not copy its information architecture, Framer structure, or page layout. You may reuse **factual content** (employer names, project summaries, bio facts) as raw material for the new site.

This portfolio is **intentionally techy / dev-forward**. Satvik is positioning as a **product designer who ships in code** — not a designer who only hands off Figma files.

---

## Target audience (who is evaluating this)

Primary companies Satvik wants to work at:

| Company | What they will look for |
|---------|-------------------------|
| **Cursor** | Code-native craft, systems thinking, agent-era workflow, taste in tool UI, no generic AI output |
| **Vercel** | Next.js fluency, performance, interaction details, design-engineering evidence |
| **Cognition** | AI product thinking, complex workflow design, clarity under ambiguity |
| **Databricks** | Enterprise AI UX, trust/error states, data-dense interfaces (current employer — see constraints below) |

Secondary: other AI-native and developer-tool companies hiring product design interns for 2026.

**Assume reviewers are senior designers and design engineers** who will click everything, inspect motion, check mobile, and notice AI slop instantly.

---

## Positioning statement

Use this framing consistently across copy and design decisions:

- Satvik is a **product designer** with a **systems-thinking** approach who builds and refines **in code**.
- Strengths: **enterprise AI UX**, **trust & error diagnosis**, **workflow unification**, **design community leadership**.
- Differentiator: comfortable with **Figma, Paper, Cursor, and AI coding tools** (v0, etc.) — designs for how products actually **feel** in production, not just how they look in mocks.
- Tone: confident, precise, human — not corporate, not hype-y, not “AI magic” marketing speak.

**One-line bio (starting point — refine in code, not in docs):**
> Product designer building AI and developer-facing experiences. Incoming @ Databricks. HCDE @ UW Seattle.

---

## Visual & interaction direction

**Chosen direction: dark, dev-tool aesthetic** (Cursor / Vercel / terminal-inspired).

### Do

- Dark-first UI with intentional light mode only if well-executed
- Strong typography pairing (grotesk + mono is a safe default)
- Restrained color — one accent, used sparingly
- Motion with purpose: staggered reveals, scroll-linked storytelling, micro-interactions on hover/focus
- Respect `prefers-reduced-motion`
- Performance-conscious — lazy-load heavy assets; aim for solid Lighthouse scores
- Show **interaction craft** — the site itself is the primary portfolio piece

### Do not

- Generic “designer portfolio” tropes: purple gradients, glassmorphism soup, Inter + blob hero
- Stock AI layout patterns (“Product designer passionate about creating delightful experiences”)
- Over-animated pages that sacrifice readability or accessibility
- Copying old satvikshreesha.com layout or Framer patterns

### Reference creators (taste north stars — not templates to clone)

| Person | Take from them |
|--------|----------------|
| **Michael Riddering** | Ideate loose in Paper/Figma → scaffold in code → dial motion & visuals in the browser; organized Figma when using MCP |
| **Ryo Lu** | Start small, sculpt in code, systems/primitives over screens, avoid AI slop through constraints and taste |
| **Rauno Freiberg** | Interaction details as the portfolio; depth over breadth; code-native prototyping |

---

## Experience & content inventory

Use these as **factual source material**. Structure, page names, and presentation are **not decided** — agents should not assume HOME / WORK / LAB / ABOUT from the old site.

### Current & upcoming roles

| Role | Org | When | Portfolio treatment |
|------|-----|------|---------------------|
| Product Design Intern (incoming) | **Databricks** | 2026 | **Tease only** — role + company OK; **no case study, no internal work, no screenshots** until cleared |
| Product Design Intern | **Observe.AI** (YC W18) | 2025 | Primary case-study candidate |
| Product Design Intern | **Alignment.io** | 2024 | Case-study candidate |
| UX Designer | **UW ARC Lab** | 2025 | Optional — include if strong |
| UX Designer | **EAT TOGETHER** | 2024 | Optional — include if strong |

### Community & leadership

- **Figma Campus Leader @ UW** — connected fragmented design community across 4+ majors; hackathons, speaker events with Figma for Edu
- **President, Theta Tau** (UW professional engineering fraternity) — committees, events, professional development
- **Lavin Entrepreneurship Cohort 2024** — co-built **Trace**, an AI-powered Finder extension for file management
- **UW Product Space** — upleveling client products

### Flagship project summaries (from prior site — expand with Satvik’s input)

**Observe.AI — Internal Preview & Error Diagnosis Tool**
Building customer trust in Observe.AI’s flagship AI Copilot through an internal preview and error diagnosis tool.

**Observe.AI — Dynamic AI Copilot**
Shaping a dynamic AI copilot to boost call center agent performance.

**Alignment.io — Unified Workspace Dashboard**
Bridging a fragmented quarterly workflow with a unified workspace dashboard.

### Personal context (for About / personality — use lightly)

- Systems thinker; design as natural extension of who he is
- Creative outside UX: doodling, digi-cam vlogs, home decoration content
- Hobbies: PNW/CA hikes, music & concerts, food & cooking, exploring Seattle

---

## Technical defaults (unless Satvik overrides in chat)

Recommended stack for this positioning:

| Layer | Default |
|-------|---------|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Motion | Motion (Framer Motion); GSAP only if scroll timelines need it |
| Deploy | Vercel |
| Content | MDX or local JSON for case studies |

Agents should match existing conventions in the repo once initialized. Do not introduce alternate frameworks without explicit approval.

---

## Cursor workflow expectations

Satvik is newer to Cursor at portfolio scale. Agents should **teach by doing** and keep changes scoped.

### How to work in this repo

1. **Read AGENTS.md** before non-trivial work
2. **Plan before big builds** — outline approach; don’t rewrite the whole site in one pass
3. **Scope prompts tightly** — one section or component per task when possible
4. **Commit logically** — one commit per meaningful unit (Satvik will commit; suggest commit messages)
5. **Run locally** — design in the browser; motion only counts when felt live
6. **Reference files with `@`** in chat when asking Satvik to prompt

### Scope discipline

- Never assume additional product, content, copy, or portfolio sections unless Satvik explicitly asks for them.
- Build one thing at a time. If Satvik asks to experiment with a background, component, or aesthetic detail, implement only that requested piece.
- Do not turn visual exploration prompts into broader homepage, IA, case-study, or portfolio-content work unless requested.

### Version control habits

- Git is the source of truth for history
- Before risky refactors, note that Satvik should commit first
- Prefer small diffs over sweeping rewrites

### Figma & Paper

- **Figma** — exploration + structured specs for MCP handoff (named layers, auto layout)
- **Paper** — early directional ideation, whiteboard-quality
- **Code** — final authority on motion, interaction, and feel

---

## Hard constraints

| Constraint | Rule |
|------------|------|
| Old site | Do **not** replicate satvikshreesha.com structure or Framer setup |
| Databricks | **Tease only** — no case study content, no confidential UI |
| AI slop | No generic layouts, purple gradients, or placeholder lorem — use real copy from this doc |
| Scope creep | Don’t add CMS, auth, blog, or features Satvik didn’t ask for |
| Commits | Don’t commit unless Satvik explicitly asks |
| Secrets | Never commit `.env`, API keys, or private employer assets |

---

## Success criteria

The portfolio is successful when:

1. A Cursor or Vercel designer opens it and thinks **“this person ships”** within 10 seconds
2. At least **one interaction** on the site is memorable and technically intentional
3. **2 strong case studies** (likely Observe.AI + Alignment.io) tell clear problem → process → outcome stories
4. The site is **fast, accessible, and mobile-solid**
5. Satvik can **iterate in Cursor** without agents losing context — because this file stays current

---

## Open decisions (agents: propose, don’t assume)

- Exact site IA and navigation
- X / Twitter handle
- Which optional projects (ARC Lab, EAT TOGETHER, Trace, Lab experiments) make the cut
- Custom domain and old URL redirect strategy
- Whether to include resume PDF inline or as download only

When proposing options, give **2–3 directions with tradeoffs** — don’t pick silently.

---

## Keeping this file current

Satvik or any agent should update AGENTS.md when:

- Positioning, target companies, or aesthetic direction changes
- Databricks work becomes publishable
- New internships, projects, or links are added
- Tech stack decisions are finalized

Last updated: **July 5, 2026**
