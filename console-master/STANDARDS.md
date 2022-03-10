# Technology Standards

## React

- React **^16.latest**
- React-DOM **^16.latest**

Components **must** be written as functional / hooks

Shared code **must** be implemented in react hooks

## Material-UI

- @material-ui/core **^4.11.0**
- @material-ui/icons **^4.9.0**
- @material-ui/lab **^4.0.0-alpha**

## Routing

- React-Router-Dom **^6.latest**
- History **^5.latest**

## State

- Redux
- Apollo

## Translation

- react-i18next **^11.latest,** _overridable_

# Coding Standards

## Javascript, Typescript, JSX

Javascript+ files are linted with [ESLint](https://eslint.org), which has defaults configured in [.eslilntrc](./.eslintrc) and per-project settings are found in <project>/.eslintrc.

Standard Pluginss

- [react](https://www.npmjs.com/package/eslint-plugin-react)
- [react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [sonarjs](https://github.com/SonarSource/eslint-plugin-sonarjs)

## CSS, Less, Sass

TODO: document nx.dev css linting tools

## Other Files

Other files are linted with [Prettier](https://prettier.io/), which is configured **globally** in [.prettierrc](./.prettierrc).
