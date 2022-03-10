//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Button, Typography } from '@material-ui/core'

import { XGrid } from '@ues-behaviour/x-grid'
import type { AclRule } from '@ues-data/gateway'
import { useStatefulReduxMutation } from '@ues-data/shared'
import { Config, Data, Hooks } from '@ues-gateway/shared'
import { FormButtonPanel, ProgressButton, TableProvider, TableToolbar } from '@ues/behaviours'

import { useColumns } from '../../hooks'
import type { AclListProps } from '../../types'
import type { AclRankableListContextState } from './list-rankable-context'
import { AclRankableListContext } from './list-rankable-context'
import useStyles from './styles'
import { makeRankChange } from './utils'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { getLocalAclRulesListData, mutationUpdateAclRulesRank, toggleListRankModeEnabled } = Data
const { useStatefulNotifications } = Hooks

const idFunction = (rowData: AclRule) => rowData.id

const AclRankableList: React.FC<AclListProps> = ({ total, loading }) => {
  const [localRankChange, setLocalRankChange] = useState<AclRankableListContextState['localRankChange']>({})

  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const classes = useStyles()
  const dispatch = useDispatch()
  const columns = useColumns()
  const localListData = useSelector(getLocalAclRulesListData)

  useEffect(() => {
    return () => {
      setLocalRankChange({})
    }
  }, [])

  const [updateAclRulesRankStart, updateAclRulesRankTask] = useStatefulNotifications(
    useStatefulReduxMutation(mutationUpdateAclRulesRank),
    {
      success: t('acl.updateAclRulesSuccessMessage'),
      error: t('acl.updateAclRulesErrorMessage'),
    },
  )

  const currentListData = localRankChange?.dataUpdate ?? localListData

  const basicTableProviderProps = {
    columns,
    idFunction,
    loading,
  }

  const tableProps = {
    getRowId: idFunction,
    loading,
    noRowsMessageKey: `${GATEWAY_TRANSLATIONS_KEY}:common.noData`,
    rows: currentListData,
  }

  const handleRankChange: AclRankableListContextState['onRankChange'] = args => {
    const update = makeRankChange({ ...args, currentListData, currentRankUpdate: localRankChange?.rankUpdate ?? {} })

    setLocalRankChange(update)
  }

  const handleRankChangeCancel = () => dispatch(toggleListRankModeEnabled())

  const handleRankChangeSubmit = () =>
    updateAclRulesRankStart({ ranksUpdate: Object.values(localRankChange?.rankUpdate), dataUpdate: localRankChange?.dataUpdate })

  return (
    <AclRankableListContext.Provider value={{ onRankChange: handleRankChange, localRankChange }}>
      <Box className={classes.tableContainer}>
        <TableToolbar end={<Typography>{t('acl.tableRulesLabel', { count: total ?? 0 })}</Typography>} />

        <TableProvider basicProps={basicTableProviderProps}>
          <XGrid {...tableProps} />
        </TableProvider>

        <Box className={classes.tableStickyActions}>
          <FormButtonPanel show>
            <Button variant="outlined" disabled={updateAclRulesRankTask?.loading} onClick={handleRankChangeCancel}>
              {t('common.buttonCancel')}
            </Button>
            <ProgressButton
              loading={updateAclRulesRankTask?.loading}
              disabled={isEmpty(localRankChange?.rankUpdate) || updateAclRulesRankTask?.loading}
              color="primary"
              variant="contained"
              onClick={handleRankChangeSubmit}
            >
              {t('common.buttonSave')}
            </ProgressButton>
          </FormButtonPanel>
        </Box>
      </Box>
    </AclRankableListContext.Provider>
  )
}

export default AclRankableList
