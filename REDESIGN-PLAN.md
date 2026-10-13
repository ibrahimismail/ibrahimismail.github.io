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
src/content/          profile.ts (two-clause pitch, server-first knowsAbout)
                      types.ts (Half, Venture), venture.ts (KlikNote + its one-line switch)
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
build: senior full-stack engineer portfolio  ·  target: backend + platform
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

### Framing

**Half server, half client — and the server half comes first.** He is a full-stack engineer and
the site has to read that way, or a backend hiring manager bounces off a page that looks like a
frontend portfolio with APIs bolted on.

Enforced by **order and structure only** — never by volume, never by adjectives. Nothing is
inflated and nothing is buried:

| Where | How |
|---|---|
| `profile.ts` | the one-sentence pitch is two clauses of equal length, server then client, set as two lines of equal weight |
| `knowsAbout` in the JSON-LD | server-side terms first; crawlers and answer engines read array order as ranking |
| Timeline directories | `backend/` then `security/` before `platform/` and `client/`; `backend/` is the one open by default |
| `Dir.half` / `System.half` | the side of the stack is a typed field, so every list sorts itself rather than being hand-ordered in three places |
| Systems section | the scope engine leads, at the same depth budget as the extension bus — the backend interactive is not the junior one |
| Stack section | two columns, server first, with the depth tiers running inside each |
| `?role=` presets | `backend`, `platform` and `security` before `fullstack` and `frontend` |

The extension work gets described for what it actually was: a distributed-systems problem — an
ephemeral process, a message queue that has to survive it, IPC to a native host, and a key
rotation mid-flight — that happened to live in a browser. Framed that way it counts for both
halves, which is the truth of it.

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
  #systems             act 3 — the interactive system pieces
  #venture             act 4 — KlikNote, playable  (removable — §8.1)
  #stack               act 5 — what he reaches for, honestly tiered
  #instruments         act 6 — live numbers of this page + career numbers
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
| 0 | prompt types `build portfolio --target=full-stack` | — |
| 900 | `plan` — 4 short lines | — |
| 1600 | `Read content/profile.ts` | `#masthead` |
| 2400 | `Write sections/Timeline.astro` `+312 −0` | `#timeline` (rail only) |
| 3300 | `Read content/experience.ts` → `3 roles · 16 systems` | timeline entries, staggered |
| 4200 | `Write islands/ScopeEngine.tsx` | `#systems` card 1 |
| 4800 | `Write islands/ExtensionBus.tsx` | `#systems` card 2 |
| 5300 | `Write islands/KlikNote.tsx` | `#venture` *(step absent when KlikNote is hidden)* |
| 5900 | `Bash npm run build` → `✓ 6 pages · 94 kB js · 1.1 s` | `#stack`, `#instruments` |
| 6700 | `done` — `ready · ⌘K to drive` | `#contact`, overlay dissolves |

Every number the transcript prints is **real**, read from `stats.json` at build time (§5 act 6).
A fake build log on an engineer's portfolio would be the one unforgivable detail.

**The timetable above is derived, not authored as fixed milliseconds.** `build/script.ts` exports
a function of the content modules, and the driver sums step durations to get its clock — so when
KlikNote is hidden its step disappears and everything after it closes up. A hardcoded timetable
would leave a 500ms hole in the sequence the first time content changed.

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
- The pitch, as two lines of equal weight — *Authorization engines, service contracts and
  encrypted channels on the server.* / *Extension platforms, native bridges and micro-frontends
  on the client.* Same length by construction, server on top. A reader who only takes in two
  lines takes in both halves.
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
backend/
  roles-authz.go              + custom roles authorization end to end: CRUD endpoints,
                                migrations for new permission scopes, multi-role admins
  scope-engine.go             + the scope-evaluation engine governing access across the
                                admin portal, including inter-scope dependencies
  icon-service.ts             + icon-streaming service: third-party GraphQL integration,
                                webhook-driven freshness, client-side caching
  contracts.proto             + typed service contracts across microservices over gRPC and
                                protocol buffers, owned through every environment
  roles-ui.ts                 + metadata-driven roles UI — scope categories, type-split
                                tables and dependencies render from server metadata, so new
                                permissions ship backend-only with zero frontend changes
