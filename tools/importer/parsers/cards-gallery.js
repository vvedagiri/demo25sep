/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-29
 *
 * Source structure (.grid-layout.desktop-4-column):
 *   > div.utility-aspect-1x1 (x8) -> img.cover-image
 * Output: one row per gallery item, 1 column (model cards-gallery-item: image [+ imageAlt collapsed]).
 */
export default function parse(element, { document }) {
  // Iterate the block-level item wrappers; fallback to any direct child div holding an image
  let items = Array.from(element.querySelectorAll(':scope > .utility-aspect-1x1'));
  if (!items.length) {
    items = Array.from(element.querySelectorAll(':scope > div')).filter((d) => d.querySelector('img'));
  }

  const cells = [];
  items.forEach((item) => {
    const img = item.querySelector('img.cover-image') || item.querySelector('img');
    if (!img) return;
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:image '));
    frag.appendChild(img);
    cells.push([frag]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
