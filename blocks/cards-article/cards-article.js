import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Group the elements preceding the title heading (tag, date) into a meta row.
 * @param {Element} body The card body cell
 */
function decorateBody(body) {
  const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
  if (!heading) return;
  heading.classList.add('cards-article-title');

  const before = [];
  let el = body.firstElementChild;
  while (el && el !== heading && !el.contains(heading)) {
    before.push(el);
    el = el.nextElementSibling;
  }
  if (before.length) {
    const meta = document.createElement('div');
    meta.className = 'cards-article-meta';
    before[0].classList.add('cards-article-tag');
    before.slice(1).forEach((m) => m.classList.add('cards-article-date'));
    meta.append(...before);
    body.prepend(meta);
  }

  // Make the whole card clickable via the title link (stretched link).
  const link = heading.querySelector('a') || body.querySelector('a');
  if (link) {
    link.classList.add('cards-article-link');
    link.classList.remove('button');
    link.closest('.button-container')?.classList.remove('button-container');
  }
}

/**
 * Article cards: each row is [image] | [tag, date, linked title].
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-article-card';
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture') && !div.textContent.trim()) {
        div.className = 'cards-article-card-image';
      } else {
        div.className = 'cards-article-card-body';
        decorateBody(div);
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.replaceChildren(ul);
}
