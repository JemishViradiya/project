/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { BulkDeleteResponse, EntitiesPageableResponse, IAppInfo, Task } from '../../types'
import type { MtdApi, MtdApiMock } from '../api'

export type ApiProvider = typeof MtdApi | typeof MtdApiMock

export const ReduxSlice = 'app.mtd.approvedApps'

export enum TaskId {
  ApprovedApps = 'approvedApps',
  CreateApprovedApp = 'createApprovedApp',
  ImportApprovedApps = 'importApprovedApps',
  EditApprovedApp = 'editApprovedApp',
  ExportApprovedApps = 'exportApprovedApps',
  DeleteApprovedApps = 'deleteApprovedApps',
}

export interface ApprovedAppsState {
  tasks?: {
    approvedApps: Task<EntitiesPageableResponse<IAppInfo>>
    createApprovedApp: Task
    importApprovedApps: Task
    editApprovedApp: Task
    exportApprovedApps: Task
    deleteApprovedApps: Task<BulkDeleteResponse>
  }
}

export const ActionType = {
  FetchApprovedApplicationsStart: `${ReduxSlice}/fetch-approved-apps-start`,
  FetchApprovedApplicationsError: `${ReduxSlice}/fetch-approved-apps-error`,
  FetchApprovedApplicationsSuccess: `${ReduxSlice}/fetch-approved-apps-success`,

  CreateApprovedApplicationStart: `${ReduxSlice}/create-approved-app-start`,
  CreateApprovedApplicationError: `${ReduxSlice}/create-approved-app-error`,
  CreateApprovedApplicationSuccess: `${ReduxSlice}/create-approved-app-success`,

  ImportApprovedApplicationsStart: `${ReduxSlice}/import-approved-apps-start`,
  ImportApprovedApplicationsError: `${ReduxSlice}/import-approved-apps-error`,
  ImportApprovedApplicationsSuccess: `${ReduxSlice}/import-approved-apps-success`,

  EditApprovedApplicationStart: `${ReduxSlice}/edit-approved-app-start`,
  EditApprovedApplicationError: `${ReduxSlice}/edit-approved-app-error`,
  EditApprovedApplicationSuccess: `${ReduxSlice}/edit-approved-app-success`,

  DeleteApprovedApplicationsStart: `${ReduxSlice}/delete-approved-apps-start`,
  DeleteApprovedApplicationsError: `${ReduxSlice}/delete-approved-apps-error`,
  DeleteApprovedApplicationsSuccess: `${ReduxSlice}/delete-approved-apps-success`,
}

// eslint-disable-next-line no-redeclare
export type ActionType = string
