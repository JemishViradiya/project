import { cond } from 'lodash-es'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Box, Button, ButtonGroup, Typography } from '@material-ui/core'
import Chip from '@material-ui/core/Chip'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { TopList, useChartTabs } from '@ues-behaviour/dashboard'
import type { TopTenLists } from '@ues-data/epp'
import { EppDashboardData } from '@ues-data/epp'

const TabKeys = ['Threats', 'Devices', 'Zones']

const TabbedList: React.FC<{ id: string; topTenThreats: TopTenLists }> = React.memo(({ id, topTenThreats }) => {
  const { currentTabIndex, handleTabChange } = useChartTabs({ id })

  const topThreats = useMemo(() => topTenThreats[TabKeys[currentTabIndex]].map(item => ({ label: item.ItemCaption })), [
    currentTabIndex,
    topTenThreats,
  ])

  const { t } = useTranslation(['epp/protect'])

  const renderTabCaption = cond([
    [idx => idx === 0, () => <Typography variant="h5">{t('topTenLists.Threatsfoundonthemostdevices')}</Typography>],
    [idx => idx === 1, () => <Typography variant="h5">{t('topTenLists.Deviceswiththemostthreats')}</Typography>],
    [idx => idx === 2, () => <Typography variant="h5">{t('topTenLists.Zoneswiththemostthreats')}</Typography>],
  ])

  const renderEmptyDataCaption = cond([
    [
      () => currentTabIndex === 0 && topTenThreats.Threats.length === 0,
      () => <Typography variant="body2">{t('topTenLists.NoThreatsfound')}</Typography>,
    ],
    [
      () => currentTabIndex === 1 && topTenThreats.Devices.length === 0,
      () => <Typography variant="body2">{t('topTenLists.NoDevicesfound')}</Typography>,
    ],
    [
      () => currentTabIndex === 2 && topTenThreats.Zones.length === 0,
      () => <Typography variant="body2">{t('topTenLists.NoZonesfound')}</Typography>,
    ],
  ])

  return (
    <div>
      <ButtonGroup size="small" color="secondary">
        <Button onClick={handleTabChange} data-index="0" key={0} variant={currentTabIndex === 0 ? 'contained' : 'outlined'}>
          {t('topTenLists.Threats')}
        </Button>
        <Button onClick={handleTabChange} data-index="1" key={1} variant={currentTabIndex === 1 ? 'contained' : 'outlined'}>
          {t('topTenLists.Devices')}
        </Button>
        <Button onClick={handleTabChange} data-index="2" key={2} variant={currentTabIndex === 2 ? 'contained' : 'outlined'}>
          {t('topTenLists.Zones')}
        </Button>
      </ButtonGroup>
      <Box pt={2}>{renderTabCaption(currentTabIndex)}</Box>
      {renderEmptyDataCaption(currentTabIndex)}
      {<TopList data={topThreats} />}
    </div>
  )
})

const TopTenThreats = (props: ChartProps): JSX.Element => {
  const { topTenLists } = useSelector(state => state[EppDashboardData.EppDashboardReduxSlice].tasks)
  return (
    <Box display="flex" justifyContent="space-between">
      {topTenLists.loading || <TabbedList id={props.id} topTenThreats={topTenLists.result} />}
      <Chip size="small" variant="default" label={'Max'} clickable={false} />
    </Box>
  )
}

export { TopTenThreats }
