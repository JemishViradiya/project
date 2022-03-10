# GitLab Flow

[UES Console Repository](https://gitlab.rim.net/UES/console)

## Overview

This project uses a single-branch delivery model based on the [master](https://gitlab.rim.net/UES/console/-/tree/master) branch.

## Branches

All _top-level_ branches are restricted. The `master` branch is the only _top-level_ branch accepting merge requests. Scoped branches are available for specific use cases as documented below.

## Merge Requests

The following branches are available to developers to generate merge requests:

- feature/\*
- hotfix/\*
- topic/\*

This project is configured to use GitLab [Merge Trains](https://docs.gitlab.com/ee/ci/merge_request_pipelines/pipelines_for_merged_results/merge_trains/) for coordinated submission to the master branch. See [this blog post](https://about.gitlab.com/blog/2020/01/30/all-aboard-merge-trains/) for more information

## Approvals

Approvals are controlled through GitLab's [CODEOWNERS](./CODEOWNERS) file. When submitting your merge request, GitLab will calulate the set of required approvers based on your changes.

## Pages

Gitlab pages are used for _only_ branch (merge request, git-ops) contexts. Pages content inculdes:

- Storybook microsites
  - assets
  - behaviours

Root page: https://ues.pages.rim.net/console

Branch page (eg: mybranch): https://ues.pages.rim.net/console/branch/topic/mybranch

Links to the relevant deployment will added to each merge request, both during review and after merge.
Merge-request deployments will be removed after the branch is deleted or after 3 days of inactivity.

## GitOps

Master branch is continuously deployed to the [lab environment](https://gitlab.rim.net/UES/console/-/environments/1721)

Production and staging deployments are driven using a gitops model, aligned with Enterprise Common Services.
