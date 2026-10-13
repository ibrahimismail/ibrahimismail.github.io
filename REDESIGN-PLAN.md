# First Run — ibrahimismail.dev redesign plan

> A complete rewrite of the personal portfolio at `ibrahimismail.dev`. One concept, specified
> end to end: data model, mechanics, design tokens, media prompts, budgets, phases.
>
> Branch `redesign`. Written 2026-10-13.

---

## 0. State of this branch

The repo was emptied and re-scaffolded. `main` still holds the old React/Vite site in full, so
nothing is lost — anything from it is one `git checkout main -- <path>` away.

**In place and verified building:**

```
astro.config.mjs      Astro 6 · Cloudflare adapter · sitemap · build.format 'file'
wrangler.jsonc        Workers config, assets from ./dist, observability on
package.json          astro 6.4 · @astrojs/cloudflare 13.6 · tailwindcss 4.3 · wrangler 4.96
tsconfig.json         astro/tsconfigs/strict
src/styles/global.css palette tokens (both themes), motion tokens, reveal utilities, rm kill switch
src/lib/theme.ts      preference → resolved theme, localStorage, theme-color
src/components/       Head.astro (meta + Person/WebSite JSON-LD), ThemeScript.astro
src/layouts/Base.astro
src/content/          profile.ts, types.ts
src/pages/index.astro masthead real, five section anchors stubbed
public/               favicons, apple-touch-icon, CV pdf, robots.txt, _headers
```

