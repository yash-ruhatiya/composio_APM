# OAuth app setup guides

Look up an app and get a shareable guide to getting your own OAuth app ready
so users of your AI agent can connect it. The guide covers:

- whether the provider offers OAuth to third-party apps at all
- how hard setup is
- time, split into hands-on effort and waiting on the provider
- what can block approval
- which steps an agent can do and which need you

Every claim is labelled tested, sourced, inferred or unverified. What every label
means, what it requires and whether a check enforces it is defined once, in the
page's `DEFS` list: the "i" button shows it, the agent's prompt is built from
it, and the downloaded Markdown ends with it.

## Where it runs

The working product is a single page published as a Claude artifact: **OAuth
Guide Agent** (`artifact/index.html`, published at
https://claude.ai/artifact/5VfxxuN2Tea166n9fFYqfm). It uses Claude through the
artifact's `sample` capability and the Claude desktop app's browser for
searching, reading pages and probing endpoints. No API key or server is needed.

**Who can run it.** Anyone with the link can browse the library and the
validation results; the page carries both, so they show even when you're not
signed in. Live research needs the Claude desktop app's browser, which the
platform lets only an artifact's owner use. So to run it yourself, make your own
copy:

1. Open https://claude.ai/artifact/5VfxxuN2Tea166n9fFYqfm and make a copy of it.
2. Open your copy in the Claude desktop app.
3. Type an app name or website and press Research. Allow Claude and the
   browser when the page asks.

Your copy runs on your own Claude account, with no API key and nothing to host.
Guides you generate are saved to your copy's library, next to the bundled ones.

**Demo video.** A narrated walkthrough of the library, a guide, a live run and
the validation results:
https://drive.google.com/file/d/1UwdRcItrc1qaeXnOBG8hAIS0hITKWI7I/view?usp=sharing

## What's in this folder

| Path | What it is |
|---|---|
| `artifact/index.html` | The product: the whole page, as published, with `guides/` and `validation/` bundled in |
| `artifact/bundle.mjs` | Re-bundles `guides/` and `validation/` into the page: `node artifact/bundle.mjs .` |
| `artifact/test/` | Stand-ins for Claude, the browser and the database, plus the process tests |
| `guides/` | The saved library: each guide as the page stores it (`.json`) and as its "Download .md" button writes it (`.md`) |
| `validation/` | Validation results, one file per app per round (`-r2` is round 2) |
| `skill/oauth-setup/` | A Claude Code skill, `/oauth-setup <app>`, that walks a developer through a guide step by step (below) |
| `docs/research/` | The readiness checklists behind the guide format, their coverage sheet, and the offline snapshot of Composio's toolkit list used to choose apps |

## How a run works (pipeline v2)

1. **Research.** Claude searches (DuckDuckGo through the browser) and reads the
   provider's official docs. Two pages are mandatory: the app review / go-live
   page and the OAuth token page.
   - A page counts as read only if real content came back. It doesn't count if:
     - it returned only the site's navigation (under 800 characters of
       prose-like lines);
     - its text matches another page on the same site in the run;
     - for the two mandatory pages, it lacks review or token wording.
   - Docs built by script fall back to the page's `.md` copy, its `/llms.txt`
     entry, or its Gatsby page-data file.
   - A failed search (a bot check or an empty result list) is logged as failed.
     Two failures show a banner.
2. **Probes.** These are requests that need no credentials: OAuth discovery
   metadata, and the authorize endpoint called with a made-up client.
3. **Claim check.**
   - **tested** needs a probe that ran.
   - **sourced** needs a page read in this run whose text contains the quote. A
     navigation-only page can't source anything.
   - Violations are downgraded.
   - Confidence is capped by the share of weak evidence.
4. **Follow-up (at most one).** Runs if the check finds a problem: a mandatory
   page failed, a probe contradicts the tier, or over half the claims are weak.
   - Claude gets one more round, with 2 searches and 3 pages, to fix those
     problems. It tries the API reference, then a help-center article.
   - The patched guide is checked again.
   - Anything still unreadable is marked "Needs checking", with the URLs that
     were tried.
