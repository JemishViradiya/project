import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { DialogProps } from '@material-ui/core'
import { Box, makeStyles } from '@material-ui/core'

import { useControlledDialog } from '@ues/behaviours'

import { ItemsDialogContent } from './ItemsDialogContent'

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

type UseItemDialogInput = {
  data: any[]
  loading?: boolean
  labels: any
  handleSearch: (str: string) => void
  submitAssignment: (assignments: Promise<any[]> | any[]) => void
  processAssignment: (items: any[]) => Promise<any[]> | any[]
  labelFields: { name: string; description?: string }
}

type UseItemDialogReturn = {
  dialogOptions: DialogProps
  setDialogId: (s: symbol) => void
}

export const useItemDialog = ({
  data,
  loading = false,
  labels,
  handleSearch,
  submitAssignment,
  processAssignment,
  labelFields,
}: UseItemDialogInput): UseItemDialogReturn => {
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

  const getItems = item => {
    return (
      <Box className={classes.listItem}>
        <div>{item[labelFields.name]}</div>
      </Box>
    )
  }

  //reaction on save button in ItemsDialogContent
  const onSubmitAssignment = (selected: any[]) => {
    if (selected && selected.length > 0) {
      submitAssignment(processAssignment(selected))
    }
    onClose()
    handleSearch('')
  }

  const renderListItem = item => getItems(item)
  const closeHandler = () => {
    onClose()
    handleSearch('')
  }

  const getContent = () => {
    return (
      <ItemsDialogContent
        variants={data}
        loading={loading}
        labels={labels}
        labelFields={labelFields}
        renderListItem={renderListItem}
        handleSearchChange={handleSearchChange}
        closeHandler={closeHandler}
        submitHandler={onSubmitAssignment}
      />
    )
  }

  return { dialogOptions: { open, onClose, children: getContent() }, setDialogId }
}
