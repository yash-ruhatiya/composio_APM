# Provider OAuth App Readiness Checklist (v2)

This document lists the information to fetch so a developer or agent knows how to get a provider's OAuth app ready for real users: what is required, what the process is, who does each step, and what can block approval.

The checklist is built in two layers:

1. **Process layer (sections 1–16)** — facts about the provider and the setup process, each backed by evidence.
2. **Verdict layer (section 17)** — difficulty, time, cost, and confidence, derived only from the process layer. Nothing in the verdict may be stated unless it traces back to facts collected above.

Scope: getting the OAuth app registered, approved, and connected. Building the full integration (API catalogue, data models, webhooks, SDKs) is out of scope and belongs in a separate document.

## 1. Provider Identity

- [ ] Provider name
- [ ] Official website
- [ ] Developer portal URL
- [ ] App registration / console URL
- [ ] OAuth documentation URL
- [ ] App review / verification documentation URL
- [ ] Production, sandbox, and developer environments, and whether each needs its own app
- [ ] Regional or data-residency hosts that change OAuth endpoints (e.g. EU vs US)
- [ ] Developer support channel, partner contact, and status page

## 2. Connection Options

Find every way a developer could connect, before assuming they must register their own app.

- [ ] Is a managed / shared OAuth app available (e.g. Composio managed app)
- [ ] Is dynamic client registration supported (no manual app registration needed)
- [ ] OAuth 2.0 authorization code
- [ ] OAuth 2.0 authorization code with PKCE
- [ ] OAuth 2.0 client credentials
- [ ] OAuth 2.0 device authorization grant
- [ ] OAuth 1.0a
- [ ] API key / personal access token
- [ ] Service account or JWT-based server auth
- [ ] Custom or proprietary auth

For each available option:

- [ ] Whether tokens are for a user, workspace, organization, or application
- [ ] Whether it supports long-running, unattended (offline) access
- [ ] What it loses compared to registering your own OAuth app (branding, scopes, limits)
- [ ] Recommended option for an AI agent acting on behalf of users

## 3. Applicant Eligibility

Who is allowed to register and publish an app. Many setups fail here before any technical work.

- [ ] Developer account type required: free, paid, developer program, partner program
- [ ] Can an individual apply, or is a registered company required
- [ ] Business verification required: legal entity, D-U-N-S, tax ID, business address
- [ ] Paid plan or minimum seat count required on the developer's own account
- [ ] Partner agreement, NDA, or sales contact required before access
- [ ] Country or region restrictions on who can register
- [ ] Can app ownership be transferred between accounts or organizations
- [ ] Can multiple team members manage the app

## 4. App Registration

- [ ] Steps to create the app, in order
- [ ] Application type options: web, native, server, public, confidential
- [ ] Required app metadata: name, description, logo (size/format), homepage, privacy policy URL, terms URL, support email
- [ ] Client ID issuance
- [ ] Client secret issuance, and whether it is shown only once
- [ ] Client secret expiry and rotation (e.g. Azure secrets expire)
- [ ] Redirect URI rules: HTTPS required, localhost allowed, exact match, wildcards, max count
- [ ] Whether redirect URIs can be changed after approval without re-review
- [ ] Domain ownership verification required, and how
- [ ] APIs or products that must be enabled separately in the console
- [ ] Separate apps needed for dev vs production
- [ ] Per-tenant values needed at connect time: subdomain, instance URL, shop name, tenant ID

## 5. OAuth Contract

- [ ] Authorization endpoint URL
- [ ] Token endpoint URL
- [ ] Revocation endpoint URL
- [ ] Discovery / metadata endpoint URL, if supported
- [ ] Userinfo or "who am I" endpoint URL
- [ ] Supported grant types
- [ ] Scope format and delimiter (space, comma, plus)
- [ ] PKCE: required, supported, or unsupported; supported methods
- [ ] Token-exchange client authentication: basic header, body params, JWT
- [ ] Provider-specific required parameters (audience, resource, tenant, prompt)
- [ ] Parameter needed to get offline access (e.g. `access_type=offline`, `offline_access` scope)
- [ ] Admin consent vs user consent behavior
- [ ] Re-consent behavior when scopes are added
- [ ] Expected error callback parameters and common error codes

## 6. Tokens and Session Lifetime

Critical for agents, which run unattended for long periods.

- [ ] Access token lifetime
- [ ] Is a refresh token issued, and under what conditions
- [ ] Refresh token lifetime and inactivity expiry
- [ ] Refresh token rotation and reuse rules
- [ ] Token lifetime differences in test mode vs production
- [ ] Events that revoke tokens: password change, user removal, admin action, app unpublished
- [ ] Maximum number of active tokens per user or app
- [ ] Periodic forced re-consent, if any

