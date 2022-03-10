import React, { useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router'

import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Tooltip from '@material-ui/core/Tooltip'

import { DetectionPolicyQuery, useBISPolicySchema } from '@ues-data/bis'
import { FeatureName, Permission, usePermissions, useStatefulApolloQuery } from '@ues-data/shared'
import { BasicCopy, BasicDelete, HelpLinks } from '@ues/assets'
import { PageTitlePanel, Tabs, useFeatureCheck, usePageTitle, useSecuredContent, useStatefulTabsProps } from '@ues/behaviours'

import type { PolicyFormOnSubmitCallback } from '../../components/policy-form'
import { PolicyForm } from '../../components/policy-form'
import { PolicyFormContext, PolicyFormContextProvider } from '../../contexts/policy-form-context'
import { ViewContextProvider } from '../../contexts/view-context'
import { useDefaultPolicyFormValues } from '../../hooks/use-default-policy-form-values'
import { useGoToPoliciesListCallback } from '../../hooks/use-go-to-policies-list-callback'
import { useGoToPolicyCreatorCallback } from '../../hooks/use-go-to-policy-creator-callback'
import { useRiskLevels } from '../../hooks/use-risk-levels'
import { useUnsavedChangesConfirmationDialog } from '../../hooks/use-unsaved-changes-confirmation-dialog'
import { PolicyFormMode } from '../../model'
import { fetchedPolicyToPolicyFormValues } from '../../utils'
import { PolicyAssignedUsers } from './assigned-users'
import { useDeletePolicyHandler } from './use-delete-policy-handler'
import { useUpdatePolicyHandler } from './use-update-policy-handler'

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    flexDirection: 'column',
    display: 'flex',
  },
  content: {
    padding: theme.spacing(4),
    paddingTop: 0,
  },
}))

enum EditPolicyTab {
  Settings = 0,
  AssignedUsers = 1,
}

const resolveSelectedTabIndex = (pathname: string) =>
  /\/applied$/.test(pathname) ? EditPolicyTab.AssignedUsers : EditPolicyTab.Settings

