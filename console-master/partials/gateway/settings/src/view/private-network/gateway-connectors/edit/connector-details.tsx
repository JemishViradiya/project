//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography } from '@material-ui/core'

import type { ConnectorConfigInfo } from '@ues-data/gateway'
import { Components, Config } from '@ues-gateway/shared'
import { BasicNewWindow, ChevronDown } from '@ues/assets'
import { ContentAreaPanel } from '@ues/behaviours'

import useStyles from './styles'

const { CodeViewer, ConnectorStatusIndicator, ConnectorStatusLabelType } = Components
const { GATEWAY_TRANSLATIONS_KEY } = Config

interface ConnectorDetailsProps {
  connector: Partial<ConnectorConfigInfo>
}

const ConnectorDetails: React.FC<ConnectorDetailsProps> = ({ connector }) => {
  const { t } = useTranslation(GATEWAY_TRANSLATIONS_KEY)
  const classes = useStyles()
  const { connectorId, privateUrl, authPublicKey } = connector ?? {}

  return (
    <ContentAreaPanel title={t('connectors.connectorDetails')}>
      <Grid container>
        <Grid item xs={2}>
          <Typography variant="subtitle2">{t('connectors.labelConnectorID')}</Typography>
        </Grid>
        <Grid item>
          <Typography>{connectorId}</Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={2}>
          <Typography variant="subtitle2">{t('connectors.labelPrivateURL')}</Typography>
        </Grid>
        <Grid item>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Typography>
              <a href={privateUrl} target="_blank" rel="noopener noreferrer">
                {privateUrl}
              </a>{' '}
            </Typography>
            <BasicNewWindow style={{ marginLeft: 8 }} className={classes.icon} />
          </Box>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={2}>
          <Typography variant="subtitle2">{t('common.labelStatus')}</Typography>
        </Grid>
        <Grid item>
          <ConnectorStatusIndicator labelType={ConnectorStatusLabelType.Status} connector={connector} />
        </Grid>
      </Grid>

      <Accordion variant="outlined">
        <AccordionSummary expandIcon={<ChevronDown />}>
          <Typography variant="h3">{t('connectors.labelPublicKey')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CodeViewer data={authPublicKey} />
        </AccordionDetails>
      </Accordion>
    </ContentAreaPanel>
  )
}

export default ConnectorDetails
