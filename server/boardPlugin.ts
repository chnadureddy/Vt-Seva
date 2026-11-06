import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { dirname, resolve } from "node:path";
import type { Plugin } from "vite";

type Voice = "youth" | "adult";

type BoardResponse = {
  id: string;
  cardId: string;
  voice: Voice;
  text: string;
  createdAt: string;
};

type BoardStore = {
  responses: BoardResponse[];
  featuredIds: string[];
};

const EMPTY: BoardStore = { responses: [], featuredIds: [] };

function isResponse(value: unknown): value is BoardResponse {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<BoardResponse>;
  return (
    typeof item.id === "string" &&
    /^[a-zA-Z0-9-]{8,80}$/.test(item.id) &&
    typeof item.cardId === "string" &&
    /^[a-z0-9-]{1,40}$/.test(item.cardId) &&
    (item.voice === "youth" || item.voice === "adult") &&
    typeof item.text === "string" &&
    item.text.trim().length >= 12 &&
    item.text.length <= 600 &&
    typeof item.createdAt === "string"
  );
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolveBody, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > 20_000) {
        reject(new Error("too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolveBody(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const ADMIN_USER = "admin";

function authorized(req: IncomingMessage, password: string) {
  return req.headers["x-admin-user"] === ADMIN_USER && req.headers["x-admin-password"] === password;
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export function createBoardHandler(password: string) {
  const file = resolve("data/board.json");
  let queue: Promise<unknown> = Promise.resolve();

  function enqueue<T>(job: () => T): Promise<T> {
    const run = queue.then(job, job);
    queue = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }

  function readStore(): BoardStore {
    try {
      const parsed: unknown = JSON.parse(readFileSync(file, "utf8"));
      if (!parsed || typeof parsed !== "object") return { ...EMPTY, responses: [], featuredIds: [] };
      const record = parsed as Partial<BoardStore>;
      const responses = Array.isArray(record.responses) ? record.responses.filter(isResponse) : [];
      const known = new Set(responses.map((item) => item.id));
      const featuredIds = Array.isArray(record.featuredIds)
        ? record.featuredIds.filter((id): id is string => typeof id === "string" && known.has(id))
        : [];
      return { responses, featuredIds };
    } catch {
      return { responses: [], featuredIds: [] };
    }
  }

  function writeStore(store: BoardStore) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(store, null, 2));
  }

  async function handle(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    const url = new URL(req.url ?? "/", "http://localhost");
    const path = url.pathname;

    if (path === "/api/perspectives" && req.method === "GET") {
      const store = await enqueue(() => readStore());
      const chosen = new Set(store.featuredIds);
      send(res, 200, {
        responses: store.responses.filter((item) => chosen.has(item.id)),
      });
      return true;
    }

    if (path === "/api/responses" && req.method === "POST") {
      let payload: unknown;
      try {
        payload = JSON.parse(await readBody(req));
      } catch {
        send(res, 400, { error: "The answer could not be read." });
        return true;
      }
      if (!isResponse(payload)) {
        send(res, 400, { error: "Write at least a sentence, and choose youth or adult." });
        return true;
      }
      const saved = await enqueue(() => {
        const store = readStore();
        if (!store.responses.some((item) => item.id === payload.id)) {
          store.responses.unshift({
            id: payload.id,
            cardId: payload.cardId,
            voice: payload.voice,
            text: payload.text.trim(),
            createdAt: payload.createdAt,
          });
          writeStore(store);
        }
        return store.responses.find((item) => item.id === payload.id) ?? payload;
      });
      send(res, 200, saved);
      return true;
    }

    const deleteMatch = path.match(/^\/api\/responses\/([a-zA-Z0-9-]{8,80})$/);
    if (deleteMatch && req.method === "DELETE") {
      const id = deleteMatch[1];
      await enqueue(() => {
        const store = readStore();
        store.responses = store.responses.filter((item) => item.id !== id);
        store.featuredIds = store.featuredIds.filter((item) => item !== id);
        writeStore(store);
      });
      send(res, 200, { ok: true });
      return true;
    }

    if (path === "/api/admin/board" && req.method === "GET") {
      if (!authorized(req, password)) {
        send(res, 401, { error: "Unauthorized" });
        return true;
      }
      send(res, 200, await enqueue(() => readStore()));
      return true;
    }

    if (path === "/api/admin/featured" && req.method === "POST") {
      if (!authorized(req, password)) {
        send(res, 401, { error: "Unauthorized" });
        return true;
      }
      let payload: unknown;
      try {
        payload = JSON.parse(await readBody(req));
      } catch {
        send(res, 400, { error: "The selection could not be read." });
        return true;
      }
      const ids = (payload as { featuredIds?: unknown }).featuredIds;
      if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
        send(res, 400, { error: "Choose answers from the list." });
        return true;
      }
      const featuredIds = await enqueue(() => {
        const store = readStore();
        const known = new Set(store.responses.map((item) => item.id));
        store.featuredIds = [...new Set(ids.filter((id) => known.has(id)))];
        writeStore(store);
        return store.featuredIds;
      });
      send(res, 200, { featuredIds });
      return true;
    }

    return false;
  }

  return handle;
}

export function boardPlugin(password: string): Plugin {
  const handle = createBoardHandler(password);

  function attach(middlewares: { use: (fn: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void }) {
    middlewares.use((req, res, next) => {
      void handle(req, res)
        .then((handled) => {
          if (!handled) next();
        })
        .catch(() => {
          if (!res.headersSent) send(res, 500, { error: "The board could not be saved." });
        });
    });
  }

  return {
    name: "vt-seva-board",
    configureServer(server) {
      attach(server.middlewares);
    },
    configurePreviewServer(server) {
      attach(server.middlewares);
    },
  };
}
