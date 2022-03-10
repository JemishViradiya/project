import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { Backdrop, Box, CircularProgress, IconButton, makeStyles } from '@material-ui/core'

import { useQueryParams } from '@ues-behaviour/react'
import { Permission } from '@ues-data/shared-types'
import { FullHeightTabs, HelpLinkScope, TAB_ID_QUERY_PARAM_NAME, usePlatformHelpLink } from '@ues-platform/shared'
import { BasicDelete } from '@ues/assets'
import { PageTitlePanel, usePageTitle, useSecuredContent } from '@ues/behaviours'

import UsersTable from '../../assignedUsers/UsersTable'
import { LocalGroupSection } from '../../common/LocalGroupSection'
import { useGroupPermissions } from '../../common/useGroupPermissions'
import { useUpdateGroup } from '../../common/useUpdateGroup'

const useStyles = makeStyles(theme => ({
  outerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  paperContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  backdrop: {
    zIndex: theme.zIndex.snackbar,
  },
}))

const LocalGroup = () => {
  useSecuredContent(Permission.ECS_USERS_READ)
  const tabId = useQueryParams().get(TAB_ID_QUERY_PARAM_NAME)
  const { id } = useParams()
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  usePageTitle(t('platform/common:groups.titleDetails'))
  const { outerContainer, paperContainer, backdrop } = useStyles()
  const navigate = useNavigate()
  const location = useLocation()
  const { group, policiesProps, updateGroupsAction, onDeleteGroup, showLoading } = useUpdateGroup(id)
  const { canUpdate, canDelete } = useGroupPermissions()

  return (
    <Box className={outerContainer}>
      <PageTitlePanel
        title={[t('groups.title'), group?.name]}
        goBack={() => navigate(-1)}
        actions={
          canDelete && (
            <IconButton size="small" onClick={onDeleteGroup} title={t('general/form:commonLabels.delete')}>
              <BasicDelete />
            </IconButton>
          )
        }
        borderBottom
        helpId={usePlatformHelpLink(HelpLinkScope.USER_GROUPS)}
      />
      <FullHeightTabs
        defaultSelectedTabIndex={tabId ? Number(tabId) : 0}
        tabs={[
          {
            label: t('groups.tabs.settings'),
            tabContent: (
              <Box className={paperContainer}>
                <LocalGroupSection
                  group={group}
                  onSubmitAction={updateGroupsAction}
                  policiesProps={policiesProps}
                  readonly={!canUpdate}
                />
              </Box>
            ),
          },
          {
            label: t('groups.tabs.users'),
            tabContent: <UsersTable groupId={id} readonly={!canUpdate} />,
          },
        ]}
        onChange={tabId =>
          setImmediate(() => navigate(`${location.pathname}?${TAB_ID_QUERY_PARAM_NAME}=${tabId}`, { replace: true }))
        }
      />
      <Backdrop className={backdrop} open={showLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
}

export default LocalGroup
