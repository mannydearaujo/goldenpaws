# Golden Paws Pet Grooming — Website

Static HTML marketing site for Golden Paws Pet Grooming (Lexington, MA), deployed via GitHub Pages.

## Documentation maintenance rule

**Whenever a change is made to this project, update the relevant MD file(s) in the same session** — don't let docs drift from the code:

- Structural/deploy/design-system/content-rule changes (new pages, nav changes, brand.css edits, new conventions, new content rules) → update the relevant section of this **root `CLAUDE.md`** (and bump the version note in "Stack" if `brand.css` changes).
- Add a one-line entry under **"Project history"** below for any change worth remembering later, in the same chronological/phase format already used.
- If a change supersedes something in `Documentation/Autonomous_SEO_Content_Distribution_Engine_Reviewed.md` (e.g. a new content guardrail), update that doc too.
- If a change affects the brand kit's design tokens/spec (`Golden_Paws_Complete_Branding_Logo_Kit/`), update the status notes at the top of `README_START_HERE.md` and `CLAUDE_CODE_BRAND_IMPLEMENTATION_HANDOFF.md` rather than leaving them to drift further from shipped reality.
- Keep the "Outstanding / deferred work" section honest — add new deferred items when they're deferred, remove them when they're done, and re-verify against `git log`/`git status` rather than trusting a stale note.
- Keep `CLAUDE.md` and `AGENTS.md` aligned when project rules, deployment notes, site structure, content rules, or project history change. Claude-oriented sessions should update `CLAUDE.md`; Codex/agent-oriented sessions should update `AGENTS.md`; when a rule applies to both, update both in the same session.

## Deploy model

- Repo: `github.com/mannydearaujo/goldenpaws`
- Served by **GitHub Pages from `main`**, custom domain **goldenpawspetgrooming.com** (`CNAME` file at root).
- **There is no staging branch.** Pushing to `main` deploys live immediately. Established workflow is direct commits to `main` — confirm with the user before pushing anything that isn't ready to go live.
- Extensionless URLs work in production (e.g. `/book` → `book.html`) but **404 on local preview** (`python -m http.server`) — don't treat that as a bug.
- Canonical domain `https://goldenpawspetgrooming.com/` is used for all asset/OG/canonical URLs — never relative-link to GitHub raw or Pages subdomain.

## Stack

Plain HTML + one shared stylesheet, no build step, no framework.

- `assets/css/brand.css` — single shared stylesheet (714 lines) loaded with a **cache-busting query string** (`brand.css?v=N`) on every page. **Bump `N` on every edit to brand.css** or browsers (Safari especially) serve stale CSS. Current version: `v=8` (bump to `v=9` on next brand.css edit) on all pages.
- `assets/logo/` — SVG logo family.
- `assets/brand/` — favicons + OG images.
- `lead-tracking.js` — GA4 event tracking helper, included in `<head>` of every page.
- GA4 property: `G-29DBKD0B56`.
- The full branding-kit folder (`Golden_Paws_Complete_Branding_Logo_Kit/`) and `.claude/` are **gitignored** — local reference only, not deployed.

## Design system (rebranded June 2026)

Bright/bubbly look:
- Sky-blue `#25B8E8` page canvas, cream `#FFF7EF` / white rounded content cards floating on it.
- Accent colors: vivid gold `#F7C600`, crimson `#B51F2E`, royal `#1D4ED8`, deep-navy-ink text `#152A4D`.
- Fonts: Baloo 2 (display/headings) + DM Sans (body).
- Logo = HTML lockup (gold paw + crimson "Golden Paws" + centered royal "PET GROOMING", no flank dashes) — full color in header, full color on cream footer card.
- Homepage hero uses a round-framed photo (`DSC08751.jpg`).
- Mobile nav = hamburger toggling `.gp-open` on `#gp-nav`.
- `brand.css` includes **legacy compatibility aliases** (`--red`/`--navy`/etc CSS vars, `.gp-container`, `.gp-btn-navy`) so older page markup still styles correctly without rewriting every page's classes.

## Site structure (40 pages)

- `index.html` — homepage
- `book.html` — booking page
- `services.html` — services hub
- `breed-grooming.html` — breed-grooming hub (note: **not** `/breeds`)
- `service-areas.html` — service-area index
- 4 service-detail pages: bath/brushout, deshedding, nail trim, puppy first groom
- 9 breed-specific grooming pages (Lexington): bernedoodle, bichon frise, cocker spaniel, golden retriever, goldendoodle, labrador retriever, poodle, schnauzer, shih tzu
- 22 town pages: `dog-grooming-<town>-ma.html` (Acton, Arlington, Bedford, Belmont, Billerica, Burlington, Chelmsford, Concord, Lincoln, Malden, Medford, Melrose, Newton, Reading, Stoneham, Tewksbury, Wakefield, Waltham, Watertown, Wilmington, Winchester, Woburn)

Every page shares: header (logo lockup + hamburger nav), cream footer, favicons + manifest + OG/Twitter tags, GA4, canonical link, breadcrumbs. No inline `<style>` blocks remain on any page.

## Content rules (apply site-wide, no exceptions)

