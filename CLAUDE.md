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

- `assets/css/brand.css` — single shared stylesheet (930 lines) loaded with a **cache-busting query string** (`brand.css?v=N`) on every page. **Bump `N` on every edit to brand.css** or browsers (Safari especially) serve stale CSS. Current version: `v=10` (bump to `v=11` on next brand.css edit) on all pages.
- `assets/logo/` — SVG logo family.
- `assets/brand/` — favicons + OG images.
- `lead-tracking.js` — GA4 event tracking helper, included in `<head>` of every page. Defines `window.gpTrackLead`, also pushes to `dataLayer` for GTM, and loads `gtag.js` directly if not already present. **GA4 events are sent directly via this script's own `gtag()` calls, not through GTM** — GTM (`GTM-PK5D6W8R`, installed sitewide in `<head>`/`<body>`) currently has zero tags configured, so don't add GA4 tags in GTM without first removing the direct `gtag()` calls here, or every lead event will double-count.
- GA4 property: `G-29DBKD0B56`.
- `automation/lead-automations.gs` — tracked copy of the standalone Apps Script project ("Golden Paws Lead Automations", lives at script.google.com under `goldenpawslexington@gmail.com`) that sends a branded HTML confirmation email to new-client Tally intake submissions. Bound to the intake Google Sheet via `SpreadsheetApp.openById()`, runs on a 10-minute time-based trigger. Apps Script doesn't deploy from git — edit in the Apps Script editor and paste the result back into this file.
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

## Site structure (42 pages)

- `index.html` — homepage
- `book.html` — booking choice page
- `new-client-intake.html` — required new-client Tally intake page
- `existing-client-booking.html` — existing-client MoeGo booking page
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
- GA4 Key Events confirmed active (verified directly via GA4 Admin API 2026-08-18): `phone_tap`, `booking_click`, `sms_tap`, `new_client_intake_submit`.
- Each `dog-grooming-<town>-ma.html` has an extractable AEO-style question H2 ("Do you groom dogs from `<town>`, MA?") right after the intro, for AI-search answer extraction. The 4 service-detail pages already had 7–8 question H2s each.
- Breadcrumb dead-ends are fixed: breed pages link back to `/breed-grooming`, service pages link back to `/services`.

## Reference docs

- `Documentation/Autonomous_SEO_Content_Distribution_Engine_Reviewed.md` — master prompt for the autonomous SEO/content engine. Encodes the doorway-page guardrail, the "never invent local facts" rule, and an E-E-A-T/operator-voice section (avoid AI-tell phrasing). Update this doc if content rules above change.
- `Documentation/Golden_Paws_Brand_Audit_and_Print_Design_Prompt.md` — brand/logo/typography audit (August 2026) plus the reusable Claude Design prompt pack for print marketing (wall menu, flyers, rack card/tri-fold, business cards). Treat `assets/css/brand.css` as the source of truth for screen and this doc as the source of truth for print. Update it if palette, type, or NAP facts change.
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
- Fixed breed-page BreadcrumbList schema to point at `/breed-grooming` instead of the old `/breeds` URL and refreshed sitemap `lastmod` dates to 2026-06-22 for recrawl clarity.

Site audits clean against the `ai-search-readiness-audit` rubric (Strong band): all titles/metas distinct, one H1 per page, schema present, NAP consistent, zero anti-patterns, no broken links.

**Phase 6 — Tally new-client intake, GTM, and lead automation (June 28–29, 2026).**
- Added a Tally-powered new-client intake embed to `book.html` (existing clients still use the MoeGo scheduler) and an `intake=thanks` redirect/thank-you state; wired up GTM container `GTM-PK5D6W8R` sitewide (`c0970df`).
- Split booking into three clean paths: `/book` is a chooser page, `/new-client-intake` hosts the required Tally form for new clients, and `/existing-client-booking` hosts the MoeGo scheduler for returning clients.
- Resolved a rebase conflict on the 11 town pages whose coverage had separately moved to redirect-style "coverage moved" notice pages — kept the newer notice-page content and re-applied the GTM script/noscript to each.
- **Fixed a real bug:** `new_client_intake_submit` never fired in production because the inline `intake=thanks` tracking script ran synchronously during page parse, before the `defer`-loaded `lead-tracking.js` had set `window.gpTrackLead`. Fixed by polling for `gpTrackLead` instead of relying on `DOMContentLoaded` timing (`027e8b4`, `84ffb87`). Verified live via GA4 Realtime after the fix.
- Confirmed `booking_click` and `phone_tap` were already marked as GA4 Key Events; decided **against** adding GA4 event tags in GTM since `lead-tracking.js` already sends GA4 events directly — adding GTM tags on the same events would double-count every lead.
- Built `automation/lead-automations.gs` (Apps Script, not deployed from this repo — see Stack section above): sends a branded HTML confirmation email to new-client Tally submissions on a 10-minute trigger, replacing the need for Tally Pro's paid auto-reply feature. Tested end-to-end twice with a real test row/real email (deleted after).
- Looked into MoeGo's appointment/booking API for a future same-day-reminder integration: a real REST API exists (`github.com/MoeGolibrary/moegoapis`) but API keys are issued manually through MoeGo's Customer Success team, no self-serve signup, no Zapier app.

