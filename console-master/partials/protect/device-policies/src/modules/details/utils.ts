// dependencies
import cond from 'lodash/cond'
import reduce from 'lodash/reduce'
import type { ChangeEvent } from 'react'

/**
 * Default toggle action for a `Switch`
 *
 * @param param0 the checkbox click event
 */
const onSwitchChange = ({ target: { checked } }: ChangeEvent<HTMLInputElement>): string => (checked ? '1' : '0')

/**
 * Toggle action for a `Switch` with a dependent text field
 *
 * - empty string means text input is enabled but empty
 * - null means text input is disabled
 *
 * @param param0 the checkbox click event
 */
const onSwitchChangeWithText = ({ target: { checked } }: ChangeEvent<HTMLInputElement>): string | null => (checked ? '' : null)

/**
 * `React.memo` compare function for Policy form sections
 *
 * Returns true if critical props are equal, skipping the current render;
 * otherwise returns false and allows the component to re-render
 *
 * NOTE: assumes `fields` props does not change between renders
 *
 * @param prevProps Last known props
 * @param nextProps The new props to compare
 *
 * TODO: replace 'any' for prevProps to 'unknown'
 */
const arePropsEqual = (prevProps: Record<string, any>, nextProps: Record<string, unknown>): boolean =>
  reduce(
    prevProps.fields,
    (areEqual, formField: string) =>
      cond([
        [() => !areEqual, () => false],
        [
          () => true,
          () =>
            prevProps.values[formField] === nextProps.values[formField] &&
            (!prevProps.errors || prevProps.errors[formField] === nextProps.errors[formField]),
        ],
      ])(undefined),
    true,
  )

export { onSwitchChange, onSwitchChangeWithText, arePropsEqual }
