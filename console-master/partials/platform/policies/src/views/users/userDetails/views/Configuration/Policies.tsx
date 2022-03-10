/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { Box, Button, Card, CardHeader, List, ListItem, Paper, Popover, Typography } from '@material-ui/core'

import { UsersApi } from '@ues-data/platform'
import { Permission, usePermissions, useStatefulAsyncQuery } from '@ues-data/shared'
import { SearchDialog } from '@ues-platform/shared'
import { ArrowCaretDown, BasicAdd } from '@ues/assets'
import { BasicTable, TableProvider, TableToolbar, useSnackbar } from '@ues/behaviours'

import { useAssignPolicy, useUserPoliciesTable } from './policiesHooks'

const Policies = props => {
  const { enqueueMessage } = useSnackbar()
  const { t } = useTranslation(['platform/common'])
  const { userData, refetchPoliciesRef } = props
  const { id: userId } = useParams()
  const { hasPermission } = usePermissions()
  const editable: boolean = hasPermission(Permission.ECS_USERS_UPDATE)

  const allPoliciesState = useStatefulAsyncQuery(UsersApi.queryAllPolicies)
  const { loading } = allPoliciesState

  const { providerProps, tableData, refetchEffectivePolicies, directlyAssignedPolicies } = useUserPoliciesTable(
    userId,
    userData?.displayName,
    allPoliciesState,
    editable,
    loading,
  )

  useEffect(() => {
    if (allPoliciesState?.error) {
      enqueueMessage(t('users.details.configuration.policies.errors.fetchAll'), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPoliciesState])

  useEffect(() => {
    if (refetchPoliciesRef) {
      refetchPoliciesRef.current = refetchEffectivePolicies
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchEffectivePolicies])

  const { addPopoverProps, searchDialogProps, policyTypes, openAddDialog, handleAddClick, assignmentLoading } = useAssignPolicy(
    userId,
    allPoliciesState,
    refetchEffectivePolicies,
    directlyAssignedPolicies,
  )

  const typesWithLabels = useMemo(() => {
    const types = Object.keys(policyTypes).map(type => ({
      type,
      disabled: policyTypes[type].length === 0,
      label: t('groups.policyAssign.type.' + type),
    }))
    types.sort((a, b) => a.label.localeCompare(b.label))
    return types
  }, [policyTypes, t])

  return (
    <>
      <SearchDialog {...searchDialogProps} />
      <Popover
        {...addPopoverProps}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper>
          <List role="listbox">
            {typesWithLabels.map(item => (
              <ListItem key={item.type} button disabled={item.disabled} onClick={() => openAddDialog(item.type)}>
                {item.label}
              </ListItem>
            ))}
          </List>
        </Paper>
      </Popover>
      <Box mt={6}>
        <Card variant="outlined">
          <CardHeader title={<Typography variant="h2">{t('users.details.configuration.policies.title')}</Typography>} />
          {editable && (
            <Box mb={6}>
              <Typography>{t('users.details.configuration.policies.description')}</Typography>
            </Box>
          )}
          <TableProvider {...providerProps}>
            {editable && (
              <TableToolbar
                begin={
                  <Button
                    startIcon={<BasicAdd />}
                    endIcon={<ArrowCaretDown />}
                    onClick={handleAddClick}
                    disabled={assignmentLoading}
                    variant="contained"
                    color="secondary"
                  >
                    {t('users.details.configuration.policies.assignButton')}
                  </Button>
                }
              />
            )}
            <BasicTable data={tableData} noDataPlaceholder={t('noData')} />
          </TableProvider>
        </Card>
      </Box>
    </>
  )
}

export default Policies
