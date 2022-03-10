import type { EnhanceSearchAction } from './actions'
import { ActionType } from './actions'
import type { EnhancedSearchState } from './EnhancedSearchProvider'
import { StateKeys } from './EnhancedSearchProvider'
import { SearchStep } from './types'

const BLANK_OPTION = { value: '', label: '' }
export const enhancedSearchReducer = (state: EnhancedSearchState, action: EnhanceSearchAction): EnhancedSearchState => {
  switch (action.type) {
    case ActionType.setCurrentOptionsShow:
      return {
        ...state,
        [StateKeys.OPTIONS_SHOW]: action.payload.show,
      }

    case ActionType.setSearchValue:
      return {
        ...state,
        [StateKeys.SEARCH_VALUE]: action.payload.value,
      }

    case ActionType.initNewChip:
      return {
        [StateKeys.OPTIONS]: action.payload.options,
        [StateKeys.OPTIONS_SHOW]: true,
        [StateKeys.SEARCH_VALUE]: '',
        [StateKeys.SELECTED_FIELD_INDEX]: action.payload.values.length - 1,
        [StateKeys.STEP]: action.payload.step || SearchStep.Second,
        [StateKeys.VALUES]: action.payload.values,
      }

    case ActionType.setOperator:
      if (action.payload.valueExists) {
        return {
          [StateKeys.OPTIONS]: action.payload.fields,
          [StateKeys.OPTIONS_SHOW]: false,
          [StateKeys.SEARCH_VALUE]: '',
          [StateKeys.SELECTED_FIELD_INDEX]: null,
          [StateKeys.STEP]: SearchStep.First,
          [StateKeys.VALUES]: action.payload.values,
        }
      }
      return {
        [StateKeys.OPTIONS]: [BLANK_OPTION],
        [StateKeys.OPTIONS_SHOW]: !action.payload.hideOptions,
        [StateKeys.SEARCH_VALUE]: '',
        [StateKeys.SELECTED_FIELD_INDEX]: state[StateKeys.SELECTED_FIELD_INDEX],
        [StateKeys.STEP]: SearchStep.Third,
        [StateKeys.VALUES]: action.payload.values,
      }

    case ActionType.setOptionValue:
      return {
        ...state,
        [StateKeys.VALUES]: action.payload.values,
        ...(!action.payload.keepOptions && {
          [StateKeys.OPTIONS]: action.payload.fields,
          [StateKeys.OPTIONS_SHOW]: false,
          [StateKeys.SEARCH_VALUE]: '',
          [StateKeys.SELECTED_FIELD_INDEX]: null,
          [StateKeys.STEP]: SearchStep.First,
        }),
      }

    case ActionType.removeChip:
      return {
        [StateKeys.OPTIONS]: action.payload.fields,
        [StateKeys.OPTIONS_SHOW]: false,
        [StateKeys.SEARCH_VALUE]: '',
        [StateKeys.SELECTED_FIELD_INDEX]: action.payload.selectedFieldIndex,
        [StateKeys.STEP]: action.payload.step,
        [StateKeys.VALUES]: action.payload.values,
      }

    case ActionType.removeLastValue:
      return {
        [StateKeys.OPTIONS]: state[StateKeys.OPTIONS],
        [StateKeys.OPTIONS_SHOW]: !!action.payload.hideOptions,
        [StateKeys.SEARCH_VALUE]: '',
        [StateKeys.SELECTED_FIELD_INDEX]: action.payload.selectedFieldIndex,
        [StateKeys.STEP]: SearchStep.Third,
        [StateKeys.VALUES]: action.payload.newValues,
      }

    case ActionType.removeAllChips:
      return {
        [StateKeys.OPTIONS]: action.payload.fields,
        [StateKeys.OPTIONS_SHOW]: false,
        [StateKeys.SEARCH_VALUE]: '',
        [StateKeys.SELECTED_FIELD_INDEX]: null,
        [StateKeys.STEP]: SearchStep.First,
        [StateKeys.VALUES]: [],
      }

    case ActionType.editChip:
      return {
        [StateKeys.OPTIONS]: action.payload.options,
        [StateKeys.OPTIONS_SHOW]: true,
        [StateKeys.SEARCH_VALUE]: '',
        [StateKeys.SELECTED_FIELD_INDEX]: action.payload.selectedFieldIndex,
        [StateKeys.STEP]: action.payload.step,
        [StateKeys.VALUES]: state[StateKeys.VALUES],
      }

    case ActionType.resetStep:
      return {
        [StateKeys.OPTIONS]: action.payload.fields,
        [StateKeys.OPTIONS_SHOW]: false,
        [StateKeys.SEARCH_VALUE]: '',
        [StateKeys.SELECTED_FIELD_INDEX]: null,
        [StateKeys.STEP]: SearchStep.First,
        [StateKeys.VALUES]: state[StateKeys.VALUES],
      }

    case ActionType.updateListProps:
      return {
        ...state,
        [StateKeys.VALUES]: action.payload.values,
      }

    case ActionType.setExternalValues: {
      const { values, fields } = action.payload

      return {
        [StateKeys.OPTIONS]: fields,
        [StateKeys.VALUES]: values,
        [StateKeys.OPTIONS_SHOW]: false,
        [StateKeys.SEARCH_VALUE]: '',
        [StateKeys.SELECTED_FIELD_INDEX]: null,
        [StateKeys.STEP]: SearchStep.First,
      }
    }

    case ActionType.removeOperator:
      return {
        [StateKeys.OPTIONS]: action.payload.options,
        [StateKeys.OPTIONS_SHOW]: true,
        [StateKeys.SEARCH_VALUE]: '',
        [StateKeys.SELECTED_FIELD_INDEX]: state[StateKeys.SELECTED_FIELD_INDEX],
        [StateKeys.STEP]: action.payload.step || SearchStep.Second,
        [StateKeys.VALUES]: action.payload.values,
      }

    default:
      return state
  }
}
