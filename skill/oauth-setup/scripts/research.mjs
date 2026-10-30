// Researches an app the library doesn't have, with the page's own pipeline: Claude (you) does the thinking, these
// commands run the page's tools and checks and keep the run's state between calls.
//   node research.mjs start "<app or website>"            prints the research brief; creates .oauth-setup/research/<slug>/
//   node research.mjs tool <slug> <tool> '<json input>'   web_search | read_pages | probe_oauth_discovery | probe_authorize_endpoint
//   node research.mjs check <slug> <draft.json>           claim check; lists problems that call for the follow-up round
//   node research.mjs followup <slug>                     prints the follow-up brief and opens its small tool budget
//   node research.mjs check <slug> <draft2.json> --followup
//   node research.mjs attempt <slug>                      stage 2, a final check, then saves .oauth-setup/guides/<slug>.json
// Tool input can also be given as @file.json.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { loadPage, dirs, readJson, writeJson, libraryDoc, fail } from "./core.mjs";

const p = await loadPage();
const [cmd, slugArg, ...rest] = process.argv.slice(2);
const dir = (slug) => join(dirs.research, slug);
const file = (slug, name) => join(dir(slug), name);
const print = (x) => console.log(typeof x === "string" ? x : JSON.stringify(x, null, 2));

// ---- The run's state, kept between calls (Maps and Sets as arrays) ----
function saveRun(slug) {
  const r = p.run;
  writeJson(file(slug, "run.json"), { ...r, fetched: [...r.fetched], quality: [...r.quality], searched: [...r.searched],
    pageSigs: r.pageSigs.map((x) => ({ ...x, entry: r.readLog.indexOf(x.entry) })) });
}
function loadRun(slug) {
  if (!existsSync(file(slug, "run.json"))) fail(`No research run "${slug}". Start one with: node research.mjs start "<app>"`);
  const r = readJson(file(slug, "run.json"));
  p.run = { ...r, fetched: new Map(r.fetched), quality: new Map(r.quality), searched: new Set(r.searched),
    pageSigs: r.pageSigs.map((x) => ({ ...x, entry: r.readLog[x.entry] ?? {} })) };
  return readJson(file(slug, "state.json"));
}
const saveState = (slug, st) => writeJson(file(slug, "state.json"), st);
const readInput = (s) => JSON.parse(s?.startsWith("@") ? readFileSync(s.slice(1), "utf8") : s ?? "{}");

const CLI_TOOLS = (slug) => `## How you call the tools in this run
You are running inside Claude Code, not the page, so each tool is a command. Run it, and read its JSON output as the tool's result:
  node <skill-dir>/scripts/research.mjs tool ${slug} web_search '{"queries":["..."]}'
  node <skill-dir>/scripts/research.mjs tool ${slug} read_pages '{"urls":["https://..."]}'
  node <skill-dir>/scripts/research.mjs tool ${slug} probe_oauth_discovery '{"host":"auth.example.com"}'
  node <skill-dir>/scripts/research.mjs tool ${slug} probe_authorize_endpoint '{"authorize_url":"https://..."}'
Only pages read with read_pages count as sourced, and only probes run here count as tested. Your own web search or fetch tools may help you find URLs when web_search fails, but never cite them: read the page with read_pages first.
Write the JSON guide to a file and run: node <skill-dir>/scripts/research.mjs check ${slug} <file>
`;

