import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import { useEventHandler, usePrevious } from '@ues-behaviour/react'
import { uniqueValues } from '@ues-bis/shared'
import { IpAddressScore, RiskIcon } from '@ues-bis/standalone-shared'
import { RiskFactorId, RiskReduction } from '@ues-data/bis/model'
import { BasicBolt } from '@ues/assets'

import { RISK_REDUCTION } from '../../../config/consts/dialogIds'
import { Context as SettingsContext } from '../../../providers/RiskEngineSettingsProvider'
import { Alert, Icon, RiskLevel, useClientParams } from '../../../shared'
import Action from './Action'
import ActionsMenu from './ActionsMenu'
import styles from './Common.module.less'
import customStyles from './IdentityAndBehavior.module.less'
import IpAddressRiskFactor from './IpAddressRiskFactor'
import RiskFactors from './RiskFactors'
import RiskReductionModal from './RiskReductionModal'
import { DefaultFixUp, DefaultIpAddressPolicy } from './static/Defaults'

const defaultLevels = [RiskLevel.CRITICAL, RiskLevel.HIGH, RiskLevel.MEDIUM, RiskLevel.LOW]
const minLevelDescriptions = {
  [RiskReduction.CRITICAL]: RiskLevel.label.CRITICAL,
  [RiskReduction.HIGH]: 'policies.details.riskReductionHighMin',
  [RiskReduction.MEDIUM]: 'policies.details.riskReductionMediumMin',
}

const identityActionsAccessor = level => policyData => {
  if (!policyData.identityPolicy.riskLevelActions) {
    policyData.identityPolicy.riskLevelActions = []
  }
  const setting = policyData.identityPolicy.riskLevelActions.find(setting => setting.level === level)
  if (!setting) {
    const newSetting = { level, actions: [] }
    policyData.identityPolicy.riskLevelActions = [...policyData.identityPolicy.riskLevelActions, newSetting]
    return newSetting.actions
  }
  if (!setting.actions) {
    setting.actions = []
  }
  return setting.actions
}

const BehavioralIndicator = memo(({ min, max, color }) => {
  const style = useMemo(
    () => ({
      left: `${min}%`,
      right: `${100 - max}%`,
      backgroundColor: color,
    }),
    [max, min, color],
  )
  return (
    <div className={customStyles.behavioralIndicatorBackground}>
      <div className={customStyles.behavioralIndicator} style={style} />
    </div>
  )
})

const createRiskFactorIndicatorComponent = (id, titleLocalizationKey) =>
  memo(
    ({ color, range: { min, max } = {}, enabled = true, t }) =>
      typeof min === 'number' &&
      typeof max === 'number' &&
      enabled && (
        <div className={styles.tableRiskFactorItem}>
          <div id={id}>{t(titleLocalizationKey)}</div>
          <BehavioralIndicator min={min} max={max} color={color} />
          <div aria-labelledby={id} className={styles.tableRiskFactorDescription}>
            {min}% - {max}% {t('risk.common.riskScore')}
          </div>
        </div>
      ),
  )

const LearnedBehaviorRiskFactor = createRiskFactorIndicatorComponent(
  'behavioral-pattern-label',
  'policies.details.behavioralPattern',
)

const AppAnomalyRiskFactor = createRiskFactorIndicatorComponent('app-anomaly-label', 'risk.common.appAnomaly')

const NetworkAnomalyRiskFactor = createRiskFactorIndicatorComponent('network-anomaly-label', 'risk.common.networkAnomaly')

