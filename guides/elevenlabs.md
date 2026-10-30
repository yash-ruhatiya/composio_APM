# ElevenLabs: OAuth app setup

**OAuth unconfirmed** (confidence: low). ElevenLabs documents no third-party OAuth client registration, so the confirmed route is a user-supplied API key; an OAuth server exists but its client onboarding is unclear.

- OAuth server exists, but no documented way for third parties to register [e1 tested] [e3 sourced]
  - Discovery shows authorize and token endpoints with no registration_endpoint. The MCP page describes OAuth only for assistants connecting to its hosted MCP server.
- Docs tell third-party services to use the user's API key [e2 sourced] [e4 sourced]
  - The help page says linking an external service requires the user's API key. Keys can be scope-restricted and credit-limited.
- No review process found [e5 inferred]
  - I found no app review or publishing page. That fits the API-key route, where nothing is reviewed.

- Working in dev: 1 h 30 min–2 h 45 min hands-on, no waiting
- Ready for real users: 1 h 30 min–2 h 45 min hands-on, no waiting
- OAuth for your users: Nothing to register. An OAuth server exists, but the docs I read give no way for third-party apps to get a client ID. The documented route for outside services is the user's API key.
- Instead: Each user creates an API key (Developers → API Keys) and your agent sends it in the xi-api-key header.
- An agent can do 2 of 4 steps (50%), 1 of them only with your OK.
- Top risk: **No documented third-party OAuth client registration** (common). Use API keys, or contact ElevenLabs to ask whether a partner OAuth client is available. [e1 tested] [e3 sourced]

**How we got the times** (hands-on hours from the rubric; waits only from a provider statement or an observation)

- Dev, step 0: Account or plan setup, 15 min
- Dev, step 1: Any other step, 15 min–1 h
- Dev, step 2: Account or plan setup, 15 min
- Dev, step 3: Redirect URI and scopes, 15 min
- Dev, step 4: Test with your own account, 30 min–1 h

## Steps to follow

**Getting to dev**

0. **Have these ready** (You). Done when: all in place.
   - **ElevenLabs account**. Each user needs an account and a Full Seat to create personal API keys. _Applies when: API key route._ [e6 sourced]
   - Decide whether to request `text_to_speech` (unknown) [e1 tested]
   - Decide whether to request `convai_read` (unknown) [e1 tested]
   - Decide whether to request `convai_write` (unknown) [e1 tested]
   - Decide whether to request `speech_history_read` (unknown) [e1 tested]
