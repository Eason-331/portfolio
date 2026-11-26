import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const port = Number(process.env.PORT ?? 4173);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");
    const path = decodeURIComponent(url.pathname);
    if (path === "/de") {
      response.writeHead(308, { Location: "/de/" }).end();
      return;
    }
    const file = resolve(dist, `.${path.endsWith("/") ? `${path}index.html` : path}`);
    const withinDist = relative(dist, file);
    if (withinDist === ".." || withinDist.startsWith(`..${sep}`)) {
      response.writeHead(404).end("Not found");
      return;
    }
    const body = await readFile(file);
    response.writeHead(200, { "Content-Type": mime[extname(file)] ?? "application/octet-stream" }).end(body);
  } catch {
    response.writeHead(404).end("Not found. Run npm run build if dist is missing.");
  }
}).listen(port, "127.0.0.1", () => console.log(`Preview: http://127.0.0.1:${port}/`));
