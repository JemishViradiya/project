import { omit } from 'lodash-es'
import React, { useState } from 'react'

import type { ChipProps as MuiChipProps } from '@material-ui/core'
import { Chip as MuiChip } from '@material-ui/core'

import { defaultChipProps, User } from '@ues/assets'

import { partialAction as action } from '../utils/actions'

export interface ChipProps extends MuiChipProps {
  withIcon?: boolean
  deletable?: boolean
  selectable?: boolean
}

const getIcon = (withIcon: boolean) => {
  return withIcon ? { icon: <User /> } : {}
}

const deletable = (deletable: boolean) => {
  return deletable ? { onDelete: action('onDelete') } : {}
}

const clickable = (clickable: boolean) => {
  return clickable ? { onClick: action('onClick') } : {}
}

const selectable = (toggleSelected, selected) => {
  return {
    onClick: () => toggleSelected(),
    className: selected ? 'chip-selected' : '',
  }
}

export const Chip: React.FC = (props: ChipProps) => {
  const [selected, setSelected] = useState(false)
  const toggleSelected = () => {
    action('onSelect: ' + selected)
    setSelected(!selected)
  }

  const updatedProps = {
    ...omit(props, ['withIcon', 'deletable', 'selectable', 'clickable']),
    ...getIcon(props.withIcon),
    ...deletable(props.deletable),
    ...clickable(props.clickable),
    ...selectable(toggleSelected, selected),
  }

  return <MuiChip {...updatedProps} {...defaultChipProps} />
}
