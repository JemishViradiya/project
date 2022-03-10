/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { call, put, takeLeading } from 'redux-saga/effects'

import { AppUploadParseResultType } from '../api/app-file-parser/app-file-parser-api-types'
import type { ParseAppFile } from './actions'
import { parseAppFileError, parseAppFileSuccess } from './actions'
import { ActionType } from './types'

export const parseAppFileSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof ParseAppFile>>(
    ActionType.ParseAppFileStart,
    function* ({ payload: { apiProvider, appUploadInfo } }) {
      try {
        const { data } = yield call(
          appUploadInfo.resultType === AppUploadParseResultType.Application
            ? apiProvider.Applications.parseAppFile
            : apiProvider.DeveloperCertificates.parseAppFile,
          appUploadInfo,
        )
        data.fileName = appUploadInfo.fileName
        yield put(parseAppFileSuccess({ result: data }))
      } catch (error) {
        yield put(parseAppFileError(error as Error))
      }
    },
  )
}
