/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsHeroParser from "./parsers/columns-hero.js";
import columnsArticleParser from "./parsers/columns-article.js";
import cardsGalleryParser from "./parsers/cards-gallery.js";
import tabsTestimonialParser from "./parsers/tabs-testimonial.js";
import cardsArticleParser from "./parsers/cards-article.js";
import accordionFaqParser from "./parsers/accordion-faq.js";
import heroBannerParser from "./parsers/hero-banner.js";

// TRANSFORMER IMPORTS
import cleanupTransformer from "./transformers/wknd-trendsetters-cleanup.js";
import sectionsTransformer from "./transformers/wknd-trendsetters-sections.js";

// PARSER REGISTRY
const parsers = {
  "columns-hero": columnsHeroParser,
  "columns-article": columnsArticleParser,
  "cards-gallery": cardsGalleryParser,
  "tabs-testimonial": tabsTestimonialParser,
  "cards-article": cardsArticleParser,
  "accordion-faq": accordionFaqParser,
  "hero-banner": heroBannerParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
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

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Initial cleanup + section break markers
    executeTransformers("beforeTransform", main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block (skip elements already replaced by an earlier parser)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Final cleanup + section metadata
    executeTransformers("afterTransform", main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement("hr");
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path (root URL maps to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, "")
      .replace(/\.html?$/, "");
    const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
