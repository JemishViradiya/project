import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { Theme } from '@material-ui/core/'
import { Icon, IconButton, makeStyles } from '@material-ui/core/'

import { BasicAdd, BasicMinus } from '@ues/assets'

import { useGoogleMapContext } from '../../GoogleMaps'
import mapConfig from '../../GoogleMaps/mapConfig'
import { Tooltip } from '../../Tooltip'
import { useZoomListener } from '../../utils/use-zoom-listener'

const useStyles = makeStyles((theme: Theme) => ({
  zoomButtons: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
  },
}))

interface MapZoomControlsProps {
  minZoom?: number
  maxZoom?: number
}

const MapZoomControls: React.FC<MapZoomControlsProps> = memo(
  ({ minZoom = mapConfig.zoom.defaultMinZoom, maxZoom = mapConfig.zoom.defaultMaxZoom }) => {
    const { t } = useTranslation(['behaviour/google-maps', 'general/form'])
    const styles = useStyles()
    const zoomLevel = useZoomListener(null)
    const { map } = useGoogleMapContext()

    const zoomInState = useMemo(() => zoomLevel >= maxZoom, [maxZoom, zoomLevel])
    const zoomOutState = useMemo(() => zoomLevel <= minZoom, [minZoom, zoomLevel])
    const zoomInLR = useMemo(() => t('general/form:commonLabels.zoomIn'), [t])
    const zoomOutLR = useMemo(() => t('general/form:commonLabels.zoomOut'), [t])
    const zoomIn = useCallback(() => map.setZoom(map.getZoom() + 1), [map])
    const zoomOut = useCallback(() => map.setZoom(map.getZoom() - 1), [map])
    return (
      <div data-testid="zoombuttons" className={styles.zoomButtons}>
        <Tooltip title={zoomInLR}>
          <IconButton data-testid="zoomin" onClick={zoomIn} disabled={zoomInState} size="small">
            <Icon aria-label={zoomInLR} component={BasicAdd} />
          </IconButton>
        </Tooltip>
        <Tooltip title={zoomOutLR}>
          <IconButton data-testid="zoomout" onClick={zoomOut} disabled={zoomOutState} size="small">
            <Icon aria-label={zoomOutLR} component={BasicMinus} />
          </IconButton>
        </Tooltip>
      </div>
    )
  },
)

export default MapZoomControls