**Phase 7 — booking-flow schema polish (July 9, 2026).**
- Added `WebPage` and `BreadcrumbList` JSON-LD to `/book`, `/new-client-intake`, and `/existing-client-booking` after booking-flow QA found those pages had correct canonicals/sitemap coverage but no page-level schema.

**Phase 8 — search/analytics audit and internal-linking pass (August 18, 2026).**
- Ran a full Search Console + GA4 audit using the North Atlas Studio agency's service-account scripts (`ga4-report.mjs`, `search-console-report.mjs`, in the separate `Website & SEO Agency/scripts/` repo, keyed against `scripts/signal-registry.json`) — pulled live API data rather than reading the dashboards.
- Diagnosis: weekly Search Console impressions grew roughly 5x since the June rebrand/town-page expansion (289 → up to 1,645/week) while average position slid from #6–9 to #16–23 over the same stretch, so clicks stayed close to flat. This is authority dilution from launching 22 similar-tier town pages at once, not a content-quality problem — confirmed by reading the actual `dog-grooming-waltham-ma.html` and `dog-grooming-watertown-ma.html` source, both of which are genuinely town-specific (real landmarks/routes) and schema-correct already.
- Confirmed with day-by-day GA4 data that the new-client intake funnel (`booking_click`, intake open/embed_load/submit) softened together in the most recent full week versus the week before (Aug 3–9 → Aug 10–16: 7→3 intake submits, 56→43 booking_click), tracking the same softening seen in Search Console clicks over the same window. Read at the time as the same root cause (fewer people arriving from search that week) rather than a broken form — **Phase 9 below found a real, separate form bug that had likely been suppressing completions independently of search traffic since Phase 6.**
- Shipped a repo-side fix: added contextual, real-fact in-body links (distinct from the uniform footer/pill list every page already carries) from `index.html`'s "Find us in Lexington" section and `services.html`'s new "Serving Nearby Towns" section into the 5 weakest-ranking town pages (Arlington, Bedford, Burlington, Medford, Watertown) — reusing distance/route facts already published on each town's own page, no new claims invented.
- Deferred: Google Business Profile activity and directory/citation consistency for the same 5 towns — the more durable lever for local-pack-adjacent rankings — needs Manny's GBP login and is out of scope for a code-only session.

**Phase 9 — fixed a real bug: the Tally intake iframe was silently truncating the form (August 18, 2026).**
- Investigated the ~31% intake load-to-submit rate flagged in Phase 8. Found the `new-client-intake.html` Tally embed used `dynamicHeight=1` (tells Tally to auto-resize the iframe to fit content) but never loaded Tally's own `embed.js` widget script, which is required for that resize to work. Result: the iframe was hard-locked at `height="1250"` regardless of actual form height, since Phase 6 (late June).
- Measured the real form height directly: **2780px** — meaning more than half the form (everything past 1250px, on this multi-page Tally form, confirmed via its `Tally.FormPageView` postMessage events) was likely unreachable or awkwardly double-scrolled for every visitor, for roughly 7 weeks.
- Fix: added `<script async src="https://tally.so/widgets/embed.js"></script>` (the vendor-required resize script), raised the static `height` fallback from 1250 to 3000 as a safety net in case the resize script doesn't fire for some user, and removed `loading="lazy"` on the iframe (unnecessary added latency risk on a third-party embed already gated behind a click). Verified via clean cache-busted loads on both desktop and mobile viewports that the resize now correctly shrinks the iframe to the real 2780px content height.

