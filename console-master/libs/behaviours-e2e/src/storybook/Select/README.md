### General notes

Selects should be used as the default droplist.

The minimum (240px) and maximum (960px) widths can be set for a select by using the constants `MIN_INPUT_FIELD_WIDTH` and `MAX_INPUT_FIELD_WIDTH`.

### RBAC

Selects are form elements that may be controlled by permissions.

If an administrator does not have the necessary permissions, the following should occur:

- A select that is a form element should be disabled
- A select that is a feedback action element should be disabled
- A select that is a simple action element, acting as a menu, should be hidden if the administrator does not have access to perform any of the actions listed in the menu

For more information, see

[RBAC for UES Console](https://wikis.rim.net/pages/viewpage.action?spaceKey=UESUC&title=RBAC+for+UES+Console)

[RBAC Roles Example](#)

### Text usage

All form labels should be sentence case.

Examples _Description_, _File source_

### More information

See <a href="https://material-ui.com/api/select/" target="_blank">Material-UI documentation for Select</a>.

To reveal the source code, select Docs tab and click on 'Show code' in the bottom right corner. The controls are configured with default component values.
