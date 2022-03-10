import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import type { BulkDeleteResponse } from '@ues-data/mtd'
import type { ReduxMutation, StatefulResult } from '@ues-data/shared'
import { usePrevious, useStatefulReduxMutation } from '@ues-data/shared'
import type { InfiniteTableProviderInputProps } from '@ues/behaviours'
import { ConfirmationState, useConfirmation, useSnackbar } from '@ues/behaviours'

import { MessageFromItemList } from './useExclusionsList'

type UseMultipleDeleteReturn = {
  showDeleteConfirmation: () => void
}

const MessageKeyMap = {
  APP: {
    singleEntityLowerCase: 'exclusion.entityAppLowerCase',
    multipleEntitiesLowerCase: 'exclusion.entitiesAppsLowerCase',
    multipleEntitiesUpperCase: 'exclusion.entitiesAppsUpperCase',
  },
  DEVCERT: {
    singleEntityLowerCase: 'exclusion.entityCertLowerCase',
    multipleEntitiesLowerCase: 'exclusion.entitiesCertsLowerCase',
    multipleEntitiesUpperCase: 'exclusion.entitiesCertsUpperCase',
  },
  DOMAIN: {
    singleEntityLowerCase: 'exclusion.entityDomainLowerCase',
    multipleEntitiesLowerCase: 'exclusion.entitiesDomainsLowerCase',
    multipleEntitiesUpperCase: 'exclusion.entitiesDomainsUpperCase',
  },
  IPADDRESS: {
    singleEntityLowerCase: 'exclusion.entityIp',
    multipleEntitiesLowerCase: 'exclusion.entitiesIps',
    multipleEntitiesUpperCase: 'exclusion.entitiesIps',
  },
} as const

export type ExclusionEntityType = keyof typeof MessageKeyMap

type MessageProviderResult = {
  msg: string
  variant: 'success' | 'error'
  refetch: boolean
  resetSelectedItems: boolean
}

export const useMultipleDelete = (
  providerProps: Omit<InfiniteTableProviderInputProps, 'children'>,
  getSelected: () => any[],
  refetch: () => unknown,
  mutation: ReduxMutation<BulkDeleteResponse, any, any>,
  entityType: ExclusionEntityType,
  idFunction: (rowData) => any,
  additionalMsg?: string,
): UseMultipleDeleteReturn => {
  const snackbar = useSnackbar()
  const confirmation = useConfirmation()
  const { t } = useTranslation(['mtd/common'])

  const getDeleteResult = (
    deleteMultipleTask: StatefulResult<BulkDeleteResponse>,
    deleteMultipleTaskPrev: StatefulResult<BulkDeleteResponse>,
    selected?: string[],
  ): MessageProviderResult => {
    let res: MessageProviderResult = undefined
    if (!deleteMultipleTask.loading && deleteMultipleTaskPrev.loading && deleteMultipleTask.error) {
      res = { msg: '', variant: 'error', refetch: false, resetSelectedItems: false }
      if (selected.length > 1) {
        //handling multiple delete error
        res = {
          ...res,
          msg: t('exclusion.deleteMultipleErrorMsg', {
            entities: t(MessageKeyMap[entityType].multipleEntitiesUpperCase),
          }),
        }
      } else {
        //handling single delete error
        res = {
          ...res,
          msg: t('exclusion.deleteSingleErrMsg', { entity: t(MessageKeyMap[entityType].singleEntityLowerCase) }),
        }
      }
    } else if (!deleteMultipleTask.loading && deleteMultipleTaskPrev.loading) {
      res = { msg: '', variant: 'success', refetch: true, resetSelectedItems: true }
      if (selected.length > 1) {
        if (deleteMultipleTask.data?.totalRequested !== deleteMultipleTask.data?.totalProcessed) {
          //process only partial delete success
          const failedCount = deleteMultipleTask.data?.totalRequested - deleteMultipleTask.data?.totalProcessed
          res = {
            msg: t('exclusion.failedCountDeleteErrorMsg', {
              failedCount: failedCount,
              entities:
                failedCount > 1
                  ? t(MessageKeyMap[entityType].multipleEntitiesLowerCase)
                  : t(MessageKeyMap[entityType].singleEntityLowerCase),
            }),
            variant: 'error',
            refetch: true,
            resetSelectedItems: true,
          }
        } else {
          //process multiple success
          res = {
            ...res,
            msg: t('exclusion.multipleDeleteSuccessMsg', {
              entities: t(MessageKeyMap[entityType].multipleEntitiesUpperCase),
            }),
          }
        }
      } else {
        //process single success
        if (deleteMultipleTask.data?.totalProcessed === 0) {
          res = {
            variant: 'error',
            refetch: false,
            resetSelectedItems: false,
            msg: t('exclusion.deleteSingleErrMsg', { entity: t(MessageKeyMap[entityType].singleEntityLowerCase) }),
          }
        } else {
          res = {
            ...res,
            msg: t('exclusion.singleDeleteSuccessMsg', { entity: t(MessageKeyMap[entityType].singleEntityLowerCase) }),
          }
        }
      }
    }

    return res
  }

  const [deleteMultipleStartAction, deleteMultipleTask] = useStatefulReduxMutation(mutation)
  const deleteMultipleTaskPrev = usePrevious(deleteMultipleTask)
  useEffect(() => {
    const deleteResult = getDeleteResult(deleteMultipleTask, deleteMultipleTaskPrev, getSelected())
    if (deleteResult) {
      snackbar.enqueueMessage(deleteResult.msg, deleteResult.variant)
      if (deleteResult?.refetch) {
        refetch()
      }
      if (deleteResult?.resetSelectedItems) {
        providerProps?.selectedProps?.resetSelectedItems()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteMultipleTask])

  const showDeleteConfirmation = async () => {
    const confirmationState = await confirmation({
      title: t('exclusion.deleteConfirmation'),
      description:
        getSelected().length <= 100
          ? t('exclusion.deleteConfirmationMsg', { entities: t(MessageKeyMap[entityType].multipleEntitiesLowerCase) })
          : t('exclusion.deleteTooManyConfirmationMsg', {
              count: getSelected().length,
              entities: t(MessageKeyMap[entityType].multipleEntitiesLowerCase),
            }),
      ...((getSelected().length <= 100 || additionalMsg) && {
        content: additionalMsg ? (
          <>
            <Typography gutterBottom={true}>{additionalMsg}</Typography>
            {getSelected().length <= 100 && <MessageFromItemList selectedItems={getSelected()} />}
          </>
        ) : (
          <MessageFromItemList selectedItems={getSelected()} />
        ),
      }),
      cancelButtonLabel: t('common.cancel'),
      confirmButtonLabel: t('common.delete'),
    })

    if (confirmationState === ConfirmationState.Confirmed) {
      deleteMultipleStartAction({ entityIds: getSelected().map(entity => idFunction(entity)) })
    }
  }

  return { showDeleteConfirmation }
}
