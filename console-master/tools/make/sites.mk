## Sites

build-review-app: build-stage
	if ! test -z "${REVIEW_SITE_GOOGLE_API_KEY}" ; then \
		find prod/ -type f -name 'index.html' -print0 | \
			xargs -r -0 sed -i -e 's;<!-- jss-insertion-point -->;<script type="application/javascript">window.MOCK_GOOGLE_API_KEY="${REVIEW_SITE_GOOGLE_API_KEY}"</script>;g' ; \
	fi

build-review-docs:
	ls docs/* >/dev/null 2>&1 || ( echo 'No storybooks to publish' ; exit 121 )
	if ! test -z "${REVIEW_SITE_GOOGLE_API_KEY}" ; then \
		find docs/behaviours -type f -name 'iframe.html' -print0 | \
			xargs -r -0 sed -i -e 's;<noscript id="jss-insertion-point"></noscript>;<script type="application/javascript">window.MOCK_GOOGLE_API_KEY="${REVIEW_SITE_GOOGLE_API_KEY}"</script>;g' ; \
	fi

build-depgraph-docs:
	$(YARN) nx dep-graph --file=graph/index.html

build-review-site:
	mkdir -p public
	cp -r .sites/* public/
	sed -i -e 's;%TITLE%;docs: $(CI_COMMIT_REF_SLUG);g' public/index.html public/docs/index.html

build-stage:
	if ! ls prod/* >/dev/null 2>&1 ; then echo 'No reviews to publish'; exit 121; fi

	if [ -n "${CI_MERGE_REQUEST_IID}" ] ; then \
		find prod/ docs/ -type f -name 'index.html' -print0 | \
			xargs -r -0 sed -i -e 's;</head>;<script data-project-id="$(CI_PROJECT_ID)" data-merge-request-id="$(CI_MERGE_REQUEST_IID)" data-mr-url="$(CI_SERVER_URL)" data-project-path="$(CI_PROJECT_PATH)" data-require-auth="true" id="review-app-toolbar-script" src="$(CI_SERVER_URL)/assets/webpack/visual_review_toolbar.js"></script></head>;g' ; \
	fi

deploy-review: deploy-$(NX_MODE_BUILD)
	bash ./tools/deploy/review.sh

affected-review: all-review

all-review:
	$(MAKE) build-review-app || touch .build-app-review-fail
	$(MAKE) build-review-docs || touch .build-docs-review-fail
	if [ -f .build-app-review-fail ] && [ -f .build-docs-review-fail ]; then echo 'Nothing to publish'; exit 121; fi
	$(MAKE) build-review-site deploy-review

all-stage: build-stage deploy-$(NX_MODE_BUILD)

stop-review: unpublish-pages
