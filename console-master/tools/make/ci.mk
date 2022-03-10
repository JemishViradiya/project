# CI hooks

export PROJECT_DIR ?= ${CI_BUILDS_DIR}/${CI_PROJECT_PATH}
export CI_CONCURRENT_ID ?= 0
export XDG_CACHE_HOME ?= ${PWD}/node_modules/.cache
export CACHE_PATH ?= ${XDG_CACHE_HOME}/${CI_CONCURRENT_ID}/nx13

ci-before-hook: base-ref
	@ mkdir -p $(CACHE_PATH) node_modules/.cache
	@ rm -rf node_modules/.cache/nx nx
	@ ln -s $(CACHE_PATH) node_modules/.cache/nx
	env

ci-after-hook:
	@echo "Nothing to do here"

# CI hook implementation
base-ref:
	for tr in 1 2 3; do git fetch --quiet origin $${TIP%origin/} $${BASE#origin/} $(CI_DEFAULT_BRANCH) && exit 0; sleep 15; done; exit 1
	@echo "nx.dev affected refs: BASE=$(BASE) TIP=$(TIP)"

## Cache

## agent base
ci-agent-image:
	sh ./tools/ci/build-agent-base.sh

## agent nodejs
ci-agent-nodejs: base-ref pipeline.env
	@ set -x ; eval `cat pipeline.env` ; \
	if [ "$$(curl -ksI https://ues-pipeline-su.devlab2k.testnet.rim.net/v2/enterprise/ues/console/ci-agent-nodejs/manifests/$${DOCKER_IMAGE_SHA} -o /dev/null -w '%{http_code}')" != "200" ] || \
		[ "$$(curl -ksI https://ues-pipeline-su.devlab2k.testnet.rim.net/v2/enterprise/ues/console/ci-agent-nodejs-cypress/manifests/$${DOCKER_IMAGE_SHA}  -o /dev/null -w '%{http_code}')" != "200" ]; then \
			if [ "$$(curl -ksI https://ues-pipeline-su.devlab2k.testnet.rim.net/v2/enterprise/ues/console/ci-agent/manifests/$${DOCKER_BASE_IMAGE_SHA} -o /dev/null -w '%{http_code}')" != "200" ] ; then \
				echo make ci-agent-image; $(MAKE) ci-agent-image ; \
			fi ; \
		sh ./tools/ci/build-agent.sh ; \
	fi

## agent nodejs
ci-agent-codeceptjs: base-ref pipeline.env
	@ set -x ; eval `cat pipeline.env` ; \
	if [ "$$(curl -ksI https://ues-pipeline-su.devlab2k.testnet.rim.net/v2/enterprise/ues/console/ci-agent-codeceptjs/manifests/$${DOCKER_IMAGE_SHA} -o /dev/null -w '%{http_code}')" != "200" ]; then \
			if [ "$$(curl -ksI https://ues-pipeline-su.devlab2k.testnet.rim.net/v2/enterprise/ues/console/ci-agent/manifests/$${DOCKER_BASE_IMAGE_SHA} -o /dev/null -w '%{http_code}')" != "200" ] ; then \
				echo make ci-agent-image; $(MAKE) ci-agent-image ; \
			fi ; \
		sh ./tools/ci/build-agent.sh ; \
	fi

pipeline.env: yarn.lock .yarnrc.ci tools/ci/agent-nodejs Dockerfile.ci-agent patches/*
	echo DOCKER_IMAGE_SHA=$$(cat `git ls-files $^` | sha256sum | cut -c -16) > pipeline.env
	echo DOCKER_BASE_IMAGE_SHA=$$(cat Dockerfile.ci-agent tools/ci/build-agent-base.sh | sha256sum | cut -c -16) >> pipeline.env

affected.env-all:
	@echo AFFECTED=$$(./node_modules/.bin/nx print-affected --target=deploy --all --select="tasks.target.project" --with-deps | sed -e 's/,//g') | tee affected.env

affected.env-affected:
	@echo AFFECTED=$$(./node_modules/.bin/nx print-affected --target=deploy $(NX_BASE) --select="tasks.target.project" --with-deps | sed -e 's/,//g') | tee affected.env;

affected.env: affected.env-$(NX_MODE_BUILD)

.PHONY: affected.env affected.env-all affected.env-affected pipeline.env ci-before-hook ci-after-hook base-ref base-ref ci-agent-image ci-agent-nodejs ci-agent-nodejs-image
