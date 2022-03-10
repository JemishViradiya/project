import React from 'react'
import { useTranslation } from 'react-i18next'

import Card from '@material-ui/core/Card'

import { AppControlField } from '@ues-data/epp'
import { AppliedFilterPanel, BasicTable, TableProvider, TableToolbar } from '@ues/behaviours'

import Actions from './actions'
import useList from './useList'

interface ListPropTypes {
  fields: Record<string, string>
  values: Record<string, any>
  setField: (name: string, value: string[]) => void
}

const List = ({ fields, values, setField }: ListPropTypes): JSX.Element => {
  const { t: translate } = useTranslation(['general/form'])

  const { tableProviderProps, data, filterPanelProps, filterLabels, addDialogProps, deleteDialogProps } = useList(
    fields,
    values,
    setField,
  )

  return (
    <Card variant="outlined" data-autoid="application-control-exclusion-list">
      <TableProvider {...tableProviderProps}>
        <TableToolbar
          begin={<Actions list={values[fields[AppControlField.allowed_folders]]} {...addDialogProps} {...deleteDialogProps} />}
          bottom={<AppliedFilterPanel {...filterPanelProps} {...filterLabels} />}
        />
        <BasicTable data={data} noDataPlaceholder={translate('commonLabels.noData')} />
      </TableProvider>
    </Card>
  )
}

export default List