Carried over from the old `public/`: the five favicon files, the apple-touch icon, and
`Ibrahim_Ismail_CV.pdf`. Dropped: `CNAME` (GitHub Pages only — the domain is Cloudflare's now),
`sitemap.xml` (generated), `thumbnail.png` (the OG image gets rendered from code, §10.6).

**Measured on the scaffold:** HTML 2.5 kB gzip · CSS 6.0 kB gzip · 0 kB JS · build 3.5 s.

**Not done yet:** everything in §14 phases 1–4.

---

## 1. Where we came from

| | Old site (`main`) |
|---|---|
| Stack | React 19 + Vite 6 + Tailwind 3 + framer-motion 12, 437-line `App.tsx` |
| Deploy | `gh-pages -d dist` → GitHub Pages, `CNAME` → `ibrahimismail.dev` |
| Content | `src/constants.tsx` — profile, one venture, 3 roles, 2 degrees, 20 skills |
| Design | 5 centered `<section>`s, glass cards, `#38bdf8 → #818cf8` gradient headline |

The content was strong: a Manifest V3 re-architecture, a Swift native bridge, key generation /
exchange / rotation, a scope-evaluation engine, a 10× vault scale-up, an 8× build speed-up, an
acquisition. The design was the weak part — and worse, it flattened all of that into bullet lists
that looked exactly like everyone else's bullet lists. A recruiter skimmed it and learned
"React, Vue, Node". Nothing on the page was hard to produce, so nothing on the page was evidence.

**The goal of the rewrite is not decoration. It is to make the page itself the evidence.**

---

## 2. The concept

### The site does not load. It gets built, in front of the visitor, by an agent.

A cold visit lands on a near-black canvas: one prompt bar, a cursor, nothing else. A line of
intent types itself —

```
build: senior engineer portfolio  ·  target: frontend architecture
```

— then an agent loop runs **visibly**. A short plan. Then tool calls streaming as cards:

```
⏺ Read   content/experience.ts            3 roles · 16 systems
⏺ Write  sections/Timeline.astro          +312 −0
⏺ Bash   npm run build                    ✓ 6 pages · 94 kB js
```

As each call completes, **that part of the page materializes underneath the transcript.** The
masthead sets. The timeline unrolls. The system diagram wires itself up, node by node. After
~7 seconds the transcript dissolves and you are inside a finished, quiet, precisely typeset
portfolio — with the prompt bar still parked at the bottom, now a working command palette.

### The agent is scripted. 100%.

No API call, no key, no token cost, no latency, no hallucination, no failure mode. Byte-identical
on every visit, works offline, runs on a plane. It is a choreography engine playing an authored
timeline — and that is a feature, not a cheat: a recruiter must never watch your portfolio
rate-limit itself.

### Why this, specifically

Every "AI-age" portfolio shipped in 2025 bolted a chatbot onto a CV template — *ask my AI twin*.
That is now the cliché, it is slow, and it inserts a stochastic layer between a hiring manager
and your facts. Meanwhile your own CV says you introduced agent workflows, agent skills and MCP
servers to your team. So the honest move is not *talking to an AI on your site*. It is that
**your site is the artifact of an agent build** — the form matches the work.

And it cannot be templated. A build sequence that stays readable, skippable, 60fps, SEO-intact
and accessible is a real engineering problem. Solving it in public *is* the portfolio piece.

### Name

**First Run.** The first run builds itself; every run after is instant. Double meaning intended.

---

## 3. The contract (this is the part that makes it good instead of annoying)

Non-negotiable. Everything flashy is an *enhancement layer* over a plain, complete, well-set
document. Specifically:

1. **The full document ships in the HTML.** Every word of the CV is in the initial response,
   semantically marked up, before one byte of JS executes. The build sequence is an overlay over
   a page that is already finished.
2. **No-JS gets the whole site.** Reveal styles only apply under `html.js-build`, set by a tiny
   inline head script. No JS → no class → nothing is hidden. *(Already wired in the scaffold:
   `ThemeScript.astro` + the `.js-build` utilities in `global.css`.)*
3. **Any input skips it.** Scroll, click, tap, keypress, ESC → transcript dissolves in 240ms and
   the page is live. Plus a persistent `Skip ⏎` affordance from t=0.
4. **Once only.** `sessionStorage` + a 7-day `localStorage` stamp. Repeat visitors land straight
   on the finished page with a small `↻ replay build` in the footer. `?skip=1` for links you send.
5. **`prefers-reduced-motion` → no sequence at all.** Not a faster sequence. None. The finished
   page, immediately, with no loss of content.
6. **Select-all copies clean text.** No decorative characters, no duplicated labels, no
   `::before` content carrying meaning.
7. **`⌘P` prints a real two-page CV.** Covered in §12.
8. **Touch parity.** Every interactive (diagram, diff, demo, palette) is usable with a thumb.
   Nothing hover-only, nothing drag-only.
9. **Budgets are enforced, not vibes.** §11.

If a feature cannot satisfy all nine, it does not ship.

---

## 4. Information architecture

Single scrolling document, real anchors, five acts.

```
/                      the site
  #build               act 0 — the agent build (overlay, not a section)
  #masthead            act 1 — who, one line of what, status, ways in
  #timeline            act 2 — career as a commit log
  #systems             act 3 — the three interactive system pieces
  #stack               act 4 — what he reaches for, honestly tiered
  #instruments         act 5 — live numbers of this page + career numbers
  #contact             ship it
/cv                    print-optimised route (also what ⌘P produces from /)
/replay                deep link that forces the build sequence
```

No multi-page navigation, no router. One document means the command palette can address
everything, and print gets the whole career in one pass.

---

## 5. Act by act

### Act 0 — The build overlay

**Layout.** Fixed full-viewport layer, `z-50`, near-black with a grain substrate. Transcript
column max 720px, left-aligned, bottom-anchored so new lines push up (terminal behaviour, not
chat behaviour). Prompt bar pinned at the bottom with a blinking block cursor.

**Content, as authored steps** (~7.2s total):

| t (ms) | Step | Reveals |
|---|---|---|
| 0 | prompt types `build portfolio --target=frontend-architecture` | — |
| 900 | `plan` — 4 short lines | — |
| 1600 | `Read content/profile.ts` | `#masthead` |
| 2400 | `Write sections/Timeline.astro` `+312 −0` | `#timeline` (rail only) |
| 3300 | `Read content/experience.ts` → `3 roles · 16 systems` | timeline entries, staggered |
| 4200 | `Write islands/ExtensionBus.tsx` | `#systems` card 1 |
| 4800 | `Write islands/ScopeEngine.tsx` | `#systems` card 2 |
| 5300 | `Write islands/KlikNote.tsx` | `#systems` card 3 |
| 5900 | `Bash npm run build` → `✓ 6 pages · 94 kB js · 1.1 s` | `#stack`, `#instruments` |
| 6700 | `done` — `ready · ⌘K to drive` | `#contact`, overlay dissolves |

Every number the transcript prints is **real**, read from `stats.json` at build time (§5 act 5).
A fake build log on an engineer's portfolio would be the one unforgivable detail.

**The reveal mechanism.** Each section carries `data-build="timeline"`. Under `html.js-build`,
sections sit at `opacity:0; translateY(14px); clip-path: inset(0 0 100% 0)`. The driver adds
`.built`, which transitions clip-path + opacity + transform over 520ms with
`cubic-bezier(.16,1,.3,1)`. Zero layout thrash: no height animation, no JS-driven positions.

**Typing without 400 timers.** One `requestAnimationFrame` loop over a single clock. Characters
are revealed by advancing an index into a pre-rendered string — never by `innerHTML +=`. Cost:
one rAF, one text-node write per frame, no reflow of the page behind it.

**Fast-forward.** The driver is a pure function of `elapsed`; skipping sets `elapsed = total`
and runs one final pass. Cancelable, idempotent, no partial states possible.

**Mobile.** Same sequence, transcript at 94vw, font 13px, steps reduced to 6 (drop the two
smaller `Write`s). Total 5.4s.

---

### Act 1 — Masthead

Not a hero. A masthead: name, one sentence, current status, three ways in.

- Name in the display face, large, tight, left — no gradient fill (the single most dated thing
  on the old site).
- One sentence, concrete: *Builds the software other software runs inside — browser extensions,
  micro-frontends, native bridges, permission engines.*
- A status chip: what you are open to, as of a date. Recruiters look for exactly this.
- `Download CV` · `Email` · `LinkedIn`, plus the `⌘K` hint.
- Optional portrait, treated (§10.5). My recommendation: **no portrait in the masthead** — a mono
  monogram and a strong sentence read more senior than a headshot. Keep the photo for `/cv`.

---

### Act 2 — Career as a commit log

Your three roles as entries in a `git log`. This is the single highest-value piece of the
redesign, because it is an information-design win, not a decoration: your JumpCloud entry is
~18 achievements across 5 subsections. As a bullet list that is a wall. As a diff it is scannable,
dense, and native to the audience.

**Collapsed state** — a rail of commits:

```
● 2026-05  JumpCloud · Software Engineer · Colorado (remote)      16 files changed  +1.2k
│          Lead, Password Manager browser extension team
│
● 2022-02  MYKI · Software Engineer · Beirut                       2 files changed  +180
│          Flagship password manager extension  (acquired by JumpCloud)
│
● 2021-09  Neo Mena Technologies · Software Engineer · Beirut       3 files changed  +240
```

**Expanded state** — a two-pane diff: file tree left, diff right. The JumpCloud mapping, which
I would author exactly like this:

```
leadership/
  team.ts                     + lead the Password Manager extension team, full SDLC
                              + onboard, mentor, run knowledge transfers
                              + interview across the pipeline with hire recommendations
architecture/
  manifest-v3.ts              + replaced the persistent background script with an ephemeral
                                service worker
                              + designed the message-passing layer: SW ↔ popup ↔ injected
                                dialogs ↔ desktop client
  ui-migration.ts             + rebuilt the extension UI on a new design system
                              + migrated React → Vue incrementally, release cadence unbroken
platform/
  safari-bridge.swift         + authored a native Swift bridge for low-level IPC with the
                                macOS desktop app
  microfrontends.ts           + shipped admin portal features as independently deployable
                                micro-frontends into a shared shell
backend/
  roles-authz.go              + custom roles authorization end to end: CRUD, migrations,
                                scope-evaluation engine, multi-role admins
  roles-ui.ts                 + metadata-driven UI — new permissions ship server-side with
                                zero frontend changes
  icon-service.ts             + icon streaming with client-side caching, third-party GraphQL,
                                webhook-driven freshness
  contracts.proto             + typed service contracts over gRPC + protobuf
security/
  p2p-crypto.ts               + secure extension ↔ desktop channel: key generation, exchange,
                                rotation, combined symmetric/asymmetric
  passwordless.ts             + JumpCloud Go — cross-platform biometric passwordless auth
                              + hardened autofill: user rules, per-site exceptions, allow/deny
perf/
  vault-scale.ts              + 5,000 → 50,000 items: caching, lazy loading, virtualization
                              + rebuilt peer sync — higher throughput, memory leaks gone
build/
  webpack.config.js           + replaced Gulp; 4 min → 30 s
ci/
  release.yml                 + automated builds + distribution to every major browser store
                              + CircleCI → GitHub Actions
ops/
  reliability.md              + feature-flagged rollouts (LaunchDarkly, Split)
                              + DataDog observability, incident response, rollbacks, RCA
ai/
  workflows.md                + introduced AI-assisted development across the team
                                (Cursor, Copilot, Gemini, agent skills, MCP servers)
```

**Mechanics.**
- Default: directories collapsed with counts. Click a directory → its diff lines expand.
- `+` lines in the accent, mono, with colouring restricted to two hues.
- Keyboard: `j`/`k` move, `enter` expands, `/` filters lines — the filter is live and highlights
  matches across all roles, so `crypto` or `vue` instantly shows every place it appears.
- **No typewriter effect here.** The diff is content; content appears immediately.
- Mobile: single pane, directories as accordions, no side-by-side.
- A `plain ⇄ diff` toggle in the section header. Some readers will want the boring list, and
  giving it to them in one click is the move that makes the clever version safe.

---

### Act 3 — Systems, not screenshots

Your hardest work is invisible. You cannot screenshot a message-passing layer. Three pieces,
each one an actual interactive, each one earning its place:

#### 3.1 The extension bus *(the centrepiece)*

Inline SVG, ~7 nodes: `Service Worker (ephemeral)`, `Popup`, `Content script`, `Injected dialog`,
`Desktop client (Electron)`, `Swift bridge`, `API`.

Five runnable scenarios as buttons:

| Scenario | What the visitor watches |
|---|---|
| `autofill` | page → content script → SW → desktop → credential back to the injected dialog |
| `unlock` | biometric prompt → native bridge → key material → vault decrypt |
| `key exchange` | asymmetric handshake, then the symmetric channel it establishes |
| `rotation` | an in-flight rotation while a message is already travelling |
| **`cold start`** | **the service worker dies mid-conversation and the message queue survives its respawn** |

That last one is the money shot. The ephemeral service worker is the genuinely hard part of MV3,
almost nobody visualises it, and it is exactly what you rebuilt. Dashed packets animate along
paths with `offset-path`/`offset-distance` (GPU-friendly), a small log beneath narrates each hop
in one short line, and a scrub bar lets you step hop by hop.

Accessibility: the log is the accessible version — a real `<ol>` of steps, readable with the
animation off. Reduced motion → packets jump between hops instead of travelling.

#### 3.2 The scope engine

A mock admin portal nav on the right, role chips on the left. Toggle a scope → watch resolved
access change across the nav, with inter-scope dependencies lighting up as they cascade, and a
tiny resolver trace printing the evaluation:

```
resolve(admin: [billing-viewer, device-manager])
  ✓ devices.read        ← device-manager
  ✓ devices.write       ← device-manager
  ✓ billing.read        ← billing-viewer
  ✗ billing.write       ← no grant
  ✓ users.read          ← implied by devices.write
```

Pure client state machine over a small JSON scope graph. No backend. Demonstrates the
metadata-driven design better than any paragraph could.

#### 3.3 KlikNote, playable

An embedded mini KlikNote: press the hotkey, type, it persists locally, `↑↓` to navigate,
`⌘⏎` to save. Shows local-first (a `network: 0 requests` badge that is actually true) and
keyboard-native in ten seconds of use. Links out to the real product.

**Scope discipline:** 3.1 is deep, 3.2 is medium, 3.3 is small. Any further projects are tight
static cards. Three interactives is the ceiling — four is where the timeline doubles.

---

### Act 4 — Stack, tiered honestly

Kill the 20 colour icons from `img.icons8.com` (third-party requests, mismatched logo styles,
and a flat list implies equal depth in Flask and TypeScript, which is not true).

Replace with three tiers, mono type, no logos:

```
BUILD WITH DAILY     TypeScript · React · Vue · Node · Astro · Tailwind · Webpack/Vite
SHIPPED IN ANGER     Swift (native bridge) · Go · gRPC/protobuf · GraphQL · PostgreSQL · Electron
                     Manifest V3 · Chrome/Firefox/Safari/Edge stores · GitHub Actions
READ AND REACH FOR   Python · Java · PHP · MongoDB · MySQL · Docker · Flask
```

Honest tiering reads as senior. A wall of equal badges reads as junior. Each term is hoverable
to surface *where* you used it — pulling the link straight from the timeline data.

---

### Act 5 — Instruments

A panel of live, real numbers measured on the visitor's own page view, next to the career numbers.
You do observability and incident response; show an instrument, not an animated counter.

**Measured live:** LCP, CLS, INP (via `PerformanceObserver`), JS transferred (from
`performance.getEntriesByType('resource')`), build-sequence duration, mean frame time during the
build, DOM node count.

**Injected at build time** by `plugins/stats.ts`, a small Vite plugin writing `stats.json`:
bundle bytes per island, page count, build duration, commit SHA, build timestamp. The build
overlay's transcript reads the same file, so what it prints is what actually happened.

**From the career data:** `10×` vault scale · `8×` build speed-up · `4` browser stores shipped to
· `6` years · `1` acquisition.

Framed as a tiny status board, not a dashboard. Everything on it must be true and re-measured on
load, because the entire point is verifiability.

---

### Ship it — contact

Phone (`+961 3 689 039`), email, LinkedIn, GitHub, `Download CV`. Real links only — no dead
socials. One line about what you are looking for, dated. Then the footer: `↻ replay build`,
the build SHA, and `view source` pointing at the repo, because the repo *is* part of the pitch.

---

## 6. The command palette

The prompt bar from act 0 never leaves. `⌘K` / `/` focuses it. This is the keyboard-native
signature — you built KlikNote, so navigation by keyboard is honest here, not a gimmick.

| Command | Effect |
|---|---|
| `goto <section>` | smooth-scroll, fuzzy matched |
| `find <term>` | live filter across every timeline diff line, highlighted in place |
| `stack <term>` | shows every role + system where that technology appears |
| `run <scenario>` | jumps to the extension bus and plays `autofill` / `cold-start` / … |
| `theme dark\|light\|system` | persists to `localStorage` |
| `plain` | global toggle: diffs → bullet lists, instruments → table |
| `cv` | triggers `window.print()` |
| `replay` | re-runs the build sequence |
| `help` | lists the above |
| anything else | a canned, honest line: *not a chatbot — try `help`* |

Deterministic, no network, fully keyboard, and every command has a mouse equivalent somewhere in
the page so it is never the only path to anything.

---

## 7. Per-audience links — the feature that makes this a tool

`?role=staff-frontend`, `?role=security`, `?role=fullstack`, `?for=acme`

Effects:
1. The build's target line reads `target: staff frontend architecture`.
2. Section order and the timeline's default-expanded directories change — `security/` first for
   a security role, `architecture/` first for a platform role.
3. The masthead sentence swaps to one of three authored variants.
4. `?for=acme` adds one line to the masthead: *Built this view for the Acme team.*

No LLM. A map of presets in `src/content/targets.ts`. Send a tailored link with every
application. This is the difference between a portfolio you *have* and a portfolio you *use*.

---

## 8. Content model

Content lives in `src/content/`, typed, and is the single source for the page, the agent script,
the palette index and the print route. `profile.ts` and `types.ts` are already written; the
shapes are:

```ts
export type Line = { text: string; tags?: Tag[] };    // one diff line — one thing he did
export type File = { path: string; lines: Line[] };    // a "file changed" — a slice of the work
export type Dir  = { name: string; files: File[] };    // a collapsed directory
export type Role = {
  company: string; role: string; location: string;
  start: string; end?: string;                         // 'YYYY-MM', absent end = current
  summary: string;                                     // what the company is, one sentence
  note?: string;                                       // 'acquired by JumpCloud'
  dirs: Dir[];
};
export type System = {
  id: 'extension-bus' | 'scope-engine' | 'kliknote';
  title: string; blurb: string;                        // blurb ≤ 90 chars
  island: 'ExtensionBus' | 'ScopeEngine' | 'KlikNote';
  cover: string; company?: string;
};
export type Target = { id: string; label: string; sentence: string; openDirs: string[] };
```

Tags are what power `find` and `stack` without a search index: every line is already tagged, so
filtering is a `.filter()` over data that is in the bundle regardless.

**Derived in `src/lib/derive.ts`, never hand-written:** file counts, `+` counts, role durations,
the stack tiers' "where I used it" links, the palette index, the sitemap.

---

## 9. Design system

### Palette — two directions, pick one

**A · Signal** — the one I picked for the scaffold. Reads as instrumentation, nothing like the
industry's default sky-blue, and the accent is unmissable on near-black.

```css
--ink-900: #08090b;   /* page, dark */
--ink-800: #0f1114;   /* raised surfaces */
--ink-700: #171a1f;   /* borders */
--paper:   #f7f6f3;   /* page, light */
--text-hi: #f2f3f5;  --text-lo: #8b9099;
--accent:  #c3f53c;   /* acid lime — packets, + lines, focus rings */
--accent-dim: #7f9e2b;  /* the accent, legible on paper */
--warn:    #ff7a45;   /* the one second hue: − lines, "no grant" */
```

**B · Ember** — warmer, more editorial, slightly less "terminal".

```css
--ink-900: #0d0b0a;  --ink-800: #141110;  --ink-700: #1f1b19;  --paper: #faf7f2;
--accent: #ff6b35;  --accent-dim: #b8431a;  --warn: #4fd1c5;
```

Switching is a change to those eight values in `global.css` and nothing else — the comment at
the top of the file says so. Both ship light and dark. Dark is the default (`:root` *is* the dark
set, `.light` overrides) because the build sequence is authored for it; light is a real second
theme, not an afterthought, because the print route is light by definition.

### Type

- **Display** — Bricolage Grotesque Variable (name, section heads). Expressive, free, variable.
- **UI / body** — Inter Tight Variable. Tight, neutral, excellent at 15–17px.
- **Mono** — JetBrains Mono Variable. The transcript, diffs, resolver trace, instruments, palette.

Self-hosted via `@fontsource-variable/*`, weight axis only, upright only — no italic faces, no
Google Fonts CDN. Every subset ships behind a `unicode-range`, so a visitor downloads the latin
file and nothing else. Phase 4 adds `<link rel="preload">` for the display and body faces.

Scale (fluid, `clamp`): `12 · 13 · 15 · 17 · 21 · 28 · 40 · 64 · 96`. Measure capped at 68ch.

### Motion tokens

Already in `global.css`:

```css
--t-fast: 120ms; --t-base: 200ms; --t-slow: 320ms; --t-reveal: 520ms;
--e-out: cubic-bezier(.16, 1, .3, 1);     /* enters, reveals */
--e-in-out: cubic-bezier(.4, 0, .2, 1);   /* state changes */
```

Rules: animate only `transform`, `opacity`, `clip-path`, `offset-distance`. Never `height`,
`top`, `width`, or `box-shadow`. Nothing above 600ms except the build sequence itself. One
`@media (prefers-reduced-motion: reduce)` block kills all of it, site-wide — written already.

### Surface texture

Grain + a hairline technical grid, at very low opacity, composited once as a fixed
pseudo-element so it never repaints on scroll. This is where the "flash" actually comes from —
not from images.

---

## 10. Media assets — the full set, with prompts

**The spectacle is CSS, SVG and canvas — not generated raster art.** Heavy AI illustration is
precisely what makes a 2026 site look like every other 2026 site. So we generate narrowly, and
only where a texture or an abstract cover earns it.

### Manifest

| # | File | Size / format | Where it is used | Source |
|---|---|---|---|---|
| 1 | `public/textures/blueprint.png` | 2048² PNG + alpha | fixed body substrate, dark theme | generate |
| 2 | `public/textures/grain.png` | 2048² PNG + alpha | over everything, 3–5% opacity | generate |
| 3 | `public/textures/traces.png` | 2048² PNG + alpha | build overlay backdrop | generate |
| 4 | `public/textures/blueprint-light.png` | 2048² PNG + alpha | same as 1, light theme | generate (variant) |
| 5 | `public/covers/bus.webp` | 1600×1000 | extension-bus card | generate |
| 6 | `public/covers/vault.webp` | 1600×1000 | vault-scale card | generate |
| 7 | `public/covers/bridge.webp` | 1600×1000 | Swift bridge card | generate |
| 8 | `public/covers/shell.webp` | 1600×1000 | micro-frontend card | generate |
| 9 | `public/covers/graph.webp` | 1600×1000 | scope-engine card | generate |
| 10 | `public/covers/pipeline.webp` | 1600×1000 | build/CI card | generate |
| 11 | `public/portrait.webp` | 1200×1500 + alpha | `/cv` only (not the masthead) | img2img on a real photo |
| 12 | `public/og.png` | 1200×630 | link previews | **rendered from code**, §10.6 |
| 13 | `src/assets/monogram.svg` | vector | masthead mark, favicon source | hand-drawn, §10.7 |
| 14 | favicons | existing set | `<head>` | already in `public/` |

Everything generated is **abstract, monochrome-plus-one-accent, and text-free** — no lettering
(models cannot spell), no logos, no faces, no devices, no code on screens.

### 10.1 Substrate textures — transparent PNG, tileable, 2048²

**#1 `blueprint.png`**

> Seamless tileable technical blueprint substrate. Extremely subtle hairline grid, 1px white
> lines, occasional dimension marks, small node dots at intersections, a few orthogonal trace
> routes. Monochrome white on a fully transparent background. Flat vector feel, no gradients,
> no text, no numbers, no labels, no logos. Generous empty space, roughly 6% ink coverage.
> Seamless on all four edges. 2048×2048 PNG with alpha.

**#2 `grain.png`**

> Seamless tileable fine film grain and dust texture. Monochrome, neutral grey speckle, very low
> contrast, organic non-repeating feel, no clumping, no scratches, no vignette, no visible tiling
> seam. Fully transparent background. 2048×2048 PNG with alpha.

**#3 `traces.png`**

> Seamless tileable circuit trace field. Thin orthogonal and 45° traces with via pads, sparse,
> technical, uniform line weight, monochrome white on a fully transparent background. No
> components, no text, no silkscreen, no board colour. Roughly 10% coverage, seamless on all four
> edges. 2048×2048 PNG with alpha.

**#4 `blueprint-light.png`** — same prompt as #1 with:

> …monochrome charcoal grey #2a2a2a lines on a fully transparent background…

### 10.2 System covers — 6 images, 1600×1000, one coherent set

Append this **style suffix to every one of the six** so the set hangs together:

> — abstract technical illustration, near-black background #08090b, single acid-lime accent
> #c3f53c, matte finish, fine grain, minimal, generous negative space, centred composition,
> no text, no letters, no numbers, no logos, no UI elements, no people, no hands, no devices,
> flat depth of field, 1600×1000.

*(On palette B, swap the two hex values for `#0d0b0a` and `#ff6b35`.)*

**#5 `bus.webp`**
> A severed, re-forming channel: two halves of a glowing conduit caught mid-reconnection, with
> small packet shapes suspended in the gap between them

**#6 `vault.webp`**
> A dense lattice of many thousands of identical small cells, with one narrow lit corridor cut
> cleanly through it

**#7 `bridge.webp`**
> Two mismatched geometric systems — one strictly orthogonal, one organic and curved — joined by
> a single precise mechanical coupling at the centre

**#8 `shell.webp`**
> Concentric rectangular frames nested inside one another, one inner frame lit and slightly
> offset from the stack, as though it were hot-swapped while running

**#9 `graph.webp`**
> A permission lattice of nodes and directed edges, one single path illuminated end to end while
> every other edge stays dim

**#10 `pipeline.webp`**
> A long compressing channel, wide and turbulent at one end, narrow and perfectly ordered at the
> other, with the transition happening in the middle

### 10.3 Negative prompt (use on all of the above)

> text, letters, words, numbers, watermark, signature, logo, brand, UI, user interface, buttons,
> screen, monitor, laptop, keyboard, phone, person, people, face, hands, stock-photo look,
> lens flare, bokeh, rainbow gradient, neon cyberpunk, glossy 3D render, plastic, busy detail,
> clutter

### 10.4 Pipeline after generation

1. Generate at 2× and downscale — model artefacts disappear at half size.
2. Textures: check the seam by tiling 2×2 in any editor before committing.
3. Covers: `cwebp -q 82` → also emit AVIF; serve with `<picture>`.
4. Textures stay PNG (alpha + flat colour compresses better than WebP here); verify each is
   under 120 kB, and drop opacity in CSS rather than baking it into the file.
5. Everything goes through `public/`, not `src/assets/`, so the URLs are stable and cacheable
   under the `/textures/*` and `/covers/*` rules already in `public/_headers`.

### 10.5 Portrait — needs your real photo as input

Not text-to-image. You are a real person and a generated face would be a lie on a CV. Use
img2img at low strength (0.25–0.35) on an actual photo, or just grade the photo in code:

> Preserve the subject's identity and facial features exactly. Convert to a high-contrast
> monochrome portrait, single hard light source from the upper left, deep shadow fill, fine film
> grain, matte finish, background removed to full transparency. No stylisation of the face, no
> smoothing, no beautification, no reshaping, no added elements, no text. PNG with alpha,
> 1200×1500.

Used on `/cv` and in the OG card. My recommendation stands: keep it off the masthead.

### 10.6 OG image — rendered from code, not by a model

A build-time Satori/resvg render of a real layout: name, sentence, accent rule, status, commit
SHA. Always current, always on-brand, zero model drift, and it costs one dev dependency. If you
would rather generate it, the fallback prompt is:

> Minimal abstract social card background, near-black #08090b, a single thin acid-lime #c3f53c
> rule entering from the left third, fine grain, vast empty space on the right two thirds for
> text to be placed later. No text, no letters, no logos. 1200×630.

### 10.7 Monogram

Hand-drawn SVG, not generated: `II` or a single glyph built from two vertical strokes and one
connector, on an 24×24 grid, 2px stroke, square caps. It becomes the masthead mark, the favicon
source and the OG card's corner. A model cannot draw two letters reliably; this is twenty minutes
in a vector editor.

---

## 11. Stack, structure, budgets

### Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Astro 6** | Static HTML for the document → the §3 contract is free, not fought for. Unmatched on SEO and first paint for a content site. |
| Interactivity | React islands, `client:visible` | Only the 3 systems + palette + build driver hydrate. |
| Styling | Tailwind v4 via `@tailwindcss/vite` + `@theme inline` | CSS-first tokens suit the dual palette. |
| Motion | `motion` in islands only | The build sequence is plain CSS transitions + one rAF; no library on the critical path. |
| Diagrams | Hand-authored inline SVG + `offset-path` | No three.js, no d3. |
| Host | **Cloudflare Workers**, `@astrojs/cloudflare` + `wrangler deploy` | Edge-served, instant cache invalidation, `_headers` honoured, observability on. Replaces GitHub Pages. |

### Deployment

```
npm run dev        astro dev
npm run build      astro build            → dist/client + worker
npm run preview    build, then wrangler dev  (the real Workers runtime, not a static server)
npm run deploy     build, then wrangler deploy
```

Cut-over, once phase 1 is live on a Workers preview URL:

1. `wrangler deploy` → `ibrahimismail-dev.workers.dev`, verify.
2. Add `ibrahimismail.dev` + `www` as custom domains on the Worker in the Cloudflare dashboard
   (the zone is already there — the apex currently points at GitHub Pages' IPs, and those DNS
   records get replaced by the Worker's).
3. Keep `public/_headers`: it `noindex`es the `workers.dev` and `pages.dev` previews so they
   never compete with the real domain in search, and sets immutable caching on `/assets/*`,
   `/fonts/*`, `/covers/*`, `/textures/*`.
4. `main` keeps the old site until the Worker serves the apex; then merge `redesign` → `main`
   and tag the old one.

### Structure

```
src/
  content/        profile.ts ✓  types.ts ✓  experience.ts  systems.ts  stack.ts
                  education.ts  targets.ts
  layouts/        Base.astro ✓
  components/     Head.astro ✓  ThemeScript.astro ✓
  pages/          index.astro ✓(stub)  cv.astro  replay.astro  404.astro
  sections/       Masthead  Timeline  Systems  Stack  Instruments  Contact   (.astro)
  islands/        BuildOverlay.tsx  Palette.tsx  ExtensionBus.tsx
                  ScopeEngine.tsx   KlikNote.tsx  Instruments.tsx
  build/          script.ts    ← the authored choreography timeline
                  driver.ts    ← clock, reveal, skip, reduced-motion
  styles/         global.css ✓  print.css
  lib/            theme.ts ✓  derive.ts  format.ts
  scripts/        theme-init.ts ✓
plugins/          stats.ts     ← Vite plugin emitting stats.json
public/           textures/  covers/  fonts/  favicons ✓  Ibrahim_Ismail_CV.pdf ✓
                  robots.txt ✓  _headers ✓
```

### Budgets

| Metric | Budget | Scaffold today |
|---|---|---|
| HTML (gzip) | ≤ 24 kB | 2.5 kB |
| CSS (gzip) | ≤ 14 kB | 6.0 kB |
| JS, all islands (gzip) | ≤ 120 kB | 0 kB |
| JS before first paint | **0 kB** (one inline script < 400 B) | ✓ |
| LCP, 4G Moto G | ≤ 1.5 s | — |
| CLS | ≤ 0.01 | — |
| INP | ≤ 100 ms | — |
| Mean frame time during build | ≤ 16.6 ms | — |
| Lighthouse (all four) | ≥ 98 | — |
| Third-party requests | **0** | ✓ |

Verified with headless Chrome over the DevTools Protocol, using real input events and device
emulation rather than synthetic DOM events — synthetic events do not scroll, and a flick has to
be a real gesture with momentum to be worth measuring. `prefers-reduced-motion`,
`pointer: coarse` and a throttled 4G profile each get their own pass.

`npm audit` currently reports advisories inside `sharp`, reachable only through Astro's optional
image service at build time, not at runtime. Fixing them means Astro 7; revisit at the end of
phase 4 rather than chasing a major now.

---

## 12. Print / CV route

`⌘P` anywhere, `cv` in the palette, or `/cv` directly.

- `@page { margin: 14mm 14mm 12mm }`, two pages, never three.
- Print tokens override to black ink on white; the accent becomes black, `−` lines vanish.
- Diffs collapse to clean bullets. Resolver traces, instruments, palette, overlay: `display: none`.
- **Every `<img>` hidden in print.** A raster that reaches the paper lays out at its natural size
  and invents a blank page before itself — the single most common way a print stylesheet breaks,
  and `img { display: none }` in the print sheet is the only reliable fix.
- `break-inside: avoid` on every role and every file block.
- A print-only contact line, because a printed page has no links.
- Keep `public/Ibrahim_Ismail_CV.pdf` as the explicit download for people who want a file.

---

## 13. SEO, metadata, a11y

Mostly wired already in `Head.astro`:

- `<title>`: `Ibrahim Ismail — Senior Full-Stack Engineer`. Description rewritten around
  extensions / micro-frontends / native bridges / permission engines.
- JSON-LD `Person` (with `jobTitle`, `knowsAbout`, `sameAs`, address) + `WebSite`. Recruiter
  tooling and the crawlers behind answer engines both read this; in 2026 that is table stakes.
- `sitemap-index.xml` generated by `@astrojs/sitemap`; `robots.txt` points at it.
- Canonical URL, OG `profile` type, Twitter large card, theme-color per theme.

Still to do:

- Landmarks: one `<h1>`, sections as `<section aria-labelledby>`, timeline as `<ol>`.
- Visible focus rings in the accent, 2px — in `global.css` already, and never `outline: none`.
- The build overlay is `aria-hidden="true"` and `inert`: a screen reader gets the finished
  document immediately and never hears the show.
- Every diagram has an `<ol>` step log as its accessible equivalent, and the `plain` toggle
  switches the whole page to text-first.
- Contrast ≥ 4.5:1 for body, ≥ 3:1 for large text, in both themes. The acid accent is for large
  text, rules and marks only — body copy on paper uses `--accent-dim`.

---

## 14. Phases

Each phase ends shippable. If we stop after any one of them, the site is live and better than
what `main` holds today.

### Phase 0 — Scaffold *(done)*
- [x] Branch `redesign`, repo emptied, Astro 6 + Tailwind v4 + Cloudflare + sitemap
- [x] Design tokens, both palettes documented, both themes, motion tokens, rm kill switch
- [x] `Head.astro` with meta + JSON-LD, `ThemeScript`, `theme.ts`, `theme-init.ts`
- [x] `profile.ts`, `types.ts`, masthead rendering, `npm run build` green

### Phase 1 — The spine *(1 session)*
- [ ] Content ported from the old `constants.tsx` into `experience.ts` / `systems.ts` /
      `stack.ts` / `education.ts`; JumpCloud mapped into the dirs and files of §5 act 2
- [ ] `derive.ts`: counts, durations, tag index
- [ ] All six sections rendered as a **plain, complete, beautifully typeset document**
- [ ] `/cv` + `print.css`; `404.astro`
- [ ] Deploy to the Workers preview URL
- **Acceptance:** Lighthouse ≥ 98 with zero JS, two-page print, reads better than the old site

### Phase 2 — Timeline + systems *(1–2 sessions)*
- [ ] Commit-log rail, diff panes, `plain ⇄ diff` toggle, `j/k/enter`, live filter
- [ ] `ExtensionBus` island: 5 scenarios, packet animation, hop log, scrubber
- [ ] `ScopeEngine` island: scope graph, cascade, resolver trace
- [ ] `KlikNote` island: hotkey capture, local persistence, `network: 0` badge
- [ ] Mobile layouts for all three; reduced-motion variants
- **Acceptance:** every interactive usable by thumb and by keyboard, 60fps on a mid-range Android

### Phase 3 — First Run *(1–2 sessions)*
- [ ] `build/script.ts` choreography + `build/driver.ts` clock, reveal, skip, fast-forward, replay
- [ ] Overlay visuals: transcript, tool cards, prompt bar, dissolve
- [ ] `sessionStorage` / 7-day stamp / `?skip=1` / `prefers-reduced-motion` paths
- [ ] Command palette with the §6 command set
- [ ] `?role=` targeting presets
- **Acceptance:** the nine contract rules in §3, each verified individually over CDP

### Phase 4 — Finish *(1 session)*
- [ ] Media assets generated per §10, graded, converted, sized, committed
- [ ] Instruments panel + `plugins/stats.ts`
- [ ] Code-rendered OG image, monogram, font preloads
- [ ] Perf pass against every budget in §11; a11y pass; cross-browser (Safari `offset-path`,
      Firefox `clip-path` transitions)
- [ ] Custom domain cut-over per §11; merge `redesign` → `main`
- **Acceptance:** every number in §11 met and recorded in the PR

---

## 15. Risks

| Risk | Mitigation |
|---|---|
| A recruiter with 40 seconds resents the build sequence | 7s max, skippable from t=0, once per session, content readable *during* it, `?skip=1` on every link you send |
| The conceit reads as a gimmick | It only works if the document underneath is impeccable. Phase 1 ships that document on its own, before any spectacle exists. |
| Two deep interactives balloon the timeline | They are specified here, with fixed scenario counts. New ideas go in a backlog, not in phase 2. |
| Generated art makes it look like every AI site | Narrow brief, abstract only, one accent, grain over everything, OG rendered from code, monogram drawn by hand |
| Mobile perf on the diagram | `offset-distance` only, ≤ 12 animated nodes, `will-change` scoped, measured on a throttled profile before it ships |
| Clever filtering hides content from crawlers | Everything is in the DOM; filters toggle classes, never remove nodes |
| Safari `offset-path` quirks | Fallback to a keyframed `translate` path per scenario; Safari gets a pass in phase 4 |
| Domain cut-over downtime | Worker verified on `workers.dev` first; DNS swapped only after; `main` untouched until then |

---

## 16. Decisions I need from you

1. **Palette** — A · Signal (acid lime on near-black, in the scaffold now) or B · Ember (warm
   orange)? Switching is eight values.
2. **KlikNote's billing** — headline venture with its own act, or a peer among the three systems
   as specced here? The old site gave it a full section.
3. **Status line** — what are you open to, in one sentence, as of October 2026? `profile.ts`
   currently carries a placeholder marked `TODO`, and it is the most load-bearing sentence on
   the page.
4. **Portrait** — off the masthead (my recommendation) or in it? If in it, I need a photo for
   the img2img pass in §10.5.

---

## 17. Rejected, and why

| Idea | Why not |
|---|---|
| "Ask my AI twin" chatbot | The 2025 cliché. Slow, needs a key, costs money per visitor, and puts a stochastic layer between a hiring manager and your facts. |
| Decorative terminal typing `whoami` | 2015. Unreadable on mobile, and the typing is the only content. The agent transcript is the version of that instinct that is actually *doing* something. |
| VS Code as portfolio | Done, famously, repeatedly. And it buries the content two clicks deep in a file tree. |
| Scroll-jacked three.js hero | Reads as an agency showreel, not an engineer. 400 kB, kills mid-range phones, and fights every rule in §3. |
| Vault / login puzzle on the password-manager theme | Genuinely clever, but it gates your CV behind a game. Costs you the recruiter with 40 seconds. |
| Animated counters for career stats | Replaced by act 5 — real measured instruments. A counter that ticks to 10× is decoration; LCP measured live is evidence. |
| Installable browser-extension version of the portfolio | On-theme, zero reach. Nobody installs an extension to read a CV. |
| 20 colour technology badges | Third-party requests, mismatched logo art, and implying equal depth across Flask and TypeScript. Tiers instead. |
| AI-generated hero illustration | The fastest way to look like every other 2026 landing page. Texture and abstraction only, per §10. |

---

## 18. What "done" means

A hiring manager opens the link on a phone, on hotel wifi. In seven seconds they watch an agent
assemble a portfolio, and they can read it the entire time. They scroll to the timeline, tap
`security/`, and see cryptographic key rotation shipped to production. They tap `cold start` and
watch a service worker die mid-conversation without losing a message. They hit `⌘P` and get a
clean two-page CV. Nothing stutters, nothing waits on a network call, nothing is fake.

And the one thing they say first is *how was this built* — which is the only reaction a portfolio
is actually for.
