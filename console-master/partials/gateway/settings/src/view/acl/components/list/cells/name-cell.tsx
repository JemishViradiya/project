//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Link, Typography } from '@material-ui/core'

import { Types, Utils } from '@ues-gateway/shared'

import { useAclRouteDetails } from '../../../hooks'
import type { CommonCellProps } from '../../../types'

const { makePageRoute } = Utils
const { Page } = Types

export const NameLinkCell: React.FC<CommonCellProps> = ({ item, disabled }) => {
  const navigate = useNavigate()
  const { rulesType } = useAclRouteDetails()

  return disabled ? (
    <Typography>{item.name}</Typography>
  ) : (
    <Link
      variant="inherit"
      color="primary"
      onClick={() =>
        navigate(
          makePageRoute(Page.GatewaySettingsAclEdit, {
            params: { id: item.id, rulesType },
          }),
        )
      }
    >
      {item.name}
    </Link>
  )
}

export default NameLinkCell
