# DocuSign: OAuth app setup

**Partner-gated** (confidence: medium). DocuSign offers OAuth to third-party apps, but a public integration needs Partner Program membership and a Go-Live promotion to a paid production account.

- Demo works immediately with a developer sandbox integration key [e4 sourced]
  - The Developer Console gives demo client IDs and secrets for development and testing.
- Public integrations must join the Docusign Partner Program [e5 sourced]
  - The Go-Live page says launching a public integration requires Partner Program membership.
- Go-Live needs a paid production account [e6 sourced]
  - Promotion needs a paid production account. ISV partners may qualify for a free management account.
- Manual Go-Live reviews usually take 24–48 hours [e7 sourced]
  - Declined apps get manual review, typically 24–48 hours. Some apps are promoted automatically after identity verification.

- Working in dev: 3 h–5 h 45 min hands-on, no waiting
- Ready for real users: 3 h 30 min–6 h 30 min hands-on, 1 d–2 d waiting [e7 sourced]
- OAuth for your users: You register an OAuth app. DocuSign supports OAuth 2.0 Authorization Code Grant for third-party integrations. You register an integration key in a developer account.
- An agent can do 5 of 8 steps (63%), 1 of them only with your OK.
- Top risk: **Partner Program required for public integrations** (common). Apply to the Docusign Partner Program early. [e5 sourced]

**How we got the times** (hands-on hours from the rubric; waits only from a provider statement or an observation)

- Dev, step 0: Account or plan setup, 15 min
- Dev, step 1: Account or plan setup, 15 min
- Dev, step 2: App registration form, 15 min–30 min
- Dev, step 3: Redirect URI and scopes, 15 min
- Dev, step 4: Authorize and token exchange with PKCE, 1 h 30 min–3 h 30 min
- Dev, step 5: Test with your own account, 30 min–1 h
- Real users, step 6: Submit for review, 15 min–30 min
- Real users, step 7: The provider does it (you wait), 0 h; wait 1 d–2 d (provider-stated) [e7 sourced]
- Real users, step 8: Redirect URI and scopes, 15 min

## Steps to follow

**Getting to dev**

0. **Have these ready** (You). Done when: all in place.
   - **Partner Program membership**. Required to launch a public integration used by many Docusign customers. _Applies when: Public multi-customer integration._ [e5 sourced]
   - **Paid production account**. Needed to promote the integration key; you need admin or developer access to it. [e6 sourced]
