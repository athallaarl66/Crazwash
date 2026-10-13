# Technical documentation — resolved issues

Write-ups for issues that were investigated and fixed. Each document states what was observed, what
changed, the commands that were actually run, and the checks that are still outstanding; a claim is
only described as verified once it was executed.

| Document                                                                     | Area                                                                                            | Status                          |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------- |
| [Issue 01 — Customer-facing placeholders](issue-01-customer-facing-placeholders.md) | Checkout payment data, order confirmation, public pricing                                       | Implemented, 6 live checks pending |
| [Issue 02 — Auth and admin authorization](issue-02-auth-and-admin-authorization.md) | Session role, admin guards, sign-in lockout, customer provisioning, rate limiting                | Implemented, 17 checks pending  |
| [Issue 03 — Admin console UX](issue-03-admin-console-ux.md) | Order status model, order detail, change feedback, list summaries, notifications, navigation, service duration | Implemented, 15 checks pending |

## Convention

- One document per issue, filename `issue-NN-<slug>.md`, written in English like the rest of the
  repository.
- Same section order as the two documents above: Status, Scope, Symptoms, Root cause, Fix, Evidence,
  How to verify, Pending verification, Follow-ups / out of scope.
- Every `Symptoms` claim carries a `file:line` reference or a command that shows it.
- `Evidence` records commands that were run and what they returned — never a plausible result that was
  not observed.
- Anything not executed stays under `Pending verification`, together with what it needs to close.
- Secret values (password hashes, signing secrets, connection strings) are referenced by location, never
  copied into a document.
- The matching OpenSpec change under `openspec/changes/` remains the source of truth for requirements;
  these documents explain the issue to a reader who has not read that change.
