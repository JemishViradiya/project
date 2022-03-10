/* eslint-disable sonarjs/no-identical-functions */
// dependencies
import { cond } from 'lodash-es'
import type { ChangeEvent } from 'react'

import type { UseAutocompleteProps } from '@material-ui/lab'

const unboundServerAutocompleteProps = <TOption>(
  options = [],
  getOptions = (_: TOption | string) => undefined,
  onSubmit = (_1: TOption | string, _2: boolean) => undefined,
): Partial<UseAutocompleteProps<TOption, boolean, boolean, boolean>> => ({
  freeSolo: true,
  filterOptions: () => options, // prevents Autocomplete from filtering the options itself, as this will be determined by the server
  onChange: (_event: ChangeEvent<unknown>, value: TOption | string) => onSubmit(value, value !== null), // value will be null when input is cleared
  onInputChange: (_event, inputValue, reason) =>
    cond([
      [
        () => reason !== 'reset',
        () => getOptions(inputValue), // get options whenever `inputValue` changes (and the change is not a reset)
      ],
    ])(undefined),
})

const boundServerAutocompleteProps = <TOption>(
  options = [],
  getOptions = (_: TOption | string) => undefined,
  onSubmit = (_1: TOption | string, _2: boolean) => undefined,
): Partial<UseAutocompleteProps<TOption, boolean, boolean, boolean>> => ({
  filterOptions: () => options, // prevents Autocomplete from filtering the options itself, as this will be determined by the server
  onChange: (_event: ChangeEvent<unknown>, value: TOption | string) => onSubmit(value, value !== null), // value will be null when input is cleared
  onInputChange: (_event, inputValue, reason) =>
    cond([
      [
        () => reason !== 'reset',
        () => getOptions(inputValue), // get options whenever `inputValue` changes (and the change is not a reset)
      ],
    ])(undefined),
})

const unboundClientAutocompleteProps = {
  freeSolo: true,
}

export { unboundServerAutocompleteProps, boundServerAutocompleteProps, unboundClientAutocompleteProps }