**Phase 10 — brand + print audit and Claude Design prompt pack (August 21, 2026).**
- Audited the shipped identity across three sources that had drifted apart: `assets/css/brand.css` (screen), `Golden_Paws_Complete_Branding_Logo_Kit/` (vector/print), and the photo of the physical lobby sign. Found the site header lockup, the kit vector files, and the physical sign are three visually different logos.
- Found three real defects in the kit/`assets/logo` vector family: the primary horizontal logo's right flank rule strikes through the final "G" of "GROOMING"; the kit paw icon is asymmetric (three top toes plus one lower-left toe, no lower-right toe) while both the site header paw and the physical sign are symmetric; and every kit SVG sets the wordmark as live `Georgia`/`Arial` `<text>` rather than outlines, so any printer without those fonts will silently substitute.
- Documented the two-gold split: kit/print `#D7B24A` (matches the mirrored gold acrylic sign) vs shipped site `#F7C600`. Recommendation recorded as print gold `#D7B24A`, screen gold `#F7C600`.
- Measured contrast on the palette. Hard rules now written down: gold is never a text color (1.61:1 on white), white on sky blue fails (2.31:1), crimson on sky blue fails (2.84:1). Navy `#152A4D` on gold (8.86:1) and on cream (13.47:1) are the safe pairings.
- Wrote `Documentation/Golden_Paws_Brand_Audit_and_Print_Design_Prompt.md`: the audit plus a paste-ready Claude Design prompt pack (brand-system block, wall menu board, flyer, rack card, tri-fold, business card, optional extras), the verified NAP/proof-point block, the site's own service copy, print production checklist, and the four inputs Manny still has to supply (prices, wall dimensions, photo picks, QR targets).
- No site code changed in this session.

**Phase 11 — full lead audit, tracking-accuracy fix, sitemap dates (August 29, 2026).**
- Triggered by a reported drop in intake submissions, bookings, and calls. Pulled live GA4 + Search Console via the agency service-account scripts, cross-checked against **Tally's own submission log**, and inspected the live SERPs.
- **Verdict: nothing on the site is broken.** All 11 key pages 200 OK; robots.txt correct; the 11 thin "coverage moved" stubs are properly `noindex` + canonical to `/service-areas` and correctly absent from the sitemap; the Phase 9 iframe fix **verified working on production** for the first time (2,492px desktop / 2,543px narrow, stable — earlier localhost-only verification was insufficient).
- **Key measurement finding: `new_client_intake_submit` was over-counting.** It fired on *every* page load carrying `?intake=thanks`, so reloads/back-navigation/revisits double-counted. GA4 showed 6 submits in a week where Tally recorded 4. Against Tally's real log the form has run at **~2 submissions/week since mid-July**, and the first week of July (8 submissions) was a one-off launch surge. The apparent "collapse to 1" was a soft dip on a tiny base, amplified by the counting bug. **Fixed** (see below) — treat pre-2026-08-29 `new_client_intake_submit` figures as inflated.
- **Real cause of the business dip is off-site and invisible to GA4/GSC:** competitors began buying Google Ads above the Golden Paws listing (Mimados Pet Grooming of Newton, 4.9★/220 reviews; Splash and Dash Groomerie, Burlington Mall Rd) and Splash and Dash shows **"Opening Soon"** between Lexington and Burlington. Golden Paws is not running ads.
- **Zero-click structural problem:** high-intent commercial queries rank page-one and earn nothing ("dog bath and brush" pos 5.6 / 0 clicks; "affordable dog grooming" pos 10 / 0 clicks; "dog groomer near me" pos 8.2 / 0 clicks). Confirmed by loading the SERPs: the local/map pack plus a paid slot occupy the first screen, so organic rank is near-worthless for "near me" queries. **The GBP listing, not the website, wins these clicks.** Brand queries = 61 clicks @ 30.2% CTR; non-brand = 15 clicks @ 3.02%.
- **The Phase 8 internal-linking fix did not work.** 11 days on, all five target towns held flat or worsened (Arlington 28.9→32.4, Bedford 11.6→13.3, Burlington 38.1→41.9, Medford 25.3→28.3, Watertown 58.7→57.4). Internal linking alone cannot fix authority dilution; do not spend further effort there. Off-site signals (reviews, GBP activity, citations) are the remaining lever. **⚠ Partly retracted by Phase 13 (2026-10-14): this was called after only 11 days and the page-level measure used was the wrong one. All five towns' page-level positions have since improved sharply. The underlying point stands — the pages still do not rank for their own town queries — but "it did not work" and "stop spending effort there" were premature.**
- **Shipped two fixes:** (1) `new-client-intake.html` now strips `intake=thanks` from the URL via `history.replaceState` immediately after the submit event is counted, so reloads no longer double-count — other query params (`utm_*`) are preserved, and the param is deliberately *not* cleared when the tracker failed to load, so a later reload can still capture that submission. Verified locally: 1 event on submit, 0 on reload, banner still displays. (2) `sitemap.xml` `lastmod` dates rebuilt from real per-file `git log` dates rather than blanket-stamping today (which Google learns to distrust) — 31 URLs, valid XML.

