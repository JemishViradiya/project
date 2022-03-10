import _ from 'lodash-es'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { FormControlLabel, FormGroup, FormHelperText, Switch, Typography, useTheme } from '@material-ui/core'

import type { PolicyConfig } from '@ues-data/dlp'
import { MOBILE_OPERATING_SYSTEM_TYPE_NAMES, PolicyData } from '@ues-data/dlp'
import { Permission } from '@ues-data/shared'
import { useSwitchFormGroupStyles, useSwitchHelperTextStyles, useSwitchLabelStyles } from '@ues/assets'
import { ContentAreaPanel, Loading, SecuredContentBoundary, useSecuredContent } from '@ues/behaviours'

import { usePoliciesPermissions } from '../usePoliciesPermission'
import IosSpecificSettings from './ios-specific-settings'

type ConfigItem = {
  config: string
  supportedOsTypes: string[]
  enabled: boolean
}

const SparkMobileSettings = () => {
  useSecuredContent(Permission.BIP_POLICY_READ)

  const { t } = useTranslation('dlp/policy')
  const theme = useTheme()
  const labelClasses = useSwitchLabelStyles(theme)
  const formGroupClasses = useSwitchFormGroupStyles(theme)
  const helperTextClasses = useSwitchHelperTextStyles(theme)
  const { canUpdate } = usePoliciesPermissions()

  const localPolicyData = useSelector(PolicyData.getLocalPolicyData)
  const dispatch = useDispatch()

  const [configDataValues, setConfigDataValues] = useState([])
  const [switchers, setSwitchers] = useState({})

  const policyConfigs = localPolicyData?.policyConfigs

  const getMobilePolicyConfigsData = policyConfigs => {
    return policyConfigs?.reduce((mapConfig, item) => {
      if (!(item.config in mapConfig)) {
        mapConfig[item.config] = {
          config: item.config,
          supportedOsTypes: [item.osType],
          enabled: item.enabled,
        }
      } else {
        mapConfig[item.config] = {
          ...mapConfig[item.config],
          supportedOsTypes: [...mapConfig[item.config].supportedOsTypes, item.osType],
        }
      }
      return mapConfig
    }, {})
  }

  useEffect(() => {
    const mobilePolicyConfigs = getMobilePolicyConfigsData(policyConfigs)
    if (!_.isEmpty(mobilePolicyConfigs)) {
      const configs = Object.values(mobilePolicyConfigs)
      setConfigDataValues(configs)
      const configDataSwitchers = configs?.reduce((acc, item: ConfigItem) => {
        acc[item?.config] = item?.enabled
        return acc
      }, {})
      setSwitchers(configDataSwitchers)
    }
  }, [policyConfigs])

  const getUpdatedConfigs = e => {
    const configKey = e.target.name
    const state = e.target.checked
    return policyConfigs?.map((i: PolicyConfig) => {
      if (i.config === configKey) {
        i.enabled = state
      }
      return i
    })
  }

  const onChange = e => {
    setSwitchers({ ...switchers, [e.target.name]: e.target.checked })
    dispatch(PolicyData.updateLocalPolicyData({ policyConfigs: getUpdatedConfigs(e) }))
  }

  const getTooltipTxt = (translations, base, arr) => {
    const types = arr
      ?.map(t => {
        if (base[t]) return base[t]
      })
      .join(', ')
    return translations + types
  }

  if (_.isEmpty(configDataValues)) return <Loading />

  return (
    <ContentAreaPanel title={t('policy.sections.sparkMobileSettings.title')} ContentWrapper={SecuredContentBoundary}>
      <FormGroup classes={formGroupClasses}>
        {configDataValues?.map((item: ConfigItem) => {
          return (
            <div key={`${item.config}-key`}>
              <FormControlLabel
                control={
                  <Switch
                    name={item.config}
                    aria-label={`${item.config}`}
                    onChange={onChange}
                    checked={switchers[item.config]}
                    disabled={!canUpdate}
                  />
                }
                label={
                  <Typography variant="body2">
                    {t(`policy.sections.sparkMobileSettings.policyConfigNames.${item.config}`)}
                  </Typography>
                }
                classes={labelClasses}
              />
              <FormHelperText classes={helperTextClasses}>
                {getTooltipTxt(
                  t('policy.sections.sparkMobileSettings.supportedOsTypesText'),
                  MOBILE_OPERATING_SYSTEM_TYPE_NAMES,
                  item.supportedOsTypes,
                )}
              </FormHelperText>
            </div>
          )
        })}
      </FormGroup>
      <IosSpecificSettings />
    </ContentAreaPanel>
  )
}

export default SparkMobileSettings
