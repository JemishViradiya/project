import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { DialogProps } from '@material-ui/core'
import { Box, makeStyles } from '@material-ui/core'

import { BasicUsers } from '@ues/assets'
import { useControlledDialog } from '@ues/behaviours'

import type { AssignmentDialogProps, AssignmentItem } from './AssignmentDialogContent'
import { AssignmentDialogContent } from './AssignmentDialogContent'

interface UsersAndGroupsAssignment {
  userIds: string[]
  groupIds: string[]
}

const useStyles = makeStyles(theme => ({
  listItem: {
    display: 'flex',
    alignItems: 'center',
    '& .MuiSvgIcon-theme': {
      fontSize: '20px',
    },
    '& div, svg': {
      marginRight: theme.spacing(1),
    },
  },
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modifyData = (rawData: any[]): AssignmentItem[] => {
  return rawData.map(d => ({ ...d, displayName: d['__typename'] === 'User' ? d.displayName : d.name }))
}

const processAssignment = (rawData: AssignmentItem[]): UsersAndGroupsAssignment => {
  const result = { userIds: [], groupIds: [] }

  rawData.forEach(r => {
    if (r['__typename'] === 'User') {
      result.userIds.push(r.id)
    } else if (r['__typename'] === 'Group') {
      result.groupIds.push(r.id)
    }
  })

  return result
}

type UseUserGroupAssignmentDialogInput = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  loading?: boolean
  handleSearch: (str: string) => void
  submitAssignment: (assignments: UsersAndGroupsAssignment) => void
}

type UseUserGroupAssignmentDialogReturn = {
  dialogOptions: DialogProps
  setDialogId: (s: symbol) => void
}

export const useUserGroupAssignmentDialog = ({
  data,
  loading = false,
  handleSearch,
  submitAssignment,
}: UseUserGroupAssignmentDialogInput): UseUserGroupAssignmentDialogReturn => {
  const { t } = useTranslation(['profiles'])
  const [dialogId, setDialogId] = useState(null)
  const classes = useStyles()
  const { open, onClose } = useControlledDialog({
    dialogId: dialogId,
    onClose: () => {
      setDialogId(null)
    },
  })

  const handleSearchChange = (search: string) => {
    handleSearch(search)
  }

  const labels: AssignmentDialogProps['labels'] = {
    title: t('policy.assignment.dialog.title'),
    description: t('policy.assignment.dialog.description'),
    searchText: t('policy.assignment.dialog.searchText'),
    cancel: t('policy.cancelButton'),
    submit: t('policy.addButton'),
    noSearchResultsText: t('policy.assignment.dialog.list.noResults'),
  }

  const getGroup = item => {
    return (
      <Box className={classes.listItem}>
        <div>{item.displayName}</div>
        <BasicUsers />
        <div>{t('policy.assignment.userCount', { count: item.relationships?.users?.count ?? 0 })}</div>
      </Box>
    )
  }

  const getUser = item => {
    return (
      <Box className={classes.listItem}>
        <div>{item.displayName}</div>
        <div>{item.emailAddress}</div>
      </Box>
    )
  }

  const onSubmitAssignment = (selected: AssignmentItem[]) => {
    if (selected && selected.length > 0) {
      submitAssignment(processAssignment(selected))
    }
    onClose()
    handleSearch('')
  }

  const renderListItem = item => (item['__typename'] === 'Group' ? getGroup(item) : getUser(item))
  const closeHandler = () => {
    onClose()
    handleSearch('')
  }

  const getContent = () => {
    return (
      <AssignmentDialogContent
        variants={modifyData(data)}
        loading={loading}
        labels={labels}
        renderListItem={renderListItem}
        handleSearchChange={handleSearchChange}
        closeHandler={closeHandler}
        submitHandler={onSubmitAssignment}
      />
    )
  }

  return { dialogOptions: { open, onClose, children: getContent() }, setDialogId }
}
