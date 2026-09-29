/**
 * Article header: a feature image beside breadcrumb, title and byline.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const cols = rows[0] ? [...rows[0].children] : [];
  block.classList.add(`columns-article-${cols.length}-cols`);

  rows.forEach((row) => {
    row.classList.add('columns-article-row');
    [...row.children].forEach((col) => {
      const hasPic = !!col.querySelector('picture');
      const hasText = col.textContent.trim().length > 0;
      if (hasPic && !hasText) {
        col.classList.add('columns-article-img-col');
        return;
      }
      col.classList.add('columns-article-text-col');

      // Paragraphs before the heading are breadcrumbs; paragraphs after it are the byline.
      const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
      if (!heading) return;
      let seenHeading = false;
      [...col.children].forEach((el) => {
        if (el === heading) {
          seenHeading = true;
          return;
        }
        if (el.tagName !== 'P') return;
        if (!seenHeading && el.querySelector('a')) el.classList.add('columns-article-breadcrumb');
        else if (seenHeading) el.classList.add('columns-article-byline');
      });

      // Mark a leading "By" in the author line as a label so it can be styled as secondary text.
      const author = col.querySelector('.columns-article-byline');
      const first = author?.firstChild;
      const match = first?.nodeType === Node.TEXT_NODE && first.textContent.match(/^(\s*by)(\s+)/i);
      if (match) {
        const label = document.createElement('span');
        label.className = 'columns-article-byline-label';
        label.textContent = match[1].trim();
        first.textContent = ` ${first.textContent.slice(match[0].length)}`;
        author.insertBefore(label, first);
        author.classList.add('columns-article-byline-author');
      }
    });
  });
}
