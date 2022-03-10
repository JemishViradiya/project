import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'

import { BasicDelete } from '@ues/assets'

import { useDeleteUsers } from './useDeleteUsers'

interface UserListActionsProps {
  selected: string[]
  refresh: () => void
}

export const UserListActions: React.FC<UserListActionsProps> = ({ selected, refresh }: UserListActionsProps) => {
  const { t } = useTranslation(['persona/common'])

  const handleUsersDelete = useDeleteUsers({ selected, refresh })

  return (
    <Box pt={3} pb={2} px={3}>
      <Button
        startIcon={<BasicDelete />}
        variant="contained"
        color="secondary"
        onClick={handleUsersDelete}
        disabled={selected.length === 0}
      >
        {t('users.actions.remove')}
      </Button>
    </Box>
  )
}
