import PropTypes from 'prop-types'
import React, { memo, useCallback } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import { RiskLevelSelect } from '@ues-bis/shared'
import { getEngineRiskLevel, TenantLink } from '@ues-bis/standalone-shared'
import { RiskLevelLabel, RiskLevelTypes as RiskLevel, TrustLevel } from '@ues-data/bis/model'

import { useLinkStyles } from '../../styles/common'
import RiskEnginesSettingTable from '../RiskEnginesSettingTable/index'
import SwitchControlCollapseSection from '../SwitchControlCollapseSection'

const SWITCH_FIELD_NAME = 'ipAddress.enabled'
const UNDEFINED_FIELD_NAME = 'ipAddress.scoreIfNotInLists'
const UNDETECTED_FIELD_NAME = 'ipAddress.scoreIfNoIPAddress'

const IpAddressSettingsScore = Object.freeze({
  [TrustLevel.UNTRUSTED]: 'scoreIfBlacklisted',
  [TrustLevel.UNDETECTED]: 'scoreIfNoIPAddress',
  [TrustLevel.UNDEFINED]: 'scoreIfNotInLists',
  [TrustLevel.TRUSTED]: 'scoreIfWhitelisted',
})

export const IpAddressScore = {
  [RiskLevel.CRITICAL]: 100,
  [RiskLevel.HIGH]: 60,
  [RiskLevel.MEDIUM]: 30,
  [RiskLevel.LOW]: 0,

  ipRiskLevels: (ipAddressSettings = { riskLevels: [] }) => {
    const { riskLevels } = ipAddressSettings
    return Object.entries(IpAddressSettingsScore).reduce((acc, [ipRiskLevel, ipAddressSettingsKey]) => {
      const riskLevel = getEngineRiskLevel(ipAddressSettings[ipAddressSettingsKey], riskLevels)
      if (riskLevel) {
        acc[riskLevel] = [...(acc[riskLevel] ?? []), ipRiskLevel]
      }
      return acc
    }, [])
  },
}

const RiskLevelSelectOptions = [
  {
    key: RiskLevel.CRITICAL,
    text: RiskLevelLabel.CRITICAL,
  },
  {
    key: RiskLevel.HIGH,
    text: RiskLevelLabel.HIGH,
  },
  {
    key: RiskLevel.MEDIUM,
    text: RiskLevelLabel.MEDIUM,
  },
  {
    key: RiskLevel.LOW,
    text: RiskLevelLabel.LOW,
  },
]

interface IpAddressRiskProps {
  canEdit: boolean
}

const IpAddressRisk: React.FC<IpAddressRiskProps> = memo(({ canEdit }) => {
  const { t } = useTranslation()

  const renderRiskLevelSelect = useCallback(
    ({ onChange, value, name }) => (
      <RiskLevelSelect
        labelId="ip-address-settings-risk-level-select-label"
        name={name}
        disabled={!canEdit}
        options={RiskLevelSelectOptions}
        onChange={onChange}
        value={value}
      />
    ),
    [canEdit],
  )

  const linkStyles = useLinkStyles()

  return (
    <SwitchControlCollapseSection label={t('settings.riskEngines.ipAddress')} name={SWITCH_FIELD_NAME} disabled={!canEdit}>
      <Typography variant="body1" align="justify">
        {t('settings.riskEngines.ipAddressText')}
      </Typography>
      {canEdit && (
        <Typography variant="body1">
          <TenantLink to="/settings/ip-addresses/trusted" className={linkStyles.link}>
            {t('settings.riskEngines.ipAddressLink')}
          </TenantLink>
        </Typography>
      )}
      <RiskEnginesSettingTable hideSettingColumn>
        <>
          {t('common.ipAddressMapping.untrusted')}
          {t(RiskLevelLabel.CRITICAL)}
        </>
        <>
          {t('common.ipAddressMapping.undefined')}
          <Controller render={renderRiskLevelSelect} name={UNDEFINED_FIELD_NAME} />
        </>
        <>
          {t('common.ipAddressMapping.undetected')}
          <Controller render={renderRiskLevelSelect} name={UNDETECTED_FIELD_NAME} />
        </>
        <>
          {t('common.ipAddressMapping.trusted')}
          {t(RiskLevelLabel.LOW)}
        </>
      </RiskEnginesSettingTable>
    </SwitchControlCollapseSection>
  )
})

export default IpAddressRisk
