# Ramp: OAuth app setup

**Partner-gated** (confidence: medium). Ramp supports OAuth for third-party apps, but serving other Ramp businesses needs partner approval and a production access application.

- Sandbox is self-serve and ready in about a minute. [e4 sourced]
  - The help center says sandbox access is requested by form and is ready in about one minute. You must create a separate sandbox app.
- Publishing to other businesses needs two Ramp approvals. [e5 sourced]
  - First a partner application (gives Developer console access), then a production access application for the app.
- Approval wait times are not published. [e5 sourced]
  - None of the pages I read state a review duration.
- Admin approval is needed on each customer's side. [e6 sourced]
  - An Admin or Business Owner must approve apps that access the whole business.

- Working in dev: 2 h–4 h 15 min hands-on, no waiting
- Ready for real users: 3 h–6 h 15 min hands-on, wait unknown
- OAuth for your users: You register an OAuth app. Ramp documents the Authorization Code grant for third-party apps. Publishing to other Ramp businesses needs a partner application and production access approval.
- An agent can do 4 of 9 steps (44%), 1 of them only with your OK.
- Top risk: **Partner approval required to publish** (common). Apply to the partner program early and email partnerships@ramp.com if no invite arrives. [e5 sourced]

**How we got the times** (hands-on hours from the rubric; waits only from a provider statement or an observation)

- Dev, step 0: Account or plan setup, 15 min
- Dev, step 1: Account or plan setup, 15 min
- Dev, step 2: App registration form, 15 min–30 min
- Dev, step 3: Redirect URI and scopes, 15 min
- Dev, step 4: Authorize and token exchange, 1 h–3 h
- Real users, step 5: Submit for review, 15 min–30 min
- Real users, step 6: The provider does it (you wait), 0 h
- Real users, step 7: Submit for review, 15 min–30 min
- Real users, step 8: The provider does it (you wait), 0 h
- Real users, step 9: Test with your own account, 30 min–1 h

## Steps to follow

**Getting to dev**

0. **Have these ready** (You). Done when: all in place.
   - **Ramp admin account**. Admin access is required to create a developer app. [e7 sourced]
   - Decide whether to request `cards:read_vault` (restricted) [e14 sourced]
   - Decide whether to request `offline_access` (unknown) [e15 tested]
