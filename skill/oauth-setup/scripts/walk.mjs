// Walks a developer through a saved guide one step at a time and remembers where they are.
//   node walk.mjs list                       guides you can walk through
//   node walk.mjs find <app or website>      the guide's slug, or "none" (exit 2)
//   node walk.mjs brief <slug>               verdict, time, top risk, what you need first, the steps at a glance
//   node walk.mjs start <slug> <dev|production> [--restart]
//   node walk.mjs next <slug>                the next step, with everything attached to it
//   node walk.mjs done|skip <slug> <step> [note]
//   node walk.mjs wait <slug> <step>         a provider step has started; the clock starts now
//   node walk.mjs status <slug>              every step and where it stands
//   node walk.mjs md <slug> [file]           the guide as shareable Markdown
//   node walk.mjs labels                     what every label means (the page's definitions)
// Progress lives in .oauth-setup/progress/<slug>.json in the current folder.
import { writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { loadPage, allGuides, findGuide, dirs, readJson, writeJson, fail } from "./core.mjs";

const p = await loadPage();
const [cmd, arg, ...rest] = process.argv.slice(2);
const DAY = 86400000;
// Local calendar dates, so "started today" reads as today wherever the developer is.
const ymd = (iso) => new Date(iso).toLocaleDateString("en-CA");
const today = () => ymd(Date.now());

function open(query) {
  const d = findGuide(query);
  if (!d) fail(`No saved guide for "${query}". Run: node walk.mjs list, or research it (see references/research.md).`);
  const g = p.normalize(d.guide);
  p.setEvidence(g);
  return { d, g };
}
const progressFile = (slug) => join(dirs.progress, slug + ".json");
const loadProgress = (slug) => (existsSync(progressFile(slug)) ? readJson(progressFile(slug)) : null);
const saveProgress = (pr) => { pr.updatedAt = new Date().toISOString(); writeJson(progressFile(pr.slug), pr); };
// The steps this goal needs: dev covers what gets your own test account connected; production adds the rest.
const inScope = (g, goal) => g.steps.filter((s) => goal === "production" || s.stage !== "production");
const ev = (g, ids) => ids.map((id) => g.evidence.find((e) => e.id === id)).filter(Boolean);
const evTag = (g, ids) => (ids?.length ? " [" + ev(g, ids).map((e) => `${e.id} ${e.status}`).join(", ") + "]" : "");
const days = (w) => (w ? (w.min === w.max ? `${w.max} days` : `${w.min}–${w.max} days`) : null);
const effortOf = (g, id) => g.time.breakdown.find((b) => b.step === id);
const ageDays = (iso) => Math.floor((Date.now() - Date.parse(iso)) / DAY);

function header(d, g) {
  const lines = [`${g.app.name}: ${p.tierLabel(g)} (confidence ${g.verdict.confidence})`, g.verdict.summary];
  lines.push(`Guide saved ${ymd(d.savedAt)} (${ageDays(d.savedAt)} days ago, pipeline ${d.pipelineVersion ?? d.meta?.pipelineVersion ?? "v1"}, ${d.source === "library" ? "bundled library" : "researched in this project"}).`);
  return lines;
}

function brief(d, g) {
  const o = header(d, g);
  const share = p.agentShare(g), risk = p.topRisk(g);
  o.push("", "KEY POINTS", ...g.verdict.points.map((x) => `- ${x.text}${evTag(g, x.evidence)}`));
  o.push("", "TIME", `- Working in dev: ${p.clockText(g.time.devReady)}`, `- Ready for real users: ${p.clockText(g.time.production)}`);
  o.push("", "OAUTH", `- ${p.accessLabel(g.access)}. ${g.access.reason}`);
  if (g.oauth.authorizeUrl || g.oauth.tokenUrl) o.push(`- Authorize URL: ${g.oauth.authorizeUrl ?? "not documented"}`, `- Token URL: ${g.oauth.tokenUrl ?? "not documented"}`);
  o.push(`- An agent can do ${share.agent} of ${share.total} steps${share.withOk ? `, ${share.withOk} of them only with your OK` : ""}.`);
  if (risk) o.push("", "TOP RISK", `- ${risk.title} (${risk.likelihood}). ${risk.whatToDo}${evTag(g, risk.evidence)}`);
  const { prereqs } = p.placeRequirements(g);
  if (prereqs.length) o.push("", "BEFORE YOU START (step 0)", ...prereqs.map((r) => `- ${r.label}. ${r.detail}${r.appliesWhen ? ` Applies when: ${r.appliesWhen}.` : ""}${evTag(g, r.evidence)}`));
  const wide = g.blockers.filter((b) => !b.stepId);
  if (wide.length) o.push("", "WARNINGS FOR THE WHOLE SETUP", ...wide.map((b) => `- ${b.title} (${b.likelihood}). ${b.whatToDo}${evTag(g, b.evidence)}`));
  const open = g.uncertainties.filter((u) => !u.stepId);
  if (open.length) o.push("", "NOT CONFIRMED", ...open.map((u) => `- ${u.text}`));
  o.push("", "STEPS", ...g.steps.map((s, i) => `${i + 1}. [${s.id}] ${s.title} — ${p.OWNER[s.owner]}, ${s.stage === "production" ? "real users only" : "needed for dev"}`));
  return o.join("\n");
}

function stepBlock(d, g, pr, s) {
  const scope = inScope(g, pr.goal), n = scope.indexOf(s) + 1;
  const o = [`STEP ${n} of ${scope.length} [${s.id}]: ${s.title}`, `Who: ${p.OWNER[s.owner]} (${p.OWNER_NEXT[s.owner]}). Stage: ${s.stage}. Phase: ${s.phase}.`];
  const t = effortOf(g, s.id);
  if (s.owner === "provider") o.push(`Wait: ${days(s.wait) ?? "not stated by the provider"}${s.wait ? evTag(g, s.evidence) : ""}`);
  else if (t) o.push(`Hands-on: ${t.min === t.max ? p.hrs(t.max) : `${p.hrs(t.min)}–${p.hrs(t.max)}`} (${t.type})`);
  if (s.where) o.push(`${s.where.kind === "docs" ? "Explained at" : "Where you do it"}: ${s.where.label}${s.where.url ? " — " + s.where.url : ""}`);
  if (s.points.length) o.push("", "WHAT TO DO", ...s.points.map((x) => "- " + x));
  if (s.items?.length) o.push("", "MATERIALS", ...s.items.map((x) => "- " + x));
  if (s.values.length) o.push("", "VALUES", ...s.values.map((v) => `- ${v.label}: ${v.value}`));
  if (s.scopes.length) o.push("", "SCOPES", ...s.scopes.map((sc) => { const m = g.scopes.find((x) => x.scope === sc); return `- ${sc}${m ? ` (${m.sensitivity}${m.note ? "; " + m.note : ""})` : ""}`; }));
  if (s.output) o.push("", `DONE WHEN: you have ${s.output}`);
  const rules = p.placeRequirements(g).rules.get(s.id) ?? [];
  const gets = g.requirements.filter((r) => r.kind !== "technical" && r.stepId === s.id);
  if (rules.length || gets.length) o.push("", "RULES AND REQUIREMENTS", ...[...gets, ...rules].map((r) => `- ${r.label}. ${r.detail}${r.appliesWhen ? ` Applies when: ${r.appliesWhen}.` : ""}${evTag(g, r.evidence)}`));
  const warn = g.blockers.filter((b) => b.stepId === s.id);
  if (warn.length) o.push("", "WARNINGS", ...warn.map((b) => `- ${b.title} (${b.likelihood}). ${b.whatToDo}${evTag(g, b.evidence)}`));
  const open = g.uncertainties.filter((u) => u.stepId === s.id);
  if (open.length) o.push("", "NOT CONFIRMED", ...open.map((u) => `- ${u.text}`));
  const tried = g.attempts.filter((a) => a.stepId === s.id);
  if (tried.length) o.push("", "WHAT THE AGENT SAW WHEN IT TRIED (no sign-in)", ...tried.map((a) => `- ${a.claim}: ${a.result}${a.change && a.change !== "None" ? ` → ${a.change}` : ""}`));
  const es = ev(g, s.evidence);
  if (es.length) o.push("", "EVIDENCE", ...es.map((e) => `- ${e.id} ${e.status}: ${e.claim}${e.quote ? ` — "${e.quote}"` : ""}${e.sourceUrl ? ` (${e.sourceUrl})` : ""}${e.note ? ` Note: ${e.note}` : ""}`));
  return o.join("\n");
}

function scopeOrFail(g, pr, id) {
  const s = g.steps.find((x) => x.id === id);
  if (!s) fail(`No step ${id}. Steps: ${g.steps.map((x) => x.id).join(", ")}`);
  if (!inScope(g, pr.goal).includes(s)) fail(`Step ${id} is for real users only; this walkthrough's goal is dev. Restart with: start ${pr.slug} production`);
  return s;
}
const needProgress = (d) => loadProgress(d.slug) ?? fail(`Not started. Run: node walk.mjs start ${d.slug} <dev|production>`);

switch (cmd) {
  case "list": {
    for (const d of allGuides().sort((a, b) => a.name.localeCompare(b.name)))
      console.log(`${d.slug.padEnd(14)} ${String(d.tierLabel).padEnd(20)} ${String(d.confidence).padEnd(7)} ${ymd(d.savedAt)}  ${d.source}`);
    break;
  }
  case "find": {
    const d = findGuide([arg, ...rest].join(" "));
    if (!d) { console.log("none"); process.exit(2); }
    console.log(d.slug);
    break;
  }
  case "brief": { const { d, g } = open(arg); console.log(brief(d, g)); break; }
  case "start": {
    const { d, g } = open(arg);
    const goal = rest[0];
    if (!["dev", "production"].includes(goal)) fail("Goal must be dev or production.");
    const had = loadProgress(d.slug);
    if (had && !rest.includes("--restart")) fail(`Already started on ${ymd(had.startedAt)} (goal ${had.goal}). Use next, or add --restart to start over.`);
    saveProgress({ slug: d.slug, goal, startedAt: new Date().toISOString(), guideSavedAt: d.savedAt, steps: {} });
    console.log(`Started ${g.app.name}, goal: ${goal === "dev" ? "working in dev" : "ready for real users"} (${inScope(g, goal).length} steps). Clock: ${p.clockText(goal === "dev" ? g.time.devReady : g.time.production)}.`);
    break;
  }
  case "next": {
    const { d, g } = open(arg);
    const pr = needProgress(d);
    if (pr.guideSavedAt !== d.savedAt) console.log(`NOTE: the guide was updated (${ymd(d.savedAt)}) after this walkthrough started. Step ids may have changed; check status.\n`);
    const scope = inScope(g, pr.goal);
    const waiting = scope.filter((s) => pr.steps[s.id]?.status === "waiting");
    for (const s of waiting) {
      const since = pr.steps[s.id].since, el = ageDays(since);
      console.log(`WAITING ON THE PROVIDER [${s.id}]: ${s.title}. Started ${ymd(since)}, ${el} day${el === 1 ? "" : "s"} ago; expected ${days(s.wait) ?? "unknown"}.` +
        (s.wait && el > s.wait.max ? " Longer than the stated wait: follow up with the provider." : "") + "\n");
    }
    const s = scope.find((x) => !pr.steps[x.id]);
    if (!s) { console.log(waiting.length ? "Every other step is done; only the wait above is left." : `ALL DONE: every step for the ${pr.goal} goal is done or skipped.`); break; }
    const later = waiting.length ? "(The wait above runs in parallel; this step doesn't need to wait for it unless its points say so.)\n" : "";
    console.log(later + stepBlock(d, g, pr, s));
    break;
  }
  case "done": case "skip": case "wait": {
    const { d, g } = open(arg);
    const pr = needProgress(d), s = scopeOrFail(g, pr, rest[0]);
    if (cmd === "wait" && s.owner !== "provider") fail(`${s.id} isn't a provider step; use done.`);
    pr.steps[s.id] = cmd === "wait" ? { status: "waiting", since: new Date().toISOString() }
      : { status: cmd === "done" ? "done" : "skipped", at: new Date().toISOString(), note: rest.slice(1).join(" ") || null };
    saveProgress(pr);
    console.log(`${s.id} ${pr.steps[s.id].status}.`);
    break;
  }
  case "status": {
    const { d, g } = open(arg);
    const pr = needProgress(d);
    console.log(header(d, g).join("\n") + `\nGoal: ${pr.goal}. Started ${ymd(pr.startedAt)}.\n`);
    for (const [i, s] of inScope(g, pr.goal).entries()) {
      const st = pr.steps[s.id];
      const mark = !st ? "[ ]" : st.status === "done" ? "[x]" : st.status === "waiting" ? "[~]" : "[-]";
      console.log(`${mark} ${i + 1}. [${s.id}] ${s.title} — ${p.OWNER[s.owner]}${st?.status === "waiting" ? `, waiting since ${st.ymd(since)}` : ""}${st?.note ? ` (${st.note})` : ""}`);
    }
    break;
  }
  case "md": {
    const { d, g } = open(arg);
    // The Markdown's "how this was checked" section reads the run, as the page does when it opens a saved guide.
    const r = d.run ?? {};
    p.run = { ...p.newRun(), probes: r.probes ?? [], searchLog: r.searchLog ?? [], readLog: r.readLog ?? [], queries: r.queries ?? 0, okPages: r.okPages ?? 0,
      okSearches: r.okSearches ?? 0, failedSearches: r.failedSearches ?? (r.searchLog ?? []).filter((x) => !x.ok).length };
    const meta = { ...(d.meta ?? {}), pipelineVersion: d.pipelineVersion ?? d.meta?.pipelineVersion ?? "v1", at: d.meta?.at ?? d.savedAt, downgraded: d.meta?.downgraded ?? 0 };
    const md = p.toMarkdown(g, meta);
    const out = rest[0] ?? `${d.slug}-oauth-guide-${today()}.md`;
    writeFileSync(out, md);
    console.log("Wrote " + out);
    break;
  }
  case "labels": {
    // The page's label definitions: what each difficulty, confidence, owner and evidence label means and requires.
    for (const grp of p.DEFS) {
      console.log(`\n${grp.group.toUpperCase()}`);
      for (const x of grp.items) console.log(`- ${x.label}: ${x.means}${x.requires ? ` Requires: ${x.requires}` : ""}${x.never ? ` Never means: ${x.never}` : ""}`);
    }
    break;
  }
  default:
    fail("Commands: list, find, brief, start, next, done, skip, wait, status, md, labels. See the top of walk.mjs.");
}
