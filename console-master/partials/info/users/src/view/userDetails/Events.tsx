import React from 'react'

import { Box } from '@material-ui/core'

import { EventList } from '@ues-info/protect-info'
import { ContentAreaPanel, SecuredContentBoundary } from '@ues/behaviours'

import makeStyles from '../styles'

const Events = () => {
  const classes = makeStyles()
  return (
    <Box className={classes.container}>
      <Box className={classes.content}>
        <ContentAreaPanel fullHeight fullWidth ContentWrapper={SecuredContentBoundary}>
          <EventList />
        </ContentAreaPanel>
      </Box>
    </Box>
  )
}

export default Events
