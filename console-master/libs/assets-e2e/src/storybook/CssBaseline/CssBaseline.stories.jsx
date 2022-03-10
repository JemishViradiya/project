/* eslint-disable jsx-a11y/anchor-is-valid */
// dependencies
import React from 'react'

// components
import { Typography } from '@material-ui/core'

export const cssBaseline = () => (
  <>
    <Typography variant="body2">Some Typography Text</Typography>
    Text Outside Typography
    <br />
    <a>Link with no href, onClick, or styling</a>
  </>
)

export default {
  title: 'Css Basline',
}
