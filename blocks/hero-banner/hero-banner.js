/**
 * Banner hero: background image row with a text row (heading, paragraph, CTA) layered on top.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  let hasMedia = false;

  rows.forEach((row) => {
    const pic = row.querySelector('picture');
    const hasText = row.textContent.trim().length > 0;
    if (pic && !hasText && !hasMedia) {
      row.classList.add('hero-banner-media');
      hasMedia = true;
    } else if (hasText) {
      row.classList.add('hero-banner-content');
    } else if (!pic) {
      row.remove();
    }
  });

  if (!hasMedia) block.classList.add('hero-banner-no-media');
}