**Phase 12 — roadside print campaign first proofs (September 9, 2026).**
- Built a first-round roadside campaign from the shipped website branding: a 24 x 36 inch two-sided A-frame with right- and left-facing arrows, a 30 x 120 inch feather-flag concept, and a two-sided 3.5 x 2 inch salon business card with no QR code.
- Created editable SVG and Canva versions plus three print PDFs. Used the symmetric paw, no descriptor flank rules, brass print gold `#D7B24A`, and embedded Baloo 2, DM Sans, and Georgia Bold in the PDFs.
- The A-frame is designed for passing and intersection-stopped traffic at the storefront. The feather flag remains a concept until a vendor template supplies the exact pole pocket, cut line, and safe area. See `Documentation/Golden_Paws_Roadside_Print_Campaign_2026.md`.

**Phase 13 — full channel audit: GBP vs website, and a correction (October 14, 2026).**
- Second full audit, six weeks after the Phase 11 fixes. Pulled live GA4 + Search Console via the agency service-account scripts, cross-checked against Tally's own submission log, and read the Google Business Profile owner dashboard directly. Deliverable: artifact "Where The Leads Come From".
- **The Phase 11 tracking fix is confirmed working.** GA4 counted 16 `new_client_intake_submit` in the last 28 days where Tally logged 18 — it now slightly *under*-counts (~89% capture, normal for browser-side analytics) instead of over-counting. Post-2026-08-29 figures can be trusted.
- **Intakes are up, not down.** Tally went 28 (Aug 29) → 57 (Oct 14): 29 submissions in 46 days, ~4.4/week against a prior ~2.9/week.
- **Headline structural finding: the Google Business Profile is the real acquisition channel, not the website.** May–Oct GBP: 3,716 profile views, 642 searches, 1,578 interactions, **331 calls**, **565 website clicks**. The website took 343 sessions in 28 days by comparison. 74% of profile views are mobile. **84% of GBP searches are brand** ("golden paws…" = 540 of 642), mirroring the website (brand 25.7% CTR vs non-brand 1.4%). The business runs on word of mouth and repeat custom; neither surface wins much new discovery.
- **GBP bookings = 0 across 5.5 months** while calls and website clicks both work — the booking action is unconfigured or not surfacing on the highest-traffic surface the business has. Free fix: point it at `/book`. GBP also still shows Google's "complete info" prompt.
- **Reviews have not moved: still 4.6★/117**, identical to 2026-08-29 and to the 2026-09-05 business read. Six weeks, zero new reviews, against Mimados 4.9★/220 and Robins Nest 4.8★/65 on the same map pack.
- **Organic search fell and it mostly did not matter.** Sessions 263→181 (–31%); GSC clicks 158→120 (–24%), impressions 5,968→4,050 (–32%) — but **average position improved 19.9→13.6** and CTR rose 2.65%→2.96%. Google dropped a mass of deep, low-relevance impressions. Drop starts the week of Sept 6 and holds; consistent with a Google-side reshuffle, not confirmable from inside these accounts. Ruled out: the `Disallow: /*.html$` robots rule, which dates to June 26.
- **Correction to Phase 11 on the town pages.** All five improved at page level (Arlington 32.4→18.2, Bedford 13.3→5.6, Burlington 41.9→19.5, Medford 28.3→15.0, Watertown 57.4→20.0). But page-level average position is a poor measure: the Arlington page draws only ~32 of its 257 impressions from actual Arlington searches, and its real town queries still sit at 48.8 / 61.9 / 63.3. So the pages still do not win their towns, but the August verdict was called far too early on the wrong metric.
- **Arlington is quietly the top source of new clients** — 8 of the 20 most recent Tally intakes, more than Lexington — and it is not coming from search (its queries rank 48+). Map pack, proximity or word of mouth. Worth knowing before any spend is aimed at a town.
- **Site health clean:** all 11 key pages 200, Phase 11 intake fix still live on production, 11 "coverage moved" stubs correctly noindex + canonical to `/service-areas` and absent from the sitemap, robots.txt correct, sitemap valid at 31 URLs, mobile 68% of sessions.
- Minor: one client submitted the intake twice three minutes apart (Oct 12), so the Apps Script sent two confirmation emails. De-duplicate on email within a short window if it recurs.
- No site code changed in this session.