5. **Attempt setup (stage 2).** The page opens what an unauthenticated browser
   can check, all taken from the guide itself:
   - the registration page
   - the documented authorize URL with the documented scopes
   - the documented token endpoint (never one found by discovery)
   - the review page
   - step links, each marked as where you do the step or where it's explained

   It tries the weakest claims first (unverified, then inferred, then sourced),
   skipping claims already tested. Each row states what the guide expects and
   what was seen:
   - **Matches the guide** if they match.
   - **Corrected** if they differ, with the edit applied: a moved link, a
     broken link, a gate blocker, or a scope or form-field question.
   - **Couldn't check** if it couldn't tell.

   A docs page is never accepted as the registration form. The agent never signs
   in, submits or types into a page, and it treats page text as data.
6. **Save.** The guide goes to the page's database with `pipelineVersion`, the
   run log and any hands-on checks added later.

## How times are calculated

The two clocks (working in dev, ready for real users) are computed by the
page, never written by the agent:

- **Hands-on hours** come from a fixed rubric per step type (for example a
  registration form 15–30 min, the authorize and token exchange 1–3 h, review
  materials 1–4 h per item). The agent picks each step's type. It may scale a
  step 0.5×–2× only with a sourced or tested reason; otherwise the rubric
  stands.
- **Waits** come only from steps the provider does, and only when the
  provider's page states the time (provider-stated) or a check saw it
  (observed). Anything else is "wait unknown". A review-gated or
  partner-gated app with no provider step before real users also shows
  "wait unknown".
- **Totals:** working in dev is step 0 plus the dev steps; ready for real users
  adds the production steps. Waits add up in order.

Each guide shows the working under "How we got the times", and the rubric is
in the "i" panel. Both come from the same table in the page.

## Validation

Validation compares a sample of guides, claim by claim, with Composio's
published setup guides (a third-party source). Every disagreement is settled
against the provider's own docs or a setup attempt. Results live in the page's
`validation` collection and show per round:

- **Round 1 (v1 pipeline):** GitHub, DocuSign, Gong, Ramp, PagerDuty.
  - 59 claims: 26 agree, 28 corrected, 5 couldn't settle.
  - Most corrections were gaps or pages that came back empty. That is what
    pipeline v2's shell detection and follow-up round address.
