import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { makeStyles } from '@material-ui/core/styles'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { ChartTabPanel, useChartTabs } from '@ues-behaviour/dashboard'

import GeozoneRiskAlerts from './GeozoneRiskAlerts'
import IdentityRiskAlerts from './IdentityRiskAlerts'

const SELECTED_TAB_CLASS = 'selected'
const BUTTON_GROUP_HEIGHT_PX = 44

const useStyles = makeStyles(theme => ({
  buttonGroup: {
    marginBottom: theme.spacing(2),
  },
}))

const CombinedRiskAlerts: React.FC<ChartProps> = memo(({ id, height, ...restProps }) => {
  const { t } = useTranslation('bis/ues')
  const { currentTabIndex, handleTabChange } = useChartTabs({ id })
  const styles = useStyles()

  const props = { id, height: height - BUTTON_GROUP_HEIGHT_PX, ...restProps }

  return (
    <>
      <ButtonGroup disableRipple className={styles.buttonGroup}>
        <Button onClick={handleTabChange} data-index="0" className={currentTabIndex === 0 ? SELECTED_TAB_CLASS : ''}>
          {t('dashboard.combinedRiskAlertsIdentityTabTitle')}
        </Button>
        <Button onClick={handleTabChange} data-index="1" className={currentTabIndex === 1 ? SELECTED_TAB_CLASS : ''}>
          {t('dashboard.combinedRiskAlertsGeozoneTabTitle')}
        </Button>
      </ButtonGroup>
      <ChartTabPanel value={currentTabIndex} index={0}>
        <IdentityRiskAlerts {...props} />
      </ChartTabPanel>
      <ChartTabPanel value={currentTabIndex} index={1}>
        <GeozoneRiskAlerts {...props} />
      </ChartTabPanel>
    </>
  )
})

export default CombinedRiskAlerts
