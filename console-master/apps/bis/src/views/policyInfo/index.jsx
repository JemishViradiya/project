import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'

import Tab from '@material-ui/core/Tab'

import { PolicyListDeleteMutation, PolicyListUpdateMutation } from '@ues-data/bis'
import { useStatefulApolloMutation } from '@ues-data/shared'
import { BasicDelete as iconDelete, I18nFormats } from '@ues/assets'

import { CONFIRM_DELETE_POLICY_FROM_DETAILS } from '../../config/consts/dialogIds'
import PolicyProvider, { Context as PolicyContext } from '../../providers/PolicyProvider'
import { Context as SettingsContext, default as RiskEngineSettingsProvider } from '../../providers/RiskEngineSettingsProvider'
import {
  common,
  Container,
  ErrorBoundary,
  Icon,
  IconButton,
  LayoutHeader,
  Loading,
  MessageSnackbar,
  reportClientError,
  StandaloneCapability as capability,
  Tabs,
  useCapability,
} from '../../shared'
import { PolicyHeader } from '../policies/Header'
import policyStyles from '../policies/index.module.less'
import { DeletionConfirmation } from '../policies/PolicyModals'
import Applied from './Applied'
import { backToPolicyList, isPolicyAssigned, processDisabledRiskFactors, processReAuthAction } from './common'
import styles from './index.module.less'
import Settings from './Settings'

const TabSettings = 'settings'
const TabApplied = 'applied'

export const isValidPolicy = policy => policy && policy.name && policy.name.trim().length > 0

const HeaderTitle = memo(({ onCancel }) => {
  const { t, i18n } = useTranslation()
  const policy = useContext(PolicyContext)
  // TODO: get the last updated user / time from the policy
  const subtitle =
    policy &&
    policy.updatedByUser &&
    t('common.lastUpdatedByAt', { name: policy.updatedByUser, datetime: i18n.format(policy.updatedAt, I18nFormats.Date) })

  return <PolicyHeader onCancel={onCancel} title={t('policies.details.title')} subtitle={subtitle} />
})

const PolicyTabs = memo(({ value }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const params = useParams()

  const handleChange = useCallback(
    (_, newValue) => {
      if (newValue === TabSettings) {
        navigate(`/policies/${params.id}`)
      } else {
        navigate(`/policies/${params.id}/${newValue}`)
      }
    },
    [navigate, params],
  )
  return (
    <Container>
      <Tabs value={value} onChange={handleChange}>
        <Tab label={t('policies.details.tabSettings')} value={TabSettings} />
        <Tab label={t('policies.details.tabApplied')} value={TabApplied} />
      </Tabs>
    </Container>
  )
})

const defaultSnackbar = {
  open: false,
  message: '',
  variant: 'error',
}

