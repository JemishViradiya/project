import moment from 'moment'
import React from 'react'
import { useTranslation } from 'react-i18next'

import Typography from '@material-ui/core/Typography'

import { I18nFormats, loadI18n } from '@ues/assets'

import markdown from './README.md'

const formatControlType = 'radio'

loadI18n(process.env.NODE_ENV, {
  defaultNS: 'storybook',
  resources: {
    en: {
      storybook: {
        interpolation: {
          Date: 'your cool event happened on {{date, date}}',
          DateTime: 'your cool event happened on {{date, datetime}}',
          Time: 'your cool event happened at {{date, time}}',
          DateTimeRelative: 'your cool event happened {{date, datetime-relative}}',
        },
        datetime: {
          short: 'MM/DD/YYYY hh:mm A',
        },
      },
    },
  },
})

const defaultDate = new Date(Date.now() - 3.6e6)
const sampleValue = (format = 'string', dateArg) => {
  switch (format) {
    case I18nFormats.Number:
    case I18nFormats.Currency:
      return Math.random() * 100
    case 'string':
      return 'sample string'
    default:
      return moment(dateArg).valueOf()
  }
}

export const Format = ({ format: formatArg, date: dateArg } = {}) => {
  const { i18n, t } = useTranslation(['storybook'])
  const format = I18nFormats[formatArg]
  const value = sampleValue(format, dateArg)
  let textContent = ''
  if (format === I18nFormats.DateTimeShort) {
    textContent = moment(value).format(t('datetime.short'))
  } else {
    textContent = i18n.format(value, format)
  }
  return <Typography>{textContent}</Typography>
}
Format.args = {
  date: defaultDate.toLocaleString(),
  format: 'string',
}
Format.argTypes = {
  format: {
    control: {
      type: formatControlType,
      options: ['string', ...Object.keys(I18nFormats)],
    },
    defaultValue: { summary: 'default' },
    description: 'Input Format: one of I18nFormats',
  },
  date: {
    control: {
      type: 'date',
      options: [defaultDate.toLocaleString()],
    },
    defaultValue: { summary: defaultDate.toLocaleString() },
    description: 'Input Date',
  },
}

export const Interpolation = ({ format: formatArg, date: dateArg } = {}) => {
  const { t } = useTranslation(['storybook'])
  const date = sampleValue(I18nFormats[formatArg], dateArg)
  const textContent = t(`interpolation.${formatArg}`, { date })
  return <Typography>{textContent}</Typography>
}
Interpolation.args = {
  date: defaultDate.toLocaleString(),
  format: 'DateTimeRelative',
}
Interpolation.argTypes = {
  format: {
    control: {
      type: formatControlType,
      options: ['Date', 'Time', 'DateTime', 'DateTimeRelative'],
    },
    defaultValue: { summary: 'default' },
    description: 'Input Format: one of I18nFormats',
  },
  date: {
    control: {
      type: 'date',
      options: [defaultDate.toLocaleString()],
    },
    defaultValue: { summary: defaultDate.toLocaleString() },
    description: 'Input Date',
  },
}

export default {
  title: 'Translations',
  parameters: {
    notes: `${markdown}\n\n\t${formatI18nOptionsMarkdown()}`,
    controls: {
      hideNoControlsWarning: true,
      expanded: true,
    },
  },
  decorators: [Story => <Story />],
}

function formatI18nOptionsMarkdown() {
  return Object.entries(I18nFormats)
    .map(([key, value]) => `I18nFormats.${key}: "${value}"`)
    .join('\n\t')
}
