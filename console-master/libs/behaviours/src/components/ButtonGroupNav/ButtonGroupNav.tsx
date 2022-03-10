//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import React, { useState } from 'react'

import type { ButtonGroupProps } from '@material-ui/core'
import { Box, Button, ButtonGroup as MuiButtonGroup, Typography } from '@material-ui/core'

interface ButtonGroupNavProps {
  defaultSelectedItemIndex?: number
  items: {
    component: React.ReactNode
    description?: string
    disabled?: boolean
    hidden?: boolean
    label: string
  }[]
  size?: ButtonGroupProps['size']
}

const ButtonGroupNav: React.FC<ButtonGroupNavProps> = ({ defaultSelectedItemIndex = 0, items, size }) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(defaultSelectedItemIndex)

  const { buttons, components } = items
    .filter(item => !item.hidden)
    .reduce(
      (acc, item, index) => ({
        buttons: [
          ...acc.buttons,
          <Button
            key={index}
            name={item.label}
            data-index={index}
            disabled={item.disabled}
            className={index === selectedItemIndex ? 'selected' : ''}
            onClick={() => setSelectedItemIndex(index)}
          >
            {item.label}
          </Button>,
        ],
        components: {
          ...acc.components,
          [index]: (
            <>
              {item.description && (
                <Box mb={6}>
                  <Typography>{item.description}</Typography>
                </Box>
              )}
              {item.component}
            </>
          ),
        },
      }),
      { buttons: [], components: {} },
    )

  return (
    <>
      <MuiButtonGroup color="default" variant="outlined" size={size}>
        {buttons}
      </MuiButtonGroup>
      {components[selectedItemIndex]}
    </>
  )
}

export { ButtonGroupNav, ButtonGroupNavProps }
