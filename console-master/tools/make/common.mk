# use the commit sha provided in CI, or fall back to git rev-parse
COMMIT_SHORT_SHA := $(shell /usr/bin/env git rev-parse --short HEAD 2>/dev/null || echo 'master')
CI_COMMIT_SHORT_SHA ?= ${COMMIT_SHORT_SHA}

# docker configuration, buildkit enabled
DOCKER=docker
export DOCKER_BUILDKIT = true
export DOCKER_EXPERIMENTAL = "enabled"

IMAGE_NAME = ${PROJECT_NAME}
IMAGE_TAG := ${CI_COMMIT_SHORT_SHA}
TMP_NAME := ci-${IMAGE_TAG}

DOCKER_BUILD_ARGS ?= "--build-arg" "BUILDKIT_INLINE_CACHE=1"

# a trick to force preservation of whitespace in the generated YAML
null :=
SP := $(null) $(null)
define IMAGES
images:\n\
$(SP)$(SP)- name: ${PROJECT_NAME}\n\
$(SP)$(SP)$(SP)$(SP)newName: ${registryURI}\n\
$(SP)$(SP)$(SP)$(SP)newTag: '${IMAGE_TAG}'\n
endef

validate-manifests:
	kubectl --dry-run=server apply -k config/aws
