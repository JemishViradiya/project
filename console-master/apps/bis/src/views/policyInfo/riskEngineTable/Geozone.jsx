import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import Tooltip from '@material-ui/core/Tooltip'

import { getRiskLevelColor } from '@ues-bis/shared'
import { RiskFactorId } from '@ues-data/bis/model'
import { BasicClose } from '@ues/assets'

import GeozoneIcon from '../../../components/icons/GeozoneIcon'
import GeozoneListProvider, { Context as GeozoneContext } from '../../../providers/GeozoneListProvider'
import { Context as SettingsContext } from '../../../providers/RiskEngineSettingsProvider'
import { IconButton, RiskLevel, useToggle } from '../../../shared'
import Action from './Action'
import ActionsMenu from './ActionsMenu'
import styles from './Common.module.less'
import GeozonePicker from './GeozonePicker'
import RiskFactors from './RiskFactors'

const geozoneDefaultActionsAccessor = level => policyData => {
  if (!policyData.geozonePolicy.defaultRiskLevelActions) {
    policyData.geozonePolicy.defaultRiskLevelActions = []
  }
  const setting = policyData.geozonePolicy.defaultRiskLevelActions.find(setting => setting.level === level)
  if (!setting) {
    const newSetting = { level, actions: [] }
    policyData.geozonePolicy.defaultRiskLevelActions.push(newSetting)
    return newSetting.actions
  }
  if (!setting.actions) {
    setting.actions = []
  }
  return setting.actions
}

const geozoneOverriddenActionsAccessor = (geozoneId, level) => policyData => {
  if (!policyData.geozonePolicy.overriddenRiskLevelActions) {
    policyData.geozonePolicy.overriddenRiskLevelActions = []
  }
  const setting = policyData.geozonePolicy.overriddenRiskLevelActions.find(setting => setting.geozoneId === geozoneId)
  if (!setting) {
    const newSetting = { geozoneId, level, actions: [] }
    policyData.geozonePolicy.overriddenRiskLevelActions.push(newSetting)
    return newSetting.actions
  }
  if (!setting.actions) {
    setting.actions = []
  }
  return setting.actions
}

const geozoneUndefinedActionsAccessor = policyData => {
  if (!policyData.geozonePolicy.defaultActions) {
    policyData.geozonePolicy.defaultActions = []
  }
  return policyData.geozonePolicy.defaultActions
}

const LearnedGeozoneRiskFactor = memo(({ level, distance, enabled = true, t }) => {
  let description
  switch (level) {
    case 'HIGH':
      description = t('policies.details.moreThanRadiusLearnedGeozone', distance)
      break
    case 'MEDIUM':
      description = t('policies.details.betweenRadiusLearnedGeozone', distance)
      break
    default:
      description = t('policies.details.withinRadiusLearnedGeozone', distance)
      break
  }
  return (
    <div className={styles.tableRiskFactorItem}>
      <div id="learned-geozone-label">{t('policies.details.learnedGeozone')}</div>
      <div aria-labelledby="learned-geozone-label" className={styles.tableRiskFactorDescription}>
        {description}
      </div>
    </div>
  )
})

const RiskLevelCell = memo(({ level, tag, t }) => {
  const [style, labelClass] = useMemo(() => {
    const color = getRiskLevelColor(level)
    return [{ color, borderLeftColor: color }, styles[`${level.toLowerCase()}Label`]]
  }, [level])
  return (
    <td style={style} className={styles.tableRiskLevelCell}>
      <div className={styles.tableRiskLevelItem}>
        <GeozoneIcon level={level} />
        <span className={labelClass}>{t(`risk.level.${level}`)}</span>
      </div>
      <div className={styles.tag}>{tag}</div>
    </td>
  )
})

const DefinedGeozoneRiskFactor = memo(({ level, t }) => {
  return (
    <div className={styles.tableRiskFactorItem}>
      <div id="defined-geozone-label">{t('policies.details.definedGeozone')}</div>
      <div aria-labelledby="defined-geozone-label" className={styles.tableRiskFactorDescription}>
        {t('policies.details.anyRiskLevelGeozone', { level: t(`risk.level.${level}`) })}
      </div>
    </div>
  )
})

const ActionForDefault = memo(({ action, level, idx, t, deleteAction, canEdit }) => {
  const onDeleteAction = useCallback(() => deleteAction(geozoneDefaultActionsAccessor(level), idx), [deleteAction, idx, level])
  return <Action key={idx} t={t} {...action} deleteAction={onDeleteAction} canEdit={canEdit} />
})

