/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-29
 *
 * Source structure (.utility-position-relative):
 *   > img.cover-image (background)
 *   > div.overlay (decorative, empty)
 *   > div.card-body > h2.h1-heading, p.subheading, .button-group > a.button
 * Output (model hero-banner, 1 column):
 *   row 1: [ field:image -> background img ]  (row kept even when empty, xwalk)
 *   row 2: [ field:text  -> heading, subheading, CTA(s) ]
 */
export default function parse(element, { document }) {
  const bgImage = element.querySelector(':scope > img')
    || element.querySelector('img.cover-image, img.utility-overlay')
    || element.querySelector('img');

  const body = element.querySelector('.card-body') || element;
  const heading = body.querySelector('h1, h2, h3');
  const paragraphs = Array.from(body.querySelectorAll('p'));
  const ctas = Array.from(body.querySelectorAll('.button-group a, a.button'))
    .filter((a, i, arr) => arr.indexOf(a) === i);

  if (!heading && !paragraphs.length && !ctas.length && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 1: background image
  if (bgImage) {
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    imgFrag.appendChild(bgImage);
    cells.push([imgFrag]);
  } else {
    cells.push(['']);
  }

  // Row 2: text content
  const textFrag = document.createDocumentFragment();
  if (heading || paragraphs.length || ctas.length) {
    textFrag.appendChild(document.createComment(' field:text '));
    if (heading) textFrag.appendChild(heading);
    paragraphs.forEach((p) => textFrag.appendChild(p));
    // EDS buttonizes links wrapped in <strong> (primary) or <em> (secondary)
    ctas.forEach((a) => {
      const p = document.createElement('p');
      const wrap = document.createElement(a.classList.contains('secondary-button') ? 'em' : 'strong');
      wrap.appendChild(a);
      p.appendChild(wrap);
      textFrag.appendChild(p);
    });
    cells.push([textFrag]);
  } else {
    cells.push(['']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
