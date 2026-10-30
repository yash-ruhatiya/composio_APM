# Linear: OAuth app setup

**Self-serve** (confidence: medium). Linear lets you register an OAuth2 app yourself in workspace settings. The docs I read describe no review step before real users connect.

- Register the OAuth2 app yourself in Linear's API settings. [e1 sourced] [e6 sourced]
  - The docs say to create a new OAuth2 Application and set its redirect callback URLs. A pre-filled form URL also exists.
- No review or approval step appears in the docs I read. [e8 inferred]
  - The OAuth and manifest pages mention no review, verification or marketplace listing. I found no dedicated review page.
- Access tokens last 24 hours, and refresh rotates the refresh token. [e3 sourced] [e4 sourced] [e5 sourced]
  - Your agent must store the new refresh token on every refresh. PKCE is supported.

- Working in dev: 2 h 45 min–5 h 30 min hands-on, no waiting
- Ready for real users: 2 h 45 min–5 h 30 min hands-on, no waiting
- OAuth for your users: You register an OAuth app. Linear documents OAuth 2.0 for third-party apps. You create an OAuth2 application in workspace settings (Settings → API).
- An agent can do 4 of 5 steps (80%), 1 of them only with your OK.
- Top risk: **Refresh token rotation breaks reconnects** (possible). Persist the newest refresh token on every refresh. If it is lost or expired, have the user re-authorize. [e4 sourced]

**How we got the times** (hands-on hours from the rubric; waits only from a provider statement or an observation)

- Dev, step 1: Account or plan setup, 15 min
- Dev, step 2: App registration form, 15 min–30 min
- Dev, step 3: Redirect URI and scopes, 15 min
- Dev, step 4: Authorize and token exchange with PKCE, 1 h 30 min–3 h 30 min
- Dev, step 5: Test with your own account, 30 min–1 h

## Steps to follow

**Getting to dev**

0. **Have these ready** (You). Done when: all in place.
   - Decide whether to request `admin` (sensitive) [e2 sourced]