1. **Decide between the API key route and asking ElevenLabs about OAuth** (You · 15 min–1 h). [e1 tested] [e4 sourced]
   - Use the API key route; it is the documented one
   - Ask ElevenLabs support or sales if you need real OAuth client credentials
   - Explained at: ElevenLabs Help Center (https://help.elevenlabs.io/hc/en-us)
   - ⚠ Watch out: **No documented third-party OAuth client registration** (common). Use API keys, or contact ElevenLabs to ask whether a partner OAuth client is available. [e1 tested] [e3 sourced]
   - Agent checked: **Couldn't check**. Couldn't open: The page changed; retry.
   - **→ You take over here.** You do step 1; an agent can pick up after it
2. **Create an API key for the test account** (You · 15 min). Done when: API key. [e2 sourced] [e4 sourced] [e6 sourced]
   - Sign in and open Developers → API Keys, then create a key
   - Restrict the key to the endpoints you need and set a credit limit
   - Give the key to the agent only with your OK
   - Rule: **Keep keys server-side**. The API key is a secret and must not be exposed in client-side code. [e2 sourced]
   - Where you do it: ElevenLabs → Developers → API Keys (https://elevenlabs.io/app/developers)
   - ⚠ Watch out: **Personal API keys need a Full Seat** (possible). Users on other seats may need a workspace admin to issue a service account key. [e6 sourced]
   - Agent checked: **Couldn't check**. Couldn't open: Claude's browser needs a click or key press in the artifact first.
3. **Configure your agent to store and send the key** (Agent, with your OK · 15 min). [e2 sourced] [a1 tested]
   - Store the key encrypted on the server
   - Send it as the xi-api-key header
   - Ask users to paste their own key
   - Rule: **xi-api-key header**. Send the key as the xi-api-key HTTP header on every request. [e2 sourced]
   - Explained at: ElevenLabs API authentication (https://elevenlabs.io/docs/api-reference/authentication)
   - Header: `xi-api-key: <API_KEY>`
   - Base URL: `https://api.elevenlabs.io`
   - Agent checked: **Matches the guide**. Loads "API Authentication | ElevenLabs Documentation"
4. **Test the key with a read-only call** (Agent · 30 min–1 h). [e2 sourced]
   - GET https://api.elevenlabs.io/v1/models with the xi-api-key header
   - Success is HTTP 200 with a JSON list of models
   - A 401 or 403 means the key is invalid or lacks permission
   - Explained at: ElevenLabs API authentication (https://elevenlabs.io/docs/api-reference/authentication)
   - Test call: `GET https://api.elevenlabs.io/v1/models`

✓ **Working in dev:** 1 h 30 min–2 h 45 min hands-on, no waiting

✓ **Ready for real users:** 1 h 30 min–2 h 45 min hands-on, no waiting

**Not confirmed across the setup**

- ? How third parties obtain an OAuth client_id for elevenlabs.io/app/oauth/authorize is unknown. I found no docs on it.
- ? The authorize endpoint probe failed, so I did not test it.
- ? No app review or go-live page found. I searched app review, publishing and OAuth app registration. Review is not confirmed absent.
- ? Not stated on pages I read: authorization code lifetime, access and refresh token lifetimes, refresh behavior, client authentication method, redirect URI rules, rate limits, and region hosts. The discovery metadata shows the US issuer api.us.elevenlabs.io, while the API key base URL is api.elevenlabs.io.
- ? The MCP OAuth flow may use Client ID Metadata Documents, per a third-party issue report. This is unconfirmed by ElevenLabs docs.
- ? The provider's documented authorize URL wasn't found, so it couldn't be tested.
- ? Review page not read; review time and requirements unconfirmed. (Searched ElevenLabs OAuth third-party apps, OAuth app client registration, and app review. Found no review or publishing page.)
- ? Token page not read; token lifetimes, refresh and redirect rules unconfirmed. (Searched OAuth app client registration and the API authentication docs. Found no OAuth token page, only the discovery metadata.)

---

## How this guide was checked

### At a glance

| Area | Finding | Evidence | Status | Next step |
|---|---|---|---|---|
| Difficulty | OAuth unconfirmed | — | Confidence: low | Read the steps below |
| Agent share | 2 of 4 steps (50%) | — | Counted from steps | See Steps to follow for who does each one |
| OAuth access | Nothing to register | — | From research | Nothing to register |
| Time to dev | 1 h 30 min–2 h 45 min hands-on, no waiting | — | Needs checking | Estimate: time a real setup to confirm |
| Time to real users | 1 h 30 min–2 h 45 min hands-on, no waiting | — | Needs checking | Estimate: time a real setup to confirm |
| Review page | — | — | Not found | Find and read this page to confirm |
| Token page | — | e1 | Not found | Find and read this page to confirm |
| Discovery | https://api.elevenlabs.io/.well-known/oauth-authorization-server | — | Tested | — |
| Discovery | elevenlabs.io | — | Nothing found | — |
| Authorize URL | https://elevenlabs.io/app/oauth/authorize?client_id=invalid&response_type=code&redirect_uri=https://example.com/cb | — | Couldn't run | Re-run the probe or open the URL yourself |
| Page | https://elevenlabs.io/docs/api-reference/authentication | — | Tested | — |
| Requirement | ElevenLabs account | e6 | Sourced | You: have this ready |
| Requirement | Keep keys server-side | e2 | Sourced | You: have this ready |
| Requirement | xi-api-key header | e2 | Sourced | You: have this ready |
| Scope | text_to_speech | e1 | Tested | Request only if your agent needs it |
| Scope | convai_read | e1 | Tested | Request only if your agent needs it |
| Scope | convai_write | e1 | Tested | Request only if your agent needs it |
| Scope | speech_history_read | e1 | Tested | Request only if your agent needs it |
| Blocker · common | No documented third-party OAuth client registration | e1, e3 | Risk | Use API keys, or contact ElevenLabs to ask whether a partner OAuth client is available. |
| Blocker · possible | Personal API keys need a Full Seat | e6 | Risk | Users on other seats may need a workspace admin to issue a service account key. |
| Open question | How third parties obtain an OAuth client_id for elevenlabs.io/app/oauth/authorize is unknown. I found no docs on it. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | The authorize endpoint probe failed, so I did not test it. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | No app review or go-live page found. I searched app review, publishing and OAuth app registration. Review is not confirmed absent. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Not stated on pages I read: authorization code lifetime, access and refresh token lifetimes, refresh behavior, client authentication method, redirect URI rules, rate limits, and region hosts. The discovery metadata shows the US issuer api.us.elevenlabs.io, while the API key base URL is api.elevenlabs.io. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | The MCP OAuth flow may use Client ID Metadata Documents, per a third-party issue report. This is unconfirmed by ElevenLabs docs. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | The provider's documented authorize URL wasn't found, so it couldn't be tested. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Review page not read; review time and requirements unconfirmed. (Searched ElevenLabs OAuth third-party apps, OAuth app client registration, and app review. Found no review or publishing page.) | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Token page not read; token lifetimes, refresh and redirect rules unconfirmed. (Searched OAuth app client registration and the API authentication docs. Found no OAuth token page, only the discovery metadata.) | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |

### What the agent tried

Stage 2 picked the 3 weakest claims it can check by opening a page (1 unverified, 2 sourced); claims already tested were skipped. Tried 5 things: 1 match the guide, 0 corrected, 4 couldn't check. Nothing needed correcting in the weak claims attempted: portal at elevenlabs.io/app/developers (unverified); Step 1 link at help.elevenlabs.io/hc/en-us (sourced); Step 3 link goes to elevenlabs.io/docs/api-reference/authentication (sourced). Nothing was submitted or signed in.

| # | Claim from the guide | What the agent tried | Expected | Seen | Status | What changed / Your next step |
|---|---|---|---|---|---|---|
| 1 | The documented authorize URL | — | The authorize URL from the provider's docs | Couldn't check: the guide doesn't name it | Couldn't check | No change |
| 2 | The documented token URL | — | The token URL from the provider's docs | Couldn't check: the guide doesn't name it | Couldn't check | No change |
| 3 | portal at elevenlabs.io/app/developers (guide's evidence: Unverified) | Opened it | — | Couldn't open: Claude's browser needs a click or key press in the artifact first. | Couldn't check | No change |
| 4 | Step 1 link at help.elevenlabs.io/hc/en-us (guide's evidence: Sourced) | Opened it | — | Couldn't open: The page changed; retry. | Couldn't check | No change |
| 5 | Step 3 link goes to elevenlabs.io/docs/api-reference/authentication (guide's evidence: Sourced) | Opened the link and checked where it lands | A docs page about "ElevenLabs API authentication" | Loads "API Authentication \| ElevenLabs Documentation" (probe p4) | Matches the guide | Added tested evidence a1 (probe p4) |
| → | Where the agent stopped | Step 1: Decide between the API key route and asking ElevenLabs about OAuth | — | A step only you can do (account, legal terms, payment, verification or a decision) | You take over | You do step 1; an agent can pick up after it |

### What we couldn't confirm

- How third parties obtain an OAuth client_id for elevenlabs.io/app/oauth/authorize is unknown. I found no docs on it.
- The authorize endpoint probe failed, so I did not test it.
- No app review or go-live page found. I searched app review, publishing and OAuth app registration. Review is not confirmed absent.
- Not stated on pages I read: authorization code lifetime, access and refresh token lifetimes, refresh behavior, client authentication method, redirect URI rules, rate limits, and region hosts. The discovery metadata shows the US issuer api.us.elevenlabs.io, while the API key base URL is api.elevenlabs.io.
- The MCP OAuth flow may use Client ID Metadata Documents, per a third-party issue report. This is unconfirmed by ElevenLabs docs.
- The provider's documented authorize URL wasn't found, so it couldn't be tested.
- Review page not read; review time and requirements unconfirmed. (Searched ElevenLabs OAuth third-party apps, OAuth app client registration, and app review. Found no review or publishing page.)
- Token page not read; token lifetimes, refresh and redirect rules unconfirmed. (Searched OAuth app client registration and the API authentication docs. Found no OAuth token page, only the discovery metadata.)

### Evidence

- **e1** Tested: An OAuth server exists with authorize and token endpoints, no registration_endpoint, and scopes such as convai_read and text_to_speech. (probe p1) _Discovery on api.elevenlabs.io._
- **e2** Sourced: The API uses API keys sent in the xi-api-key header. Keys can be restricted by scope, credit and IP. (https://elevenlabs.io/docs/api-reference/authentication)
  > All API requests should include your API key in an xi-api-key HTTP header
- **e3** Sourced: OAuth is described for assistants connecting to the hosted ElevenLabs MCP server, with no developer registration mentioned. (https://elevenlabs.io/mcp)
  > Install from the ChatGPT plugins directory in one click and sign in with your ElevenLabs account. One time OAuth, no API keys, revocable anytime.
- **e4** Sourced: The help center says to use your API key to link your account with external services. (https://elevenlabs.io/docs/help-center/account/general/how-can-i-use-eleven-labs-with-third-party-services)
  > To link your ElevenLabs account with an external service, you will need to use your API key.
- **e5** Inferred: No review page was found in searches. _Based on search results only._
- **e6** Sourced: Personal API keys need a Full Seat. (https://elevenlabs.io/docs/overview/administration/workspaces/api-keys)
  > Creating personal API keys requires a Full Seat.
- **a1** Tested: elevenlabs.io/docs/api-reference/authentication loads (API Authentication | ElevenLabs Documentation) (probe p4) _Stage 2 attempt_

### How this was researched

Pipeline v2. 4 searches (0 failed), 4 of 4 pages read with real content, 4 probes. Claim check: 0 downgraded.

- Review page: Not found (Searched ElevenLabs OAuth third-party apps, OAuth app client registration, and app review. Found no review or publishing page.)
- Token page: Not found (Searched OAuth app client registration and the API authentication docs. Found no OAuth token page, only the discovery metadata.)

Searches:
- ok: ElevenLabs OAuth third-party apps connect user accounts
- ok: ElevenLabs API authentication API key xi-api-key docs
- ok: ElevenLabs OAuth app client registration
- ok: ElevenLabs "OAuth" developers register application client_id redirect_uri elevenlabs.io/app/oauth/authorize

Pages:
- ok: https://elevenlabs.io/docs/api-reference/authentication (API Authentication | ElevenLabs Documentation, 2304 chars)
- ok: https://elevenlabs.io/mcp (ElevenLabs Agents & Creative MCP - connect your assistant, 5009 chars)
- ok: https://elevenlabs.io/docs/overview/administration/workspaces/api-keys (API Keys | ElevenLabs Documentation, 5965 chars)
- ok: https://elevenlabs.io/docs/help-center/account/general/how-can-i-use-eleven-labs-with-third-party-services (How can I use ElevenLabs with third-party services? | ElevenLabs Documentation, 1020 chars, read via plain-text copy https://elevenlabs.io/docs/help-center/account/general/how-can-i-use-eleven-labs-with-third-party-services.md)

Probes:
- p1 positive: Metadata found at /.well-known/oauth-authorization-server. No registration_endpoint (no DCR advertised). (https://api.elevenlabs.io/.well-known/oauth-authorization-server)
- p2 negative: No OAuth/OIDC discovery metadata on elevenlabs.io. Not conclusive: many providers don't publish it. (elevenlabs.io)
- p3 error: Probe failed: Claude's browser needs a click or key press in the artifact first. (https://elevenlabs.io/app/oauth/authorize?client_id=invalid&response_type=code&redirect_uri=https://example.com/cb)
- p4 positive: Opened the link and checked where it lands: docs (https://elevenlabs.io/docs/api-reference/authentication)

Claim-check notes:
- probe p1 found another OAuth server at api.us.elevenlabs.io; it isn't the documented one, so it doesn't count for or against the guide
- the guide doesn't name the documented authorize URL
- "Self-serve" but OAuth for third-party apps is "unknown"; shown as OAuth unconfirmed with low confidence

### What the labels mean

**Difficulty**
- **Instant** (Checked): Nothing to register: apps register themselves through dynamic client registration.
- **Self-serve** (Agent's judgement): You register an app in the provider's portal and can go live without a review.
- **Review-gated** (Checked): Real users can connect only after an app review, verification or marketplace listing.
- **Partner-gated** (Checked): API access needs a partner program, sales contact, paid plan or agreement first.
- **No OAuth available** (Checked): The provider's docs show no OAuth for third-party apps: API keys only, OAuth only for its own plugins, or no API. The steps cover the alternative.
- **OAuth unconfirmed** (Checked): An OAuth server exists, or a tier was claimed, but how a third-party app gets a client isn't confirmed.

**Confidence**
- **High** (Checked): The guide's answer is well backed.
- **Medium** (Checked): Mostly backed, with gaps.
- **Low** (Checked): Treat the answer as a lead to confirm.

**OAuth access**
- **Can users connect with OAuth? (yes / no / unknown)** (Checked): Whether the provider lets other apps connect to its users' accounts with OAuth.
- **Registration (manual / dynamic / none)** (Checked): How an app gets a client ID: a form in a developer portal, self-registration, or not at all.

**OAuth server**
- **Authorize URL** (Checked): The authorize URL the provider documents for third-party apps, the one your users' connections go through.
- **Token URL** (Checked): The token endpoint the provider documents for the same OAuth server.
- **Another OAuth server** (Checked): A discovery probe found an OAuth server on a host other than the documented one (for example an MCP server). It is listed in the run log.

**Evidence (each claim)**
- **Tested** (Checked): A probe or page load in this run showed it.
- **Sourced** (Checked): A provider page read in this run states it, and the quoted words are on that page.
- **Inferred** (Checked): Reasoned from search snippets, third-party sources or general knowledge.
- **Unverified** (Checked): Nothing in this run backs it.

**Step and row status**
- **Tested** (Checked): Every claim behind this row is tested.
- **Sourced** (Checked): The weakest claim behind this row is sourced.
- **Not confirmed** (Checked): An open question the research couldn't settle; check it before relying on the step.
- **Needs checking** (Checked): At least one claim behind this row is inferred or unverified, or a time is unknown.

**Who does it**
- **Agent** (Agent's judgement): An agent with browser or API access can do it once you're signed in.
- **Agent, with your OK** (Agent's judgement): An agent can do it, but asks you first: secrets, submissions, anything that can't be undone.
- **You** (Agent's judgement): Needs you: accounts, legal terms, payment, verification, decisions.
- **Provider** (Agent's judgement): Waiting on the provider.

**Agent checks (stage 2)**
- **Matches the guide** (Checked): The agent opened the page or endpoint and saw what the guide expects.
- **Corrected** (Checked): What the agent saw differs, and the guide was changed by a fixed rule: a moved or broken link, a gate, a scope or form question.
- **Couldn't check** (Checked): The page wasn't visible (built by script, signed in, blocked) or didn't show enough to compare.
- **You take over** (Checked): The first point that needs you: a sign-in, a sign-up, or a step only you can do.

**Required pages (review and token)**
- **Read** (Checked): Read in this run, with real content about review (or tokens).
- **Not found** (Agent's judgement): Searched; the provider seems to have no such page.
- **Couldn't load (only navigation / not the right content)** (Checked): Found but not usable: it didn't load, returned only site navigation, or wasn't about review or tokens.
- **Not applicable** (Checked): The provider has no review.

**Waiting on the provider (each clock)**
- **N–M days waiting** (Agent's judgement): The provider's wait, in days.
- **No waiting** (Checked): Nothing to wait for: no review or approval before this clock is done.
- **Wait unknown** (Checked): No wait could be backed.

**Timing: hands-on hours per step type**
- **Account or plan setup** (Checked): 15 min hands-on.
- **App registration form** (Checked): 15 min–30 min hands-on.
- **Redirect URI and scopes** (Checked): 15 min hands-on.
- **Authorize and token exchange** (Checked): 1 h–3 h hands-on.
- **Authorize and token exchange with PKCE** (Checked): 1 h 30 min–3 h 30 min hands-on.
- **Test with your own account** (Checked): 30 min–1 h hands-on.
- **Review materials (per item)** (Checked): 1 h–4 h per item hands-on.
- **Submit for review** (Checked): 15 min–30 min hands-on.
- **The provider does it (you wait)** (Checked): 0 h hands-on.
- **Any other step** (Checked): 15 min–1 h hands-on.

**Timing: waits and totals**
- **Provider-stated wait** (Checked): A wait the provider's own page states (for example a review reply within 5 business days).
- **Observed wait** (Checked): A wait seen in a check during this run.
- **Rule-based** (Checked): The clock's hands-on time comes from the rubric and there is no provider wait to cite.
- **Clock totals** (Checked): Working in dev = step 0 and the dev steps, added up. Ready for real users = that plus the production steps. Waits add up in order.

**Step links**
- **Where you do it** (Agent's judgement): The page in the provider's product where the step is done: a portal, console or settings page.
- **Where it's explained** (Agent's judgement): A docs page that explains the step.

**Validation**
- **Agrees** (Checked): Our guide and the provider's own docs or a setup attempt say the same.
- **Corrected** (Checked): Our guide differed, and the provider's docs or an attempt settled it.
- **Couldn't settle** (Checked): No provider source could decide it.

**Agent's judgement (other)**
- **Phase, likelihood, scope sensitivity** (Agent's judgement): The agent's reading: which part of the setup a step is, how often a risk bites, how sensitive a scope is.

_Researched 2026-10-29 by the OAuth Guide Agent._