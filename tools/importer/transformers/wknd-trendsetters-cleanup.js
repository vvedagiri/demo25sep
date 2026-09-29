/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters site-wide cleanup.
 * All selectors verified in migration-work/cleaned.html:
 *   <a href="#main-content" class="skip-link">          (body, before navbar)
 *   <div class="navbar">                                 (global header / nav + mega menu)
 *   <footer class="footer inverse-footer">               (global footer)
 * NOTE: do NOT remove bare `header` - the hero section is `main > header.section.secondary-section`.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Skip link sits outside <main>; remove early so it never leaks into content.
    WebImporter.DOMUtils.remove(element, ['a.skip-link']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Global chrome (non-authorable): header nav and footer.
    WebImporter.DOMUtils.remove(element, [
      'div.navbar',
      'footer.footer.inverse-footer',
      'a.skip-link',
    ]);

    // Astro framework scoping attributes (e.g. data-astro-cid-37fxchfa on <body>).
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes]
        .filter((attr) => attr.name.startsWith('data-astro-cid-'))
        .forEach((attr) => el.removeAttribute(attr.name));
    });
  }
}
