## MUI X-Grid

### General notes

Use the X-Grid when full view is required.

The "dense" option should only be used in a full page data grid where a large amount of data is displayed. For example, _Assets > Users_.

Primary action buttons in a table toolbar should be hidden if they are not available.

Additive or primary actions may be included in the toolbar.

Small icon buttons should be used for all actions in a row.

X-Grid does not currently support client side sorting / filters.

### How to choose a [button](#) style

#### Additive actions

- Are primary actions that always include the "+" startIcon
- Button style is the contained variant using the secondary color
- Examples include _+Add Mobile Device_, _+Add Group_

#### Primary actions

- Are primary actions on a modal or page
- Button style is the contained variant using the primary color
- Examples include _Save_, _Submit_, _Add_

#### Secondary actions

- A secondary action on a modal or page
- Button style is the outlined variant using the primary color
- Examples include _Cancel_, _Close_

### Text usage

Column header text should be uppercase.

Examples _EMAIL ADDRESS_, _CREATED DATE_

### More information

See the following for more information

See <a href="https://material-ui.com/store/items/material-ui-pro/" target="_blank">Material-UI documentation for MUI X-grid</a>.

See <a href="https://mui.com/components/data-grid/" target="_blank">MUI Data Grid</a> example.

See <a href="https://material-ui-x.netlify.app/storybook/?path=/story" target="_blank">X-Grid</a> example.

See <a href="https://www.npmjs.com/package/@material-ui/x-grid" target="_blank">X-Grid</a> example (deprecated).
