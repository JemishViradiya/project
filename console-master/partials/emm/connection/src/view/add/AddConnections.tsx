/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button, FormControl, Menu, MenuItem } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

import { useFeatures } from '@ues-data/shared'

import { prepareConnectorList } from '../common/Util'

export const AddConnections = ({ connections, clearReduxState }) => {
  const { t } = useTranslation(['emm/connection'])
  const [anchorEl, setAnchorEl] = useState(null)
  const [connectionDropDownList, setConnectionDropDownList] = useState([])

  const { isEnabled } = useFeatures()

  useEffect(() => {
    setConnectionDropDownList(prepareConnectorList(connections, isEnabled))
  }, [connections, isEnabled])

  const handleMenuClick = event => {
    clearReduxState()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <FormControl title={t('emm.page.connection.add')}>
      {connectionDropDownList && connectionDropDownList.length > 0 && (
        <>
          <Button
            aria-controls="customized-menu"
            aria-haspopup="true"
            variant="contained"
            color="secondary"
            onClick={handleMenuClick}
            startIcon={<AddIcon />}
            endIcon={<ArrowDropDownIcon />}
          >
            {t('emm.page.connection.add')}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {connectionDropDownList.map(item => {
              return (
                <MenuItem component={Link} to={item.to}>
                  {t(item.value)}
                </MenuItem>
              )
            })}
          </Menu>
        </>
      )}
    </FormControl>
  )
}
