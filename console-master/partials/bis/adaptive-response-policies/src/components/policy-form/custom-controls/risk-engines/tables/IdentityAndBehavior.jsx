import PropTypes from 'prop-types'
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Box,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  withStyles,
} from '@material-ui/core'

import { usePrevious } from '@ues-behaviour/react'
import { DefaultFixUp, Dropdown, getRiskLevelColor, RiskChip } from '@ues-bis/shared'
import { ActionType, RiskFactorId, RiskLevelTypes, RiskReduction } from '@ues-data/bis/model'
import { FeatureName, useFeatures } from '@ues-data/shared'
import { BasicAddRound } from '@ues/assets'

import { useSettings } from '../../../../../hooks/use-settings'
import { getIdByAction, identityActionsAccessor } from '../../../../../utils'
import Action from './Action'
import RiskReductionSwitch from './RiskReductionSwitch'
import { useStyles } from './styles'

const StyledTableCell = withStyles(() => ({
  body: {
    border: 'none',
    verticalAlign: 'baseline',
  },
}))(TableCell)

const actionCellStyle = {
  paddingTop: '0',
  paddingBottom: '0',
}

const defaultLevels = [RiskLevelTypes.CRITICAL, RiskLevelTypes.HIGH, RiskLevelTypes.MEDIUM, RiskLevelTypes.LOW]

const BehavioralIndicator = memo(({ min, max, color, styles }) => {
  const style = useMemo(
    () => ({
      left: `${min}%`,
      right: `${100 - max}%`,
      backgroundColor: color,
    }),
    [max, min, color],
  )
  return (
    <div className={styles.behavioralIndicatorBackground}>
      <div className={styles.behavioralIndicator} style={style} />
    </div>
  )
})

const createRiskFactorIndicatorComponent = (id, titleLocalizationKey) =>
  memo(
    ({ color, range: { min, max } = {}, enabled = true, t, styles }) =>
      enabled &&
      (typeof min === 'number' && typeof max === 'number' ? (
        <div className={styles.tableRiskFactorItem}>
          <Typography id={id} variant="body2">
            {t(titleLocalizationKey)}
          </Typography>
          <BehavioralIndicator min={min} max={max} color={color} styles={styles} />
          <Typography component="div" variant="body2" aria-labelledby={id}>
            {min}% - {max}% {t('bis/shared:common.risk')}
          </Typography>
        </div>
      ) : (
        <Typography id={id} variant="body2">
          {t(titleLocalizationKey)}
        </Typography>
      )),
  )

const NetworkAnomalyRiskFactor = createRiskFactorIndicatorComponent(
  'network-anomaly-label',
  'bis/shared:risk.common.networkAnomaly',
)

const DefaultPolicy = memo(
  ({
    level,
    settings,
    factors,
    actions = [],
    t,
    actionState,
    deleteAction,
    canEdit,
    index,
    networkAnomalyDetectionFeatureEnabled,
    // eslint-disable-next-line sonarjs/cognitive-complexity
  }) => {
    const theme = useTheme()
    const color = getRiskLevelColor(level, theme)

    const stylesProps = { color }
    const styles = useStyles(stylesProps)

    const enableNetworkAnomaly = useMemo(
      () =>
        networkAnomalyDetectionFeatureEnabled &&
        settings?.networkAnomalyDetection?.enabled === true &&
        factors.indexOf(RiskFactorId.NetworkAnomalyDetection) !== -1,
      [networkAnomalyDetectionFeatureEnabled, factors, settings?.networkAnomalyDetection],
    )

    // const showActions = level !== RiskLevelTypes.CRITICAL
    const showActions = true

    const levelRiskFactors = useMemo(() => {
      return enableNetworkAnomaly ? <NetworkAnomalyRiskFactor t={t} styles={styles} /> : null
    }, [t, styles, enableNetworkAnomaly])

    const Actions = useMemo(
      () =>
        showActions
          ? actions.map((action, idx) => {
              const actionId = getIdByAction(level, action)
              return (
                <Action
                  key={actionId}
                  canEdit={canEdit}
                  actionType={action.actionType}
                  actionAttributes={action.actionAttributes}
                  actionError={actionState.actionsError[actionId]}
                  onDelete={() => deleteAction(identityActionsAccessor(level), idx)}
                  networkAccessOptions={actionState.networkAccessOptions}
                  className={styles.actionChip}
                />
              )
            })
          : [],
      [actionState.actionsError, actionState.networkAccessOptions, actions, canEdit, deleteAction, level, showActions, styles],
    )

    const openActionsDialog = useCallback(() => {
      actionState.handleOpenDialog(level)
    }, [actionState, level])

    const addActionDisabled = useMemo(
      () => actions.some(action => action.actionType === ActionType.OverrideNetworkAccessControlPolicy),
      [actions],
    )

    return (
      <TableRow>
        <StyledTableCell>
          <RiskChip riskLevel={level} t={t} />
        </StyledTableCell>
        <StyledTableCell colSpan={!showActions ? '2' : null}>
          <div className={styles.tableRiskFactors}>{levelRiskFactors}</div>
        </StyledTableCell>
        {showActions && (
          <StyledTableCell style={actionCellStyle}>
            {Actions}
            {canEdit && !addActionDisabled && (
              <Dropdown
                options={<MenuItem onClick={openActionsDialog}>{t('bis/ues:actions.options.networkAccessPolicy')}</MenuItem>}
                trigger={
                  <Box className={styles.addActionContainer}>
                    <IconButton size="small" onClick={actionState.popover.handlePopoverClick}>
                      <BasicAddRound />
                    </IconButton>
                  </Box>
                }
                popover={actionState.popover}
              />
            )}
          </StyledTableCell>
        )}
      </TableRow>
    )
  },
)