security/
  p2p-crypto.ts               + secure extension ↔ desktop channel: key generation, exchange,
                                rotation, combined symmetric/asymmetric
  passwordless.ts             + JumpCloud Go — cross-platform biometric passwordless auth
                              + hardened autofill: user rules, per-site exceptions, allow/deny
platform/
  manifest-v3.ts              + replaced the persistent background script with an ephemeral
                                service worker
                              + designed the message-passing layer: SW ↔ popup ↔ injected
                                dialogs ↔ desktop client
  safari-bridge.swift         + authored a native Swift bridge for low-level IPC with the
                                macOS desktop app
  microfrontends.ts           + shipped admin portal features as independently deployable
                                micro-frontends into a shared shell
client/
  ui-migration.ts             + rebuilt the extension UI on a new design system
                              + migrated React → Vue incrementally, release cadence unbroken
perf/
  vault-scale.ts              + 5,000 → 50,000 items: caching, lazy loading, virtualization
                              + rebuilt peer sync — higher throughput, memory leaks gone
delivery/
  webpack.config.js           + replaced Gulp; 4 min → 30 s
  release.yml                 + automated builds + distribution to every major browser store
                              + CircleCI → GitHub Actions
  reliability.md              + feature-flagged rollouts (LaunchDarkly, Split)
                              + DataDog observability, incident response, rollbacks, RCA
leadership/
  team.ts                     + lead the Password Manager extension team, full SDLC
                              + onboard, mentor, run knowledge transfers
                              + interview across the pipeline with hire recommendations
ai/
  workflows.md                + introduced AI-assisted development across the team
                                (Cursor, Copilot, Gemini, agent skills, MCP servers)
```

Eight directories, ordered server-first, with `backend/` the one expanded by default. `Dir.half`
carries the side of the stack, so that ordering is data rather than a hand-sorted literal — and
a `?role=frontend` link re-sorts it without touching the content.

Leadership does not lose by sitting low in the tree: it is in the commit's subject line
(*Lead, Password Manager browser extension team*), which is visible in the collapsed rail before
any directory is opened at all.

**Mechanics.**
- Default: `backend/` open, every other directory collapsed with counts. Click one → it expands.
- `+` lines in `--sx-add` green, `−` in `--sx-del` red, paths in `--sx-type`, mono throughout —
  the colours an engineer already reads without thinking.
- Keyboard: `j`/`k` move, `enter` expands, `/` filters lines — the filter is live and highlights
  matches across all roles, so `crypto` or `vue` instantly shows every place it appears.
- **No typewriter effect here.** The diff is content; content appears immediately.
- Mobile: single pane, directories as accordions, no side-by-side.
- A `plain ⇄ diff` toggle in the section header. Some readers will want the boring list, and
  giving it to them in one click is the move that makes the clever version safe.

---

### Act 3 — Systems, not screenshots

Your hardest work is invisible. You cannot screenshot an authorization engine or a
message-passing layer. Three interactives, server-side first, and the first two share the depth
budget equally — the backend piece is not the junior one:

#### 3.1 The scope engine *(server, deep)*

A mock admin portal nav on the right, role chips on the left. Toggle a scope → watch resolved
access change across the nav, with inter-scope dependencies lighting up as they cascade, and a
resolver trace printing the evaluation:

```
resolve(admin: [billing-viewer, device-manager])
  ✓ devices.read        ← device-manager
  ✓ devices.write       ← device-manager
  ✓ billing.read        ← billing-viewer
  ✗ billing.write       ← no grant
  ✓ users.read          ← implied by devices.write
