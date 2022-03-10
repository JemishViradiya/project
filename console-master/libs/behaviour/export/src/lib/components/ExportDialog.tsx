import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Dialog, FormControlLabel, Radio, RadioGroup } from '@material-ui/core'

import { DialogChildren } from '@ues/behaviours'

export const ExportDialog: React.FC<{
  title?: string
  description?: string
  isDownloading?: boolean
  isFilterable?: boolean
  onSubmit: ({ filtered: boolean }) => unknown
  open: boolean
  onClose: React.Dispatch<React.SetStateAction<unknown>>
}> = ({ onSubmit, title, description, isDownloading, isFilterable, open, onClose }) => {
  const [type, setType] = useState<'filtered' | 'all'>('all')
  const { t } = useTranslation('general/form')
  const titleValue = title ?? t('general/form:exportDialog.title')
  const descriptionValue = description ?? t('general/form:exportDialog.description')

  const handleChange = React.useCallback(event => {
    setType(event.target.value || 'all')
  }, [])
  const callSubmit = React.useCallback(() => {
    onSubmit({ filtered: type === 'filtered' })
  }, [onSubmit, type])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogChildren
        title={titleValue}
        description={descriptionValue}
        onClose={onClose}
        content={
          isFilterable && (
            <RadioGroup name="filters" value={type} onChange={handleChange}>
              <FormControlLabel
                value="all"
                control={<Radio />}
                label={t('general/form:exportDialog.options.labelAll')}
                disabled={isDownloading}
              />
              <FormControlLabel
                value="filtered"
                control={<Radio />}
                label={t('general/form:exportDialog.options.labelFiltered')}
                disabled={isDownloading}
              />
            </RadioGroup>
          )
        }
        actions={
          <>
            <Button disabled={isDownloading} variant="outlined" onClick={onClose}>
              {t('general/form:commonLabels.cancel')}
            </Button>
            <Button disabled={isDownloading} variant="contained" color="primary" type="submit" onClick={callSubmit}>
              {t(isDownloading ? 'general/form:commonLabels.downloading' : 'general/form:commonLabels.export')}
            </Button>
          </>
        }
      />
    </Dialog>
  )
}

export type ExportDialogType = typeof ExportDialog
