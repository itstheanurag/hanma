/**
 * HTML template utilities for generating SEO-optimized pages
 */

import { SITE_URL } from "../constant.js";
import { PageMetadata } from "../types.js";

/**
 * Generate HTML head with SEO metadata
 */
export function generateHtmlHead(
  metadata: PageMetadata,
  additionalJsonLd?: string | string[],
): string {
  const {
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    twitterImage,
    noindex,
  } = metadata;
  const socialImage = ogImage || `${SITE_URL}/og-image.png`;
  const twitterSocialImage = twitterImage || socialImage;
  const websiteJsonLd = serializeJsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Hanma",
    url: `${SITE_URL}/`,
    description:
      "Production-ready backend code snippets for Express, Hono, Elysia, Fastify, and NestJS",
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Hanma",
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/favicon.png`,
      sameAs: [
        "https://github.com/itstheanurag/hanma",
        "https://www.npmjs.com/package/hanma",
      ],
    },
  });
  const additionalJsonLdScripts = normalizeJsonLd(additionalJsonLd)
    .map(
      (jsonLd) =>
        `  <script type="application/ld+json">\n${serializeJsonLd(jsonLd)}\n  </script>`,
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="${noindex ? "noindex, nofollow" : "index, follow"}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml">
  <meta name="author" content="Gaurav Kumar">

  <!-- Icons & theme -->
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/favicon.png">
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0b0b12" media="(prefers-color-scheme: dark)">

  <!-- Open Graph -->
  <meta property="og:site_name" content="Hanma">
  <meta property="og:locale" content="en_US">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(ogTitle || title)}">
  <meta property="og:description" content="${escapeHtml(ogDescription || description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${escapeHtml(socialImage)}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Hanma: production-ready backend code snippets">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(ogTitle || title)}">
  <meta name="twitter:description" content="${escapeHtml(ogDescription || description)}">
  <meta name="twitter:image" content="${escapeHtml(twitterSocialImage)}">
  <meta name="twitter:image:alt" content="Hanma: production-ready backend code snippets">

  <!-- JSON-LD -->
  <script type="application/ld+json">
${websiteJsonLd}
  </script>
${additionalJsonLdScripts}

  <!-- Styles -->
  <link rel="stylesheet" href="/styles.css">
</head>
<body>`;
}

/**
 * Generate HTML footer
 */
export function generateHtmlFooter(): string {
  const year = new Date().getFullYear();

  return `<footer>
  <div class="container footer-inner">
    <p>&copy; ${year} Hanma. Production-ready backend code snippets.</p>
    <nav aria-label="Footer">
      <a href="/">Home</a>
      <a href="/framework/">Frameworks</a>
      <a href="/docs">Documentation</a>
      <a href="https://github.com/itstheanurag/hanma" rel="noopener">GitHub</a>
    </nav>
  </div>
</footer>
<script>
  document.addEventListener("click", function (event) {
    var button = event.target.closest(".copy-button");
    if (!button) return;
    var container = button.closest(
      ".code-container, .command-block, .installation",
    );
    var code = container ? container.querySelector("pre code, code") : null;
    if (!code || !navigator.clipboard) return;
    navigator.clipboard.writeText(code.textContent || "").then(function () {
      var label = button.querySelector("span");
      if (!label) return;
      var original = label.textContent;
      label.textContent = "Copied";
      setTimeout(function () {
        label.textContent = original;
      }, 1500);
    });
  });
</script>
</body>
</html>`;
}

/**
 * Generate breadcrumb navigation
 */
export function generateBreadcrumb(
  items: Array<{ name: string; url: string }>,
): string {
  const itemsHtml = items
    .map((item, index) => {
      const isLast = index === items.length - 1;
      return isLast
        ? `<span class="breadcrumb-item active">${escapeHtml(item.name)}</span>`
        : `<a href="${item.url}" class="breadcrumb-item">${escapeHtml(item.name)}</a>`;
    })
    .join('<span class="breadcrumb-separator">/</span>');

  return `<nav class="breadcrumb" aria-label="Breadcrumb">
  ${itemsHtml}
</nav>`;
}

/**
 * Generate code block with syntax highlighting placeholder
 */
