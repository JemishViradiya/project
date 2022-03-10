//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { useStatefulReduxQuery } from '@ues-data/shared'
import { Components, Config, Data, Types, Utils } from '@ues-gateway/shared'
import type { ViewWrapperProps } from '@ues/behaviours'
import { Tabs, usePageTitle, useRoutedTabsProps } from '@ues/behaviours'

import type { PolicyComponentInterface } from '../types'

const { GATEWAY_TRANSLATIONS_KEY, POLICY_HELP_ID, POLICY_LOCALIZATION_TITLE_KEY, POLICY_VIEWS_PERMISSIONS_MAP } = Config
const {
  getPolicy,
  mutationDeletePolicy,
  mutationUpdatePolicy,
  getHasUnsavedPolicyChanges: getHasUnsavedChanges,
  queryPolicy,
  getPolicyTask: getEntityTask,
  getIsPolicyDefinitionValid: getIsEntityDefinitionValid,
  clearPolicy,
} = Data
const { Page } = Types
const { EntityDetailsView } = Components
const { makePageRoute } = Utils

const PolicyEdit: React.FC<Pick<ViewWrapperProps, 'tabs'> & PolicyComponentInterface> = ({ tabs, entityType }) => {
  const { id } = useParams()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY, 'profiles'])
  const policy = useSelector(getPolicy)

  usePageTitle(t('profiles:policy.detail.user'))

  useStatefulReduxQuery(queryPolicy, { variables: { id, entityType } })

  const tabsProps = useRoutedTabsProps({ tabs })

  return (
    <EntityDetailsView
      parentPage={makePageRoute(Page.GatewayPolicies, { params: { entityType } })}
      permissions={[POLICY_VIEWS_PERMISSIONS_MAP[entityType], 'canRead']}
      pageHeading={{
        title: [t(POLICY_LOCALIZATION_TITLE_KEY[entityType]), policy?.name],
        subtitle: t('profiles:policy.detail.updated', { date: policy?.modified }),
        helpId: POLICY_HELP_ID[entityType],
      }}
      copyAction={{ onNavigateTo: () => makePageRoute(Page.GatewayPoliciesPolicyCopy, { params: { entityType, id } }) }}
      removeAction={{
        dataLayer: mutationDeletePolicy,
        getArgs: () => ({ entityType }),
        notificationMessages: { success: t('policies.deletePolicySuccessMessage'), error: t('policies.deletePolicyErrorMessage') },
      }}
      saveAction={{
        dataLayer: mutationUpdatePolicy,
        getArgs: () => ({ entityType }),
        notificationMessages: {
          success: t('policies.updatePolicySuccessMessage'),
          error: t('policies.updatePolicyErrorMessage'),
          nameAlreadyUsedError: t('policies.nameAlreadyUsedError'),
        },
      }}
      redux={{
        selectors: { getHasUnsavedChanges, getEntityTask, getIsEntityDefinitionValid: getIsEntityDefinitionValid(entityType) },
        actions: { exitView: clearPolicy },
      }}
      deleteConfirmationProps={{
        description: t('policies.deletePolicyConfirmationDescription', { name: policy?.name }),
        content: t('policies.deleteNote'),
      }}
    >
      <Tabs {...tabsProps} />
    </EntityDetailsView>
  )
}

export default PolicyEdit