export const PolicyDetail = memo(({ id, policyOrigin }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [snackbar, setSnackbar] = useState(defaultSnackbar)
  const [deleteDialog, setDeleteDialog] = useState({})
  const openDeleteDialog = useCallback(() => setDeleteDialog({ dialogId: CONFIRM_DELETE_POLICY_FROM_DETAILS }), [])
  const closeDeleteDialog = useCallback(() => setDeleteDialog({}), [])
  const [appliedUsers, setAppliedUsers] = useState(false)
  const { loading } = useContext(SettingsContext)
  const [canEdit] = useCapability(capability.POLICIES)

  const onCancel = useCallback(() => backToPolicyList(navigate, location), [navigate, location])
  const onError = useCallback((error, message) => {
    setSnackbar({ open: true, message: message, variant: 'error' })
    console.error('got mutation error: ', error.message)
  }, [])

  const deleteMutationVars = useMemo(
    () => ({
      onCompleted: onCancel,
      onError: error => onError(error, t('policies.details.errorDelete')),
    }),
    [onCancel, onError, t],
  )
  const [deletePolicies, { loading: deleteInProgress }] = useStatefulApolloMutation(PolicyListDeleteMutation, deleteMutationVars)

  const policies = useMemo(
    () => [
      {
        id: policyOrigin.id,
        name: policyOrigin.name,
        appliedUsers: appliedUsers,
      },
    ],
    [appliedUsers, policyOrigin.id, policyOrigin.name],
  )

  const updateMutationVars = useMemo(
    () => ({
      onCompleted: onCancel,
      onError: error => {
        const errorMessage = error.graphQLErrors?.find(gqlError => gqlError && gqlError.message && gqlError.message.message)
        return onError(
          error,
          t(
            errorMessage?.message?.subStatusCode === 1011
              ? 'policies.details.errorServerNameAlreadyExists'
              : 'policies.details.errorSave',
          ),
        )
      },
    }),
    [onCancel, onError, t],
  )

  const [updatePolicy] = useStatefulApolloMutation(PolicyListUpdateMutation, updateMutationVars)

  const onSave = useCallback(
    policy => {
      if (canEdit) {
        updatePolicy({
          variables: {
            id,
            input: {
              name: policy.name,
              description: policy.description,
              policyData: common.removeNull(processReAuthAction(processDisabledRiskFactors(policy.policyData))),
            },
          },
        })
      }
    },
    [id, updatePolicy, canEdit],
  )

  const deleteSelected = useCallback(() => {
    setAppliedUsers(isPolicyAssigned(policyOrigin))
    openDeleteDialog()
  }, [openDeleteDialog, policyOrigin])

  const handleDelete = useCallback(async () => {
    if (canEdit) {
      try {
        await deletePolicies({ variables: { ids: [policyOrigin.id] } })
      } catch (e) {
        reportClientError(e)
      }
    }
    closeDeleteDialog()
  }, [canEdit, closeDeleteDialog, deletePolicies, policyOrigin.id])

  const deleteButtonTitle = useMemo(() => t('common.delete'), [t])
  const actionButtons = useMemo(() => {
    return (
      <>
        <div className={styles.flexGrow} />
        {/* Copying is not ready in SIS Portal 3.0 */}
        {/* <div className={styles.action} role="button" title={t('policies.details.copy')} tabIndex="-1">
          <Icon icon={iconCopy} />
        </div> */}
        {canEdit && (
          <>
            <IconButton aria-label={deleteButtonTitle} title={deleteButtonTitle} onClick={deleteSelected}>
              <Icon icon={iconDelete} />
            </IconButton>

            <DeletionConfirmation
              dialogId={deleteDialog.dialogId}
              policies={policies}
              onClose={closeDeleteDialog}
              onDelete={handleDelete}
              deleteInProgress={deleteInProgress}
            />
          </>
        )}
      </>
    )
  }, [
    canEdit,
    deleteButtonTitle,
    deleteSelected,
    deleteDialog.dialogId,
    policies,
    closeDeleteDialog,
    handleDelete,
    deleteInProgress,
  ])

  const NewSettings = useCallback(() => <Settings id={id} defaultValue={policyOrigin} onSave={onSave} />, [
    id,
    policyOrigin,
    onSave,
  ])
  const onCloseSnackbar = useCallback(() => setSnackbar({ ...snackbar, open: false }), [snackbar])

  const currentTab = /\/applied$/.test(location.pathname) ? TabApplied : TabSettings

  if (loading || !policyOrigin.policyData) {
    return <Loading />
  }
  return (
    <div className={cn(policyStyles.listContainer, styles.noBottomPadding)}>
      <LayoutHeader title={<HeaderTitle onCancel={onCancel} />} actions={actionButtons} />
      <PolicyTabs value={currentTab} />
      <Routes>
        <Route path="/" element={<NewSettings />} />
        <Route path="/applied" element={<Applied />} />
        <Route path="/*" element={<Navigate to="" />} />
      </Routes>
      <MessageSnackbar open={snackbar.open} message={snackbar.message} variant={snackbar.variant} onClose={onCloseSnackbar} />
    </div>
  )
})

PolicyDetail.propTypes = {
  id: PropTypes.string.isRequired,
}

const PolicyDetailContainer = memo(({ id }) => {
  const policyOrigin = useContext(PolicyContext)
  return <PolicyDetail id={id} policyOrigin={policyOrigin} />
})

export const PoliciyInfoDashboard = memo(() => {
  const { id } = useParams()
  return (
    <ErrorBoundary>
      <RiskEngineSettingsProvider>
        <PolicyProvider id={id}>
          <PolicyDetailContainer id={id} />
        </PolicyProvider>
      </RiskEngineSettingsProvider>
    </ErrorBoundary>
  )
})

export default PoliciyInfoDashboard
