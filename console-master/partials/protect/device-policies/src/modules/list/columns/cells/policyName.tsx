import React from 'react'
import { useNavigate } from 'react-router-dom'

import Link from '@material-ui/core/Link'

import type { DevicePolicyListItem } from '@ues-data/epp'

import { ROUTES } from './../../../../constants'

interface PolicyNameCellPropTypes {
  row: DevicePolicyListItem
}

const PolicyNameCell = ({ row }: PolicyNameCellPropTypes): JSX.Element => {
  const navigate = useNavigate()

  const onClick = (policyId: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(ROUTES.Details.replace(':policy_id', policyId))
  }

  return (
    <Link onClick={onClick(row.tenant_policy_id)} data-autoid="policy-list-name-link">
      {row.policy_name}
    </Link>
  )
}

export default PolicyNameCell