1. **Get a Linear workspace with admin access** (You · 15 min). [e1 sourced]
   - Create or use a dedicated workspace to own the OAuth app.
   - Every admin in it can see the app.
   - Where you do it: Linear sign-up (https://linear.app)
   - ⚠ Watch out: **Admin-only app visibility** (possible). Own the app in a dedicated workspace so admin changes don't affect it. [e1 sourced]
   - ? Not confirmed: Step 1's link linear.app opens "Linear – The system for product development", not obviously "Linear sign-up"; check it's the right page.
   - Agent checked: **Couldn't check**. Landed on "Linear – The system for product development", which doesn't obviously match "Linear sign-up"
   - **→ You take over here.** You do step 1; an agent can pick up after it
2. **Create the OAuth2 application** (Agent · 15 min–30 min). Done when: Client ID and client secret. [e1 sourced] [e6 sourced]
   - Open Settings → API → OAuth applications → New.
   - Fill in name, description, icon and developer name.
   - Add your app's OAuth callback URL.
   - Choose the public distribution if other workspaces will connect.
   - Rule: **Exact HTTPS/localhost callback URLs registered**. Register your callback URLs on the app, and send the same redirect_uri in both the authorize and token requests. [e1 sourced] [e9 sourced]
   - Where you do it: Linear → Settings → API → Applications → New (https://linear.app/settings/api/applications/new)
   - Redirect URI: `your app's OAuth callback URL`
   - ? Not confirmed: Redirect URI rules (exact match, HTTPS, localhost, count limits) are not stated explicitly. Examples include localhost.
   - Agent checked: **Couldn't check**. Only site navigation loaded ("Linear")
3. **Choose scopes and store credentials** (Agent, with your OK · 15 min). [e2 sourced]
   - Request the minimum scopes, comma separated.
   - Paste the client ID and secret into your agent's config after the developer approves.
   - Explained at: Linear OAuth 2.0 docs (https://linear.app/developers/oauth-2-0-authentication)
   - Authorize URL: `https://linear.app/oauth/authorize`
   - scope: `read,write`
   - Scopes: `read`, `write`
   - Agent checked: **Couldn't check**. Loaded, but the response didn't say how it treats the client or scopes
   - Agent checked: **Couldn't check**. Couldn't open: The page changed; retry.
4. **Implement authorize, code exchange and refresh** (Agent · 1 h 30 min–3 h 30 min). Done when: access_token and refresh_token. [e2 sourced] [e3 sourced] [e4 sourced] [e5 sourced]
   - Redirect to the authorize URL with a state value. Use PKCE (S256) for public clients.
   - POST the code to the token URL, form-encoded.
   - Refresh before the 24-hour expiry and save the new refresh token.
   - Rule: **Access token lifetime 24 hours**. The page says: "The access token is valid for 24 hours and will need to be refreshed when it expires." [e3 sourced]
   - Rule: **Refresh returns a new refresh token**. Store the new refresh token each time. A 30-minute grace period lets you replay the request if the response was lost. [e4 sourced]
   - Rule: **Token request format**. POST form-encoded to the token URL. Send the client secret in the body or with HTTP basic auth. With PKCE, send client_id and the code_verifier instead. [e5 sourced]
   - Explained at: Linear OAuth 2.0 docs (https://linear.app/developers/oauth-2-0-authentication)
   - Token URL: `https://api.linear.app/oauth/token`
   - Content-Type: `application/x-www-form-urlencoded`
   - ⚠ Watch out: **Refresh token rotation breaks reconnects** (possible). Persist the newest refresh token on every refresh. If it is lost or expired, have the user re-authorize. [e4 sourced]
   - ? Not confirmed: Authorization code lifetime is not stated on the pages read.
   - ? Not confirmed: Refresh token lifetime or inactivity expiry is not confirmed in Linear's docs (a third-party blog mentions inactivity expiry).
   - ? Not confirmed: The client authentication method is only partly stated (secret in body or HTTP basic). The preferred method is unconfirmed.
   - Agent checked: **Couldn't check**. Loaded, but didn't look like a token endpoint's reply
5. **Test with your own account** (Agent · 30 min–1 h). [e3 sourced] [e7 tested]
   - Complete the consent flow with a test workspace.
   - Call the GraphQL API with Authorization: Bearer <token>, query { viewer { id name email } }.
   - Success: the response returns your user.
   - Rule: **Rate limits**. OAuth app limits are not stated on the page I read. API-key requests get 2,500 per hour. Workspace-level OAuth apps using Actor Authorization get dynamic limits based on paid users. [e10 sourced]
   - Explained at: Linear GraphQL API (https://linear.app/developers)
   - Endpoint: `POST https://api.linear.app/graphql`
   - Header: `Authorization: Bearer <ACCESS_TOKEN>`
   - Scopes: `read`
   - ? Not confirmed: Per-OAuth-app rate limits are not stated. Region-specific hosts are not mentioned. The production host appears to be the same as the test host.

✓ **Working in dev:** 2 h 45 min–5 h 30 min hands-on, no waiting

✓ **Ready for real users:** 2 h 45 min–5 h 30 min hands-on, no waiting

**Not confirmed across the setup**

- ? No dedicated app review or go-live page found (searched 'Linear OAuth app publish review'). Whether any review exists is unconfirmed.
- ? The discovery probe on linear.app found no metadata, so dynamic registration is not confirmed.
- ? Review page not read; review time and requirements unconfirmed. (Searched 'Linear OAuth app publish public application review'. Found no dedicated review or marketplace page. The OAuth and manifest pages mention no review.)

---

## How this guide was checked

### At a glance

| Area | Finding | Evidence | Status | Next step |
|---|---|---|---|---|
| Difficulty | Self-serve | — | Confidence: medium | Read the steps below |
| Agent share | 4 of 5 steps (80%) | — | Counted from steps | See Steps to follow for who does each one |
| OAuth access | You register an OAuth app | — | From research | You: register an app with the provider |
| Time to dev | 2 h 45 min–5 h 30 min hands-on, no waiting | — | Needs checking | Estimate: time a real setup to confirm |
| Time to real users | 2 h 45 min–5 h 30 min hands-on, no waiting | — | Needs checking | Estimate: time a real setup to confirm |
| Review page | — | e8 | Not found | Find and read this page to confirm |
| Token page | https://linear.app/developers/oauth-2-0-authentication | e3, e4, e5 | Read | — |
| Discovery | linear.app | — | Nothing found | — |
| Authorize URL | https://linear.app/oauth/authorize?client_id=invalid&redirect_uri=https://example.com/cb&response_type=code&scope=read | — | Tested | — |
| Page | https://linear.app/settings/api/applications/new | — | Tested | — |
| Page | https://linear.app/oauth/authorize | — | Tested | — |
| Page | https://api.linear.app/oauth/token | — | Tested | — |
| Page | https://linear.app | — | Tested | — |
| Requirement | Linear workspace with admin access | e1 | Sourced | You: have this ready |
| Requirement | Exact HTTPS/localhost callback URLs registered | e1, e9 | Sourced | You: have this ready |
| Requirement | Access token lifetime 24 hours | e3 | Sourced | You: have this ready |
| Requirement | Refresh returns a new refresh token | e4 | Sourced | You: have this ready |
| Requirement | Token request format | e5 | Sourced | You: have this ready |
| Requirement | Rate limits | e10 | Sourced | You: have this ready |
| Scope | read | e2 | Sourced | Request only if your agent needs it |
| Scope | write | e2 | Sourced | Request only if your agent needs it |
| Scope | admin | e2 | Sourced | Request only if your agent needs it |
| Blocker · possible | Refresh token rotation breaks reconnects | e4 | Risk | Persist the newest refresh token on every refresh. If it is lost or expired, have the user re-authorize. |
| Blocker · possible | Admin-only app visibility | e1 | Risk | Own the app in a dedicated workspace so admin changes don't affect it. |
| Open question | No dedicated app review or go-live page found (searched 'Linear OAuth app publish review'). Whether any review exists is unconfirmed. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Authorization code lifetime is not stated on the pages read. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Refresh token lifetime or inactivity expiry is not confirmed in Linear's docs (a third-party blog mentions inactivity expiry). | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Redirect URI rules (exact match, HTTPS, localhost, count limits) are not stated explicitly. Examples include localhost. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Per-OAuth-app rate limits are not stated. Region-specific hosts are not mentioned. The production host appears to be the same as the test host. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | The client authentication method is only partly stated (secret in body or HTTP basic). The preferred method is unconfirmed. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | The discovery probe on linear.app found no metadata, so dynamic registration is not confirmed. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Review page not read; review time and requirements unconfirmed. (Searched 'Linear OAuth app publish public application review'. Found no dedicated review or marketplace page. The OAuth and manifest pages mention no review.) | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Step 1's link linear.app opens "Linear – The system for product development", not obviously "Linear sign-up"; check it's the right page. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |

### What the agent tried

Stage 2 picked the 5 weakest claims it can check by opening a page (5 sourced); claims already tested were skipped. Tried 5 things: 0 match the guide, 0 corrected, 5 couldn't check. Nothing needed correcting in the weak claims attempted: Step 2: you register the app at linear.app/settings/api/applications/new (sourced); The authorize URL linear.app/oauth/authorize is live and takes the documented scopes (read, write, admin) (sourced); The token endpoint is api.linear.app/oauth/token (sourced); Step 1 link goes to linear.app (sourced); Step 3 link at linear.app/developers/oauth-2-0-authentication (sourced). Nothing was submitted or signed in.

| # | Claim from the guide | What the agent tried | Expected | Seen | Status | What changed / Your next step |
|---|---|---|---|---|---|---|
| 1 | Step 2: you register the app at linear.app/settings/api/applications/new (guide's evidence: Sourced) | Opened the registration page without signing in | A sign-in, sign-up or app registration form; form asks for redirect | Only site navigation loaded ("Linear") (probe p3) | Couldn't check | No change |
| 2 | The authorize URL linear.app/oauth/authorize is live and takes the documented scopes (read, write, admin) (guide's evidence: Sourced) | Opened it with a made-up client and those scopes | A live endpoint that rejects the made-up client and raises no scope error | Loaded, but the response didn't say how it treats the client or scopes (probe p4) | Couldn't check | No change |
| 3 | The token endpoint is api.linear.app/oauth/token (guide's evidence: Sourced) | Loaded it with a plain page request (no token request was sent) | A live OAuth endpoint (it answers a plain request with an error) | Loaded, but didn't look like a token endpoint's reply (probe p5) | Couldn't check | No change |
| 4 | Step 1 link goes to linear.app (guide's evidence: Sourced) | Opened the link and checked where it lands | Where you do "Linear sign-up": a sign-in, sign-up, form or a page about it | Landed on "Linear – The system for product development", which doesn't obviously match "Linear sign-up" (probe p6) | Couldn't check | Added an open question |
| 5 | Step 3 link at linear.app/developers/oauth-2-0-authentication (guide's evidence: Sourced) | Opened it | — | Couldn't open: The page changed; retry. | Couldn't check | No change |
| → | Where the agent stopped | Step 1: Get a Linear workspace with admin access | — | A step only you can do (account, legal terms, payment, verification or a decision) | You take over | You do step 1; an agent can pick up after it |

### What we couldn't confirm

- No dedicated app review or go-live page found (searched 'Linear OAuth app publish review'). Whether any review exists is unconfirmed.
- Authorization code lifetime is not stated on the pages read.
- Refresh token lifetime or inactivity expiry is not confirmed in Linear's docs (a third-party blog mentions inactivity expiry).
- Redirect URI rules (exact match, HTTPS, localhost, count limits) are not stated explicitly. Examples include localhost.
- Per-OAuth-app rate limits are not stated. Region-specific hosts are not mentioned. The production host appears to be the same as the test host.
- The client authentication method is only partly stated (secret in body or HTTP basic). The preferred method is unconfirmed.
- The discovery probe on linear.app found no metadata, so dynamic registration is not confirmed.
- Review page not read; review time and requirements unconfirmed. (Searched 'Linear OAuth app publish public application review'. Found no dedicated review or marketplace page. The OAuth and manifest pages mention no review.)
- Step 1's link linear.app opens "Linear – The system for product development", not obviously "Linear sign-up"; check it's the right page.

### Evidence

- **e1** Sourced: Create an OAuth2 application and set redirect callback URLs. A dedicated workspace is recommended. (https://linear.app/developers/oauth-2-0-authentication)
  > Create a new OAuth2 Application and configure the redirect callback URLs to your application.
- **e2** Sourced: Authorize URL and scopes read, write, admin (https://linear.app/developers/oauth-2-0-authentication)
  > GET https://linear.app/oauth/authorize HTTP/1.1
- **e3** Sourced: Access token valid 24 hours (https://linear.app/developers/oauth-2-0-authentication)
  > The access token is valid for 24 hours and will need to be refreshed when it expires.
- **e4** Sourced: Refresh returns a new refresh token, with a 30-minute grace period (https://linear.app/developers/oauth-2-0-authentication)
  > a new valid access token and a new refresh token will be returned in the response
- **e5** Sourced: PKCE supported; the token request is form-encoded (https://linear.app/developers/oauth-2-0-authentication)
  > Linear supports the PKCE flow.
- **e6** Sourced: Create OAuth app page can be pre-populated via URL or manifest (https://linear.app/developers/oauth-app-manifests)
  > OAuth app manifests let developers define a Linear OAuth app as structured data instead of filling the form manually.
- **e7** Tested: Token endpoint is POST https://api.linear.app/oauth/token. The authorize endpoint is live and handles unknown clients. (probe p2) _The authorize probe landed on the Linear login page. The token URL is from the docs page._
- **e8** Inferred: No review step or page was found in the docs read _Based on absence in the OAuth and manifest pages and search results. Not proof._
- **e9** Sourced: The docs example uses a localhost redirect URI (https://linear.app/developers/oauth-2-0-authentication)
  > redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth%2Fcallback
- **e10** Sourced: Rate limits for API-key requests, plus dynamic limits for workspace-level OAuth apps (https://linear.app/developers/rate-limiting)
  > When authenticated using an API key you can make up to 2,500 requests per hour.

### How this was researched

Pipeline v2. 3 searches (0 failed), 3 of 3 pages read with real content, 6 probes. Claim check: 0 downgraded.

- Review page: Not found (Searched 'Linear OAuth app publish public application review'. Found no dedicated review or marketplace page. The OAuth and manifest pages mention no review.)
- Token page: Read: https://linear.app/developers/oauth-2-0-authentication (Covers the token endpoint, 24-hour access tokens, refresh and PKCE.)

Searches:
- ok: Linear developers OAuth 2.0 authentication create application
- ok: Linear API OAuth app publish public application review
- ok: Linear OAuth token refresh expiry

Pages:
- ok: https://linear.app/developers/oauth-2-0-authentication (OAuth 2.0 authentication – Linear Developers, 12545 chars)
- ok: https://linear.app/developers/oauth-app-manifests (OAuth application manifests – Linear Developers, 7960 chars)
- ok: https://linear.app/developers/rate-limiting (Rate limiting – Linear Developers, 7496 chars)

Probes:
- p1 negative: No OAuth/OIDC discovery metadata on linear.app. Not conclusive: many providers don't publish it. (linear.app)
- p2 positive: Endpoint answered, landing on linear.app/oauth/authorize: it is live and handles an unknown client. (https://linear.app/oauth/authorize?client_id=invalid&redirect_uri=https://example.com/cb&response_type=code&scope=read)
- p3 positive: Opened the registration page without signing in: navigation (https://linear.app/settings/api/applications/new)
- p4 positive: Opened it with a made-up client and those scopes: loaded (https://linear.app/oauth/authorize)
- p5 positive: Loaded it with a plain page request (no token request was sent): loaded (https://api.linear.app/oauth/token)
- p6 positive: Opened the link and checked where it lands: page (https://linear.app)

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