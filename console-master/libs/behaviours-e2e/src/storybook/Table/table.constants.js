import { FILTER_TYPES } from '@ues/behaviours'

const DEFAULT_PAGE = 1
const DEFAULT_ROWS_PER_PAGE = 10
const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100, 150, 200]

const DATETIME_FORMAT = 'MM/DD/YYYY hh:mm A'

const DEFAULT_COLUMNS = [
  { id: 'id', show: false },
  {
    id: 'name',
    label: 'Dessert (100g serving)',
    sortable: true,
    show: true,
    canToggle: false,
    filterType: FILTER_TYPES.QUICK_SEARCH,
    minWidth: 400,
  },
  {
    id: 'calories',
    label: 'Calories',
    sortable: true,
    show: true,
    canToggle: true,
    filterType: FILTER_TYPES.NUMERIC_NO_RANGE,
  },
  {
    id: 'fat',
    label: 'Fat (g)',
    sortable: false,
    show: true,
    canToggle: true,
    filterType: FILTER_TYPES.CHECKBOX,
  },
  {
    id: 'carbs',
    label: 'Carbs (g)',
    sortable: true,
    show: true,
    canToggle: true,
    filterType: FILTER_TYPES.NUMERIC,
  },
  {
    id: 'protein',
    label: 'Protein (g)',
    sortable: true,
    show: true,
    canToggle: true,
    filterType: FILTER_TYPES.RADIO,
  },
  {
    id: 'isYummy',
    label: 'Is Yummy',
    sortable: true,
    show: true,
    canToggle: true,
    filterType: FILTER_TYPES.BOOLEAN,
  },
  {
    id: 'dateModified',
    label: 'Date Modified',
    sortable: true,
    show: true,
    canToggle: true,
    filterType: FILTER_TYPES.DATE_PICKER,
  },
  {
    id: 'dateCreated',
    label: 'Date Created',
    sortable: true,
    show: true,
    canToggle: true,
    filterType: FILTER_TYPES.DATE_RANGE,
    minWidth: 200,
  },
  {
    id: 'lastEaten',
    label: 'Last Eaten',
    sortable: true,
    show: true,
    canToggle: true,
    filterType: FILTER_TYPES.DATETIME_RANGE,
  },
]

const CURSOR_ENDPOINT_CORE = 'https//api.domain.com/list'

export { DEFAULT_PAGE, DEFAULT_ROWS_PER_PAGE, ROWS_PER_PAGE_OPTIONS, DEFAULT_COLUMNS, CURSOR_ENDPOINT_CORE, DATETIME_FORMAT }
