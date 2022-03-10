// dependencies
import React from 'react'
import { useTranslation } from 'react-i18next'

import Typography from '@material-ui/core/Typography'

import { XGrid } from '@ues-behaviour/x-grid'
import { PageBase } from '@ues-platform/shared'
import {
  AppliedFilterPanel,
  ConfirmationDialog,
  ContentArea,
  ContentAreaPanel,
  TableProvider,
  TableToolbar,
  usePageTitle,
} from '@ues/behaviours'

import useList, { ListActions } from './../../modules/list'

const DevicePolicyList = () => {
  const { t: translate } = useTranslation(['protect', 'general/form'])

  // state

  const {
    tableProviderProps,
    xGridProps,
    filterPanelProps,
    filterLabels,
    totalCount,
    isDeleteDialogOpen,
    onGoToAddPolicy,
    onToggleDeleteDialogOpen,
    onDeletePolicies,
  } = useList()

  // render

  usePageTitle(translate('devicePoliciesTitle'))

  return (
    <PageBase title={translate('devicePoliciesTitle')}>
      <ContentArea
        height="100%"
        //data-autoid="policy-list-table"
      >
        <ContentAreaPanel fullWidth fullHeight>
          <TableProvider {...tableProviderProps}>
            <TableToolbar
              begin={<ListActions onAdd={onGoToAddPolicy} onDelete={onToggleDeleteDialogOpen} />}
              end={
                <Typography variant="body2">{translate('general/form:commonLabels.resultCount', { count: totalCount })}</Typography>
              }
              bottom={<AppliedFilterPanel {...filterPanelProps} {...filterLabels} />}
            />
            <XGrid {...xGridProps} />
          </TableProvider>
          <ConfirmationDialog
            open={isDeleteDialogOpen}
            title={translate('deletePolicy', { count: tableProviderProps.selectedProps.selected.length })}
            content={translate('doYouWantToDeletePolicy', {
              count: tableProviderProps.selectedProps.selected.length,
            })}
            cancelButtonLabel={translate('general/form:commonLabels.cancel')}
            confirmButtonLabel={translate('general/form:commonLabels.delete')}
            onCancel={onToggleDeleteDialogOpen}
            onConfirm={onDeletePolicies}
            //isPending={deletePoliciesStatus === PENDING}
            //data-autoid="policy-list-remove-dialog"
          />
        </ContentAreaPanel>
      </ContentArea>
    </PageBase>
  )
}

export default DevicePolicyList
