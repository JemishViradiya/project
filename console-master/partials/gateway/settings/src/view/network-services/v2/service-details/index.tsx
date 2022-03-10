//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'
import React from 'react'

import { Box, Typography } from '@material-ui/core'

import type { NetworkServicesV2 } from '@ues-data/gateway'
import { AriaElementLabel } from '@ues/assets-e2e'

import useStyles from './styles'

interface ServiceDetailsProps {
  data: Pick<NetworkServicesV2.NetworkServiceEntity, 'ipRanges' | 'fqdns'>
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ data }) => {
  const classes = useStyles()

  const showDetails = (items: string[] = []): React.ReactNode =>
    isEmpty(items) ? undefined : items.map(item => <Typography key={item}>{item}</Typography>)

  return (
    <Box className={classes.root}>
      <Box className={classes.content} aria-label={AriaElementLabel.NetworkServiceDetails}>
        {showDetails(data?.ipRanges)}
        {showDetails(data?.fqdns)}
      </Box>
    </Box>
  )
}

export default ServiceDetails
