/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { BrowserDomainsState, Task } from './types'
import { BrowserDomainActionType, TaskId } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: BrowserDomainsState = {
  tasks: {
    browserDomains: {
      loading: false,
    },
    getBrowserDomain: {
      loading: false,
    },
    createBrowserDomain: {
      loading: false,
    },
    editBrowserDomain: {
      loading: false,
    },
    deleteBrowserDomain: {
      loading: false,
    },
    validateBrowserDomain: {
      loading: false,
    },
  },
}

const updateTask = (state: BrowserDomainsState, taskId: string, data: Task): BrowserDomainsState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<BrowserDomainsState, ActionWithPayload<BrowserDomainActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    //fetch browserDomains
    case BrowserDomainActionType.FetchBrowserDomainsStart: {
      return updateTask(state, TaskId.BrowserDomains, { ...state.tasks.browserDomains, loading: true })
    }
    case BrowserDomainActionType.FetchBrowserDomainsError:
      return updateTask(state, TaskId.BrowserDomains, {
        loading: false,
        error: action.payload.error,
      })

    case BrowserDomainActionType.FetchBrowserDomainsSuccess: {
      console.log('REDUCER, FetchBrowserDomainsSuccess, action = ', action)
      console.log('REDUCER, FetchBrowserDomainsSuccess, state = ', state)
      if (!action.payload.offset || action.payload.offset === 0) {
        return updateTask(state, TaskId.BrowserDomains, {
          loading: false,
          result: action.payload,
        })
      } else {
        const allFetchedBrowserDomains = [...(state.tasks.browserDomains?.result?.elements ?? []), ...action.payload.elements]
        return updateTask(state, TaskId.BrowserDomains, {
          loading: false,
          result: { ...action.payload, elements: allFetchedBrowserDomains },
        })
      }
    }

    //get browserDomain
    case BrowserDomainActionType.GetBrowserDomainStart:
      return updateTask(state, TaskId.GetBrowserDomain, { loading: true })

    case BrowserDomainActionType.GetBrowserDomainError:
      return updateTask(state, TaskId.GetBrowserDomain, {
        loading: false,
        error: action.payload.error,
      })

    case BrowserDomainActionType.GetBrowserDomainSuccess: {
      return updateTask(state, TaskId.GetBrowserDomain, { loading: false, result: action.payload })
    }

    //create browserDomain
    case BrowserDomainActionType.CreateBrowserDomainStart:
      return updateTask(state, TaskId.CreateBrowserDomain, { loading: true })

    case BrowserDomainActionType.CreateBrowserDomainError:
      return updateTask(state, TaskId.CreateBrowserDomain, {
        loading: false,
        error: action.payload.error,
      })

    case BrowserDomainActionType.CreateBrowserDomainSuccess:
      return updateTask(state, TaskId.CreateBrowserDomain, { loading: false })

    //edit browserDomain
    case BrowserDomainActionType.EditBrowserDomainStart:
      return updateTask(state, TaskId.EditBrowserDomain, { loading: true })

    case BrowserDomainActionType.EditBrowserDomainError:
      return updateTask(state, TaskId.EditBrowserDomain, {
        loading: false,
        error: action.payload.error,
      })

    case BrowserDomainActionType.EditBrowserDomainSuccess:
      return updateTask(state, TaskId.EditBrowserDomain, {
        loading: false,
        result: action.payload,
      })

    //delete browserDomain
    case BrowserDomainActionType.DeleteBrowserDomainStart:
      return updateTask(state, TaskId.DeleteBrowserDomain, { loading: true })

    case BrowserDomainActionType.DeleteBrowserDomainError:
      return updateTask(state, TaskId.DeleteBrowserDomain, {
        loading: false,
        error: action.payload.error,
      })

    case BrowserDomainActionType.DeleteBrowserDomainSuccess:
      return updateTask(state, TaskId.DeleteBrowserDomain, {
        loading: false,
      })

    // validate browser domain
    case BrowserDomainActionType.ValidateBrowserDomainStart:
      return updateTask(state, TaskId.ValidateBrowserDomain, { loading: true })

    case BrowserDomainActionType.ValidateBrowserDomainSuccess: {
      return updateTask(state, TaskId.ValidateBrowserDomain, {
        loading: false,
        result: { httpStatusCode: action.payload.httpStatusCode },
      })
    }

    case BrowserDomainActionType.ValidateBrowserDomainError:
      return updateTask(state, TaskId.ValidateBrowserDomain, {
        loading: false,
        error: action.payload.error,
        result: { httpStatusCode: action.payload.httpStatusCode },
      })

    default:
      return state
  }
}

export default reducer
