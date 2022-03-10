# NX.dev

This project is managed using [Nx](https://nx.dev).

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Nx is a set of Extensible Dev Tools for Monorepos.**

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are the core plugins used in this project:

- [React](https://reactjs.org)
  - `@nrwl/react:app`
  - `@nrwl/react:component`
  - `@nrwl/react:lib`
- Web (no framework frontends)
  - `@nrwl/web`
- Jest (unit testing)
  - `@nrwl/jest`
- Cypress (e2e testing)
  - `@nrwl/cypress`

There are more core plugins and also many [community plugins](https://nx.dev/nx-community) you could add.

## To generate a partial

Run `yarn nx workspace-generator partial <group> <name>` to generate a partial project.

It is customary to add a 'shared' partial to your group when it is created

When using Nx, you can create partials in the same workspace and share them between many applications.

## To generate a partial-e2e

Run `yarn nx workspace-generator partial-e2e <group> <name>` to generate a partial-e2e project.

Partial e2e come with cypress support out of the box.

You may need to update **devServerTarget** values under the new e2e project configuration in workspace.json to make sure they point to the correct target.

## To generate a partial (or other scope of) integration project

Run `yarn nx workspace-generator integration <group>` to generate a partial integration project.

Run `yarn nx workspace-generator integration --scope=app <group>` to generate an app integration project.

Integration projects come with codeceptjs support out of the box.

You may need to update **implicitDependencies** values under the new e2e project configuration in nx.json.json to make sure they point to the correct dependencies.

## To generate a behaviour

Run `yarn nx workspace-generator behaviour <name>` to generate a behaviour project named behaviour/<name>

Behaviours come with storybook support out of the box

When using Nx, you can create behaviours in the same workspace and share them between many applications.

## To generate a venue-partial application

Run `yarn nx workspace-generator venue-partial <name>` to generate a venue-partial application project.

Venue partials are used as venue injection points for legacy ui integration.

## To generate an application

Run `yarn nx g @nrwl/react:app` to generate an application.

Add `"scope:app"` to your project scopes in `nx.json`.

Apply custom workspace options:

    yarn gen:workspace

When using Nx, you can create multiple applications and libraries in the same workspace.

## To generate a library

Run `yarn nx g @nrwl/react:lib my-lib` to generate a library.

> You will need to modify a number of configuration parameters in `workspace.json`, see "components" or "hooks" for examples

> You can also use any of the plugins above to generate libraries as well.

Libraries are sharable across libraries and applications. They can be imported from `@myapp/mylib`.

## To add storybook to a library

Run `yarn nx g @nrwl/react:storybook-configuration project-name`

## Development server

Add a hosts aliases for local\*-ues.cylance.com in your /etc/hosts

    127.0.0.1 r00-ues.cylance.com
    127.0.0.1 qa2-ues.cylance.com
    127.0.0.1 ues.cylance.com
    127.0.0.1 ues-euc1.cylance.com
    127.0.0.1 ues-apne1.cylance.com
    127.0.0.1 ues-sae1.cylance.com

Run `yarn nx serve my-app` for a dev server. Navigate to https://qa2-ues.cylance.com:4200/. The app will automatically reload if you change any of the source files.
Each environment-specific host targets a different UES environment, see [ENVIRONMENT.md](./ENVIRONMENT.md) for details.

## Code scaffolding

Run `yarn nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

## Build

Run `yarn nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `yarn nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `yarn nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `yarn nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `yarn nx dep-graph` to see a diagram of the dependencies of your projects.

## Distributed Cache

NX.dev supports a distributed cache to share the local nx cache with other developers / ci nodes / etc.
The cache implementation lives in [./tools/nx/tasks-runner.js](./tools/nx/tasks-runner.js).
The cache is stored on the pipeline-support server at http://ues-pipeline-su.devlab2k.testnet.rim.net/nx-distributed-cache/.
CI jobs use an isolated, protected cache.

All nx cacheable operations are supported for both CI and local development.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
