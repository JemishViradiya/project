import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import { Button, List, ListItem, ListItemText, Popover, Typography } from '@material-ui/core'

import { ArrowCaretDown, BasicAdd, BasicDelete, dropdownMenuProps } from '@ues/assets'
import { usePopover } from '@ues/behaviours'

import { useGroupPermissions } from '../common/useGroupPermissions'

export const GroupTableActions = ({ selectedItems = [], onDelete, directoriesConfigured, addBlocked }) => {
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  const navigate = useNavigate()

  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  const onAddButtonClick = useCallback(
    event => {
      if (directoriesConfigured) {
        handlePopoverClick(event)
      } else {
        navigate('/groups/add/local')
      }
    },
    [directoriesConfigured, handlePopoverClick, navigate],
  )

  const { canCreate, canDelete } = useGroupPermissions()

  return (
    <>
      {selectedItems.length > 0 && canDelete && (
        <Typography variant="body2">{t('groups.table.selectedCount', { value: selectedItems.length })}</Typography>
      )}
      {canCreate && (
        <Button
          startIcon={<BasicAdd />}
          endIcon={directoriesConfigured && <ArrowCaretDown />}
          variant="contained"
          color="secondary"
          onClick={onAddButtonClick}
          disabled={addBlocked}
        >
          {t('groups.table.addGroup')}
        </Button>
      )}

      {selectedItems.length > 0 && canDelete && (
        <Button startIcon={<BasicDelete />} variant="contained" color="primary" onClick={() => onDelete(selectedItems)}>
          {t('general/form:commonLabels.delete')}
        </Button>
      )}
      <Popover open={popoverIsOpen} anchorEl={popoverAnchorEl} onClose={handlePopoverClose} {...dropdownMenuProps}>
        <List>
          <ListItem key="local" button component={Link} to="/groups/add/local">
            <ListItemText primary={t('groups.table.addLocalGroup')} />
          </ListItem>
          <ListItem key="directory" button component={Link} to="/groups/add/directory">
            <ListItemText primary={t('groups.table.addDirectoryGroup')} />
          </ListItem>
        </List>
      </Popover>
    </>
  )
}
