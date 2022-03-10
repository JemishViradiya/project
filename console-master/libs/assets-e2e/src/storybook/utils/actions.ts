import { action } from '@storybook/addon-actions'

// Fix from https://github.com/storybookjs/storybook/issues/6471 for the following error:
// Warning: This synthetic event is reused for performance reasons. If you're seeing this, you're accessing the method `isDefaultPrevented` on a released/nullified synthetic event. This is a no-op function. If you must keep the original synthetic event around, use event.persist(). See https://fb.me/react-event-pooling for more information.
export const partialAction = actionName => {
  const beacon = action(actionName)
  return (eventObj, ...args) => {
    beacon({ ...eventObj, view: undefined }, ...args)
  }
}