```

Three things to drive, which is what earns it equal billing with the bus:

| Control | What it shows |
|---|---|
| role chips | an admin holding two roles — the union, and which grant won |
| a scope toggle | the dependency cascade firing through the graph |
| `metadata ⇄ hand-rolled` | the same new permission arriving server-side only, versus the frontend changes a hand-rolled UI would have needed |

Pure client state machine over a small JSON scope graph — no backend, no animation paths, so the
depth costs authoring rather than engineering. It demonstrates the metadata-driven design better
than any paragraph could, and it is the piece a backend reviewer will spend their time on.

#### 3.2 The extension bus *(both halves, deep)*

Described for what it actually was: a distributed-systems problem — an ephemeral process, a
queue that has to survive it, IPC to a native host, a key rotation mid-flight — that happened to
live in a browser.

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

#### 3.3 KlikNote — moved out

It is not one of these. It is his own product, not a system he shipped for an employer, so it
has its own act (§5 act 4) and its own removability (§8.1). The systems section is two deep
interactives and two static cards.

An embedded mini KlikNote: press the hotkey, type, it persists locally, `↑↓` to navigate,
`⌘⏎` to save. Shows local-first (a `network: 0 requests` badge that is actually true) and
keyboard-native in ten seconds of use. Links out to the real product.

**Plus two static cards, both server-side**, so the section's card count is balanced even though
only three things are interactive:

- **`icon-service`** — third-party GraphQL, webhooks in, client-side cache, streamed to the
  client. One diagram, no interaction.
- **`contracts.proto`** — a real protobuf excerpt and the services either side of it, as a
  syntax-highlighted block.

**Scope discipline:** 3.1 and 3.2 are deep, the two cards are static, and the KlikNote demo in
act 4 is small. Three interactives across the whole site is the ceiling — four is where the
timeline doubles.

---

### Act 4 — KlikNote

His own product, so it gets its own act rather than a card among the work he did for employers —
that distinction is the whole point of showing it. Different surface treatment from the systems
section: wider, quieter, one cover image, the logo, his own words from the old site.

- Role line: *Founder & Lead Engineer* — and the tagline, verbatim: *a high-velocity,
  local-first, keyboard-native note-taking app built for uninterrupted focus.*
- Three short paragraphs: why he built it, the zero-latency client-side engine with global
  context-menu capture, and local-first / keyboard-native as a stance rather than a feature list.
- **Playable.** Press the hotkey, type, it persists locally, `↑↓` to navigate, `⌘⏎` to save.
  A `network: 0 requests` badge that is actually true, measured from `PerformanceObserver` on
  the island itself, not hardcoded.
- `Try KlikNote today` → kliknote.com.

It also carries its own justification for the command palette: the site is keyboard-driven
because he built a keyboard-native product. The act and the `⌘K` bar explain each other.

**Placement.** After the systems section: employment first for a recruiter skimming, then the
thing he built alone. A `?role=` preset can move it up — and `?role=founder` would.

### Act 5 — Stack, in two halves

Kill the 20 colour icons from `img.icons8.com` (third-party requests, mismatched logo styles,
and a flat list implies equal depth in Flask and TypeScript, which is not true).

Two columns, **server first**, with depth tiers running inside each. The layout is the argument:
a reader sees two full columns before they read a word, which is the 50/50 claim made visible
instead of asserted.

```
SERVER & PLATFORM                      CLIENT & INTERFACE
─────────────────────                  ──────────────────
daily        Node · TypeScript         daily        TypeScript · Vue · React
             PostgreSQL · REST                      Astro · Tailwind · Vite
shipped      Go · gRPC/protobuf        shipped      Manifest V3 · service workers
             GraphQL · webhooks                     micro-frontends · Electron
             schema migrations                      Swift (native bridge)
             authz / scope engines                  4 browser stores
             applied cryptography                   list virtualization
             microservices                          design systems
reach for    Python · Flask · Java     reach for    SASS · Webpack
             PHP · MySQL · MongoDB                  framer-motion
             Docker · CI/CD
