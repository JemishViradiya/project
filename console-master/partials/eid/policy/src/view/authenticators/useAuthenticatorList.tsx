/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

/* eslint-disable sonarjs/cognitive-complexity*/
import type { FormikHandlers } from 'formik'
import React, { useEffect, useMemo } from 'react'

import { FormControl, FormHelperText, InputLabel, makeStyles, MenuItem } from '@material-ui/core'

import { FeatureName, FeaturizationApi } from '@ues-data/shared'
import type { TableColumn, UseControlledDialogProps } from '@ues/behaviours'
import { DraggableTable, DraggableTableProvider, Select, TableToolbar, useDraggableTable, useSelected } from '@ues/behaviours'

import { getI18Name, useTranslation } from '../common/i18n'
import { DIALOG_TYPE, VALIDATE_OPERATION } from '../common/settings'
import { hasAuthenticationError } from '../common/validate'
import { FORM_REFS } from '../reference/types'
import AddAuthenticator from './AddAuthenticator'
import { useAuthenticatorToolbar } from './useAuthenticatorToolbar'

// TODO: These will be deprecated when moving to common form pattern
const useStyles = makeStyles(theme => ({
  separator4: {
    paddingBottom: theme.spacing(4),
  },
}))

const enableBrowserFirstSeen = FeaturizationApi.isFeatureEnabled(FeatureName.PolicyAuthenticationBrowserFirstSeen)