**Phase 14 — cleanup pass on everything the Phase 13 audit left fixable (October 14, 2026).**
- **Stopped internal print deliverables from being published on the live site.** `output/` (print PDFs, SVGs, Canva exports, proofs — 2.8MB) and `tools/` (build script + OFL fonts — 620KB) had sat untracked since 2026-09-09. GitHub Pages serves this repo's root, so committing them would have exposed internal proofs at `goldenpawspetgrooming.com/output/…` and made them crawlable. Both are now gitignored, matching the rule already applied to `Analytics/`, `Documentation/` and the branding kit.
- **Unified the LocalBusiness entity across the whole site.** 28 pages carried unanchored `LocalBusiness` nodes, so search engines could resolve up to 48 separate business entities. Every node now carries `"@id": "https://goldenpawspetgrooming.com/#business"` (the anchor Phase 7 introduced on the booking pages). Verified: 108 JSON-LD blocks parse, 48/48 LocalBusiness nodes anchored. This matters more after Phase 13 — the Business Profile entity, not page rankings, is what the business runs on.
- **Fixed the duplicate-confirmation bug** found in Phase 13. `automation/lead-automations.gs` guarded only per-row, so a client who submits twice (Tally writes one row per submit) got two identical emails. Now also de-duplicates by email address inside a 6-hour window, including two duplicate rows arriving unsent in the same scan — the actual 2026-10-12 case. Duplicate rows are still stamped so the 10-minute scan does not retry them. Simulated against that case: one email instead of two. **Applied to the live Apps Script project on 2026-10-14** via the editor (Apps Script does not deploy from git). Verified: the saved code reloads byte-identical to the tracked copy, and the 10-minute `sendNewClientConfirmations` trigger is intact and still running.
- **Retired `#222222` for brand ink `#152A4D`** in the two mono logo variants, closing that part of the Phase 10 asset debt.
- **Did not hand-patch the logo geometry, deliberately.** All 11 `assets/logo/*.svg` share the same asymmetric paw (three top toes plus a lower-left toe at `cx=43`, no lower-right). The correct mirror is `cx=268, cy=88, rotate(32)`, but inserting it clips the 390-wide paw icons (the toe reaches x≈402 after their `scale(1.25)`) and collides with the wordmark in the three horizontal lockups (toe reaches x≈268 against text starting at x=260). Those need the recorded rebuild — canvas and lockup geometry together — not a patch, and the Phase 12 pipeline (`tools/build_marketing_materials.py`) already renders a correct symmetric paw. These files are referenced nowhere on the site (0 references in HTML and CSS); they are legacy print-kit assets.
- No live site content changed: the schema additions are inside JSON-LD blocks, and the logo files are unreferenced.

