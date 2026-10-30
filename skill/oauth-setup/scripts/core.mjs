// Runs the page's own script (page.js) in Node so the skill uses the page's rules unchanged: the research prompt,
// the research tools, the claim check, the timing rubric, stage 2 and the Markdown export. The page's DOM is
// replaced by inert stand-ins, and its browser by a plain HTTPS fetch (browse below).
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Everything the skill reads from the page. A re-sync that drops one of these fails loudly.
const EXPORTS = ["newRun", "prompt", "TOOLS", "normalize", "ground", "followUpProblems", "followUpPrompt", "FOLLOW_UP", "addQuestion",
  "runAttempts", "toMarkdown", "placeRequirements", "DEFS", "EVIDENCE_RULES", "PIPELINE_VERSION", "STEP_TYPES", "TIERS", "OWNER", "OWNER_NEXT",
  "PAGE_NAME", "tierLabel", "accessLabel", "clockText", "agentShare", "topRisk", "hrs", "assertPublic", "docId", "pageLine"];

const inert = () => new Proxy(function () {}, {
  get: (t, k) => (k === Symbol.toPrimitive ? () => "" : k === "then" ? undefined : k in t ? t[k] : inert()),
  apply: () => inert(), construct: () => inert(),
});

// ---- The browser, replaced: fetch the page and turn its HTML into text lines ----
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…", rarr: "→", copy: "©" };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => e[0] === "#"
  ? String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : +e.slice(1)) : ENTITIES[e.toLowerCase()] ?? m);
export function htmlToText(html) {
  const title = decode((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").replace(/\s+/g, " ").trim());
  const body = decode(html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|noscript|svg|template|head)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(p|div|li|ul|ol|h[1-6]|tr|td|th|table|section|article|header|footer|nav|aside|main|pre|blockquote|dt|dd|dl|a|button|label|option|summary|details|form)\b[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, ""))
    .split("\n").map((l) => l.replace(/[ \t\r\f\v]+/g, " ").trim()).filter(Boolean).join("\n");
  return { title, body };
}
async function browse(url, maxChars) {
  const target = page.assertPublic(url);
  const res = await fetch(target, {
    redirect: "follow", signal: AbortSignal.timeout(30000),
    headers: { "user-agent": "Mozilla/5.0 (oauth-setup skill; reads public docs)", accept: "text/html,application/json;q=0.9,*/*;q=0.8" },
  });
  const raw = await res.text();
  const isHtml = /html/i.test(res.headers.get("content-type") ?? "") || /^\s*<(!doctype|html)/i.test(raw);
  const p = isHtml ? htmlToText(raw) : { title: "", body: raw.trim() };
  // A browser shows the error page as text; say the status too, so a 404 reads as one.
  if (!res.ok && !p.title) p.title = `${res.status} ${res.statusText}`;
  return { url: res.url || target, title: p.title, body: p.body.slice(0, maxChars) };
}

// ---- Load the page's script ----
let page = null;
export async function loadPage() {
  if (page) return page;
  let js = readFileSync(new URL("./page.js", import.meta.url), "utf8");
  const swap = "async function browse(url, maxChars, signal) {";
  if (!js.includes(swap)) throw new Error("page.js has no browse() to replace");
  js = js.replace(swap, "async function browse(url, maxChars, signal) { return globalThis.__skillBrowse(url, maxChars, signal); }\n  async function __pageBrowse(url, maxChars, signal) {");
  const end = js.lastIndexOf("})();");
  js = js.slice(0, end) + `\n  globalThis.__skillPage = { ${EXPORTS.join(", ")},
    get run() { return run; }, set run(v) { run = v; },
    setEvidence: (g) => { evById = new Map(g.evidence.map((e) => [e.id, e])); } };\n})();`;
  const g = globalThis;
  for (const k of ["document", "navigator", "location", "localStorage", "sessionStorage", "history", "addEventListener", "matchMedia", "requestAnimationFrame", "getComputedStyle", "CSS"])
    Object.defineProperty(g, k, { value: inert(), configurable: true, writable: true });
  Object.defineProperty(g, "window", { value: new Proxy({}, { get: (t, k) => (k === "claude" ? undefined : inert()) }), configurable: true, writable: true });
  for (const k of ["Node", "Element", "HTMLElement"]) if (!(k in g)) g[k] = class {};
  g.__skillBrowse = browse;
  new Function(js)();
  page = g.__skillPage;
  const missing = EXPORTS.filter((k) => page[k] === undefined);
  if (missing.length) throw new Error("page.js is missing: " + missing.join(", "));
  return page;
}

// ---- Where the skill keeps its files ----
export const SKILL_DIR = fileURLToPath(new URL("..", import.meta.url));
export const WORK_DIR = join(process.cwd(), ".oauth-setup");
export const dirs = {
  library: join(SKILL_DIR, "guides"),
  researched: join(WORK_DIR, "guides"),
  research: join(WORK_DIR, "research"),
  progress: join(WORK_DIR, "progress"),
};
export const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
export const writeJson = (p, v) => { mkdirSync(join(p, ".."), { recursive: true }); writeFileSync(p, JSON.stringify(v, null, 2)); };

// A saved guide, by slug or a loose name match. Guides researched in this project win over the bundled library.
export function allGuides() {
  const out = new Map();
  for (const [dir, source] of [[dirs.library, "library"], [dirs.researched, "researched"]]) {
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
      const d = readJson(join(dir, f));
      out.set(d.slug, { ...d, source, file: join(dir, f) });
    }
  }
  return [...out.values()];
}
const squash = (s) => String(s ?? "").toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/[^a-z0-9]/g, "");
export function findGuide(query) {
  const q = squash(query), all = allGuides();
  return all.find((d) => d.slug === query) ?? all.find((d) => squash(d.slug) === q || squash(d.name) === q)
    ?? all.find((d) => q && [d.guide?.app?.website, d.guide?.app?.developerPortal].some((w) => w && squash(w).startsWith(q)))
    ?? all.find((d) => q.length >= 3 && (squash(d.name).startsWith(q) || q.startsWith(squash(d.name))));
}

// The library document shape the page saves, so a guide researched here opens in the page and vice versa.
export function libraryDoc(p, g, meta, run) {
  return { slug: p.docId(g.app.slug || g.app.name), name: g.app.name, query: meta.query, tier: g.verdict.tier, tierLabel: p.tierLabel(g),
    confidence: g.verdict.confidence, summary: g.verdict.summary, guide: g, meta, pipelineVersion: meta.pipelineVersion,
    savedAt: meta.at, run: { probes: run.probes, searchLog: run.searchLog, readLog: run.readLog, queries: run.queries, okPages: run.okPages,
      okSearches: run.okSearches, failedSearches: run.failedSearches } };
}

export function fail(msg) { console.error(msg); process.exit(1); }
