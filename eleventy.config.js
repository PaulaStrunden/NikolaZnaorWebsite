/*
  Eleventy configuration for the Nikola Znaor Architects website.

  What happens here:
  1. YAML files can be used for content (easier to edit than JSON).
  2. CSS, JS and fonts are copied to the finished site unchanged.
  3. English pages live in src/en/ but are published at the root (/work/ instead of /en/work/).
     Dutch and Croatian live in src/nl/ and src/hr/ and keep their prefix (/nl/work/, /hr/work/).
  4. One "projects" list per language, sorted by the `order` field.
  5. A `figure` shortcode turns one image into responsive AVIF/WebP/JPEG with lazy loading.
  6. After every build, a list of remaining placeholders is printed in the terminal.
*/
import fs from "node:fs";
import path from "node:path";
import { load as loadYaml } from "js-yaml";
import Image from "@11ty/eleventy-img";
import { HtmlBasePlugin } from "@11ty/eleventy";

const LANGUAGES = ["en", "nl", "hr"]; // must match the folders in src/ and site.languages
const DEFAULT_LANG = "en"; // published without a language prefix

export default function (eleventyConfig) {
  // 1. YAML data files ----------------------------------------------------
  eleventyConfig.addDataExtension("yaml,yml", (contents) => loadYaml(contents));

  // 2. Static files -------------------------------------------------------
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });
  eleventyConfig.addWatchTarget("src/images/");

  // Rewrites links like "/work/" when the site lives in a subfolder (GitHub Pages).
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // 3. Clean URLs per language -------------------------------------------
  // src/en/work/airshade.md  ->  /work/airshade/
  // src/hr/work/airshade.md  ->  /hr/work/airshade/
  // A page can still set its own `permalink` in front matter.
  eleventyConfig.addGlobalData("permalink", () => (data) => {
    const stem = data.page.filePathStem
      .replace(new RegExp(`^/${DEFAULT_LANG}(?=/)`), "")
      .replace(/\/index$/, "");
    return `${stem}/index.html`;
  });

  // Projects marked `draft: true` are skipped completely (no page, not in any list).
  eleventyConfig.addPreprocessor("drafts", "*", (data) => {
    if (data.draft) return false;
  });

  // 4. Projects -----------------------------------------------------------
  // Every Markdown file in src/<lang>/work/ is one project.
  for (const lang of LANGUAGES) {
    eleventyConfig.addCollection(`projects_${lang}`, (api) =>
      api
        .getFilteredByGlob(`src/${lang}/work/*.md`)
        .filter((p) => !p.data.draft)
        .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999))
    );
  }

  // Only the projects marked `featured: true` (Home page).
  eleventyConfig.addFilter("featured", (list) => list.filter((p) => p.data.featured));

  // Image layout on project pages:
  // - The first two images open the page side by side (ideally a photo and a blue drawing),
  //   so the first row fits on the screen. `wide: false` on the first image skips this pair.
  // - Images with `wide: true` run full width, `half: true` take half a row; all others fill rows of three.
  // - A single image left over becomes wide; two left over share a row.
  eleventyConfig.addFilter("figureLayout", (images = []) => {
    const out = images.map((img) => ({ ...img, span: img.wide ? "wide" : img.half ? "half" : "third" }));
    const pair = out.length > 1 && images[0].wide === undefined && !images[1].wide;
    if (pair) { out[0].span = "half"; out[1].span = "half"; }
    else if (out.length === 1) out[0].span = "wide";
    let run = [];
    const close = () => {
      if (run.length % 3 === 1) run[run.length - 1].span = "wide";
      if (run.length % 3 === 2) run.slice(-2).forEach((img) => (img.span = "half"));
      run = [];
    };
    out.slice(pair ? 2 : 0).forEach((img) => (img.span === "third" ? run.push(img) : close()));
    close();
    return out;
  });

  // How many images form the first row (1 wide, 2 halves or 3 thirds); they open the page.
  eleventyConfig.addFilter("firstRowCount", (laid = []) => {
    if (!laid.length) return 0;
    const span = laid[0].span;
    let n = 0;
    while (n < laid.length && laid[n].span === span && n < (span === "wide" ? 1 : span === "half" ? 2 : 3)) n++;
    return n;
  });

  // Position of a page in a list, for sheet numbers (02.1, 02.2 …) and previous/next links.
  eleventyConfig.addFilter("indexOfUrl", (list, url) => list.findIndex((p) => p.url === url));

  // "New house" + "in progress" -> "New house, in progress"
  eleventyConfig.addFilter("joinFilled", (parts, sep = ", ") => parts.filter(Boolean).join(sep));

  // Two-digit sheet numbers: 1 -> "01"
  eleventyConfig.addFilter("pad", (n) => String(n).padStart(2, "0"));

  // Full URL for SEO tags, e.g. "/work/" -> "https://example.com/work/"
  eleventyConfig.addFilter("absoluteUrl", function (url) {
    const base = this.ctx?.site?.url || "";
    return new URL(url, base).href;
  });

  // Unique list of values, used to build the filter buttons from the projects.
  eleventyConfig.addFilter("uniqueBy", (list, key) => [...new Set(list.map((item) => item.data[key]))]);

  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  // 5. Images -------------------------------------------------------------
  // Finds the project an image belongs to (in English, so every language downloads the same file name)
  // and returns "NikolaZnaorArchitects_<Project>_<Year>_Fig<nn>".
  function archiveName(ctx, src) {
    const projects = ctx?.collections?.projects_en || [];
    for (const p of projects) {
      const i = (p.data.images || []).findIndex((img) => img.src === src);
      if (i === -1) continue;
      const name = p.fileSlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
      const year = String(p.data.year || "").replace(/[–—]/g, "-").replace(/[^0-9-]/g, "");
      return ["NikolaZnaorArchitects", name, year, "Fig" + String(i + 1).padStart(2, "0")].filter(Boolean).join("_");
    }
    return null;
  }

  // Usage in a template:  {% figure image, "(max-width: 760px) 100vw, 60vw" %}
  // `image` comes from a project's front matter: { src, alt, caption, label, credit, wide, half, position, fit, pad, drawing }
  // Without `src` (or if the file is missing) the crossed placeholder frame from the design is shown.
  eleventyConfig.addAsyncShortcode("figure", async function (image = {}, sizes = "100vw", ratio = "16 / 10") {
    const label = image.label || image.caption || "Image";
    const placeholder = `<div class="frame" style="aspect-ratio:${ratio}"><span>${label}</span></div>`;
    if (!image.src) return placeholder;

    const input = path.join("src/images", image.src);
    if (!fs.existsSync(input)) {
      console.warn(`[images] Not found: ${input} (showing placeholder frame instead)`);
      return placeholder;
    }
    if (image.alt === undefined) {
      throw new Error(`[images] ${image.src} has no alt text. Add "alt:" in the front matter (use alt: "" only for purely decorative images).`);
    }
    // Archive-style file names, so a downloaded image says what it is:
    // NikolaZnaorArchitects_HouseInIstria_2022-2025_Fig03_1800w.jpg  (project, year, figure number as on the page, width)
    const archive = archiveName(this.ctx, image.src);
    const metadata = await Image(input, {
      widths: [480, 800, 1200, 1800, 2400],
      formats: ["avif", "webp", "jpeg"],
      outputDir: "_site/img/",
      urlPath: "/img/",
      ...(archive ? { filenameFormat: (id, src, width, format) => `${archive}_${width}w.${format}` } : {}),
    });
    // Archive file names stay readable (…_Fig04_800w.jpeg) but carry the image's content hash as ?v=,
    // so a browser never shows an old cached picture after the figures are reordered.
    const v = fs.statSync(input).size.toString(36) + Math.round(fs.statSync(input).mtimeMs / 1000).toString(36);
    for (const fmt of Object.values(metadata))
      for (const entry of fmt) {
        entry.url += `?v=${v}`;
        entry.srcset = `${entry.url} ${entry.width}w`;
      }
    return Image.generateHTML(metadata, {
      alt: image.alt,
      sizes,
      loading: "lazy",
      decoding: "async",
      // Optional `position:` (e.g. "top", "left 30%") chooses which part stays visible when cropped.
      // Optional `fit: contain` shows the whole image uncropped, padded with Klein Blue (for blue drawings).
      // Optional `pad:` (e.g. "2rem") adds blue space around a contained drawing, so it appears smaller.
      ...(image.position || image.fit
        ? { style: [image.position && `object-position: ${image.position}`, image.fit === "contain" && "object-fit: contain; background: #002FA7", image.fit === "contain" && image.pad && `padding: ${image.pad}`].filter(Boolean).join("; ") }
        : {}),
    });
  });

  // Open Graph image: first real project image, otherwise the default blueprint image.
  eleventyConfig.addAsyncShortcode("ogImage", async function (images) {
    const base = this.ctx?.site?.url || "";
    const first = (images || []).find((img) => img.src && fs.existsSync(path.join("src/images", img.src)));
    if (!first) return new URL("/assets/og-default.png", base).href;
    const metadata = await Image(path.join("src/images", first.src), {
      widths: [1200],
      formats: ["jpeg"],
      outputDir: "_site/img/",
      urlPath: "/img/",
    });
    return new URL(metadata.jpeg[0].url, base).href;
  });

  // 6. Placeholder report -------------------------------------------------
  // Placeholders are written in [square brackets], start with "Placeholder text",
  // or use example.com. After each build they are listed per page.
  eleventyConfig.on("eleventy.after", ({ results }) => {
    const pattern = /\[[^\]\n]{2,80}\]|Placeholder text[^<.]*|[\w.]+@example\.com|https?:\/\/example\.com/g;
    const report = [];
    for (const { url, content } of results) {
      if (!url || !url.endsWith("/")) continue;
      const text = content
        .replace(/<script[\s\S]*?<\/script>/g, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&");
      const found = [...new Set(text.match(pattern) || [])];
      if (found.length) report.push(`  ${url}\n    ${found.join("\n    ")}`);
    }
    if (report.length) {
      console.log(`\nPlaceholders still on the site (replace before launch):\n${report.join("\n")}\n`);
    }
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