```

Honest tiering reads as senior; a wall of equal badges reads as junior. Each term is hoverable to
surface *where* you used it — pulling the link straight from the timeline data, which is what
`Tag` and `Dir.half` are for. On mobile the columns stack, server first.

### Act 6 — Instruments

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

`?role=backend`, `?role=platform`, `?role=security`, `?role=fullstack`, `?role=frontend`, `?for=acme`

Effects:
1. The build's target line reads `target: backend + distributed systems`.
2. Section order and the timeline's default-expanded directories change — `security/` first for
   a security role, `platform/` first for a platform role, `client/` first for a frontend one.
   It is a sort over `Dir.half` plus a per-preset `openDirs`, not a second copy of the content.
3. The two masthead clauses swap order, so the half that matters to that reader is the top line.
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
export type Half = 'server' | 'client' | 'both';       // which side of the stack
export type Dir  = { name: string; half: Half; files: File[] };
export type Role = {
  company: string; role: string; location: string;
  start: string; end?: string;                         // 'YYYY-MM', absent end = current
  summary: string;                                     // what the company is, one sentence
  note?: string;                                       // 'acquired by JumpCloud'
  dirs: Dir[];
};
export type System = {
  id: 'scope-engine' | 'extension-bus' | 'kliknote';
  half: Half;
  title: string; blurb: string;                        // blurb ≤ 90 chars
  island: 'ScopeEngine' | 'ExtensionBus' | 'KlikNote';
  cover: string; company?: string;
};
export type Venture = {                                 // his own product, not an employer's
  name: string; role: string; tagline: string;
  url: string; logo: string;
  island?: 'KlikNote';                                   // the playable demo, if there is one
  body: string[]; cta: string;
};
export type Target = { id: string; label: string; sentence: string; openDirs: string[] };
```

Tags are what power `find` and `stack` without a search index: every line is already tagged, so
filtering is a `.filter()` over data that is in the bundle regardless.

`half` is what keeps the framing rule from rotting. Server-first ordering is a sort over one
typed field in one place — not three hand-sorted lists that drift the next time content is
added. `profile.ts` and `types.ts` already carry it.

**Derived in `src/lib/derive.ts`, never hand-written:** file counts, `+` counts, role durations,
the stack tiers' "where I used it" links, the palette index, the sitemap.

### 8.1 Hiding KlikNote

It has to be possible to take KlikNote off the site and redeploy, then put it back, without
anything breaking or any other edit. **Already built** — `src/content/venture.ts`:

```ts
const KLIKNOTE: Venture = { /* the content, which stays either way */ };

/** KLIKNOTE to show it, null to take it off the site — then redeploy. */
export const VENTURE: Venture | null = KLIKNOTE;
```

One line. The design points worth keeping:

1. **Nullable, not boolean.** `Venture | null` makes TypeScript force every consumer to handle
   its absence. A `shown: false` flag can be read in four places and honoured in three; this
   cannot compile that way.
2. **The content survives the switch.** Turning it back on is the same edit in reverse — no
   commented-out blocks, no copy to recover from git.
3. **A section, never a route.** The venture is part of the one document, so hiding it cannot
   404 a URL, orphan a sitemap entry, or strand an inbound link.
4. **Section order is computed.** `index.astro` splices the venture into the section list only
   when there is one, so the page cannot be left with a gap or a stray heading.
5. **The build sequence re-times itself**, because `script.ts` derives its steps from content
   (§5 act 0). Hiding KlikNote removes its `Write` step and everything after it closes up.
6. **Everything else is untouched** — `knowsAbout`, the JSON-LD, the OG image, the print route
   and the palette index all read the same nullable export.

**Verified both ways** on the scaffold: `VENTURE = KLIKNOTE` builds with `#venture` present,
`VENTURE = null` builds with it absent, and both are green. That check belongs in phase 1's
acceptance so it stays true.

---

## 9. Design system

### Palette — Atom One Dark, with Atom One Light as its twin

