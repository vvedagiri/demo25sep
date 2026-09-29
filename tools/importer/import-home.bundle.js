/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/columns-hero.js
  function parse(element, { document: document2 }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    const textCol = columns.find((c) => c.querySelector("h1, h2, h3")) || columns[0];
    const imageCol = columns.find((c) => c !== textCol && c.querySelector("img")) || columns.find((c) => c !== textCol);
    const textCell = [];
    if (textCol) {
      const heading = textCol.querySelector("h1, h2, h3");
      if (heading) textCell.push(heading);
      const paragraphs = Array.from(textCol.querySelectorAll("p"));
      textCell.push(...paragraphs);
      const ctas = Array.from(textCol.querySelectorAll(".button-group a, a.button")).filter((a, i, arr) => arr.indexOf(a) === i);
      ctas.forEach((a) => {
        const p = document2.createElement("p");
        const wrap = document2.createElement(a.classList.contains("secondary-button") ? "em" : "strong");
        wrap.appendChild(a);
        p.appendChild(wrap);
        textCell.push(p);
      });
    }
    const imageCell = imageCol ? Array.from(imageCol.querySelectorAll("img")) : [];
    if (!textCell.length && !imageCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[textCell, imageCell.length ? imageCell : ""]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document: document2 }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    const textCol = columns.find((c) => c.querySelector("h1, h2, h3, h4")) || columns[1];
    const imageCol = columns.find((c) => c !== textCol && c.querySelector("img")) || columns[0];
    const imageCell = [];
    if (imageCol) {
      const img = imageCol.querySelector("img.cover-image") || imageCol.querySelector("img");
      if (img) imageCell.push(img);
    }
    const textCell = [];
    if (textCol) {
      const heading = textCol.querySelector("h1, h2, h3, h4");
      const crumbs = textCol.querySelector('.breadcrumbs, nav[aria-label*="breadcrumb" i]');
      if (crumbs) {
        const links = Array.from(crumbs.querySelectorAll("a"));
        if (links.length) {
          const p = document2.createElement("p");
          links.forEach((a, i) => {
            if (i > 0) p.append(" / ");
            p.append(a);
          });
          textCell.push(p);
        }
      }
      if (heading) textCell.push(heading);
      const metaRows = Array.from(textCol.querySelectorAll(".flex-horizontal")).filter((row) => !crumbs || !crumbs.contains(row));
      metaRows.forEach((row) => {
        const parts = Array.from(row.querySelectorAll("span")).map((s) => s.textContent.trim()).filter(Boolean);
        const text = parts.length ? parts.join(" ") : row.textContent.replace(/\s+/g, " ").trim();
        if (text) {
          const p = document2.createElement("p");
          p.textContent = text;
          textCell.push(p);
        }
      });
      if (!metaRows.length) {
        textCell.push(...Array.from(textCol.querySelectorAll("p")));
      }
    }
    if (!imageCell.length && !textCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[imageCell.length ? imageCell : "", textCell.length ? textCell : ""]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document: document2 }) {
    let items = Array.from(element.querySelectorAll(":scope > .utility-aspect-1x1"));
    if (!items.length) {
      items = Array.from(element.querySelectorAll(":scope > div")).filter((d) => d.querySelector("img"));
    }
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector("img.cover-image") || item.querySelector("img");
      if (!img) return;
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(" field:image "));
      frag.appendChild(img);
      cells.push([frag]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function textParagraph(document2, text, strong) {
    const p = document2.createElement("p");
    if (strong) {
      const s = document2.createElement("strong");
      s.textContent = text;
      p.append(s);
    } else {
      p.textContent = text;
    }
    return p;
  }
  function nameAndRole(container) {
    if (!container) return { name: "", role: "" };
    const strong = container.querySelector("strong");
    const name = strong ? strong.textContent.trim() : "";
    let role = "";
    const nameHolder = strong ? strong.closest("div") : null;
    const candidates = Array.from(container.querySelectorAll("div")).filter((d) => d !== nameHolder && !d.querySelector("div, img, strong") && d.textContent.trim());
    if (candidates.length) role = candidates[0].textContent.trim();
    return { name, role };
  }
  function parse4(element, { document: document2 }) {
    let panes = Array.from(element.querySelectorAll(".tabs-content > .tab-pane"));
    if (!panes.length) panes = Array.from(element.querySelectorAll('.tab-pane, [role="tabpanel"]'));
    const tabButtons = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, [role="tab"]')).filter((b, i, arr) => arr.indexOf(b) === i);
    const cells = [];
    panes.forEach((pane, i) => {
      const idx = (pane.id || "").match(/(\d+)$/);
      const btn = idx && tabButtons.find((b) => (b.id || "").endsWith(`-${idx[1]}`)) || tabButtons[i];
      const labelFrag = document2.createDocumentFragment();
      if (btn) {
        const avatar = btn.querySelector(".avatar img") || btn.querySelector("img");
        const { name: name2, role: role2 } = nameAndRole(btn);
        if (avatar) {
          if (!avatar.getAttribute("alt") && name2) avatar.setAttribute("alt", name2);
          labelFrag.appendChild(document2.createComment(" field:tab_avatar "));
          labelFrag.appendChild(avatar);
        }
        if (name2 || role2) {
          labelFrag.appendChild(document2.createComment(" field:tab_text "));
          if (name2) labelFrag.appendChild(textParagraph(document2, name2, true));
          if (role2) labelFrag.appendChild(textParagraph(document2, role2));
        }
      }
      const contentFrag = document2.createDocumentFragment();
      const panelImg = pane.querySelector("img.cover-image") || pane.querySelector("img");
      if (panelImg) {
        contentFrag.appendChild(document2.createComment(" field:content_image "));
        contentFrag.appendChild(panelImg);
      }
      const quote = pane.querySelector("p");
      const textCol = quote ? quote.parentElement : pane;
      const { name, role } = nameAndRole(textCol);
      if (name || role || quote) {
        contentFrag.appendChild(document2.createComment(" field:content_text "));
        if (name) contentFrag.appendChild(textParagraph(document2, name, true));
        if (role) contentFrag.appendChild(textParagraph(document2, role));
        if (quote) contentFrag.appendChild(quote);
      }
      if (!labelFrag.childNodes.length && !contentFrag.childNodes.length) return;
      cells.push([
        labelFrag.childNodes.length ? labelFrag : "",
        contentFrag.childNodes.length ? contentFrag : ""
      ]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document: document2 }) {
    let items = Array.from(element.querySelectorAll(".article-card-body")).map((body) => ({
      body,
      image: body.parentElement ? body.parentElement.querySelector(".article-card-image img, img") : null,
      href: body.closest("a") ? body.closest("a").getAttribute("href") : null
    }));
    if (!items.length) {
      items = Array.from(element.querySelectorAll(":scope > a, :scope > div")).map((card) => ({
        body: card,
        image: card.querySelector("img"),
        href: card.tagName === "A" ? card.getAttribute("href") : (card.querySelector("a") || {}).href
      }));
    }
    const cells = [];
    items.forEach(({ body, image, href }) => {
      const heading = body.querySelector("h1, h2, h3, h4, h5, h6");
      const tag = body.querySelector(".article-card-meta .tag, .tag");
      const metaSpans = Array.from(body.querySelectorAll(".article-card-meta span")).filter((s) => s !== tag);
      let imageCell = "";
      if (image) {
        const frag = document2.createDocumentFragment();
        frag.appendChild(document2.createComment(" field:image "));
        frag.appendChild(image);
        imageCell = frag;
      }
      const textFrag = document2.createDocumentFragment();
      const parts = [];
      if (tag && tag.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = tag.textContent.trim();
        parts.push(p);
      }
      metaSpans.forEach((s) => {
        const t = s.textContent.trim();
        if (!t) return;
        const p = document2.createElement("p");
        p.textContent = t;
        parts.push(p);
      });
      if (heading) {
        const h = document2.createElement(heading.tagName.toLowerCase());
        const titleText = heading.textContent.trim();
        if (href) {
          const a = document2.createElement("a");
          a.setAttribute("href", href);
          a.textContent = titleText;
          h.append(a);
        } else {
          h.textContent = titleText;
        }
        parts.push(h);
      } else if (href) {
        const p = document2.createElement("p");
        const a = document2.createElement("a");
        a.setAttribute("href", href);
        a.textContent = href;
        p.append(a);
        parts.push(p);
      }
      if (parts.length) {
        textFrag.appendChild(document2.createComment(" field:text "));
        parts.forEach((el) => textFrag.appendChild(el));
      }
      if (!image && !parts.length) return;
      cells.push([imageCell, parts.length ? textFrag : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document: document2 }) {
    let items = Array.from(element.querySelectorAll(":scope > details, :scope > .faq-item")).filter((el, i, arr) => arr.indexOf(el) === i);
    if (!items.length) items = Array.from(element.querySelectorAll("details"));
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary, .faq-question");
      const answer = item.querySelector(".faq-answer") || Array.from(item.children).find((c) => c !== summary);
      const questionText = summary ? ((summary.querySelector("span, h2, h3, h4, p") || summary).textContent || "").replace(/\s+/g, " ").trim() : "";
      let questionCell = "";
      if (questionText) {
        const frag = document2.createDocumentFragment();
        frag.appendChild(document2.createComment(" field:summary "));
        frag.appendChild(document2.createTextNode(questionText));
        questionCell = frag;
      }
      let answerCell = "";
      if (answer && answer.textContent.trim()) {
        const frag = document2.createDocumentFragment();
        frag.appendChild(document2.createComment(" field:text "));
        const blocks = Array.from(answer.children);
        if (blocks.length) {
          blocks.forEach((b) => frag.appendChild(b));
        } else {
          const p = document2.createElement("p");
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
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse7(element, { document: document2 }) {
    const bgImage = element.querySelector(":scope > img") || element.querySelector("img.cover-image, img.utility-overlay") || element.querySelector("img");
    const body = element.querySelector(".card-body") || element;
    const heading = body.querySelector("h1, h2, h3");
    const paragraphs = Array.from(body.querySelectorAll("p"));
    const ctas = Array.from(body.querySelectorAll(".button-group a, a.button")).filter((a, i, arr) => arr.indexOf(a) === i);
    if (!heading && !paragraphs.length && !ctas.length && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) {
      const imgFrag = document2.createDocumentFragment();
      imgFrag.appendChild(document2.createComment(" field:image "));
      imgFrag.appendChild(bgImage);
      cells.push([imgFrag]);
    } else {
      cells.push([""]);
    }
    const textFrag = document2.createDocumentFragment();
    if (heading || paragraphs.length || ctas.length) {
      textFrag.appendChild(document2.createComment(" field:text "));
      if (heading) textFrag.appendChild(heading);
      paragraphs.forEach((p) => textFrag.appendChild(p));
      ctas.forEach((a) => {
        const p = document2.createElement("p");
        const wrap = document2.createElement(a.classList.contains("secondary-button") ? "em" : "strong");
        wrap.appendChild(a);
        p.appendChild(wrap);
        textFrag.appendChild(p);
      });
      cells.push([textFrag]);
    } else {
      cells.push([""]);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, ["a.skip-link"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "div.navbar",
        "footer.footer.inverse-footer",
        "a.skip-link"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].filter((attr) => attr.name.startsWith("data-astro-cid-")).forEach((attr) => el.removeAttribute(attr.name));
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    const list = Array.isArray(selectors) ? selectors : [selectors];
    for (const sel of list) {
      if (!sel) continue;
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload && payload.template && payload.template.sections || [];
    if (sections.length < 2) return;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-home.js
  var parsers = {
    "columns-hero": parse,
    "columns-article": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-banner": parse7
  };
  var PAGE_TEMPLATE = {
    "name": "home",
    "description": "WKND Trendsetters home page: hero, featured article, gallery, testimonials, latest articles, FAQ and CTA banner",
    "urls": [
      "https://www.wknd-trendsetters.site/"
    ],
    "blocks": [
      {
        "name": "columns-hero",
        "instances": [
          "main > header.section.secondary-section > .container > .grid-layout"
        ]
      },
      {
        "name": "columns-article",
        "instances": [
          "main > section.section:nth-of-type(1) > .container > .grid-layout"
        ]
      },
      {
        "name": "cards-gallery",
        "instances": [
          "main > section.section.secondary-section:nth-of-type(2) > .container > .grid-layout"
        ]
      },
      {
        "name": "tabs-testimonial",
        "instances": [
          "main .tabs-wrapper"
        ]
      },
      {
        "name": "cards-article",
        "instances": [
          "main > section.section.secondary-section:nth-of-type(4) > .container > .grid-layout"
        ]
      },
      {
        "name": "accordion-faq",
        "instances": [
          "main .faq-list"
        ]
      },
      {
        "name": "hero-banner",
        "instances": [
          "main > section.inverse-section .container > .grid-layout > .utility-position-relative"
        ]
      }
    ],
    "sections": [
      {
        "id": "1",
        "name": "hero",
        "selector": [
          "main > header.section.secondary-section"
        ],
        "style": "grey",
        "blocks": [
          "columns-hero"
        ],
        "defaultContent": []
      },
      {
        "id": "2",
        "name": "featured-article",
        "selector": [
          "main > section.section:nth-of-type(1)"
        ],
        "style": null,
        "blocks": [
          "columns-article"
        ],
        "defaultContent": []
      },
      {
        "id": "3",
        "name": "gallery",
        "selector": [
          "main > section.section.secondary-section:nth-of-type(2)"
        ],
        "style": "grey",
        "blocks": [
          "cards-gallery"
        ],
        "defaultContent": [
          "main > section.section.secondary-section:nth-of-type(2) > .container > .utility-text-align-center"
        ]
      },
      {
        "id": "4",
        "name": "testimonials",
        "selector": [
          "main > section.section:nth-of-type(3)"
        ],
        "style": null,
        "blocks": [
          "tabs-testimonial"
        ],
        "defaultContent": []
      },
      {
        "id": "5",
        "name": "latest-articles",
        "selector": [
          "main > section.section.secondary-section:nth-of-type(4)"
        ],
        "style": "grey",
        "blocks": [
          "cards-article"
        ],
        "defaultContent": [
          "main > section.section.secondary-section:nth-of-type(4) > .container > .utility-text-align-center"
        ]
      },
      {
        "id": "6",
        "name": "faq",
        "selector": [
          "main > section.section:nth-of-type(5)"
        ],
        "style": "faq-split",
        "blocks": [
          "accordion-faq"
        ],
        "defaultContent": [
          "main > section.section:nth-of-type(5) > .container > .grid-layout > div:first-child"
        ]
      },
      {
        "id": "7",
        "name": "cta-banner",
        "selector": [
          "main > section.section.inverse-section"
        ],
        "style": "dark",
        "blocks": [
          "hero-banner"
        ],
        "defaultContent": []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
