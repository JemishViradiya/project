import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { IconButton, Popper } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

import { BasicCalendar, BasicExport } from '@ues/assets'

import { Context as StateContext } from '../../providers/StateProvider'
import { Icon } from '../icons/Icon'
import { getTimeRange } from '../util/DateHelper'
import styles from './ActionBar.module.less'
import { default as RangePicker } from './RangePicker'

export const ActionBar = memo(({ onExport, children }) => {
  const { t } = useTranslation()
  const [rangePickerAnchorEl, setRangePickerAnchorEl] = useState(null)
  const { currentTimePeriod: timePeriod, updateTimePeriod, dataRetentionPeriod } = useContext(StateContext)

  const handleToggleRangePicker = useCallback(
    event => {
      if (rangePickerAnchorEl) {
        setRangePickerAnchorEl(null)
      } else {
        setRangePickerAnchorEl(event.currentTarget)
      }
    },
    [rangePickerAnchorEl],
  )

  const handleCloseRangePicker = useCallback(() => {
    setRangePickerAnchorEl(null)
  }, [])

  const onRangeChange = useCallback(
    value => {
      updateTimePeriod({ variables: value })
      handleCloseRangePicker()
    },
    [updateTimePeriod, handleCloseRangePicker],
  )

  const tooltip = useMemo(
    () => (
      <div className={styles.rangePickerContainer}>
        <RangePicker onChange={onRangeChange} dataRetentionPeriod={dataRetentionPeriod} />
      </div>
    ),
    [dataRetentionPeriod, onRangeChange],
  )

  const timeRange = useMemo(() => getTimeRange(timePeriod, t, dataRetentionPeriod), [timePeriod, t, dataRetentionPeriod])

  const rangeSelectorButton = useMemo(
    () => (
      <div>
        <IconButton title={t('dashboard.date.datePicker')} onClick={handleToggleRangePicker}>
          <Icon icon={BasicCalendar} />
        </IconButton>
      </div>
    ),
    [handleToggleRangePicker, t],
  )

  const exportButton = useMemo(
    () =>
      onExport ? (
        <IconButton title={t('common.export')} onClick={onExport}>
          <Icon icon={BasicExport} />,
        </IconButton>
      ) : null,
    [onExport, t],
  )

  return (
    <div>
      <Grid container justify="flex-end" alignItems="center">
        {!timeRange ? null : <span className={styles.timeRange}>{timeRange}</span>}
        <div className={styles.buttonContainer}>
          {!timeRange ? null : (
            <>
              {rangeSelectorButton}
              <Popper placement="bottom" open={!!rangePickerAnchorEl} anchorEl={rangePickerAnchorEl}>
                {tooltip}
              </Popper>
            </>
          )}
          {children}
          {exportButton}
        </div>
      </Grid>
    </div>
  )
})

ActionBar.propTypes = {
  onExport: PropTypes.func,
  children: PropTypes.node,
}

export default ActionBar
