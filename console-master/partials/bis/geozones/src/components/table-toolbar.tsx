import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { BasicDelete } from '@ues/assets'

const useStyles = makeStyles((theme: any) => {
  return {
    selectedCount: {
      marginRight: theme.spacing(4),
    },
    totalResults: {
      height: theme.spacing(10),
    },
  }
})

export const TotalResults: React.FC<{ total: number }> = ({ total }) => {
  const { t } = useTranslation(['bis/ues', 'general/form'])
  const styles = useStyles()

  return (
    <div className={styles.totalResults}>
      <Typography component="span" variant="body2">
        {t('bis/ues:geozones.table.toolbar.totalResults', { total: total })}
      </Typography>
    </div>
  )
}
export const SelectedResults: React.FC<{ selectedCount: number; onDelete: () => void }> = ({ selectedCount, onDelete }) => {
  const { t } = useTranslation('bis/ues')
  const styles = useStyles()

  return (
    <div>
      {selectedCount > 0 ? (
        <Typography component="span" variant="body2" className={styles.selectedCount}>
          {t('bis/ues:geozones.table.toolbar.totalSelected', { total: selectedCount })}
        </Typography>
      ) : null}

      {selectedCount >= 1 ? (
        <Button startIcon={<BasicDelete />} variant="contained" color="primary" onClick={onDelete}>
          {t('general/form:commonLabels.remove')}
        </Button>
      ) : null}
    </div>
  )
}
