# UES Console SPA Integration

aka Generic Pillar Integration

### UI Process

1.  Create a new application with NX.dev

    See [NX](./NX.md) for detailed instructions

        	- Add a "deploy" section in `workspaces.json`

        			"deploy": {
        				"executor": "@nrwl/workspace:run-commands",
        				"options": {
        					"command": "bash tools/deploy/app.sh <APPNAME>"
        				}
        			}

1.  Import existing code - or copy a sample pillar if there is no existing code

1.  Standardize on core console technologies

    - Migrate to standard versions of React, ReactRouter, MaterialUI, etc
    - Migrate routing to use HashRouter
    - Apply common style rules

    See [STANDARDS](./STANDARDS.md) for details

1.  Expose top-level routes

    - Add route mappings to [api/ui](./libs/api/ui/src/apps)

1.  Migrate integration points to `react-hooks` if needed

1.  Integrate `@ues/theme`. See a sample pillar for details.

1.  Adopt common MaterialUI paradigms

    - See the storybook for the [assets library](https://ues.pages.rim.net/console/assets/)

1.  Adopt common behaviours (hooks) and contribute application-common behaviours to the common library projects

### Backend Process

1. Add regional route api endpoint mappings

   - [`proxy.conf.json`](./proxy.conf.json) for development
   - [ECS Infrastructure Repo](https://gitlab.rim.net/platform-services/infrastructure/infrastructure) for deployments
