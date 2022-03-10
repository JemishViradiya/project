/* eslint-disable jsx-a11y/no-autofocus */
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { GroupsApi } from '@ues-data/platform'
import { Permission, usePrevious, useStatefulReduxMutation } from '@ues-data/shared'
import { HelpLinkScope, PageBase, usePlatformHelpLink } from '@ues-platform/shared'
import { useSecuredContent, useSnackbar } from '@ues/behaviours'

import { LocalGroupSection } from '../../common/LocalGroupSection'
import { useDelayedProfileAssignment } from '../../common/useDelayedProfileAssignment'

const AddLocalGroup = () => {
  useSecuredContent(Permission.ECS_USERS_CREATE)
  const { t } = useTranslation(['platform/common', 'profiles'])
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const policiesProps = useDelayedProfileAssignment()

  const [createGroupsAction, createTask] = useStatefulReduxMutation(GroupsApi.mutationCreateGroup)
  const prevCreateTask = usePrevious(createTask)

  useEffect(() => {
    if (GroupsApi.isTaskResolved(createTask, prevCreateTask)) {
      if (createTask.error) {
        snackbar.enqueueMessage(t('groups.create.errorMessage'), 'error')
      } else {
        snackbar.enqueueMessage(t('groups.create.successMessage'), 'success')
        navigate(-1)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createTask, prevCreateTask])

  return (
    <PageBase
      title={t('groups.add.local.title')}
      goBack={() => navigate(-1)}
      borderBottom
      showSpinner={createTask?.loading}
      padding
      alignCenter
      helpId={usePlatformHelpLink(HelpLinkScope.USER_GROUPS)}
    >
      <LocalGroupSection onSubmitAction={createGroupsAction} policiesProps={policiesProps} />
    </PageBase>
  )
}

export default AddLocalGroup
