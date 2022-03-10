/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
const itemsToDelete = ['id', 'modified', 'created']
const itemsToClear = ['name']

export function filterPolicyForCreate(policy) {
  itemsToDelete.forEach(key => {
    delete policy[key]
  })
  itemsToClear.forEach(key => {
    policy[key] = ''
  })
}
