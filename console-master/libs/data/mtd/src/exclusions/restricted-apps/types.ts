/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { BulkDeleteResponse, EntitiesPageableResponse, IAppInfo, Task } from '../../types'
import type { MtdApi, MtdApiRestrictedMock } from '../api'

export type ApiProvider = typeof MtdApi | typeof MtdApiRestrictedMock

export const ReduxSlice = 'app.mtd.restrictedApps'

export enum TaskId {
  RestrictedApps = 'restrictedApps',
  CreateRestrictedApp = 'createRestrictedApp',
  ImportRestrictedApps = 'importRestrictedApps',
  EditRestrictedApp = 'editRestrictedApp',
  DeleteRestrictedApps = 'deleteRestrictedApps',
}

export interface RestrictedAppsState {
  tasks?: {
    restrictedApps: Task<EntitiesPageableResponse<IAppInfo>>
    createRestrictedApp: Task
    importRestrictedApps: Task
    editRestrictedApp: Task
    deleteRestrictedApps: Task<BulkDeleteResponse>
  }
}

export const ActionType = {
  FetchRestrictedApplicationsStart: `${ReduxSlice}/fetch-restricted-apps-start`,
  FetchRestrictedApplicationsError: `${ReduxSlice}/fetch-restricted-apps-error`,
  FetchRestrictedApplicationsSuccess: `${ReduxSlice}/fetch-restricted-apps-success`,

  CreateRestrictedApplicationStart: `${ReduxSlice}/create-restricted-app-start`,
  CreateRestrictedApplicationError: `${ReduxSlice}/create-restricted-app-error`,
  CreateRestrictedApplicationSuccess: `${ReduxSlice}/create-restricted-app-success`,

  ImportRestrictedApplicationsStart: `${ReduxSlice}/import-restricted-app-start`,
  ImportRestrictedApplicationsError: `${ReduxSlice}/import-restricted-app-error`,
  ImportRestrictedApplicationsSuccess: `${ReduxSlice}/import-restricted-app-success`,

  EditRestrictedApplicationStart: `${ReduxSlice}/edit-restricted-app-start`,
  EditRestrictedApplicationError: `${ReduxSlice}/edit-restricted-app-error`,
  EditRestrictedApplicationSuccess: `${ReduxSlice}/edit-restricted-app-success`,

  DeleteRestrictedApplicationsStart: `${ReduxSlice}/delete-restricted-apps-start`,
  DeleteRestrictedApplicationsError: `${ReduxSlice}/delete-restricted-apps-error`,
  DeleteRestrictedApplicationsSuccess: `${ReduxSlice}/delete-restricted-apps-success`,
}

// eslint-disable-next-line no-redeclare
export type ActionType = string
