# Dropbox: OAuth app setup

**Review-gated** (confidence: medium). Anyone can register a Dropbox app and test at once, but production approval is needed beyond 50 linked users.

- Dev-status apps work like production apps, capped at 500 linked users. [e3 sourced]
  - The developer guide says a development-status app can link up to 500 Dropbox users in total.
- The app freezes 2 weeks after its 50th linked user unless approved. [e3 sourced]
  - Without production approval, the app can't link more users after that point. Approval lifts the cap.
- Production review starts only after 50 users are linked. [e4 sourced]
  - Early review is possible if you justify it in the 'Request early review' field. No review time is stated.

- Working in dev: 2 h 45 min–6 h 15 min hands-on, no waiting
- Ready for real users: 6 h–18 h 45 min hands-on, wait unknown
- OAuth for your users: You register an OAuth app. Dropbox documents OAuth 2.0 for third-party apps. You register an app in the App Console and get an app key and secret.
- An agent can do 6 of 9 steps (67%), 1 of them only with your OK.
- Top risk: **App frozen after 50 users without approval** (common). Apply for production status before the 50th user, or right after it. [e3 sourced]

**How we got the times** (hands-on hours from the rubric; waits only from a provider statement or an observation)

- Dev, step 0: Account or plan setup, 15 min
- Dev, step 1: Account or plan setup, 15 min
- Dev, step 2: App registration form, 15 min–30 min
- Dev, step 3: Redirect URI and scopes, 15 min
- Dev, step 4: Any other step, 15 min–1 h
- Dev, step 5: Authorize and token exchange, 1 h–3 h
- Dev, step 6: Test with your own account, 30 min–1 h
- Real users, step 7: Review materials (per item) (3 items), 3 h–12 h
- Real users, step 8: Submit for review, 15 min–30 min
- Real users, step 9: The provider does it (you wait), 0 h

## Steps to follow

**Getting to dev**

0. **Have these ready** (You). Done when: all in place.
   - **Dropbox account**. A Dropbox account is needed to sign in to the App Console and create the app. [e8 inferred]
   - Decide whether to request `files.content.read / files.content.write` (unknown) [e6 sourced]
