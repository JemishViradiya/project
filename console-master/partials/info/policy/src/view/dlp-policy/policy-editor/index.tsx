import { isEmpty, isUndefined } from 'lodash-es'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@material-ui/core'

import { usePrevious } from '@ues-behaviour/react'
import type { Policy } from '@ues-data/dlp'
import { POLICY_TYPE, PolicyData } from '@ues-data/dlp'
import { useStatefulReduxMutation } from '@ues-data/shared'
import { ContentArea, FormButtonPanel, Loading, useConfirmation, useSnackbar } from '@ues/behaviours'

import cancelNavigation from '../helpers/cancelNavigation'
import Actions from '../policy-form/actions'
import Conditions from '../policy-form/conditions'
import EmailSettings from '../policy-form/email-settings'
import GeneralInfo from '../policy-form/general-info'
import SparkMobileSettings from '../policy-form/spark-mobile-settings'
import { policyStyles } from '../policy-form/styles'
import { usePolicyConfirmationDialog } from '../policy-form/usePolicyConfirmationDialog'
import WhitelistDomains from '../policy-form/whitelist-domains'

const POLICY_EDITOR_MAIN_COMPONENTS = {
  [POLICY_TYPE.CONTENT]: (
    <>
      <GeneralInfo />
      <Conditions />
      <WhitelistDomains />
      <EmailSettings />
      <Actions />
    </>
  ),
  [POLICY_TYPE.MOBILE]: (
    <>
      <GeneralInfo />
      <SparkMobileSettings />
    </>
  ),
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const PolicyEditor: React.FC<any> = ({ contentAreaDisplaying }) => {
  const { t } = useTranslation('dlp/policy')
  const { guid, policyType: urlPolicyType } = useParams()
  const confirmation = useConfirmation()
  const { buttonPanel } = policyStyles()
  const snackbar = useSnackbar()
  const isAddMode = isUndefined(guid)
  const hasUnsavedChanges = useSelector(PolicyData.getHasUnsavedPolicyChanges(isAddMode))
  const navigate = useNavigate()
  const localPolicyData = useSelector(PolicyData.getLocalPolicyData)

  const [editPolicyAction, editPolicyTask] = useStatefulReduxMutation(PolicyData.mutationEditPolicy)
  const [createPolicyAction, createPolicyTask] = useStatefulReduxMutation(PolicyData.mutationCreatePolicy)

  const getContentPolicyData = () => {
    return {
      browserDomains: localPolicyData?.browserDomains,
      policyRules: localPolicyData?.policyRules,
      searchPatternGuids: [],
      condition: localPolicyData?.condition,
      emailDomainsRule: localPolicyData?.emailDomainsRule,
    }
  }

  const getMobilePolicyData = () => {
    return {
      policyRules: localPolicyData?.policyRules,
      policyConfigs: localPolicyData?.policyConfigs,
      numberOfScreenshots: localPolicyData?.numberOfScreenshots,
      intervalForScreenshots: localPolicyData?.intervalForScreenshots,
    }
  }

  const policyType = urlPolicyType.toUpperCase() === POLICY_TYPE.CONTENT ? POLICY_TYPE.CONTENT : POLICY_TYPE.MOBILE
  const isContentPolicyType = policyType === POLICY_TYPE.CONTENT
  const policyValue = isContentPolicyType ? getContentPolicyData() : getMobilePolicyData()

  const onSubmit = () => {
    if (isAddMode) {
      const policyState: Policy = {
        policyName: localPolicyData.policyName,
        policyType: policyType,
        description: localPolicyData.description,
        value: JSON.stringify(policyValue),
      }

      const policy = isContentPolicyType ? { ...policyState, classification: localPolicyData.classification } : policyState
      // TODO: add handler and popup
      createPolicyAction(policy)
    } else {
      const policyState: Policy = {
        policyName: localPolicyData.policyName,
        policyType: policyType,
        description: localPolicyData.description,
        policyId: localPolicyData.policyId,
        value: JSON.stringify(policyValue),
      }

      const policy = isContentPolicyType ? { ...policyState, classification: localPolicyData.classification } : policyState
      // TODO: add handler and popup
      editPolicyAction(policy)
    }
  }

  // handling for "create"
  const createPolicyTaskPrev = usePrevious(createPolicyTask)
  const { showConfirmationDialog } = usePolicyConfirmationDialog(isAddMode, urlPolicyType, createPolicyTask)
  useEffect(() => {
    if (!createPolicyTask.loading && createPolicyTaskPrev.loading && createPolicyTask.error) {
      snackbar.enqueueMessage(t('policy.error.create', { error: createPolicyTask.error.message }), 'error')
    } else if (!createPolicyTask.loading && createPolicyTaskPrev.loading && createPolicyTask.error === undefined) {
      showConfirmationDialog().then(() => snackbar.enqueueMessage(t('policy.success.create'), 'success'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createPolicyTask])

  const editPolicyTaskPrev = usePrevious(editPolicyTask)
  useEffect(() => {
    if (!editPolicyTask.loading && editPolicyTaskPrev.loading && editPolicyTask.error) {
      snackbar.enqueueMessage(t('policy.error.update', { error: editPolicyTask.error.message }), 'error')
    } else if (!editPolicyTask.loading && editPolicyTaskPrev.loading && editPolicyTask.error === undefined) {
      showConfirmationDialog().then(() => snackbar.enqueueMessage(t('policy.success.update'), 'success'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editPolicyTask])

  const validateIntervalForScreenshots = () => {
    if (isContentPolicyType) return false
    const intervalForScreenshots = localPolicyData?.intervalForScreenshots?.OPERATING_SYSTEM_TYPE_IOS
    return !isContentPolicyType && (!intervalForScreenshots || intervalForScreenshots < 0 || intervalForScreenshots > 14)
  }

  const validateConditions = () => {
    if (!isContentPolicyType) return false
    return localPolicyData?.condition ? !!localPolicyData?.condition.match(/"var":" "|"(and|or)":\[\]+/g) : true
  }

  const validateConditionsOccurs = () => {
    if (isContentPolicyType) {
      const conditionsRegex = localPolicyData?.condition.match(/,[0-9]+/g)
      const minOccurrences = conditionsRegex?.map(item => Number(item.replace(',', '')))
      if (minOccurrences?.length && minOccurrences?.some(item => item > 10)) {
        return true
      }
    }
    return false
  }

  if (isEmpty(localPolicyData)) return <Loading />

  return (
    <>
      {contentAreaDisplaying && <ContentArea paddingBottom={6}>{POLICY_EDITOR_MAIN_COMPONENTS[policyType]}</ContentArea>}
      <div className={buttonPanel}>
        <FormButtonPanel show={hasUnsavedChanges || isAddMode}>
          <Button variant="outlined" onClick={() => cancelNavigation(hasUnsavedChanges, confirmation, navigate, t, urlPolicyType)}>
            {t('policy.buttons.cancel')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            disabled={
              isEmpty(localPolicyData?.policyName) ||
              validateIntervalForScreenshots() ||
              validateConditions() ||
              validateConditionsOccurs()
            }
          >
            {isAddMode ? t('policy.buttons.addNew') : t('policy.buttons.save')}
          </Button>
        </FormButtonPanel>
      </div>
    </>
  )
}

export default PolicyEditor