- **Round 2 (v2 pipeline, artifact v40):** the same 5 apps, regenerated, and
  the same 59 claims.
  - 59 claims: 41 agree, 14 corrected, 4 couldn't settle.
  - 20 claims that were wrong or unsettled in round 1 are now right; 5 that
    were right in round 1 are now wrong or missing.
  - What's still wrong is mostly detail the guides leave out (authorization
    code lifetimes, rate limits, refresh-token behaviour, region-specific
    scopes) rather than wrong statements. Two errors are real: PagerDuty
    links admins to an address that returns a 404 (stage 2 saw a sign-in page
    and couldn't tell), and GitHub's guide says a single callback URL gets
    wildcard matching by default, which the docs now limit to apps created
    before August 3, 2026.

| App | Round 1: agree / corrected / couldn't settle | Round 2 |
|---|---|---|
| GitHub | 8 / 2 / 1 | 9 / 1 / 1 |
| DocuSign | 4 / 7 / 1 | 9 / 2 / 1 |
| Gong | 5 / 6 / 1 | 8 / 4 / 0 |
| Ramp | 2 / 8 / 2 | 7 / 3 / 2 |
| PagerDuty | 7 / 5 / 0 | 8 / 4 / 0 |
| **Total** | **26 / 28 / 5** | **41 / 14 / 4** |

## Testing the page locally

`artifact/test/` holds stand-ins for Claude, the browser and the database.

```sh
node artifact/test/build.mjs
```

That writes `artifact/test/test-page.html`. Serve that folder and open the
page. The run exercises these cases:

- navigation-only and duplicate pages
- bot-checked searches
- the follow-up round
- a docs page posing as the registration form
- moved and sign-in links

`node artifact/test/process-check.mjs` runs the page's own clean-up, claim
check and stage 2 on made-up providers, with a fake browser. Each of its 41
cases pins one rule of the process, so a change that breaks a rule fails the
test whatever app showed the bug:

- Only the documented OAuth server counts. Another server, such as an MCP
  server, can't contradict the guide or be tested in its place.
- The wait is a field ("none", "unknown" or a range of days) and is never read
  from the label. "None" needs a sourced or tested claim, and a review-gated
  app can't have it.
- Stage 2 decides every result from one table: what kind of target it opened
  × what kind of page it saw. Anything not in the table is "Couldn't check".
  Words on a page never change the guide, except gate wording on the
  registration page.
- Every edit stage 2 makes lands on the claim it checked.

## Guided setup skill

`skill/oauth-setup/` turns a guide into a walkthrough in Claude Code. Copy the folder into `~/.claude/skills/`
(or a project's `.claude/skills/`), then run `/oauth-setup docusign` from your project. Needs Node 18 or later.

1. **Load the guide.** It looks the app up in the bundled library (the same 10 guides as `guides/`) and shows the
   verdict, both clocks, the top risk and what you need before you start. An app that isn't there can be researched
   live (see below).
2. **Pick a goal:** working in dev, or ready for real users. Dev skips the steps only real users need.
3. **Walk the steps by owner.**
   - **Agent:** Claude does it: config, the callback route, the token flow, a read-only test call.
   - **Agent, with your OK:** Claude asks first (secrets, writes, anything sent to the provider).
   - **You:** Claude stops and waits until you say it's done.
   - **Provider:** the wait is recorded, and `/oauth-setup <app>` picks up where you left off days later.

   Warnings and open questions attached to a step show before the step. Alternatives (for example a confidential
   client or PKCE) are asked as a choice. Progress is saved in `.oauth-setup/progress/`.
4. **Share.** The finished guide exports as the same Markdown the page writes.

**Same rules as the page.** `scripts/page.js` is the page's own script, copied verbatim by `scripts/sync-page.mjs`.
`scripts/core.mjs` runs it in Node with the page's browser replaced by plain HTTPS requests. The research brief,
tools, claim check, timing rubric, stage 2, label definitions and Markdown export are therefore the page's, not
rewrites. A re-sync that drops anything the skill uses fails and keeps the old copy.

**Live research for new apps** (`skill/oauth-setup/references/research.md`). Claude follows the page's research
brief and calls the page's tools as commands. The same claim check then decides every label, including the one
follow-up round and stage 2. The result is saved in the project, not in the page's shared library.

**What was tested:**
- Every step of all 10 library guides was walked with the walker commands, with the "ready for real users" goal,
  covering provider waits and the Markdown export.
- One live research run on Zoom, which isn't in the library: searches, 3 pages read and both probes. A planted quote
  that isn't on the page was downgraded from sourced to inferred. The follow-up round opened once and refused a
  second. Stage 2 ran, and the saved guide opened in the walker.
- **Not tested:** the skill run as a slash command inside an interactive Claude Code session.

**Differences from the page:**
- Pages are fetched, not rendered, so docs built by script are flagged as navigation only more often.
- Stage 2 can't see scripted sign-in pages or forms. Those rows come back as "Couldn't check".
- Steps in a provider's web console need your signed-in browser. Claude hands them to you with the exact values,
  unless a browser tool using your session is available and you agree.

## Key decisions

- **Composio is used offline only.** We studied Composio's managed OAuth
  directory to understand when developers need their own OAuth app. We used it
  offline to choose apps and cross-check guides; the product depends only on
  provider docs and live checks. The snapshot is
  `docs/research/composio-oauth.json`, and the page never reads it.
- **The product is a page that runs in the user's own Claude session.** With no
  API key, that was the only way to ship a working agent. An earlier server
  version was dropped and isn't part of this submission.

## Known limitations

- **The skill isn't the page.** See "Differences from the page" under Guided setup skill.
- **Live runs need your own copy, in the desktop app.** The platform lets only
  an artifact's owner use the browser, so others make a copy first (see "Who can
  run it"). A copy keeps its new guides in its own library; the bundled guides
  are a snapshot and don't update when the original page adds more.
- **Stage 2 sees only text.** Form fields are read from short label lines, not
  from the page's actual inputs, and anything that needs a signed-in account
  isn't tested.
- **The shell rule is a heuristic.** A very short but real page can be marked
  navigation-only; the run log shows it.
- **Follow-up fallbacks are limited.** The fallbacks (API reference, help
  article) run only for the mandatory pages and the problems the check
  flagged. The GitHub docs-repo fallback was left out because guessed paths
  rarely exist.
- **Search depends on DuckDuckGo.** A bot check there thins out research; the
  page shows a banner when that happens.
- **Ambiguous app names are researched on a guess.** A name like "Box" or
  "Front", or one that doesn't exist, goes straight into a full run about
  whichever company the agent picks, and the evidence checks can't catch a
  wrong company. Planned: confirm the app (name and website) before research,
  ask when it's unclear, and skip the check when a website is typed.
