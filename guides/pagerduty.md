# PagerDuty: OAuth app setup

**Review-gated** (confidence: medium). Register an app manually; Scoped OAuth apps need PagerDuty review (about 5 business days) and an admin install before other accounts can connect.

- Scoped OAuth works on other accounts only after publishing [e1 sourced]
  - Docs: an unpublished Scoped OAuth app works only on the account that created it.
- PagerDuty aims to review within 5 business days [e2 sourced]
  - The review covers testing, documentation and listing details. Reviewer feedback can add rounds.
- An admin on each customer account must install the app [e4 sourced]
  - Users there can't authorize until an admin installs it from the app's install link.
- Classic User OAuth skips review but is legacy and broad [e5 sourced]
  - Classic works across accounts once registered, but its scopes are only read or write.

- Working in dev: 2 h 45 min–5 h 30 min hands-on, no waiting
- Ready for real users: 6 h 15 min–19 h hands-on, 5 d–1 wk waiting [e2 sourced]
- OAuth for your users: You register an OAuth app. Register an app under Integrations > Developer Tools > App Registration and add OAuth (Scoped or Classic User). Scoped OAuth works on other accounts only after PagerDuty publishes the app.
- An agent can do 5 of 9 steps (56%), 1 of them only with your OK.
- Top risk: **Unpublished Scoped OAuth app works only on your own account** (common). Submit for review. Or use Classic User OAuth, which works across accounts without review. [e1 sourced]

**How we got the times** (hands-on hours from the rubric; waits only from a provider statement or an observation)

- Dev, step 1: Account or plan setup, 15 min
- Dev, step 2: App registration form, 15 min–30 min
- Dev, step 3: Redirect URI and scopes, 15 min
- Dev, step 4: Authorize and token exchange with PKCE, 1 h 30 min–3 h 30 min
- Real users, step 5: Review materials (per item) (3 items), 3 h–12 h
- Real users, step 6: Submit for review, 15 min–30 min
- Real users, step 7: The provider does it (you wait), 0 h; wait 5 d–1 wk (provider-stated) [e2 sourced]
- Real users, step 8: Any other step, 15 min–1 h
- Dev, step 9: Test with your own account, 30 min–1 h

## Steps to follow

**Getting to dev**

0. **Have these ready** (You). Done when: all in place.
   - Decide whether to request `read / write` (unknown) [e5 sourced]
