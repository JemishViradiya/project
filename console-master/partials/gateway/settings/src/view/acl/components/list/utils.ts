//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { AclRule } from '@ues-data/gateway'

import type { AclRankableListContextState } from './list-rankable-context'

// TODO provide unit tests for each of the utility in this file
type MakeRankChangeFn = (
  args: Parameters<AclRankableListContextState['onRankChange']>[0] & {
    currentListData: AclRule[]
    currentRankUpdate: AclRankableListContextState['localRankChange']['rankUpdate']
  },
) => AclRankableListContextState['localRankChange']

const makeRankChangeByButtons: MakeRankChangeFn = ({ currentListData, currentRankUpdate, fromIndex, toIndex }) => {
  const updatedListData = [...currentListData]

  const onFromIndexData = { ...updatedListData[fromIndex], rank: toIndex + 1 }
  const onToIndexData = { ...updatedListData[toIndex], rank: fromIndex + 1 }

  updatedListData[fromIndex] = onToIndexData
  updatedListData[toIndex] = onFromIndexData

  return {
    rankUpdate: {
      ...currentRankUpdate,
      [onFromIndexData.id]: {
        id: onFromIndexData.id,
        rank: onFromIndexData.rank,
      },
      [onToIndexData.id]: {
        id: onToIndexData.id,
        rank: onToIndexData.rank,
      },
    },
    dataUpdate: updatedListData,
  }
}

const makeRankChangeByInput: MakeRankChangeFn = ({ currentListData, currentRankUpdate, fromIndex, toIndex }) => {
  const updatedListData = [...currentListData]
  const updatedRecord = { ...updatedListData[fromIndex] }

  updatedListData.splice(fromIndex, 1)
  updatedListData.splice(toIndex, 0, updatedRecord)

  const { uiUpdate, serverUpdate } = updatedListData.reduce(
    (acc, record, index) => {
      const rank = index + 1

      return {
        ...acc,
        serverUpdate: { ...acc.serverUpdate, [record.id]: { id: record.id, rank } },
        uiUpdate: [...acc.uiUpdate, { ...record, rank }],
      }
    },
    { uiUpdate: [], serverUpdate: {} },
  )

  return { rankUpdate: { ...currentRankUpdate, ...serverUpdate }, dataUpdate: uiUpdate }
}

export const makeRankChange: MakeRankChangeFn = args =>
  args.inputChange === true ? makeRankChangeByInput(args) : makeRankChangeByButtons(args)
