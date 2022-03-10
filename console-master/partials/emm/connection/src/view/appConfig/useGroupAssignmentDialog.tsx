import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { DialogProps } from '@material-ui/core'
import { Box } from '@material-ui/core'

import type { GroupResponse } from '@ues-data/emm'
import { useControlledDialog } from '@ues/behaviours'

import makeStyles from './AddConnectionAppConfigStyle'
import type { AssignmentDialogProps, AssignmentItem } from './GroupAssignmentDialogContent'
import { AssignmentDialogContent } from './GroupAssignmentDialogContent'

type UseGroupAssignmentDialogInput = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: AssignmentItem[]
  loading?: boolean
  handleSearch: (searchResponse: GroupResponse) => void
  submitAssignment: (assignments: AssignmentItem[]) => void
}

type UseGroupAssignmentDialogReturn = {
  dialogOptions: DialogProps
  setDialogId: (s: symbol) => void
}

export const useGroupAssignmentDialog = ({
  data,
  loading = false,
  handleSearch,
  submitAssignment,
}: UseGroupAssignmentDialogInput): UseGroupAssignmentDialogReturn => {
  const { t } = useTranslation(['emm/connection'])
  const [dialogId, setDialogId] = useState(null)
  const classes = makeStyles()
  const { open, onClose } = useControlledDialog({
    dialogId: dialogId,
    onClose: () => {
      setDialogId(null)
    },
  })

  const labels: AssignmentDialogProps['labels'] = {
    title: t('emm.appConfig.groupAssignment.title'),
    description: t('emm.appConfig.groupAssignment.description'),
    searchText: t('emm.appConfig.groupAssignment.searchText'),
    cancel: t('emm.appConfig.groupAssignment.cancelButton'),
    submit: t('emm.appConfig.groupAssignment.addButton'),
    noSearchResultsText: t('emm.appConfig.groupAssignment.list.noResults'),
  }

  const getGroup = item => {
    return (
      <Box className={classes.listItem}>
        <div>{item.displayName}</div>
      </Box>
    )
  }

  const onSubmitAssignment = (selected: AssignmentItem[]) => {
    if (selected && selected.length > 0) {
      submitAssignment(selected)
    }
    onClose()
  }

  const renderListItem = item => getGroup(item)
  const closeHandler = () => {
    onClose()
  }

  const getContent = () => {
    return (
      <AssignmentDialogContent
        variants={data}
        loading={loading}
        labels={labels}
        renderListItem={renderListItem}
        handleSearchChange={handleSearch}
        closeHandler={closeHandler}
        submitHandler={onSubmitAssignment}
      />
    )
  }

  return { dialogOptions: { open, onClose, children: getContent() }, setDialogId }
}
