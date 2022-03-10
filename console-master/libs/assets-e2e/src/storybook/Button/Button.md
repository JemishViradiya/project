### General notes

Buttons should be hidden if they are not available.

Additive or primary actions may be included in a toolbar.

### How to choose a button style

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

### RBAC

Buttons are action elements that may be controlled by permissions. Multiple permissions may be required to display and invoke the action associated with a button.

If an administrator does not have the necessary permissions, the following should occur:

- A button that is a simple action element should be hidden
- A button that is a feedback action element should be disabled

For more information, see

[RBAC for UES Console](https://wikis.rim.net/pages/viewpage.action?spaceKey=UESUC&title=RBAC+for+UES+Console)

[RBAC Roles Example](#)

### Text usage

Button text should be uppercase. This is already set in the overrides.

Examples _REMOVE_, _+ ADD GROUP_

### More information

See <a href="https://material-ui.com/api/button/" target="_blank">Material-UI documentation for Button</a>.

To reveal the source code, select Docs tab and click on 'Show code' in the bottom right corner. The controls are configured with default component values.
