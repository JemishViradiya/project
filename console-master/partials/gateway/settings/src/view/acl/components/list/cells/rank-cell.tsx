//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Box, IconButton, TextField, Typography } from '@material-ui/core'

import { Data } from '@ues-gateway/shared'
import { ArrowCaretDown, ArrowCaretUp } from '@ues/assets'
import { AriaElementLabel } from '@ues/assets-e2e'

import type { CommonCellProps } from '../../../types'
import { AclRankableListContext } from '../list-rankable-context'

const { getListRankModeEnabled, mapRankToIndexInArray, getFetchDraftAclRulesTask, getLocalAclRulesListData } = Data

const RankCellEditor: React.FC<CommonCellProps> = ({ item, disabled }) => {
  const [inputValue, setInputValue] = useState<string | number>(item?.rank)
  const fetchDraftAclRulesTask = useSelector(getFetchDraftAclRulesTask)
  const localListData = useSelector(getLocalAclRulesListData)
  const { onRankChange } = useContext(AclRankableListContext)

  useEffect(() => {
    if (item?.rank) {
      setInputValue(item.rank)
    }
  }, [item])

  const handleRankChange = (expectedRank: number, inputChange = false) =>
    onRankChange({ fromIndex: mapRankToIndexInArray(item), toIndex: mapRankToIndexInArray({ rank: expectedRank }), inputChange })

  const handleInputChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setInputValue(value)

  const handleRankChangeByInput = () => {
    const expectedRank = Number(inputValue)
    const isAcceptableRank = expectedRank > 0 && expectedRank <= localListData?.length

    if (isAcceptableRank) {
      handleRankChange(expectedRank, true)
    }
  }

  const isFirstItem = item.rank === 1
  const isLastItem = item.rank === fetchDraftAclRulesTask?.data?.response?.totals?.elements

  return (
    <Box display="flex" justifyContent="center" alignItems="center" style={{ flex: 0, minWidth: 100 }}>
      <TextField
        style={{ marginTop: '1.5rem' }}
        size="small"
        InputProps={{
          endAdornment: (
            <Box display="flex" flexDirection="column">
              <IconButton disabled={disabled || isFirstItem} onClick={() => handleRankChange(item.rank - 1)}>
                <ArrowCaretUp />
              </IconButton>
              <IconButton disabled={disabled || isLastItem} onClick={() => handleRankChange(item.rank + 1)}>
                <ArrowCaretDown />
              </IconButton>
            </Box>
          ),
        }}
        onChange={handleInputChange}
        onKeyDown={(event: React.KeyboardEvent) => {
          if (event.key === 'Enter') {
            handleRankChangeByInput()
          }
        }}
        onBlur={handleRankChangeByInput}
        value={inputValue}
        disabled={disabled}
      />
    </Box>
  )
}

const RankCellSimple: React.FC<CommonCellProps> = ({ item }) => (item.rank ? <Typography>{item.rank}</Typography> : null)

export const RankCell: React.FC<CommonCellProps> = props => {
  const rankModeEnabled = useSelector(getListRankModeEnabled)

  return rankModeEnabled ? <RankCellEditor {...props} /> : <RankCellSimple {...props} />
}
