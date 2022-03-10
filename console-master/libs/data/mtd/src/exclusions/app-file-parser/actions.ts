/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { IAppUploadInfo } from '../api/app-file-parser/app-file-parser-api-types'
import type { ApiProvider, Task } from './types'
import { ActionType } from './types'

export const ParseAppFile = (payload: IAppUploadInfo, apiProvider: ApiProvider) => ({
  type: ActionType.ParseAppFileStart,
  payload: { apiProvider, appUploadInfo: payload },
})

export const parseAppFileSuccess = (payload: Task) => ({
  type: ActionType.parseAppFileSuccess,
  payload,
})

export const parseAppFileError = (error: Error) => ({
  type: ActionType.parseAppFileError,
  payload: { error },
})
