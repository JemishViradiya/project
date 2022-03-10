/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
const itemsToDelete = ['id', 'last_modified', 'created']
const itemsToClear = ['name']
const itemsToUpdate = ['id', 'last_modified', 'created']

export function filterPolicyForCreate(policy) {
  itemsToDelete.forEach(key => {
    delete policy[key]
  })
  itemsToClear.forEach(key => {
    policy[key] = ''
  })
}

export function filterPolicyForUpdate(policy) {
  itemsToUpdate.forEach(key => {
    delete policy[key]
  })
}
