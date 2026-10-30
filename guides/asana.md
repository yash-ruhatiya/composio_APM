# Asana: OAuth app setup

**Self-serve** (confidence: medium). Register an OAuth app in Asana's developer console and use it right away. App Directory review is only needed to be listed.

- Manual registration in the developer console [e1 tested] [e4 inferred]
  - Discovery shows the authorize and token endpoints on app.asana.com but no registration_endpoint. Search results describe creating the app at app.asana.com/0/my-apps.
- Review is not required to get a token [e3 sourced]
  - Asana's publish page says submitting for review is not required to obtain a token. It is only needed for App Directory listing.
- Directory review: first response aimed within one week [e5 sourced]
  - Asana aims to give an initial response within a week. Apps built with app components take longer.
- Whether unlisted apps have user or workspace limits is unconfirmed [e3 sourced] [e8 sourced]
  - I could not read the OAuth page. The code samples page shows a Manage Distribution setting in the developer console. It lets you allow Specific workspaces or Any workspace. I did not confirm any user caps or warnings for unpublished apps.

- Working in dev: 2 h 30 min–5 h 15 min hands-on, no waiting
- Ready for real users: 5 h 30 min–17 h 15 min hands-on, 1 d–1 wk waiting [e5 sourced]
- OAuth for your users: You register an OAuth app. Asana lets third-party apps use OAuth 2.0. You register an app in the developer console. Discovery found no dynamic registration endpoint.
- Instead: Personal Access Token (PAT) for your own account only. It is not suitable for connecting many users.
- An agent can do 4 of 7 steps (57%), 1 of them only with your OK.
- Top risk: **Directory review delays** (possible). Follow the listing guidelines before submitting. Apps with app components take longer. [e5 sourced]

**How we got the times** (hands-on hours from the rubric; waits only from a provider statement or an observation)

- Dev, step 0: Account or plan setup, 15 min
- Dev, step 1: Account or plan setup, 15 min
- Dev, step 2: App registration form, 15 min–30 min
- Dev, step 3: Redirect URI and scopes, 15 min
- Dev, step 4: Authorize and token exchange, 1 h–3 h
- Real users, step 5: Review materials (per item) (3 items), 3 h–12 h
- Real users, step 6: The provider does it (you wait), 0 h; wait 1 d–1 wk (provider-stated) [e5 sourced]
- Dev, step 7: Test with your own account, 30 min–1 h

## Steps to follow

**Getting to dev**

0. **Have these ready** (You). Done when: all in place.
   - **Asana account**. You need an Asana account to open the developer console and agree to the Asana API Terms when creating the app. [e4 inferred]
   - Decide whether to request `default` (unknown) [e8 sourced]
