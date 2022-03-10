/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { Box, CircularProgress, makeStyles, Typography } from '@material-ui/core'

import { queryComplianceInfo } from '@ues-data/mtd'
import { useErrorCallback, useStatefulAsyncQuery } from '@ues-data/shared'
import { StatusHigh, StatusProtect } from '@ues/assets'
import { useSnackbar } from '@ues/behaviours'

import { ComplianceThreatTable } from './widgets/ComplianceThreatTable'

const useStyles = makeStyles(theme => ({
  infoBox: {
    marginBottom: theme.spacing(10),
  },
  infoField: {
    display: 'flex',
    marginBottom: theme.spacing(4),
  },
  fieldLabel: {
    width: '150px',
  },
  statusProtectIcon: {
    fontSize: '1.25rem',
    color: theme.palette['alert']['successBorder'],
    marginRight: theme.spacing(1),
  },
  statusHighIcon: {
    fontSize: '1.25rem',
    color: theme.palette['alert']['errorBorder'],
    marginRight: theme.spacing(1),
  },
}))

const isCompliant = complianceList => {
  return !Array.isArray(complianceList) || !complianceList.length
}

const StatusIcon = ({ compliant, classes }) => {
  return compliant ? <StatusProtect className={classes.statusProtectIcon} /> : <StatusHigh className={classes.statusHighIcon} />
}

const DeviceStatus = ({ compliant, useTransObj, classes }) => {
  const { t } = useTransObj

  const translationKey = compliant ? 'compliant' : 'nonCompliant'

  return (
    <Box display="flex">
      <StatusIcon compliant={compliant} classes={classes} />
      <Typography variant="body2">{t(`responseActions.${translationKey}`)}</Typography>
    </Box>
  )
}

const DeviceStatusInfo = ({ compliant, useTransObj }) => {
  const { t } = useTransObj

  const translationKey = compliant ? 'compliant' : 'nonCompliant'
  return <Typography variant="body2">{t(`responseActions.body.${translationKey}`)}</Typography>
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

const isNotFoundError = complianceInfoError => {
  return complianceInfoError && complianceInfoError['response'] && complianceInfoError['response']['status'] === 404
}

const MtdResponseActions = () => {
  const useTransObj = useTranslation(['mtd/common'])
  const { t } = useTransObj
  const classes = useStyles()
  const query = useQuery()
  const { enqueueMessage } = useSnackbar()

  const { data: complianceInfo, loading: complianceInfoLoading, error: complianceInfoError } = useStatefulAsyncQuery(
    queryComplianceInfo,
    {
      variables: { userId: query.get('userId'), deviceId: query.get('deviceId') },
    },
  )
  useErrorCallback(complianceInfoError, () => {
    if (!isNotFoundError(complianceInfoError)) {
      enqueueMessage(t('responseActions.error.fetch'), 'error')
    }
  })

  return complianceInfoLoading ? (
    <Box display="flex" justifyContent="center">
      <CircularProgress />
    </Box>
  ) : complianceInfoError !== undefined ? (
    <Box>{t('responseActions.noResponseActionAvailable')}</Box>
  ) : (
    <Box>
      <Box className={classes.infoBox}>
        <Box className={classes.infoField}>
          <Box className={classes.fieldLabel}>
            <Typography variant="subtitle2">{t('responseActions.status')}</Typography>
          </Box>
          <DeviceStatus compliant={isCompliant(complianceInfo.complianceList)} useTransObj={useTransObj} classes={classes} />
        </Box>
        <Box className={classes.infoField}>
          <Box className={classes.fieldLabel}>
            <Typography variant="subtitle2">{t('responseActions.policy')}</Typography>
          </Box>
          <Box>
            <Typography variant="body2">{complianceInfo.policyName}</Typography>
          </Box>
        </Box>
      </Box>
      <DeviceStatusInfo compliant={isCompliant(complianceInfo.complianceList)} useTransObj={useTransObj} />
      <br />
      {isCompliant(complianceInfo.complianceList) ? '' : <ComplianceThreatTable complianceList={complianceInfo.complianceList} />}
    </Box>
  )
}

export default MtdResponseActions
