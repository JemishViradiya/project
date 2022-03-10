import moment from 'moment'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Drawer, IconButton, Link as MuiLink, Typography } from '@material-ui/core'

import { DataEntities, FileApi, FileInventoryData, PolicyData } from '@ues-data/dlp'
import { useStatefulReduxQuery } from '@ues-data/shared'
import type { AccordionProps } from '@ues-info/shared'
import { Accordion, Hooks, useDrawerStyles } from '@ues-info/shared'
import { BasicClose } from '@ues/assets'
import { useSnackbar } from '@ues/behaviours'

import { useBytesConverter } from '../utils'

export const useDrawerProps = () => {
  const [isOpen, setState] = React.useState(false)
  const toggleDrawer = () => {
    setState(!isOpen)
  }
  return { isOpen, toggleDrawer }
}

export interface FileInventoryDrawerProps {
  fileInventoryEvent: any
  isOpen: boolean
  toggleDrawer: () => void
}

export const FileInventoryDrawer: React.FC<FileInventoryDrawerProps> = ({ fileInventoryEvent, isOpen, toggleDrawer }) => {
  const classNames = useDrawerStyles()
  const snackbar = useSnackbar()
  const { t } = useTranslation(['dlp/common', 'general/form'])
  const {
    canReadDevice,
    canReadUsers,
    canReadPolicy,
    canReadFileSummary,
    canReadSettings,
    canReadPolicyList,
  } = Hooks.useRbacPermissions()

  const {
    error: fileDetailsError,
    loading: fileDetailsLoading,
    data: fileDetailsData,
    refetch: refetchEvent,
  } = useStatefulReduxQuery(FileInventoryData.queryFileDetails, {
    variables: { fileHash: fileInventoryEvent?.hash },
    // to avoid extra request
    skip: !fileInventoryEvent?.hash,
  })

  const usersAndDevicesData = useMemo(
    () => fileInventoryEvent?.hash && FileApi.FileService.getFileDetails(fileDetailsData?.hash),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fileInventoryEvent?.users, fileInventoryEvent?.devices],
  )

  const { users, devices } = usersAndDevicesData || []

  const dataEntitiesParams = useMemo(
    () => ({
      dataEntityGuids: fileDetailsData?.dataEntities?.map(dataEntity => dataEntity?.guid),
    }),
    [fileDetailsData?.dataEntities],
  )

  const { error: dataEntitiesError, loading: dataEntitiesLoading, data: dataEntitiesData } = useStatefulReduxQuery(
    DataEntities.queryDataEntitiesByGuids,
    {
      variables: dataEntitiesParams,
      // to avoid extra request
      skip: !fileInventoryEvent?.hash,
    },
  )

  const policyParams = useMemo(
    () => ({
      guidList: fileDetailsData?.policies?.map(policy => policy?.guid),
    }),
    [fileDetailsData?.policies],
  )

  const { error: policiesError, loading: policiesLoading, data: policiesData } = useStatefulReduxQuery(
    PolicyData.queryPoliciesByGuids,
    {
      variables: policyParams,
      // to avoid extra request
      skip: !fileInventoryEvent?.hash,
    },
  )

  const fileDetails: AccordionProps[] = [
    {
      title: t('fileInventory.drawer.fileDetails.title'),
      rows: [
        {
          label: t('fileInventory.drawer.fileDetails.fileSize'),
          value: useBytesConverter(fileInventoryEvent?.size),
        },
        {
          label: t('fileInventory.drawer.fileDetails.fileType'),
          value: fileDetailsData?.type,
        },
        {
          label: t('fileInventory.drawer.fileDetails.evidenceFile'),
          value: (
            <MuiLink component={Link} to={'/'}>
              <span>{t('general/form:commonLabels.view')}</span>
            </MuiLink>
          ),
        },
      ],
    },
  ]

  const usersWithAccess: AccordionProps[] = [
    {
      title: t('fileInventory.drawer.users.title'),
      rows: users?.map(user => {
        return {
          label: (
            <MuiLink
              variant="inherit"
              color="primary"
              href={`/uc/platform#/users/${user?.id}`}
              onClick={(event: React.SyntheticEvent) => event.stopPropagation()}
            >
              <span>{user?.name}</span>
            </MuiLink>
          ),
          value: null,
        }
      }),
    },
  ]

  const devicesWithAccess: AccordionProps[] = [
    {
      title: t('fileInventory.drawer.devices.title'),
      rows: devices?.map(device => {
        return {
          label: device?.name,
          value: null,
        }
      }),
    },
  ]

  const dataTypesOccurrences = dataEntity => {
    const entityByGuid = fileDetailsData?.dataEntities?.find(entity => entity?.guid === dataEntity?.guid)
    return entityByGuid ? entityByGuid?.occurrences : ''
  }

  const dataTypes: AccordionProps[] = [
    {
      title: t('fileInventory.drawer.dataTypes.title'),
      rows: dataEntitiesData?.map(dataEntity => {
        const occurrences = dataTypesOccurrences(dataEntity)
        return {
          label: occurrences
            ? t('fileInventory.drawer.dataTypes.occurrences', { name: dataEntity?.name, occurrences: occurrences })
            : null,
          value: null,
        }
      }),
    },
  ]

  const policyViolations: AccordionProps[] = [
    {
      title: t('fileInventory.drawer.policyViolations.title'),
      rows: policiesData?.elements?.map(policy => {
        return {
          label: (
            <MuiLink
              variant="inherit"
              color="primary"
              href={`/uc/info#/content/update/${policy?.policyId}`}
              onClick={(event: React.SyntheticEvent) => event.stopPropagation()}
            >
              <span>{policy?.policyName}</span>
            </MuiLink>
          ),
          value: null,
        }
      }),
    },
  ]

  return (
    <Drawer classes={{ paper: classNames.paper }} variant="persistent" PaperProps={{ elevation: 6 }} anchor={'right'} open={isOpen}>
      <IconButton className={classNames.closeIcon} onClick={toggleDrawer}>
        <BasicClose fontSize="small" />
      </IconButton>

      <Typography className={classNames.title} variant="h2">
        {fileDetailsData?.name}
      </Typography>

      {canReadFileSummary && fileDetails.map(item => <Accordion key="fileDetails" {...item} />)}
      {canReadUsers &&
        usersWithAccess.map(item => <Accordion alternateTitle={`${users?.length || 0}`} key="usersWithAccess" {...item} />)}
      {canReadDevice &&
        devicesWithAccess.map(item => <Accordion alternateTitle={`${devices?.length || 0}`} key="devicesWithAccess" {...item} />)}
      {canReadSettings &&
        !!fileDetailsData?.dataEntities?.length &&
        dataTypes.map(item => <Accordion alternateTitle={`${dataEntitiesData?.length}`} key="dataTypes" {...item} />)}
      {canReadPolicyList &&
        !!policiesData?.elements?.length &&
        policyViolations.map(item => (
          <Accordion alternateTitle={`${policiesData?.elements?.length || 0}`} key="policyViolations" {...item} />
        ))}
    </Drawer>
  )
}
