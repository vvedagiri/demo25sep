import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * FAQ accordion: each row is [question] | [answer].
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [labelCell, bodyCell] = row.children;
    if (!labelCell) return;

    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    summary.append(...labelCell.childNodes);
    if (!summary.textContent.trim()) return;
    // <summary> only allows phrasing content: unwrap the authored/imported question <p>
    summary.querySelectorAll(':scope > p').forEach((p) => {
      const span = document.createElement('span');
      span.className = 'accordion-faq-item-question';
      moveInstrumentation(p, span);
      span.append(...p.childNodes);
      p.replaceWith(span);
    });

    const body = document.createElement('div');
    body.className = 'accordion-faq-item-body';
    if (bodyCell) body.append(...bodyCell.childNodes);

    const details = document.createElement('details');
    details.className = 'accordion-faq-item';
    moveInstrumentation(row, details);
    details.append(summary, body);
    row.replaceWith(details);
  });

  // remove rows that had no question
  [...block.children].forEach((child) => {
    if (child.tagName !== 'DETAILS') child.remove();
  });
}
