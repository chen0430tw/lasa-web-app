import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { LASAEngine, runLASA } from "./engine";
import { summarizePeriod } from "./state";
import { makeLASAState } from "./utils";
import { AccountClass, Event, SystemMode } from "./types";
import { importEventsFromCSV, importEventsFromJSON, normalizeEvent } from "./importers";
import { RULE_REGISTRY } from "./rules";
import { PeriodManager } from "./period";
import { PendingConfirmManager } from "./confirm";

// ── Stateful server engine ────────────────────────────────────────────────────

interface ServerState {
  engine: LASAEngine;
  periodManager: PeriodManager;
  confirmManager: PendingConfirmManager;
}

function makeServerState(): ServerState {
  const initial = makeLASAState();
  return {
    engine: new LASAEngine(SystemMode.BALANCED, 17, initial),
    periodManager: new PeriodManager(),
    confirmManager: new PendingConfirmManager(),
  };
}

let ss: ServerState = makeServerState();

// ── HTTP helpers ──────────────────────────────────────────────────────────────

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf-8");
}

function sendJson(res: ServerResponse, code: number, data: unknown): void {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data, null, 2));
}

function contentType(path: string): string {
  const ext = extname(path);
  switch (ext) {
    case ".html": return "text/html; charset=utf-8";
    case ".js":   return "text/javascript; charset=utf-8";
    case ".css":  return "text/css; charset=utf-8";
    case ".json": return "application/json; charset=utf-8";
    default:      return "text/plain; charset=utf-8";
  }
}

