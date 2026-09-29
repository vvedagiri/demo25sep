/**
 * True when a paragraph holds only a single link (an authored CTA).
 * @param {Element} el
 */
function isLinkOnly(el) {
  if (el.tagName !== 'P') return false;
  const links = el.querySelectorAll('a');
  return links.length === 1 && el.textContent.trim() === links[0].textContent.trim();
}

/**
 * Group consecutive CTA paragraphs into one actions row (source: button group).
 * @param {Element} col The text column
 */
function groupCtas(col) {
  let group = null;
  [...col.children].forEach((el) => {
    if (!isLinkOnly(el)) {
      group = null;
      return;
    }
    if (!group) {
      group = document.createElement('div');
      group.className = 'columns-hero-actions';
      el.before(group);
    }
    el.classList.add('columns-hero-cta');
    group.append(el);
  });
  col.querySelectorAll('.columns-hero-actions').forEach((g) => {
    [...g.children].forEach((cta, i) => {
      cta.classList.add(i === 0 ? 'columns-hero-cta-primary' : 'columns-hero-cta-secondary');
    });
  });
}

/**
 * Lift every picture to be a direct child of the collage so each one is a grid item
 * (imported markup wraps all collage pictures in a single <p>).
 * @param {Element} col The image column
 */
function flattenCollage(col) {
  const pics = [...col.querySelectorAll('picture')];
  const wrappers = new Set(pics.map((pic) => pic.parentElement).filter((p) => p !== col));
  pics.forEach((pic) => col.append(pic));
  wrappers.forEach((w) => {
    if (!w.children.length && !w.textContent.trim()) w.remove();
  });
}

/**
 * Split hero: a text column (heading, subheading, CTAs) beside an image collage column.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const cols = rows[0] ? [...rows[0].children] : [];
  block.classList.add(`columns-hero-${cols.length}-cols`);

  rows.forEach((row) => {
    row.classList.add('columns-hero-row');
    [...row.children].forEach((col) => {
      const pics = col.querySelectorAll('picture');
      const hasText = col.textContent.trim().length > 0;
      if (pics.length && !hasText) {
        col.classList.add('columns-hero-img-col');
        if (pics.length > 1) {
          col.classList.add('columns-hero-collage');
          flattenCollage(col);
        }
      } else {
        col.classList.add('columns-hero-text-col');
        groupCtas(col);
      }
    });
  });
}
