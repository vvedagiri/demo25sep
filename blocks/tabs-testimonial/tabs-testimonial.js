import { moveInstrumentation } from '../../scripts/scripts.js';

let instanceCount = 0;

/**
 * Split a cell's children into picture-holding elements and everything else.
 * @param {Element} cell
 * @returns {{ media: Element[], text: Element[] }}
 */
function splitCell(cell) {
  const media = [];
  const text = [];
  [...cell.children].forEach((el) => {
    if (el.querySelector('picture') && !el.textContent.trim()) media.push(el);
    else if (el.tagName === 'PICTURE') media.push(el);
    else text.push(el);
  });
  // bare text nodes (unwrapped cell content) become a paragraph
  if (!cell.children.length && cell.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = cell.textContent.trim();
    text.push(p);
  }
  return { media, text };
}

/**
 * Buttons only allow phrasing content: swap block-level wrappers (<p>, <div>) for spans,
 * keeping their children and any UE instrumentation.
 * @param {Element} el
 * @returns {Element}
 */
function toPhrasing(el) {
  if (!['P', 'DIV'].includes(el.tagName)) return el;
  const span = document.createElement('span');
  if (el.className) span.className = el.className;
  moveInstrumentation(el, span);
  span.append(...el.childNodes);
  return span;
}

function wrap(className, children, tag = 'div') {
  const div = document.createElement(tag);
  div.className = className;
  div.append(...children);
  return div;
}

/**
 * Testimonial tabs: image + quote panel above a row of avatar tab buttons.
 * Each row: [tab label: avatar, name, role] | [panel: image, name, role, quote]
 * @param {Element} block The block element
 */
export default function decorate(block) {
  instanceCount += 1;
  const idPrefix = `tabs-testimonial-${instanceCount}`;

  const panels = document.createElement('div');
  panels.className = 'tabs-testimonial-panels';
  const tablist = document.createElement('div');
  tablist.className = 'tabs-testimonial-list';
  tablist.setAttribute('role', 'tablist');

  const tabs = [];
  const panelEls = [];

  const activate = (index, focus = false) => {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute('aria-selected', selected);
      tab.tabIndex = selected ? 0 : -1;
      tab.classList.toggle('is-active', selected);
      panelEls[i].hidden = !selected;
      panelEls[i].classList.toggle('is-active', selected);
    });
    if (focus) tabs[index].focus();
  };

  [...block.children].forEach((row) => {
    const [labelCell, contentCell] = row.children;
    if (!labelCell) return;
    const i = tabs.length;

    // panel
    const panel = document.createElement('div');
    panel.className = 'tabs-testimonial-panel';
    panel.id = `${idPrefix}-panel-${i}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `${idPrefix}-tab-${i}`);
    moveInstrumentation(row, panel);
    if (contentCell) {
      const { media, text } = splitCell(contentCell);
      if (media.length) panel.append(wrap('tabs-testimonial-media', media));
      if (text.length) panel.append(wrap('tabs-testimonial-text', text));
    }

    // tab button
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tabs-testimonial-tab';
    tab.id = `${idPrefix}-tab-${i}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    const { media: avatar, text: label } = splitCell(labelCell);
    const avatarAlt = avatar.map((el) => el.querySelector('img')?.alt).find(Boolean) || '';
    if (avatar.length) {
      // the name is already in the label text, so the avatar is decorative here
      avatar.forEach((el) => el.querySelectorAll('img').forEach((img) => { img.alt = ''; }));
      const avatarWrap = wrap('tabs-testimonial-avatar', avatar.map(toPhrasing), 'span');
      avatarWrap.setAttribute('aria-hidden', 'true');
      tab.append(avatarWrap);
    }
    if (label.length) tab.append(wrap('tabs-testimonial-label', label.map(toPhrasing), 'span'));
    if (!tab.textContent.trim()) tab.setAttribute('aria-label', avatarAlt || `Tab ${i + 1}`);
    tab.addEventListener('click', () => activate(i));

    tabs.push(tab);
    panelEls.push(panel);
    panels.append(panel);
    tablist.append(tab);
  });

  tablist.addEventListener('keydown', (e) => {
    const current = tabs.indexOf(document.activeElement);
    if (current < 0) return;
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (current + 1) % tabs.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (current - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next !== null) {
      e.preventDefault();
      activate(next, true);
    }
  });

  block.replaceChildren(panels, tablist);
  if (tabs.length) activate(0);
}
