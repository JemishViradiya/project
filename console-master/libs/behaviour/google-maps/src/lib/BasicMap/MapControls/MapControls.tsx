import React, { memo, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Portal } from 'react-portal'

import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'

import { BasicFullscreen, BasicFullscreenExit } from '@ues/assets'

import type { MapProps } from '../../GoogleMaps'
import { useGoogleMapContext } from '../../GoogleMaps'
import { Tooltip } from '../../Tooltip'
import MapTypeControls from './MapTypeControls'
import MapZoomControls from './MapZoomControls'

export interface MapControlsProps extends MapProps {
  zoomControls?: boolean
  mapTypeControls?: boolean
  isFullscreen?: boolean
  onFullscreenToggle?: () => void
}

const useStyles = makeStyles(theme => ({
  controls: {
    right: theme.spacing(4),
    bottom: theme.spacing(4),
    display: 'flex',
    position: 'absolute',
    flexDirection: 'column',
  },
  fullscreenControls: {
    right: theme.spacing(4),
    top: theme.spacing(4),
    position: 'absolute',
    background: theme.palette.background.default,
  },
}))

export const MapControls: React.FC<MapControlsProps> = memo(
  ({ zoomControls = true, mapTypeControls = true, minZoom, maxZoom, isFullscreen, onFullscreenToggle }) => {
    const { t } = useTranslation('behaviour/google-maps')
    const { google, map } = useGoogleMapContext()
    const controlsContainerElement = useMemo<HTMLDivElement>(() => document.createElement('div'), [])
    const fullscreenContainerElement = useMemo<HTMLDivElement>(() => document.createElement('div'), [])

    const styles = useStyles()

    useEffect(() => {
      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlsContainerElement)
      map.controls[google.maps.ControlPosition.RIGHT_TOP].push(fullscreenContainerElement)
    }, [controlsContainerElement, fullscreenContainerElement, google, map])

    return (
      <>
        <Portal node={controlsContainerElement}>
          <Box className={styles.controls}>
            {mapTypeControls && <MapTypeControls existsAlone={!zoomControls} />}
            {zoomControls && <MapZoomControls minZoom={minZoom} maxZoom={maxZoom} />}
          </Box>
        </Portal>
        <Portal node={fullscreenContainerElement}>
          {onFullscreenToggle && (
            <Box className={styles.fullscreenControls}>
              <Tooltip title={t(isFullscreen ? 'leaveFullscreen' : 'enterFullscreen')}>
                <IconButton size="small" color="default" onClick={onFullscreenToggle}>
                  {isFullscreen ? <BasicFullscreenExit /> : <BasicFullscreen />}
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Portal>
      </>
    )
  },
)

export default MapControls
