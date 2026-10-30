// Runs the page's own normalize, claim check and stage 2 on made-up providers, with a fake browser.
// Each case pins one rule of the process; the page must hold all of them for any app.
import { readFileSync } from "node:fs";
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const js = html.slice(html.indexOf("<script>\n(() => {") + 8, html.lastIndexOf("</script>"));
const grab = (a, b) => { const i = js.indexOf(a), j = js.indexOf(b, i); if (i < 0 || j < 0) throw new Error("slice: " + a); return js.slice(i, j); };
const src = [
  grab("  const TIERS = {", "  const $ = (s)"),
  grab("  // ---- Did real content come back", "  async function readPage"),
  grab("  const nu = ", "  function recordProbe"),
  grab("  const arr = (x)", "  // ---- Rendering ----"),
  grab("  // ---- Stage 2: attempt", "  // ---- Follow-up"),
].join("\n");
const page = new Function("ctx", `let run = ctx.run; const THIN = 400; let fatal = null; let hiddenMs = 0; const HIDDEN_MAX_MS = 600000; const log = () => {};
  const browse = (...a) => ctx.browse(...a);
  const recordProbe = (p) => { const probe = { ...p, id: "p" + (run.probes.length + 1) }; run.probes.push(probe); return probe; };
  ${src}
  return { normalize, ground, attemptTargets, attemptOne, runAttempts, placeRequirements };`);

// The page's visibility wait, with a fake document.
const visibility = () => { const code = grab("  // ---- The browser works only while this page is in view", "  async function openSiteTab");
  return (ctx) => new Function("ctx", `const document = ctx.doc; const $ = () => ({ hidden: true }); const log = () => {};
    ${code.replace(/const HIDDEN_MAX_MS = [^;]+;/, "const HIDDEN_MAX_MS = ctx.maxMs;")}
    return { whenVisible };`)(ctx); };

// ---- A made-up provider ----
const prose = (s) => Array(12).fill(s).join("\n");
const REVIEW_TEXT = prose("Submit your app for review before it can be published. Review takes five business days.");
const TOKEN_TEXT = prose("Access tokens expire after one hour; use the refresh token grant to get a new one.");
const newRun = () => ({ probes: [], fetched: new Map([["docs.acme.com/review", REVIEW_TEXT], ["docs.acme.com/token", TOKEN_TEXT]]),
  quality: new Map([["docs.acme.com/review", "content"], ["docs.acme.com/token", "content"]]), searched: new Set(), pageSigs: [] });
const raw = (o = {}) => ({
  app: { name: "Acme", slug: "acme", website: "https://acme.com", developerPortal: "https://acme.com/developers/apps" },
  access: { oauthForThirdParties: "yes", registration: "manual", reason: "" },
  oauth: { authorizeUrl: "https://acme.com/oauth/authorize", tokenUrl: "https://api.acme.com/oauth/token", evidence: ["e2"] },
  verdict: { tier: "self_serve", summary: "", confidence: "high" },
  time: { devReady: { effort: { min: 0.5, max: 1 }, wait: "none", label: "", evidence: ["e1"] },
          production: { effort: { min: 1, max: 2 }, wait: "none", label: "", evidence: ["e1"] } },
  requirements: [], scopes: [{ scope: "read", sensitivity: "standard", evidence: ["e2"] }],
  steps: [
    { id: "s1", phase: "register", title: "Create the app", owner: "you", where: { label: "Acme → Developers → Apps", url: "https://acme.com/developers/apps", kind: "action" }, values: [], scopes: [], evidence: ["e3"] },
    { id: "s2", phase: "configure", title: "Read the scopes guide", owner: "agent", where: { label: "Scopes guide", url: "https://docs.acme.com/scopes", kind: "docs" }, values: [], scopes: ["read"], evidence: ["e3"] },
    { id: "s3", phase: "test", title: "Call the user endpoint", owner: "agent", where: { label: "Users API", url: "https://api.acme.com/v1/me", kind: "action" }, values: [], scopes: [], evidence: ["e3"] },
  ],
  blockers: [], uncertainties: [],
  mandatoryPages: { review: { url: "https://docs.acme.com/review", status: "read", evidence: ["e1"] }, token: { url: "https://docs.acme.com/token", status: "read", evidence: ["e2"] } },
  evidence: [
    { id: "e1", claim: "Review takes five business days", status: "sourced", sourceUrl: "https://docs.acme.com/review", quote: "Review takes five business days." },
    { id: "e2", claim: "Tokens expire after one hour", status: "sourced", sourceUrl: "https://docs.acme.com/token", quote: "Access tokens expire after one hour" },
    { id: "e3", claim: "Apps are created in the developer portal", status: "inferred" },
  ], ...o,
});
const DCR_ELSEWHERE = { kind: "oauth_discovery", outcome: "positive", target: "mcp.acme.com",
  data: { issuer: "https://mcp.acme.com", authorization_endpoint: "https://mcp.acme.com/authorize", token_endpoint: "https://mcp.acme.com/token", registration_endpoint: "https://mcp.acme.com/register" } };
