import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import MenuItem from '@material-ui/core/MenuItem'
import type { SelectProps } from '@material-ui/core/Select'
import Select from '@material-ui/core/Select'

const timeSelectionProps: Partial<SelectProps> = {
  variant: 'filled',
  margin: 'dense',
  className: 'no-label',
  MenuProps: {
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    getContentAnchorEl: null,
    style: {
      maxHeight: 444,
    },
  },
}

const TimeSelect = ({ format24h, onCurrentTimeClick, children }) => {
  const { t } = useTranslation('components')
  return (
    <>
      <Box>
        <Link onClick={onCurrentTimeClick}>{t('pickers.time.currentTime')}</Link>
      </Box>
      <Box marginTop={4} display="flex" justifyContent="center" alignItems="center">
        {React.Children.map(children, child => {
          if (typeof child === 'string') return child

          return React.cloneElement(child, { ...child.props, format24h })
        })}
      </Box>
    </>
  )
}

const Hour = ({ value, onChange, format24h = false }) => {
  const getDisplayValue = hour => {
    if (format24h) {
      if (hour.toString().length === 1) {
        return `0${hour}`
      }

      return hour
    }

    return hour + 1
  }

  const hours = format24h ? Array.from(Array(24).keys()) : Array.from(Array(12).keys())

  return (
    <Select {...timeSelectionProps} value={value} onChange={onChange}>
      {hours.map(hour => (
        <MenuItem key={hour} value={format24h ? hour : hour + 1}>
          {getDisplayValue(hour)}
        </MenuItem>
      ))}
    </Select>
  )
}

const Minute = ({ value, onChange }) => {
  const minutes = Array.from(Array(60).keys())
  return (
    <Select {...timeSelectionProps} value={value} onChange={onChange}>
      {minutes.map(minute => (
        <MenuItem key={minute} value={minute}>
          {minute.toString().length === 1 ? `0${minute}` : minute}
        </MenuItem>
      ))}
    </Select>
  )
}

const AmPm = ({ value, onChange, format24h = false }) => {
  return !format24h ? (
    <Select {...timeSelectionProps} value={value} onChange={onChange}>
      <MenuItem value="AM">AM</MenuItem>
      <MenuItem value="PM">PM</MenuItem>
    </Select>
  ) : null
}

TimeSelect.Hour = Hour
TimeSelect.Minute = Minute
TimeSelect.AmPm = AmPm

export default TimeSelect