1. **Sign in to Dropbox and open the App Console** (You · 15 min). [e8 inferred]
   - Use a Dropbox account you control.
   - Decide on App folder or Full Dropbox access.
   - Where you do it: Dropbox → App Console (https://www.dropbox.com/developers/apps)
   - Agent checked: **Couldn't check**. Behind a sign-in, so whether the page exists couldn't be seen
   - **→ You take over here.** Sign in at www.dropbox.com/developers/apps, then an agent can continue
2. **Create the app in the App Console** (Agent · 15 min–30 min). Done when: App key (client_id) and app secret. [e1 sourced] [e6 sourced] [a2 tested]
   - Click Create app and choose Scoped access.
   - Choose App folder or Full Dropbox; prefer App folder.
   - Note the app key and secret on the Settings tab.
   - Where you do it: App Console → Create app (https://www.dropbox.com/developers/apps/create)
   - Agent checked: **Matches the guide**. A sign-in page: you sign in before this step
3. **Set the redirect URI and permissions** (Agent · 15 min). [e1 sourced] [e5 sourced] [e6 sourced]
   - Add your app's OAuth callback URL under Redirect URIs.
   - Tick the minimal scopes in the Permissions tab.
   - Click Submit on the Permissions tab so the scopes take effect.
   - Rule: **Exact redirect URI match**. Register every redirect URI in the App Console. Dropbox checks redirect_uri against the registered values. [e5 sourced]
   - Rule: **Least-privilege scopes**. The review checks that the app doesn't request an unnecessarily broad permission. [e6 sourced]
   - Where you do it: App Console → app → Settings / Permissions (https://www.dropbox.com/developers/apps)
   - Redirect URI: `Your app's OAuth callback URL`
   - Scopes: `account_info.read`
   - ⚠ Watch out: **Redirect URI mismatch** (common). Register the exact callback URL in the App Console. [e5 sourced]
   - ? Not confirmed: PKCE support, localhost and HTTPS redirect rules were not confirmed. The app-console page failed to load.
4. **Store the app key and secret in your agent's config** (Agent, with your OK · 15 min–1 h). [e7 sourced]
   - Ask the developer before pasting the secret.
5. **Run the authorization code flow** (Agent · 1 h–3 h). Done when: Access token and refresh token. [e2 sourced] [e7 sourced] [e9 inferred]
   - Send the user to the authorize URL with response_type=code.
   - Add token_access_type=offline to get a refresh token (general knowledge).
   - Exchange the code at the token URL with the client secret.
   - Rule: **Client secret at the token endpoint**. The code exchange calls /oauth2/token with the app's client_secret. [e7 sourced]
   - Explained at: Dropbox OAuth guide (https://docs.dropboxapi.com/dropbox-api/docs/oauth)
   - Authorize URL: `https://www.dropbox.com/oauth2/authorize?client_id=APP_KEY&redirect_uri=CALLBACK&response_type=code`
   - Token URL: `https://api.dropboxapi.com/oauth2/token`
   - ? Not confirmed: Authorization code lifetime was not found on the pages read.
   - ? Not confirmed: Access token lifetime (about 4 hours) comes only from search snippets. Refresh token expiry and whether a refresh returns a new refresh token are not confirmed.
   - ? Not confirmed: The token URL host api.dropboxapi.com was not seen in the page text. It comes from general knowledge.
   - Agent checked: **Matches the guide**. Rejected the made-up client without objecting to the scopes
   - Agent checked: **Couldn't check**. Not found for a plain page request; endpoints that only take POST often answer this way
6. **Test with a read-only call** (Agent · 30 min–1 h). [e8 inferred]
   - POST https://api.dropboxapi.com/2/users/get_current_account with a Bearer token.
   - Success is a 200 response with the account name and email.
   - Scopes: `account_info.read`

✓ **Working in dev:** 2 h 45 min–6 h 15 min hands-on, no waiting

**Getting to real users**

7. **Prepare the production application** (Agent · 3 h–12 h). [e4 sourced]
   - Describe how the app uses the API in detail.
   - Upload an app icon.
   - Check the app against the branding guidelines and terms.
   - Rule: **Branding guidelines and terms**. The app must follow the developer branding guidelines and terms. The app name can't be changed after production approval. [e4 sourced]
   - Where you do it: App Console → app → Apply for production (https://www.dropbox.com/developers/apps)
   - ⚠ Watch out: **Production review rejects overly broad scopes** (possible). Request minimal scopes or App folder access, and explain planned broader needs in the application. [e6 sourced]
8. **Submit the production status application** (You · 15 min–30 min). [e3 sourced] [e4 sourced]
   - Submit before linking 50 users, or within 2 weeks of the 50th.
   - Use the early review field if there is a good reason.
   - Where you do it: App Console → app → Apply for Production (https://www.dropbox.com/developers/apps)
   - ⚠ Watch out: **App frozen after 50 users without approval** (common). Apply for production status before the 50th user, or right after it. [e3 sourced]
9. **Dropbox reviews the app** (Provider · 0 min). [e4 sourced]
   - Review starts once the app has 50 linked users.
   - No review time is stated in the pages read.
   - ? Not confirmed: Production review duration is not stated on the pages read.

✓ **Ready for real users:** 6 h–18 h 45 min hands-on, wait unknown

**Not confirmed across the setup**

- ? Rate limits and region-specific hosts were not found on the pages read.
- ? Discovery probe on www.dropbox.com errored, so it neither confirmed nor ruled out dynamic registration.
- ? Whether a paid Dropbox plan is needed for production is unknown.

---

## How this guide was checked

### At a glance

| Area | Finding | Evidence | Status | Next step |
|---|---|---|---|---|
| Difficulty | Review-gated | — | Confidence: medium | Read the steps below |
| Agent share | 6 of 9 steps (67%) | — | Counted from steps | See Steps to follow for who does each one |
| OAuth access | You register an OAuth app | — | From research | You: register an app with the provider |
| Time to dev | 2 h 45 min–6 h 15 min hands-on, no waiting | — | Needs checking | Estimate: time a real setup to confirm |
| Time to real users | 6 h–18 h 45 min hands-on, wait unknown | — | Needs checking | Unknown: ask the provider or time a real setup |
| Review page | https://docs.dropboxapi.com/dropbox-api/docs/developer-resources/developer-guide | e3, e4 | Read | — |
| Token page | https://docs.dropboxapi.com/dropbox-api/docs/oauth | e2, e5, e7 | Read | — |
| Discovery | www.dropbox.com | — | Couldn't run | Re-run the probe or open the URL yourself |
| Authorize URL | https://www.dropbox.com/oauth2/authorize?client_id=invalid&response_type=code&redirect_uri=https://example.com/cb | — | Tested | — |
| Page | https://www.dropbox.com/oauth2/authorize | — | Tested | — |
| Page | https://www.dropbox.com/developers/apps | — | Tested | — |
| Page | https://www.dropbox.com/developers/apps/create | — | Tested | — |
| Page | https://docs.dropboxapi.com/dropbox-api/docs/developer-resources/developer-guide | — | Tested | — |
| Page | https://api.dropboxapi.com/oauth2/token | — | Nothing found | — |
| Requirement | Dropbox account | e8 | Needs checking | Confirm in the provider's docs or with a hands-on setup |
| Requirement | Exact redirect URI match | e5 | Sourced | You: have this ready |
| Requirement | Least-privilege scopes | e6 | Sourced | You: have this ready |
| Requirement | Client secret at the token endpoint | e7 | Sourced | You: have this ready |
| Requirement | Branding guidelines and terms | e4 | Sourced | You: have this ready |
| Scope | account_info.read | e8 | Needs checking | Confirm in the provider's docs or with a hands-on setup |
| Scope | files.content.read / files.content.write | e6 | Sourced | Request only if your agent needs it |
| Blocker · common | App frozen after 50 users without approval | e3 | Risk | Apply for production status before the 50th user, or right after it. |
| Blocker · possible | Production review rejects overly broad scopes | e6 | Risk | Request minimal scopes or App folder access, and explain planned broader needs in the application. |
| Blocker · common | Redirect URI mismatch | e5 | Risk | Register the exact callback URL in the App Console. |
| Open question | Production review duration is not stated on the pages read. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Authorization code lifetime was not found on the pages read. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Access token lifetime (about 4 hours) comes only from search snippets. Refresh token expiry and whether a refresh returns a new refresh token are not confirmed. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Rate limits and region-specific hosts were not found on the pages read. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | PKCE support, localhost and HTTPS redirect rules were not confirmed. The app-console page failed to load. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Discovery probe on www.dropbox.com errored, so it neither confirmed nor ruled out dynamic registration. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Whether a paid Dropbox plan is needed for production is unknown. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | The token URL host api.dropboxapi.com was not seen in the page text. It comes from general knowledge. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |

### What the agent tried

Stage 2 picked the 5 weakest claims it can check by opening a page (2 inferred, 3 sourced); claims already tested were skipped. Tried 5 things: 3 match the guide, 0 corrected, 2 couldn't check. Nothing needed correcting in the weak claims attempted: The authorize URL www.dropbox.com/oauth2/authorize is live and takes the documented scopes (account_info.read) (inferred); Step 1 link goes to www.dropbox.com/developers/apps (inferred); Step 2: you register the app at www.dropbox.com/developers/apps/create (sourced); Review page goes to docs.dropboxapi.com/dropbox-api/docs/developer-resources/developer-guide (sourced); The token endpoint is api.dropboxapi.com/oauth2/token (sourced). Nothing was submitted or signed in.

| # | Claim from the guide | What the agent tried | Expected | Seen | Status | What changed / Your next step |
|---|---|---|---|---|---|---|
| 1 | The authorize URL www.dropbox.com/oauth2/authorize is live and takes the documented scopes (account_info.read) (guide's evidence: Inferred) | Opened it with a made-up client and those scopes | A live endpoint that rejects the made-up client and raises no scope error | Rejected the made-up client without objecting to the scopes (probe p3) | Matches the guide | Added tested evidence a1 (probe p3) |
| 2 | Step 1 link goes to www.dropbox.com/developers/apps (guide's evidence: Inferred) | Opened the link and checked where it lands | Where you do "Dropbox → App Console": a sign-in, sign-up, form or a page about it | Behind a sign-in, so whether the page exists couldn't be seen (probe p4) | Couldn't check | No change |
| 3 | Step 2: you register the app at www.dropbox.com/developers/apps/create (guide's evidence: Sourced) | Opened the registration page without signing in | A sign-in, sign-up or app registration form | A sign-in page: you sign in before this step (probe p5) | Matches the guide | Added tested evidence a2 (probe p5) |
| 4 | Review page goes to docs.dropboxapi.com/dropbox-api/docs/developer-resources/developer-guide (guide's evidence: Sourced) | Opened the link and checked where it lands | The provider's app review / go-live page | Loads "DBX Platform developer guide \| Dropbox API Documentation" and covers review or going live (probe p6) | Matches the guide | Added tested evidence a3 (probe p6) |
| 5 | The token endpoint is api.dropboxapi.com/oauth2/token (guide's evidence: Sourced) | Loaded it with a plain page request (no token request was sent) | A live OAuth endpoint (it answers a plain request with an error) | Not found for a plain page request; endpoints that only take POST often answer this way (probe p7) | Couldn't check | No change: a not-found here doesn't prove the URL is wrong |
| → | Where the agent stopped | Step 1: Sign in to Dropbox and open the App Console | — | A sign-in page | You take over | Sign in at www.dropbox.com/developers/apps, then an agent can continue |

### What we couldn't confirm

- Production review duration is not stated on the pages read.
- Authorization code lifetime was not found on the pages read.
- Access token lifetime (about 4 hours) comes only from search snippets. Refresh token expiry and whether a refresh returns a new refresh token are not confirmed.
- Rate limits and region-specific hosts were not found on the pages read.
- PKCE support, localhost and HTTPS redirect rules were not confirmed. The app-console page failed to load.
- Discovery probe on www.dropbox.com errored, so it neither confirmed nor ruled out dynamic registration.
- Whether a paid Dropbox plan is needed for production is unknown.
- The token URL host api.dropboxapi.com was not seen in the page text. It comes from general knowledge.

### Evidence

- **e1** Sourced: Apps are registered in the App Console, which gives an app key and secret. (https://docs.dropboxapi.com/dropbox-api/docs/oauth)
  > obtaining an app key and secret (a.k.a. client_id and client_secret) and inputting redirect URIs
- **e2** Sourced: The authorize URL is www.dropbox.com/oauth2/authorize. (https://docs.dropboxapi.com/dropbox-api/docs/oauth) _The authorize endpoint is also live: a probe with an invalid client_id returned unknown_client_id (p2)._
  > https://www.dropbox.com/oauth2/authorize?client_id=MY_CLIENT_ID&redirect_uri=MY_REDIRECT_URI&response_type=code
- **e3** Sourced: Dev-status apps are capped at 500 users and freeze 2 weeks after the 50th linked user. (https://docs.dropboxapi.com/dropbox-api/docs/developer-resources/developer-guide)
  > once your app links 50 Dropbox users, you will have two weeks to apply for and receive production status approval
- **e4** Sourced: Production review is submitted from the app's info page and is not reviewed until 50 users are linked. (https://docs.dropboxapi.com/dropbox-api/docs/developer-resources/developer-guide)
  > it will not be reviewed until your app has linked with at least 50 Dropbox users
- **e5** Sourced: Redirect URIs must be registered and are checked at authorization time. (https://docs.dropboxapi.com/dropbox-api/docs/oauth)
  > You’ll need to register the exact redirect URI(s) your app may use in the App Console
- **e6** Sourced: The review checks for overly broad permissions. (https://docs.dropboxapi.com/dropbox-api/docs/developer-resources/developer-guide)
  > we’ll review that your app doesn’t request an unnecessarily broad permission
- **e7** Sourced: The code exchange at /oauth2/token uses the client secret. (https://docs.dropboxapi.com/dropbox-api/docs/oauth)
  > Call the /oauth2/token endpoint with your app’s client_secret to exchange the code for an access token
- **e8** Inferred: The test call, the account_info.read scope and the sign-in requirement come from general knowledge. _General knowledge of the Dropbox API._
- **e9** Inferred: Refresh tokens and token_access_type=offline. _Search snippets from docs.dropboxapi.com say a refresh_token grant returns a new short-lived access token._
- **a1** Tested: The authorize URL www.dropbox.com/oauth2/authorize is live and rejects an unknown client (probe p3) _Stage 2 attempt_
- **a2** Tested: www.dropbox.com/developers/apps/create asks the developer to sign in first (probe p5) _Stage 2 attempt_
- **a3** Tested: docs.dropboxapi.com/dropbox-api/docs/developer-resources/developer-guide is the provider's review / go-live page (probe p6) _Stage 2 attempt_

### How this was researched

Pipeline v2. 3 searches (0 failed), 2 of 3 pages read with real content, 7 probes. Claim check: 0 downgraded.

- Review page: Read: https://docs.dropboxapi.com/dropbox-api/docs/developer-resources/developer-guide (Covers production approval, the 500-user cap and the 50-user trigger.)
- Token page: Read: https://docs.dropboxapi.com/dropbox-api/docs/oauth (The page was read, but its excerpt lacked token lifetimes and refresh details.)

Searches:
- ok: Dropbox OAuth guide developers
- ok: Dropbox app production approval apply for production developer
- ok: Dropbox OAuth token refresh access token expiration

Pages:
- ok: https://docs.dropboxapi.com/dropbox-api/docs/oauth (OAuth | Dropbox API Documentation, 14219 chars)
- ok: https://docs.dropboxapi.com/dropbox-api/docs/developer-resources/developer-guide (DBX Platform developer guide | Dropbox API Documentation, 10788 chars)
- FAILED: https://docs.dropboxapi.com/dropbox-api/docs/get-started/tutorial/app-console (The page changed; retry.)

Probes:
- p1 error: No OAuth/OIDC discovery metadata on www.dropbox.com. Not conclusive: many providers don't publish it. (www.dropbox.com)
- p2 positive: Endpoint answered, landing on www.dropbox.com/oauth2/authorize_error: it is live and handles an unknown client. (https://www.dropbox.com/oauth2/authorize?client_id=invalid&response_type=code&redirect_uri=https://example.com/cb)
- p3 positive: Opened it with a made-up client and those scopes: client rejected (https://www.dropbox.com/oauth2/authorize)
- p4 positive: Opened the link and checked where it lands: login (https://www.dropbox.com/developers/apps)
- p5 positive: Opened the registration page without signing in: login (https://www.dropbox.com/developers/apps/create)
- p6 positive: Opened the link and checked where it lands: docs ("application form") (https://docs.dropboxapi.com/dropbox-api/docs/developer-resources/developer-guide)
- p7 negative: Loaded it with a plain page request (no token request was sent): missing (https://api.dropboxapi.com/oauth2/token)

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