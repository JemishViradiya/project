# UES Console Pipelines

## Merge Requests

1. Merge request created or updated

1. A pipeline runs for [merged results](https://docs.gitlab.com/ee/ci/merge_request_pipelines/pipelines_for_merged_results/)

   - If changes affect storybooks, a review app for storybooks will be published in the merge request

1. Approval are required per the [CODEOWNERS](./CODEOWNERS) file

1. Merge request is _sumbitted_ with requisite build and codeowners approvals by clicking _Start merge train_ button in ui

1. A pipeline runs for [merge trains](https://docs.gitlab.com/ee/ci/merge_request_pipelines/pipelines_for_merged_results/merge_trains/)

   - Coordinates submissions of multiple merge requests _in-order_

1. Changes are merged into the master branch automatically

1. A pipeline runs for the master branch and deploys the new site to the labs

## Pipeline anatomy

Pipeline jobs run in the following stages

| Stages    |                                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------------ |
| `.pre`    | Builds a ci agent docker image with nodejs                                                                         |
| `build`   | Builds the site and storybooks                                                                                     |
| `test`    | Runs static analysis, code formatting and unit tests                                                               |
| `review`  | For _merge requests_, publishes review sites in our [pipeline server](https://ues-console-sites.sw.rim.net/sites/) |
| `publish` | For _master branch_, publishes official sites in GitLab Pages                                                      |
| `deploy`  | For _protected branches_, deploys artifacts to AWS                                                                 |

## Scripts

| Type       |    Entrypoint    |      Modules       |
| ---------- | :--------------: | :----------------: |
| Gitlab     | `.gitlab-ci.yml` | `.gitlab/ci/*.yml` |
| Make       |    `Makefile`    | `tools/make/*.mk`  |
| Deployment |                  | `tools/deploy.yml` |

## Docker

Node.js steps of pipelines run in custom docker images. Hashes are calculated based on input files for the particular image. Changes in hashed input files will cause the `ci-agent-nodejs` job in the `.pre` stage to build and push new docker images to `ues-pipeline-su.devlab2k.testnet.rim.net`.

Other steps use `registry.rim.net/cug/deployment-tools:5ea8cd3a`

#### Base Image

    ues-pipeline-su.devlab2k.testnet.rim.net/enterprise/ues/console/ci-agent:HASH

A base image is built from Dockerfile.ci-agent

- install OS dependencies

#### Pipeline Image

    ues-pipeline-su.devlab2k.testnet.rim.net/enterprise/ues/console/ci-agent-nodejs:HASH

A pipeline image is built from tools/ci/agent-nodejs, inheriting from the base image

- setup working tree in /base/${CI_BUILDS_DIR}
- install packages with yarn
