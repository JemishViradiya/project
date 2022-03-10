import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { ArrowNavPanelClose, ArrowNavPanelOpen } from '@ues/assets'

const useStyles = makeStyles((theme: any) => {
  return {
    headerActionButtons: {
      display: 'flex',
      flexDirection: 'row',
      verticalAlign: 'baseline',
      marginLeft: 'auto',
    },
    button: {
      marginRight: theme.spacing(3),
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
  }
})

const MapViewModeSwitch: React.FC<MapViewModeSwitchProps> = memo(({ onFullscreenToggle, showList }) => {
  const { t } = useTranslation('bis/ues')
  const styles = useStyles()

  const close = (
    <IconButton color="inherit" className={styles.button} title={t('bis/ues:geozones.showList')} onClick={onFullscreenToggle}>
      <ArrowNavPanelOpen />
    </IconButton>
  )
  const open = (
    <IconButton color="inherit" className={styles.button} title={t('bis/ues:geozones.showMap')} onClick={onFullscreenToggle}>
      <ArrowNavPanelClose />
    </IconButton>
  )
  return <div className={styles.headerActionButtons}>{showList ? open : close}</div>
})

type MapViewModeSwitchProps = {
  onFullscreenToggle: () => void
  showList: boolean
}

export default MapViewModeSwitch
