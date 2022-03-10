import cond from 'lodash/cond'
import noop from 'lodash/noop'
import type { MouseEvent, ReactNode } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Popover from '@material-ui/core/Popover'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Export from '@material-ui/icons/ExitToApp'
import ViewColumn from '@material-ui/icons/ViewColumn'

import { dropdownMenuProps } from '@ues/assets'

import { usePopover } from './../../../popovers'
import type { TableColumn } from './../types'

interface TableToolbarPropTypes {
  columns?: TableColumn[]
  setVisibility?: (index: number) => void
  dataAutoIdPrefix: string
  children: ReactNode
  onExport?: (event?: MouseEvent) => void
}

const TableToolbar = ({ columns = [], setVisibility = noop, dataAutoIdPrefix = '', children, onExport }: TableToolbarPropTypes) => {
  const { t: translate } = useTranslation(['tables'])
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  const renderColumnsPopover = () =>
    cond([
      [
        () => columns.length > 0,
        () => (
          <>
            <IconButton
              aria-label={translate('TableColumns')}
              onClick={handlePopoverClick}
              //data-autoid={`${dataAutoIdPrefix}-toggle-button`}
            >
              <ViewColumn />
            </IconButton>
            <Popover
              open={popoverIsOpen}
              anchorEl={popoverAnchorEl}
              onClose={handlePopoverClose}
              getContentAnchorEl={null}
              {...dropdownMenuProps}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                className: 'filter-paper',
              }}
              //data-autoid={`${dataAutoIdPrefix}-toggle-list`}
            >
              <List component="nav">
                <ListSubheader component="div">
                  <Typography variant="subtitle1" gutterBottom>
                    {translate('TableColumns')}
                  </Typography>
                </ListSubheader>
                {columns.map((column, index) => (
                  <ListItem
                    button
                    key={column.dataKey}
                    disabled={column.persistent}
                    onClick={() => setVisibility(index)}
                    //data-autoid={`${dataAutoIdPrefix}-column-toggle-item-${column.id}`}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={column.show}
                        tabIndex={-1}
                        inputProps={{ 'aria-labelledby': column.dataKey }}
                      />
                    </ListItemIcon>
                    <ListItemText id={column.dataKey} primary={column.label} />
                  </ListItem>
                ))}
              </List>
            </Popover>
          </>
        ),
      ],
    ])(undefined)

  return (
    <Toolbar>
      <Box
        display="flex"
        flex={1}
        alignItems="center"
        pr={6}
        pl={6}
        //data-autoid={`${dataAutoIdPrefix}-list-toolbar`}
      >
        {children}
        <div>
          {renderColumnsPopover()}
          {onExport && (
            <IconButton
              onClick={onExport}
              //data-autoid={`${dataAutoIdPrefix}-export`}
            >
              <Export />
            </IconButton>
          )}
        </div>
      </Box>
    </Toolbar>
  )
}

export default TableToolbar