const DefaultPolicy = memo(
  ({
    level,
    settings,
    factors,
    actions = [],
    t,
    addAction,
    deleteAction,
    padding,
    canEdit,
    index,
    ipAddressPolicy,
    onIpAddressPolicyChange,
    appAnomalyDetectionFeatureEnabled,
    networkAnomalyDetectionFeatureEnabled,
    // eslint-disable-next-line sonarjs/cognitive-complexity
  }) => {
    const [style, labelClass] = useMemo(() => {
      const color = RiskLevel.color(level)
      return [{ color, borderLeftColor: color }, styles[`${level.toLowerCase()}Label`]]
    }, [level])
    const enableBehavior = useMemo(
      () => settings.behavioral && settings.behavioral.enabled && factors.indexOf(RiskFactorId.Behavioral) !== -1,
      [factors, settings.behavioral],
    )
    const enableIp = useMemo(
      () => settings.ipAddress && settings.ipAddress.enabled && factors.indexOf(RiskFactorId.IpAddress) !== -1,
      [factors, settings.ipAddress],
    )
    const enableAppAnomaly = useMemo(
      () =>
        settings.appAnomalyDetection &&
        settings.appAnomalyDetection.enabled &&
        factors.indexOf(RiskFactorId.AppAnomalyDetection) !== -1,
      [factors, settings.appAnomalyDetection],
    )
    const enableNetworkAnomaly = useMemo(
      () =>
        networkAnomalyDetectionFeatureEnabled &&
        settings.networkAnomalyDetection?.enabled === true &&
        factors.indexOf(RiskFactorId.NetworkAnomalyDetection) !== -1,
      [networkAnomalyDetectionFeatureEnabled, factors, settings.networkAnomalyDetection],
    )

    const onAddAction = useCallback(
      action => {
        addAction(action, identityActionsAccessor(level))
      },
      [addAction, level],
    )
    const behaviorRange = useMemo(() => {
      const riskLevels = (settings.behavioral && settings.behavioral.riskLevels) || []
      const foundLevel = riskLevels.find(riskLevel => riskLevel.level === level)
      return foundLevel ? foundLevel.range : {}
    }, [level, settings.behavioral])

    const ipRiskLevels = useMemo(() => IpAddressScore.ipRiskLevels(settings.ipAddress)[level] ?? [], [level, settings.ipAddress])

    const appAnomalyRange = useMemo(() => {
      const appAnomaly = settings.appAnomalyDetection
      const foundLevel = appAnomaly.riskLevel === level
      return foundLevel ? appAnomaly.range : {}
    }, [level, settings])

    const networkAnomalyRange = useMemo(() => {
      const networkAnomaly = settings?.networkAnomalyDetection
      return networkAnomaly?.riskLevel === level ? networkAnomaly?.range : {}
    }, [level, settings])

    const [factorCellName, actionCellName] = useMemo(() => {
      if (padding === 'none') return [styles.tableRiskFactorsCell, styles.tableActionsCell]
      if (padding === 'top') {
        return [cn(styles.tableRiskFactorsCell, styles.paddingTop), cn(styles.tableActionsCell, styles.paddingTop)]
      }
      if (padding === 'bottom') {
        return [cn(styles.tableRiskFactorsCell, styles.paddingBottom), cn(styles.tableActionsCell, styles.paddingBottom)]
      }
    }, [padding])

    const showActions = level !== RiskLevel.CRITICAL || (level === RiskLevel.CRITICAL && appAnomalyDetectionFeatureEnabled)

    const levelRiskFactors = useMemo(() => {
      const behaviorFactor =
        enableBehavior && showActions ? (
          <LearnedBehaviorRiskFactor range={behaviorRange} color={style.color} t={t} enabled={level !== RiskLevel.CRITICAL} />
        ) : null

      const alert =
        !showActions && !appAnomalyDetectionFeatureEnabled ? (
          <Alert severity="info">{t('policies.details.identityRiskFactorsNotSupportedAlert')}</Alert>
        ) : null

      const ipFactor =
        enableIp && ipRiskLevels.length ? (
          <IpAddressRiskFactor
            ipRiskLevels={ipRiskLevels}
            policy={ipAddressPolicy}
            canEdit={canEdit}
            onPolicyChange={onIpAddressPolicyChange}
          />
        ) : null

      const appAnomalyFactor = enableAppAnomaly ? <AppAnomalyRiskFactor range={appAnomalyRange} color={style.color} t={t} /> : null

      const networkAnomalyFactor = enableNetworkAnomaly ? (
        <NetworkAnomalyRiskFactor range={networkAnomalyRange} color={style.color} t={t} />
      ) : null

      return (
        <>
          {alert}
          {behaviorFactor}
          {ipFactor}
          {appAnomalyFactor}
          {networkAnomalyFactor}
        </>
      )
    }, [
      enableBehavior,
      showActions,
      behaviorRange,
      style.color,
      t,
      level,
      enableIp,
      ipRiskLevels,
      ipAddressPolicy,
      canEdit,
      onIpAddressPolicyChange,
      enableAppAnomaly,
      appAnomalyRange,
      enableNetworkAnomaly,
      networkAnomalyRange,
      appAnomalyDetectionFeatureEnabled,
    ])

    return (
      <tr aria-rowindex={index} className={styles.tableRow}>
        <td aria-colindex="1" style={style} className={styles.tableRiskLevelCell}>
          <div className={styles.tableRiskLevelItem}>
            <RiskIcon size="title" level={level} />
            <span className={labelClass}>{t(`risk.level.${level}`)}</span>
          </div>
        </td>
        <td aria-colindex="2" className={factorCellName} colSpan={!showActions ? '2' : null}>
          <div className={styles.tableRiskFactors}>{levelRiskFactors}</div>
        </td>
        {showActions && (
          <td aria-colindex="3" className={actionCellName}>
            <div className={styles.tableActions}>
              {actions.map((action, idx) => (
                <Action
                  key={idx}
                  t={t}
                  {...action}
                  deleteAction={() => deleteAction(identityActionsAccessor(level), idx)}
                  canEdit={canEdit}
                />
              ))}
              <ActionsMenu
                addAction={onAddAction}
                level={level}
                actions={actions}
                areBlockRequestingActionsVisible={level === RiskLevel.CRITICAL || level === RiskLevel.HIGH}
                areMdmDeviceActionsVisible={level === RiskLevel.CRITICAL || level === RiskLevel.HIGH}
                canEdit={canEdit && showActions}
              />
            </div>
          </td>
        )}
      </tr>
    )
  },
)

