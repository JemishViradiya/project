//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import React, { memo, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Card, makeStyles, Typography } from '@material-ui/core'

import { ExportAction } from '@ues-behaviour/export'
import type { XGridProps } from '@ues-behaviour/x-grid'
import { XGrid } from '@ues-behaviour/x-grid'
import { HelpLinkScope, usePlatformHelpLink } from '@ues-platform/shared'
import {
  AppliedFilterPanel,
  PageTitlePanel,
  TableBasicContext,
  TableFilterContext,
  TableToolbar,
  useBasicTable,
  useFilterLabels,
  usePageTitle,
} from '@ues/behaviours'

import { EndpointTableActions } from './EndpointTableActions'
import { getFilterLabels, useColumns } from './filters'

const ENDPOINTS_TRANSLATIONS = 'platform/endpoints'

const useStyles = makeStyles(theme => ({
  outerContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  paperContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(6),
  },
  backdrop: {
    zIndex: theme.zIndex.snackbar,
  },
  totalCount: {
    paddingRight: theme.spacing(1),
  },
}))

const AppliedFilters: React.FC = memo(() => {
  const { t } = useTranslation([ENDPOINTS_TRANSLATIONS])
  const filterProps = useContext(TableFilterContext)
  const columns = useColumns()
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns, getFilterLabels(t))

  return <AppliedFilterPanel {...filterProps} {...filterLabelProps} />
})

const EndpointsCountAndExport: React.FC<{ exportAction: any }> = ({ exportAction }) => {
  const { t } = useTranslation([ENDPOINTS_TRANSLATIONS])
  const { totalCount } = useBasicTable()
  const classes = useStyles()

  return (
    <Box display="flex" alignItems="center">
      <Typography variant="body2" className={classes.totalCount}>
        {t('endpoint.resultsCount', { value: totalCount })}
      </Typography>
      <ExportAction exportAction={exportAction} />
    </Box>
  )
}

export const Layout: React.FC<{
  tableProps: XGridProps
  selectedCount: number
  onDelete: () => void
  exportAction: any
}> = memo(({ tableProps, selectedCount, onDelete, exportAction }) => {
  const { t } = useTranslation([ENDPOINTS_TRANSLATIONS])
  const { outerContainer, paperContainer } = useStyles()

  usePageTitle(t('endpoints.title'))
  return (
    <Box className={outerContainer}>
      <PageTitlePanel
        title={[t('endpoints.sectionTitle'), t('endpoints.title')]}
        borderBottom
        helpId={usePlatformHelpLink(HelpLinkScope.MOBILE_DEVICES)}
      />
      <Card variant="outlined" className={paperContainer}>
        <TableToolbar
          bottom={<AppliedFilters />}
          begin={<EndpointTableActions selectedCount={selectedCount} onDelete={onDelete} />}
          end={<EndpointsCountAndExport exportAction={exportAction} />}
        />
        <XGrid {...tableProps} noRowsMessageKey={'general/form:commonLabels.noData'} />
      </Card>
    </Box>
  )
})