type AuthenticatorTableProps = {
  values?: any
  dataAuthenticators: any
  errors: any
  canValidate: boolean
  visible: boolean
  writable: boolean
  initValue: boolean
  exceptionIndex: number
  handleChange?: FormikHandlers['handleChange']
  manualValidate: (VALIDATE_OPERATION) => void
}
const AuthenticatorTable = ({
  values,
  dataAuthenticators,
  errors,
  canValidate = false,
  visible = true,
  writable = false,
  initValue = false,
  exceptionIndex = -1,
  handleChange,
  manualValidate,
}: AuthenticatorTableProps) => {
  const { t } = useTranslation()
  const [dialogStateId, setDialogStateId] = React.useState<UseControlledDialogProps['dialogId']>()
  const [unusedAuthenticators, setUnusedAuthenticators] = React.useState<any[]>()
  const [authenticators, setAuthenticators] = React.useState<any[]>([])
  const [draggableMode, setDraggableMode] = React.useState<boolean>(false)
  const [firstLoginAuthenticator, setFirstLoginAuthenticator] = React.useState<any>()
  const [initialized, setInitialized] = React.useState<boolean>(initValue)
  const [dataLoaded, setDataLoaded] = React.useState<boolean>(false)
  const classes = useStyles()

  //console.log('AuthenticatorTable: ', { dataAuthenticators, values, unusedAuthenticators })

  const columns: TableColumn[] = useMemo(
    () => [
      {
        label: t(getI18Name('authenticatorsList.columns.name')),
        dataKey: 'name',
      },
      {
        label: t(getI18Name('authenticatorsList.columns.description')),
        dataKey: 'description',
      },
    ],
    [t],
  )

  const addWarningMethodRequiredLabel = (errorName: string) => {
    if (canValidate && hasAuthenticationError(errors, exceptionIndex)) {
      return <FormHelperText>{t(getI18Name(`${errorName}Required`))}</FormHelperText>
    }
  }

  const findAuthenticatorById = (id: string) => {
    return dataAuthenticators?.find(el => el.id === id)
  }

  const findAuthenticatorByName = (name: string) => {
    return dataAuthenticators?.find(el => el.name === name)
  }

  // When authenticator data is loaded configure state for active payload
  useEffect(() => {
    if (!initialized || values) {
      setInitialized(true)
      for (const attributename in values?.risk_factors?.authenticators) {
        values?.risk_factors?.authenticators[attributename].forEach(id => {
          const authenticator = findAuthenticatorById(id)
          if (authenticator) {
            setFirstLoginAuthenticator(authenticator.name)
          }
        })
      }
      if (dataAuthenticators?.length > 0) {
        const authenticatorsPayload = []
        for (const attributename in values?.authenticators) {
          values?.authenticators[attributename].forEach(id => {
            authenticatorsPayload.push(findAuthenticatorById(id))
          })
        }
        setAuthenticators(authenticatorsPayload)
      }
      // Sort by name
      dataAuthenticators?.sort((a: any, b: any) => {
        return a.name.localeCompare(b.name)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, values])

  const idFunction = rowData => rowData.name

  useEffect(() => {
    const unusedAuthenticatorsUpdated = dataAuthenticators?.filter(
      ({ name }) => !authenticators.some(item => item.name === name) && name !== firstLoginAuthenticator,
    )
    setUnusedAuthenticators(unusedAuthenticatorsUpdated)
  }, [authenticators, firstLoginAuthenticator, dataAuthenticators])

  useEffect(() => {
    if (authenticators?.length > 0) {
      const authenticatorsPayload = {}
      authenticators?.forEach(({ id }, index: number) => {
        authenticatorsPayload[index + 1] = [id]
      })
      setFormValue(FORM_REFS.AUTHENTICATOR_LIST, authenticatorsPayload)
    } else {
      setFormValue(FORM_REFS.AUTHENTICATOR_LIST, null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticators])

  useEffect(() => {
    setDataLoaded(initialized)
  }, [initialized])

  useEffect(() => {
    if (firstLoginAuthenticator !== undefined && firstLoginAuthenticator !== '') {
      const riskFactorPayload = {
        name: 'BFS',
        authenticators: {
          '1': [findAuthenticatorByName(firstLoginAuthenticator)?.id],
        },
        risks: ['browser_first_seen'],
        rule: { '==': [{ var: 'browser_first' }, true] },
      }
      setFormValue(FORM_REFS.RISK_FACTORS, riskFactorPayload)
    } else if (firstLoginAuthenticator !== undefined && firstLoginAuthenticator === '') {
      setFormValue(FORM_REFS.RISK_FACTORS, null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstLoginAuthenticator])

  const setFormValue = (valueName: FORM_REFS, value: any) => {
    if (dataLoaded) {
      values[valueName] = value
      manualValidate(
        exceptionIndex !== -1
          ? VALIDATE_OPERATION.EXCEPTIONS_CHANGE
          : valueName === FORM_REFS.RISK_FACTORS
          ? VALIDATE_OPERATION.RISK_FACTORS_CHANGE
          : VALIDATE_OPERATION.AUTHENTICATOR_LIST_CHANGE,
      )
    }
  }

  const onDelete = (rows: any[]) => {
    if (rows.length >= 1) {
      const updatedAuthenticators = authenticators?.filter(({ name }) => !rows.includes(name))
      setAuthenticators(updatedAuthenticators)
      selectionProps.resetSelectedItems()
    }
  }

  const onConfirm = authenticatorName => {
    setDialogStateId(undefined)
    const updatedAuthenticators = [...authenticators]
    updatedAuthenticators.push(findAuthenticatorByName(authenticatorName))
    setAuthenticators(updatedAuthenticators)
  }

  const onCancel = () => {
    setDialogStateId(undefined)
  }

  const onCreate = () => {
    if (unusedAuthenticators?.length > 0) {
      setDialogStateId(Symbol(DIALOG_TYPE.AUTHENTICATOR_SELECT))
    }
  }

  const selectionProps = useSelected('name')

  const toolbarProps = useAuthenticatorToolbar({
    draggableMode: draggableMode,
    authenticators: authenticators,
    unusedAuthenticators: unusedAuthenticators,
    selectedIds: selectionProps.selected,
    writable: writable,
    setDraggableMode: mode => {
      setDraggableMode(mode)
    },
    onDelete: items => {
      onDelete(items)
    },
    onCreate: () => {
      onCreate()
    },
  })

  const basicProps = useMemo(
    () => ({
      columns,
      idFunction,
      // loading: loading,
    }),
    [columns],
  )

  const draggable = draggableMode
    ? {
        onDragChange: ({ updatedDataSource }) => {
          setAuthenticators(updatedDataSource)
        },
        onDataReorder: (rowData, index) => ({ ...rowData, rank: index + 1 }),
      }
    : undefined

  const draggableTableProps = useDraggableTable({
    initialData: authenticators,
    idFunction,
    draggable,
  })

  const RiskFactorSelect = () => {
    return (
      <Select
        displayEmpty={false}
        value={firstLoginAuthenticator ?? ''}
        label={t(getI18Name('firstLoginFromBrowserLabel'))}
        size="small"
        variant="filled"
        disabled={!writable}
        onChange={e => {
          setFirstLoginAuthenticator(e.target.value)
        }}
      >
        <MenuItem>
          <em>{t(getI18Name('firstLoginFromBrowserNotSetLabel'))}</em>
        </MenuItem>
        {firstLoginAuthenticator !== undefined && (
          <MenuItem value={firstLoginAuthenticator} key={firstLoginAuthenticator}>
            {firstLoginAuthenticator}
          </MenuItem>
        )}
        {unusedAuthenticators?.map(key => (
          <MenuItem value={key['name']} key={key['name']}>
            {key['name']}
          </MenuItem>
        ))}
      </Select>
    )
  }

  const tableProps = { ...draggableTableProps, noDataPlaceholder: t(getI18Name('authenticatorsList.noData')) }

  if (!visible) {
    return null
  }

  return (
    <div key={`authenticator-${exceptionIndex}`}>
      {exceptionIndex !== -1 && <h3>{t(getI18Name('authenticationRulesLabel'))}</h3>}
      {enableBrowserFirstSeen && (
        <FormControl
          style={{ minWidth: 210 }}
          variant="filled"
          size="small"
          className={classes.separator4}
          disabled={unusedAuthenticators?.length === 0 && !firstLoginAuthenticator}
        >
          <RiskFactorSelect />
        </FormControl>
      )}
      <FormControl
        onChange={handleChange}
        error={canValidate && hasAuthenticationError(errors, exceptionIndex)}
        focused={false}
        fullWidth
      >
        <TableToolbar {...toolbarProps} />
        <div>{addWarningMethodRequiredLabel(FORM_REFS.AUTHENTICATOR_LIST)}</div>
        <DraggableTableProvider
          basicProps={basicProps}
          selectedProps={writable ? selectionProps : undefined}
          draggableProps={draggableTableProps.draggableProps}
        >
          <DraggableTable {...tableProps} />
        </DraggableTableProvider>
        <AddAuthenticator
          id={dialogStateId}
          unusedAuthenticators={unusedAuthenticators}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </FormControl>
    </div>
  )
}

export const Authenticator = AuthenticatorTable.bind({})
