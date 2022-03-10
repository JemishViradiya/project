export CACHE_VERSION ?= 1019

ifneq ($(GITLAB_RUNNER_CPU),)
	GITLAB_RUNNER_EXEC ?= 1
	GITLAB_JOBS = $(shell expr $(GITLAB_RUNNER_CPU) / $(GITLAB_RUNNER_EXEC))
	NX_JOBS = $(GITLAB_JOBS)
endif

ifneq ($(JEST_PARALLEL),)
ifneq ($(GITLAB_JOBS),)
	NX_JOBS = $(shell expr $(GITLAB_JOBS) / $(JEST_PARALLEL))
endif
endif

ifeq ($(NX_JOBS),0)
	NX_JOBS = 1
endif

GITLAB_JOBS ?= 1
# nx common args
NX_EXTRA_ARGS ?=
NX_JOBS ?= 1
export NX_ARGS := ${NX_EXTRA_ARGS}
ifneq ($(NX_JOBS),1)
  export NX_ARGS := --parallel --maxParallel=${NX_JOBS} ${NX_EXTRA_ARGS}
endif

export RSYNC_CACHE_MAX ?= 60

export CI_COMMIT_REF_SLUG ?= develop


TIP := $(CI_COMMIT_SHA)
# compute nx --base argument
ifneq ($(CI_MERGE_REQUEST_TARGET_BRANCH_NAME),)
	BASE := origin/$(CI_MERGE_REQUEST_TARGET_BRANCH_NAME)
	ifeq ($(CI_MERGE_REQUEST_TARGET_BRANCH_SHA),)
		CI_MERGE_REQUEST_TARGET_BRANCH_SHA := $(shell git ls-remote --refs origin refs/heads/${CI_MERGE_REQUEST_TARGET_BRANCH_NAME} | (read sha line; echo $$sha) )
	endif
	ifneq ($(CI_MERGE_REQUEST_TARGET_BRANCH_SHA),)
		BASE := $(CI_MERGE_REQUEST_TARGET_BRANCH_SHA)
	endif

	export CACHE_REF_SLUG := node-cache-$(CACHE_VERSION)

endif
ifneq ($(CI_COMMIT_BRANCH),)
	ifneq ($(CI_COMMIT_BEFORE_SHA), 0000000000000000000000000000000000000000)
		BASE := $(CI_COMMIT_BEFORE_SHA)
	else
		BASE := origin/${CI_COMMIT_BRANCH}~5
		NX_MODE := all
	endif

	export CACHE_REF_SLUG := node-cache-$(CACHE_VERSION)

endif
BASE ?= origin/master
TIP ?= HEAD
export NX_BASE := --base=$(BASE)

# compute BB branding
ifeq ($(CI_COMMIT_BRANCH),production)
	BB_BRANDING := ${BB_BRANDING_PROD}
endif
ifeq ($(CI_MERGE_REQUEST_TARGET_BRANCH_NAME),production)
	BB_BRANDING := ${BB_BRANDING_PROD}
endif
ifeq ($(CI_COMMIT_BRANCH),master)
	BB_BRANDING := ${BB_BRANDING_STAGING}
endif
ifeq ($(CI_MERGE_REQUEST_EVENT_TYPE),merge_train)
	ifeq ($(CI_MERGE_REQUEST_TARGET_BRANCH_NAME),production)
	    BB_BRANDING := ${BB_BRANDING_PROD}
	else ifeq ($(CI_MERGE_REQUEST_TARGET_BRANCH_NAME),master)
		BB_BRANDING := ${BB_BRANDING_STAGING}
	endif
endif

BB_BRANDING ?= ${BB_BRANDING_DEV}
export BB_BRANDING := ${BB_BRANDING}

# compute LOCAL_STORAGE_OVERRIDE Disable for prod
ifeq ($(CI_COMMIT_BRANCH),production)
	LOCAL_STORAGE_OVERRIDE := false
endif
ifeq ($(CI_MERGE_REQUEST_TARGET_BRANCH_NAME),production)
	LOCAL_STORAGE_OVERRIDE := false
endif
ifeq ($(CI_MERGE_REQUEST_EVENT_TYPE),merge_train)
	ifeq ($(CI_MERGE_REQUEST_TARGET_BRANCH_NAME),production)
	    LOCAL_STORAGE_OVERRIDE := false
	endif
endif

LOCAL_STORAGE_OVERRIDE ?= true
export LOCAL_STORAGE_OVERRIDE := ${LOCAL_STORAGE_OVERRIDE}

export CI_PIPELINE_IID ?= local

XDG_CACHE_HOME ?= ${PWD}/node_modules/.cache

export ESLINT_CACHE ?= ${XDG_CACHE_HOME}/${CI_CONCURRENT_ID}/eslint

# target to use for nx (all|affected)
ifneq (,$(NX_MODE))
	NX_MODE_BUILD ?= ${NX_MODE}
else ifneq (,$(filter epic/% $(CI_DEFAULT_BRANCH) production,$(CI_COMMIT_BRANCH)))
	NX_MODE_BUILD ?= all
else
	NX_MODE_BUILD ?= affected
endif

ifneq (,$(NX_MODE))
	NX_MODE ?= affected
else ifneq (,$(filter $(CI_MERGE_REQUEST_TARGET_BRANCH_NAME),production))
	NX_MODE ?= all
else
	NX_MODE ?= affected
endif

export NX_MODE := ${NX_MODE}
export NX_MODE_BUILD := ${NX_MODE_BUILD}
