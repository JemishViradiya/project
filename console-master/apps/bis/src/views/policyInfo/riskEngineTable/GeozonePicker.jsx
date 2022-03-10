import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TooltipTrigger from 'react-popper-tooltip'

import { BasicAdd } from '@ues/assets'

import GeozoneIcon from '../../../components/icons/GeozoneIcon'
import { Context as GeozoneContext, getSortedGeozones } from '../../../providers/GeozoneListProvider'
import { Icon, IconButton, RiskLevel } from '../../../shared'
import styles from './GeozonePicker.module.less'

const GeozoneRow = memo(({ geozone, onAddGeozone, index }) => {
  const onGeozoneClick = useCallback(() => {
    onAddGeozone && onAddGeozone(geozone.id, geozone.risk)
  }, [geozone.id, geozone.risk, onAddGeozone])
  return (
    <div className={styles.row} role="menuitem" data-index={index} tabIndex="-1" onClick={onGeozoneClick}>
      <GeozoneIcon level={geozone.risk} />
      <span className={styles.label}>{geozone.name}</span>
    </div>
  )
})

const GeozonePlaceholder = memo(() => {
  const { t } = useTranslation()
  return (
    <div className={styles.rowBase}>
      <span className={styles.label}>{t('policies.details.noMoreCustomGeozones')}</span>
    </div>
  )
})

const GeozonePicker = memo(({ disabled, pickedSettings, defaultActions, onAddGeozone, onAddUndefinedGeozone, t }) => {
  const { data } = useContext(GeozoneContext)
  const sortedZones = useMemo(() => getSortedGeozones(data, pickedSettings), [data, pickedSettings])

  const [showPicker, setShowPicker] = useState(false)
  const doAddGeozone = useCallback(
    (id, risk) => {
      setShowPicker(false)
      onAddGeozone(id, risk)
    },
    [onAddGeozone, setShowPicker],
  )
  const doAddUndefinedGeozone = useCallback(
    event => {
      setShowPicker(false)
      onAddUndefinedGeozone(event)
    },
    [onAddUndefinedGeozone],
  )

  const renderGeozoneList = useCallback(
    ({ getTooltipProps, tooltipRef }) => {
      return (
        <div role="menu" className={styles.container} {...getTooltipProps({ ref: tooltipRef })}>
          <div className={styles.desc}>{t('policies.details.selectGeozone')}</div>
          <hr className={styles.hr} />
          {!defaultActions && (
            <div className={styles.row} role="menuitem" data-index="0" tabIndex="-1" onClick={doAddUndefinedGeozone}>
              <GeozoneIcon level={RiskLevel.UNKNOWN} />
              <span className={styles.label}>{t('policies.details.undefinedGeozone')}</span>
            </div>
          )}
          {sortedZones.map((geozone, index) => (
            <GeozoneRow
              key={geozone.id}
              index={defaultActions ? index : index + 1}
              geozone={geozone}
              pickedSettings={pickedSettings}
              onAddGeozone={doAddGeozone}
            />
          ))}
          {sortedZones.length === 0 && defaultActions && <GeozonePlaceholder />}
        </div>
      )
    },
    [t, defaultActions, doAddUndefinedGeozone, sortedZones, pickedSettings, doAddGeozone],
  )

  return (
    <TooltipTrigger
      trigger="click"
      placement="bottom-end"
      tooltipShown={showPicker}
      onVisibilityChange={setShowPicker}
      tooltip={renderGeozoneList}
    >
      {({ getTriggerProps, triggerRef }) => (
        <span
          role="button"
          aria-haspopup="true"
          aria-expanded={showPicker}
          className={disabled ? styles.disabled : undefined}
          {...getTriggerProps({ ref: triggerRef })}
        >
          <IconButton size="small" disabled={disabled}>
            <Icon title={t('policies.details.addCustomActionsDefinedGeozones')} icon={BasicAdd} />
          </IconButton>
        </span>
      )}
    </TooltipTrigger>
  )
})

GeozonePicker.displayName = 'GeozonePicker'

GeozonePicker.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf([PropTypes.node]), PropTypes.node]),
}

export default GeozonePicker
