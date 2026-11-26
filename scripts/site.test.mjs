import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { test } from "node:test";

const dist = new URL("../dist/", import.meta.url);
const origin = "https://portfolio.example";
const pagesRoot = "/portfolio/";
const sectionIds = ["home", "projects", "about", "skills", "education", "cv", "contact"];

function localFile(url) {
  assert.ok(url.pathname.startsWith(pagesRoot), `URL escaped Pages project path: ${url}`);
  const path = url.pathname.slice(pagesRoot.length);
  return new URL(path.endsWith("/") || !path ? `${path}index.html` : path, dist);
}

for (const [language, path] of [["en", ""], ["de", "de/"]]) {
  const pageUrl = new URL(pagesRoot + path, origin);
  const html = await readFile(localFile(pageUrl), "utf8");

  test(`${language}: static content, section IDs and language switch`, () => {
    assert.match(html, new RegExp(`<html lang="${language}"`));
    assert.equal([...html.matchAll(/<h1[ >]/g)].length, 1);
    for (const id of sectionIds) assert.match(html, new RegExp(`<section[^>]+id="${id}"`));

    const alternate = language === "en" ? "de" : "en";
    assert.match(html, new RegExp(`class="language-switch"[^>]+hreflang="${alternate}"`));
  });

  test(`${language}: links, asset paths and anchors under a GitHub Pages project path`, async () => {
    const links = new Set(Array.from(html.matchAll(/\b(?:href|src)="([^"]*)"/g), ([, value]) => value));
    for (const link of links) {
      assert.ok(link && link !== "#", "Empty destination");
      const url = new URL(link.replaceAll("&amp;", "&"), pageUrl);
      assert.ok(["https:", "mailto:"].includes(url.protocol));
      if (url.origin !== origin) continue;

      const file = localFile(url);
      assert.ok((await stat(file)).isFile(), `Missing file for ${link}`);
      if (url.hash) {
        const target = await readFile(file, "utf8");
        assert.ok(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Missing target for ${link}`);
      }
    }
  });

  test(`${language}: CV downloads as a PDF`, async () => {
    const download = html.match(/href="([^"]+\.pdf)"[^>]+download/);
    assert.ok(download, "Missing download link");
    const pdf = await readFile(localFile(new URL(download[1], pageUrl)));
    assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  });
}

test("stylesheet references fonts that are included in the static build", async () => {
  const css = await readFile(new URL("assets/site.css", dist), "utf8");
  for (const [, asset] of css.matchAll(/url\("([^"]+)"\)/g)) {
    assert.ok((await stat(new URL(asset, new URL("assets/", dist)))).isFile());
  }
});
