import React from 'react'
import toPascalCase from 'to-pascal-case'

import SvgIcon from '@material-ui/core/SvgIcon'

import { icons } from './icons.json'

const getIconName = iconData => {
  return toPascalCase(iconData.name)
}

const CustomIcon = props => {
  let { pathData, style, className, ...rest } = props

  if (typeof props.onClick === 'function') {
    style = {
      ...style,
      cursor: 'pointer',
    }
  }

  return (
    <SvgIcon {...rest} className={className} style={{ ...style }}>
      <path d={pathData} />
    </SvgIcon>
  )
}

const Icons = icons.reduce((accumulator, iconData) => {
  return {
    ...accumulator,
    [getIconName(iconData)]: props => <CustomIcon {...props} pathData={iconData.data} />,
  }
}, {})

export default Icons