DefaultPolicy.propTypes = {
  level: PropTypes.string.isRequired,
  factors: PropTypes.array,
  actions: PropTypes.array,
  t: PropTypes.func.isRequired,
  settings: PropTypes.object,
  actionState: PropTypes.object,
  deleteAction: PropTypes.func,
  padding: PropTypes.string,
  canEdit: PropTypes.bool,
  index: PropTypes.number,
  networkAnomalyDetectionFeatureEnabled: PropTypes.bool,
}

const getRiskReductionValue = (sortedRiskLevels, fixUp) => {
  const riskReductionValue = (fixUp.enabled && fixUp.minimumBehavioralRiskLevel) || RiskReduction.NONE
  if (
    riskReductionValue !== RiskReduction.NONE &&
    !sortedRiskLevels.some(riskLevel => riskLevel === riskReductionValue) &&
    sortedRiskLevels.length
  ) {
    return sortedRiskLevels[0]
  }
  return riskReductionValue
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const IdentityAndBehaviorRisk = memo(
  ({ policyData, actionState, onDeleteActionClick, onDataChange, canEdit, riskLevels, riskFactors }) => {
    const { t } = useTranslation(['bis/ues', 'bis/shared', 'profiles', 'general/form']) // 'form' needs to be passed for now until useTranslation will be removed from 'Form' behaviour component as it causes app reload when dialog opens (because 'form' translation is being loaded)
    const [{ data: { riskEnginesSettings: settings } = {} }] = useSettings()

    const styles = useStyles()

    const NetworkAnomalyDetectionFeature = true
    const fixUp = useMemo(() => policyData?.identityPolicy?.fixUp || DefaultFixUp, [policyData?.identityPolicy?.fixUp])

    const features = useFeatures()
    const arrEnable = features.isEnabled(FeatureName.ARR)

    const riskReductionValue = getRiskReductionValue(riskLevels, fixUp)
    const prevRiskReductionValue = usePrevious(riskReductionValue)

    const onRiskReductionChange = useCallback(
      value => {
        if (riskReductionValue !== value) {
          const newFixUp =
            value === RiskReduction.NONE
              ? { ...fixUp, enabled: false }
              : { ...fixUp, enabled: true, minimumBehavioralRiskLevel: value }
          onDataChange({
            ...policyData,
            identityPolicy: {
              ...policyData.identityPolicy,
              fixUp: newFixUp,
            },
          })
        }
      },
      [fixUp, onDataChange, policyData, riskReductionValue],
    )

    useEffect(() => {
      if (prevRiskReductionValue !== riskReductionValue) return onRiskReductionChange(riskReductionValue)
    }, [onRiskReductionChange, prevRiskReductionValue, riskReductionValue])

    const inputActions = policyData && policyData.identityPolicy && policyData.identityPolicy.riskLevelActions
    const levelActions = useMemo(() => {
      const riskLevelActions = inputActions || []
      return riskLevelActions.reduce((acc, setting) => {
        acc[setting.level] = setting.actions
        return acc
      }, {})
    }, [inputActions])

    const renderSettings = useCallback(
      location => {
        return defaultLevels.map((level, index) => {
          let padding = 'none'
          const renderPolicy = riskLevels.some(riskLevel => riskLevel === level)
          if (index === location - 1) {
            padding = 'bottom'
          } else if (index === location) {
            padding = 'top'
          }
          return (
            <React.Fragment key={level}>
              {renderPolicy && (
                <DefaultPolicy
                  key={level}
                  t={t}
                  level={level}
                  factors={riskFactors}
                  settings={settings}
                  actions={levelActions[level]}
                  actionState={actionState}
                  deleteAction={onDeleteActionClick}
                  padding={padding}
                  canEdit={canEdit}
                  index={index}
                  networkAnomalyDetectionFeatureEnabled={NetworkAnomalyDetectionFeature}
                />
              )}
            </React.Fragment>
          )
        })
      },
      [
        t,
        riskLevels,
        riskFactors,
        settings,
        levelActions,
        actionState,
        onDeleteActionClick,
        canEdit,
        NetworkAnomalyDetectionFeature,
      ],
    )

    const levelSettings = useMemo(() => {
      switch (riskReductionValue) {
        case RiskReduction.MEDIUM:
          return renderSettings(3)
        case RiskReduction.HIGH:
          return renderSettings(2)
        case RiskReduction.CRITICAL:
          return renderSettings(1)
        case RiskReduction.NONE:
        default:
          return renderSettings(-1)
      }
    }, [renderSettings, riskReductionValue])

    return (
      <>
        {arrEnable && <RiskReductionSwitch checked={fixUp.enabled} onChange={onRiskReductionChange} readOnly={!canEdit} />}
        {riskFactors.length > 0 ? (
          <Paper elevation={0} className={styles.table}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>{t('policies.tableHeader.factor')}</StyledTableCell>
                    <StyledTableCell>{t('policies.tableHeader.detection')}</StyledTableCell>
                    <StyledTableCell>{t('policies.tableHeader.responseActions')}</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{levelSettings}</TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ) : null}
      </>
    )
  },
)

IdentityAndBehaviorRisk.propTypes = {
  policyData: PropTypes.object,
  actionState: PropTypes.object.isRequired,
  onDeleteActionClick: PropTypes.func.isRequired,
  onFactorChange: PropTypes.func.isRequired,
  onDataChange: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
  riskLevels: PropTypes.array.isRequired,
  riskFactors: PropTypes.array.isRequired,
}

export default IdentityAndBehaviorRisk