function serveStatic(res: ServerResponse, filepath: string): void {
  if (!existsSync(filepath)) {
    res.statusCode = 404;
    res.end("Not found");
    return;
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", contentType(filepath));
  res.end(readFileSync(filepath));
}

// ── Route handlers ────────────────────────────────────────────────────────────

export function createLASAServer(port = 3000) {
  const server = createServer(async (req, res) => {
    const url = req.url ?? "/";
    const method = req.method ?? "GET";

    // CORS for dev convenience
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (method === "OPTIONS") { res.statusCode = 204; return res.end(); }

    try {
      // ── Health ──────────────────────────────────────────────────────────────
      if (method === "GET" && url === "/health") {
        return sendJson(res, 200, { ok: true });
      }

      // ── Rules registry ──────────────────────────────────────────────────────
      if (method === "GET" && url === "/rules") {
        return sendJson(res, 200, { rules: Object.keys(RULE_REGISTRY) });
      }

      // ── Stateful state ──────────────────────────────────────────────────────
      if (method === "GET" && url === "/state") {
        return sendJson(res, 200, {
          state: ss.engine.state,
          semanticLogSize: ss.engine.semanticLog.size,
          currentPeriod: ss.periodManager.current(),
          pendingItems: ss.confirmManager.list(),
        });
      }

      // ── Process single event on stateful engine ─────────────────────────────
      if (method === "POST" && url === "/event") {
        const body = await readBody(req);
        const event: Event = normalizeEvent(JSON.parse(body) as Event);
        const { processEvent } = await import("./engine");
        processEvent(event, ss.engine);
        const ctx = ss.engine.semanticLog.get(event.id);
        return sendJson(res, 200, {
          eventId: event.id,
          accountClass: ss.engine.state.metaLog.at(-1)?.accountClass,
          semanticContext: ctx,
          state: ss.engine.state,
        });
      }

      // ── Reset stateful engine ───────────────────────────────────────────────
      if (method === "POST" && url === "/reset") {
        const body = await readBody(req);
        const payload = body ? (JSON.parse(body) as { initialCash?: number; emergencyReserve?: number }) : {};
        ss = makeServerState();
        if (payload.initialCash !== undefined) ss.engine.state.assets.cash = payload.initialCash;
        if (payload.emergencyReserve !== undefined) ss.engine.state.reserve.emergencyReserve = payload.emergencyReserve;
        return sendJson(res, 200, { ok: true, state: ss.engine.state });
      }

      // ── Period management ───────────────────────────────────────────────────
      if (method === "GET" && url === "/periods") {
        return sendJson(res, 200, {
          periods: ss.periodManager.list(),
          current: ss.periodManager.current(),
        });
      }

      if (method === "POST" && url === "/period/open") {
        const body = await readBody(req);
        const { id, label } = JSON.parse(body) as { id: string; label: string };
        ss.periodManager.open(id, label, ss.engine.state);
        return sendJson(res, 200, { ok: true, period: ss.periodManager.current() });
      }

      if (method === "POST" && url === "/period/close") {
        const period = ss.periodManager.close(ss.engine.state);
        return sendJson(res, 200, {
          ok: true,
          period,
          summaryText: period.summary ? summarizePeriod(period.summary) : "",
        });
      }

      // ── Pending confirmation ────────────────────────────────────────────────
      if (method === "GET" && url === "/pending") {
        return sendJson(res, 200, { items: ss.confirmManager.list() });
      }

      if (method === "POST" && url === "/pending/register") {
        const body = await readBody(req);
        const item = JSON.parse(body) as { eventId: string; amount: number; riskTags?: string[]; note?: string };
        ss.confirmManager.register({
          eventId: item.eventId,
          amount: item.amount,
          riskTags: (item.riskTags ?? ["NORMAL"]) as any,
          note: item.note ?? "",
        });
        return sendJson(res, 200, { ok: true, items: ss.confirmManager.list() });
      }

      if (method === "POST" && url === "/pending/confirm") {
        const body = await readBody(req);
        const { eventId, targetClass } = JSON.parse(body) as { eventId: string; targetClass: AccountClass };
        ss.confirmManager.confirm(ss.engine.state, eventId, targetClass);
        return sendJson(res, 200, { ok: true, state: ss.engine.state });
      }

      if (method === "POST" && url === "/pending/release") {
        const body = await readBody(req);
        const { eventId } = JSON.parse(body) as { eventId: string };
        ss.confirmManager.release(ss.engine.state, eventId);
        return sendJson(res, 200, { ok: true, state: ss.engine.state });
      }

      // ── Stateless batch run (original endpoint, kept) ───────────────────────
      if (method === "POST" && url === "/run") {
        const body = await readBody(req);
        const payload = JSON.parse(body) as { events: Event[]; initialCash?: number; emergencyReserve?: number };
        const initial = makeLASAState();
        initial.assets.cash = payload.initialCash ?? 0;
        initial.reserve.emergencyReserve = payload.emergencyReserve ?? 0;
        const engine = new LASAEngine(SystemMode.BALANCED, 17, initial);
        const events = (payload.events ?? []).map(normalizeEvent);
        const summary = runLASA(engine, events);
        return sendJson(res, 200, {
          summary,
          state: engine.state,
          semanticLog: Object.fromEntries(engine.semanticLog.entries()),
          semanticLogSize: engine.semanticLog.size,
          summaryText: summarizePeriod(summary),
        });
      }

      // ── Importers ───────────────────────────────────────────────────────────
      if (method === "POST" && url === "/import/json") {
        const body = await readBody(req);
        const payload = JSON.parse(body) as { content: string };
        return sendJson(res, 200, { events: importEventsFromJSON(payload.content) });
      }

      if (method === "POST" && url === "/import/csv") {
        const body = await readBody(req);
        const payload = JSON.parse(body) as { content: string };
        return sendJson(res, 200, { events: importEventsFromCSV(payload.content) });
      }

      // ── Static files ────────────────────────────────────────────────────────
      if (method === "GET" && (url === "/" || url === "/index.html")) {
        return serveStatic(res, join(process.cwd(), "public", "index.html"));
      }
      if (method === "GET" && url.startsWith("/app.js")) {
        return serveStatic(res, join(process.cwd(), "public", "app.js"));
      }
      if (method === "GET" && url.startsWith("/styles.css")) {
        return serveStatic(res, join(process.cwd(), "public", "styles.css"));
      }

      return sendJson(res, 404, { error: "Not found" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return sendJson(res, 400, { error: msg });
    }
  });

  return {
    listen: () => server.listen(port, () => console.log(`LASA API listening on :${port}`)),
    server,
  };
}