export function generateCodeBlock(
  code: string,
  language: string = "typescript",
): string {
  return `<pre class="code-block"><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
}

/**
 * Generate copy-to-clipboard button
 */
export function generateCopyButton(codeId: string): string {
  return `<button class="copy-button" data-code-id="${codeId}" aria-label="Copy code to clipboard">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
  <span>Copy</span>
</button>`;
}

/**
 * Generate FAQ section
 */
export function generateFaqSection(
  faqs: Array<{ question: string; answer: string }>,
): string {
  const faqItems = faqs
    .map(
      (faq, index) => `<details class="faq-item" data-faq-index="${index}">
  <summary class="faq-question">${escapeHtml(faq.question)}</summary>
  <div class="faq-answer">${faq.answer}</div>
</details>`,
    )
    .join("\n");

  return `<section class="faq-section">
  <h2>Frequently Asked Questions</h2>
  <div class="faq-list">
    ${faqItems}
  </div>
</section>`;
}

/**
 * Generate related snippets section
 */
export function generateRelatedSnippets(
  snippets: Array<{ name: string; displayName: string; url: string }>,
): string {
  const snippetItems = snippets
    .map(
      (snippet) => `<a href="${snippet.url}" class="related-snippet">
  <h3>${escapeHtml(snippet.displayName)}</h3>
  <p>${escapeHtml(snippet.name)}</p>
</a>`,
    )
    .join("\n");

  return `<section class="related-snippets">
  <h2>Related Snippets</h2>
  <div class="related-snippets-grid">
    ${snippetItems}
  </div>
</section>`;
}

/**
 * Generate feature list
 */
export function generateFeatureList(features: string[]): string {
  const featureItems = features
    .map(
      (feature) => `<li class="feature-item">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
  <span>${escapeHtml(feature)}</span>
</li>`,
    )
    .join("\n");

  return `<ul class="feature-list">
  ${featureItems}
</ul>`;
}

/**
 * Generate installation section
 */
export function generateInstallationSection(
  command: string,
  dependencies: string[],
): string {
  const depsHtml =
    dependencies.length > 0
      ? `<div class="dependencies">
  <h3>Dependencies</h3>
  <code>${dependencies.join(", ")}</code>
</div>`
      : "";

  return `<section class="installation">
  <h2>Installation</h2>
  <div class="command-block">
    <code>${escapeHtml(command)}</code>
    ${generateCopyButton("install-command")}
  </div>
  ${depsHtml}
</section>`;
}

/**
 * Generate usage section
 */
export function generateUsageSection(usage: string): string {
  return `<section class="usage">
  <h2>Usage</h2>
  ${generateCodeBlock(usage)}
</section>`;
}

/**
 * Generate framework navigation
 */
export function generateFrameworkNavigation(
  currentFramework: string,
  frameworks: Array<{ id: string; name: string }>,
): string {
  const navItems = frameworks
    .map(
      (
        fw,
      ) => `<a href="/framework/${fw.id}" class="framework-link ${fw.id === currentFramework ? "active" : ""}">
  ${escapeHtml(fw.name)}
</a>`,
    )
    .join("\n");

  return `<nav class="framework-nav">
  ${navItems}
</nav>`;
}

/**
 * Generate category navigation
 */
export function generateCategoryNavigation(
  currentCategory: string,
  categories: Array<{ id: string; title: string }>,
): string {
  const navItems = categories
    .map(
      (
        cat,
      ) => `<a href="#${cat.id}" class="category-link ${cat.id === currentCategory ? "active" : ""}">
  ${escapeHtml(cat.title)}
</a>`,
    )
    .join("\n");

  return `<nav class="category-nav">
  ${navItems}
</nav>`;
}

/**
 * Escape JSON-LD for safe embedding in a script tag.
 * Replacing `<` prevents snippet content such as `</script>` from terminating
 * the surrounding script element.
 */
function serializeJsonLd(jsonLd: string | object): string {
  const serialized =
    typeof jsonLd === "string" ? jsonLd : JSON.stringify(jsonLd, null, 2);
  return serialized.replace(/</g, "\\u003c");
}

/**
 * Normalize the additional JSON-LD input to a list of documents.
 */
function normalizeJsonLd(jsonLd?: string | string[]): string[] {
  if (!jsonLd) return [];
  return (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).filter(
    (item) => item.trim().length > 0,
  );
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

/**
 * Generate full page with header and footer
 */
export function generateFullPage(
  metadata: PageMetadata,
  content: string,
  additionalJsonLd?: string | string[],
): string {
  const faqs = extractFaqItems(content);
  const faqJsonLd = faqs.length > 0 ? generateFaqJsonLd(faqs) : null;
  const jsonLd = faqJsonLd
    ? [...normalizeJsonLd(additionalJsonLd), faqJsonLd]
    : additionalJsonLd;

  return `${generateHtmlHead(metadata, jsonLd)}
${content}
${generateHtmlFooter()}`;
}

interface FaqItem {
  question: string;
  answer: string;
}

function decodeHtml(value: string): string {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
  };

  return value.replace(/&(amp|lt|gt|quot|#39);/g, (match) => entities[match]);
}

function toPlainText(html: string): string {
  return decodeHtml(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Read FAQ items from generated page markup so any page that renders an FAQ
 * section also emits matching FAQPage structured data.
 */
function extractFaqItems(content: string): FaqItem[] {
  const faqPattern =
    /<details class="faq-item"[^>]*>\s*<summary class="faq-question">([\s\S]*?)<\/summary>\s*<div class="faq-answer">([\s\S]*?)<\/div>\s*<\/details>/g;

  const faqs: FaqItem[] = [];
  for (const match of content.matchAll(faqPattern)) {
    const question = toPlainText(match[1] ?? "");
    const answer = toPlainText(match[2] ?? "");
    if (question && answer) faqs.push({ question, answer });
  }

  return faqs;
}

function generateFaqJsonLd(faqs: FaqItem[]): string {
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    null,
    2,
  );
}