## 7. Scopes and Permissions

- [ ] Default scopes and the minimum scope set for the intended agent use case
- [ ] Exact scope identifiers
- [ ] Mapping of each scope to the capability it unlocks
- [ ] Sensitivity of each scope: standard, sensitive, restricted
- [ ] Which scopes trigger provider review or a security assessment
- [ ] Which scopes require admin approval in the user's organization
- [ ] Which scopes require a paid plan on the end user's account
- [ ] Lower-sensitivity alternatives to restricted scopes
- [ ] Scope justification text the provider expects for review

## 8. Test / Development Mode Limits

What works before approval, and where it stops.

- [ ] Can the developer connect their own account without review
- [ ] Test user cap (e.g. Google allows 100 test users)
- [ ] How test users are added
- [ ] Unverified-app warning shown to users, and what it says
- [ ] Hard cap on users or installs before approval or listing
- [ ] Token expiry differences in test mode (e.g. Google 7-day refresh tokens)
- [ ] Rate limits before approval
- [ ] Features or scopes unavailable until approved
- [ ] Sandbox or developer org availability and cost

## 9. Review, Verification, and Approval

- [ ] Is review required, and what triggers it (scopes, user count, public listing)
- [ ] Internal vs external / private vs public app mode
- [ ] Review submission URL and steps
- [ ] Required review materials: demo video, screencast of scope usage, scope justifications, test account for reviewer, written use case
- [ ] Security assessment required (e.g. Google CASA), assessor, and cost
- [ ] Privacy policy content requirements (specific disclosures the provider checks)
- [ ] Data handling, retention, or security questionnaire
- [ ] Brand verification or homepage requirements
- [ ] Expected review duration, best and worst case, with source
- [ ] How to check review status
- [ ] Common rejection reasons
- [ ] Resubmission and appeal process
- [ ] Changes after approval that trigger re-review

## 10. Distribution and Marketplace

- [ ] Can outside users connect without a marketplace listing
- [ ] Is a public marketplace / app directory listing required (Slack, Atlassian, Shopify, HubSpot)
- [ ] Listing requirements and listing review process
- [ ] Install caps for unlisted apps
- [ ] Per-organization install or allowlisting by the customer's admin
- [ ] Whether the customer's admin must approve the app in their own console

## 11. Cost and Recurring Obligations

- [ ] Developer program or partner fees
- [ ] Required paid plan for the developer
- [ ] Required paid plan for end users to use the scopes
- [ ] Security assessment cost
- [ ] Annual re-verification or reassessment
- [ ] Recertification deadlines and consequences of missing them
- [ ] Policy changes announced that affect future approval

## 12. Steps and Ownership

Assemble the ordered setup process from sections 2–11. For every step:

- [ ] Phase: prepare, register, configure, test, review, launch
- [ ] Step title and exact instructions
- [ ] Source section the step comes from
- [ ] Owner: agent can do it, developer must do it, or waiting on provider
- [ ] Why a human is needed, if so (login, payment, legal, judgment, CAPTCHA)
- [ ] Inputs needed before the step
- [ ] Output produced by the step
- [ ] Hands-on effort estimate, with basis
- [ ] Provider wait estimate, with basis
- [ ] Whether the step is needed for dev-ready, production, or both

## 13. Blockers and Fallbacks

For each known blocker:

- [ ] Blocker description
- [ ] Source section and evidence it comes from
- [ ] Likelihood: common, possible, rare
- [ ] Step where it appears
- [ ] Workaround or fallback (managed app, API key, narrower scopes, internal mode)
- [ ] Who to contact and how
- [ ] Time cost if hit

## 14. Connection Verification

- [ ] Minimal read-only API call that confirms the token works
- [ ] Endpoint that returns the authenticated user or account
- [ ] Expected success response
- [ ] Expected failure responses and their meaning
- [ ] Test for refresh-token functionality
- [ ] Test for required scopes being granted
- [ ] Test for tenant / workspace selection, if applicable

## 15. Connection Lifecycle

- [ ] Reconnection after token expiry
- [ ] Reauthorization after scope changes
- [ ] User disconnect and revoke procedure
- [ ] Provider-side deauthorization notification, if any
- [ ] Behavior when the app is suspended, unpublished, or deleted
- [ ] Client secret rotation without breaking existing connections

## 16. Evidence and Freshness