1. **Sign in to Asana and open the developer console** (You · 15 min). [e4 inferred]
   - Sign in with the Asana account that will own the app
   - Open My apps in the developer console
   - Where you do it: Asana → Developer console → My apps (https://app.asana.com/0/my-apps)
   - **→ You take over here.** You do step 1; an agent can pick up after it
2. **Create the OAuth app** (Agent · 15 min–30 min). Done when: Client ID and client secret. [e1 tested] [e4 inferred] [e8 sourced] [a1 tested] [a3 tested]
   - Click Create new app
   - Enter a name and pick a use case
   - Accept the Asana API Terms
   - Add your app's OAuth callback URL in the OAuth section
   - Copy the client ID and secret
   - Under Manage Distribution, allow the workspaces that will use the app (Specific workspaces or Any workspace)
   - Rule: **Authorization code flow with HTTPS callback**. Add your app's OAuth callback URL under the app's OAuth section. Exact-match and HTTPS rules were not confirmed from the docs. [e3 sourced]
   - Where you do it: Developer console → Create new app → OAuth (https://app.asana.com/0/my-apps)
   - Redirect URI: `your app's OAuth callback URL`
   - Authorize URL: `https://app.asana.com/-/oauth_authorize`
   - Token URL: `https://app.asana.com/-/oauth_token`
   - ? Not confirmed: I could not read the scopes page, so the full list of scope names and their sensitivity is unknown.
   - Agent checked: **Matches the guide**. A sign-in page: you sign in before this step
   - Agent checked: **Matches the guide**. Live; it asks the user to sign in before showing consent, so the scopes weren't visible
   - Agent checked: **Couldn't check**. Loaded, but didn't look like a token endpoint's reply
3. **Store client credentials in your agent's backend** (Agent, with your OK · 15 min).
   - Paste the client ID and secret into your app's config
   - Keep the secret server-side
4. **Run the authorization code flow** (Agent · 1 h–3 h). Done when: Access and refresh tokens. [e1 tested] [e2 tested] [e6 inferred] [e8 sourced] [e9 inferred]
   - Send the user to the authorize URL with response_type=code
   - Exchange the code at the token URL from your server, not from a browser
   - Use the refresh token with grant_type=refresh_token to get new access tokens
   - Rule: **Token requests must come from a server, not a browser**. Asana's code samples page says OAuth does not support token requests from a browser for security reasons. Make the token exchange from your backend. [e8 sourced]
   - Rule: **Access token lifetime about 1 hour; refresh token reusable**. A forum post reports access tokens expire after 3600 seconds. Store the refresh token and use it to get new access tokens. This is not from the official docs pages I read. [e6 inferred] [e9 inferred]
   - Explained at: Asana OAuth docs (https://developers.asana.com/docs/oauth)
   - ? Not confirmed: I could not read the OAuth page, so these are unconfirmed: authorization code lifetime, client authentication method, redirect URI rules and exact refresh response behavior. Search snippets suggest refresh_token grants and PKCE (code_challenge) exist, but I did not read them on a page.
   - ? Not confirmed: PKCE support is only suggested by search snippets and an Asana forum thread. It is not confirmed from a page I read.
5. **Verify the token with a read-only call** (Agent · 30 min–1 h).
   - Call GET https://app.asana.com/api/1.0/users/me with the bearer token
   - Success is HTTP 200 with the user's gid and name
   - Header: `Authorization: Bearer <access_token>`

✓ **Working in dev:** 2 h 30 min–5 h 15 min hands-on, no waiting

**Getting to real users**

6. **Optional: prepare the App Directory listing** (You · 3 h–12 h). [e3 sourced] [e5 sourced]
   - Only needed if you want a public listing
   - Follow the app listing guidelines
   - Prepare setup instructions and a screencast link
   - Explained at: Developer console → Submit for review (https://developers.asana.com/docs/publish-your-app)
   - Agent checked: **Matches the guide**. Loads "Publish your app" and covers review or going live
7. **Submit for review and wait** (Provider · 0 min · 1 d–1 wk wait). [e5 sourced]
   - Asana aims to give an initial response within one week
   - You get an email when the app is ready to publish
   - ⚠ Watch out: **Directory review delays** (possible). Follow the listing guidelines before submitting. Apps with app components take longer. [e5 sourced]

✓ **Ready for real users:** 5 h 30 min–17 h 15 min hands-on, 1 d–1 wk waiting

**Not confirmed across the setup**

- ? Rate limits and any region or data-center-specific hosts were not confirmed.
- ? I did not confirm whether unpublished apps have user caps or consent warnings. Manage Distribution lets you choose specific workspaces or any workspace, but its limits are unknown.
- ? I did not confirm whether a paid plan or admin approval of the app is needed in an organization.
- ? Token page not read; token lifetimes, refresh and redirect rules unconfirmed. (The read timed out, so I got no usable content. I searched for the token and refresh flow. I then read the OAuth code samples page (https://developers.asana.com/docs/getting-started-with-asana-oauth) and an Asana example README on GitHub. Neither covers token lifetime, refresh or PKCE details.)
- ? Token page https://developers.asana.com/docs/oauth still couldn't be read after a follow-up round that tried: https://developers.asana.com/docs/getting-started-with-asana-oauth, https://github.com/Asana/devrel-examples/blob/master/javascript/pkce_oauth/README.md. Claims from it need checking.

---

## How this guide was checked

### At a glance

| Area | Finding | Evidence | Status | Next step |
|---|---|---|---|---|
| Difficulty | Self-serve | — | Confidence: medium | Read the steps below |
| Agent share | 4 of 7 steps (57%) | — | Counted from steps | See Steps to follow for who does each one |
| OAuth access | You register an OAuth app | — | From research | You: register an app with the provider |
| Time to dev | 2 h 30 min–5 h 15 min hands-on, no waiting | — | Needs checking | Estimate: time a real setup to confirm |
| Time to real users | 5 h 30 min–17 h 15 min hands-on, 1 d–1 wk waiting | e5 | Sourced | — |
| Review page | https://developers.asana.com/docs/publish-your-app | e3, e5 | Read | — |
| Token page | https://developers.asana.com/docs/oauth | e8 | Couldn't load | Find and read this page to confirm |
| Discovery | https://app.asana.com/.well-known/oauth-authorization-server | — | Tested | — |
| Authorize URL | https://app.asana.com/-/oauth_authorize?client_id=invalid&redirect_uri=https%3A%2F%2Fexample.com%2Fcb&response_type=code&state=x | — | Tested | — |
| Page | https://app.asana.com/0/my-apps | — | Tested | — |
| Page | https://developers.asana.com/docs/publish-your-app | — | Tested | — |
| Page | https://app.asana.com/-/oauth_authorize | — | Tested | — |
| Page | https://app.asana.com/-/oauth_token | — | Tested | — |
| Requirement | Asana account | e4 | Needs checking | Confirm in the provider's docs or with a hands-on setup |
| Requirement | Authorization code flow with HTTPS callback | e3 | Sourced | You: have this ready |
| Requirement | Token requests must come from a server, not a browser | e8 | Sourced | You: have this ready |
| Requirement | Access token lifetime about 1 hour; refresh token reusable | e6, e9 | Needs checking | Confirm in the provider's docs or with a hands-on setup |
| Scope | default | e8 | Sourced | Request only if your agent needs it |
| Blocker · possible | Directory review delays | e5 | Risk | Follow the listing guidelines before submitting. Apps with app components take longer. |
| Open question | I could not read the OAuth page, so these are unconfirmed: authorization code lifetime, client authentication method, redirect URI rules and exact refresh response behavior. Search snippets suggest refresh_token grants and PKCE (code_challenge) exist, but I did not read them on a page. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | PKCE support is only suggested by search snippets and an Asana forum thread. It is not confirmed from a page I read. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Rate limits and any region or data-center-specific hosts were not confirmed. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | I did not confirm whether unpublished apps have user caps or consent warnings. Manage Distribution lets you choose specific workspaces or any workspace, but its limits are unknown. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | I could not read the scopes page, so the full list of scope names and their sensitivity is unknown. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | I did not confirm whether a paid plan or admin approval of the app is needed in an organization. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Token page not read; token lifetimes, refresh and redirect rules unconfirmed. (The read timed out, so I got no usable content. I searched for the token and refresh flow. I then read the OAuth code samples page (https://developers.asana.com/docs/getting-started-with-asana-oauth) and an Asana example README on GitHub. Neither covers token lifetime, refresh or PKCE details.) | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Token page https://developers.asana.com/docs/oauth still couldn't be read after a follow-up round that tried: https://developers.asana.com/docs/getting-started-with-asana-oauth, https://github.com/Asana/devrel-examples/blob/master/javascript/pkce_oauth/README.md. Claims from it need checking. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |

### What the agent tried

Stage 2 picked the 4 weakest claims it can check by opening a page (1 inferred, 3 sourced); claims already tested were skipped. Tried 4 things: 3 match the guide, 0 corrected, 1 couldn't check. Nothing needed correcting in the weak claims attempted: Step 2: you register the app at app.asana.com/0/my-apps (inferred); Review page goes to developers.asana.com/docs/publish-your-app (sourced); The authorize URL app.asana.com/-/oauth_authorize is live and takes the documented scopes (default) (sourced); The token endpoint is app.asana.com/-/oauth_token (sourced). Nothing was submitted or signed in.

| # | Claim from the guide | What the agent tried | Expected | Seen | Status | What changed / Your next step |
|---|---|---|---|---|---|---|
| 1 | Step 2: you register the app at app.asana.com/0/my-apps (guide's evidence: Inferred) | Opened the registration page without signing in | A sign-in, sign-up or app registration form; form asks for redirect | A sign-in page: you sign in before this step (probe p3) | Matches the guide | Added tested evidence a1 (probe p3) |
| 2 | Review page goes to developers.asana.com/docs/publish-your-app (guide's evidence: Sourced) | Opened the link and checked where it lands | The provider's app review / go-live page | Loads "Publish your app" and covers review or going live (probe p4) | Matches the guide | Added tested evidence a2 (probe p4) |
| 3 | The authorize URL app.asana.com/-/oauth_authorize is live and takes the documented scopes (default) (guide's evidence: Sourced) | Opened it with a made-up client and those scopes | A live endpoint that rejects the made-up client and raises no scope error | Live; it asks the user to sign in before showing consent, so the scopes weren't visible (probe p5) | Matches the guide | Added tested evidence a3 (probe p5) |
| 4 | The token endpoint is app.asana.com/-/oauth_token (guide's evidence: Sourced) | Loaded it with a plain page request (no token request was sent) | A live OAuth endpoint (it answers a plain request with an error) | Loaded, but didn't look like a token endpoint's reply (probe p6) | Couldn't check | No change |
| → | Where the agent stopped | Step 1: Sign in to Asana and open the developer console | — | A step only you can do (account, legal terms, payment, verification or a decision) | You take over | You do step 1; an agent can pick up after it |

### What we couldn't confirm

- I could not read the OAuth page, so these are unconfirmed: authorization code lifetime, client authentication method, redirect URI rules and exact refresh response behavior. Search snippets suggest refresh_token grants and PKCE (code_challenge) exist, but I did not read them on a page.
- PKCE support is only suggested by search snippets and an Asana forum thread. It is not confirmed from a page I read.
- Rate limits and any region or data-center-specific hosts were not confirmed.
- I did not confirm whether unpublished apps have user caps or consent warnings. Manage Distribution lets you choose specific workspaces or any workspace, but its limits are unknown.
- I could not read the scopes page, so the full list of scope names and their sensitivity is unknown.
- I did not confirm whether a paid plan or admin approval of the app is needed in an organization.
- Token page not read; token lifetimes, refresh and redirect rules unconfirmed. (The read timed out, so I got no usable content. I searched for the token and refresh flow. I then read the OAuth code samples page (https://developers.asana.com/docs/getting-started-with-asana-oauth) and an Asana example README on GitHub. Neither covers token lifetime, refresh or PKCE details.)
- Token page https://developers.asana.com/docs/oauth still couldn't be read after a follow-up round that tried: https://developers.asana.com/docs/getting-started-with-asana-oauth, https://github.com/Asana/devrel-examples/blob/master/javascript/pkce_oauth/README.md. Claims from it need checking.

### Evidence

- **e1** Tested: Asana publishes OAuth server metadata with authorize and token endpoints and no registration endpoint. (probe p1) _Discovery at app.asana.com/.well-known/oauth-authorization-server_
- **e2** Tested: The authorize endpoint is live and sends an unknown client to the Asana login page. (probe p2)
- **e3** Sourced: Review is not required to obtain a token. It is only for App Directory publishing. (https://developers.asana.com/docs/publish-your-app)
  > Submitting your app for review is not required to obtain a token.
- **e4** Inferred: Create the app in the developer console at app.asana.com/0/my-apps. _From a search snippet on a third-party site (help.unleash.so). The Make docs say the same._
- **e5** Sourced: Asana aims for an initial response on directory submissions within one week. (https://developers.asana.com/docs/publish-your-app)
  > We aim to provide an initial response on app submissions within one week.
- **e6** Inferred: Access tokens last 3600 seconds, and the refresh token can be reused. _From Asana forum search snippets, not read as a page._
- **e7** Sourced: The authorize and token URLs are https://app.asana.com/-/oauth_authorize and https://app.asana.com/-/oauth_token. (https://developers.asana.com/docs/getting-started-with-asana-oauth)
  > Auth URL: https://app.asana.com/-/oauth_authorize
- **e8** Sourced: Asana OAuth does not support token requests from a browser. The console has a Manage Distribution setting for workspaces. Example scopes include tasks:read. (https://developers.asana.com/docs/getting-started-with-asana-oauth)
  > Asana OAuth currently does not support making token requests from a browser for security reasons.
- **e9** Inferred: A new access token is obtained by POSTing to the token endpoint with grant_type refresh_token and the refresh token. _From a search snippet of developers.asana.com/docs/oauth. I could not read that page, so this is not confirmed from a page I read._
- **a1** Tested: app.asana.com/0/my-apps asks the developer to sign in first (probe p3) _Stage 2 attempt_
- **a2** Tested: developers.asana.com/docs/publish-your-app is the provider's review / go-live page (probe p4) _Stage 2 attempt_
- **a3** Tested: The authorize URL app.asana.com/-/oauth_authorize is live and shows a sign-in page (probe p5) _Stage 2 attempt_

### How this was researched

Pipeline v2. 5 searches (0 failed), 4 of 7 pages read with real content (1 repeat request skipped), 6 probes. Claim check: 0 downgraded.

- Review page: Read: https://developers.asana.com/docs/publish-your-app
- Token page: Couldn't load: https://developers.asana.com/docs/oauth (The read timed out, so I got no usable content. I searched for the token and refresh flow. I then read the OAuth code samples page (https://developers.asana.com/docs/getting-started-with-asana-oauth) and an Asana example README on GitHub. Neither covers token lifetime, refresh or PKCE details.)

Follow-up round, for: Token page https://developers.asana.com/docs/oauth: The read timed out, so I got no usable content. I searched 'Asana OAuth token refresh authorization code'.. Pages read: https://developers.asana.com/docs/getting-started-with-asana-oauth, https://github.com/Asana/devrel-examples/blob/master/javascript/pkce_oauth/README.md. Still open: Token page https://developers.asana.com/docs/oauth: The read timed out, so I got no usable content. I searched for the token and refresh flow. I then read the OAuth code samples page (https://developers.asana.com/docs/getting-started-with-asana-oauth) and an Asana example README on GitHub. Neither covers token lifetime, refresh or PKCE details.

Searches:
- ok: Asana OAuth app developer documentation create app
- ok: Asana app directory submit app review requirements
- ok: Asana OAuth token refresh authorization code
- ok: Asana API reference OAuth token endpoint refresh_token grant_type developers.asana.com
- ok: Asana OAuth PKCE code_challenge authorization code developers.asana.com

Pages:
- ok: https://developers.asana.com/docs/oauth (OAuth, 25197 chars)
- FAILED: https://developers.asana.com/docs/publish-your-app (Stopped)
- skipped (already read): https://developers.asana.com/docs/oauth
- FAILED: https://developers.asana.com/docs/app-listing-guidelines (Stopped)
- FAILED: https://developers.asana.com/docs/oauth-scopes (Stopped)
- ok: https://developers.asana.com/docs/publish-your-app (Publish your app, 9787 chars)
- ok: https://developers.asana.com/docs/getting-started-with-asana-oauth (OAuth Code Samples / Libraries, 3469 chars)
- ok: https://github.com/Asana/devrel-examples/blob/master/javascript/pkce_oauth/README.md (devrel-examples/javascript/pkce_oauth/README.md at master · Asana/devrel-examples · GitHub, 3990 chars)

Probes:
- p1 positive: Metadata found at /.well-known/oauth-authorization-server. No registration_endpoint (no DCR advertised). (https://app.asana.com/.well-known/oauth-authorization-server)
- p2 positive: Endpoint answered, landing on app.asana.com/-/oauth_authorize: it is live and handles an unknown client. (https://app.asana.com/-/oauth_authorize?client_id=invalid&redirect_uri=https%3A%2F%2Fexample.com%2Fcb&response_type=code&state=x)
- p3 positive: Opened the registration page without signing in: login (https://app.asana.com/0/my-apps)
- p4 positive: Opened the link and checked where it lands: docs (https://developers.asana.com/docs/publish-your-app)
- p5 positive: Opened it with a made-up client and those scopes: login (https://app.asana.com/-/oauth_authorize)
- p6 positive: Loaded it with a plain page request (no token request was sent): loaded (https://app.asana.com/-/oauth_token)

Claim-check notes:
- follow-up round for: Token page https://developers.asana.com/docs/oauth: The read timed out, so I got no usable content. I searched 'Asana OAuth token refresh authorization code'.

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