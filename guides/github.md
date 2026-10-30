# GitHub: OAuth app setup

**Self-serve** (confidence: medium). GitHub OAuth apps are self-serve: register in Developer settings and any user can authorize them, with no review step found in the docs read.

- Register an OAuth app in Developer settings, no approval step [e1 sourced]
  - The creating-an-app page lists only form fields and 'Register application'. It mentions no review or verification.
- Organizations can still block your app [e4 sourced]
  - Org owners with OAuth app access restrictions must approve your app before members can use it on org resources. New orgs have restrictions on by default.
- Expiring tokens are on by default for new apps [e2 sourced] [e6 sourced]
  - Access tokens last 8 hours and refresh tokens 6 months. Your agent must handle refresh.

- Working in dev: 3 h–5 h 45 min hands-on, no waiting
- Ready for real users: 3 h 15 min–6 h 45 min hands-on, no waiting
- OAuth for your users: You register an OAuth app. Anyone can register an OAuth app under Settings → Developer settings → OAuth apps. No review is described in the pages read.
- An agent can do 4 of 6 steps (67%), 1 of them only with your OK.
- Top risk: **Organization OAuth app access restrictions** (common). Ask an org owner to approve your app. Or have the user authorize only their personal resources. [e4 sourced]

**How we got the times** (hands-on hours from the rubric; waits only from a provider statement or an observation)

- Dev, step 0: Account or plan setup, 15 min
- Dev, step 1: Account or plan setup, 15 min
- Dev, step 2: App registration form, 15 min–30 min
- Dev, step 3: Redirect URI and scopes, 15 min
- Dev, step 4: Authorize and token exchange with PKCE, 1 h 30 min–3 h 30 min
- Real users, step 5: Any other step, 15 min–1 h
- Dev, step 6: Test with your own account, 30 min–1 h

## Steps to follow

**Getting to dev**

0. **Have these ready** (You). Done when: all in place.
   - **GitHub account**. A personal account, or an organization you administer, to own the OAuth app. [e1 sourced]
   - Decide whether to request `repo` (unknown) [e7 sourced]