1. **Request sandbox access** (You · 15 min). [e4 sourced] [e13 sourced]
   - Submit the sandbox access form.
   - Sandbox is ready in about a minute.
   - Rule: **Separate sandbox and production apps and hosts**. Sandbox authorize is demo.ramp.com and its API is demo-api.ramp.com. Production uses app.ramp.com and api.ramp.com. Tokens only work in the environment that issued them. [e4 sourced] [e13 sourced]
   - Explained at: Ramp docs → Sandbox access (https://docs.ramp.com/developer-api/v1/sandbox-access)
   - Sandbox API base: `https://demo-api.ramp.com`
   - Sandbox authorize URL: `https://demo.ramp.com/v1/authorize`
   - Agent checked: **Couldn't check**. Only site navigation loaded ("Ramp API Documentation")
   - **→ You take over here.** You do step 1; an agent can pick up after it
2. **Create sandbox developer app** (Agent · 15 min–30 min). Done when: Client ID and secret. [e7 sourced] [e12 sourced]
   - Create the app in the sandbox Developer apps settings.
   - Under Scopes, click Configure allowed scopes.
   - Enable the Authorization Code and Refresh Token grant types.
   - Save the client ID and secret.
   - Rule: **Enable the Refresh Token grant type**. Refresh tokens are only issued if the grant type is enabled on the app. [e12 sourced]
   - Explained at: Ramp → Settings → Developer (https://support.ramp.com/accessing-the-developer-api)
   - Scopes: `transactions:read`, `business:read`
   - ⚠ Watch out: **Restricted or partner-only scopes** (possible). Submit a Developer API support ticket for scopes you can't see. [e14 sourced] [e7 sourced]
   - ? Not confirmed: Whether the sandbox app can fully test the flow without partner approval is unconfirmed, though the help center says sandbox is for testing apps for other businesses.
   - ? Not confirmed: Step 2's link support.ramp.com/accessing-the-developer-api is a docs page, not the registration form; find the portal page where you create the app.
   - Agent checked: **Couldn't check**. Docs page, not the form ("Ramp Developer API overview — Ramp Help Center")
3. **Set your app's OAuth callback URL** (Agent · 15 min). [e8 sourced]
   - Add your app's OAuth callback URL to the app's redirect URIs.
   - It must match exactly, including the path.
   - Rule: **Exact redirect URI match**. redirect_uri must exactly match a configured URI, including the path. [e8 sourced]
   - Where you do it: Ramp → Developer app settings
   - Redirect URI: `your app's OAuth callback URL`
4. **Run the authorization code flow in sandbox** (Agent, with your OK · 1 h–3 h). [e8 sourced] [e9 sourced] [e10 sourced] [e11 sourced]
   - Redirect the user to the authorize URL with state.
   - Exchange the code within 5 minutes using HTTP Basic auth.
   - Store the refresh token securely.
   - Paste the secret only with your OK.
   - Rule: **Client auth via HTTP Basic**. The token endpoint takes client ID and secret as HTTP Basic auth, with a form-encoded body. [e9 sourced]
   - Rule: **Auth code lifetime 5 minutes**. Exchange the code immediately. [e10 sourced]
   - Rule: **Access token lifetime 1 hour by default**. Authorization Code and refresh-token access tokens default to 3600 seconds. Use expires_in from the response. [e11 sourced]
   - Explained at: Ramp docs → Authorization (https://docs.ramp.com/developer-api/v1/authorization)
   - Token URL (sandbox): `https://demo-api.ramp.com/developer/v1/token`
   - Auth header: `Authorization: Basic base64(client_id:client_secret)`
   - Scopes: `transactions:read`, `business:read`
   - ? Not confirmed: The pages I read don't say whether PKCE is required or supported on the standard token endpoint. Discovery shows a separate bank-feeds PKCE token endpoint.
   - ? Not confirmed: Refresh token lifetime and whether a refresh returns a new refresh token are not stated.
   - ? Not confirmed: The authorize endpoint probe loaded a script-rendered page, so I don't know how it rejects an unknown client.

✓ **Working in dev:** 2 h–4 h 15 min hands-on, no waiting

**Getting to real users**

5. **Submit partner application** (You · 15 min–30 min). [e5 sourced] [e16 sourced] [a2 tested]
   - First-time partners submit the application from the partner integration guide.
   - Ramp emails an invite to the Work email on approval.
   - Don't resubmit if one is already pending.
   - Where you do it: Ramp → Technology Partner Program (https://ramp.com/technology-partnerships)
   - ⚠ Watch out: **Partner approval required to publish** (common). Apply to the partner program early and email partnerships@ramp.com if no invite arrives. [e5 sourced]
   - Agent checked: **Matches the guide**. Loads "Technology Partner Program | Ramp"
6. **Wait for partner approval** (Provider · 0 min). [e5 sourced]
   - Ramp approves the partner application and sends an invite to the Developer console.
   - ? Not confirmed: Review and approval durations for the partner and production access applications are not published.
7. **Apply for production access** (You · 15 min–30 min). [e5 sourced] [a1 tested]
   - Create the production app in the Developer console, not the Developer apps settings.
   - On the Production access tab, click Apply and complete the application.
   - Where you do it: Ramp Developer console (https://app.ramp.com/s/ramp-developer)
   - Production authorize URL: `https://app.ramp.com/v1/authorize`
   - Production token URL: `https://api.ramp.com/developer/v1/token`
   - ? Not confirmed: The exact production access requirements are not documented on the pages I read, such as security review or contract.
   - Agent checked: **Matches the guide**. Live; it asks the user to sign in before showing consent, so the scopes weren't visible
   - Agent checked: **Couldn't check**. Not found for a plain page request; endpoints that only take POST often answer this way
8. **Wait for production access approval** (Provider · 0 min). [e5 sourced]
   - After approval you can onboard production customers through OAuth.
9. **Verify the production connection** (Agent · 30 min–1 h). [e6 sourced]
   - Complete OAuth with a customer admin.
   - Call GET /developer/v1/business with the access token. A 200 response with business details means success.
   - Explained at: Ramp API docs (https://docs.ramp.com/developer-api/v1)
   - Production API base: `https://api.ramp.com`
   - Scopes: `business:read`
   - ⚠ Watch out: **Customer admin must approve the app** (common). Tell customers that an Admin or Business Owner must connect the app. [e6 sourced]

✓ **Ready for real users:** 3 h–6 h 15 min hands-on, wait unknown

**Not confirmed across the setup**

- ? Rate limits are not stated on the pages I read.
- ? The link support.ramp.com/integrations/set-up-workflow-and-productivity-integrations/accessing-the-developer-api was not found in stage 2; find the current page.

---

## How this guide was checked

### At a glance

| Area | Finding | Evidence | Status | Next step |
|---|---|---|---|---|
| Difficulty | Partner-gated | — | Confidence: medium | Read the steps below |
| Agent share | 4 of 9 steps (44%) | — | Counted from steps | See Steps to follow for who does each one |
| OAuth access | You register an OAuth app | — | From research | You: register an app with the provider |
| Time to dev | 2 h–4 h 15 min hands-on, no waiting | — | Needs checking | Estimate: time a real setup to confirm |
| Time to real users | 3 h–6 h 15 min hands-on, wait unknown | — | Needs checking | Unknown: ask the provider or time a real setup |
| Review page | https://support.ramp.com/integrations/set-up-workflow-and-productivity-integrations/accessing-the-developer-api/ | e5 | Read | — |
| Token page | https://docs.ramp.com/developer-api/v1/authorization | e9, e10, e11 | Read | — |
| Discovery | https://app.ramp.com/.well-known/openid-configuration | — | Tested | — |
| Authorize URL | https://app.ramp.com/v1/authorize?client_id=invalid&response_type=code&redirect_uri=https://example.com/cb&scope=transactions:read | — | Tested | — |
| Page | https://support.ramp.com/accessing-the-developer-api | — | Tested | — |
| Page | https://support.ramp.com/integrations/set-up-workflow-and-productivity-integrations/accessing-the-developer-api/ | — | Nothing found | — |
| Page | https://app.ramp.com/v1/authorize | — | Tested | — |
| Page | https://api.ramp.com/developer/v1/token | — | Nothing found | — |
| Page | https://docs.ramp.com/developer-api/v1/sandbox-access | — | Tested | — |
| Page | https://ramp.com/technology-partnerships | — | Tested | — |
| Requirement | Partner application approved | e5 | Sourced | You: have this ready |
| Requirement | Ramp admin account | e7 | Sourced | You: have this ready |
| Requirement | Exact redirect URI match | e8 | Sourced | You: have this ready |
| Requirement | Client auth via HTTP Basic | e9 | Sourced | You: have this ready |
| Requirement | Auth code lifetime 5 minutes | e10 | Sourced | You: have this ready |
| Requirement | Access token lifetime 1 hour by default | e11 | Sourced | You: have this ready |
| Requirement | Enable the Refresh Token grant type | e12 | Sourced | You: have this ready |
| Requirement | Separate sandbox and production apps and hosts | e4, e13 | Sourced | You: have this ready |
| Scope | transactions:read | e14 | Sourced | Request only if your agent needs it |
| Scope | business:read | e8 | Sourced | Request only if your agent needs it |
| Scope | cards:read_vault | e14 | Sourced | Request only if your agent needs it |
| Scope | offline_access | e15 | Tested | Request only if your agent needs it |
| Blocker · common | Partner approval required to publish | e5 | Risk | Apply to the partner program early and email partnerships@ramp.com if no invite arrives. |
| Blocker · common | Customer admin must approve the app | e6 | Risk | Tell customers that an Admin or Business Owner must connect the app. |
| Blocker · possible | Restricted or partner-only scopes | e14, e7 | Risk | Submit a Developer API support ticket for scopes you can't see. |
| Open question | Review and approval durations for the partner and production access applications are not published. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | The pages I read don't say whether PKCE is required or supported on the standard token endpoint. Discovery shows a separate bank-feeds PKCE token endpoint. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Refresh token lifetime and whether a refresh returns a new refresh token are not stated. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Rate limits are not stated on the pages I read. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | The authorize endpoint probe loaded a script-rendered page, so I don't know how it rejects an unknown client. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | The exact production access requirements are not documented on the pages I read, such as security review or contract. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Whether the sandbox app can fully test the flow without partner approval is unconfirmed, though the help center says sandbox is for testing apps for other businesses. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Step 2's link support.ramp.com/accessing-the-developer-api is a docs page, not the registration form; find the portal page where you create the app. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | The link support.ramp.com/integrations/set-up-workflow-and-productivity-integrations/accessing-the-developer-api was not found in stage 2; find the current page. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |

### What the agent tried

Stage 2 picked the 6 weakest claims it can check by opening a page (6 sourced); claims already tested were skipped. Tried 6 things: 2 match the guide, 1 corrected, 3 couldn't check. Nothing was submitted or signed in.

| # | Claim from the guide | What the agent tried | Expected | Seen | Status | What changed / Your next step |
|---|---|---|---|---|---|---|
| 1 | Step 2: you register the app at support.ramp.com/accessing-the-developer-api (guide's evidence: Sourced) | Opened the registration page without signing in | A partner application or contact page (the guide says access is partner-gated) | Docs page, not the form ("Ramp Developer API overview — Ramp Help Center") (probe p3) | Couldn't check | Added an open question |
| 2 | Review page goes to support.ramp.com/integrations/set-up-workflow-and-productivity-integrations/accessing-the-developer-api (guide's evidence: Sourced) | Opened the link and checked where it lands | The provider's app review / go-live page | Not found (probe p4) | Corrected | Flagged the link as broken |
| 3 | The authorize URL app.ramp.com/v1/authorize is live and takes the documented scopes (transactions:read, business:read, cards:read_vault) (guide's evidence: Sourced) | Opened it with a made-up client and those scopes | A live endpoint that rejects the made-up client and raises no scope error | Live; it asks the user to sign in before showing consent, so the scopes weren't visible (probe p5) | Matches the guide | Added tested evidence a1 (probe p5) |
| 4 | The token endpoint is api.ramp.com/developer/v1/token (guide's evidence: Sourced) | Loaded it with a plain page request (no token request was sent) | A live OAuth endpoint (it answers a plain request with an error) | Not found for a plain page request; endpoints that only take POST often answer this way (probe p6) | Couldn't check | No change: a not-found here doesn't prove the URL is wrong |
| 5 | Step 1 link goes to docs.ramp.com/developer-api/v1/sandbox-access (guide's evidence: Sourced) | Opened the link and checked where it lands | A docs page about "Ramp docs → Sandbox access" | Only site navigation loaded ("Ramp API Documentation") (probe p7) | Couldn't check | No change |
| 6 | Step 5 link goes to ramp.com/technology-partnerships (guide's evidence: Sourced) | Opened the link and checked where it lands | Where you do "Ramp → Technology Partner Program": a sign-in, sign-up, form or a page about it | Loads "Technology Partner Program \| Ramp" (probe p8) | Matches the guide | Added tested evidence a2 (probe p8) |
| → | Where the agent stopped | Step 1: Request sandbox access | — | A step only you can do (account, legal terms, payment, verification or a decision) | You take over | You do step 1; an agent can pick up after it |

### What we couldn't confirm

- Review and approval durations for the partner and production access applications are not published.
- The pages I read don't say whether PKCE is required or supported on the standard token endpoint. Discovery shows a separate bank-feeds PKCE token endpoint.
- Refresh token lifetime and whether a refresh returns a new refresh token are not stated.
- Rate limits are not stated on the pages I read.
- The authorize endpoint probe loaded a script-rendered page, so I don't know how it rejects an unknown client.
- The exact production access requirements are not documented on the pages I read, such as security review or contract.
- Whether the sandbox app can fully test the flow without partner approval is unconfirmed, though the help center says sandbox is for testing apps for other businesses.
- Step 2's link support.ramp.com/accessing-the-developer-api is a docs page, not the registration form; find the portal page where you create the app.
- The link support.ramp.com/integrations/set-up-workflow-and-productivity-integrations/accessing-the-developer-api was not found in stage 2; find the current page.

### Evidence

- **e1** Sourced: Authorize URL for production (https://docs.ramp.com/developer-api/v1/authorization)
  > https://app.ramp.com/v1/authorize for production
- **e2** Sourced: Token endpoint is /developer/v1/token on api.ramp.com (https://docs.ramp.com/developer-api/v1/api/authorization)
  > curl --location --request POST "https://api.ramp.com/developer/v1/token"
- **e3** Tested: Authorize endpoint on app.ramp.com is live (probe p2) _Page content is script-rendered, so rejection behaviour wasn't visible. Discovery at app.ramp.com (p1) lists no registration_endpoint._
- **e4** Sourced: Sandbox is requested by form, ready in about a minute, with separate base URL and app (https://support.ramp.com/integrations/set-up-workflow-and-productivity-integrations/accessing-the-developer-api/)
  > Your sandbox should be ready in about one minute.
- **e5** Sourced: Publishing for other businesses needs two approvals (https://support.ramp.com/integrations/set-up-workflow-and-productivity-integrations/accessing-the-developer-api/)
  > Publishing an app for other Ramp businesses takes two approvals: a partner application
- **e6** Sourced: Admin or Business Owner must approve (https://docs.ramp.com/developer-api/v1/authorization)
  > an Admin or Business Owner must approve.
- **e7** Sourced: Admin access required to create a developer app (https://support.ramp.com/integrations/set-up-workflow-and-productivity-integrations/accessing-the-developer-api/)
  > Admin access is required.
- **e8** Sourced: Redirect URI must exactly match (https://docs.ramp.com/developer-api/v1/authorization)
  > Must exactly match a redirect URI configured for your app, including the path.
- **e9** Sourced: Client auth via HTTP Basic (https://docs.ramp.com/developer-api/v1/api/authorization)
  > Authorization header formed from base-64 encoded client credentials
- **e10** Sourced: Auth codes expire after 5 minutes (https://docs.ramp.com/developer-api/v1/authorization)
  > Codes expire after 5 minutes.
- **e11** Sourced: Access token default lifetime 1 hour (https://docs.ramp.com/developer-api/v1/authorization)
  > Authorization Code and Refresh Token access tokens default to 1 hour (3,600 seconds)
- **e12** Sourced: Refresh Token grant must be enabled on the app (https://docs.ramp.com/developer-api/v1/authorization)
  > To get refresh tokens, enable the Refresh Token grant type for your app.
- **e13** Sourced: Sandbox and production need separate apps; sandbox authorize host is demo.ramp.com (https://docs.ramp.com/developer-api/v1/authorization)
  > Sandbox and production need separate apps.
- **e14** Sourced: cards:read_vault is only for approved integrators; scopes follow resource:permission (https://docs.ramp.com/developer-api/v1/authorization)
  > cards:read_vault is available only to approved integrators
- **e15** Tested: Discovery lists openid and offline_access scopes (probe p1)
- **e16** Sourced: Ramp technology partner program has an Integration Partner application (https://ramp.com/technology-partnerships)
  > Build an integration, get listed in our directory, and reach businesses actively looking for your category.
- **a1** Tested: The authorize URL app.ramp.com/v1/authorize is live and shows a sign-in page (probe p5) _Stage 2 attempt_
- **a2** Tested: ramp.com/technology-partnerships loads (Technology Partner Program | Ramp) (probe p8) _Stage 2 attempt_

### How this was researched

Pipeline v2. 3 searches (0 failed), 4 of 4 pages read with real content, 8 probes. Claim check: 0 downgraded.

- Review page: Read: https://support.ramp.com/integrations/set-up-workflow-and-productivity-integrations/accessing-the-developer-api/ (Describes the two-approval publishing process. No durations are stated.)
- Token page: Read: https://docs.ramp.com/developer-api/v1/authorization (Also read the API reference page for the token endpoint.)

Searches:
- ok: Ramp developer API OAuth app authorization code scopes
- ok: Ramp developer docs OAuth token refresh
- ok: Ramp developer app go live review partner

Pages:
- ok: https://docs.ramp.com/developer-api/v1/authorization (Authorization — Ramp API docs, 14503 chars)
- ok: https://docs.ramp.com/developer-api/v1/api/authorization (Ramp API docs, 5301 chars)
- ok: https://ramp.com/technology-partnerships (Technology Partner Program | Ramp, 3315 chars)
- ok: https://support.ramp.com/integrations/set-up-workflow-and-productivity-integrations/accessing-the-developer-api/ (Page Not Found, 10247 chars, read via plain-text copy https://support.ramp.com/accessing-the-developer-api.md)

Probes:
- p1 positive: Metadata found at /.well-known/openid-configuration. No registration_endpoint (no DCR advertised). (https://app.ramp.com/.well-known/openid-configuration)
- p2 positive: Endpoint answered with a page titled "Ramp — The corporate card that helps you spend less" at app.ramp.com/v1/authorize; its content loads by script, so how it rejects an unknown client wasn't visible. (https://app.ramp.com/v1/authorize?client_id=invalid&response_type=code&redirect_uri=https://example.com/cb&scope=transactions:read)
- p3 positive: Opened the registration page without signing in: docs (https://support.ramp.com/accessing-the-developer-api)
- p4 negative: Opened the link and checked where it lands: missing (https://support.ramp.com/integrations/set-up-workflow-and-productivity-integrations/accessing-the-developer-api/)
- p5 positive: Opened it with a made-up client and those scopes: login (https://app.ramp.com/v1/authorize)
- p6 negative: Loaded it with a plain page request (no token request was sent): missing (https://api.ramp.com/developer/v1/token)
- p7 positive: Opened the link and checked where it lands: navigation (https://docs.ramp.com/developer-api/v1/sandbox-access)
- p8 positive: Opened the link and checked where it lands: page (https://ramp.com/technology-partnerships)

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