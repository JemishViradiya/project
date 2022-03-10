#
# This Makefile serves several purposes:
#   - the CI/CD Pipeline defined in gitlab-ci.yml delegates to this makefile
#   - the developer can run the same commands as run in CI
#   - the repo that does a complete deployment, recursively clones and deploys all the repos
#
include tools/make/common.mk
include tools/make/nx.mk
include tools/make/sites.mk
include tools/make/ci.mk

# PROJECT_NAME must match Deployment spec.template.spec.containers.name
PROJECT_NAME := ues-console

# These are the top-level targets uses and pipeline may want to call
TOP_TARGETS := build audit lint format formatcheck unittest storybook deploy pages help
.PHONY: ${TOP_TARGETS} base-ref install-deps dockerlint build-deps build-shared
.SILENT: dev-setup_pre dev-install dev-deps

JQ ?= jq
YARN := yarn --silent
RSYNC_EXTRA_ARGS ?=
export RSYNC := rsync -rltD -uh --partial --no-perms --no-owner --no-group ${RSYNC_EXTRA_ARGS}
export RSYNC_CACHE := rsync://gitlab@ues-pipeline-su.devlab2k.testnet.rim.net:8873/uc-cache
export RSYNC_SITES := rsync://gitlab@ues-pipeline-su.devlab2k.testnet.rim.net:8873/uc-sites
ACCUMULATE_PAGES ?= true
export CI_DEFAULT_BRANCH ?= master
export CFG_YARN_REGISTRY := npm.ebnexus.sw.rim.net
PAGES_MAX_AGE ?= 3
export CI_DOCKER_REGISTRY ?= ues-pipeline-su.devlab2k.testnet.rim.net

export NODE_OPTIONS ?= --max_old_space_size=8192
export NODE_EXTRA_CA_CERTS ?= $(CURDIR)/.yarn-registry.crt
export CYPRESS_RECORD_KEY ?= "MyKey"

all: help
help:
	@echo "Available Targets:"
	@echo "\t${TOP_TARGETS}"


dev-install:
	@echo "\nhusky > $(YARN) install --frozen-lockfile --prefer-offline\n"
	$(YARN) install --frozen-lockfile --prefer-offline

dev-deps:
	@echo "\nhusky > $(YARN) affected:shared\n"
	$(YARN) affected:shared --with-deps

dev-setup: dev-install dev-deps

dockerlint:
	$(DOCKER) build $(DOCKER_BUILD_ARGS) --target lint .

workspace-lint:
	$(YARN) workspace-lint

lint:
	@echo "Linting ${NX_MODE} projects with eslint"
	$(YARN) $(NX_MODE):lint $(NX_ARGS) --hasTypeAwareRules

formatcheck:
	@echo "Checking the format of ${NX_MODE} projects with prettier"
	$(YARN) format:check $(NX_ARGS) $(NX_BASE)
	if git grep 'eslint-disable.*@nrwl/nx' ':^tools/*' ':^Makefile' ':^*/.storybook/*' ':^*/x-grid.stories.*' ':^*/XGridWithDrawer.stories.*' ; then echo "Banned eslint-disable @nrwl/nx/* rule detected in above files"; exit 99 ; fi

format:
	@echo "Checking the format of ${NX_MODE} projects with prettier"
	$(YARN) format:write $(NX_ARGS) $(NX_BASE)

build-deps: build-shared

build-shared:
	$(YARN) $(NX_MODE_BUILD):shared $(NX_ARGS) --prod --with-deps

build:
	@echo "Updating branded title. BB_BRANDING: ${BB_BRANDING}"
	if [ ${BB_BRANDING} = true ]; then echo "NX_PAGE_TITLE=\"BlackBerry UES\"" > ${PWD}/.env; else echo "NX_PAGE_TITLE=\"CylancePROTECT\"" > ${PWD}/.env ;fi

	@echo "Local storage override LOCAL_STORAGE_OVERRIDE: ${LOCAL_STORAGE_OVERRIDE}"

	@echo "Building ${NX_MODE_BUILD} projects"
	env NODE_ENV=production $(YARN) $(NX_MODE_BUILD):build $(NX_ARGS) --prod --with-deps

audit:
	@echo "Auditing ${NX_MODE} dependencies with 'yarn audit'"
	$(YARN) audit --groups dependencies --level moderate --color | tee yarn-audit.log || true

test:
	@echo "Testing ${NX_MODE} projects"
	$(YARN) $(NX_MODE):test $(NX_ARGS)

test-pact:
	@echo "Pact Testing ${NX_MODE_BUILD} projects"
	$(YARN) $(NX_MODE_BUILD):test-pact $(NX_ARGS)

test-cypress:
	@echo "Cypress Testing ${NX_MODE} projects"
	$(YARN) $(NX_MODE):$${CYPRESS_TARGET:-e2e}-ci

test-codeceptjs:
	@echo "Codeceptjs Testing ${NX_MODE} projects"
	env CODECEPTJS_CI=true $(YARN) nx run-many --target=$${CODECEPTJS_TARGET:-integration} --all --ci --skip-nx-cache --executor=$${CODECEPTJS_EXECUTOR:-Playwright} --env=$${CI_ENVIRONMENT_NAME:-us-east-1} --headless --steps

publish-pact:
	@echo "Pact Publishing"
	$(YARN) publish:pact $(NX_ARGS)

unittest:
	@echo "Nothing here yet"
	# $(DOCKER) build --tag ${IMAGE_NAME}:test --target test .
	# $(DOCKER) run --name ${TMP_NAME} -v /var/run/docker.sock:/var/run/docker.sock ${IMAGE_NAME}:test || ($(DOCKER) container rm ${TMP_NAME}; exit 1)
	# $(DOCKER) container cp ${TMP_NAME}:/build/target .
	# $(DOCKER) container rm ${TMP_NAME}

test-report:
	@echo "Nothing here yet"
	# $(DOCKER) build --tag ${IMAGE_NAME}:test-report --target coverage-report .
	# $(DOCKER) container run --name ${TMP_NAME} ${IMAGE_NAME}:test-report || ($(DOCKER) container rm ${TMP_NAME}; exit 1)
	# $(DOCKER) container cp ${TMP_NAME}:/build/target .
	# $(DOCKER) container rm -f ${TMP_NAME}

storybook:
	@echo "Building ${NX_MODE_BUILD} storybooks"
	mkdir -p docs
	$(YARN) $(NX_MODE_BUILD):storybook $(NX_ARGS)

release-metadata:
	if [ -d "prod" ] && [ "${CI_COMMIT_BRANCH}" != "production" ]; then bash .gitlab/ci/scripts/release-metadata.sh; fi

deploy-all:
	@echo "Deploying all projects to S3"
	bash .gitlab/ci/scripts/nx.sh deploy all

deploy-affected:
	@echo "Deploying affected projects to S3: ("${AFFECTED}")"
	bash .gitlab/ci/scripts/nx.sh deploy affected


#deploy: deploy-$(NX_MODE)
deploy: deploy-$(NX_MODE_BUILD)