Decided. Not a palette of our own, and deliberately not a terminal palette.

**Why this one.** The page is made of code-shaped surfaces — a diff, a build transcript, a
resolver trace, a protobuf excerpt — and in One Dark those colours already carry meaning to the
people reading them. Green is an addition, red is a removal, purple is a keyword, orange is a
number. A diff whose `+` lines are green is read instantly; a diff whose `+` lines are some
bespoke brand colour has to be decoded. Colour doing semantic work for free is worth more than
colour being distinctive.

**Structure follows an editor, not a web page.** This is the part that keeps a mid-grey palette
from reading flat across a full page, which is the real risk with One Dark — it was designed for
a code pane surrounded by darker chrome, not for 4,000px of scroll.

```css
--ink-900: #1b1e24;   /* workbench — the page */
--ink-800: #21252b;   /* panels, cards, the sticky bar */
--ink-700: #282c34;   /* editor surface — transcript, diff panes, code blocks */
--paper:   #fafafa;   /* the light twin's page, and the printed sheet */
--text-hi: #d7dae0;  --text-lo: #7f848e;  --border: #343a45;

--accent:     #61afef;   /* One Dark blue: links, focus, marks, live packets */
--accent-dim: #4078f2;   /* One Light blue — same role, legible on paper */
--cursor:     #528bff;

/* Syntax hues — code-shaped surfaces only */
--sx-add: #98c379;  --sx-del: #e06c75;  --sx-key: #c678dd;
--sx-type: #e5c07b; --sx-num: #d19a66;  --sx-fn: #61afef;  --sx-esc: #56b6c2;
```

So code-shaped things sit on `#282c34` and look like a pane floating on a `#1b1e24` workbench.
Cards sit on `#21252b` between them. Three values of depth, all authentic to the source.

**The discipline, or it becomes a parrot.** Seven hues is five more than a page should wear. The
rule, written into `global.css`: the `--sx-*` hues appear **only** inside code-shaped surfaces,
where they mean what they mean in an editor. Everything else — links, focus rings, buttons,
marks, the diagram's live packets — uses the one `--accent` blue. A section heading is never
purple because purple means keyword.

**Light theme: Atom One Light**, the published twin, so light mode is coherent rather than
invented, and the print route inherits it. Both comment greys get darkened for body text —
`#5c6370` is 3:1 on the workbench and `#a0a1a7` is 2.4:1 on paper, so both are decoration only
and `--text-lo` carries the legible value instead.

**What this replaced.** The first draft was acid lime `#c3f53c` on near-black `#08090b`, picked
to be unmissable and nothing like the industry's default sky-blue. Fair objection: on a page that
contains a build transcript, lime-on-black lands as retro phosphor terminal whatever the exact
hue is, and it put a 2015 costume on a 2026 idea. One Dark does not have that problem, and it
buys the semantic colour the first palette had to invent. Testing other palettes later is eight
values in one file; the `--sx-*` split means a swap keeps the diff readable either way.

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
not from images. On One Dark the grid reads at about 4% white; any more and `#1b1e24` turns
muddy.

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

> …monochrome charcoal grey #383a42 lines on a fully transparent background…

### 10.2 System covers — 6 images, 1600×1000, one coherent set

Append this **style suffix to every one of the six** so the set hangs together:

> — abstract technical illustration, dark desaturated blue-grey background #1b1e24, single
> soft blue accent #61afef, matte finish, fine grain, minimal, generous negative space, centred
> composition, no text, no letters, no numbers, no logos, no UI elements, no people, no hands,
> no devices, flat depth of field, 1600×1000.

The accent is the one `--accent` blue, never a syntax hue: a cover in `--sx-key` purple would
read as "keyword" next to a diff that uses purple for exactly that. Where a second colour is
genuinely needed, use `--sx-esc` cyan `#56b6c2`.

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

> Minimal abstract social card background, dark desaturated blue-grey #1b1e24, a single thin
> soft blue #61afef rule entering from the left third, fine grain, vast empty space on the right
> two thirds for text to be placed later. No text, no letters, no logos. 1200×630.

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

