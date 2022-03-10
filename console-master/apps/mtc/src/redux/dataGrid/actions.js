export const SET_BULK = '@Cylance/dataGrid/SET_BULK'
export const SET_CHECKED = '@Cylance/dataGrid/SET_CHECKED'
export const SET_SELECT_ALL = '@Cylance/dataGrid/SET_SELECT_ALL'
export const UNSET_BULK = '@Cylance/dataGrid/UNSET_BULK'
export const UNSET_CHECKED = '@Cylance/dataGrid/UNSET_CHECKED'
export const UNSET_SELECT_ALL = '@Cylance/dataGrid/UNSET_SELECT_ALL'

export const setBulk = () => ({
  type: SET_BULK,
})

export const setChecked = checkedItems => ({
  type: SET_CHECKED,
  payload: checkedItems,
})

export const unsetBulk = () => ({
  type: UNSET_BULK,
})

export const unsetChecked = () => ({
  type: UNSET_CHECKED,
})

export const setSelectAll = selectState => ({
  type: SET_SELECT_ALL,
  payload: selectState,
})

export const unsetSelectAll = () => ({
  type: UNSET_SELECT_ALL,
})
