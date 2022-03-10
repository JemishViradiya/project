//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Typography } from '@material-ui/core'

import { useFeatures, useStatefulReduxQuery } from '@ues-data/shared'
import { FeatureName } from '@ues-data/shared-types'
import { Components, Config, Data } from '@ues-gateway/shared'
import { ContentArea, ContentAreaPanel } from '@ues/behaviours'

import { useNotExistingDraftConflictResolver } from '../hooks'
import AclCategories from './acl-categories'
import AclDestination from './acl-destination'
import AclDisposition from './acl-disposition'
import AclRiskConditions from './acl-risk-conditions'
import AclUsersConditions from './acl-users-conditions'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { EntityDetailsViewBaseForm } = Components
const { getFetchAclRuleTask, updateLocalAclRuleData, queryDraftAclRulesProfile, queryCommittedAclRulesProfile } = Data

const AclEditor = () => {
  useNotExistingDraftConflictResolver()
  useStatefulReduxQuery(queryDraftAclRulesProfile)
  useStatefulReduxQuery(queryCommittedAclRulesProfile)

  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const dispatch = useDispatch()
  const { isEnabled } = useFeatures()
  const fetchAclRuleTask = useSelector(getFetchAclRuleTask)

  const editorComponents = [
    {
      title: t('common.generalInfo'),
      component: (
        <EntityDetailsViewBaseForm
          onChange={({ formValues: { name, enabled, description } }) =>
            dispatch(updateLocalAclRuleData({ name, enabled, metadata: { description } }))
          }
          data={{
            name: fetchAclRuleTask?.data?.name,
            description: fetchAclRuleTask?.data?.metadata?.description,
            enabled: fetchAclRuleTask?.data?.enabled ?? true,
          }}
          extraFields={[
            {
              type: 'switch',
              label: t('acl.enabledField'),
              name: 'enabled',
              helpLabel: t('acl.enabledFieldDescription'),
            },
          ]}
        />
      ),
    },
    {
      title: t('common.action'),
      description: t('acl.dispositionDescription'),
      component: <AclDisposition />,
    },
    {
      title: t('networkServices.destinationsTitle'),
      description: t('acl.destinationsDescription'),
      components: [
        {
          title: t('acl.destinationAddressTitle'),
          description: t('acl.destinationAddressDescription'),
          component: <AclDestination />,
        },
        {
          title: t('acl.destinationCategoriesTitle'),
          description: t('acl.destinationCategoryDescription'),
          component: <AclCategories />,
        },
      ],
    },
    {
      title: t('acl.conditionsTitle'),
      description: t('acl.conditionsDescription'),
      components: [
        {
          title: t('common.usersOrUsersGroups'),
          component: <AclUsersConditions />,
        },
        {
          title: t('common.risk'),
          component: <AclRiskConditions />,
          hidden: !isEnabled(FeatureName.UESActionOrchestrator),
        },
      ],
    },
  ]

  return (
    <ContentArea>
      {editorComponents.map(({ title, component, components, description }, index) => (
        <ContentAreaPanel title={title} key={index}>
          {description && <Typography>{description}</Typography>}
          {component}
          {components?.map(
            ({ title, component, description, hidden }, index) =>
              !hidden && (
                <React.Fragment key={index}>
                  {title && (
                    <Box mb={2}>
                      <Typography variant="subtitle1" color="textPrimary">
                        {title}
                      </Typography>
                      <Box mt={2}>{description && <Typography>{description}</Typography>}</Box>
                    </Box>
                  )}
                  {component}
                </React.Fragment>
              ),
          )}
        </ContentAreaPanel>
      ))}
    </ContentArea>
  )
}

export default AclEditor