For every fact, capture:

- [ ] Exact claim or value
- [ ] Status: tested, sourced, inferred, unverified
- [ ] Source URL and short quote, if sourced
- [ ] Probe or manual-check reference, if tested
- [ ] Date accessed / date tested
- [ ] Source last-updated date, if available
- [ ] Conflicting sources, if any
- [ ] Whether the source requires login
- [ ] Whether the fact is likely to change

Guide-level:

- [ ] Last verified date for the whole guide
- [ ] Manual setup attempts made and their results
- [ ] Unknowns register: what could not be confirmed, stated plainly

**Important:** distinguish between `supported`, `unsupported`, and `unknown`. If documentation does not mention refresh tokens, PKCE, or a review requirement, that alone does not prove the provider lacks it.

## 17. Verdict (Derived)

Compute the verdict only after sections 1–16 are filled. Every verdict field must cite the facts it was derived from. If a deciding fact is `unknown`, the verdict must say so instead of guessing.

### Difficulty Tier

Apply the first rule that matches:

- [ ] **Partner-gated** — section 3 requires a partner program, sales contact, agreement, or paid plan before any app can be created
- [ ] **Review-gated** — section 9 requires review for the minimum scope set (section 7), or section 8 / section 10 caps block real users without approval or listing
- [ ] **Self-serve** — an app can be registered and used by arbitrary users with no review, listing, or eligibility gate
- [ ] **Instant** — section 2 shows a managed app or dynamic client registration covers the needed scopes, so no app registration is needed
- [ ] Deciding facts for the chosen tier, with evidence ids

### Time

- [ ] Dev-ready effort = sum of hands-on effort for steps marked dev-ready (section 12)
- [ ] Dev-ready wait = provider waits on the dev-ready path (section 12)
- [ ] Production effort = sum of hands-on effort for all steps (section 12)
- [ ] Production wait = provider waits on the production path (sections 9, 10, 12), as a best-to-worst-case range
- [ ] Added time if the most likely blocker is hit (section 13)

### Cost

- [ ] Out-of-pocket cost to dev-ready (section 11)
- [ ] Out-of-pocket cost to production (section 11)
- [ ] Recurring yearly cost and obligations (section 11)

### Agent vs Human Split

- [ ] Count and share of steps the agent can do (section 12)
- [ ] Steps that require the developer, and why
- [ ] Steps that wait on the provider

### Top Risks

- [ ] Most likely blocker (section 13, highest likelihood)
- [ ] Most expensive blocker in time or money (section 13)
- [ ] Recommended fallback path (sections 2, 13)

### Confidence

Derive from the evidence status of the facts the verdict depends on:

- [ ] **High** — every deciding fact is `tested` or `sourced`
- [ ] **Medium** — at least one deciding fact is `inferred`
- [ ] **Low** — at least one deciding fact is `unverified` or `unknown`
- [ ] List of deciding facts that pulled confidence down

### Summary

- [ ] Two-sentence verdict: tier, main reason, and time to production
- [ ] Recommended next step for the developer

## 18. Final Guide Deliverables

| Deliverable | What it must include |
|---|---|
| Connection options | Managed app, DCR, own app, API key fallback |
| Eligibility | Who can apply, entity and plan requirements |
| Setup guide | Ordered steps with owner, inputs, outputs, effort, wait |
| OAuth contract | Endpoints, parameters, PKCE, redirect rules, per-tenant values |
| Token behavior | Lifetimes, refresh, offline access, test-mode differences |
| Permissions | Minimum scopes, sensitivity, review triggers |
| Test-mode limits | User caps, warnings, expiry, what is blocked before approval |
| Review package | Materials, assessment, duration, rejection reasons |
| Distribution | Listing and admin-install requirements |
| Cost | One-time and recurring costs |
| Blockers | Likelihood, fallback, contact |
| Verification plan | Safe connection test and expected outcomes |
| Evidence manifest | Sources, status, dates, conflicts |
| Unknowns register | Missing facts and access blockers |
| Verdict card | Tier, time, cost, agent/human split, risks, confidence — each traced to the facts above |

## 19. Four Distinct Parts of the Guide

Keep these separate:

1. **What the provider requires** — eligibility, registration rules, review, limits, cost.
2. **What the developer or agent must do** — ordered steps, each with an owner.
3. **What remains uncertain** — unverified claims and open questions, stated plainly.
4. **What the verdict concludes** — derived from parts 1–3, never stated independently.

Keeping these separate prevents provider documentation from being mistaken for a confirmed setup path, and prevents the verdict from being a guess.
