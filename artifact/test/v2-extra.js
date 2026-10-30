// v2 test cases: navigation-only pages, identical twins, a docs page posing as the registration form,
// bot-checked searches, and the follow-up round.
const NAV = ["Home", "Docs", "API reference", "Guides", "Changelog", "Support", "Status", "Pricing", "Sign in", "Get started"].join("\n").repeat(18) + "\n© 2026 Example Inc. All rights reserved.";
const PROSE = "Scopes control what your app can read. Each scope is shown to the user on the consent screen before they approve. ".repeat(12);
PAGES.unshift(
  [/duckduckgo.*botcheck/, "DuckDuckGo", "Unfortunately, bots use DuckDuckGo too. Please complete the following challenge to confirm this search was made by a human. anomaly"],
  [/^https:\/\/docs\.example\.com\/(review|token)/, "Example Docs", NAV],
  [/^https:\/\/docs\.example\.com\/scopes-(a|b)/, "Scopes | Example", PROSE],
  [/^https:\/\/docs\.example\.com\/register-app/, "Registering your app | Example Docs", "Registering your app\nApp name\nRedirect URI\nClient ID\nFill in the app name and the redirect URI, then copy the client ID that the portal shows you after you save."],
  [/^https:\/\/help\.example\.com\/articles\/app-review/, "App review | Example Help", "Submitting your app for review. App reviews take 10 business days. You need a privacy policy and a demo video before you submit. ".repeat(8)],
);
const firstSample = fakeSample.json;
fakeSample.json = async (prompt, opts) => {
  if (!prompt.includes("An automatic check")) {
    const T = Object.fromEntries(opts.tools.map((t) => [t.name, t])); const c = { signal: opts.signal };
    await T.web_search.execute({ queries: ["botcheck one", "botcheck two"] }, c);
    await T.read_pages.execute({ urls: ["https://docs.example.com/review", "https://docs.example.com/token", "https://docs.example.com/scopes-a", "https://docs.example.com/scopes-b"] }, c);
    const g = await firstSample(prompt, opts);
    g.steps[0].where.url = "https://docs.example.com/register-app";
    g.steps[2].evidence = ["e2"];
    g.steps[3] = { id: "s4", type: "configure", phase: "configure", stage: "dev", title: "Open the portal", owner: "agent", detail: "Portal.", where: { label: "Developer portal apps", url: "https://dev.example.com/apps/new" }, evidence: ["e3"] };
    g.mandatoryPages = { review: { url: "https://docs.example.com/review", status: "read" }, token: { url: "https://docs.example.com/token", status: "read" } };
    g.evidence = [{ id: "e1", claim: "Review two weeks", status: "sourced", sourceUrl: "https://docs.example.com/review", quote: "Home" }, g.evidence[1],
      { id: "e3", claim: "Portal page", status: "inferred" },
      { id: "e4", claim: "Scopes shown on consent", status: "sourced", sourceUrl: "https://docs.example.com/scopes-b", quote: "Each scope is shown to the user on the consent screen" }];
    return g;
  }
  window.__fuPrompt = prompt;
  const T = Object.fromEntries(opts.tools.map((t) => [t.name, t])); const c = { signal: opts.signal };
  window.__fuTools = Object.keys(T);
  window.__fuSearch = await T.web_search.execute({ queries: ["example app review help", "example token lifetime", "third query over budget"] }, c);
  window.__fuRead = await T.read_pages.execute({ urls: ["https://help.example.com/articles/app-review", "https://docs.example.com/review", "https://docs.example.com/token-two", "https://docs.example.com/scopes-c", "https://docs.example.com/over-budget"] }, c);
  const g = JSON.parse(prompt.slice(prompt.indexOf("The guide:\n") + 11));
  g.mandatoryPages.review = { url: "https://help.example.com/articles/app-review", status: "read", note: null, evidence: ["e5"] };
  g.evidence.push({ id: "e5", claim: "Review takes 10 business days", status: "sourced", sourceUrl: "https://help.example.com/articles/app-review", quote: "App reviews take 10 business days" });
  g.time.production.evidence = ["e5"];
  return g;
};
store.validation.set("github", { app: "GitHub", rows: [{ claim: "Review", verdict: "confirmed" }, { claim: "Scopes", verdict: "corrected" }] });
// The authorize page renders late: empty on the first read, DocuSign-style wording on the next.
PAGES.unshift([/^https:\/\/auth\.example\.com\/authorize/, "Error", "The client id is not registered with Example."]);
const firstCall = fakeMcp.callTool.bind(fakeMcp);
const seenSlow = new Set();
fakeMcp.callTool = async (server, tool, input) => {
  const r = await firstCall(server, tool, input);
  const text = r.content?.[0]?.text ?? "";
  if (tool === "get_page_text" && /URL: https:\/\/auth\.example\.com\/authorize/.test(text) && !seenSlow.has(input.tabId)) {
    seenSlow.add(input.tabId); window.__slowFirst = (window.__slowFirst ?? 0) + 1;
    return { content: [{ type: "text", text: text.replace(/---\n[\s\S]*?\n\nTab Context/, "---\n\n\nTab Context") }] };
  }
  return r;
};
