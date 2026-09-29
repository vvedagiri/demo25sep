/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article. Base: columns.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-29
 *
 * Source structure (.grid-layout):
 *   > div  -> img.cover-image
 *   > div  -> .breadcrumbs (a, svg-img, a), h2.h2-heading,
 *             div > div.flex-horizontal (span By, span Author), div.flex-horizontal (date • read time)
 * Output: 1 row, 2 columns [image column, text column].
 * Text column: breadcrumb <p> (links) before heading, byline <p>s after heading
 * (matches decorate(): P with links before heading = breadcrumb, P after heading = byline).
 * Columns blocks: no field hints (xwalk hinting rule exception).
 */
export default function parse(element, { document }) {
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  const textCol = columns.find((c) => c.querySelector('h1, h2, h3, h4')) || columns[1];
  const imageCol = columns.find((c) => c !== textCol && c.querySelector('img')) || columns[0];

  // Image column
  const imageCell = [];
  if (imageCol) {
    const img = imageCol.querySelector('img.cover-image') || imageCol.querySelector('img');
    if (img) imageCell.push(img);
  }

  // Text column
  const textCell = [];
  if (textCol) {
    const heading = textCol.querySelector('h1, h2, h3, h4');

    // Breadcrumbs: links only (decorative separator svg images are dropped)
    const crumbs = textCol.querySelector('.breadcrumbs, nav[aria-label*="breadcrumb" i]');
    if (crumbs) {
      const links = Array.from(crumbs.querySelectorAll('a'));
      if (links.length) {
        const p = document.createElement('p');
        links.forEach((a, i) => {
          if (i > 0) p.append(' / ');
          p.append(a);
        });
        textCell.push(p);
      }
    }

    if (heading) textCell.push(heading);

    // Byline rows: each .flex-horizontal group becomes one paragraph of its spans' text
    const metaRows = Array.from(textCol.querySelectorAll('.flex-horizontal'))
      .filter((row) => !crumbs || !crumbs.contains(row));
    metaRows.forEach((row) => {
      const parts = Array.from(row.querySelectorAll('span'))
        .map((s) => s.textContent.trim())
        .filter(Boolean);
      const text = parts.length ? parts.join(' ') : row.textContent.replace(/\s+/g, ' ').trim();
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        textCell.push(p);
      }
    });

    // Fallback: plain paragraphs after the heading when no flex rows exist
    if (!metaRows.length) {
      textCell.push(...Array.from(textCol.querySelectorAll('p')));
    }
  }

  if (!imageCell.length && !textCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[imageCell.length ? imageCell : '', textCell.length ? textCell : '']];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
