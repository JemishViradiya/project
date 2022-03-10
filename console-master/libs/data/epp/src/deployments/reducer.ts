import type { Action, Reducer } from 'redux'

import { DeploymentsActions, UPDATE_RULES_LIST_DEFAULT_VALUE, UPDATE_STRATEGIES_LIST_DEFAULT_VALUE } from './constants'
import type { DeploymentsState, Task } from './types'
import { TaskId } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: DeploymentsState = {
  tasks: {
    [TaskId.Products]: { loading: false },
    [TaskId.OsFamilies]: { loading: false },
    [TaskId.BuildVersions]: { loading: false },
    [TaskId.PresignedUrl]: { loading: false, result: '' },
    [TaskId.Packages]: { loading: false },
    [TaskId.Strategies]: { loading: false, result: UPDATE_STRATEGIES_LIST_DEFAULT_VALUE },
    [TaskId.CreateStrategy]: { loading: false },
    [TaskId.UpdateStrategy]: { loading: false },
    [TaskId.UpdateRules]: { loading: false, result: UPDATE_RULES_LIST_DEFAULT_VALUE },
    [TaskId.ProductVersions]: { loading: false, result: [] },
    [TaskId.AllProductVersions]: { loading: false, result: {} },
    [TaskId.Hybrid]: {
      loading: false,
      result: {
        installerScript: '',
        licenseKey: '',
      },
    },
  },
}

const updateTask = (state: DeploymentsState, taskId: string, data: Task): DeploymentsState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<DeploymentsState, ActionWithPayload<string>> = (state = defaultState, action): DeploymentsState => {
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    // Products
    case DeploymentsActions.FetchProductsStart:
      return updateTask(state, TaskId.Products, { loading: true })
    case DeploymentsActions.FetchProductsSuccess:
      return updateTask(state, TaskId.Products, { loading: false, result: action.payload })
    case DeploymentsActions.FetchProductsError:
      return updateTask(state, TaskId.Products, { loading: false, error: action.payload.error })
    // Os Families
    case DeploymentsActions.FetchOsFamiliesStart:
      return updateTask(state, TaskId.OsFamilies, { loading: true })
    case DeploymentsActions.FetchOsFamiliesSuccess:
      return updateTask(state, TaskId.OsFamilies, { loading: false, result: action.payload })
    case DeploymentsActions.FetchOsFamiliesError:
      return updateTask(state, TaskId.OsFamilies, { loading: false, error: action.payload.error })
    // Build Versions
    case DeploymentsActions.FetchBuildVersionsStart:
      return updateTask(state, TaskId.BuildVersions, { loading: true })
    case DeploymentsActions.FetchBuildVersionsSuccess:
      return updateTask(state, TaskId.BuildVersions, { loading: false, result: action.payload })
    case DeploymentsActions.FetchBuildVersionsError:
      return updateTask(state, TaskId.BuildVersions, { loading: false, error: action.payload.error })
    // Presigned Url
    case DeploymentsActions.FetchPresignedUrlStart:
      return updateTask(state, TaskId.PresignedUrl, { loading: true })
    case DeploymentsActions.FetchPresignedUrlSuccess:
      return updateTask(state, TaskId.PresignedUrl, { loading: false, result: action.payload })
    case DeploymentsActions.FetchPresignedUrlError:
      return updateTask(state, TaskId.PresignedUrl, { loading: false, error: action.payload.error })
    // Packages
    case DeploymentsActions.FetchPackagesStart:
      return updateTask(state, TaskId.Packages, { loading: true })
    case DeploymentsActions.FetchPackagesSuccess:
      return updateTask(state, TaskId.Packages, { loading: false, result: action.payload })
    case DeploymentsActions.FetchPackagesError:
      return updateTask(state, TaskId.Packages, { loading: false, error: action.payload.error })
    // Product Versions
    case DeploymentsActions.FetchProductVersionsStart:
      return updateTask(state, TaskId.ProductVersions, { loading: true, result: state.tasks[TaskId.ProductVersions].result })
    case DeploymentsActions.FetchProductVersionsSuccess:
      return updateTask(state, TaskId.ProductVersions, {
        loading: false,
        result: [].concat(
          (state.tasks[TaskId.ProductVersions].result || []).filter(item => item.product !== action.payload.product),
          action.payload,
        ),
      })
    case DeploymentsActions.FetchProductVersionsError:
      return updateTask(state, TaskId.ProductVersions, { loading: false, error: action.payload.error })
    // All Product Versions
    case DeploymentsActions.FetchAllProductVersionsStart:
      return updateTask(state, TaskId.AllProductVersions, { loading: true })
    case DeploymentsActions.FetchAllProductVersionsSuccess:
      return updateTask(state, TaskId.AllProductVersions, { loading: false, result: action.payload })
    case DeploymentsActions.FetchAllProductVersionsError:
      return updateTask(state, TaskId.AllProductVersions, { loading: false, error: action.payload.error })
    // Strategies
    case DeploymentsActions.FetchStrategiesStart:
      return updateTask(state, TaskId.Strategies, { loading: true })
    case DeploymentsActions.FetchStrategiesSuccess:
      return updateTask(state, TaskId.Strategies, { loading: false, result: action.payload })
    case DeploymentsActions.FetchStrategiesError:
      return updateTask(state, TaskId.Strategies, { loading: false, error: action.payload.error })
    // Create Strategy
    case DeploymentsActions.CreateStrategyStart:
      return updateTask(state, TaskId.CreateStrategy, { loading: true })
    case DeploymentsActions.CreateStrategySuccess:
      return updateTask(state, TaskId.CreateStrategy, { loading: false })
    case DeploymentsActions.CreateStrategyError:
      return updateTask(state, TaskId.CreateStrategy, { loading: false, error: action.payload.error })
    // Update Strategy
    case DeploymentsActions.UpdateStrategyStart:
      return updateTask(state, TaskId.UpdateStrategy, { loading: true })
    case DeploymentsActions.UpdateStrategySuccess:
      return updateTask(state, TaskId.UpdateStrategy, { loading: false })
    case DeploymentsActions.UpdateStrategyError:
      return updateTask(state, TaskId.UpdateStrategy, { loading: false, error: action.payload.error })
    // Update Rules
    case DeploymentsActions.FetchUpdateRulesStart:
      return updateTask(state, TaskId.UpdateRules, { loading: true })
    case DeploymentsActions.FetchUpdateRulesSuccess:
      return updateTask(state, TaskId.UpdateRules, { loading: false, result: action.payload })
    case DeploymentsActions.FetchUpdateRulesError:
      return updateTask(state, TaskId.UpdateRules, { loading: false, error: action.payload.error })
    // Hybrid Installer Script And Key
    case DeploymentsActions.FetchHybridLicenseKeyAndInstallerScriptStart:
      return updateTask(state, TaskId.Hybrid, { loading: true })
    case DeploymentsActions.FetchHybridLicenseKeyAndInstallerScriptSuccess:
      return updateTask(state, TaskId.Hybrid, { loading: false, result: action.payload })
    case DeploymentsActions.FetchHybridLicenseKeyAndInstallerScriptError:
      return updateTask(state, TaskId.Hybrid, { loading: false, error: action.payload.error })
    default:
      return state
  }
}

export default reducer