const DCR_HERE = { kind: "oauth_discovery", outcome: "positive", target: "acme.com",
  data: { issuer: "https://acme.com", authorization_endpoint: "https://acme.com/oauth/authorize", token_endpoint: "https://api.acme.com/oauth/token", registration_endpoint: "https://acme.com/oauth/register" } };

// Fake browser: address → page
const SITE = {
  "https://acme.com/developers/apps": { title: "Sign in to Acme", body: "Sign in\nEmail address\nPassword\nLog in" },
  "https://docs.acme.com/scopes": { title: "Scopes guide | Acme Docs", body: prose("The scopes guide lists every scope an app can request.") + "\nSign up for our newsletter\nEnter your email" },
  "https://docs.acme.com/review": { title: "App review | Acme Docs", body: REVIEW_TEXT + "\nFill in the application form to request production access." },
  "https://api.acme.com/v1/me": { title: "", body: '{"error":"unauthorized"}' },
};
const browser = (overrides = {}) => async (url) => {
  const u = new URL(url), key = u.origin + u.pathname;
  if (key === "https://acme.com/oauth/authorize") return { url, title: "Acme", body: overrides.authorize ?? "error=invalid_client: the client is not registered" };
  if (key === "https://api.acme.com/oauth/token") return { url, title: "", body: '{"error":"invalid_request"}' };
  if (u.host === "mcp.acme.com") return { url, title: "", body: '{"error":"invalid_scope"}' };
  return { url, ...(overrides[key] ?? SITE[key] ?? { title: "Not found", body: "404 page not found" }) };
};

async function setup(o, probes = [], over = {}) {
  const run = newRun(); run.probes = probes.map((p, i) => ({ ...p, id: "p" + (i + 1) }));
  const P = page({ run, browse: browser(over) });
  const g = P.normalize(raw(o));
  const res = P.ground(g);
  return { P, g, res, run };
}

