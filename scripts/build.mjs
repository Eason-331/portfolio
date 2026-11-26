import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { renderPage } from "../src/page.mjs";

const dist = new URL("../dist/", import.meta.url);
const german = new URL("de/", dist);

await rm(dist, { recursive: true, force: true });
await mkdir(german, { recursive: true });
await Promise.all([
  cp(new URL("../src/assets/", import.meta.url), new URL("assets/", dist), { recursive: true }),
  writeFile(new URL("index.html", dist), renderPage("en")),
  writeFile(new URL("index.html", german), renderPage("de")),
  writeFile(new URL(".nojekyll", dist), ""),
]);

console.log("Built dist/index.html and dist/de/index.html");