1. **No "one dog at a time" phrasing** — falsely implies a single-dog salon (there are multiple groomers). Use "dedicated groomer / unhurried / appointment-only" instead.
2. **No em-dashes anywhere in the HTML** — reads as AI-generated/AI-slop to the owner. Use commas or periods. Zero remain across all 40 pages as of June 2026 — keep it that way.
3. **Never invent local facts.** Town-page local detail (roads, exits, borders, parks) must be verifiable, not fabricated.
4. **Cat grooming is removed site-wide** — don't reintroduce it.
5. Google rating displayed as **4.6**.
6. Bath & Tidy Trim service includes complimentary teeth brushing / anal gland expression — keep this in service copy.
7. Town pages must avoid doorway-page/duplicate-content risk: genuinely unique, human-voiced copy per town (real local detail, varied H2 structure, per-town FAQ). Visible FAQ copy and `FAQPage` JSON-LD must stay in sync.

## Nav + CTA + tracking conventions

- Header nav order: **Home · Services · Breed Grooming · Service Areas** (Gallery/Reviews intentionally dropped from global nav).
- Mobile sticky CTA bar (`.gp-mobile-cta`) = three buttons: **Call / Text / Book**.
  - Text button: `sms:7812749144`, `data-track="sms_tap"`.
  - `.gp-m-text` style = gold background / navy text.
- Homepage + booking-page hero CTAs are split into trackable **Call** (`phone_tap`) and **Text us** (`sms_tap`) rather than one combined "Call or text" button.
- GA4 Key Events confirmed active: `phone_tap`, `booking_click`, `sms_tap`, etc.
- Each `dog-grooming-<town>-ma.html` has an extractable AEO-style question H2 ("Do you groom dogs from `<town>`, MA?") right after the intro, for AI-search answer extraction. The 4 service-detail pages already had 7–8 question H2s each.
- Breadcrumb dead-ends are fixed: breed pages link back to `/breed-grooming`, service pages link back to `/services`.

## Reference docs

- `Documentation/Autonomous_SEO_Content_Distribution_Engine_Reviewed.md` — master prompt for the autonomous SEO/content engine. Encodes the doorway-page guardrail, the "never invent local facts" rule, and an E-E-A-T/operator-voice section (avoid AI-tell phrasing). Update this doc if content rules above change.
- `Documentation/GoldenPaws_Website_Build_Reference.docx` — original build reference doc.

## Project history (chronological, by theme)

**Phase 1 — initial build (Apr–May 2026).** Site created and iterated directly through GitHub's web UI ("Add files via upload" / "Update index.html" commits) — single `index.html`, CNAME set up, initial image/SEO-file uploads.

**Phase 2 — sitewide page scaffolding (late May 2026).**
- Added header, footer, GA4, and breadcrumbs to all subpages; fixed `priceRange` schema (`f20bdbd`).
- Added Service Areas nav link and footer Navigate column to homepage (`570e8e5`).

**Phase 3 — lead tracking & structural fixes (mid-June 2026).**
- Added Golden Paws lead tracking (`lead-tracking.js`) and mobile CTAs (`4aedfcd`).
- Fixed duplicated header/breadcrumb/main/footer markup that had crept into subpages (`7f805a0`).
- Pointed logo/gallery images and sitemap at the canonical domain (`a3235b4`).

**Phase 4 — full rebrand (June 21, 2026).**
- Redesigned homepage with new bright/bubbly brand identity and the shared `brand.css` stylesheet (`02ba330`).
- Propagated the new brand shell (header/footer/nav/favicons/OG) to every page on the site (`27c0a47`).
- Refreshed booking page brand styling to match (`8675421`).
- Built `services.html` and `breed-grooming.html` hub pages (`b7bfa45`), wired services nav to the hub (`cab2535`), linked homepage service cards to hub sections (`1f2ed7d`), featured deshedding/puppy cards (`191af58`), improved anchored-section scroll offset (`074729e`), made service cards open at top of page (`56e275a`).
- Added favicons + OG/Twitter tags to all pages and unified site nav (`998d2ed`).

**Phase 5 — AEO/AI-search & SEO polish (June 22, 2026).**
- Fixed city-page SEO schema and positioning (`9dd1160`).
- Completed a full SEO rewrite cleanup pass (`f53a286`).
- Aligned homepage H1 and meta/social descriptions to service-area framing (`0cbfab9`).
- Added Home nav item, sitewide Text (SMS) CTAs, and per-town question-form H2s for AEO (`f3c506a`).
- Reworded homepage H1, aligned meta/social descriptions (`3018648`); added Winchester to homepage H1/meta, grouped hero Call+Text, renamed hero CTA (`37ae9c9`).
- Linked Find-us town pills to their pages, removed Metro Boston from homepage (`0b6567b`); added "See all service areas" link to homepage Find-us pills (`2292673`).
- Unified favicon across all pages (`088e8d2`).
- Added project guidance files for Claude/Codex sessions and synced FAQ JSON-LD with visible FAQ copy.
- **Town-page differentiation pass:** all 22 `dog-grooming-<town>-ma.html` pages rewritten with unique, human-voiced local copy and synced FAQ/JSON-LD (eliminates doorway-page risk). The two global content rules above (no "one dog at a time", no em-dashes) were applied site-wide during this pass. Homepage `<h1>` became "Professional Dog Grooming in Lexington, MA, Serving Lexington & Surrounding Communities." Pages were regenerated via a throwaway Python script that swapped only the `<main>` inner content + FAQ JSON-LD, leaving each page's head/schema/footer shell intact.

Site audits clean against the `ai-search-readiness-audit` rubric (Strong band): all titles/metas distinct, one H1 per page, schema present, NAP consistent, zero anti-patterns, no broken links.

## Outstanding / deferred work

As of 2026-06-22, working tree is clean and all phases above (including the town-page differentiation pass) are committed and live on `main`. No open deferred items are currently tracked. Re-verify against `git log` / `git status` before assuming this section is still accurate — it will go stale as work continues.
