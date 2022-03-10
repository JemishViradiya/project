import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button, Typography } from '@material-ui/core'

import { BasicAdd, BasicDelete } from '@ues/assets'

export const UsersTableActions = ({ selectedItems, onDelete, id }) => {
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  const navigate = useNavigate()

  return (
    <>
      {selectedItems.length > 0 && (
        <Typography variant="h4">{t('groups.table.selectedCount', { value: selectedItems.length })}</Typography>
      )}
      <Button startIcon={<BasicAdd />} variant="contained" color="secondary" onClick={() => navigate(`/groups/addUsers/${id}`)}>
        {t('groups.usersTable.addUser')}
      </Button>

      {selectedItems.length > 0 && (
        <Button startIcon={<BasicDelete />} variant="contained" color="primary" onClick={() => onDelete(selectedItems)}>
          {t('general/form:commonLabels.remove')}
        </Button>
      )}
    </>
  )
}
