import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Grid, IconButton, makeStyles, Paper, Popover, Typography, useTheme } from '@material-ui/core'

import { IconListWithValues } from '@ues-behaviour/dashboard'
import { useDetectionLabelFn } from '@ues-bis/risk-detection-policies'
import { getColorByRiskLevel, RiskLevelChip } from '@ues-bis/shared'
import { DeviceAssessmentQuery, useBISPolicySchema } from '@ues-data/bis'
import { FeatureName, RiskLevel, useErrorCallback, useFeatures, useStatefulApolloQuery } from '@ues-data/shared'
import { ActorDetectionType } from '@ues-data/shared-types'
import { BasicHelpOutline, I18nFormats, StatusHigh, StatusLow, StatusMedium, StatusProtect, StatusUnknown } from '@ues/assets'
import { usePopover, useSnackbar } from '@ues/behaviours'

export interface DeviceRiskAssessmentProps {
  userId: string
  deviceId: string
}

interface DeviceRiskProps {
  riskEntry: {
    policyName: string
    riskLevel: RiskLevel
    deviceId: string
    detectionTime: number
    detections: { name: ActorDetectionType; level: RiskLevel }[]
  }
}

const useStyles = makeStyles(theme => ({
  spacer: {
    paddingTop: theme.spacing(3), // 12px
  },
  riskDetailsIconButton: {
    padding: `${theme.spacing(2)}px`,
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.spacing(4)}px`, // 16px
    width: '320px',
  },
}))

const formatDateTime = (i18n, datetime) => {
  return i18n.format(datetime, I18nFormats.DateTimeUTC)
}

const mapActorDetectionTypeToDetectionType = actorDetectionType => {
  return Object.values(ActorDetectionType).find(e => e.toString() === actorDetectionType.toString())
}

const DeviceRiskDetails: React.FC<DeviceRiskProps> = memo(({ riskEntry }) => {
  const theme = useTheme()
  const translateLabel = useDetectionLabelFn()
  const { t, i18n } = useTranslation(['bis/ues', 'bis/shared'])

  const getIcon = useCallback(
    item => {
      const { level } = item
      const color = getColorByRiskLevel(level, theme)
      let icon
      switch (level) {
        case RiskLevel.High:
          icon = StatusHigh
          break
        case RiskLevel.Medium:
          icon = StatusMedium
          break
        case RiskLevel.Low:
          icon = StatusLow
          break
        case RiskLevel.Secured:
          icon = StatusProtect
          break
        default:
          icon = StatusUnknown
          break
      }
      return { icon, color }
    },
    [theme],
  )

  const items = useMemo(
    () =>
      (riskEntry?.detections ?? []).map(item => {
        const { icon, color } = getIcon(item)
        return {
          icon,
          label: translateLabel(mapActorDetectionTypeToDetectionType(item.name)),
          count: null,
          color,
          interactionLink: null,
        }
      }),
    [riskEntry, getIcon, translateLabel],
  )

  return (
    <>
      <IconListWithValues data={items} />
      <Typography variant="caption">{formatDateTime(i18n, riskEntry.detectionTime)}</Typography>
      <Typography variant="caption">
        <br />
        {t('bis/ues:deviceRiskAssessment.appliedRiskPolicy', {
          riskPolicyName: riskEntry.policyName,
        })}
      </Typography>
    </>
  )
})

const DeviceRiskLabel: React.FC<DeviceRiskProps> = memo(({ riskEntry }) => {
  const classes = useStyles()
  const { t } = useTranslation(['bis/shared', 'bis/ues'])
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  return (
    <div className={classes.spacer}>
      <Grid direction="row" justifyContent="center" alignItems="center" spacing={0} container>
        <Grid item xs={1}></Grid>
        <Grid item xs="auto">
          <Box display="flex">
            <RiskLevelChip riskLevel={riskEntry.riskLevel} t={t} />
          </Box>
        </Grid>
        <Grid item xs={1}>
          <IconButton
            aria-label={t('bis/ues:deviceRiskAssessment.deviceRiskDetails')}
            className={classes.riskDetailsIconButton}
            onClick={handlePopoverClick}
          >
            <BasicHelpOutline style={{ fontSize: 'medium' }} />
          </IconButton>
        </Grid>
      </Grid>
      <React.Suspense fallback={null}>
        <Popover
          open={popoverIsOpen}
          anchorEl={popoverAnchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Paper className={classes.paper}>
            <DeviceRiskDetails riskEntry={riskEntry} />
          </Paper>
        </Popover>
      </React.Suspense>
    </div>
  )
})

const DeviceRiskAssessment: React.FC<DeviceRiskAssessmentProps> = ({ userId, deviceId }) => {
  const { isEnabled } = useFeatures()
  const { isMigratedToDP } = useBISPolicySchema()
  const actorDPEnabled = isEnabled(FeatureName.UESActionOrchestrator)
  const { enqueueMessage } = useSnackbar()
  const { t } = useTranslation(['bis/ues'])
  const { loading, error: fetchError, data } = useStatefulApolloQuery(DeviceAssessmentQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { userId: userId && atob(userId), deviceId: [deviceId] },
    skip: !(actorDPEnabled && isMigratedToDP),
  })
  useErrorCallback(fetchError, () => enqueueMessage(t('bis/ues:deviceRiskAssessment.error.fetch'), 'error'))

  return !loading && data?.deviceAssessment?.items?.length > 0 ? (
    <DeviceRiskLabel riskEntry={data.deviceAssessment.items[0]} />
  ) : (
    <div></div>
  )
}

export default DeviceRiskAssessment