const DefaultPolicy = memo(({ level, factors, settings, actions = [], t, addAction, deleteAction, canEdit }) => {
  const enableDefined = useMemo(
    () => settings.definedGeozones && settings.definedGeozones.enabled && factors.indexOf(RiskFactorId.GeozoneDefined) !== -1,
    [factors, settings.definedGeozones],
  )
  const enableLearned = useMemo(
    () => settings.learnedGeozones && settings.learnedGeozones.enabled && factors.indexOf(RiskFactorId.GeozoneLearned) !== -1,
    [factors, settings.learnedGeozones],
  )
  const areBlockRequestingActionsVisible = useMemo(() => level === RiskLevel.HIGH, [level])
  const areMdmDeviceActionsVisible = useMemo(() => level === RiskLevel.HIGH, [level])
  const onAddAction = useCallback(
    action => {
      addAction(action, geozoneDefaultActionsAccessor(level))
    },
    [addAction, level],
  )

  return (
    <tr aria-label={t(`risk.geozone.default.${(level || 'UNKNOWN').toLowerCase()}`)} className={styles.tableRow}>
      <RiskLevelCell level={level} tag={t('policies.details.defaultGeozoneRisk')} t={t} />
      <td className={styles.tableRiskFactorsCell}>
        <div className={styles.tableRiskFactors}>
          {enableDefined ? <DefinedGeozoneRiskFactor level={level} t={t} /> : null}
          {enableLearned ? (
            <LearnedGeozoneRiskFactor
              level={level}
              t={t}
              distance={settings.learnedGeozones && settings.learnedGeozones.geozoneDistance}
            />
          ) : null}
        </div>
      </td>
      <td className={styles.tableActionsCell}>
        <div className={styles.tableActions}>
          {actions.map((action, idx) => (
            <ActionForDefault
              key={idx}
              t={t}
              idx={idx}
              action={action}
              level={level}
              deleteAction={deleteAction}
              canEdit={canEdit}
            />
          ))}
          <ActionsMenu
            addAction={onAddAction}
            actions={actions}
            areBlockRequestingActionsVisible={areBlockRequestingActionsVisible}
            areMdmDeviceActionsVisible={areMdmDeviceActionsVisible}
            canEdit={canEdit}
          />
        </div>
      </td>
    </tr>
  )
})

const UndefinedGeozoneRiskFactor = memo(({ t }) => (
  <div className={styles.tableRiskFactorItem}>
    <div id="undefined-geozone-label">{t('policies.details.undefinedGeozone')}</div>
    <div aria-labelledby="undefined-geozone-label" className={styles.tableRiskFactorDescription}>
      {t('policies.details.userInUndefinedGeozone')}
    </div>
  </div>
))

const ActionForOverridden = memo(({ action, accessor, idx, t, deleteAction, canEdit }) => {
  const onDeleteAction = useCallback(() => deleteAction(accessor, idx), [accessor, deleteAction, idx])
  return <Action key={idx} t={t} {...action} deleteAction={onDeleteAction} canEdit={canEdit} />
})

const isOverflowing = element => element && element.offsetHeight < element.scrollHeight

const OverriddenGeozoneRiskFactor = memo(({ geozoneId, t }) => {
  const { data } = useContext(GeozoneContext)
  const geozone = data.find(zone => zone.id === geozoneId) || { name: `${t('common.unknown')}: ${geozoneId}` }
  const textRef = useRef(null)
  const [disableTooltip, toggleTooltip] = useToggle(true)

  useEffect(() => {
    if (isOverflowing(textRef.current)) {
      toggleTooltip()
    }
  }, [geozone.name, toggleTooltip])

  return (
    <Tooltip disableHoverListener={disableTooltip} title={geozone.name} aria-label="geozone-name" interactive>
      <div className={styles.tableRiskFactorItem}>
        <div ref={textRef} className={styles.truncatedNameTwoLines}>
          {geozone.name}
        </div>
      </div>
    </Tooltip>
  )
})

