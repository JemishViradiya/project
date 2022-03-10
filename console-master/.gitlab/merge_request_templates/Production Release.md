<!-- Set the MR title to "UES Console | Promote to production" -->

## Author's checklist (required)

All Merge requests to production must use following subject:

    UES Console | Promote to production

Merge requests should only come from master or a hotfix/\* branch which is currently up to date with production branch.

## Ephemeral Deployment

Ephemeral link:

## AWS translation

AWS translation MR link:

## Approval checklist

Merge request approvals are required from 3 groups

- [ ] **In "Ephemeral Deployment" section, list the link.**
- [ ] **In "AWS translation" section, list the link.**
- [ ] Development (teams/merlot)
- [ ] QA: validate functionality and ensure that there is no 'feature leak'. Approvals are required
  - [ ] QA - UI (mandatory)
  - [ ] QA - BG (mandatory)
  - [ ] QA - Persona (mandatory)
  - [ ] QA - MTD (mandatory)
  - [ ] QA - DLP (optional)
  - [ ] QA - EDR (optional)
  - [ ] QA - EPP (optional)
- [ ] Operations: confirm that a deployment in the next 24 hours of the MR being created.

/label ~Production
/title UES Console | Promote to production

/assign @teams/merlot
/assign @mrincon
/assign @dracicot
/assign @teams/uc-qa-approvers-ui
/assign @teams/uc-qa-approvers-bg
/assign @teams/uc-qa-approvers-persona
/assign @teams/uc-qa-approvers-mtd
/assign @teams/uc-qa-approvers-dlp
/assign @teams/uc-qa-approvers-edr
/assign @teams/uc-qa-approvers-epp

/cc @pmorley
