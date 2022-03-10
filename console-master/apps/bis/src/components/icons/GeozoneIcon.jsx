import PropTypes from 'prop-types'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'

import { getRiskLevelColor } from '@ues-bis/shared'
import { BasicGeozoneRadius, BasicGeozoneShape } from '@ues/assets'

import { Icon } from './Icon'

const GeozoneIcon = memo(({ zone, level, size, marginTop }) => {
  const { t } = useTranslation()
  const { typography } = useTheme()
  const riskLevel = zone ? zone.risk : level
  const style = useMemo(() => {
    // TODO: Eventually we need to get proper geozone information
    // from events so we can render the icons with the proper info.
    const color = getRiskLevelColor(riskLevel)

    return {
      marginTop,
      fontSize: size === 'normal' ? typography?.subtitle1?.fontSize : typography?.h2?.fontSize,
      color,
    }
  }, [riskLevel, marginTop, size, typography?.subtitle1?.fontSize, typography?.h2?.fontSize])

  let icon = BasicGeozoneShape
  if (zone && zone.geometry.type === 'Circle') {
    icon = BasicGeozoneRadius
  }
  const title = t(`risk.geozone.${(riskLevel || 'UNKNOWN').toLowerCase()}`)
  return <Icon aria-label={title} title={title} icon={icon} style={style} />
})

GeozoneIcon.displayName = 'GeozoneIcon'
GeozoneIcon.propTypes = {
  zone: PropTypes.shape({
    geometry: PropTypes.shape({
      type: PropTypes.string.isRequired,
    }).isRequired,
    risk: PropTypes.string.isRequired,
  }),
  size: PropTypes.string,
  level: PropTypes.string,
}

export default GeozoneIcon