const OverriddenGeozone = memo(
  ({ level, factors, geozoneId, actions = [], t, addAction, deleteAction, removeGeozone, canEdit, index }) => {
    const onRemoveGeozone = useCallback(() => removeGeozone(geozoneId), [geozoneId, removeGeozone])
    const areBlockRequestingActionsVisible = useMemo(() => factors.includes(RiskFactorId.GeozoneDefined), [factors])
    const areMdmDeviceActionsVisible = useMemo(() => factors.includes(RiskFactorId.GeozoneDefined), [factors])
    const accessor = useMemo(() => {
      return level === RiskLevel.UNKNOWN ? geozoneUndefinedActionsAccessor : geozoneOverriddenActionsAccessor(geozoneId, level)
    }, [geozoneId, level])

    const onAddAction = useCallback(
      action => {
        addAction(action, accessor)
      },
      [accessor, addAction],
    )

    return (
      <tr
        aria-label={t(`risk.geozone.custom.${(level || 'UNKNOWN').toLowerCase()}`)}
        data-index={index}
        className={styles.tableRow}
      >
        <RiskLevelCell level={level} tag={t('common.custom')} t={t} />
        <td className={styles.tableRiskFactorsCell}>
          <div className={styles.tableRiskFactors}>
            {level === RiskLevel.UNKNOWN ? (
              <UndefinedGeozoneRiskFactor t={t} />
            ) : (
              <OverriddenGeozoneRiskFactor geozoneId={geozoneId} t={t} />
            )}
          </div>
        </td>
        <td className={styles.tableActionsCell}>
          <div className={styles.tableActionsAndRemoval}>
            <div className={styles.tableActions}>
              {actions.map((action, idx) => (
                <ActionForOverridden
                  key={idx}
                  t={t}
                  idx={idx}
                  action={action}
                  deleteAction={deleteAction}
                  accessor={accessor}
                  canEdit={canEdit}
                />
              ))}
              <ActionsMenu
                addAction={onAddAction}
                actions={actions}
                areBlockRequestingActionsVisible={areBlockRequestingActionsVisible}
                areMdmDeviceActionsVisible={areMdmDeviceActionsVisible}
                canEdit={canEdit}
              />
            </div>
            {canEdit && (
              <IconButton
                className={styles.removal}
                size="small"
                title={t('policies.details.removeCustomActionsDefinedGeozones')}
                onClick={onRemoveGeozone}
              >
                <BasicClose />
              </IconButton>
            )}
          </div>
        </td>
      </tr>
    )
  },
)

const GeozonesSetting = memo(
  ({
    geozones,
    level,
    isDefinedGeozoneEnabled,
    riskFactors,
    addAction,
    deleteAction,
    removeGeozone,
    settings,
    actions,
    canEdit,
  }) => {
    const { t } = useTranslation()
    return (
      <>
        {isDefinedGeozoneEnabled
          ? geozones.map((geozone, index) => {
              return (
                <OverriddenGeozone
                  key={geozone.geozoneId}
                  t={t}
                  geozoneId={geozone.geozoneId}
                  level={geozone.level}
                  factors={riskFactors}
                  actions={geozone.actions}
                  addAction={addAction}
                  deleteAction={deleteAction}
                  removeGeozone={removeGeozone}
                  canEdit={canEdit}
                  index={index}
                />
              )
            })
          : null}
        <DefaultPolicy
          t={t}
          level={level}
          factors={riskFactors}
          settings={settings}
          actions={actions}
          addAction={addAction}
          deleteAction={deleteAction}
          canEdit={canEdit}
          index={isDefinedGeozoneEnabled ? geozones.length : 0}
        />
      </>
    )
  },
)

