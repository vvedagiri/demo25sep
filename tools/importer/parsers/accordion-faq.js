/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-29
 *
 * Source structure (.faq-list):
 *   > details.faq-item (x4)
 *       > summary.faq-question > span (question text), img (decorative svg icon, dropped)
 *       > div.faq-answer > p
 * Output: one row per item (model accordion-faq-item), 2 columns:
 *   [ field:summary -> question text ] | [ field:text -> answer content ]
 */
export default function parse(element, { document }) {
  let items = Array.from(element.querySelectorAll(':scope > details, :scope > .faq-item'))
    .filter((el, i, arr) => arr.indexOf(el) === i);
  if (!items.length) items = Array.from(element.querySelectorAll('details'));

  const cells = [];
  items.forEach((item) => {
    const summary = item.querySelector('summary, .faq-question');
    const answer = item.querySelector('.faq-answer')
      || Array.from(item.children).find((c) => c !== summary);

    // Question: text only (drop decorative icon images)
    const questionText = summary
      ? ((summary.querySelector('span, h2, h3, h4, p') || summary).textContent || '').replace(/\s+/g, ' ').trim()
      : '';

    let questionCell = '';
    if (questionText) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(' field:summary '));
      frag.appendChild(document.createTextNode(questionText));
      questionCell = frag;
    }

    let answerCell = '';
    if (answer && answer.textContent.trim()) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(' field:text '));
      const blocks = Array.from(answer.children);
      if (blocks.length) {
        blocks.forEach((b) => frag.appendChild(b));
      } else {
        const p = document.createElement('p');
        p.textContent = answer.textContent.trim();
        frag.appendChild(p);
      }
      answerCell = frag;
    }

    if (!questionCell && !answerCell) return;
    cells.push([questionCell, answerCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
