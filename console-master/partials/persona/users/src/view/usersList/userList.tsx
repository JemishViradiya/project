import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

import { HelpLinks } from '@ues/assets'
import {
  AppliedFilterPanel,
  BasicTable,
  PageTitlePanel,
  StandardPagination,
  TableProvider,
  TableToolbar,
  usePageTitle,
} from '@ues/behaviours'

import { USERLIST_PAGESIZE_OPTIONS } from './../../constants'
import { UserListActions } from './userListActions'
import { useUsersListTable } from './useUsersListTable'

const useStyles = makeStyles(theme => ({
  outerContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  paperContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(6),
  },
}))

const UserList: React.FC = () => {
  const { t } = useTranslation(['persona/common'])
  usePageTitle(t('users.title'))
  const { outerContainer, paperContainer } = useStyles()

  const { tableProps, providerProps, filterPanelProps, refreshUsersList } = useUsersListTable()

  const selectedItems = providerProps?.selectedProps?.selected ?? []

  return (
    <Box className={outerContainer}>
      <PageTitlePanel
        title={[t('users.sectionTitles.assets'), t('users.title')]}
        helpId={HelpLinks.AssetsPersonaUsers}
        borderBottom
      />
      <Paper variant="outlined" className={paperContainer}>
        <TableToolbar
          begin={<UserListActions selected={selectedItems} refresh={refreshUsersList} />}
          bottom={
            <Box px={3}>
              <AppliedFilterPanel {...filterPanelProps} />
            </Box>
          }
        />
        <TableProvider {...providerProps}>
          <BasicTable noDataPlaceholder={tableProps?.noDataPlaceholder} data={providerProps.data} />
        </TableProvider>
        <StandardPagination
          total={providerProps.meta?.total}
          pagesCount={Math.ceil(providerProps.meta?.total / providerProps.meta?.pageSize)}
          rowsPerPageOptions={USERLIST_PAGESIZE_OPTIONS}
          paginationProps={providerProps?.paginationProps}
        />
      </Paper>
    </Box>
  )
}

export default UserList
