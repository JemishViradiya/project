/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReduxMutation } from '@ues-data/shared'

import { MtdApi, MtdApiMock } from '../api'
import type { IParsedAppInfo } from '../api/app-file-parser/app-file-parser-api-types'
import { ExclusionReadPermissions } from '../shared/permissions'
import { ParseAppFile } from './actions'
import { getParseAppFileTask } from './selectors'
import type { ParsedAppState } from './types'
import { ReduxSlice } from './types'

export const mutationParseAppFile: ReduxMutation<
  IParsedAppInfo,
  Parameters<typeof ParseAppFile>[0],
  ParsedAppState['tasks']['parseAppFile']
> = {
  mutation: payload => ParseAppFile(payload, MtdApi),
  mockMutation: payload => ParseAppFile(payload, MtdApiMock),
  selector: () => getParseAppFileTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionReadPermissions,
}