1. **Get a PagerDuty account with a suitable role** (You · 15 min). [e7 sourced]
   - Use a developer account or a customer account.
   - Base role must be Manager, Global Admin or Account Owner.
   - The app is tied to this subdomain and user.
   - Where you do it: PagerDuty → Sign up (https://developer.pagerduty.com)
   - ? Not confirmed: Whether a paid plan is needed to publish is not stated. A changelog snippet says Scoped OAuth is available on all plans.
   - Agent checked: **Couldn't check**. Couldn't open: The result was withheld: the page left https://developer.pagerduty.com or closed, the user declined, or Claude's browser is no longer available. Use read_page to see the page before navigating again.
   - **→ You take over here.** You do step 1; an agent can pick up after it
2. **Create the app in App Registration** (Agent · 15 min–30 min). [e7 sourced]
   - Go to Integrations > Developer Tools > App Registration > New App.
   - Enter the name and description.
   - Leave App Type as Private for testing.
   - Explained at: PagerDuty → Integrations → Developer Tools → App Registration (https://docs.pagerduty.com/developer/integration-developer)
   - ? Not confirmed: Step 2's link docs.pagerduty.com/developer/integration-developer is a docs page, not the registration form; find the portal page where you create the app.
   - Agent checked: **Couldn't check**. Docs page, not the form ("Integration Developer | PagerDuty Docs")
3. **Add Scoped OAuth, callback URL and scopes** (Agent · 15 min). Done when: client_id and client_secret. [e7 sourced] [e9 sourced] [a4 tested]
   - On the app's Edit App page, click Add on the OAuth card.
   - Choose Scoped OAuth.
   - Enter your app's OAuth callback URL, then pick the scopes.
   - Explained at: PagerDuty → App Registration → Edit App → Functionality (https://docs.pagerduty.com/developer/oauth-functionality)
   - Redirect URI: `your app's OAuth callback URL`
   - Scopes: `incidents.read`, `services.read`
   - ? Not confirmed: Exact redirect URI rules (exact match, HTTPS, localhost, count limit) not found.
   - ? Not confirmed: Scope sensitivity levels and consent warnings for unpublished apps are not documented in what was read.
   - Agent checked: **Matches the guide**. Loads "OAuth Functionality | PagerDuty Docs"
4. **Run the authorization code flow with PKCE** (Agent, with your OK · 1 h 30 min–3 h 30 min). [e3 sourced] [e6 tested] [e8 tested] [e9 sourced] [e10 sourced] [a2 tested] [a3 tested]
   - Send the user to the authorize URL with code_challenge (S256).
   - Exchange the code at the token URL with client_secret and code_verifier.
   - Store the client secret only with the developer's OK.
   - Refresh user tokens before the 30-day refresh expiry.
   - Rule: **PKCE required for Scoped OAuth**. Send code_challenge on authorize and code_verifier on the token request. [e9 sourced]
   - Rule: **Client secret on token request**. Scoped OAuth apps are confidential clients and send client_secret to the token endpoint. [e9 sourced]
   - Rule: **Token lifetimes and refresh**. Access token 1 day, refresh token 30 days, rolling window 1 year. Refresh only applies to user tokens. [e10 sourced]
   - Rule: **Region in as_account scope for app tokens**. The client credentials flow needs an as_account-{REGION}.{SUBDOMAIN} scope. It works only on the creating account. [e11 sourced]
   - Explained at: PagerDuty OAuth docs (https://docs.pagerduty.com/developer/oauth-functionality)
   - Authorize URL: `https://identity.pagerduty.com/oauth/authorize`
   - Token URL: `https://identity.pagerduty.com/oauth/token`
   - ? Not confirmed: Authorization code lifetime is not stated on the pages read.
   - ? Not confirmed: Rate limits for OAuth/token endpoints are not stated on the pages read.
   - ? Not confirmed: Whether a refresh returns a new refresh token is not stated.
   - Agent checked: **Matches the guide**. Rejected the made-up client without objecting to the scopes
   - Agent checked: **Matches the guide**. Answered with an OAuth error, so the endpoint is live (only a real token request would show it works)
5. **Verify the token with a read-only call** (Agent · 30 min–1 h). [e12 inferred]
   - GET https://api.pagerduty.com/users/me with Authorization: Bearer <access_token>.
   - Success is a 200 with the user's JSON. A 401 means the token expired. A 403 means a missing scope.
   - Explained at: PagerDuty REST API reference (https://docs.pagerduty.com/developer/private-apps)
   - Header: `Authorization: Bearer <access_token>`
   - Scopes: `users.read`
   - ? Not confirmed: Region-specific hosts for the EU service region were not confirmed. The REST API host is assumed to be api.pagerduty.com.

✓ **Working in dev:** 2 h 45 min–5 h 30 min hands-on, no waiting

**Getting to real users**

6. **Prepare the Distribution Form materials** (Agent · 3 h–12 h). [e2 sourced]
   - Draft the listing documentation using PagerDuty's documentation template.
   - Write the support contact and testing instructions.
   - Explained at: PagerDuty → Edit App → App Type → Distribution Form (https://docs.pagerduty.com/developer/publish-an-app)
   - Agent checked: **Matches the guide**. Loads "Publish an App | PagerDuty Docs" and covers review or going live
7. **Set App Type to Public and submit for review** (You · 15 min–30 min). [e2 sourced]
   - Select Public, complete the Distribution Form, then Save and confirm.
   - The app can't be edited after submission. Email apps@pagerduty.com to reopen it.
   - Explained at: PagerDuty → Edit App → App Type (https://docs.pagerduty.com/developer/publish-an-app)
   - ⚠ Watch out: **Unpublished Scoped OAuth app works only on your own account** (common). Submit for review. Or use Classic User OAuth, which works across accounts without review. [e1 sourced]
8. **Wait for PagerDuty review** (Provider · 0 min · 5 d–1 wk wait). [e2 sourced]
   - PagerDuty aims to respond within 5 business days.
   - Reviewers may ask for changes.
   - ⚠ Watch out: **Reviewer feedback adds rounds** (possible). Use the documentation template. Email apps@pagerduty.com for questions. [e2 sourced]
9. **Have customer admins install the app** (You · 15 min–1 h). [e4 sourced]
   - Give each admin the install link.
   - Users can authorize only after the install.
   - Explained at: PagerDuty → OAuth Apps install page (https://docs.pagerduty.com/developer/publish-an-app)
   - Install link: `https://<subdomain>.pagerduty.com/oauth-apps/<APP_ID>`
   - ⚠ Watch out: **Customer admin hasn't installed the app** (common). Send the install link to an account admin before users try to connect. [e4 sourced]

✓ **Ready for real users:** 6 h 15 min–19 h hands-on, 5 d–1 wk waiting

**Not confirmed across the setup**

- ? Discovery metadata was not found at identity.pagerduty.com, so no dynamic registration.

---

## How this guide was checked

### At a glance

| Area | Finding | Evidence | Status | Next step |
|---|---|---|---|---|
| Difficulty | Review-gated | — | Confidence: medium | Read the steps below |
| Agent share | 5 of 9 steps (56%) | — | Counted from steps | See Steps to follow for who does each one |
| OAuth access | You register an OAuth app | — | From research | You: register an app with the provider |
| Time to dev | 2 h 45 min–5 h 30 min hands-on, no waiting | — | Needs checking | Estimate: time a real setup to confirm |
| Time to real users | 6 h 15 min–19 h hands-on, 5 d–1 wk waiting | e2 | Sourced | — |
| Review page | https://docs.pagerduty.com/developer/publish-an-app | e1, e2, e4 | Read | — |
| Token page | https://docs.pagerduty.com/developer/oauth-functionality | e3, e9, e10 | Read | — |
| Discovery | identity.pagerduty.com | — | Nothing found | — |
| Authorize URL | https://identity.pagerduty.com/oauth/authorize?client_id=invalid&response_type=code&redirect_uri=https://example.com/cb | — | Tested | — |
| Page | https://docs.pagerduty.com/developer/integration-developer | — | Tested | — |
| Page | https://docs.pagerduty.com/developer/publish-an-app | — | Tested | — |
| Page | https://identity.pagerduty.com/oauth/authorize | — | Tested | — |
| Page | https://identity.pagerduty.com/oauth/token | — | Tested | — |
| Page | https://docs.pagerduty.com/developer/oauth-functionality | — | Tested | — |
| Requirement | PagerDuty account with Manager, Global Admin or Account Owner base role | e7 | Sourced | You: have this ready |
| Requirement | PKCE required for Scoped OAuth | e9 | Sourced | You: have this ready |
| Requirement | Client secret on token request | e9 | Sourced | You: have this ready |
| Requirement | Token lifetimes and refresh | e10 | Sourced | You: have this ready |
| Requirement | Region in as_account scope for app tokens | e11 | Sourced | You: have this ready |
| Requirement | Admin install on each customer account | e4 | Sourced | You: have this ready |
| Scope | incidents.read | e11 | Sourced | Request only if your agent needs it |
| Scope | services.read | e11 | Sourced | Request only if your agent needs it |
| Scope | read / write | e5 | Sourced | Request only if your agent needs it |
| Blocker · common | Unpublished Scoped OAuth app works only on your own account | e1 | Risk | Submit for review. Or use Classic User OAuth, which works across accounts without review. |
| Blocker · common | Customer admin hasn't installed the app | e4 | Risk | Send the install link to an account admin before users try to connect. |
| Blocker · possible | Reviewer feedback adds rounds | e2 | Risk | Use the documentation template. Email apps@pagerduty.com for questions. |
| Open question | Authorization code lifetime is not stated on the pages read. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Exact redirect URI rules (exact match, HTTPS, localhost, count limit) not found. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Rate limits for OAuth/token endpoints are not stated on the pages read. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Whether a refresh returns a new refresh token is not stated. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Region-specific hosts for the EU service region were not confirmed. The REST API host is assumed to be api.pagerduty.com. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Discovery metadata was not found at identity.pagerduty.com, so no dynamic registration. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Whether a paid plan is needed to publish is not stated. A changelog snippet says Scoped OAuth is available on all plans. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Scope sensitivity levels and consent warnings for unpublished apps are not documented in what was read. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Step 2's link docs.pagerduty.com/developer/integration-developer is a docs page, not the registration form; find the portal page where you create the app. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |

### What the agent tried

Stage 2 picked the 6 weakest claims it can check by opening a page (6 sourced); claims already tested were skipped. Tried 6 things: 4 match the guide, 0 corrected, 2 couldn't check. Nothing needed correcting in the weak claims attempted: Step 2: you register the app at docs.pagerduty.com/developer/integration-developer (sourced); Review page goes to docs.pagerduty.com/developer/publish-an-app (sourced); The authorize URL identity.pagerduty.com/oauth/authorize is live and takes the documented scopes (incidents.read, services.read, users.read) (sourced); The token endpoint is identity.pagerduty.com/oauth/token (sourced); Step 1 link at developer.pagerduty.com (sourced); Step 3 link goes to docs.pagerduty.com/developer/oauth-functionality (sourced). Nothing was submitted or signed in.

| # | Claim from the guide | What the agent tried | Expected | Seen | Status | What changed / Your next step |
|---|---|---|---|---|---|---|
| 1 | Step 2: you register the app at docs.pagerduty.com/developer/integration-developer (guide's evidence: Sourced) | Opened the registration page without signing in | A sign-in, sign-up or app registration form | Docs page, not the form ("Integration Developer \| PagerDuty Docs") (probe p3) | Couldn't check | Added an open question |
| 2 | Review page goes to docs.pagerduty.com/developer/publish-an-app (guide's evidence: Sourced) | Opened the link and checked where it lands | The provider's app review / go-live page | Loads "Publish an App \| PagerDuty Docs" and covers review or going live (probe p4) | Matches the guide | Added tested evidence a1 (probe p4) |
| 3 | The authorize URL identity.pagerduty.com/oauth/authorize is live and takes the documented scopes (incidents.read, services.read, users.read) (guide's evidence: Sourced) | Opened it with a made-up client and those scopes | A live endpoint that rejects the made-up client and raises no scope error | Rejected the made-up client without objecting to the scopes (probe p5) | Matches the guide | Added tested evidence a2 (probe p5) |
| 4 | The token endpoint is identity.pagerduty.com/oauth/token (guide's evidence: Sourced) | Loaded it with a plain page request (no token request was sent) | A live OAuth endpoint (it answers a plain request with an error) | Answered with an OAuth error, so the endpoint is live (only a real token request would show it works) (probe p6) | Matches the guide | Added tested evidence a3 (probe p6) |
| 5 | Step 1 link at developer.pagerduty.com (guide's evidence: Sourced) | Opened it | — | Couldn't open: The result was withheld: the page left https://developer.pagerduty.com or closed, the user declined, or Claude's browser is no longer available. Use read_page to see the page before navigating again. | Couldn't check | No change |
| 6 | Step 3 link goes to docs.pagerduty.com/developer/oauth-functionality (guide's evidence: Sourced) | Opened the link and checked where it lands | A docs page about "PagerDuty → App Registration → Edit App → Functionality" | Loads "OAuth Functionality \| PagerDuty Docs" (probe p7) | Matches the guide | Added tested evidence a4 (probe p7) |
| → | Where the agent stopped | Step 1: Get a PagerDuty account with a suitable role | — | A step only you can do (account, legal terms, payment, verification or a decision) | You take over | You do step 1; an agent can pick up after it |

### What we couldn't confirm

- Authorization code lifetime is not stated on the pages read.
- Exact redirect URI rules (exact match, HTTPS, localhost, count limit) not found.
- Rate limits for OAuth/token endpoints are not stated on the pages read.
- Whether a refresh returns a new refresh token is not stated.
- Region-specific hosts for the EU service region were not confirmed. The REST API host is assumed to be api.pagerduty.com.
- Discovery metadata was not found at identity.pagerduty.com, so no dynamic registration.
- Whether a paid plan is needed to publish is not stated. A changelog snippet says Scoped OAuth is available on all plans.
- Scope sensitivity levels and consent warnings for unpublished apps are not documented in what was read.
- Step 2's link docs.pagerduty.com/developer/integration-developer is a docs page, not the registration form; find the portal page where you create the app.

### Evidence

- **e1** Sourced: Scoped OAuth apps work on other accounts only after publishing (https://docs.pagerduty.com/developer/publish-an-app)
  > Publishing is required for an app with Scoped OAuth functionality to work on accounts other than the one that created it.
- **e2** Sourced: Review target is 5 business days (https://docs.pagerduty.com/developer/publish-an-app)
  > We aim to review your submission and approve or reply with feedback within 5 business days.
- **e3** Sourced: Token endpoint is identity.pagerduty.com/oauth/token (https://docs.pagerduty.com/developer/oauth-functionality)
  > https://identity.pagerduty.com/oauth/token
- **e4** Sourced: An admin on each account must install the app (https://docs.pagerduty.com/developer/publish-an-app)
  > Before any user on another account can authorize your app, an admin on that account must install it.
- **e5** Sourced: Classic User OAuth works across accounts and has only read/write scopes (https://docs.pagerduty.com/developer/private-apps)
  > Classic User OAuth, the legacy OAuth functionality, works across accounts regardless of App Type
- **e6** Tested: The authorize endpoint is live and rejects unknown clients (probe p2) _Returned 400 Client is invalid or unknown._
- **e7** Sourced: App Registration is limited to Manager, Global Admin or Account Owner base roles (https://github.com/PagerDuty/developer-docs/blob/main/docs/app-integration-development/04-Register-an-App.md)
  > App Registration is available only to users with a base role of Manager, Global Admin or Account Owner.
- **e8** Tested: Authorize URL path /oauth/authorize on identity.pagerduty.com (probe p2) _The docs read did not print the authorize URL. The path was confirmed by the probe._
- **e9** Sourced: Scoped OAuth needs client_secret and PKCE (https://docs.pagerduty.com/developer/oauth-functionality)
  > A Scoped OAuth app is always a confidential client: it must send its client_secret on the token request and must use PKCE.
- **e10** Sourced: Token lifetimes (https://docs.pagerduty.com/developer/private-apps) _Access token 1 day. Rolling window 1 year._
  > refresh token expiry of 30 days
- **e11** Sourced: App token needs an as_account scope in REGION.SUBDOMAIN format (https://docs.pagerduty.com/developer/private-apps)
  > Must contain the as_account- scope that specifies the PagerDuty Account the token is being requested for using a {REGION}.{SUBDOMAIN} format.
- **e12** Inferred: /users/me as the verification call _The sample at martindstone.github.io/PDOAuth shows GET api.pagerduty.com/users/me. It was not on a provider page I read._
- **a1** Tested: docs.pagerduty.com/developer/publish-an-app is the provider's review / go-live page (probe p4) _Stage 2 attempt_
- **a2** Tested: The authorize URL identity.pagerduty.com/oauth/authorize is live and rejects an unknown client (probe p5) _Stage 2 attempt_
- **a3** Tested: The token endpoint identity.pagerduty.com/oauth/token is live (probe p6) _Stage 2 attempt_
- **a4** Tested: docs.pagerduty.com/developer/oauth-functionality loads (OAuth Functionality | PagerDuty Docs) (probe p7) _Stage 2 attempt_

### How this was researched

Pipeline v2. 3 searches (0 failed), 4 of 5 pages read with real content, 7 probes. Claim check: 0 downgraded.

- Review page: Read: https://docs.pagerduty.com/developer/publish-an-app
- Token page: Read: https://docs.pagerduty.com/developer/oauth-functionality (Token lifetimes are on the Private Apps page.)

Searches:
- ok: PagerDuty OAuth app registration scoped OAuth developer docs
- ok: PagerDuty app marketplace listing review publish integration
- ok: PagerDuty OAuth token refresh authorization code

Pages:
- ok: https://docs.pagerduty.com/developer/oauth-functionality (OAuth Functionality | PagerDuty Docs, 19235 chars)
- ok: https://docs.pagerduty.com/developer/private-apps (Private Apps | PagerDuty Docs, 6889 chars)
- ok: https://docs.pagerduty.com/developer/publish-an-app (Publish an App | PagerDuty Docs, 4565 chars)
- ok: https://github.com/PagerDuty/developer-docs/blob/main/docs/app-integration-development/04-Register-an-App.md (developer-docs/docs/app-integration-development/04-Register-an-App.md at main · PagerDuty/developer-docs · GitHub, 3587 chars)
- FAILED: https://support.pagerduty.com/main/lang-ja/docs/scoped-oauth-apps (the browser wouldn't show this page (it redirected to another site or was blocked))

Probes:
- p1 negative: No OAuth/OIDC discovery metadata on identity.pagerduty.com. Not conclusive: many providers don't publish it. (identity.pagerduty.com)
- p2 positive: Endpoint answered, landing on identity.pagerduty.com/oauth/authorize: it is live and handles an unknown client. (https://identity.pagerduty.com/oauth/authorize?client_id=invalid&response_type=code&redirect_uri=https://example.com/cb)
- p3 positive: Opened the registration page without signing in: docs (https://docs.pagerduty.com/developer/integration-developer)
- p4 positive: Opened the link and checked where it lands: docs (https://docs.pagerduty.com/developer/publish-an-app)
- p5 positive: Opened it with a made-up client and those scopes: client rejected (https://identity.pagerduty.com/oauth/authorize)
- p6 positive: Loaded it with a plain page request (no token request was sent): oauth error (https://identity.pagerduty.com/oauth/token)
- p7 positive: Opened the link and checked where it lands: docs (https://docs.pagerduty.com/developer/oauth-functionality)

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