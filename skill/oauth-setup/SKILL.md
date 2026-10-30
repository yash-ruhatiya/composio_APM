---
name: oauth-setup
description: Walk a developer through getting their own OAuth app ready with a provider (register the app, redirect URI, scopes, test the flow, review, go live), one step at a time, doing the steps an agent can do and pausing for the ones only the developer or the provider can do. Use when the user runs /oauth-setup <app>, or asks how to register, set up or get approval for an OAuth app with a provider so their agent's users can connect it. Uses a bundled library of evidence-labelled guides and researches apps outside it live.
argument-hint: <app name or website>
---

# OAuth app setup, step by step

You walk the developer through one provider's OAuth setup guide. You do the steps an agent can do, ask before
anything sensitive, stop and wait for the steps only they can do, and keep track of provider waits that can take days.
The guides come from the OAuth Guide Agent page. Every claim in them is labelled tested, sourced, inferred or
unverified, and the scripts here run that page's own code, so the labels, times and checks mean the same thing here.

`<skill-dir>` below is this skill's base directory (shown when the skill loads). Run every command from the user's
project folder: progress and newly researched guides are saved in `.oauth-setup/` there. Needs Node 18 or later.

## 0. Load the guide

1. No app given? Ask which app (name or website).
2. `node <skill-dir>/scripts/walk.mjs find "<app>"`
   - **Found:** go to step 3.
   - **`none`:** say the library has no guide for it and offer to research it live. That takes a few minutes and
     reads the provider's docs. On yes, follow `references/research.md`, then continue with the slug it saves.
     If the name could be several companies (Box, Front, Notion vs a notion.so lookalike), confirm the website first.
3. `node <skill-dir>/scripts/walk.mjs status <slug>`. If it succeeds, this walkthrough was started before:
   show where it stands and go straight to step 2 (the loop). Otherwise:
4. `node <skill-dir>/scripts/walk.mjs brief <slug>` and present it briefly:
   - the verdict line (difficulty and confidence) and the one-line summary
   - both clocks: working in dev, ready for real users (hands-on vs waiting)
   - how many steps an agent can do, and the top risk
   - **before you start**: the step 0 prerequisites, as a checklist
   - warnings for the whole setup and anything not confirmed
   - the guide's age. Over 60 days old, offer to research it again first.

## 1. Choose the goal

Ask with AskUserQuestion, putting each clock in the option's description:
- **Working in dev**: their own test account connects. Skips steps only real users need.
- **Ready for real users**: everything, including review and go-live.

Then `node <skill-dir>/scripts/walk.mjs start <slug> <dev|production>`.

## 2. The loop

Run `node <skill-dir>/scripts/walk.mjs next <slug>` and act on the step by its **Who** line.
Before the step itself, show its WARNINGS and NOT CONFIRMED lines first, so a blocker is seen before effort is spent.
Say when a step rests on inferred or unverified evidence ("the docs I read don't confirm this").

| Who | What you do |
|---|---|
| **Agent** | Do it, then report what you did and what you saw. In Claude Code that means work in the user's project and terminal: write config, add the OAuth callback route, run the token flow, make the read-only test call. **Steps in the provider's web console need a signed-in browser, and you can't sign in.** If a browser tool that uses the user's own signed-in session is available, offer to drive it, and get a yes before any final submit. Otherwise hand it over: the exact click path, the values to paste, and "done when". Never say you did a console step you didn't do. |
| **Agent, with your OK** | Say exactly what you'll do (which file, which value, which request), ask yes/no with AskUserQuestion, and act only on yes. This covers secrets, writes to their config, and anything sent to the provider. |
| **You** | Present it: the link, what to do, the values, "done when". Then **end your turn** and wait for them to say it's done. Don't run ahead to later steps. |
| **Provider** | Give the expected wait and its evidence, run `walk.mjs wait <slug> <step>`, and tell them they can carry on with steps that don't depend on it or come back later with `/oauth-setup <app>`. `next` then shows how long it has been waiting. When they say the provider approved, mark it done. |

**Choices.** When a step or a requirement offers alternatives (confidential client with a secret or public client with
PKCE; user- or admin-managed app; anything with "Applies when"), ask with AskUserQuestion before doing the step, and
put the answer in the step's note.

**After each step**, record it and move on:
- `node <skill-dir>/scripts/walk.mjs done <slug> <step> "<short note>"`, after the step is verified, or after the developer says it's done for a step they did.
- `node <skill-dir>/scripts/walk.mjs skip <slug> <step> "<reason>"`, when the developer says it doesn't apply.

If a step fails or the provider's screen doesn't match the guide, say so plainly, note it in the step's note,
and help them through what they actually see. Guides can be out of date.

## 3. Finish

When `next` says ALL DONE, sum up what was set up and what's still waiting. Offer the guide as Markdown to share:
`node <skill-dir>/scripts/walk.mjs md <slug>`.

## Secrets

- Never ask for a client secret, token or password in chat. Ask the developer to put it in `.env` themselves (for
  example `PROVIDER_CLIENT_ID` and `PROVIDER_CLIENT_SECRET`), and check that `.env` is in `.gitignore`.
- Read values from `.env` only to use them in a command. Never print them, and never write them into code.
- Use read-only calls for tests.

## Presenting a step

Keep it short and scannable, for example:

> **Step 3 of 7 · Set scopes and callback URL** · Agent
> ⚠ Scope requests can be rejected: ask only for what the agent needs. (common)
> Where: Gong → Admin center → API → Integration details
> - Select `api:calls:read:basic`
> - Add your app's OAuth callback URL as the redirect URI (must match exactly)
> Done when: you have the client ID and secret.

`node <skill-dir>/scripts/walk.mjs labels` prints what every label means: difficulty, confidence, owners and
evidence. Use it when the developer asks what a label means.
