import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";
import { createBoardHandler } from "./boardPlugin.ts";

function loadEnvFile() {
  try {
    const text = readFileSync(resolve(".env"), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
      if (!match || process.env[match[1]]) continue;
      process.env[match[1]] = match[2].trim();
    }
  } catch {
    // The host provides ADMIN_PASSWORD when .env is not on the server.
  }
}

loadEnvFile();

const handle = createBoardHandler(process.env.ADMIN_PASSWORD || "seva-bridge");
const root = resolve("dist");
const port = Number(process.env.PORT || 4173);

const types: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json",
  ".webp": "image/webp",
};

function fileFor(pathname: string) {
  const relative = decodeURIComponent(pathname).replace(/^\/+/, "");
  const requested = resolve(root, relative);
  if (requested !== root && !requested.startsWith(root + sep)) return null;
  if (existsSync(requested) && statSync(requested).isFile()) return requested;
  return join(root, "index.html");
}

const server = createServer((req, res) => {
  void (async () => {
    if (await handle(req, res)) return;
    const url = new URL(req.url ?? "/", "http://localhost");
    const file = fileFor(url.pathname);
    if (!file || !existsSync(file)) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }
    res.setHeader("Content-Type", types[extname(file)] ?? "application/octet-stream");
    createReadStream(file).pipe(res);
  })().catch(() => {
    if (!res.headersSent) {
      res.statusCode = 500;
      res.end("The page could not be loaded.");
    }
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`VT Seva is serving on port ${port}`);
});