1. **Create a Docusign developer account** (You · 15 min). [e4 sourced] [a2 tested]
   - Sign up for a free developer (demo) account
   - Accept the terms
   - Where you do it: Docusign Developer Center (https://developers.docusign.com)
   - Agent checked: **Matches the guide**. Loads "Docusign Developer Center | eSignature APIs & Resources | Docusign"
   - **→ You take over here.** You do step 1; an agent can pick up after it
2. **Create an integration app in the Developer Console** (Agent · 15 min–30 min). Done when: Integration key (client ID) and secret. [e4 sourced]
   - Create an app to get a demo integration key
   - Generate a secret key
   - Choose the integration type (public integration for multi-customer use)
   - Explained at: Developer Console (or Admin → Apps and Keys) (https://developers.docusign.com/platform/go-live/)
   - Agent checked: **Couldn't check**. Loaded "Docusign Go-Live | Docusign", but no registration form, sign-in or gate was visible
3. **Set your app's OAuth callback URL and scopes** (Agent · 15 min). [e1 tested] [e2 tested] [e10 sourced] [a1 tested]
   - Add your app's OAuth callback URL as a redirect URI on the integration key
   - Request signature, plus extended for long-lived refresh
   - Where you do it: Developer Console → app → redirect URIs
   - Redirect URI: `your app's OAuth callback URL`
   - Authorize URL (demo): `https://account-d.docusign.com/oauth/auth`
   - Token URL (demo): `https://account-d.docusign.com/oauth/token`
   - Scopes: `signature`, `extended`
   - ? Not confirmed: Redirect URI matching rules (exact match, HTTPS, localhost) were not stated on pages read.
   - Agent checked: **Matches the guide**. Rejected the made-up client without objecting to the scopes
   - Agent checked: **Couldn't check**. A plain page request was sent to the site's home page; endpoints that only take POST often do this
4. **Run the authorization code flow with your demo account** (Agent · 1 h 30 min–3 h 30 min). Done when: Access token and refresh token. [e8 sourced] [e9 sourced] [e10 sourced] [e11 sourced]
   - Send the user to the authorize URL with response_type=code
   - Exchange the code at the token URL with Basic auth
   - Store the refresh token and rotate it on every refresh
   - Rule: **Client authentication**. The token endpoint takes a Basic auth header: base64 of integration key and secret, with a form-encoded body. [e8 sourced]
   - Rule: **Access token lifetime 8 hours**. Access tokens last 8 hours by default for Authorization Code Grant. [e9 sourced]
   - Rule: **Refresh token lifetime and rotation**. Refresh tokens last about 30 days. A refresh returns a new refresh token. Without the extended scope it keeps the original expiry. With the extended scope it gets a full new lifetime. [e10 sourced]
   - Rule: **PKCE for public clients**. Public Authorization Code Grant uses code_challenge with S256 and the code_verifier. [e11 sourced]
   - Explained at: Authorization Code Grant guide (https://developers.docusign.com/platform/auth/authcode/)
   - Token auth header: `Authorization: Basic base64(integrationKey:secret)`
   - Scopes: `signature`
   - ? Not confirmed: Authorization code lifetime was not stated on pages read.
5. **Test with a read-only call** (Agent · 30 min–1 h). [e9 sourced]
   - Call GET https://account-d.docusign.com/oauth/userinfo with the Bearer token
   - Success is a 200 with the user's name, email and accounts list
   - Header: `Authorization: Bearer <access_token>`

✓ **Working in dev:** 3 h–5 h 45 min hands-on, no waiting

**Getting to real users**

6. **Join the Partner Program, get a paid production account, and submit Go-Live** (You · 15 min–30 min). [e5 sourced] [e6 sourced]
   - Join the Partner Program for a public integration
   - Have a paid production account with admin or developer access
   - Pick the integration classification
   - Submit Go-Live from the Developer Console
   - Explained at: Docusign Go-Live (https://developers.docusign.com/platform/go-live/)
   - ⚠ Watch out: **Partner Program required for public integrations** (common). Apply to the Docusign Partner Program early. [e5 sourced]
   - ⚠ Watch out: **Paid production account needed** (common). Get a paid plan, or a free partner management account. [e6 sourced]
   - ? Not confirmed: Whether the Partner Program has its own approval wait, and its cost, is unknown.
   - ? Not confirmed: Developer Console Go-Live is in open beta; the legacy flow may apply to your account.
7. **Docusign reviews and promotes the key** (Provider · 0 min · 1 d–2 d wait). [e7 sourced]
   - Manual reviews usually take 24–48 hours
   - Verified apps may be promoted automatically after identity verification
   - Rule: **Separate production host and config**. Production uses account.docusign.com. Secrets and redirect URIs are not copied at Go-Live, so set them again. [e12 sourced] [e13 sourced]
   - ⚠ Watch out: **Go-Live declined** (possible). Fix the issues flagged, then resubmit. Manual review takes about 24–48 hours. [e7 sourced]
8. **Configure production values** (Agent, with your OK · 15 min). [e12 sourced] [e13 sourced]
   - Re-create the secret and redirect URIs in production
   - Switch to https://account.docusign.com for authorize and token calls
   - Production token URL: `https://account.docusign.com/oauth/token`

✓ **Ready for real users:** 3 h 30 min–6 h 30 min hands-on, 1 d–2 d waiting

**Not confirmed across the setup**

- ? Rate limits were not stated on pages read.
- ? Region-specific hosts (e.g. EU base URIs) were not covered. API base URIs come from userinfo.
- ? The support FAQ page returned only navigation. The 'paid plan' point relies on the developer Go-Live page.

---

## How this guide was checked

### At a glance

| Area | Finding | Evidence | Status | Next step |
|---|---|---|---|---|
| Difficulty | Partner-gated | — | Confidence: medium | Read the steps below |
| Agent share | 5 of 8 steps (63%) | — | Counted from steps | See Steps to follow for who does each one |
| OAuth access | You register an OAuth app | — | From research | You: register an app with the provider |
| Time to dev | 3 h–5 h 45 min hands-on, no waiting | — | Needs checking | Estimate: time a real setup to confirm |
| Time to real users | 3 h 30 min–6 h 30 min hands-on, 1 d–2 d waiting | e7 | Sourced | — |
| Review page | https://developers.docusign.com/platform/go-live/ | e5, e6, e7 | Read | — |
| Token page | https://developers.docusign.com/platform/auth/reference/obtain-access-token/ | e8, e10 | Read | — |
| Discovery | https://account-d.docusign.com/.well-known/openid-configuration | — | Tested | — |
| Authorize URL | https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature&client_id=invalid&redirect_uri=https://example.com/callback | — | Tested | — |
| Page | https://account-d.docusign.com/oauth/auth | — | Tested | — |
| Page | https://developers.docusign.com/platform/go-live/ | — | Tested | — |
| Page | https://account-d.docusign.com/oauth/token | — | Nothing found | — |
| Page | https://developers.docusign.com | — | Tested | — |
| Requirement | Docusign developer (demo) account | e4 | Sourced | You: have this ready |
| Requirement | Partner Program membership | e5 | Sourced | You: have this ready |
| Requirement | Paid production account | e6 | Sourced | You: have this ready |
| Requirement | Client authentication | e8 | Sourced | You: have this ready |
| Requirement | Access token lifetime 8 hours | e9 | Sourced | You: have this ready |
| Requirement | Refresh token lifetime and rotation | e10 | Sourced | You: have this ready |
| Requirement | PKCE for public clients | e11 | Sourced | You: have this ready |
| Requirement | Separate production host and config | e12, e13 | Sourced | You: have this ready |
| Scope | signature | e14 | Needs checking | Confirm in the provider's docs or with a hands-on setup |
| Scope | extended | e10 | Sourced | Request only if your agent needs it |
| Blocker · common | Partner Program required for public integrations | e5 | Risk | Apply to the Docusign Partner Program early. |
| Blocker · common | Paid production account needed | e6 | Risk | Get a paid plan, or a free partner management account. |
| Blocker · possible | Go-Live declined | e7 | Risk | Fix the issues flagged, then resubmit. Manual review takes about 24–48 hours. |
| Open question | Authorization code lifetime was not stated on pages read. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Redirect URI matching rules (exact match, HTTPS, localhost) were not stated on pages read. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Rate limits were not stated on pages read. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Region-specific hosts (e.g. EU base URIs) were not covered. API base URIs come from userinfo. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Whether the Partner Program has its own approval wait, and its cost, is unknown. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | Developer Console Go-Live is in open beta; the legacy flow may apply to your account. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |
| Open question | The support FAQ page returned only navigation. The 'paid plan' point relies on the developer Go-Live page. | — | Not confirmed | Confirm in the provider's docs or with a hands-on setup |

### What the agent tried

Stage 2 picked the 4 weakest claims it can check by opening a page (1 inferred, 3 sourced); claims already tested were skipped. Tried 4 things: 2 match the guide, 0 corrected, 2 couldn't check. Nothing needed correcting in the weak claims attempted: The authorize URL account-d.docusign.com/oauth/auth is live and takes the documented scopes (signature, extended) (inferred); Step 2: you register the app at developers.docusign.com/platform/go-live (sourced); The token endpoint is account-d.docusign.com/oauth/token (sourced); Step 1 link goes to developers.docusign.com (sourced). Nothing was submitted or signed in.

| # | Claim from the guide | What the agent tried | Expected | Seen | Status | What changed / Your next step |
|---|---|---|---|---|---|---|
| 1 | The authorize URL account-d.docusign.com/oauth/auth is live and takes the documented scopes (signature, extended) (guide's evidence: Inferred) | Opened it with a made-up client and those scopes | A live endpoint that rejects the made-up client and raises no scope error | Rejected the made-up client without objecting to the scopes (probe p3) | Matches the guide | Added tested evidence a1 (probe p3) |
| 2 | Step 2: you register the app at developers.docusign.com/platform/go-live (guide's evidence: Sourced) | Opened the registration page without signing in | A partner application or contact page (the guide says access is partner-gated) | Loaded "Docusign Go-Live \| Docusign", but no registration form, sign-in or gate was visible (probe p4) | Couldn't check | No change |
| 3 | The token endpoint is account-d.docusign.com/oauth/token (guide's evidence: Sourced) | Loaded it with a plain page request (no token request was sent) | A live OAuth endpoint (it answers a plain request with an error) | A plain page request was sent to the site's home page; endpoints that only take POST often do this (probe p5) | Couldn't check | No change: only a real token request would show whether the URL is right |
| 4 | Step 1 link goes to developers.docusign.com (guide's evidence: Sourced) | Opened the link and checked where it lands | Where you do "Docusign Developer Center": a sign-in, sign-up, form or a page about it | Loads "Docusign Developer Center \| eSignature APIs & Resources \| Docusign" (probe p6) | Matches the guide | Added tested evidence a2 (probe p6) |
| → | Where the agent stopped | Step 1: Create a Docusign developer account | — | A step only you can do (account, legal terms, payment, verification or a decision) | You take over | You do step 1; an agent can pick up after it |

### What we couldn't confirm

- Authorization code lifetime was not stated on pages read.
- Redirect URI matching rules (exact match, HTTPS, localhost) were not stated on pages read.
- Rate limits were not stated on pages read.
- Region-specific hosts (e.g. EU base URIs) were not covered. API base URIs come from userinfo.
- Whether the Partner Program has its own approval wait, and its cost, is unknown.
- Developer Console Go-Live is in open beta; the legacy flow may apply to your account.
- The support FAQ page returned only navigation. The 'paid plan' point relies on the developer Go-Live page.

### Evidence

- **e1** Tested: Authorize endpoint for demo is live and rejects unknown clients (probe p2) _Returned 'client id provided is not registered'_
- **e2** Tested: Discovery lists authorize and token endpoints, no registration endpoint (probe p1)
- **e3** Sourced: Token endpoint is /oauth/token (https://developers.docusign.com/platform/auth/reference/obtain-access-token/)
  > The POST /oauth/token endpoint returns tokens based on your supplied parameters.
- **e4** Sourced: Developer Console creates integration apps for demo client IDs and secrets (https://developers.docusign.com/platform/go-live/)
  > you can now create integration apps to get demo client IDs and secrets for development and testing
- **e5** Sourced: Public integration requires the Partner Program (https://developers.docusign.com/platform/go-live/)
  > To launch a public integration, you must join the Docusign Partner Program.
- **e6** Sourced: Paid production account required (https://developers.docusign.com/platform/go-live/)
  > You have a paid production account to manage the integration in production.
- **e7** Sourced: Manual reviews typically take 24–48 hours (https://developers.docusign.com/platform/go-live/)
  > Manual reviews are typically completed within 24–48 hours.
- **e8** Sourced: Token endpoint client auth is Basic with integration key and secret (https://developers.docusign.com/platform/auth/reference/obtain-access-token/)
  > The Authorization header contains your integration key and secret key, concatenated by a colon character
- **e9** Sourced: Access token lifetime is 8 hours by default (https://developers.docusign.com/platform/auth/authcode/)
  > Provides an access token with a lifetime of 8 hours, by default.
- **e10** Sourced: Refresh returns a new refresh token; lifetime about 30 days, extended with the extended scope (https://developers.docusign.com/platform/auth/reference/obtain-access-token/)
  > If you have obtained the extended scope, a new refresh token is issued with a full lifetime (typically 30 days).
- **e11** Sourced: PKCE is supported using S256 (https://developers.docusign.com/platform/auth/authcode/)
  > You can optionally include a Proof Key for Code Exchange (PKCE) challenge to add an additional layer of security.
- **e12** Sourced: Secrets and redirect URIs are not copied at Go-Live (https://developers.docusign.com/platform/go-live/)
  > Configuration settings such as secrets and redirect URIs are not copied automatically.
- **e13** Sourced: Production token host is account.docusign.com (https://www.docusign.com/blog/developers/authorization-code-grant-refresh-tokens) _Provider blog_
  > Production environment: https://account.docusign.com/oauth/token
- **e14** Inferred: signature is the eSignature scope _General knowledge of the DocuSign eSignature API, plus the scope used in the authorize probe._
- **a1** Tested: The authorize URL account-d.docusign.com/oauth/auth is live and rejects an unknown client (probe p3) _Stage 2 attempt_
- **a2** Tested: developers.docusign.com loads (Docusign Developer Center | eSignature APIs & Resources | Do) (probe p6) _Stage 2 attempt_

### How this was researched

Pipeline v2. 3 searches (0 failed), 4 of 5 pages read with real content, 6 probes. Claim check: 0 downgraded.

- Review page: Read: https://developers.docusign.com/platform/go-live/
- Token page: Read: https://developers.docusign.com/platform/auth/reference/obtain-access-token/

Searches:
- ok: DocuSign developer authorization code grant OAuth
- ok: DocuSign go-live app review integration key promote
- ok: DocuSign OAuth refresh token lifetime access token

Pages:
- ok: https://developers.docusign.com/platform/go-live/ (Docusign Go-Live | Docusign, 5338 chars)
- ok: https://developers.docusign.com/platform/auth/authcode/ (Authorization Code Grant authentication | Docusign, 6837 chars)
- ok: https://developers.docusign.com/platform/auth/reference/obtain-access-token/ (Obtain access token endpoint | Docusign, 4907 chars)
- only navigation: https://support.docusign.com/s/articles/DocuSign-Developer-FAQs-Integration-Keys-and-Go-Live?language=en_US (Article Detail, 544 chars)
- ok: https://www.docusign.com/blog/developers/authorization-code-grant-refresh-tokens (Authorization Code Grant refresh tokens, 6696 chars)

Probes:
- p1 positive: Metadata found at /.well-known/openid-configuration. No registration_endpoint (no DCR advertised). (https://account-d.docusign.com/.well-known/openid-configuration)
- p2 positive: Endpoint answered, landing on account-d.docusign.com/oauth/auth: it is live and handles an unknown client. (https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature&client_id=invalid&redirect_uri=https://example.com/callback)
- p3 positive: Opened it with a made-up client and those scopes: client rejected (https://account-d.docusign.com/oauth/auth)
- p4 positive: Opened the registration page without signing in: page (https://developers.docusign.com/platform/go-live/)
- p5 negative: Loaded it with a plain page request (no token request was sent): homepage (https://account-d.docusign.com/oauth/token)
- p6 positive: Opened the link and checked where it lands: page (https://developers.docusign.com)

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