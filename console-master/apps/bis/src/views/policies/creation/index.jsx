import cn from 'classnames'
import React, { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { IconButton } from '@material-ui/core'

import { PolicyListAddMutation } from '@ues-data/bis'
import { RiskFactorId } from '@ues-data/bis/model'
import { useStatefulApolloMutation } from '@ues-data/shared'
import { BasicCancel } from '@ues/assets'

import { CONFIRM_POLICY_REDIRECT } from '../../../config/consts/dialogIds'
import { NewPolicyProvider } from '../../../providers/PolicyProvider'
import { Context as SettingsContext, default as RiskEngineSettingsProvider } from '../../../providers/RiskEngineSettingsProvider'
import {
  common,
  ErrorBoundary,
  LayoutHeader,
  Loading,
  MessageSnackbar,
  StandaloneCapability as capability,
  useCapability,
  useClientParams,
} from '../../../shared'
import { backToPolicyList, processDisabledRiskFactors, processReAuthAction } from '../../policyInfo/common'
import policyStyles from '../../policyInfo/index.module.less'
import { DefaultIpAddressPolicy } from '../../policyInfo/riskEngineTable/static/Defaults'
import Settings from '../../policyInfo/Settings'
import policiesStyles from '../index.module.less'
import styles from './index.module.less'
import RedirectionModal from './RedirectionModal'

const HeaderTitle = memo(({ t, onCancel }) => {
  return (
    <div className={policiesStyles.title}>
      <IconButton onClick={onCancel} title={t('common.back')} aria-label={t('common.back')}>
        <BasicCancel />
      </IconButton>
      {t('policies.create.title')}
    </div>
  )
})

const defaultSnackbar = {
  open: false,
  message: '',
  variant: 'error',
}
const NewPolicy = memo(({ defaultValue }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [redirectionDialog, setRedirectionDialog] = useState({})
  const openRedirectionDialog = useCallback(() => setRedirectionDialog({ dialogId: CONFIRM_POLICY_REDIRECT }), [])
  const [snackbar, setSnackbar] = useState(defaultSnackbar)
  const [canEdit] = useCapability(capability.POLICIES)

  const onCancel = useCallback(() => backToPolicyList(navigate, location), [navigate, location])
  const onError = useCallback(
    error => {
      const errorMessage = (error.graphQLErrors || []).find(gqlError => gqlError && gqlError.message && gqlError.message.message)
      setSnackbar({
        open: true,
        message: t(
          errorMessage?.message?.subStatusCode === 1011 ? 'policies.details.errorServerNameAlreadyExists' : 'policies.create.error',
        ),
        variant: 'error',
      })
      console.log('got mutation error: ', error.message)
    },
    [t],
  )

  const [createPolicy, { data, loading: saving }] = useStatefulApolloMutation(PolicyListAddMutation, {
    onCompleted: openRedirectionDialog,
    onError,
  })

  const onSave = useCallback(
    policy => {
      if (canEdit) {
        createPolicy({
          variables: {
            input: {
              ...common.removeNull(policy),
              policyData: processReAuthAction(processDisabledRiskFactors(policy.policyData)),
            },
          },
        })
      }
    },
    [canEdit, createPolicy],
  )

  const onRedirect = useCallback(() => {
    const { createPolicy: { id } = {} } = data
    if (id) {
      const pathname = location.pathname.replace(/\/policies.*$/, `/policies/${id}/applied`)
      navigate(pathname, { replace: true })
    }
  }, [data, navigate, location])

  const onCloseSnackbar = useCallback(() => setSnackbar({ ...snackbar, open: false }), [snackbar])
  return (
    <div className={cn(policiesStyles.listContainer, policyStyles.noBottomPadding)}>
      <LayoutHeader title={<HeaderTitle onCancel={onCancel} t={t} />} />
      <div className={styles.headerSpacing} />
      <Settings id={defaultValue.id} defaultValue={defaultValue} updating={saving} onSave={onSave} onCancel={onCancel} />
      <MessageSnackbar open={snackbar.open} message={snackbar.message} variant={snackbar.variant} onClose={onCloseSnackbar} />
      <RedirectionModal dialogId={redirectionDialog.dialogId} onClose={onCancel} onRedirect={onRedirect} />
    </div>
  )
})

const createPolicy = (settings, AppAnomalyDetection, NetworkAnomalyDetection) => {
  const result = {
    name: '',
    description: '',
    policyData: {
      identityPolicy: {
        riskFactors: [],
        fixUp: { enabled: false, minimumBehavioralRiskLevel: 'HIGH', actionPauseDuration: 7200 },
      },
      geozonePolicy: {
        riskFactors: [],
      },
    },
  }
  if (settings.definedGeozones && settings.definedGeozones.enabled) {
    result.policyData.geozonePolicy.riskFactors.push(RiskFactorId.GeozoneDefined)
  }
  if (settings.learnedGeozones && settings.learnedGeozones.enabled) {
    result.policyData.geozonePolicy.riskFactors.push(RiskFactorId.GeozoneLearned)
  }
  if (settings.behavioral && settings.behavioral.enabled) {
    result.policyData.identityPolicy.riskFactors.push(RiskFactorId.Behavioral)
  }
  if (settings.ipAddress && settings.ipAddress.enabled) {
    result.policyData.identityPolicy.riskFactors.push(RiskFactorId.IpAddress)
    result.policyData.identityPolicy.ipAddressPolicy = { ...DefaultIpAddressPolicy }
  }
  if (AppAnomalyDetection && settings.appAnomalyDetection && settings.appAnomalyDetection.enabled) {
    result.policyData.identityPolicy.riskFactors.push(RiskFactorId.AppAnomalyDetection)
  }
  if (NetworkAnomalyDetection && settings.networkAnomalyDetection && settings.networkAnomalyDetection.enabled) {
    result.policyData.identityPolicy.riskFactors.push(RiskFactorId.NetworkAnomalyDetection)
  }
  return result
}

const DefaultNewPolicy = () => {
  const { loading, data: settings } = useContext(SettingsContext)
  const { features: { AppAnomalyDetection = false, NetworkAnomalyDetection = false } = {} } = useClientParams()

  const policy = useMemo(() => {
    if (!loading && settings) {
      return createPolicy(settings, AppAnomalyDetection, NetworkAnomalyDetection)
    }
  }, [AppAnomalyDetection, loading, settings, NetworkAnomalyDetection])

  if (loading) {
    return <Loading />
  }
  return (
    <NewPolicyProvider policy={policy}>
      <NewPolicy defaultValue={policy} />
    </NewPolicyProvider>
  )
}

export const NewPolicyDashboard = memo(() => (
  <ErrorBoundary>
    <RiskEngineSettingsProvider>
      <DefaultNewPolicy />
    </RiskEngineSettingsProvider>
  </ErrorBoundary>
))

export default NewPolicyDashboard
