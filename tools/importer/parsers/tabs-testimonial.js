/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-29
 *
 * Source structure (.tabs-wrapper):
 *   .tabs-content > .tab-pane#tabpanel-N (x4) -> .grid-layout > div > img.cover-image
 *                                                              > div > div > (div > strong name), (div role); p quote
 *   .tab-menu > button.tab-menu-link#tab-N (x4) -> .avatar img, (div > strong name), (div role)
 * Output: one row per tab (model tabs-testimonial-item), 2 columns:
 *   [ field:tab_avatar + field:tab_text ] | [ field:content_image + field:content_text ]
 * Iteration keyed on block-level .tab-pane wrappers; buttons paired by index.
 */
function textParagraph(document, text, strong) {
  const p = document.createElement('p');
  if (strong) {
    const s = document.createElement('strong');
    s.textContent = text;
    p.append(s);
  } else {
    p.textContent = text;
  }
  return p;
}

// Extract [name, role] from a container with a <strong> name and a sibling role div
function nameAndRole(container) {
  if (!container) return { name: '', role: '' };
  const strong = container.querySelector('strong');
  const name = strong ? strong.textContent.trim() : '';
  let role = '';
  const nameHolder = strong ? strong.closest('div') : null;
  const candidates = Array.from(container.querySelectorAll('div'))
    .filter((d) => d !== nameHolder && !d.querySelector('div, img, strong') && d.textContent.trim());
  if (candidates.length) role = candidates[0].textContent.trim();
  return { name, role };
}

export default function parse(element, { document }) {
  let panes = Array.from(element.querySelectorAll('.tabs-content > .tab-pane'));
  if (!panes.length) panes = Array.from(element.querySelectorAll('.tab-pane, [role="tabpanel"]'));
  const tabButtons = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, [role="tab"]'))
    .filter((b, i, arr) => arr.indexOf(b) === i);

  const cells = [];
  panes.forEach((pane, i) => {
    // Pair the tab button by id suffix, fallback to index
    const idx = (pane.id || '').match(/(\d+)$/);
    const btn = (idx && tabButtons.find((b) => (b.id || '').endsWith(`-${idx[1]}`))) || tabButtons[i];

    // --- Tab label cell ---
    const labelFrag = document.createDocumentFragment();
    if (btn) {
      const avatar = btn.querySelector('.avatar img') || btn.querySelector('img');
      const { name, role } = nameAndRole(btn);
      if (avatar) {
        // Source avatars are decorative (alt=""); use the person's name for accessibility
        if (!avatar.getAttribute('alt') && name) avatar.setAttribute('alt', name);
        labelFrag.appendChild(document.createComment(' field:tab_avatar '));
        labelFrag.appendChild(avatar);
      }
      if (name || role) {
        labelFrag.appendChild(document.createComment(' field:tab_text '));
        if (name) labelFrag.appendChild(textParagraph(document, name, true));
        if (role) labelFrag.appendChild(textParagraph(document, role));
      }
    }

    // --- Panel content cell ---
    const contentFrag = document.createDocumentFragment();
    const panelImg = pane.querySelector('img.cover-image') || pane.querySelector('img');
    if (panelImg) {
      contentFrag.appendChild(document.createComment(' field:content_image '));
      contentFrag.appendChild(panelImg);
    }
    const quote = pane.querySelector('p');
    const textCol = quote ? quote.parentElement : pane;
    const { name, role } = nameAndRole(textCol);
    if (name || role || quote) {
      contentFrag.appendChild(document.createComment(' field:content_text '));
      if (name) contentFrag.appendChild(textParagraph(document, name, true));
      if (role) contentFrag.appendChild(textParagraph(document, role));
      if (quote) contentFrag.appendChild(quote);
    }

    if (!labelFrag.childNodes.length && !contentFrag.childNodes.length) return;
    cells.push([
      labelFrag.childNodes.length ? labelFrag : '',
      contentFrag.childNodes.length ? contentFrag : '',
    ]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
