import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { BasicMap, BasicViewList } from '@ues/assets'

import { Icon } from '../icons/Icon'
import { default as ActionBar } from './ActionBar'
import IconButton from './IconButton'

const MapViewModeSwitch = memo(({ showMap, onShowMap, onHideMap }) => {
  const { t } = useTranslation()

  return (
    <ActionBar>
      <IconButton color={showMap ? 'inherit' : 'primary'} title={t('usersEvents.switchMapViewListOnly')} onClick={onHideMap}>
        <Icon icon={BasicViewList} />
      </IconButton>
      <IconButton color={showMap ? 'primary' : 'inherit'} title={t('usersEvents.switchMapViewWithMap')} onClick={onShowMap}>
        <Icon icon={BasicMap} />
      </IconButton>
    </ActionBar>
  )
})

MapViewModeSwitch.propTypes = {
  showMap: PropTypes.bool.isRequired,
  onHideMap: PropTypes.func.isRequired,
  onShowMap: PropTypes.func.isRequired,
}

export default MapViewModeSwitch
