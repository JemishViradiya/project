import React, { useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router'

import { Box, IconButton, Tooltip } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { UESPolicyDetailsQuery, useBISPolicySchema } from '@ues-data/bis'
import { Permission, ServiceId, usePermissions, useStatefulApolloQuery } from '@ues-data/shared'
import { BasicCopy, BasicDelete } from '@ues/assets'
import {
  PageTitlePanel,
  Tabs,
  useFeatureCheck,
  usePageTitle,
  useSecuredContentWithService,
  useStatefulTabsProps,
} from '@ues/behaviours'

import type { PolicyFormOnSubmitCallback } from '../../components/policy-form'
import { PolicyForm, PolicyFormMode } from '../../components/policy-form'
import { DEFAULT_POLICY_FORM_VALUES, TRANSLATION_NAMESPACES } from '../../config'
import { PolicyFormContext, PolicyFormContextProvider } from '../../contexts/policy-form-context'
import { useAvailableActions } from '../../hooks/use-available-actions'
import { useGoToPoliciesListCallback } from '../../hooks/use-go-to-policies-list-callback'
import { useGoToPolicyCreatorCallback } from '../../hooks/use-go-to-policy-creator-callback'
import { useUnsavedChangesConfirmationDialog } from '../../hooks/use-unsaved-changes-confirmation-dialog'
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
    paddingBottom: theme.spacing(4),
  },
}))

enum EditPolicyTab {
  Settings = 0,
  AssignedUsers = 1,
}

const resolveSelectedTabIndex = (pathname: string) =>
  /\/applied$/.test(pathname) ? EditPolicyTab.AssignedUsers : EditPolicyTab.Settings

const EditPolicyView: React.FC = () => {
  useSecuredContentWithService({ requiredPermissions: Permission.BIS_RISKPROFILE_READ, requiredServices: ServiceId.BIG })
  const { isMigratedToDP } = useBISPolicySchema()
  useFeatureCheck(() => !isMigratedToDP)
  const { t } = useTranslation([...TRANSLATION_NAMESPACES, 'profiles'])
  const classNames = useStyles()
  const { hasChanges, getValues } = useContext(PolicyFormContext)
  const { hasCommonUnavailableActions } = useAvailableActions()
  const { entityId: policyId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const goToPoliciesList = useGoToPoliciesListCallback()
  const goToPolicyCreator = useGoToPolicyCreatorCallback()

  usePageTitle(t('profiles:policy.detail.user'))

  const { data: { policy } = { policy: undefined }, loading } = useStatefulApolloQuery(UESPolicyDetailsQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      id: policyId,
    },
  })

  const readOnly = loading || hasCommonUnavailableActions || !policy

  const { deletePolicyHandler, pending: deletionPending } = useDeletePolicyHandler()
  const onDeletePolicyButtonClick = useCallback(() => {
    if (!readOnly) {
      deletePolicyHandler(policyId, policy?.name)
    }
  }, [readOnly, deletePolicyHandler, policyId, policy])

  const { updatePolicyHandler, pending: updatePending } = useUpdatePolicyHandler()
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
    goToPolicyCreator(getValues() ?? DEFAULT_POLICY_FORM_VALUES)
  }, [getValues, goToPolicyCreator])

  const { hasPermission } = usePermissions()
  const canDelete = hasPermission(Permission.BIS_RISKPROFILE_DELETE)
  const canCopy = hasPermission(Permission.BIS_RISKPROFILE_CREATE)
  const canEdit = hasPermission(Permission.BIS_RISKPROFILE_UPDATE)

  const tabsItems = useMemo(
    () => [
      {
        translations: {
          label: 'profiles:policy.detail.settings',
        },
        component: (
          <PolicyForm
            defaultValues={fetchedPolicyToPolicyFormValues(policy as any)}
            onSubmit={onSubmit}
            onCancel={onExitPage}
            readOnly={!canEdit || readOnly}
            loading={updatePending}
            mode={PolicyFormMode.Edit}
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
    [policy, readOnly, onExitPage, onSubmit, updatePending, canEdit],
  )

  const selectedTabIndex = useMemo(() => resolveSelectedTabIndex(location.pathname), [location.pathname])

  const handleTabChange = useUnsavedChangesConfirmationDialog(
    hasChanges,
    useCallback((index: number) => navigate(index === EditPolicyTab.AssignedUsers ? './applied' : './'), [navigate]),
    selectedTabIndex === EditPolicyTab.Settings,
  )

  const onChange = useCallback(
    (event: React.ChangeEvent | React.FormEvent, value?: number) => {
      handleTabChange(value)
    },
    [handleTabChange],
  )

  const tabProps = useStatefulTabsProps({ defaultSelectedTabIndex: selectedTabIndex, tabs: tabsItems, tNs: ['profiles'] })

  return (
    <div className={classNames.container}>
      <PageTitlePanel
        goBack={onExitPage}
        title={[t('bis/ues:policies.details.title'), policy?.name]}
        subtitle={t('profiles:policy.detail.updated', {
          date: policy?.updatedAt,
          userName: policy?.updatedByUser,
        })}
        actions={
          <Box display="flex" alignItems="center">
            <Tooltip title={t('bis/ues:policies.common.tooltips.copyPolicy')} placement="bottom">
              <IconButton
                size="small"
                aria-label={t('bis/ues:policies.common.tooltips.copyPolicy')}
                disabled={!canCopy || readOnly || deletionPending || updatePending}
                onClick={onCopyButtonClick}
              >
                <BasicCopy />
              </IconButton>
            </Tooltip>

            <Tooltip title={t('bis/ues:policies.common.tooltips.deletePolicy')} placement="bottom">
              <IconButton
                size="small"
                aria-label={t('bis/ues:policies.common.tooltips.deletePolicy')}
                disabled={!canDelete || readOnly || deletionPending || updatePending}
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
  )
}

const EditPolicy: React.FC = () => (
  <PolicyFormContextProvider>
    <EditPolicyView />
  </PolicyFormContextProvider>
)

export default EditPolicy
