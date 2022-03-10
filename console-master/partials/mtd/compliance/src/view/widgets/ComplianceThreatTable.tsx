/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Tooltip, Typography } from '@material-ui/core'
import LinearProgress from '@material-ui/core/LinearProgress'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import type { ComplianceType, Notifications } from '@ues-data/mtd'
import { BasicInfo, I18nFormats } from '@ues/assets'

export interface ComplianceThreatTableProps {
  complianceList: ComplianceType[]
}

const formatDateTime = (i18n, datetime) => {
  return i18n.format(datetime, I18nFormats.DateTime)
}

const useStyles = makeStyles(theme => ({
  progressBarDiv: {
    width: '100%',
    height: '16px',
  },
  smallIcon: {
    fontSize: '1.25rem',
  },
  tableRow: {
    verticalAlign: 'top',
  },
  paddingWithoutIcon: {
    paddingTop: theme.spacing(2),
  },
  tooltipIcon: {
    fontSize: '1.25rem',
    marginLeft: theme.spacing(3),
  },
}))

export const ComplianceThreatTable: React.FC<ComplianceThreatTableProps> = memo(props => {
  const { t, i18n } = useTranslation(['mtd/common'])
  const { complianceList } = props
  const classes = useStyles()

  const notificationSection = (notificationInfo: Notifications) => {
    const notificationPercentage = notificationInfo ? (notificationInfo.sentCount * 100.0) / notificationInfo.totalCount : 0.0

    return !notificationInfo ? (
      <Typography variant="caption">{t('responseActions.threatCompliance.notification.notConfigured')}</Typography>
    ) : (
      <>
        <LinearProgress color="secondary" value={notificationPercentage} variant="determinate" className={classes.progressBarDiv} />
        <Typography variant="caption">
          {t('responseActions.threatCompliance.notification.sentOfTotalWithSentDate', {
            sentCount: notificationInfo.sentCount,
            totalCount: notificationInfo.totalCount,
            sentDateTime: formatDateTime(i18n, notificationInfo.lastSentTime),
          })}
        </Typography>
      </>
    )
  }

  const nextNotificationSection = (notificationInfo: Notifications) => {
    return !notificationInfo || notificationInfo.sentCount >= notificationInfo.totalCount ? (
      ''
    ) : (
      <Box display="flex" alignItems="center">
        <Typography variant="caption">
          {t('responseActions.threatCompliance.notification.nextSentDateTime', {
            nextSentDateTime: formatDateTime(i18n, notificationInfo.nextSentTime),
          })}
        </Typography>
      </Box>
    )
  }
  const hasThreatsDetails = (complianceType: ComplianceType) => {
    return complianceType.threats.find(aThreat => aThreat.eventValues && aThreat.eventValues.length > 0)
  }

  const nonComplianceExtraInfoSectionSection = (complianceType: ComplianceType) => {
    // in the case of threat type of insecured wifi, when there is no threat details, this means end user
    // disabled the wifi feature (example did not give permission to allow wifi scanning..)
    const isThreatFeatureDisabled = complianceType.threatType === 'insecureWiFi' && !hasThreatsDetails(complianceType)
    return isThreatFeatureDisabled ? <>{t('responseActions.threatCompliance.insecureWiFiFeatureDisabled')} &nbsp;</> : ''
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className={classes.tableRow}>
            <TableCell variant="head" width="25%">
              <Box>
                {t('responseActions.threatCompliance.tableHeaders.detection')}
                <span className={classes.tooltipIcon} />
              </Box>
            </TableCell>
            <TableCell variant="head" width="25%">
              <Box display="flex" alignItems="center">
                {t('responseActions.threatCompliance.tableHeaders.notificationForViolation')}
                <Tooltip
                  title={t('responseActions.threatCompliance.tableHeaders.notificationForViolationTooltip')}
                  placement="top"
                  enterDelay={600}
                >
                  <span className={classes.tooltipIcon}>
                    <BasicInfo />
                  </span>
                </Tooltip>
              </Box>
            </TableCell>
            <TableCell variant="head" width="25%"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {complianceList.map(complianceType => (
            <TableRow key={complianceType.threatType} className={classes.tableRow}>
              <TableCell>
                {t('threats.' + complianceType.threatType)}&nbsp;
                {nonComplianceExtraInfoSectionSection(complianceType)}
                {complianceType.threats.length > 1 ? '(' + complianceType.threats.length + ')' : ''}
              </TableCell>
              <TableCell>{notificationSection(complianceType.notifications)}</TableCell>
              <TableCell>{nextNotificationSection(complianceType.notifications)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
})
