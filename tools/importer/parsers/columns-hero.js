/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-hero. Base: columns.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-29
 *
 * Source structure (.grid-layout):
 *   > div            -> h1.h1-heading, p.subheading, .button-group > a.button (x2)
 *   > div.grid-layout -> img.cover-image (x3)
 * Output: 1 row, 2 columns [text column, image collage column].
 * Columns blocks: no field hints (xwalk hinting rule exception).
 */
export default function parse(element, { document }) {
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Text column: the child containing a heading; fallback to first child
  const textCol = columns.find((c) => c.querySelector('h1, h2, h3')) || columns[0];
  // Image column: the child with images and no heading; fallback to second child
  const imageCol = columns.find((c) => c !== textCol && c.querySelector('img'))
    || columns.find((c) => c !== textCol);

  const textCell = [];
  if (textCol) {
    const heading = textCol.querySelector('h1, h2, h3');
    if (heading) textCell.push(heading);
    const paragraphs = Array.from(textCol.querySelectorAll('p'));
    textCell.push(...paragraphs);
    const ctas = Array.from(textCol.querySelectorAll('.button-group a, a.button'))
      .filter((a, i, arr) => arr.indexOf(a) === i);
    // EDS buttonizes links wrapped in <strong> (primary) or <em> (secondary)
    ctas.forEach((a) => {
      const p = document.createElement('p');
      const wrap = document.createElement(a.classList.contains('secondary-button') ? 'em' : 'strong');
      wrap.appendChild(a);
      p.appendChild(wrap);
      textCell.push(p);
    });
  }

  const imageCell = imageCol ? Array.from(imageCol.querySelectorAll('img')) : [];

  if (!textCell.length && !imageCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[textCell, imageCell.length ? imageCell : '']];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-hero', cells });
  element.replaceWith(block);
}
