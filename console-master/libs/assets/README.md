# assets

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test assets` to execute the unit tests via [Jest](https://jestjs.io).

## Component customization

Some components require additional properties and styles to match the DSM prototype ([DSM](go/dsm)).
To achieve that, we use a combination of properties object and styling methods and hooks from @assets/src/dsm/components/.
For each component, there are two ways to obtaint the styles: by using the useComponentStyles() hook or makeComponentStyles() method.

- However, there is an exception to this rule for Checkbox and Radio components - for the help tip style there is no hook available
  due to conditional check on sizing.

### Examples:

- Custom styles using useStyles hook:
  <pre>&lt;InputField classes={useInputFieldStyles(theme)} /&gt;</pre>

- Custom styles using makeStyles function:
  <pre>
    makeStyles(theme => {
    ...makeInputFieldStyles(theme),
    ... custom stuff here ...
    })
  </pre>

- Custom property object:
  <pre>&lt;Chip {...defaultChipProps}&gt;</pre>