const Geozone = memo(({ policyData, onAddActionClick, onDeleteActionClick, onFactorChange, onDataChange, canEdit }) => {
  const { t } = useTranslation()
  const { data: settings } = useContext(SettingsContext)
  const riskFactors = useMemo(() => (policyData && policyData.geozonePolicy && policyData.geozonePolicy.riskFactors) || [], [
    policyData,
  ])
  const overriddenSettings = useMemo(
    () => (policyData && policyData.geozonePolicy && policyData.geozonePolicy.overriddenRiskLevelActions) || [],
    [policyData],
  )
  const defaultActions = policyData && policyData.geozonePolicy && policyData.geozonePolicy.defaultActions

  const [highZones, mediumZones, lowZones] = useMemo(() => {
    const high = []
    const medium = []
    const low = []
    overriddenSettings.forEach(zone => {
      switch (zone.level) {
        case RiskLevel.HIGH:
          high.push(zone)
          break
        case RiskLevel.MEDIUM:
          medium.push(zone)
          break
        case RiskLevel.LOW:
          low.push(zone)
          break
      }
    })
    return [high, medium, low]
  }, [overriddenSettings])

  const levelActions = useMemo(() => {
    const riskLevelActions = (policyData && policyData.geozonePolicy && policyData.geozonePolicy.defaultRiskLevelActions) || []
    return riskLevelActions.reduce((acc, setting) => {
      acc[setting.level] = setting.actions
      return acc
    }, {})
  }, [policyData])

  const factors = useMemo(() => {
    const factors = []
    if (settings.definedGeozones && settings.definedGeozones.enabled) {
      factors.push({
        id: RiskFactorId.GeozoneDefined,
        title: t('policies.details.definedGeozoneRisk'),
        checked: riskFactors.indexOf(RiskFactorId.GeozoneDefined) !== -1,
      })
    }
    if (settings.learnedGeozones && settings.learnedGeozones.enabled) {
      factors.push({
        id: RiskFactorId.GeozoneLearned,
        title: t('policies.details.learnedGeozoneRisk'),
        checked: riskFactors.indexOf(RiskFactorId.GeozoneLearned) !== -1,
      })
    }
    return factors
  }, [riskFactors, settings.definedGeozones, settings.learnedGeozones, t])

  const onAddUndefinedGeozone = useCallback(() => {
    const newData = {
      ...policyData,
      geozonePolicy: {
        ...policyData.geozonePolicy,
        defaultActions: [],
      },
    }
    onDataChange(newData)
  }, [onDataChange, policyData])

  const onRemoveUndefinedGeozone = useCallback(() => {
    const newData = {
      ...policyData,
      geozonePolicy: {
        ...policyData.geozonePolicy,
        defaultActions: undefined,
      },
    }
    onDataChange(newData)
  }, [onDataChange, policyData])

  const onAddGeozone = useCallback(
    (geozoneId, level) => {
      const newData = {
        ...policyData,
        geozonePolicy: {
          ...policyData.geozonePolicy,
          overriddenRiskLevelActions: [...overriddenSettings, { geozoneId, level, actions: [] }],
        },
      }
      onDataChange(newData)
    },
    [onDataChange, overriddenSettings, policyData],
  )

  const onRemoveGeozone = useCallback(
    geozoneId => {
      const index = overriddenSettings.findIndex(zone => zone.geozoneId === geozoneId)
      const newData = {
        ...policyData,
        geozonePolicy: {
          ...policyData.geozonePolicy,
          overriddenRiskLevelActions: [...overriddenSettings.slice(0, index), ...overriddenSettings.slice(index + 1)],
        },
      }
      onDataChange(newData)
    },
    [onDataChange, overriddenSettings, policyData],
  )

  const isDefinedGeozoneEnabled = useMemo(
    () => settings.definedGeozones && settings.definedGeozones.enabled && riskFactors.indexOf(RiskFactorId.GeozoneDefined) !== -1,
    [riskFactors, settings.definedGeozones],
  )

  const options = useMemo(
    () => ({
      isDefinedGeozoneEnabled,
      riskFactors,
      addAction: onAddActionClick,
      deleteAction: onDeleteActionClick,
      removeGeozone: onRemoveGeozone,
      settings,
      canEdit,
    }),
    [isDefinedGeozoneEnabled, onAddActionClick, onDeleteActionClick, onRemoveGeozone, riskFactors, settings, canEdit],
  )

  return (
    <GeozoneListProvider>
      <div className={styles.tableBox}>
        <RiskFactors className={styles.factors} riskFactors={factors} onChange={onFactorChange} canEdit={canEdit} />
        {riskFactors.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr className={styles.header}>
                <th className={styles.headerCell}>{t('common.riskLevel')}</th>
                <th className={styles.headerCell}>{t('risk.common.riskFactors')}</th>
                <th className={styles.headerCell}>
                  <span>{t('risk.common.assignedActions')}</span>
                  {canEdit && (
                    <span className={styles.headerMenu}>
                      <GeozonePicker
                        disabled={!isDefinedGeozoneEnabled}
                        pickedSettings={overriddenSettings}
                        defaultActions={defaultActions}
                        onAddGeozone={onAddGeozone}
                        onAddUndefinedGeozone={onAddUndefinedGeozone}
                        t={t}
                      />
                    </span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              <GeozonesSetting geozones={highZones} level={RiskLevel.HIGH} actions={levelActions[RiskLevel.HIGH]} {...options} />
              <GeozonesSetting
                geozones={mediumZones}
                level={RiskLevel.MEDIUM}
                actions={levelActions[RiskLevel.MEDIUM]}
                {...options}
              />
              <GeozonesSetting geozones={lowZones} level={RiskLevel.LOW} actions={levelActions[RiskLevel.LOW]} {...options} />
              {isDefinedGeozoneEnabled && defaultActions && (
                <OverriddenGeozone
                  t={t}
                  level={RiskLevel.UNKNOWN}
                  factors={riskFactors}
                  actions={defaultActions}
                  addAction={onAddActionClick}
                  deleteAction={onDeleteActionClick}
                  removeGeozone={onRemoveUndefinedGeozone}
                  canEdit={canEdit}
                />
              )}
            </tbody>
          </table>
        ) : null}
      </div>
    </GeozoneListProvider>
  )
})

Geozone.propTypes = {
  policyData: PropTypes.object,
  onAddActionClick: PropTypes.func.isRequired,
  onDeleteActionClick: PropTypes.func.isRequired,
  onFactorChange: PropTypes.func.isRequired,
  onDataChange: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
}

export default Geozone
