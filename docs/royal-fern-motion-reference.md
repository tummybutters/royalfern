# Royal Fern Motion Reference

Quick reference for future agents working on this site’s animation style. This is the “how the site moves” map, with the key patterns, timing, and where to edit them.

## Core Motion Style (what makes this site feel good)

- Motion is elegant, not flashy: layered reveals, soft easing, premium pacing.
- Most UI transitions use short easing (`0.2s`-`0.5s`) and warm cubic-beziers.
- Large entrance moments use GSAP (`power3`, `power4`, `back.out`) with stagger.
- Repeating motion (hero videos, testimonials) is custom JS for control + performance.

## Main Animation Systems (where they live)

- GSAP + ScrollTrigger init: `index.html:2464`
- Mobile nav dropdown behavior: `index.html:2479`
- Hero video card-stack carousel logic: `index.html:2516`
- Testimonial auto-scroll carousel logic: `index.html:2765`
- Hero intro timeline (the signature load animation): `index.html:2990`
- Scroll-triggered section reveals (services/about/gallery/testimonials/contact): `index.html:3075`

## 1) Hero Intro Animation (signature page-load feel)

Location:
- JS timeline: `index.html:2990`

Sequence order:
1. Center logo icon pops in (`scale + rotation`)
2. Hero logo text + established line fade/slide in
3. Frame corners animate in
4. Hero frame border reveal
5. Left hero media reveal via `clipPath` wipe
6. Image border pop-in
7. H1 + divider + H2 + CTA reveal
8. Bottom services strip slides up + staggered items

Why it feels premium:
- Overlapping timeline offsets (`'-=0.x'`) keeps momentum
- Strong easing (`power4.inOut`) on the left media wipe
- Typographic elements animate after frame/media so content feels “presented”

Important hook:
- Hero timeline dispatches `royalfern:hero-intro-complete` on finish so media can start cleanly: `index.html:2993`

## 2) Hero Video Carousel (stacked deck effect)

Locations:
- CSS stack/card styling: `index.html:283`
- CSS leaving phases: `index.html:372`
- JS carousel/state machine: `index.html:2516`

What it is:
- A stacked set of portrait videos inside the original hero image container
- Only one active top card; deeper cards are offset, smaller, dimmer
- Auto-rotates and supports arrows + dots

Why it feels like cards, not a normal slider:
- Each card’s transform is computed by relative depth (`rel(index)`)
- Deeper cards have:
  - positive `translateX / translateY`
  - tiny rotation
  - reduced scale
  - lower opacity
- Outgoing top card uses a 3-phase transition:
  - `left` -> `under` -> `back`

Phase timings (JS):
- `left` starts immediately
- `under` at ~`390ms`: `index.html:2714`
- `back` at ~`690ms`: `index.html:2719`
- cleanup at ~`1080ms`: `index.html:2725`

Tuning knobs (hero carousel feel):
- Auto-advance interval: `AUTO_INTERVAL` at `index.html:2535`
- Stack spacing/depth transforms: `applyCardStyles()` at `index.html:2601`
- Phase transforms/easing in CSS:
  - `.is-leaving-left` `index.html:372`
  - `.is-leaving-under` `index.html:379`
  - `.is-leaving-back` `index.html:386`

## 3) First Hero Video “Polish Load” (important UX fix)

Locations:
- Video preload tag in `<head>`: `index.html:7`
- Loading mask + hidden-first-frame behavior: `index.html:291` and `index.html:306`
- Warm/prep logic in JS: `index.html:2540`-`index.html:2595`

What it does:
- Preloads first hero video aggressively
- Masks ugly first frame while loading
- Primes a better visible frame (~`0.35s`) before showing
- Starts active video after intro animation + media readiness

Why this exists:
- Avoids the “bad frozen first frame” vibe on first load
- Makes the reveal animation land on a better-looking moment

## 4) Testimonials Carousel (continuous, premium motion)