- `<title>`: `Ibrahim Ismail — Senior Full-Stack Engineer`. Description rewritten server-first:
  authorization engines / gRPC contracts / key exchange / migrations, then Manifest V3 /
  native bridges / micro-frontends.
- JSON-LD `Person` (with `jobTitle`, `knowsAbout`, `sameAs`, address) + `WebSite`. `knowsAbout`
  lists server-side terms first, because array order is read as ranking. Recruiter
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
- Contrast ≥ 4.5:1 for body, ≥ 3:1 for large text, in both themes. Checked already: One Dark's
  comment grey `#5c6370` is 3:1 on the workbench and One Light's `#a0a1a7` is 2.4:1 on paper, so
  both are decoration only and `--text-lo` carries a legible value in each theme. `--accent`
  blue is for links, large text, rules and marks; on paper that role goes to `--accent-dim`.

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
- **Acceptance:** Lighthouse ≥ 98 with zero JS, two-page print, reads better than the old site,
  and `VENTURE = null` builds clean with no gap, no stray heading and no broken anchor

### Phase 2 — Timeline + systems *(1–2 sessions)*
- [ ] Commit-log rail, diff panes, `plain ⇄ diff` toggle, `j/k/enter`, live filter
- [ ] `ExtensionBus` island: 5 scenarios, packet animation, hop log, scrubber
- [ ] `ScopeEngine` island: scope graph, cascade, resolver trace
- [ ] Venture act + `KlikNote` island: hotkey capture, local persistence, a `network: 0` badge
      measured rather than asserted
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
| A backend reviewer reads it as a frontend portfolio | §2 "Framing": server-first ordering carried in `Dir.half`, `backend/` open by default, equal depth on the scope engine, two-column stack, server-first `knowsAbout` |
| Hiding KlikNote leaves a hole in the build sequence | The choreography derives its steps from content and the driver sums durations; `VENTURE = null` is built and verified in phase 1's acceptance, not assumed |
| Seven syntax hues turn the page into a parrot | The `--sx-*` hues are confined to code-shaped surfaces by a rule written into `global.css`; all chrome uses the one accent blue |
| One Dark's `#282c34` reads flat over a long page | Editor depth: `#1b1e24` workbench / `#21252b` cards / `#282c34` code surfaces, so code-shaped things float rather than fill |
| Domain cut-over downtime | Worker verified on `workers.dev` first; DNS swapped only after; `main` untouched until then |

---

## 16. Decisions

**Settled:**

1. **Palette — Atom One Dark**, with Atom One Light as its twin, structured as workbench /
   panel / editor depth and with the syntax hues confined to code-shaped surfaces. §9. *(The
   first draft's acid-lime-on-black was rejected as retro-terminal; it is in the scaffold's
   history if it is ever wanted back.)*
2. **KlikNote stays, with its own act** — a product he designed and owns, not a card among the
   work he did for employers. §5 act 4. And it is **hideable in one line**: §8.1.
3. **No second venture.** Nothing else of his appears on the site.

**Still open:**

4. **Status line** — what are you open to, in one sentence, as of October 2026? `profile.ts`
   carries a placeholder marked `TODO`, and it is the most load-bearing sentence on the page.
5. **Portrait** — off the masthead (my recommendation) or in it? If in it, I need a photo for
   the img2img pass in §10.5.

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
assemble a portfolio, and they can read it the entire time. They scroll to the timeline, where
`backend/` is already open on a scope-evaluation engine and a set of gRPC contracts, tap
`security/`, and see cryptographic key rotation shipped to production. They tap `cold start` and
watch a service worker die mid-conversation without losing a message. They hit `⌘P` and get a
clean two-page CV. Nothing stutters, nothing waits on a network call, nothing is fake.

And the one thing they say first is *how was this built* — which is the only reaction a portfolio
is actually for.
