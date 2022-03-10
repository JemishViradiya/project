/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { MtdApi, MtdApiMock } from '../api'
import type { IParsedAppInfo } from '../api/app-file-parser/app-file-parser-api-types'

export type ApiProvider = typeof MtdApi | typeof MtdApiMock

export const ReduxSlice = 'app.mtd.parsedApp'

export interface Task<TResult = unknown> {
  loading?: boolean
  error?: Error
  result?: TResult
}

export enum TaskId {
  ParseAppFile = 'parseAppFile',
}

export interface ParsedAppState {
  tasks?: {
    parseAppFile: Task<IParsedAppInfo>
  }
}

export const ActionType = {
  ParseAppFileStart: `${ReduxSlice}/parse-app-file-start`,
  parseAppFileError: `${ReduxSlice}/parse-app-file-error`,
  parseAppFileSuccess: `${ReduxSlice}/parse-app-file-success`,
}

// eslint-disable-next-line no-redeclare
export type ActionType = string
