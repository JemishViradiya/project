import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'

import { BasicDelete } from '@ues/assets'
import { ProgressButton } from '@ues/behaviours'

interface ActionsProps {
  deletable: boolean
  canSave: boolean
  saving: boolean
  onDeleteClick: () => void
  onCloseClick: () => void
  onSaveClick: () => void
}

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
  },
  saveCancelButtonContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
  },
  saveButton: {
    marginLeft: spacing(4),
  },
}))

const Actions: React.FC<ActionsProps> = memo(({ deletable, saving, canSave, onDeleteClick, onCloseClick, onSaveClick }) => {
  const styles = useStyles()
  const { t } = useTranslation('behaviour/geozones-map')
  return (
    <Box className={styles.container}>
      {deletable && (
        <IconButton aria-label={t('popupGeozone.buttonRemoveAriaLabel')} size="small" onClick={onDeleteClick}>
          <BasicDelete />
        </IconButton>
      )}
      <Box className={styles.saveCancelButtonContainer}>
        <Button variant="outlined" onClick={onCloseClick}>
          {t('popupGeozone.buttonCancel')}
        </Button>
        <ProgressButton
          variant="contained"
          color="primary"
          onClick={onSaveClick}
          loading={saving}
          className={styles.saveButton}
          disabled={!canSave}
        >
          {t('popupGeozone.buttonSave')}
        </ProgressButton>
      </Box>
    </Box>
  )
})

export default Actions
