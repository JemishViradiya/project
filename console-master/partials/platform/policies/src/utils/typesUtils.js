/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
const typeMapping = new Map([
  ['workspaces', 'workspaces'],
  ['teamConnect', 'teamConnect'],
  ['uem', 'uem'],
])

export function getTypesQuery(options) {
  return options.reduce((str, option) => str + `${typeMapping.get(option)},`, '')
}