DefaultPolicy.propTypes = {
  level: PropTypes.string.isRequired,
  factors: PropTypes.array,
  actions: PropTypes.array,
  t: PropTypes.func.isRequired,
  settings: PropTypes.object,
  addAction: PropTypes.func,
  deleteAction: PropTypes.func,
  padding: PropTypes.string,
  canEdit: PropTypes.bool,
  index: PropTypes.number,
  onIpAddressPolicyChange: PropTypes.func,
  ipAddressPolicy: PropTypes.object.isRequired,
  appAnomalyDetectionFeatureEnabled: PropTypes.bool,
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
const IdentityAndBehavior = memo(({ policyData, onAddActionClick, onDeleteActionClick, onFactorChange, onDataChange, canEdit }) => {
  const { t } = useTranslation()
  const { data: settings } = useContext(SettingsContext)
  const {
    features: { AppAnomalyDetection: AppAnomalyDetectionFeature, NetworkAnomalyDetection: NetworkAnomalyDetectionFeature } = {},
  } = useClientParams()
  const enabledRiskFactors = policyData?.identityPolicy?.riskFactors.filter(riskFactor => settings[riskFactor]?.enabled)
  const riskFactors = useMemo(() => enabledRiskFactors || [], [enabledRiskFactors])
  const fixUp = useMemo(() => policyData?.identityPolicy?.fixUp || DefaultFixUp, [policyData?.identityPolicy?.fixUp])
  const ipAddressPolicy = useMemo(
    () => ({
      ...DefaultIpAddressPolicy,
      ...(policyData?.identityPolicy?.ipAddressPolicy ?? {}),
    }),
    [policyData?.identityPolicy?.ipAddressPolicy],
  )

  const riskLevels = useMemo(() => {
    const behavioralRiskLevels = riskFactors.includes(RiskFactorId.Behavioral)
      ? settings.behavioral?.riskLevels?.map(({ level }) => level)
      : []
    const ipRiskLevels = riskFactors.includes(RiskFactorId.IpAddress)
      ? Object.keys(IpAddressScore.ipRiskLevels(settings.ipAddress))
      : []
    const appAnomalyRiskLevel = riskFactors.includes(RiskFactorId.AppAnomalyDetection) && settings.appAnomalyDetection?.riskLevel
    const networkAnomalyRiskLevel =
      riskFactors.includes(RiskFactorId.NetworkAnomalyDetection) && settings.networkAnomalyDetection?.riskLevel

    const riskLevels = uniqueValues([...behavioralRiskLevels, ...ipRiskLevels])
    if (appAnomalyRiskLevel && !riskLevels.includes(appAnomalyRiskLevel)) {
      riskLevels.push(appAnomalyRiskLevel)
    }
    if (networkAnomalyRiskLevel && !riskLevels.includes(networkAnomalyRiskLevel)) {
      riskLevels.push(networkAnomalyRiskLevel)
    }
    riskLevels.sort(RiskLevel.compare)
    return riskLevels
  }, [
    riskFactors,
    settings.appAnomalyDetection?.riskLevel,
    settings.networkAnomalyDetection?.riskLevel,
    settings.behavioral?.riskLevels,
    settings.ipAddress,
  ])

  const [riskReductionDialog, setRiskReductionDialog] = useState({})
  const openRiskReductionDialog = useEventHandler(() => setRiskReductionDialog({ dialogId: RISK_REDUCTION }), [])
  const closeRiskReductionDialog = useCallback(() => setRiskReductionDialog({}), [])

  const riskReductionValue = getRiskReductionValue(riskLevels, fixUp)
  const prevRiskReductionValue = usePrevious(riskReductionValue)
  const onRiskReductionApply = useCallback(
    (value, insideModal = true) => {
      if (riskReductionValue !== value || !insideModal) {
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
      insideModal && closeRiskReductionDialog()
    },
    [closeRiskReductionDialog, fixUp, onDataChange, policyData, riskReductionValue],
  )
  useEffect(() => {
    if (prevRiskReductionValue !== riskReductionValue) return onRiskReductionApply(riskReductionValue, false)
  }, [onRiskReductionApply, prevRiskReductionValue, riskReductionValue])

  const onIpAddressPolicyChange = useCallback(
    ipAddressPolicy => {
      onDataChange({
        ...policyData,
        identityPolicy: {
          ...policyData.identityPolicy,
          ipAddressPolicy,
        },
      })
    },
    [onDataChange, policyData],
  )

  const inputActions = policyData && policyData.identityPolicy && policyData.identityPolicy.riskLevelActions
  const levelActions = useMemo(() => {
    const riskLevelActions = inputActions || []
    return riskLevelActions.reduce((acc, setting) => {
      acc[setting.level] = setting.actions
      return acc
    }, {})
  }, [inputActions])

  const factors = useMemo(() => {
    const factors = []
    if (settings.behavioral && settings.behavioral.enabled) {
      factors.push({
        id: RiskFactorId.Behavioral,
        title: t('risk.common.behavioralPatternRisk'),
        checked: riskFactors.indexOf(RiskFactorId.Behavioral) !== -1,
      })
    }
    if (settings.ipAddress && settings.ipAddress.enabled) {
      factors.push({
        id: RiskFactorId.IpAddress,
        title: t('policies.details.ipAddressRisk'),
        checked: riskFactors.indexOf(RiskFactorId.IpAddress) !== -1,
      })
    }
    if (AppAnomalyDetectionFeature && settings.appAnomalyDetection && settings.appAnomalyDetection.enabled) {
      factors.push({
        id: RiskFactorId.AppAnomalyDetection,
        title: t('risk.common.continuousAuthAppAnomalyRisk'),
        checked: riskFactors.indexOf(RiskFactorId.AppAnomalyDetection) !== -1,
      })
    }
    if (NetworkAnomalyDetectionFeature && settings.networkAnomalyDetection?.enabled === true) {
      factors.push({
        id: RiskFactorId.NetworkAnomalyDetection,
        title: t('risk.common.continuousAuthNetworkAnomalyRisk'),
        checked: riskFactors.indexOf(RiskFactorId.NetworkAnomalyDetection) !== -1,
      })
    }

    return factors
  }, [
    settings.behavioral,
    settings.ipAddress,
    settings.appAnomalyDetection,
    AppAnomalyDetectionFeature,
    settings.networkAnomalyDetection,
    NetworkAnomalyDetectionFeature,
    t,
    riskFactors,
  ])

  const riskReductionCell = useMemo(
    () => (
      <tr>
        <td className={styles.riskReductionCell} />
        <td className={styles.riskReductionCell} colSpan={2}>
          <button className={styles.riskReduction} tabIndex="-1" onClick={openRiskReductionDialog} disabled={!canEdit}>
            <Icon icon={BasicBolt} />
            <span className={styles.riskReductionText}>
              {t('policies.details.allowAutoRiskReduction', {
                minLevelDesc: t(minLevelDescriptions[riskReductionValue]) || '',
              })}
            </span>
          </button>
        </td>
      </tr>
    ),
    [canEdit, openRiskReductionDialog, riskReductionValue, t],
  )

  const renderSettings = useCallback(
    location => {
      return defaultLevels.map((level, index) => {
        let padding = 'none'
        let renderReductionCell = false
        const renderPolicy = riskLevels.some(riskLevel => riskLevel === level)
        if (index === location - 1) {
          padding = 'bottom'
        } else if (index === location) {
          padding = 'top'
          renderReductionCell = true
        }

        return (
          <React.Fragment key={level}>
            {renderReductionCell && riskReductionCell}
            {renderPolicy && (
              <DefaultPolicy
                key={level}
                t={t}
                level={level}
                factors={riskFactors}
                settings={settings}
                actions={levelActions[level]}
                addAction={onAddActionClick}
                deleteAction={onDeleteActionClick}
                padding={padding}
                canEdit={canEdit}
                index={index}
                ipAddressPolicy={ipAddressPolicy}
                onIpAddressPolicyChange={onIpAddressPolicyChange}
                appAnomalyDetectionFeatureEnabled={AppAnomalyDetectionFeature}
                networkAnomalyDetectionFeatureEnabled={NetworkAnomalyDetectionFeature}
              />
            )}
          </React.Fragment>
        )
      })
    },
    [
      riskLevels,
      riskReductionCell,
      t,
      riskFactors,
      settings,
      levelActions,
      onAddActionClick,
      onDeleteActionClick,
      canEdit,
      ipAddressPolicy,
      onIpAddressPolicyChange,
      AppAnomalyDetectionFeature,
      NetworkAnomalyDetectionFeature,
    ],
  )

  const levelSettings = useMemo(() => {
    switch (riskReductionValue) {
      case RiskReduction.MEDIUM:
        return <tbody>{renderSettings(3)}</tbody>
      case RiskReduction.HIGH:
        return <tbody>{renderSettings(2)}</tbody>
      case RiskReduction.CRITICAL:
        return <tbody>{renderSettings(1)}</tbody>
      case RiskReduction.NONE:
      default:
        return <tbody>{renderSettings(-1)}</tbody>
    }
  }, [renderSettings, riskReductionValue])

  return (
    <div className={styles.tableBox}>
      <Typography variant="body1">
        <span
          className={cn(customStyles.riskReductionLink, (!canEdit || riskFactors.length === 0) && customStyles.hidden)}
          role="button"
          tabIndex="-1"
          onClick={openRiskReductionDialog}
        >
          {t('common.automaticRiskReduction')}
        </span>
      </Typography>

      <RiskFactors className={styles.factors} riskFactors={factors} onChange={onFactorChange} canEdit={canEdit} />
      {riskFactors.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr className={styles.header}>
              <th className={styles.headerCell}>{t('common.riskLevel')}</th>
              <th className={styles.headerCell}>{t('risk.common.riskFactors')}</th>
              <th className={styles.headerCell}>{t('risk.common.assignedActions')}</th>
            </tr>
          </thead>
          {levelSettings}
        </table>
      ) : null}
      <RiskReductionModal
        dialogId={riskReductionDialog.dialogId}
        value={riskReductionValue}
        onClose={closeRiskReductionDialog}
        onApply={onRiskReductionApply}
        riskLevels={riskLevels}
      />
    </div>
  )
})

IdentityAndBehavior.propTypes = {
  policyData: PropTypes.object,
  onAddActionClick: PropTypes.func.isRequired,
  onDeleteActionClick: PropTypes.func.isRequired,
  onFactorChange: PropTypes.func.isRequired,
  onDataChange: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
}

export default IdentityAndBehavior
