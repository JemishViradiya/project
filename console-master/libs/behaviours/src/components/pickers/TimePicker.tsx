import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import DateFnsUtils from '@date-io/moment'

import type { Theme } from '@material-ui/core'
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core'
import type { TimePickerProps as MuiTimePickerProps } from '@material-ui/pickers'
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

import { BasicTime } from '@ues/assets'

const timeFormatMap = {
  0: 'HH:mm',
  1: 'hh:mm A',
}

export type TimePickerProps = MuiTimePickerProps

const overrides = theme => {
  return {
    MuiPickersTimePickerToolbar: {
      ...theme.overrides.MuiPickersTimePickerToolbar,
      toolbarAmpmLeftPadding: {
        paddingLeft: 0,
      },
      separator: {
        fontSize: '3.5rem',
        alignSelf: 'baseline',
      },
      hourMinuteLabel: {
        '& button': {
          fontSize: '3.5rem',
          minHeight: '50px',
          paddingBottom: theme.spacing(1.5),
          '& span': {
            '& h2': {
              fontSize: '3.5rem',
            },
          },
        },
      },
    },
  }
}
export const TimePicker = memo((props: TimePickerProps) => {
  const { value, label, minutesStep, ampm, onChange } = props
  const { t } = useTranslation(['components'])

  const styles = makeStyles(theme => ({
    filledTimePicker: {
      '& div': {
        '& div': {
          '& button': {
            '&.Mui-focusVisible': {
              boxShadow: 'unset',
            },
            '&:active': {
              backgroundColor: 'unset',
            },
            '&:hover': {
              backgroundColor: 'unset',
            },
          },
        },
      },
    },
  }))()

  const getTimeFormat = ampm => {
    return timeFormatMap[ampm ? 1 : 0]
  }

  return (
    <ThemeProvider
      theme={(theme: Theme) =>
        createTheme({
          ...theme,
          overrides: {
            ...theme.overrides,
            ...overrides(theme),
          },
        })
      }
    >
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardTimePicker
          format={getTimeFormat(ampm)}
          value={value}
          ampm={ampm}
          inputVariant="filled"
          minutesStep={minutesStep}
          label={label}
          size="small"
          keyboardIcon={<BasicTime />}
          className={styles.filledTimePicker}
          variant="inline"
          onChange={onChange}
          invalidDateMessage={t('pickers.time.invalidMessage')}
          disabled={props?.disabled}
          required={props?.required}
          error={props?.error}
          helperText={props?.helperText}
        />
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  )
})
