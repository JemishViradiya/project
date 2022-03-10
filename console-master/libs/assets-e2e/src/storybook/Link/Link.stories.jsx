import React from 'react'

import { action } from '@storybook/addon-actions'

import Link from '@material-ui/core/Link'

import markdown from './Link.md'

const preventDefault = event => {
  event.preventDefault()
  action('clicked')
}

export const base = () => {
  return (
    <>
      <Link href="#" onClick={preventDefault} variant="inherit" color="primary">
        Default link
      </Link>
      <p />
      <Link href="#" onClick={preventDefault} variant="inherit" color="secondary">
        Secondary link
      </Link>
    </>
  )
}

export default {
  title: 'Link',
  parameters: {
    notes: markdown,
    'in-dsm': { id: '5f8ef5b468ce652fcf0bb9ba' },
    controls: {
      hideNoControlsWarning: true,
    },
  },
}
