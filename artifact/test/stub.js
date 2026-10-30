// Stand-ins for Claude, the app browser (one tab per site, with redirects) and the page database.
window.__errs = [];
addEventListener("error", (e) => __errs.push(String(e.message)));
addEventListener("unhandledrejection", (e) => __errs.push("rej: " + (e.reason?.stack || e.reason?.message || e.reason?.code || e.reason)));
const page = (title, url, body) => `Title: ${title}\nURL: ${url}\nSource element: <main>\n---\n${body}\n\nTab Context:\n- Executed on tabId: x`;
const tabs = new Map(); let n = 0;
const origin = (u) => new URL(u).origin;
// Where each address lands, and what it shows.
const REDIRECT = {
  "https://dev.example.com/apps/new": "https://dev.example.com/login?return_to=/apps/new",
  "https://docs.example.com/moved": "https://docs.example.com/new-location",
};
const PAGES = [
  [/duckduckgo/, "Search", "Past Year\nDocs - Example\n docs.example.com/oauth\nRegister apps."],
  [/oauth-authorization-server/, "json", '{"issuer":"https://auth.example.com","authorization_endpoint":"https://auth.example.com/authorize","token_endpoint":"https://auth.example.com/token"}'],
  [/well-known/, "404", "Not found"],
  [/^https:\/\/docs\.example\.com\/oauth\.md$/, "OAuth", "# OAuth. " + "Register your app in the developer portal. Reviews take two weeks. ".repeat(10)],
  [/^https:\/\/docs\.example\.com\/oauth$/, "OAuth | Example", "Example Docs. For machine-readable documentation use /llms.txt"],
  [/^https:\/\/docs\.example\.com\/old-page/, "Page not found", "Sorry, this page doesn't exist."],
  [/^https:\/\/docs\.example\.com\/new-location/, "Scopes | Example", "Scopes reference for apps."],
  [/^https:\/\/dev\.example\.com\/login/, "Sign in", "Sign in to Example. Email address. Password. Forgot password?"],
  [/^https:\/\/dashboard\.example\.com/, "Settings — Jane's workspace", "Settings for Jane Doe. Billing. Sign out"],
  [/^https:\/\/auth\.example\.com\/authorize/, "Error", "error: invalid_client. The client_id is unknown."],
  [/^https:\/\/auth\.example\.com\/token/, "token", '{"error":"invalid_request","error_description":"Method not allowed"}'],
];
const fakeMcp = {
  async callTool(server, tool, input) {
    if (tool === "preview_start") { const id = "tab-" + ++n; tabs.set(id, { site: origin(input.url), url: REDIRECT[input.url] ?? input.url }); return { content: [{ type: "text", text: `Use tabId "${id}"` }], payload: `Use tabId "${id}"` }; }
    const t = tabs.get(input.tabId);
    if (!t) throw { code: "tool_error", message: "The Artifact can't navigate that tab" };
    if (tool === "navigate") { if (origin(input.url) !== t.site) throw { code: "tool_error", message: "The Artifact can't navigate that tab" }; t.url = REDIRECT[input.url] ?? input.url; return { content: [{ type: "text", text: "ok" }] }; }
    const hit = PAGES.find(([re]) => re.test(t.url));
    window.__visited = [...(window.__visited ?? []), t.url];
    return { content: [{ type: "text", text: page(hit ? hit[1] : "Page", t.url, hit ? hit[2] : "Hello") }] };
  },
};
const fakeSample = {
  limits: async () => ({ tools: { maxCount: 8 } }),
  async json(prompt, opts) {
    window.__prompt = prompt;
    const T = Object.fromEntries(opts.tools.map((t) => [t.name, t])); const c = { signal: opts.signal };
    await Promise.all([T.web_search.execute({ queries: ["example oauth"] }, c), T.probe_oauth_discovery.execute({ host: "auth.example.com" }, c)]);
    await T.read_pages.execute({ urls: ["https://docs.example.com/oauth"] }, c);
    opts.onText({ text: "done", delta: "done" });
    return {
      app: { name: "Example", slug: "example", developerPortal: "https://dev.example.com/apps/new" },
      access: { oauthForThirdParties: "yes", registration: "manual", reason: "You register an app in the developer portal.", alternative: null },
      oauth: { authorizeUrl: "https://auth.example.com/authorize", tokenUrl: "https://auth.example.com/token", evidence: ["e1"] },
      verdict: { tier: "review_gated", summary: "Review takes two weeks.", points: [{ text: "Anyone can register an app in the portal", why: "The OAuth page says to register your app in the developer portal; no approval is needed to start.", evidence: ["e1"] }, { text: "Real users need an approved app: review takes about two weeks", why: "Reviews take two weeks according to the review page.", evidence: ["e1"] }, { text: "Tokens expire after an hour; refresh tokens are issued", why: null, evidence: [] }], confidence: "high" },
      time: { devReady: { effort: { min: 1, max: 2 }, wait: "none", label: "", evidence: ["e1"] }, production: { effort: { min: 2, max: 4 }, wait: { min: 14, max: 14 }, label: "", evidence: ["e1"] } },
      requirements: [{ label: "Company account", detail: "Apps can only be created from a company workspace", kind: "prerequisite", evidence: ["e1"] }, { label: "PKCE with S256", detail: "The authorize request must send a code challenge", kind: "technical", stepId: "s2", evidence: ["e1"] }], scopes: [{ scope: "read:user", sensitivity: "standard", note: null, evidence: ["e1"] }],
      steps: [
        { id: "s1", type: "register_form", phase: "register", stage: "dev", title: "Register the app", owner: "agent", points: ["Create a new app in the developer portal", "Use your app's OAuth callback URL as the redirect URI"], where: { label: "Developer portal", url: "https://dev.example.com/apps/new" }, values: [{ label: "Redirect URI", value: "your app's OAuth callback URL" }], evidence: ["e1"] },
        { id: "s2", type: "configure", phase: "configure", stage: "dev", title: "Pick scopes", owner: "agent", points: ["Request only read:user to start", "Add write scopes later; they need review"], where: { label: "Scopes doc", url: "https://docs.example.com/moved", kind: "docs" }, scopes: ["read:user"], evidence: ["e1"] },
        { id: "s3", type: "other", phase: "configure", stage: "dev", title: "Read the old guide", owner: "agent", detail: "Old.", where: { label: "Old page", url: "https://docs.example.com/old-page", kind: "docs" }, evidence: ["e1"] },
        { id: "s4", type: "configure", phase: "configure", stage: "dev", title: "Check settings", owner: "agent_ok", detail: "Settings.", where: { label: "Settings", url: "https://dashboard.example.com/settings", kind: "action" }, evidence: ["e1"] },
        { id: "s5", type: "submit", phase: "review", title: "Submit for review", owner: "you", detail: "Demo.", evidence: ["e1"] },
      ],
      blockers: [], uncertainties: [],
      mandatoryPages: { review: { url: "https://docs.example.com/oauth", status: "read" }, token: { url: "https://docs.example.com/oauth", status: "read" } },
      evidence: [{ id: "e1", claim: "Review two weeks", status: "sourced", sourceUrl: "https://docs.example.com/oauth", quote: "Reviews take two weeks" }, { id: "e2", claim: "Discovery live", status: "tested", probeId: "p1" }],
    };
  },
};
// Page database: collections of documents, live onSnapshot, ordered queries, get/set.
const store = { guides: new Map([["example", { handsOn: [{ date: "2026-10-29", who: "Yash", step: "Register the app", result: "Registered in 4 minutes", tookMinutes: 4, agentGotTo: "the sign-in page" }] }]]), validation: new Map() };
const subs = [];
const snap = (name, field, dir) => { const docs = [...store[name]].filter(([, d]) => d.guide || name !== "guides").map(([id, d]) => ({ id, exists: true, data: () => d })); if (field) docs.sort((a, b) => (String(a.data()[field]) < String(b.data()[field]) ? -1 : 1) * (dir === "desc" ? -1 : 1)); return { docs, size: docs.length, empty: !docs.length }; };
const query = (name, field, dir) => ({
  orderBy: (f, d) => query(name, f, d), limit: () => query(name, field, dir),
  onSnapshot(next) { subs.push(() => next(snap(name, field, dir))); setTimeout(() => next(snap(name, field, dir)), 0); return () => {}; },
  doc: (id) => ({
    async get() { const d = store[name].get(id); return { exists: !!d, data: () => d }; },
    async set(d) { window.__savedDoc = d; store[name].set(id, d); subs.forEach((f) => f()); },
  }),
});
const fakeDb = { collection: (name) => query(name) };
window.claude = { use: async (k) => ({ sample: fakeSample, mcp: fakeMcp, db: fakeDb, downloads: { save: async (r) => { window.__saved = r; return { status: "saved" }; } } }[k] ?? null) };
