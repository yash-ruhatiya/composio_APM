# Calendly: OAuth app setup

**Self-serve** (confidence: medium). Register a Calendly OAuth app yourself and choose the Production environment for real users. The docs I read describe no review step.

- Create the app in Calendly Developer tools; no approval step is documented. [e1 sourced]
  - The docs say to create a Sandbox app for development and a second Production app for real customer data. They mention no review.
- PKCE with S256 is mandatory. [e3 sourced]
  - Authorization requests without a code challenge fail.
- Refresh tokens are single-use and rotate. [e4 sourced] [e5 sourced]
  - Access tokens last 2 hours. Each refresh returns a new refresh token, and reusing an old one fails with invalid_grant.

- Working in dev: 2 h 45 min–5 h 30 min hands-on, no waiting
- Ready for real users: 3 h–6 h hands-on, no waiting
- OAuth for your users: You register an OAuth app. Calendly lets you create OAuth apps in Developer tools to access Calendly data on behalf of other users.
- An agent can do 5 of 6 steps (83%), 2 of them only with your OK.
- Top risk: **Refresh token reuse breaks connections** (common). Persist the new refresh token atomically and don't refresh in parallel. On invalid_grant, ask the user to reconnect. [e5 sourced]

**How we got the times** (hands-on hours from the rubric; waits only from a provider statement or an observation)

- Dev, step 1: Account or plan setup, 15 min
- Dev, step 2: App registration form, 15 min–30 min
- Dev, step 3: Redirect URI and scopes, 15 min
- Dev, step 4: Authorize and token exchange with PKCE, 1 h 30 min–3 h 30 min
- Real users, step 5: App registration form, 15 min–30 min
- Dev, step 6: Test with your own account, 30 min–1 h

## Steps to follow

**Getting to dev**

0. **Have these ready** (You). Done when: all in place.
   - Decide whether to request `(select in the app form)` (unknown) [e1 sourced]