const cases = {
  // ---- Endpoints: only the documented OAuth server can judge the guide ----
  "another OAuth server doesn't contradict manual registration": async () => {
    const { g, res } = await setup({}, [DCR_ELSEWHERE]);
    return [!res.notes.some((n) => /registration endpoint/.test(n) && /says registration is/.test(n)), g.verdict.confidence !== "low", res.notes.join(" | ")];
  },
  "the documented server's registration endpoint does contradict manual registration": async () => {
    const { res } = await setup({}, [DCR_HERE]);
    return [res.notes.some((n) => /registration endpoint/.test(n)), res.notes.join(" | ")];
  },
  "Instant backed only by another server is unconfirmed": async () => {
    const { g } = await setup({ verdict: { tier: "instant", confidence: "high" }, access: { oauthForThirdParties: "yes", registration: "dynamic" } }, [DCR_ELSEWHERE]);
    return [g.verdict.unconfirmed === true && g.verdict.confidence === "low", JSON.stringify(g.verdict)];
  },
  "Instant backed by the documented server stays": async () => {
    const { g } = await setup({ verdict: { tier: "instant", confidence: "high" }, access: { oauthForThirdParties: "yes", registration: "dynamic" } }, [DCR_HERE]);
    return [g.verdict.unconfirmed === false, JSON.stringify(g.verdict)];
  },
  "stage 2 tests only the documented endpoints": async () => {
    const { P, g } = await setup({}, [DCR_ELSEWHERE]);
    const t = P.attemptTargets(g).filter((x) => ["authorize", "token"].includes(x.kind));
    const hosts = t.map((x) => new URL(x.url).host);
    return [hosts.length === 2 && hosts.includes("acme.com") && hosts.includes("api.acme.com") && !hosts.includes("mcp.acme.com"), hosts.join(", ")];
  },
  "no documented endpoint: stage 2 says so instead of borrowing one": async () => {
    const { P, g } = await setup({ oauth: { authorizeUrl: null, tokenUrl: null, evidence: [] } }, [DCR_ELSEWHERE]);
    const rows = await P.runAttempts(g);
    const t = rows.filter((r) => /authorize|token/i.test(r.claim));
    return [t.length >= 1 && t.every((r) => r.status === "Unverified" && !/mcp\.acme\.com/.test(r.claim + r.result)), t.map((r) => r.claim + " → " + r.result).join(" | ")];
  },
  "an API endpoint is never checked as a page": async () => {
    const { P, g } = await setup({}, []);
    const rows = await P.runAttempts(g);
    const api = rows.filter((r) => /api\.acme\.com\/v1/.test(r.claim));
    return [api.every((r) => r.status !== "Confirmed"), api.map((r) => r.status + ": " + r.result).join(" | ") || "skipped"];
  },
  // ---- Confidence ----
  "a gated tier with nothing sourced behind it is low": async () => {
    const o = raw(); o.time.production.evidence = []; o.time.production.wait = "unknown"; o.mandatoryPages.review.evidence = [];
    const { g } = await setup({ time: o.time, mandatoryPages: o.mandatoryPages, verdict: { tier: "review_gated", confidence: "high" } });
    return [g.verdict.confidence === "low", g.verdict.confidence];
  },
  "high confidence needs the token page read": async () => {
    const o = raw(); o.mandatoryPages.token = { url: null, status: "not_found", evidence: [] };
    o.evidence = o.evidence.map((e) => (e.id === "e3" ? { ...e, status: "sourced", sourceUrl: "https://docs.acme.com/review", quote: "Submit your app for review" } : e));
    const { g } = await setup({ mandatoryPages: o.mandatoryPages, evidence: o.evidence, verdict: { tier: "review_gated", confidence: "high" } });
    return [g.verdict.confidence === "medium", g.verdict.confidence];
  },
  "a backed guide with both pages read stays high": async () => {
    const o = raw(); o.evidence = o.evidence.map((e) => (e.id === "e3" ? { ...e, status: "sourced", sourceUrl: "https://docs.acme.com/review", quote: "Submit your app for review" } : e));
    o.time.production.wait = { min: 5, max: 5 };
    const { g } = await setup({ evidence: o.evidence, time: o.time, verdict: { tier: "review_gated", confidence: "high" } });
    return [g.verdict.confidence === "high", g.verdict.confidence];
  },
  // ---- Wait: a field, never read from wording ----
  "wait 'none' on a gated tier becomes unknown": async () => {
    const { g, res } = await setup({ verdict: { tier: "review_gated", confidence: "medium" } });
    return [g.time.production.waitKind === "unknown", g.time.production.waitKind + " | " + res.notes.join(" | ")];
  },
  "wait 'none' without sourced or tested evidence becomes unknown": async () => {
    const o = raw(); o.time.devReady.evidence = ["e3"];
    const { g } = await setup({ time: o.time });
    return [g.time.devReady.waitKind === "unknown", g.time.devReady.waitKind];
  },
  "the label's wording never changes the wait": async () => {
    const o = raw(); o.time.devReady.label = "Acme publishes no review time, so the wait can't be estimated and is unknown.";
    const { g } = await setup({ time: o.time });
    return [g.time.devReady.waitKind === "none", g.time.devReady.waitKind];
  },
  "a wait range and an explicit unknown are kept": async () => {
    const o = raw(); o.time.production.wait = { min: 5, max: 10 }; o.time.devReady.wait = "unknown";
    const { g } = await setup({ time: o.time, verdict: { tier: "review_gated", confidence: "medium" } });
    return [g.time.production.waitKind === "range" && g.time.production.wait.max === 10 && g.time.devReady.waitKind === "unknown", g.time.production.waitKind + " / " + g.time.devReady.waitKind];
  },
  "0 days is 'none', never a silent unknown": async () => {
    const o = raw(); o.time.devReady.wait = { min: 0, max: 0 };
    const { g } = await setup({ time: o.time });
    return [g.time.devReady.waitKind === "none", g.time.devReady.waitKind];
  },
  // ---- Stage 2: one comparison table ----
  "words on the review page never add a blocker or lower confidence": async () => {
    const { P, g } = await setup({ verdict: { tier: "review_gated", confidence: "medium" } });
    const before = g.verdict.confidence;
    await P.runAttempts(g);
    return [g.blockers.length === 0 && g.verdict.confidence === before, `${g.blockers.length} blockers, ${before} → ${g.verdict.confidence}`];
  },
  "a newsletter sign-up box doesn't make a docs page a sign-up form": async () => {
    const { P, g } = await setup({});
    const rows = await P.runAttempts(g);
    const r = rows.find((x) => /docs\.acme\.com\/scopes/.test(x.claim));
    return [r && !/sign-up/i.test(r.result) && !r.signUp, r ? r.status + ": " + r.result : "not tried"];
  },
  "a sign-in page matches an action link, not a docs link": async () => {
    const { P, g } = await setup({}, [], { "https://docs.acme.com/scopes": { title: "Sign in to Acme", body: "Sign in\nEmail address\nPassword" } });
    const rows = await P.runAttempts(g);
    const portal = rows.find((x) => /developers\/apps/.test(x.claim)), docs = rows.find((x) => /docs\.acme\.com\/scopes/.test(x.claim));
    return [portal?.status === "Confirmed" && docs?.status !== "Confirmed", `portal ${portal?.status}, docs ${docs?.status}: ${docs?.result}`];
  },
  "a sign-in in front of an ordinary step link can't confirm it, but still marks where you take over": async () => {
    const o = raw(); o.steps.push({ id: "s4", phase: "configure", stage: "dev", title: "Approve the app", owner: "you", where: { label: "Admin console", url: "https://acme.com/admin/apps/123", kind: "action" }, values: [], scopes: [], evidence: ["e3"] });
    const { P, g } = await setup({ steps: o.steps }, [], { "https://acme.com/admin/apps/123": { url: "https://acme.com/login", title: "Sign in to Acme", body: "Sign in\nEmail address\nPassword" } });
    const rows = await P.runAttempts(g);
    const r = rows.find((x) => /admin\/apps/.test(x.claim));
    return [r?.status === "Unverified" && r.signIn === true, r?.status + " signIn=" + r?.signIn + ": " + r?.result];
  },
  "gate wording on the registration page still adds a blocker": async () => {
    const { P, g } = await setup({}, [], { "https://acme.com/developers/apps": { title: "Developer access", body: prose("To build an integration, contact our sales to request API access for your company.") } });
    await P.runAttempts(g);
    return [g.blockers.length === 1, g.blockers.map((b) => b.title).join(" | ")];
  },
  "a scope error adds a question but doesn't lower confidence": async () => {
    const { P, g } = await setup({ verdict: { tier: "self_serve", confidence: "medium" } }, [], { authorize: "error=invalid_scope" });
    await P.runAttempts(g);
    return [g.verdict.confidence === "medium" && g.uncertainties.some((u) => /scope/i.test(u.text)), g.verdict.confidence];
  },
  "edits stay on the step that was checked": async () => {
    const { P, g } = await setup({});
    const before = Object.fromEntries(g.steps.map((s) => [s.id, [...s.evidence]]));
    const rows = await P.runAttempts(g);
    const bad = g.steps.filter((s) => s.evidence.some((id) => !before[s.id].includes(id) && !rows.some((r) => r.stepId === s.id)));
    return [bad.length === 0, bad.map((s) => s.id).join(", ") || "ok"];
  },
  "a docs address is a docs link, whatever kind the agent gave it": async () => {
    const o = raw(); o.steps[1].where.kind = "action";
    const { g } = await setup({ steps: o.steps });
    return [g.steps[1].where.kind === "docs", g.steps[1].where.kind];
  },
  "sign-up and password wording on a docs page is not a sign-up form": async () => {
    const o = raw(); o.steps[1].where.kind = "action";
    const { P, g } = await setup({ steps: o.steps }, [], { "https://docs.acme.com/scopes": { title: "OAuth | Acme Docs",
      body: prose("Users sign up with their email and password, then approve the scopes your app asks for.") } });
    const rows = await P.runAttempts(g);
    const r = rows.find((x) => /docs\.acme\.com\/scopes/.test(x.claim));
    return [r && !/sign-up/i.test(r.result) && !r.signUp, r ? r.status + ": " + r.result : "not tried"];
  },
  "field names listed on a docs page don't make it a form": async () => {
    const { P, g } = await setup({ verdict: { tier: "review_gated", confidence: "medium" } }, [], { "https://docs.acme.com/review": { title: "App review | Acme Docs",
      body: REVIEW_TEXT + "\nApp name\nDescription\nRedirect URI\nLogo" } });
    const rows = await P.runAttempts(g);
    const r = rows.find((x) => /^Review page/.test(x.claim));
    return [r?.status === "Confirmed", r?.status + ": " + r?.result];
  },
  "a docs link that redirects to a sign-in address is still a sign-in": async () => {
    const { P, g } = await setup({}, [], { "https://docs.acme.com/scopes": { url: "https://docs.acme.com/login", title: "Sign in", body: "Sign in\nEmail address\nPassword" } });
    const rows = await P.runAttempts(g);
    const r = rows.find((x) => /docs\.acme\.com\/scopes/.test(x.claim));
    return [r?.status === "Unverified" && /sign-in/i.test(r.result), r?.status + ": " + r?.result];
  },
  // ---- A hidden page pauses the run; it never turns into "Couldn't check" rows ----
  "stage 2 stops cleanly, with a note, when the page stays hidden": async () => {
    const run = newRun(); let calls = 0;
    const P = page({ run, browse: async (url) => { if (++calls >= 2) throw Object.assign(new Error("the page stayed hidden"), { code: "page_hidden" }); return browser()(url); } });
    const g = P.normalize(raw()); P.ground(g);
    const rows = await P.runAttempts(g);
    const opened = rows.filter((r) => !r.stop);
    return [opened.length === 1 && !rows.some((r) => /Couldn't open/.test(r.result)) && /hidden/.test(g.attemptNote ?? ""), `${opened.length} rows; note: ${g.attemptNote}`];
  },
  "a browser call waits while the page is hidden and goes on when it's shown": async () => {
    const W = visibility();
    let state = "hidden", fire = null, done = false;
    const doc = { get visibilityState() { return state; }, addEventListener: (_, f) => { fire = f; }, removeEventListener: () => {} };
    const p = W({ doc, maxMs: 5000 }).whenVisible().then(() => { done = true; });
    await new Promise((r) => setTimeout(r, 20));
    const waited = !done;
    state = "visible"; fire();
    await p;
    return [waited && done, `waited ${waited}, resumed ${done}`];
  },
  "a page hidden for too long fails with page_hidden, not a page error": async () => {
    const W = visibility();
    const doc = { visibilityState: "hidden", addEventListener: () => {}, removeEventListener: () => {} };
    const code = await W({ doc, maxMs: 30 }).whenVisible().then(() => "resolved", (e) => e.code);
    return [code === "page_hidden", code];
  },
  // ---- Timings: rubric hours, waits only from provider steps with stated or observed times ----
  "clocks are computed from the step types": async () => {
    const o = raw(); o.steps = [
      { ...o.steps[0], type: "register_form", stage: "dev" },
      { ...o.steps[1], type: "token_flow", stage: "dev" },
      { ...o.steps[2], type: "test", stage: "dev" }];
    const { g } = await setup({ steps: o.steps });
    const d = g.time.devReady;
    return [d.computed && d.effort.min === 1.75 && d.effort.max === 4.5 && d.waitKind === "none" && g.time.production.effort.max === 4.5, JSON.stringify(d.effort) + " " + d.waitKind];
  },
  "an adjustment without sourced or tested evidence is ignored": async () => {
    const o = raw(); o.steps = [{ ...o.steps[0], type: "token_flow", stage: "dev", adjust: { factor: 2, reason: "complex", evidence: ["e3"] } }];
    const { g, res } = await setup({ steps: o.steps });
    return [g.time.devReady.effort.max === 3 && res.notes.some((n) => /adjustment/.test(n)), g.time.devReady.effort.max + " | " + res.notes.join(" | ")];
  },
  "a backed adjustment scales the rubric": async () => {
    const o = raw(); o.steps = [{ ...o.steps[0], type: "token_flow", stage: "dev", adjust: { factor: 1.5, reason: "demo video needed", evidence: ["e1"] } }];
    const { g } = await setup({ steps: o.steps });
    return [g.time.devReady.effort.max === 4.5, String(g.time.devReady.effort.max)];
  },
  "a provider step with a sourced wait gives a provider-stated range": async () => {
    const o = raw(); o.steps = [{ ...o.steps[0], type: "submit", stage: "production" }, { id: "s9", phase: "review", stage: "production", title: "Provider reviews", owner: "provider", type: "provider", wait: { min: 5, max: 10 }, evidence: ["e1"], values: [], scopes: [] }];
    const { g } = await setup({ steps: o.steps, verdict: { tier: "review_gated", confidence: "medium" } });
    const p = g.time.production, line = g.time.breakdown.find((b) => b.step === "2");
    return [p.waitKind === "range" && p.wait.max === 10 && line.waitSource === "provider-stated", p.waitKind + " " + JSON.stringify(p.wait) + " " + line?.waitSource];
  },
  "a provider step without a backed wait makes the wait unknown": async () => {
    const o = raw(); o.steps = [{ id: "s9", phase: "review", stage: "production", title: "Provider reviews", owner: "provider", type: "provider", wait: { min: 1, max: 2 }, evidence: ["e3"], values: [], scopes: [] }];
    const { g } = await setup({ steps: o.steps, verdict: { tier: "review_gated", confidence: "medium" } });
    return [g.time.production.waitKind === "unknown", g.time.production.waitKind];
  },
  "review-gated with no provider step: the real-users wait is unknown": async () => {
    const o = raw(); o.steps = [{ ...o.steps[0], type: "register_form", stage: "dev" }];
    const { g } = await setup({ steps: o.steps, verdict: { tier: "review_gated", confidence: "medium" } });
    return [g.time.production.waitKind === "unknown" && g.time.devReady.waitKind === "none", g.time.devReady.waitKind + " / " + g.time.production.waitKind];
  },
  // ---- Requirements: prerequisites are step 0; technical rules sit on their step ----
  "a prerequisite goes to step 0 and a technical rule to its step": async () => {
    const { P, g } = await setup({ requirements: [
      { label: "Admin role", detail: "Only admins can create apps", kind: "prerequisite", evidence: [] },
      { label: "PKCE with S256", detail: "Required on authorize", kind: "technical", stepId: "s2", evidence: [] }] });
    const { prereqs, rules } = P.placeRequirements(g);
    return [prereqs.map((r) => r.label).join() === "Admin role" && rules.get("s2")?.[0]?.label === "PKCE with S256", JSON.stringify([prereqs.map((r) => r.label), [...rules.keys()]])];
  },
  "a technical rule without a valid step goes on the test step": async () => {
    const { P, g } = await setup({ requirements: [{ label: "HTTPS redirect URIs", detail: "", kind: "technical", stepId: "s99", evidence: [] }] });
    const { prereqs, rules } = P.placeRequirements(g);
    return [!prereqs.length && rules.get("s3")?.length === 1, JSON.stringify([prereqs.length, [...rules.keys()]])];
  },
  "a prerequisite a step gets for you stays off step 0": async () => {
    const { P, g } = await setup({ requirements: [
      { label: "Acme developer account", detail: "", kind: "prerequisite", stepId: "s1", evidence: [] },
      { label: "Admin role", detail: "", kind: "prerequisite", evidence: [] }] });
    const { prereqs } = P.placeRequirements(g);
    return [prereqs.map((r) => r.label).join() === "Admin role", prereqs.map((r) => r.label).join()];
  },
  "an OAuth tier without a yes to OAuth for third parties shows OAuth unconfirmed": async () => {
    const { g, res } = await setup({ access: { oauthForThirdParties: "unknown", registration: "none" }, verdict: { tier: "self_serve", confidence: "medium" } });
    return [g.verdict.unconfirmed === true && g.verdict.confidence === "low", JSON.stringify(g.verdict) + " | " + res.notes.filter((n) => /unconfirmed/.test(n)).join(" ")];
  },
  "a requirement saved without a kind stays a prerequisite": async () => {
    const { P, g } = await setup({ requirements: [{ label: "Paid plan", detail: "", evidence: [] }] });
    const { prereqs } = P.placeRequirements(g);
    return [prereqs.length === 1 && g.requirements[0].kind === "prerequisite", g.requirements[0].kind];
  },
  "anything the table doesn't list is 'Couldn't check'": async () => {
    const { P, g } = await setup({}, [], { "https://docs.acme.com/scopes": { title: "Pricing", body: prose("Upgrade your plan to unlock more seats for your whole team today.") } });
    const rows = await P.runAttempts(g);
    const r = rows.find((x) => /docs\.acme\.com\/scopes/.test(x.claim));
    return [r?.status === "Unverified" && g.blockers.length === 0, r?.status + ": " + r?.result];
  },
};

let failed = 0;
for (const [name, fn] of Object.entries(cases)) {
  let ok, info;
  try { const out = await fn(); ok = out.slice(0, -1).every(Boolean); info = out.at(-1); }
  catch (e) { ok = false; info = "threw: " + (e?.message || e); }
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : "\n      " + info}`);
}
if (failed) { console.error(`\n${failed} of ${Object.keys(cases).length} failed`); process.exit(1); }
console.log(`\nall ${Object.keys(cases).length} passed`);