const EditPolicyView: React.FC = () => {
  useSecuredContent(Permission.BIS_RISKPROFILE_READ)
  const { isMigratedToDP } = useBISPolicySchema()
  useFeatureCheck(isEnabled => isEnabled(FeatureName.UESActionOrchestrator) && isMigratedToDP)

  const { hasPermission } = usePermissions()
  const canDelete = hasPermission(Permission.BIS_RISKPROFILE_DELETE)
  const canCopy = hasPermission(Permission.BIS_RISKPROFILE_CREATE)
  const canEdit = hasPermission(Permission.BIS_RISKPROFILE_UPDATE)

  const { t } = useTranslation(['bis/ues', 'profiles'])
  const { riskLevelsSet } = useRiskLevels()
  const defaultPolicyFormValues = useDefaultPolicyFormValues()
  const classNames = useStyles()
  const { hasChanges } = useContext(PolicyFormContext)
  const { entityId: policyId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const goToPoliciesList = useGoToPoliciesListCallback()
  const goToPolicyCreator = useGoToPolicyCreatorCallback()
  usePageTitle(t('profiles:policy.detail.user'))

  const { data: { detectionPolicy } = { detectionPolicy: undefined }, loading } = useStatefulApolloQuery(DetectionPolicyQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      id: policyId,
    },
  })

  const isDefault = detectionPolicy?.policyData?.defaultPolicy === true
  const readOnly = loading || !detectionPolicy || !canEdit

  const { deletePolicyHandler, pending: deletionPending } = useDeletePolicyHandler()
  const onDeletePolicyButtonClick = useCallback(() => {
    if (!readOnly) {
      deletePolicyHandler(policyId, detectionPolicy?.name)
    }
  }, [readOnly, deletePolicyHandler, policyId, detectionPolicy])

  const { updatePolicyHandler, pending: updatePending } = useUpdatePolicyHandler(isDefault)
  const onSubmit = useCallback<PolicyFormOnSubmitCallback>(
    formValues => {
      if (!readOnly) {
        updatePolicyHandler(policyId, formValues)
      }
    },
    [readOnly, updatePolicyHandler, policyId],
  )

  const onExitPage = useUnsavedChangesConfirmationDialog(hasChanges, goToPoliciesList)
  const onCopyButtonClick = useCallback(() => {
    if (detectionPolicy) {
      goToPolicyCreator(fetchedPolicyToPolicyFormValues(detectionPolicy, t, defaultPolicyFormValues, riskLevelsSet))
    }
  }, [defaultPolicyFormValues, detectionPolicy, goToPolicyCreator, riskLevelsSet, t])

  const defaultValues = useMemo(() => {
    return fetchedPolicyToPolicyFormValues(detectionPolicy, t, defaultPolicyFormValues, riskLevelsSet)
  }, [defaultPolicyFormValues, detectionPolicy, riskLevelsSet, t])

  const tabsItems = useMemo(
    () => [
      {
        translations: {
          label: 'profiles:policy.detail.settings',
        },
        component: (
          <PolicyForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            onCancel={onExitPage}
            readOnly={readOnly}
            loading={updatePending}
            mode={PolicyFormMode.Edit}
            isDefault={isDefault}
          />
        ),
      },
      {
        translations: {
          label: 'profiles:policy.detail.appliedUsersAndGroups',
        },
        component: <PolicyAssignedUsers readOnly={readOnly} />,
      },
    ],
    [defaultValues, onSubmit, onExitPage, readOnly, updatePending, isDefault],
  )

  const selectedTabIndex = useMemo(() => resolveSelectedTabIndex(location.pathname), [location.pathname])

  const handleTabChange = useUnsavedChangesConfirmationDialog(
    hasChanges,
    useCallback((index: number) => navigate(index === EditPolicyTab.AssignedUsers ? './applied' : './'), [navigate]),
    selectedTabIndex === EditPolicyTab.Settings,
  )

  const onChange = useCallback(
    (_: React.ChangeEvent | React.FormEvent, value?: number) => {
      handleTabChange(value)
    },
    [handleTabChange],
  )

  const tabProps = useStatefulTabsProps({ defaultSelectedTabIndex: selectedTabIndex, tabs: tabsItems, tNs: ['profiles'] })

  const policyName = useMemo(
    () => (detectionPolicy?.policyData?.defaultPolicy ? t('profiles:policy.defaultPolicyName') : detectionPolicy?.name),
    [detectionPolicy?.name, detectionPolicy?.policyData?.defaultPolicy, t],
  )

  return (
    <ViewContextProvider>
      <div className={classNames.container}>
        <PageTitlePanel
          goBack={onExitPage}
          title={[t('bis/ues:detectionPolicies.details.title'), policyName]}
          subtitle={t('profiles:policy.detail.updated', {
            date: detectionPolicy?.updatedAt,
            userName: detectionPolicy?.updatedByUser,
          })}
          helpId={HelpLinks.PoliciesRiskDetection}
          actions={
            <Box display="flex" alignItems="center">
              <Tooltip title={t('bis/ues:detectionPolicies.common.tooltips.copyPolicy')} placement="bottom">
                <IconButton
                  size="small"
                  aria-label={t('bis/ues:detectionPolicies.common.tooltips.copyPolicy')}
                  disabled={!canCopy || deletionPending || updatePending || !detectionPolicy}
                  onClick={onCopyButtonClick}
                >
                  <BasicCopy />
                </IconButton>
              </Tooltip>

              <Tooltip title={t('bis/ues:detectionPolicies.common.tooltips.deletePolicy')} placement="bottom">
                <IconButton
                  size="small"
                  aria-label={t('bis/ues:detectionPolicies.common.tooltips.deletePolicy')}
                  disabled={isDefault || !canDelete || readOnly || deletionPending || updatePending}
                  onClick={onDeletePolicyButtonClick}
                >
                  <BasicDelete />
                </IconButton>
              </Tooltip>
            </Box>
          }
        />

        <div className={classNames.content}>
          <Tabs {...tabProps} onChange={onChange} />
        </div>
      </div>
    </ViewContextProvider>
  )
}

const EditPolicy: React.FC = () => (
  <PolicyFormContextProvider>
    <EditPolicyView />
  </PolicyFormContextProvider>
)

export default EditPolicy