**Phase 15 — holiday 2026 flyer overlay and animated festive bar, shipped live (October 17, 2026, commit `dbb8e28`).**
- Manny supplied a holiday schedule flyer (`assets/holiday/holiday-schedule-2026.webp` plus `.jpg` fallback). Schedule: open Mon 11/23 to Wed 11/25, closed Thu 11/26 and Fri 11/27, open Sat 11/28; open Sun 12/20 to Thu 12/24, closed Fri 12/25 and Sat 12/26; open Mon 12/28 to Thu 12/31. Open days 8:00 AM to 5:00 PM (extended versus normal Tue to Sat 8 to 4).
- **Design decision (Manny): no dedicated holiday section on the page.** Instead the flyer shows as a modal overlay on `index.html` and `book.html`, closed with the X (Esc also closes, for keyboard users). The flyer is fully opaque and springs forward over a light dimmed backdrop (only the backdrop fades). Backdrop click deliberately does not close it. Auto-opens only on `index.html` and `book.html` (`data-page="home"|"book"`), once per page per browser session (`sessionStorage` key `gpHoliday2026:<page>`); every other page uses `data-page="bar"`, where only the bar's View button opens it, about 0.7s after load so it does not touch LCP. Overlay has real buttons below the image: homepage = Book now / Text us; `/book` = New client intake / Existing client booking. The flyer text is in the image `alt` so the schedule is still machine-readable.
- Festive top bar blending Thanksgiving and Christmas (burnt-orange-to-pine gradient, turkey in a Santa hat, maple leaf, holly, snowflake, candy-cane stripe; right-side art hides under 600px so it stays one compact row down to 320px wide) on all 31 pages that carry the site shell (the 11 noindex "coverage moved" town stubs have no shell, so they are excluded). Animated (transform/opacity only): twinkling Christmas lights along the top edge, turkey waddle with bouncing hat pom, ruffling tail, falling maple leaves over the autumn half and snow over the Christmas half, shine-sweep and pulse on the gold button, and a subtitle that cycles through the real holiday dates every 4.2s (pauses on hover/focus; shows a short one-liner on phones, hidden under 350px). All motion is off under `prefers-reduced-motion`; its "View schedule" button reopens the overlay. Falling-snow CSS animation behind the dialog, disabled under `prefers-reduced-motion`.
- **Seasonal files, all removable in early January 2027:** `assets/css/holiday.css` (loaded `?v=5`; JS `?v=3`, deliberately separate from `brand.css` so no cache-bust bump across 42 pages), `assets/js/holiday.js`, `assets/holiday/`, and the bar markup + CSS/JS tags on every page that carries them. The JS self-removes the bar and skips the overlay on/after 2027-01-01 as a safety net.
- Tracking reuses existing events with new labels only (`booking_click`, `sms_tap`, `new_client_intake_open`; labels start `holiday overlay`), so no new GA4 Key Events.
- Read live MoeGo prices and drafted packages (Holiday Glow $25, Calm & Comfort $32, Winter Paw Care $28, Early-Bird and Fresh Start freebies) plus new add-on ideas in the gitignored `output/holiday-2026/` mockup. Those package tiles and the old schedule-section mockups are superseded by the overlay design; package pricing is still unapproved and not on the site. MoeGo was not changed.

## Outstanding / deferred work

