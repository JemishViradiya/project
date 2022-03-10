/* eslint-disable sonarjs/cognitive-complexity */
/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { Formik } from 'formik'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { Box, IconButton, makeStyles } from '@material-ui/core'
import Tab from '@material-ui/core/Tab'
import Tooltip from '@material-ui/core/Tooltip'
import TabContext from '@material-ui/lab/TabContext'
import TabList from '@material-ui/lab/TabList'
import TabPanel from '@material-ui/lab/TabPanel'

import { useQueryParams } from '@ues-behaviour/react'
import { deleteMtdPolicy, MtdPolicies, mutateMtdPolicy, queryMtdPolicy } from '@ues-data/mtd'
import { FeatureName, Permission, usePermissions, useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { BasicDelete as DeleteIcon, HelpLinks } from '@ues/assets'
import {
  ConfirmationState,
  PageTitlePanel,
  useConfirmation,
  useFeatureCheck,
  usePageTitle,
  useSecuredContent,
  useSnackbar,
} from '@ues/behaviours'

import { Busy } from './common/busy'
import { filterPolicyForCreate } from './common/filter'
import { getI18Name, useTranslation } from './common/i18n'
import { ENQUEUE_TYPE } from './common/notification'
import PolicyForm from './common/policyForm'
import { useReference } from './common/reference'
import { FORM_REFS, MODE_PARAM_VALUE, QUERY_STRING_PARM, SERVER_POLICY_OPERATION, UPDATE_TABS } from './common/settings'
import { FormProvider, useFormValidation } from './common/validate'
import ProfileAssignments from './policy-assigned-users'

const { ResetError, ResetPolicy } = MtdPolicies

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: '-25px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    marginTop: '-15px',
  },
  assignmentsTabPanel: {
    flex: '1 1 auto',
  },
}))

type PolicyUpdateComponentInput = {
  updatable: boolean
  creatable: boolean
  deletable: boolean
}

