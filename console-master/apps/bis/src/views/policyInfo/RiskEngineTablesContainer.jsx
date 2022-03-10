import React, { memo, useCallback, useContext, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import { RiskFactorId } from '@ues-data/bis/model'
import { ArrowChevronDown } from '@ues/assets'

import { default as IpAddressSettingsProvider } from '../../providers/IpAddressSettingsProvider'
import { Context as SettingsContext } from '../../providers/RiskEngineSettingsProvider'
import {
  ActionType as ActionTypes,
  IconButton,
  StandaloneCapability as capability,
  useCapability,
  useClientParams,
  useToggle,
} from '../../shared'
import emptyScreenImage from '../../static/EmptyPolicy.svg'
import sortingOptions from '../settingsIpAddresses/static/sortingOptions'
import GeozoneTable from './riskEngineTable/Geozone'
import IdentityAndBehaviorTable from './riskEngineTable/IdentityAndBehavior'
import { DefaultIpAddressPolicy } from './riskEngineTable/static/Defaults'
import styles from './Settings.module.less'

let riskEngineTableId = 1
const riskEngineSymbol = Symbol('RiskEngineTableId').toString()

const EmptyState = memo(({ image, title }) => {
  return (
    <div className={styles.container}>
      <img aria-describedby="empty-state-description" className={styles.graphic} src={image} alt="" />
      <div className={styles.text}>
        <span id="empty-state-description" className={styles.description}>
          {title}
        </span>
      </div>
    </div>
  )
})

const RiskEngineSection = memo(
  ({
    title,
    subtitle,
    component: Component,
    hasSettings,
    onDataChange,
    policyData,
    onAddActionClick,
    onDeleteActionClick,
    onFactorChange,
    canEdit,
  }) => {
    const self = useRef()
    if (!self.current) {
      self.current = `${riskEngineSymbol}-${riskEngineTableId++}`
    }
    const { t } = useTranslation()
    const [expanded, toggleExpanded] = useToggle(true)
    return (
      <Box aria-label={title} className={styles.riskEngineTableBox} mt={4}>
        <header className={styles.riskEngineTableHeader}>
          <Typography variant="h3" gutterBottom>
            {title}
          </Typography>

          <IconButton
            controls={self.current}
            aria-expanded={expanded}
            aria-label={expanded ? t('common.collapse') : t('common.expand')}
            tabIndex="-1"
            className={styles.riskEngineTableIcon}
            onClick={toggleExpanded}
          >
            <ArrowChevronDown />
          </IconButton>
        </header>
        {expanded && Component && (
          <div id={self.current} role="region" tabIndex="-1">
            <Typography variant="body1">{subtitle}</Typography>

            <Component
              onDataChange={onDataChange}
              onAddActionClick={onAddActionClick}
              onDeleteActionClick={onDeleteActionClick}
              onFactorChange={onFactorChange}
              policyData={policyData}
              canEdit={canEdit}
            />
          </div>
        )}
      </Box>
    )
  },
)

RiskEngineSection.displayName = 'RiskEngineSection'

const isGroupActionAlreadyAssigned = (currentActions, action) => {
  if (action.actionType === ActionTypes.UemAssignGroup) {
    const { groupGuid: newActionGroupGuid } = action.actionAttributes
    const currentGroupActions = currentActions.filter(action => action.actionType === ActionTypes.UemAssignGroup.actionType)
    const currentGroupActionsGuids = currentGroupActions.map(action => action.actionAttributes.groupGuid)
    return currentGroupActionsGuids.some(groupGuid => groupGuid === newActionGroupGuid)
  }
}

const isBlockActionAlreadyAssigned = (currentActions, action) =>
  (action.actionType === ActionTypes.UemBlockApplications || action.actionType === ActionTypes.AppBlockApplication.actionType) &&
  currentActions.some(currentAction => action.actionType === currentAction.actionType)

const doesNewActionAlreadyExists = (currentActions, action) =>
  currentActions && (isBlockActionAlreadyAssigned(currentActions, action) || isGroupActionAlreadyAssigned(currentActions, action))

const reduceFactors = factors =>
  factors.reduce((pre, curr) => {
    if (curr.checked) {
      pre.push(curr.id)
    }
    return pre
  }, [])

const identitySettings = 'identityPolicy'
const geozoneSettings = 'geozonePolicy'

const isIdentityRiskEnabled = (settings, AppAnomalyDetection, NetworkAnomalyDetection) =>
  (settings.behavioral && settings.behavioral.enabled) ||
  (settings.ipAddress && settings.ipAddress.enabled) ||
  (AppAnomalyDetection && settings.appAnomalyDetection && settings.appAnomalyDetection.enabled) ||
  (NetworkAnomalyDetection && settings.networkAnomalyDetection && settings.networkAnomalyDetection.enabled)

const isGeozoneRiskEnabled = settings =>
  (settings.learnedGeozones && settings.learnedGeozones.enabled) || (settings.definedGeozones && settings.definedGeozones.enabled)

const RiskEngineTablesContainer = ({ onChange: onDataChange, value: policyData }) => {
  const { t } = useTranslation()
  const { data: settings } = useContext(SettingsContext)
  const { features: { AppAnomalyDetection = false, NetworkAnomalyDetection = false } = {} } = useClientParams()
  const [canEdit] = useCapability(capability.POLICIES)

  const handleAddActionClick = useCallback(
    (action, actionsAccessor) => {
      const clone = JSON.parse(JSON.stringify(policyData))
      const actions = actionsAccessor(clone)
      if (doesNewActionAlreadyExists(actions, action)) {
        return
      }
      // TODO: fix api to avoid this
      actions.push(action)
      onDataChange(clone)
    },
    [policyData, onDataChange],
  )

  const handleDeleteActionClick = useCallback(
    (actionsAccessor, index) => {
      const clone = JSON.parse(JSON.stringify(policyData))
      const actions = actionsAccessor(clone)
      actions.splice(index, 1)
      onDataChange(clone)
    },
    [policyData, onDataChange],
  )

  const handleFactorChange = useCallback(
    settingsType => factors => {
      const riskFactors = reduceFactors(factors)
      const newData = {
        ...policyData,
        [settingsType]: {
          ...(policyData[settingsType] ?? {}),
          riskFactors,
          // below handles scenario when user enables IP address risk factor on previously created policy without this risk factor
          ...(riskFactors.includes(RiskFactorId.IpAddress) &&
            !policyData[settingsType]?.ipAddressPolicy && { ipAddressPolicy: DefaultIpAddressPolicy }),
        },
      }
      onDataChange(newData)
    },
    [onDataChange, policyData],
  )

  const [identityFactorChangeHandler, geozoneFactorChangeHandler] = useMemo(
    () => [handleFactorChange(identitySettings), handleFactorChange(geozoneSettings)],
    [handleFactorChange],
  )

  const identityRiskEnabled = isIdentityRiskEnabled(settings, AppAnomalyDetection, NetworkAnomalyDetection)
  const geoZoneRiskEnabled = isGeozoneRiskEnabled(settings)

  const identityRiskSection = useMemo(() => {
    let identityRiskSection = identityRiskEnabled && (
      <RiskEngineSection
        policyData={policyData}
        title={t('risk.common.identityRisk')}
        subtitle={t('policies.details.addCustomActionRiskFactors')}
        component={IdentityAndBehaviorTable}
        onAddActionClick={handleAddActionClick}
        onDeleteActionClick={handleDeleteActionClick}
        onFactorChange={identityFactorChangeHandler}
        onDataChange={onDataChange}
        canEdit={canEdit}
      />
    )
    if (identityRiskSection && settings.ipAddress?.enabled) {
      identityRiskSection = (
        <IpAddressSettingsProvider
          variables={{
            sortBy: sortingOptions.INIT_SORT_BY,
            sortDirection: sortingOptions.INIT_SORT_DIRECTION,
          }}
        >
          {identityRiskSection}
        </IpAddressSettingsProvider>
      )
    }
    return identityRiskSection
  }, [
    canEdit,
    handleAddActionClick,
    handleDeleteActionClick,
    identityFactorChangeHandler,
    identityRiskEnabled,
    onDataChange,
    policyData,
    settings.ipAddress.enabled,
    t,
  ])

  const geozoneRiskSection = useMemo(
    () =>
      geoZoneRiskEnabled && (
        <RiskEngineSection
          policyData={policyData}
          title={t('common.geozoneRisk')}
          subtitle={t('policies.details.addCustomActionGeozones')}
          component={GeozoneTable}
          onAddActionClick={handleAddActionClick}
          onDeleteActionClick={handleDeleteActionClick}
          onFactorChange={geozoneFactorChangeHandler}
          onDataChange={onDataChange}
          canEdit={canEdit}
        />
      ),
    [
      canEdit,
      geoZoneRiskEnabled,
      geozoneFactorChangeHandler,
      handleAddActionClick,
      handleDeleteActionClick,
      onDataChange,
      policyData,
      t,
    ],
  )

  const emptySection = useMemo(
    () =>
      !identityRiskSection &&
      !geozoneRiskSection && <EmptyState image={emptyScreenImage} title={t('policies.details.noRiskFactors')} />,
    [geozoneRiskSection, identityRiskSection, t],
  )

  return (
    <>
      {identityRiskSection}
      {geozoneRiskSection}
      {emptySection}
    </>
  )
}

export default RiskEngineTablesContainer
