import cn from 'classnames'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Typography } from '@material-ui/core'

import { BasicEdit } from '@ues/assets'

import { ActionBar, Icon, IconButton } from '../../shared'
import { resetToDefaultLayout } from './AppGrid'
import useStyles from './BannerStyles'

export default memo(({ editMode, toggleEditMode }) => {
  const { t } = useTranslation()
  const classNames = useStyles()
  const resetLR = useMemo(() => t('common.list.resetToDefault'), [t])
  const saveLR = useMemo(() => t('dashboard.saveDashboard'), [t])

  return (
    <div role="banner" className={classNames.head}>
      <Typography variant="h2">{document.title}</Typography>
      <div className={classNames.buttonParent}>
        <ActionBar>
          <IconButton disabled={editMode} title={t('dashboard.editDashboard')} onClick={toggleEditMode}>
            <Icon icon={BasicEdit} />
          </IconButton>
        </ActionBar>
        {!editMode ? null : (
          <>
            <Button className={cn(classNames.button, 'reset')} title={resetLR} onClick={resetToDefaultLayout}>
              {resetLR}
            </Button>
            <Button className={cn(classNames.button, 'save')} title={saveLR} onClick={toggleEditMode}>
              {saveLR}
            </Button>
          </>
        )}
      </div>
    </div>
  )
})