As of 2026-10-14 (updated after the Phase 14 cleanup):
- **Holiday 2026 overlay is LIVE (`dbb8e28`). Remove all seasonal files in early January 2027** (`assets/css/holiday.css`, `assets/js/holiday.js`, `assets/holiday/`, the bar markup plus the CSS/JS tags on all 31 shell pages: `grep -l gp-holiday-bar *.html`); the JS self-disables on 2027-01-01 as a safety net. Bar now on every shell page; approve package pricing (`output/holiday-2026/index.html`, unapproved); set GBP special hours and post the flyer to GBP.
- **Reviews remain the single highest-return lever and have not moved in six weeks** (4.6★/117, unchanged since August). Needs a named person asking at pickup daily; at ~580 grooms/month a 5% ask-rate is ~29 reviews/month. Nothing on the website competes with this.
- **GBP booking link: done by Manny, verified 2026-10-14** — set to `https://goldenpawspetgrooming.com/book` (the Bookings list truncates it to the bare domain, so check the edit field, not the summary). Two things to watch: the public knowledge panel still shows only Website / Directions / Save / Share / Call, so the booking action had not propagated to customers at time of check; and GBP Bookings had recorded 0 for 5.5 months, so re-read that metric in ~2 weeks to confirm it is now registering.
- **Complete the Google Business Profile** — Google still flags it incomplete, and completeness feeds local ranking on the surface actually doing the work.
- **Paid search stays deferred** per the 2026-09-05 business read (fix retention and ticket before buying traffic), and the Phase 13 data supports waiting: the funnel's discovery problem is a reputation problem, not a traffic problem.
- **Tally Pro for one month as a diagnostic:** intake converts 13.9% (201 visits → 28 submissions, 18s median visit) and the question-level drop-off report that would name the losing field is Pro-gated. Still undiagnosed.
- Do not invest further in internal linking for the town pages — but note the Phase 11 "it failed" verdict was premature; see Phase 13. The pages still do not rank for their own town queries.
- Review and approve the first-round A-frame, feather-flag, and business-card proofs. Supply the chosen A-frame and feather-flag vendor templates before sending either sign to print.
- GBP posts/photos/Q&A naming Arlington/Bedford/Burlington/Medford/Watertown, plus directory citations (Yelp, Nextdoor, Bing Places). Claude can draft; publishing needs Manny's GBP login. Phase 13 raised the priority of everything GBP-side: that profile, not the website, is the channel.
- Live Apps Script and the tracked copy are in sync as of 2026-10-14. The live project has no docstring header, so it equals this repo's file with the leading `/** … */` block stripped; that normalised form hashes to `515107ec140687c887299327cd4fd02bc369b1fa6571f801dc4a0a7b029c5346` (6,699 bytes, 147 lines). Compare against that before assuming drift.
- Logo rebuild (remaining Phase 10 debt, `#222222` now closed): rebuild `assets/logo/*.svg` from the shipped site lockup — symmetric paw, no flank rules, wordmark outlined. Phase 14 worked out the specifics: the missing toe mirrors to `cx=268, cy=88, rotate(32)`, the 390-wide paw icons need a wider canvas, and the horizontal lockups need the wordmark repositioned (its right flank rule already strikes through the final “G”). Best done through the Phase 12 build pipeline, which already renders a correct paw, rather than by editing the legacy files. Retire the old business-card starter once the Phase 12 card is approved.
- Same-day appointment reminders are **not built**. The Tally intake Sheet has no confirmed-appointment-date column (only a free-text "preferred days/timeframes" field), and actual appointments live in MoeGo, not the Sheet. Needs explicit scoping (e.g. add a staff-filled appointment-date column, or build against the MoeGo API once a key is obtained) before automating.
- MoeGo API integration is unstarted — would need an API key from MoeGo's Customer Success team first.
- Re-verify against `git log` / `git status` before assuming this section is still accurate — it will go stale as work continues.


## Agentic OS — vault-first session protocol

This repo is part of Manny's Agentic OS. The BRAIN is the manny-ai-os Markdown vault:
  VAULT = /Users/mannydearaujo/Documents/Codex/2026-07-07/ana/manny-ai-os
  (canonical value: VAULT_PATH in /Users/mannydearaujo/Agentic OS Build/config/os.config)

Your project record is `VAULT/01-projects/<project>/`, matched by repo name:
  northatlasstudio → north-atlas-studio      goldenpaws → golden-paws-website
  golden-paws-dashboard → golden-paws-dashboard   alpha-gutter → alpha-gutter-website

### START — read before touching anything
1. Read `VAULT/00-brain/SOURCE-OF-TRUTH.md` (ordering + safety rules).
2. Read this project's `VAULT/01-projects/<project>/`: CURRENT-STATE.md, then TASKS.md,
   HANDOFF.md, CONTEXT.md. That is the truth for context, decisions, and open work.
3. Read this repo's local AGENTS.md (Codex) / CLAUDE.md (Claude).
4. If `graphify-out/graph.json` exists, use `graphify query/path/explain` before broad file reads.
5. Restate the current state + top open tasks, and confirm the task, before changing code.

### END — after any meaningful work, keep the vault fresh
1. Append to CURRENT-STATE.md "Recent Work": dated, 1–2 lines on what changed (commits/PRs/URLs).
2. Update TASKS.md (check off done, add new) and HANDOFF.md (what the next session must know).
3. Move finished/decided items out of "Open Work"; record any new decisions.
4. Commit + push BOTH this repo AND the vault. After code changes, run `graphify update .`.
5. Needs Manny but not a hard gate → file a task:
   `bash "/Users/mannydearaujo/Agentic OS Build/bin/file-task.sh" "one actionable line"`.
   Hard sign-off (deploy, send, publish, scope, spend) → write an approval request into
   `/Users/mannydearaujo/Agentic OS Build/.ops/approvals/pending/`.

### Rules
- Manny's latest explicit instruction wins, then SOURCE-OF-TRUTH ordering.
- No external actions (deploy, DNS, send, publish, spend, delete, credentials) without approval.
- No secrets in any repo. Code repos own code truth; the vault owns context/decisions.
- If work changed durable state, it belongs in the vault — never leave it only in chat.