1. **Sign in and decide the owner** (You · 15 min). [e1 sourced] [e4 sourced]
   - Choose a personal account or an organization you administer as the app owner.
   - An organization-owned app is automatically trusted by that organization.
   - Where you do it: GitHub → Settings → Developer settings (https://github.com/settings/developers)
   - Agent checked: **Couldn't check**. Behind a sign-in, so whether the page exists couldn't be seen
   - **→ You take over here.** Sign in at github.com/settings/developers, then an agent can continue
2. **Register the OAuth app** (Agent · 15 min–30 min). Done when: Client ID. [e1 sourced] [a1 tested]
   - Click New OAuth App.
   - Fill name, homepage URL and the authorization callback URL.
   - Optionally enable Device Flow.
   - Leave 'Expire user access tokens' on if your agent supports refresh.
   - Rule: **Callback URL rules**. Up to 10 callback URLs per app. Wildcard matching is a per-URL setting, on only for apps that had a single callback URL before August 3, 2026. If yours has it, turn it off unless you need it; with it off, the redirect URL must match the callback URL exactly. [e1 sourced] [e6 sourced]
   - Where you do it: Developer settings → OAuth apps → New OAuth App (https://github.com/settings/applications/new)
   - Authorization callback URL: `your app's OAuth callback URL (HTTPS, up to 10)`
   - Homepage URL: `your app's public website`
   - ⚠ Watch out: **SDK doesn't support refresh tokens** (possible). Add refresh handling. Or temporarily uncheck 'Expire user access tokens'. [e1 sourced] [e6 sourced]
   - Agent checked: **Matches the guide**. A sign-in page: you sign in before this step
3. **Generate the client secret and configure your agent** (Agent, with your OK · 15 min). Done when: Client secret stored. [e2 sourced] [e7 sourced] [a2 tested]
   - Generate a client secret on the app's settings page.
   - Paste the client ID and secret into your agent's config. This needs your OK.
   - Request scopes at authorize time with the scope parameter, plus offline_access.
   - Where you do it: Developer settings → your OAuth app (https://github.com/settings/developers)
   - Authorize URL: `https://github.com/login/oauth/authorize`
   - Token URL: `https://github.com/login/oauth/access_token`
   - Scopes: `offline_access`, `read:user`
   - ? Not confirmed: Scope sensitivity and the full scope list were not read.
   - Agent checked: **Matches the guide**. Live; it asks the user to sign in before showing consent, so the scopes weren't visible
   - Agent checked: **Couldn't check**. Not found for a plain page request; endpoints that only take POST often answer this way
4. **Run the authorization code flow with PKCE** (Agent · 1 h 30 min–3 h 30 min). Done when: Access and refresh tokens. [e2 sourced] [e3 sourced]
   - Redirect to the authorize URL with client_id, redirect_uri, scope, state, code_challenge.
   - Exchange the code within 10 minutes via POST to the token URL.
   - Store the refresh token and use it before the 8-hour expiry.
   - Rule: **Authorization code lifetime**. The temporary code expires after 10 minutes, so exchange it promptly. [e3 sourced]
   - Rule: **Token lifetimes and refresh**. Expiring tokens: access token 8 hours, refresh token 6 months without use. A refresh returns a new access token and a new refresh token. Check for expires_in in the response. [e2 sourced] [e7 sourced]
   - Rule: **Client secret and PKCE**. The client secret is needed to get tokens unless you use device flow. PKCE (code_challenge) is strongly recommended. [e2 sourced] [e7 sourced]
   - Explained at: GitHub Docs → Authorizing OAuth apps (https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
   - ? Not confirmed: Client authentication method at the token endpoint (client_id and client_secret in the POST body) was not confirmed on the pages read.
   - ? Not confirmed: Rate limits for OAuth token requests were not found on the pages read.
5. **Verify the token with a read-only call** (Agent · 30 min–1 h). Done when: 200 with user JSON.
   - Call GET https://api.github.com/user with the header Authorization: Bearer <access_token>.
   - Success is HTTP 200 with your login and id.
   - Explained at: GitHub Docs → REST API users (https://docs.github.com/en/rest/users/users)
   - Endpoint: `GET https://api.github.com/user`
   - Scopes: `read:user`

✓ **Working in dev:** 3 h–5 h 45 min hands-on, no waiting

**Getting to real users**

6. **Prepare for organization approval** (You · 15 min–1 h). [e4 sourced] [a3 tested]
   - Users in organizations with OAuth app access restrictions need an owner to approve your app.
   - Tell users to request approval or ask an org owner to approve it.
   - Check whether you need to add branding or a publisher domain, which the docs read did not cover.
   - Explained at: GitHub Docs → Approving OAuth apps for your organization (https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization)
   - ⚠ Watch out: **Organization OAuth app access restrictions** (common). Ask an org owner to approve your app. Or have the user authorize only their personal resources. [e4 sourced]
   - Agent checked: **Matches the guide**. Loads "Approving OAuth apps for your organization - GitHub Docs"

✓ **Ready for real users:** 3 h 15 min–6 h 45 min hands-on, no waiting

**Not confirmed across the setup**

- ? No app review or go-live page found for OAuth apps. The docs read show no review, but this is not stated explicitly.
- ? Region or data-center hosts: GitHub Enterprise Server and Enterprise Cloud with data residency use different hosts. Not covered by the pages read.
- ? User caps or unverified-app warnings were not mentioned in the pages read.
- ? Discovery metadata was not found on github.com. This does not mean there is no OAuth.
- ? Review page not read; review time and requirements unconfirmed. (Searched 'GitHub creating an OAuth app' and 'OAuth app organization approval'. Found no OAuth app review or go-live page. Only per-organization approval exists.)

---

## How this guide was checked

### At a glance

| Area | Finding | Evidence | Status | Next step |
|---|---|---|---|---|
| Difficulty | Self-serve | — | Confidence: medium | Read the steps below |
| Agent share | 4 of 6 steps (67%) | — | Counted from steps | See Steps to follow for who does each one |
| OAuth access | You register an OAuth app | — | From research | You: register an app with the provider |
| Time to dev | 3 h–5 h 45 min hands-on, no waiting | — | Needs checking | Estimate: time a real setup to confirm |
| Time to real users | 3 h 15 min–6 h 45 min hands-on, no waiting | — | Needs checking | Estimate: time a real setup to confirm |
| Review page | — | e1, e4 | Not found | Find and read this page to confirm |
| Token page | https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps | e2, e3 | Read | — |
| Discovery | github.com | — | Nothing found | — |
| Authorize URL | https://github.com/login/oauth/authorize?client_id=invalid&response_type=code | — | Tested | — |
| Page | https://github.com/settings/applications/new | — | Tested | — |
| Page | https://github.com/login/oauth/authorize | — | Tested | — |
| Page | https://github.com/login/oauth/access_token | — | Nothing found | — |
| Page | https://github.com/settings/developers | — | Tested | — |
| Page | https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization | — | Tested | — |
| Requirement | GitHub account | e1 | Sourced | You: have this ready |
| Requirement | Callback URL rules | e1, e6 | Sourced | You: have this ready |
| Requirement | Authorization code lifetime | e3 | Sourced | You: have this ready |
| Requirement | Token lifetimes and refresh | e2, e7 | Sourced | You: have this ready |
| Requirement | Client secret and PKCE | e2, e7 | Sourced | You: have this ready |
| Scope | offline_access | e2 | Sourced | Request only if your agent needs it |
| Scope | repo | e7 | Sourced | Request only if your agent needs it |
| Scope | read:user | — | Needs checking | Confirm in the provider's docs or with a hands-on setup |
| Blocker · common | Organization OAuth app access restrictions | e4 | Risk | Ask an org owner to approve your app. Or have the user authorize only their personal resources. |
| Blocker · possible | SDK doesn't support refresh tokens | e1, e6 | Risk | Add refresh handling. Or temporarily uncheck 'Expire user access tokens'. |
| Open question | No app review or go-live page found for OAuth apps. The docs read show no review, but this is not stated explicitly. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Client authentication method at the token endpoint (client_id and client_secret in the POST body) was not confirmed on the pages read. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Rate limits for OAuth token requests were not found on the pages read. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Region or data-center hosts: GitHub Enterprise Server and Enterprise Cloud with data residency use different hosts. Not covered by the pages read. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Scope sensitivity and the full scope list were not read. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | User caps or unverified-app warnings were not mentioned in the pages read. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Discovery metadata was not found on github.com. This does not mean there is no OAuth. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Review page not read; review time and requirements unconfirmed. (Searched 'GitHub creating an OAuth app' and 'OAuth app organization approval'. Found no OAuth app review or go-live page. Only per-organization approval exists.) | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |

### What the agent tried

Stage 2 picked the 5 weakest claims it can check by opening a page (5 sourced); claims already tested were skipped. Tried 5 things: 3 match the guide, 0 corrected, 2 couldn't check. Nothing needed correcting in the weak claims attempted: Step 2: you register the app at github.com/settings/applications/new (sourced); The authorize URL github.com/login/oauth/authorize is live and takes the documented scopes (offline_access, read:user, repo) (sourced); The token endpoint is github.com/login/oauth/access_token (sourced); Step 1 link goes to github.com/settings/developers (sourced); Step 5 link goes to docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization (sourced). Nothing was submitted or signed in.

| # | Claim from the guide | What the agent tried | Expected | Seen | Status | What changed / Your next step |
|---|---|---|---|---|---|---|
| 1 | Step 2: you register the app at github.com/settings/applications/new (guide's evidence: Sourced) | Opened the registration page without signing in | A sign-in, sign-up or app registration form; form asks for redirect, website | A sign-in page: you sign in before this step (probe p3) | Matches the guide | Added tested evidence a1 (probe p3) |
| 2 | The authorize URL github.com/login/oauth/authorize is live and takes the documented scopes (offline_access, read:user, repo) (guide's evidence: Sourced) | Opened it with a made-up client and those scopes | A live endpoint that rejects the made-up client and raises no scope error | Live; it asks the user to sign in before showing consent, so the scopes weren't visible (probe p4) | Matches the guide | Added tested evidence a2 (probe p4) |
| 3 | The token endpoint is github.com/login/oauth/access_token (guide's evidence: Sourced) | Loaded it with a plain page request (no token request was sent) | A live OAuth endpoint (it answers a plain request with an error) | Not found for a plain page request; endpoints that only take POST often answer this way (probe p5) | Couldn't check | No change: a not-found here doesn't prove the URL is wrong |
| 4 | Step 1 link goes to github.com/settings/developers (guide's evidence: Sourced) | Opened the link and checked where it lands | Where you do "GitHub → Settings → Developer settings": a sign-in, sign-up, form or a page about it | Behind a sign-in, so whether the page exists couldn't be seen (probe p6) | Couldn't check | No change |
| 5 | Step 5 link goes to docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization (guide's evidence: Sourced) | Opened the link and checked where it lands | A docs page about "GitHub Docs → Approving OAuth apps for your organization" | Loads "Approving OAuth apps for your organization - GitHub Docs" (probe p7) | Matches the guide | Added tested evidence a3 (probe p7) |
| → | Where the agent stopped | Step 1: Sign in and decide the owner | — | A sign-in page | You take over | Sign in at github.com/settings/developers, then an agent can continue |

### What we couldn't confirm

- No app review or go-live page found for OAuth apps. The docs read show no review, but this is not stated explicitly.
- Client authentication method at the token endpoint (client_id and client_secret in the POST body) was not confirmed on the pages read.
- Rate limits for OAuth token requests were not found on the pages read.
- Region or data-center hosts: GitHub Enterprise Server and Enterprise Cloud with data residency use different hosts. Not covered by the pages read.
- Scope sensitivity and the full scope list were not read.
- User caps or unverified-app warnings were not mentioned in the pages read.
- Discovery metadata was not found on github.com. This does not mean there is no OAuth.
- Review page not read; review time and requirements unconfirmed. (Searched 'GitHub creating an OAuth app' and 'OAuth app organization approval'. Found no OAuth app review or go-live page. Only per-organization approval exists.)

### Evidence

- **e1** Sourced: Register OAuth apps in Developer settings, up to 10 callback URLs, no review mentioned (https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
  > You can enter up to 10 callback URLs.
- **e2** Sourced: Expiring tokens: 8-hour access token, 6-month refresh token, new pair on refresh (https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
  > The access token expires after eight hours, and the refresh token expires after six months without use.
- **e3** Sourced: Authorization code lifetime is 10 minutes (https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
  > The temporary code will expire after 10 minutes.
- **e4** Sourced: Orgs with OAuth app access restrictions require owner approval (https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/about-oauth-app-access-restrictions)
  > When you create a new organization, OAuth app access restrictions are enabled by default.
- **e5** Tested: Authorize endpoint is live and handles unknown clients by redirecting to login (probe p2)
- **e6** Sourced: New apps get short-lived tokens by default; wildcard redirect matching on single-URI apps (https://github.blog/changelog/2026-08-14-multiple-redirect-uris-and-token-refresh-for-oauth-apps/)
  > Short-lived tokens are enabled by default for all new applications.
- **e7** Sourced: Client secret required for token generation unless device flow; PKCE recommended (https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/best-practices-for-creating-an-oauth-app)
  > Client secrets are required to generate access tokens for your app, unless your app uses the device flow.
- **a1** Tested: github.com/settings/applications/new asks the developer to sign in first (probe p3) _Stage 2 attempt_
- **a2** Tested: The authorize URL github.com/login/oauth/authorize is live and shows a sign-in page (probe p4) _Stage 2 attempt_
- **a3** Tested: docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization loads (Approving OAuth apps for your organization - GitHub Docs) (probe p7) _Stage 2 attempt_

### How this was researched

Pipeline v2. 3 searches (0 failed), 5 of 5 pages read with real content, 7 probes. Claim check: 0 downgraded.

- Review page: Not found (Searched 'GitHub creating an OAuth app' and 'OAuth app organization approval'. Found no OAuth app review or go-live page. Only per-organization approval exists.)
- Token page: Read: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps

Searches:
- ok: GitHub creating an OAuth app docs
- ok: GitHub OAuth app authorizing access token refresh expiration
- ok: GitHub OAuth app organization access restrictions third-party approval

Pages:
- ok: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app (Creating an OAuth app - GitHub Docs, 2146 chars)
- ok: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps (Authorizing OAuth apps - GitHub Docs, 25222 chars)
- ok: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/best-practices-for-creating-an-oauth-app (Best practices for creating an OAuth app - GitHub Docs, 11108 chars)
- ok: https://github.blog/changelog/2026-08-14-multiple-redirect-uris-and-token-refresh-for-oauth-apps/ (Multiple redirect URIs and token refresh for OAuth apps - GitHub Changelog, 4485 chars)
- ok: https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/about-oauth-app-access-restrictions (About OAuth app access restrictions - GitHub Docs, 3957 chars)

Probes:
- p1 negative: No OAuth/OIDC discovery metadata on github.com. Not conclusive: many providers don't publish it. (github.com)
- p2 positive: Endpoint answered, landing on github.com/login: it is live and handles an unknown client. (https://github.com/login/oauth/authorize?client_id=invalid&response_type=code)
- p3 positive: Opened the registration page without signing in: login (https://github.com/settings/applications/new)
- p4 positive: Opened it with a made-up client and those scopes: login (https://github.com/login/oauth/authorize)
- p5 negative: Loaded it with a plain page request (no token request was sent): missing (https://github.com/login/oauth/access_token)
- p6 positive: Opened the link and checked where it lands: login (https://github.com/settings/developers)
- p7 positive: Opened the link and checked where it lands: docs ("request access") (https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization)

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