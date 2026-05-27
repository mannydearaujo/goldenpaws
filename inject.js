#!/usr/bin/env node
// ============================================================
// GOLDEN PAWS — SUBPAGE TRANSFORMER
// inject.js
//
// USAGE (run from repo root after cloning):
//   node inject.js
//
// What it does:
//   1. Reads every .html file in the repo (except index.html,
//      book.html, design-mockup.html)
//   2. Injects GA4, shared CSS, branded header, breadcrumb,
//      CTA strip, and footer into each page
//   3. Wraps body content in .gp-page > .gp-container
//   4. Fixes priceRange schema on affected pages
//   5. Writes updated files back to disk
//   6. Prints a summary report
//
// Run once. Review output. Commit and push.
// ============================================================

const fs   = require('fs');
const path = require('path');
const {
  GA4_SNIPPET,
  SHARED_STYLES,
  HEADER_HTML,
  makeBreadcrumb,
  CTA_STRIP,
  FOOTER_HTML
} = require('./shared-components.js');

// ── Config ──────────────────────────────────────────────────
const REPO_DIR   = process.cwd();   // run from repo root
const OUTPUT_DIR = process.cwd();   // overwrite in-place (or change to a dist/ folder)

// Files to SKIP — these have their own full layout already
const SKIP_FILES = new Set([
  'index.html',
  'book.html',
  'design-mockup.html',
  'google43697d4e4131ee21.html',
]);

// priceRange values that need fixing
const BAD_PRICE_RANGE = ['"priceRange": "639"', '"priceRange": "757"'];

// ── Helpers ──────────────────────────────────────────────────
function getHtmlFiles(dir) {
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.html') && !SKIP_FILES.has(f));
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].replace(/\s+/g, ' ').trim() : '';
}

function extractBodyContent(html) {
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return m ? m[1].trim() : html;
}

function extractHeadContent(html) {
  const m = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  return m ? m[1].trim() : '';
}

function fixPriceRange(html) {
  let fixed = html;
  BAD_PRICE_RANGE.forEach(bad => {
    fixed = fixed.replaceAll(bad, '"priceRange": "$$"');
  });
  return fixed;
}

function buildPage(filename, originalHtml) {
  const title       = extractTitle(originalHtml);
  const headContent = extractHeadContent(originalHtml);
  const bodyContent = extractBodyContent(originalHtml);

  // Extract just the meta/schema/link tags from head
  // Remove: charset, viewport, Google Fonts, GA4 block, style blocks (all added fresh)
  // Keep: title, meta description, canonical, robots, og tags, twitter tags, ld+json scripts, search console verification
  
  // First remove multi-line blocks we don't want
  let cleanHead = headContent;
  
  // Remove style blocks entirely
  cleanHead = cleanHead.replace(/<style[\s\S]*?<\/style>/gi, '');
  
  // Remove GA4 async script + inline gtag script blocks
  cleanHead = cleanHead.replace(/<script\s+async\s+src="https:\/\/www\.googletagmanager[^"]*"[^>]*><\/script>/gi, '');
  cleanHead = cleanHead.replace(/<script>\s*window\.dataLayer[\s\S]*?<\/script>/gi, '');
  
  // Remove any remaining empty/comment-only script tags
  cleanHead = cleanHead.replace(/<script>\s*<\/script>/gi, '');
  
  // Remove HTML comments (like <!-- Google Analytics 4 --> etc.)
  cleanHead = cleanHead.replace(/<!--[\s\S]*?-->/g, '');
  
  // Remove Google Fonts link tags
  cleanHead = cleanHead.replace(/<link[^>]*fonts\.googleapis\.com[^>]*>/gi, '');
  cleanHead = cleanHead.replace(/<link[^>]*fonts\.gstatic\.com[^>]*>/gi, '');
  cleanHead = cleanHead.replace(/<link[^>]*preconnect[^>]*>/gi, '');
  
  // Remove charset and viewport (added fresh in template)
  cleanHead = cleanHead.replace(/<meta\s+charset=[^>]*>/gi, '');
  cleanHead = cleanHead.replace(/<meta\s+name="viewport"[^>]*>/gi, '');
  
  // Clean up excessive blank lines
  const headLines = cleanHead
    .split('\n')
    .filter(line => line.trim() !== '')
    .join('\n');

  // Build breadcrumb nav
  const breadcrumb = makeBreadcrumb(title);

  // Wrap original body content in page/container divs
  const wrappedContent = `
  <main class="gp-page">
    <div class="gp-container">
      ${bodyContent}
    </div>
  </main>`;

  // Assemble final page
  const page = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
${headLines}
${SHARED_STYLES}
${GA4_SNIPPET}
</head>
<body>

${HEADER_HTML}
${breadcrumb}
${wrappedContent}
${CTA_STRIP}
${FOOTER_HTML}

</body>
</html>`;

  return page;
}

// ── Main ─────────────────────────────────────────────────────
function run() {
  const files = getHtmlFiles(REPO_DIR);
  const results = { updated: [], skipped: [], errors: [] };

  console.log(`\n🐾 Golden Paws Subpage Transformer`);
  console.log(`   Repo:   ${REPO_DIR}`);
  console.log(`   Output: ${OUTPUT_DIR}`);
  console.log(`   Files found: ${files.length}\n`);

  for (const filename of files) {
    const filepath = path.join(REPO_DIR, filename);

    try {
      let html = fs.readFileSync(filepath, 'utf8');

      // Fix bad priceRange values first
      html = fixPriceRange(html);

      // Build the transformed page
      const updated = buildPage(filename, html);

      // Write output
      const outPath = path.join(OUTPUT_DIR, filename);
      fs.writeFileSync(outPath, updated, 'utf8');

      results.updated.push(filename);
      console.log(`  ✅  ${filename}`);

    } catch (err) {
      results.errors.push({ filename, error: err.message });
      console.error(`  ❌  ${filename} — ${err.message}`);
    }
  }

  // Summary
  console.log(`\n─────────────────────────────────`);
  console.log(`✅  Updated:  ${results.updated.length} files`);
  console.log(`⏭️   Skipped:  ${SKIP_FILES.size} files (${[...SKIP_FILES].join(', ')})`);
  if (results.errors.length > 0) {
    console.log(`❌  Errors:   ${results.errors.length} files`);
    results.errors.forEach(e => console.log(`    ${e.filename}: ${e.error}`));
  }
  console.log(`\nNext steps:`);
  console.log(`  1. Review a few updated files in your browser`);
  console.log(`  2. git add -A`);
  console.log(`  3. git commit -m "Add header, footer, GA4, breadcrumbs to all subpages"`);
  console.log(`  4. git push`);
  console.log(`  5. Verify live at goldenpawspetgrooming.com\n`);
}

run();