Locations:
- CSS shell/cards/arrows: `index.html:1132` and `index.html:1212`
- JS logic (JSON-driven track): `index.html:2765`

What it is:
- Track-based horizontal carousel (not a fade slider)
- Duplicates cards for seamless looping
- Auto-scrolls continuously
- Supports drag/swipe + arrows
- Auto-scroll resumes after interaction

Why it feels good:
- Uses `requestAnimationFrame` with a small constant velocity
- No harsh snapping by default
- Manual input pauses/resumes gently

Key tuning knobs:
- Speed (`velocity`): `index.html:2788` (currently increased ~50% from prior)
- Resume after interaction: `resumeAutoLater()` at `index.html:3006`
- Step by card width for arrows: `stepByCards()` at `index.html:3013`

Interaction behavior:
- Pauses on drag/swipe and arrow click
- Resumes after a short delay
- Also pauses when tab is hidden (`visibilitychange`)

## 5) Mobile Nav Dropdown (polished, not just functional)

Locations:
- Mobile nav button + panel CSS: `index.html:151` and `index.html:1710`
- JS dropdown behavior: `index.html:2479`

What it does:
- Hamburger morphs into `X`
- Cream/gold dropdown panel under fixed nav
- Closes on:
  - link click
  - outside click
  - `Esc`
  - resize back to desktop

Why it matches the site:
- Uses same cream/gold/green palette
- Inner border frame treatment mirrors hero/cards
- Short motion (`opacity + translateY`) instead of a generic slide drawer

## 6) Scroll-Reveal Pattern (used site-wide)

Locations:
- Services: `index.html:3075`
- About: `index.html:3105`
- Gallery: `index.html:3143`
- Testimonials: `index.html:3169`
- Contact: `index.html:3183`

Pattern:
- `gsap.from(...)` with:
  - `y` or `x` offsets
  - `opacity: 0`
  - `duration ~0.6-1.0s`
  - `ease: 'power3.out'`
  - `stagger` on repeated elements

Refresh safety:
- `ScrollTrigger.refresh()` on window load + delayed refresh: `index.html:3237`
- This helps after media/layout settles (especially hero/video/mobile changes)

## 7) Micro-Interactions (small but important)

Locations:
- Button hover scale with GSAP: `index.html:3227`
- Card hover lifts are mostly CSS transitions (services, gallery, testimonial cards)

Style notes:
- Keep hover scale subtle (`1.02`)
- Prefer translate/opacity/scale over heavy shadows or bounce
- Avoid abrupt “app-like” motion on this brand; it should feel crafted

## If You Need To Add A New Animation (best practice for this site)

Use this decision rule:
- Page load / sequence reveal: GSAP timeline (hero-style)
- On-scroll entrances: `gsap.from` + `ScrollTrigger`
- Continuous motion / draggable interactions: custom JS (`requestAnimationFrame`)
- Simple hover/focus polish: CSS transitions (or tiny GSAP for button scale)

Keep the vibe consistent:
- Use `power3.out` / `power4.inOut` / soft cubic-bezier curves
- Prefer stagger + overlap instead of long isolated animations
- Keep motion restrained and premium (no bouncy UI unless intentionally playful)

## Fast Copy Patterns (for future agents)

- “Reveal a section like existing site”:
  - Copy a `gsap.from` block from `index.html:3075` and change selector/offset
- “Add another stacked media carousel”:
  - Reuse hero stack model from `index.html:2516`
  - Keep 3-phase card movement (`left -> under -> back`)
- “Add a smooth auto-scrolling card row”:
  - Reuse testimonial track architecture from `index.html:2765`
  - Duplicate card list for seamless loops

## Notes / Caveats

- `index.html` is currently the single source of truth for layout, styles, and JS, so motion changes are tightly coupled.
- When changing media sizes/layout, re-check:
  - hero desktop height balance
  - mobile overflow
  - `ScrollTrigger.refresh()` behavior