1. **Sign in to Calendly Developer tools** (You · 15 min). [e1 sourced] [a1 tested]
   - Log in to Calendly or sign up.
   - Profile menu → Developer.
   - Older accounts may still use developer.calendly.com.
   - Explained at: Calendly → Profile → Developer (https://developer.calendly.com/docs/getting-started/overview)
   - ? Not confirmed: Whether a paid Calendly plan is needed for API or OAuth access was not confirmed.
   - Agent checked: **Corrected**. Moved to developer.calendly.com/docs/getting-started/overview. Updated step 1's link to developer.calendly.com/docs/getting-started/overview
   - **→ You take over here.** You do step 1; an agent can pick up after it
2. **Create a Sandbox OAuth app** (Agent · 15 min–30 min). Done when: Client ID, client secret, webhook signing key. [e1 sourced] [e6 sourced]
   - OAuth apps tab → Create OAuth app.
   - App name: letters, numbers, hyphens and spaces only.
   - Environment: Sandbox. Enter exactly one redirect URI.
   - Select at least one scope, then Create.
   - Rule: **Redirect URI rules**. Enter exactly one URI per app. Sandbox allows https and http on localhost. Production allows https only. [e6 sourced]
   - Explained at: Developer tools → OAuth apps → Create OAuth app (https://developer.calendly.com/docs/authentication/creating-an-oauth-app)
   - Redirect URI: `your app's OAuth callback URL`
   - Environment type: `Sandbox`
   - ? Not confirmed: Scopes page was not read; scope names and sensitivity are unknown.
   - ? Not confirmed: Step 2's link developer.calendly.com/docs/authentication/creating-an-oauth-app is a docs page, not the registration form; find the portal page where you create the app.
   - Agent checked: **Couldn't check**. Docs page, not the form ("Creating an OAuth app | Calendly | Developer Documentation")
3. **Save credentials in your app** (Agent, with your OK · 15 min). [e1 sourced]
   - Copy all three values on the creation screen.
   - The secret and signing key can't be viewed again.
   - Paste them into your agent's secret store, with your OK.
4. **Implement authorize and token exchange with PKCE** (Agent · 1 h 30 min–3 h 30 min). [e2 sourced] [e3 sourced] [e5 sourced]
   - Redirect the user to the authorize URL with a code_challenge.
   - POST the code to the token URL with code_verifier.
   - Use HTTP Basic client auth for server apps.
   - Overwrite the stored refresh token on every refresh.
   - Rule: **PKCE S256**. Every authorization request must include code_challenge and code_challenge_method=S256. [e3 sourced]
   - Rule: **Client authentication at token endpoint**. Server apps send client_id and client_secret with HTTP Basic auth. Always include client_id in the body. [e2 sourced]
   - Rule: **Refresh token rotation**. Store the new refresh_token from every refresh response and discard the old one. [e5 sourced]
   - Rule: **Token rate limit**. Only 8 OAuth tokens per user can be requested within 1 minute. [e4 sourced]
   - Explained at: Calendly API reference → Get Access Token (https://developer.calendly.com/api-docs/calendly-o-auth/o-auth/post-oauth-refresh-token)
   - Authorize URL: `https://auth.calendly.com/oauth/authorize`
   - Token URL: `https://auth.calendly.com/oauth/token`
   - code_challenge_method: `S256`
   - ⚠ Watch out: **Refresh token reuse breaks connections** (common). Persist the new refresh token atomically and don't refresh in parallel. On invalid_grant, ask the user to reconnect. [e5 sourced]
   - ? Not confirmed: Authorization code lifetime not stated on pages read.
   - ? Not confirmed: Discovery probe on auth.calendly.com found no metadata, and the authorize probe was blocked, so the endpoints are untested.
   - Agent checked: **Couldn't check**. Couldn't open: The result was withheld: the page left https://auth.calendly.com or closed, the user declined, or Claude's browser is no longer available. Use read_page to see the page before navigating again.
   - Agent checked: **Couldn't check**. Loaded, but didn't look like a token endpoint's reply
5. **Verify the token with Get current user** (Agent · 30 min–1 h). [e7 inferred]
   - GET https://api.calendly.com/users/me with Authorization: Bearer <access_token>.
   - Success is HTTP 200 with the user's resource and organization URIs.
   - Endpoint: `https://api.calendly.com/users/me`

✓ **Working in dev:** 2 h 45 min–5 h 30 min hands-on, no waiting

**Getting to real users**

6. **Create a Production OAuth app** (Agent, with your OK · 15 min–30 min). [e1 sourced] [e6 sourced]
   - Create a second app with Environment type Production.
   - The redirect URI must be https; localhost is not allowed.
   - Swap the production client ID and secret into your app.
   - Explained at: Developer tools → OAuth apps → Create OAuth app (https://developer.calendly.com/docs/authentication/creating-an-oauth-app)
   - Environment type: `Production`
   - ⚠ Watch out: **Production redirect must be HTTPS** (possible). Use an https callback URL in the Production app. [e6 sourced]
   - ? Not confirmed: No app review or go-live page was found. Searched 'Calendly OAuth app review go live'. Review may exist but isn't documented in the pages read.

✓ **Ready for real users:** 3 h–6 h hands-on, no waiting

**Not confirmed across the setup**

- ? Region or data-center-specific hosts were not stated on the pages read.
- ? Calendly's separate MCP server reportedly supports dynamic registration. I didn't verify this, and it isn't the third-party OAuth route used here.
- ? Review page not read; review time and requirements unconfirmed. (Searched 'Calendly developer production OAuth app review go live' and the docs. Found no review or publishing page; docs only describe Sandbox vs Production app types.)

---

## How this guide was checked

### At a glance

| Area | Finding | Evidence | Status | Next step |
|---|---|---|---|---|
| Difficulty | Self-serve | — | Confidence: medium | Read the steps below |
| Agent share | 5 of 6 steps (83%) | — | Counted from steps | See Steps to follow for who does each one |
| OAuth access | You register an OAuth app | — | From research | You: register an app with the provider |
| Time to dev | 2 h 45 min–5 h 30 min hands-on, no waiting | — | Needs checking | Estimate: time a real setup to confirm |
| Time to real users | 3 h–6 h hands-on, no waiting | — | Needs checking | Estimate: time a real setup to confirm |
| Review page | — | e1 | Not found | Find and read this page to confirm |
| Token page | https://developer.calendly.com/api-docs/calendly-o-auth/o-auth/post-oauth-refresh-token | e2, e4, e5 | Read | — |
| Discovery | auth.calendly.com | — | Nothing found | — |
| Authorize URL | https://auth.calendly.com/oauth/authorize?client_id=invalid&response_type=code&redirect_uri=https://example.com/callback | — | Couldn't run | Re-run the probe or open the URL yourself |
| Page | https://developer.calendly.com/docs/authentication/creating-an-oauth-app | — | Tested | — |
| Page | https://auth.calendly.com/oauth/token | — | Tested | — |
| Page | https://developer.calendly.com | — | Tested | — |
| Requirement | Calendly account | e1 | Sourced | You: have this ready |
| Requirement | PKCE S256 | e3 | Sourced | You: have this ready |
| Requirement | Redirect URI rules | e6 | Sourced | You: have this ready |
| Requirement | Client authentication at token endpoint | e2 | Sourced | You: have this ready |
| Requirement | Refresh token rotation | e5 | Sourced | You: have this ready |
| Requirement | Token rate limit | e4 | Sourced | You: have this ready |
| Scope | (select in the app form) | e1 | Sourced | Request only if your agent needs it |
| Blocker · common | Refresh token reuse breaks connections | e5 | Risk | Persist the new refresh token atomically and don't refresh in parallel. On invalid_grant, ask the user to reconnect. |
| Blocker · possible | Production redirect must be HTTPS | e6 | Risk | Use an https callback URL in the Production app. |
| Open question | No app review or go-live page was found. Searched 'Calendly OAuth app review go live'. Review may exist but isn't documented in the pages read. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Authorization code lifetime not stated on pages read. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Scopes page was not read; scope names and sensitivity are unknown. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Region or data-center-specific hosts were not stated on the pages read. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Whether a paid Calendly plan is needed for API or OAuth access was not confirmed. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Discovery probe on auth.calendly.com found no metadata, and the authorize probe was blocked, so the endpoints are untested. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Calendly's separate MCP server reportedly supports dynamic registration. I didn't verify this, and it isn't the third-party OAuth route used here. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Review page not read; review time and requirements unconfirmed. (Searched 'Calendly developer production OAuth app review go live' and the docs. Found no review or publishing page; docs only describe Sandbox vs Production app types.) | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Step 2's link developer.calendly.com/docs/authentication/creating-an-oauth-app is a docs page, not the registration form; find the portal page where you create the app. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |

### What the agent tried

Stage 2 picked the 4 weakest claims it can check by opening a page (4 sourced); claims already tested were skipped. Tried 4 things: 0 match the guide, 1 corrected, 3 couldn't check. Nothing was submitted or signed in.

| # | Claim from the guide | What the agent tried | Expected | Seen | Status | What changed / Your next step |
|---|---|---|---|---|---|---|
| 1 | Step 2: you register the app at developer.calendly.com/docs/authentication/creating-an-oauth-app (guide's evidence: Sourced) | Opened the registration page without signing in | A sign-in, sign-up or app registration form; form asks for redirect | Docs page, not the form ("Creating an OAuth app \| Calendly \| Developer Documentation") (probe p3) | Couldn't check | Added an open question |
| 2 | authorize at auth.calendly.com/oauth/authorize (guide's evidence: Sourced) | Opened it | — | Couldn't open: The result was withheld: the page left https://auth.calendly.com or closed, the user declined, or Claude's browser is no longer available. Use read_page to see the page before navigating again. | Couldn't check | No change |
| 3 | The token endpoint is auth.calendly.com/oauth/token (guide's evidence: Sourced) | Loaded it with a plain page request (no token request was sent) | A live OAuth endpoint (it answers a plain request with an error) | Loaded, but didn't look like a token endpoint's reply (probe p4) | Couldn't check | No change |
| 4 | Step 1 link goes to developer.calendly.com (guide's evidence: Sourced) | Opened the link and checked where it lands | Where you do "Calendly → Profile → Developer": a sign-in, sign-up, form or a page about it | Moved to developer.calendly.com/docs/getting-started/overview (probe p5) | Corrected | Updated step 1's link to developer.calendly.com/docs/getting-started/overview |
| → | Where the agent stopped | Step 1: Sign in to Calendly Developer tools | — | A step only you can do (account, legal terms, payment, verification or a decision) | You take over | You do step 1; an agent can pick up after it |

### What we couldn't confirm

- No app review or go-live page was found. Searched 'Calendly OAuth app review go live'. Review may exist but isn't documented in the pages read.
- Authorization code lifetime not stated on pages read.
- Scopes page was not read; scope names and sensitivity are unknown.
- Region or data-center-specific hosts were not stated on the pages read.
- Whether a paid Calendly plan is needed for API or OAuth access was not confirmed.
- Discovery probe on auth.calendly.com found no metadata, and the authorize probe was blocked, so the endpoints are untested.
- Calendly's separate MCP server reportedly supports dynamic registration. I didn't verify this, and it isn't the third-party OAuth route used here.
- Review page not read; review time and requirements unconfirmed. (Searched 'Calendly developer production OAuth app review go live' and the docs. Found no review or publishing page; docs only describe Sandbox vs Production app types.)
- Step 2's link developer.calendly.com/docs/authentication/creating-an-oauth-app is a docs page, not the registration form; find the portal page where you create the app.

### Evidence

- **e1** Sourced: OAuth apps are created in Developer tools, with Sandbox and Production environments; a second Production app is recommended for real customer data (https://developer.calendly.com/docs/authentication/creating-an-oauth-app)
  > Create a second app for Production when you are ready to use real customer data.
- **e2** Sourced: Token endpoint is https://auth.calendly.com/oauth/token with Basic client authentication for server apps (https://developer.calendly.com/docs/authentication/creating-an-oauth-app)
  > Send a POST request to Get Access Token at https://auth.calendly.com/oauth/token.
- **e3** Sourced: PKCE S256 is required (https://developer.calendly.com/docs/authentication/creating-an-oauth-app)
  > Every OAuth app must use Proof Key for Code Exchange (PKCE) with the S256 method.
- **e4** Sourced: Access tokens last 2 hours; refresh tokens don't expire until used; token request rate limit (https://developer.calendly.com/api-docs/calendly-o-auth/o-auth/post-oauth-refresh-token)
  > Access Tokens expire after 2 hours.
- **e5** Sourced: Refresh tokens are single-use and rotate (https://developer.calendly.com/docs/authentication/refresh-token-rotation-guide)
  > Each successful response from POST /oauth/token will still return a new access token and a new refresh token.
- **e6** Sourced: Redirect URI rules differ between Sandbox and Production (https://developer.calendly.com/docs/authentication/creating-an-oauth-app) _Sandbox allows https and http on localhost. Production allows https only._
  > Enter exactly one URI.
- **e7** Inferred: Get current user endpoint is used to test the access token _The developer account page says to test with the Get current user endpoint. The path /users/me is from general knowledge._
- **a1** Tested: Step 1's page now lives at developer.calendly.com/docs/getting-started/overview (probe p5) _Stage 2 attempt_

### How this was researched

Pipeline v2. 3 searches (0 failed), 4 of 4 pages read with real content, 5 probes. Claim check: 0 downgraded.

- Review page: Not found (Searched 'Calendly developer production OAuth app review go live' and the docs. Found no review or publishing page; docs only describe Sandbox vs Production app types.)
- Token page: Read: https://developer.calendly.com/api-docs/calendly-o-auth/o-auth/post-oauth-refresh-token (Also read the refresh token rotation guide.)

Searches:
- ok: Calendly developer OAuth create OAuth application
- ok: Calendly developer production OAuth app review go live
- ok: Calendly OAuth access token refresh token expiry

Pages:
- ok: https://developer.calendly.com/docs/authentication/creating-an-oauth-app (Creating an OAuth app | Calendly | Developer Documentation, 3876 chars)
- ok: https://developer.calendly.com/api-docs/calendly-o-auth/o-auth/post-oauth-refresh-token (Get Access Token | Calendly | Developer Documentation, 3228 chars)
- ok: https://developer.calendly.com/docs/authentication/refresh-token-rotation-guide (How to handle single-use refresh tokens | Calendly | Developer Documentation, 7321 chars)
- ok: https://developer.calendly.com/create-a-developer-account (Page not found, 3058 chars, read via plain-text copy https://developer.calendly.com/page-data/create-a-developer-account/page-data.json)

Probes:
- p1 negative: No OAuth/OIDC discovery metadata on auth.calendly.com. Not conclusive: many providers don't publish it. (auth.calendly.com)
- p2 error: Probe failed: the browser wouldn't show this page (it redirected to another site or was blocked) (https://auth.calendly.com/oauth/authorize?client_id=invalid&response_type=code&redirect_uri=https://example.com/callback)
- p3 positive: Opened the registration page without signing in: docs (https://developer.calendly.com/docs/authentication/creating-an-oauth-app)
- p4 positive: Loaded it with a plain page request (no token request was sent): loaded (https://auth.calendly.com/oauth/token)
- p5 positive: Opened the link and checked where it lands: moved (https://developer.calendly.com)

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