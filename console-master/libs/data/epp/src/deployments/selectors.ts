import { createSelector } from 'reselect'

import { DeploymentsReduxSlice } from './constants'
import type { DeploymentsState } from './types'
import { TaskId } from './types'

const getState = (state: { [k in typeof DeploymentsReduxSlice]: DeploymentsState }) => state[DeploymentsReduxSlice]
const getTasks = createSelector(getState, state => state?.tasks)

const selectProducts = createSelector(getTasks, tasks => tasks[TaskId.Products])
const selectOsFamilies = createSelector(getTasks, tasks => tasks[TaskId.OsFamilies])
const selectBuildVersions = createSelector(getTasks, tasks => tasks[TaskId.BuildVersions])
const selectPackages = createSelector(getTasks, tasks => tasks[TaskId.Packages])
const selectPresignedUrl = createSelector(getTasks, tasks => tasks[TaskId.PresignedUrl])
const selectStrategies = createSelector(getTasks, tasks => tasks[TaskId.Strategies])
const selectCreateStrategy = createSelector(getTasks, tasks => tasks[TaskId.CreateStrategy])
const selectUpdateStrategy = createSelector(getTasks, tasks => tasks[TaskId.UpdateStrategy])
const selectUpdateRules = createSelector(getTasks, tasks => tasks[TaskId.UpdateRules])
const selectProductVersions = createSelector(getTasks, tasks => tasks[TaskId.ProductVersions])
const selectAllProductVersions = createSelector(getTasks, tasks => tasks[TaskId.AllProductVersions])
const selectHybrid = createSelector(getTasks, tasks => tasks[TaskId.Hybrid])

export {
  selectProducts,
  selectOsFamilies,
  selectBuildVersions,
  selectPackages,
  selectPresignedUrl,
  selectStrategies,
  selectCreateStrategy,
  selectUpdateRules,
  selectProductVersions,
  selectAllProductVersions,
  selectHybrid,
  selectUpdateStrategy,
}