switch (cmd) {
  case "start": {
    const query = [slugArg, ...rest].join(" ").trim();
    if (!query) fail('Usage: node research.mjs start "<app or website>"');
    const slug = p.docId(query.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\.[a-z]+(\/.*)?$/i, ""));
    p.run = p.newRun();
    saveRun(slug);
    saveState(slug, { query, slug, startedAt: new Date().toISOString(), stage: "research" });
    print(`Research run: ${slug}\n\n${CLI_TOOLS(slug)}\n${p.prompt(query)}`);
    break;
  }
  case "tool": {
    loadRun(slugArg);
    const [name, input] = rest;
    const tool = p.TOOLS.find((t) => t.name === name) ?? fail(`No tool ${name}. Tools: ${p.TOOLS.map((t) => t.name).join(", ")}`);
    let out;
    try { out = await tool.execute(readInput(input), { signal: AbortSignal.timeout(300000) }); }
    catch (e) { out = { error: e.message }; }
    saveRun(slugArg);
    print(out);
    break;
  }
  case "check": {
    const st = loadRun(slugArg);
    const draft = rest[0] ?? fail("Usage: node research.mjs check <slug> <draft.json>");
    // A guide with no pages behind it would be written from memory: refuse it, as the page does.
    if (p.run.okPages === 0) fail("No page was read in this run, so no guide is written: it would only be memory. Read the provider's docs with read_pages first.");
    const g = p.normalize(readInput("@" + draft));
    const { downgraded, notes } = p.ground(g);
    if (rest.includes("--followup")) {
      if (st.stage !== "followup") fail("No follow-up round is open. Run: node research.mjs followup " + slugArg);
      const tried = p.run.readLog.slice(st.followUpFrom).filter((x) => !x.dup).map((x) => x.url);
      const open = p.followUpProblems(g);
      for (const k of ["review", "token"]) {
        const m = g.mandatoryPages[k];
        if (m.status === "failed") p.addQuestion(g, `${p.PAGE_NAME[k]}${m.url ? " " + m.url : ""} still couldn't be read after a follow-up round that tried: ${tried.join(", ") || "no other pages"}. Claims from it need checking by hand.`);
      }
      g.followUp = { problems: st.problems, tried, open, error: null };
      st.notes = [`follow-up round for: ${st.problems.join("; ")}`, ...notes];
      st.stage = "checked-followup";
    } else {
      st.notes = notes;
      st.problems = p.followUpProblems(g);
      st.stage = "checked";
    }
    st.downgraded = downgraded;
    writeJson(file(slugArg, "guide.json"), g);
    saveState(slugArg, st); saveRun(slugArg);
    print(`Claim check: ${downgraded} claim${downgraded === 1 ? "" : "s"} downgraded.${notes.length ? "\n- " + notes.join("\n- ") : ""}`);
    if (st.stage === "checked" && st.problems.length) print(`\nProblems that call for ONE follow-up round:\n- ${st.problems.join("\n- ")}\nRun: node research.mjs followup ${slugArg}`);
    else print(`\nNext: node research.mjs attempt ${slugArg}`);
    break;
  }
  case "followup": {
    const st = loadRun(slugArg);
    if (st.stage !== "checked" || !st.problems?.length) fail(st.stage === "checked-followup" ? "The follow-up round already ran; there is only one." : "Nothing to follow up. Run check first.");
    const g = readJson(file(slugArg, "guide.json"));
    p.run.maxQueries = p.run.queries + p.FOLLOW_UP.queries;
    p.run.maxPages = p.run.pages + p.FOLLOW_UP.pages;
    Object.assign(st, { stage: "followup", followUpFrom: p.run.readLog.length });
    saveState(slugArg, st); saveRun(slugArg);
    print(`${CLI_TOOLS(slugArg).replace("check " + slugArg + " <file>", "check " + slugArg + " <file> --followup")}\n${p.followUpPrompt(st.query, g, st.problems)}`);
    break;
  }
  case "attempt": {
    const st = loadRun(slugArg);
    if (!["checked", "checked-followup"].includes(st.stage)) fail("Run check first.");
    const g = p.normalize(readJson(file(slugArg, "guide.json")));
    p.ground(g);
    let downgraded = st.downgraded, notes = st.notes;
    try {
      g.attempts = await p.runAttempts(g, AbortSignal.timeout(600000));
      const again = p.ground(g);
      downgraded += again.downgraded;
      notes = [...new Set([...notes, ...again.notes])];
    } catch (e) {
      g.attempts = [];
      g.attemptNote = "Attempt stage didn't run: " + e.message;
    }
    const meta = { at: new Date().toISOString(), downgraded, notes, query: st.query, pipelineVersion: p.PIPELINE_VERSION, runner: "oauth-setup skill" };
    const doc = libraryDoc(p, g, meta, p.run);
    writeJson(join(dirs.researched, doc.slug + ".json"), doc);
    st.stage = "saved"; saveState(slugArg, st); saveRun(slugArg);
    const n = (k) => g.attempts.filter((a) => a.status === k).length;
    print(`Stage 2: ${n("Confirmed")} match the guide, ${n("Corrected")} corrected, ${n("Unverified")} couldn't check.${g.attemptNote ? " " + g.attemptNote : ""}
Saved: ${join(dirs.researched, doc.slug + ".json")}
${doc.name}: ${doc.tierLabel} (confidence ${doc.confidence}). Walk it with: node walk.mjs brief ${doc.slug}`);
    break;
  }
  default:
    fail("Commands: start, tool, check, followup, attempt. See the top of research.mjs.");
}