const PolicyUpdateComponent: React.FC<PolicyUpdateComponentInput> = ({ updatable, creatable, deletable }) => {
  const params = useParams()

  const { loading, error, data: policyData } = useStatefulReduxQuery(queryMtdPolicy, {
    variables: params.id,
  })

  const [updatePolicy, { loading: updating }] = useStatefulReduxMutation(mutateMtdPolicy)
  const [deletePolicy, { loading: deleting }] = useStatefulReduxMutation(deleteMtdPolicy)
  const tabParm = useQueryParams().get(QUERY_STRING_PARM.TAB)
  const dispatch = useDispatch()
  const [policyOperation, setPolicyOperation] = React.useState(null)
  const [tabState, setTabState] = React.useState(UPDATE_TABS.SETTINGS)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const confirmation = useConfirmation()
  const formValidation = useFormValidation()
  const references = useReference()
  const [payload, setPayload] = React.useState<any>(false)
  const [errorCondition, setErrorCondition] = React.useState<any>()

  usePageTitle(t('profiles:policy.detail.user'))

  const goBack = () => {
    navigate('../../../list/protectMobile')
  }

  const onLeavePage = async () => {
    if (policyData?.isFormDirty) {
      const confirmationState = await confirmation({
        title: t('policy.modifiedPolicyConfirmationDialog.title'),
        description: t('policy.modifiedPolicyConfirmationDialog.description'),
        cancelButtonLabel: t('policy.modifiedPolicyConfirmationDialog.cancelButton'),
        confirmButtonLabel: t('policy.modifiedPolicyConfirmationDialog.confirmButton'),
      })
      if (confirmationState === ConfirmationState.Confirmed) {
        goBack()
      }
    } else {
      goBack()
    }
  }

  const classes = useStyles()

  useEffect(() => {
    if (tabParm) {
      setTabState(tabParm as UPDATE_TABS)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    return function cleanup() {
      dispatch(ResetPolicy())
    }
  }, [dispatch])

  useEffect(() => {
    if (errorCondition) {
      formValidation.processServerError(errorCondition, policyOperation)
    }
  }, [errorCondition, policyOperation, formValidation])

  useEffect(() => {
    if (error) {
      dispatch(ResetError())
      setErrorCondition(error)
    } else if (loading === false && policyData?.data) {
      setPayload(JSON.parse(JSON.stringify(policyData?.data)))
    }
  }, [dispatch, policyData, loading, error])

  // upon successful policy delete
  useEffect(() => {
    function doRedirect(policyOperation) {
      if (policyOperation === SERVER_POLICY_OPERATION.UPDATE) {
        if (policyData?.isFormDirty) {
          snackbar.enqueueMessage(t(getI18Name('policyUpdatedMessage')), ENQUEUE_TYPE.SUCCESS)
        }
      } else if (policyOperation === SERVER_POLICY_OPERATION.DELETE) {
        snackbar.enqueueMessage(t(getI18Name('policyDeletedMessage')), ENQUEUE_TYPE.SUCCESS)
      }
    }

    if (policyData?.redirect) {
      goBack()
      doRedirect(policyOperation)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, policyOperation, policyData])

  if (updating || deleting || !payload) {
    return <Busy updating={updating} deleting={deleting} />
  }

  const getAction = () => {
    return (
      <Tooltip title={t(getI18Name('updateFormDeletePolicyTooltip'))}>
        <IconButton
          size="small"
          disabled={loading || policyData?.isFormDirty}
          id="deletePolicyButton"
          onClick={async () => {
            const confirmationState = await confirmation({
              title: t('policy.deletePolicyConfirmationDialog.title'),
              description: t('policy.deletePolicyConfirmationDialog.description', {
                name: policyData?.data?.name,
              }),
              content: t('policy.deletePolicyConfirmationDialog.deleteNote'),
              cancelButtonLabel: t('policy.deletePolicyConfirmationDialog.cancelButton'),
              confirmButtonLabel: t('policy.deletePolicyConfirmationDialog.confirmButton'),
            })
            if (confirmationState === ConfirmationState.Confirmed) {
              setPolicyOperation(SERVER_POLICY_OPERATION.DELETE)
              deletePolicy(params.id)
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    )
  }

  return (
    <Box width="100%" p={2}>
      <PageTitlePanel
        goBack={onLeavePage}
        title={[t(getI18Name('updatePolicyPageTitle')), policyData?.data?.name]}
        subtitle={t(getI18Name('updatePolicyPageTitleHelperText'), {
          date: new Date(policyData?.data?.modified),
          user: 'unknown',
        })}
        helpId={HelpLinks.ProtectMobilePolicy}
        actions={deletable && getAction()}
      />
      <TabContext value={tabState}>
        <TabList>
          <Tab
            label={t(getI18Name('update.tab.settingsLabel'))}
            value={UPDATE_TABS.SETTINGS}
            onClick={() => setTabState(UPDATE_TABS.SETTINGS)}
          />
          <Tab
            label={t(getI18Name('update.tab.usersAndGroupsLabel'))}
            value={UPDATE_TABS.USERS_AND_GROUPS}
            onClick={() => setTabState(UPDATE_TABS.USERS_AND_GROUPS)}
          />
        </TabList>
        <TabPanel value={UPDATE_TABS.SETTINGS}>
          <Formik
            initialValues={payload}
            validate={values => formValidation.validate(values, errorCondition, payload)}
            innerRef={el => references.setRef(FORM_REFS.FORMIK_BAG, el)}
            onSubmit={(values, { setSubmitting }) => {
              formValidation.formSubmitPreprocess(values)
              setPolicyOperation(SERVER_POLICY_OPERATION.UPDATE)
              updatePolicy({ payload: values, setSubmitting })
              setPayload(values)
            }}
          >
            {({ handleChange, values, isSubmitting, errors, dirty }) => (
              <PolicyForm
                handleChange={handleChange}
                values={values}
                errors={errors}
                isSubmitting={isSubmitting}
                onLeavePage={onLeavePage}
                dirty={dirty}
                isFormDirty={policyData?.isFormDirty}
                writable={updatable}
                creatable={creatable}
                handleCopy={() => {
                  const selectedCopy = references.getRef(FORM_REFS.FORMIK_BAG)?.values
                  filterPolicyForCreate(selectedCopy)
                  navigate(`/protectMobile/create?${QUERY_STRING_PARM.MODE}=${MODE_PARAM_VALUE.COPY}`, { state: selectedCopy })
                }}
              />
            )}
          </Formik>
        </TabPanel>
        <TabPanel value={UPDATE_TABS.USERS_AND_GROUPS} className={classes.assignmentsTabPanel}>
          <ProfileAssignments profileId={params.id} />
        </TabPanel>
      </TabContext>
    </Box>
  )
}

export default function PolicyUpdate() {
  useSecuredContent(Permission.MTD_POLICY_READ)
  useFeatureCheck(isEnabled => isEnabled(FeatureName.MobileThreatDetection) && isEnabled(FeatureName.UESCronosNavigation))
  const { hasPermission } = usePermissions()
  return (
    <FormProvider>
      <PolicyUpdateComponent
        updatable={hasPermission(Permission.MTD_POLICY_UPDATE)}
        creatable={hasPermission(Permission.MTD_POLICY_CREATE)}
        deletable={hasPermission(Permission.MTD_POLICY_DELETE)}
      />
    </FormProvider>
  )
}
