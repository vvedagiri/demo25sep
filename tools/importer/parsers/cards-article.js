/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-29
 *
 * Source structure (.grid-layout.desktop-4-column):
 *   > a.article-card.card-link[href] (x4)
 *       > div.article-card-image > img.cover-image
 *       > div.article-card-body > div.article-card-meta (span.tag, span date), h3.h4-heading
 * Output: one row per card (model cards-article-card), 2 columns:
 *   [ field:image ] | [ field:text -> p tag, p date, h3 > a title ]
 * Iteration is keyed on the block-level .article-card-body wrappers (not the <a> wrappers,
 * which html2md preprocessing can merge); the card href is re-attached to the title.
 */
export default function parse(element, { document }) {
  let items = Array.from(element.querySelectorAll('.article-card-body')).map((body) => ({
    body,
    image: body.parentElement ? body.parentElement.querySelector('.article-card-image img, img') : null,
    href: body.closest('a') ? body.closest('a').getAttribute('href') : null,
  }));
  if (!items.length) {
    // Fallback: iterate the card anchors / direct children directly
    items = Array.from(element.querySelectorAll(':scope > a, :scope > div')).map((card) => ({
      body: card,
      image: card.querySelector('img'),
      href: card.tagName === 'A' ? card.getAttribute('href') : (card.querySelector('a') || {}).href,
    }));
  }

  const cells = [];
  items.forEach(({ body, image, href }) => {
    const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
    const tag = body.querySelector('.article-card-meta .tag, .tag');
    const metaSpans = Array.from(body.querySelectorAll('.article-card-meta span'))
      .filter((s) => s !== tag);

    // Image cell
    let imageCell = '';
    if (image) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(' field:image '));
      frag.appendChild(image);
      imageCell = frag;
    }

    // Text cell: tag, date, linked title
    const textFrag = document.createDocumentFragment();
    const parts = [];
    if (tag && tag.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = tag.textContent.trim();
      parts.push(p);
    }
    metaSpans.forEach((s) => {
      const t = s.textContent.trim();
      if (!t) return;
      const p = document.createElement('p');
      p.textContent = t;
      parts.push(p);
    });
    if (heading) {
      const h = document.createElement(heading.tagName.toLowerCase());
      const titleText = heading.textContent.trim();
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = titleText;
        h.append(a);
      } else {
        h.textContent = titleText;
      }
      parts.push(h);
    } else if (href) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = href;
      p.append(a);
      parts.push(p);
    }
    if (parts.length) {
      textFrag.appendChild(document.createComment(' field:text '));
      parts.forEach((el) => textFrag.appendChild(el));
    }

    if (!image && !parts.length) return;
    cells.push([imageCell, parts.length ? textFrag : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
