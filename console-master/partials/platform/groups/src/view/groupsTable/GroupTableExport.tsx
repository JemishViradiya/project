import type { TFunction } from 'i18next'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Dialog, FormControl, FormControlLabel, FormGroup, IconButton, Radio, Typography } from '@material-ui/core'

import { GroupsApi } from '@ues-data/platform'
import { useStatefulApolloLazyQuery } from '@ues-data/shared'
import { BasicExport, I18nFormats } from '@ues/assets'
import type { UseControlledDialogProps } from '@ues/behaviours'
import { DialogChildren, useControlledDialog, useSnackbar, useTableFilter, useTableSort } from '@ues/behaviours'

import { buildGroupQuery } from './filterResolver'

const radioButtons = ['everything', 'currentFilters']
const getFileName = (filtered, i18n) => {
  return `GroupsList_${filtered ? 'Filtered_' : ''}${i18n.format(new Date(), I18nFormats.DateShort)}.csv`
}

// TODO: Replace with shared export component when ready
const triggerDownload = (data, isFiltered, i18n) => {
  const blob = new Blob(['\ufeff', data], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)

  let link: any = document.getElementById('global-download-link')
  if (link) {
    URL.revokeObjectURL(link.href)
    link.download = getFileName(isFiltered, i18n)
    link.href = url
  } else {
    link = document.createElement('a')
    link.id = 'global-download-link'
    link.style.display = 'none'
    link.download = getFileName(isFiltered, i18n)
    link.href = url
    document.body.appendChild(link)
  }
  link.click()
}

const localizeHeaders = (data: string, t: TFunction) => {
  const headerEndPosition = data.indexOf('\r\n')
  const header = data.slice(0, headerEndPosition)
  const content = data.slice(headerEndPosition)

  const localizedHeaders = header
    .split(',')
    .map(h => t(`groups.export.${h}`))
    .join(',')
  return localizedHeaders + content
}

const ExportDialog = ({ open, onClose, onSubmit }) => {
  const { t } = useTranslation(['platform/common', 'general/form'])
  const [selectedRadio, setSelectedRadio] = useState(0)
  const handleSelectRadio = (event, idx) => {
    setSelectedRadio(idx)
  }

  const callSubmit = useCallback(() => {
    onSubmit(selectedRadio)
  }, [onSubmit, selectedRadio])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogChildren
        title={t('groups.export.title')}
        description={t('groups.export.description')}
        onClose={onClose}
        content={
          <FormGroup>
            {radioButtons.map((value, index) => (
              <FormControl key={value}>
                <FormControlLabel
                  control={
                    <Radio name={'radio' + index} onClick={e => handleSelectRadio(e, index)} checked={selectedRadio === index} />
                  }
                  label={<Typography variant="body2">{t(`groups.export.${value}`)}</Typography>}
                  id={'button' + index}
                />
              </FormControl>
            ))}
          </FormGroup>
        }
        actions={
          <>
            <Button variant="outlined" onClick={onClose}>
              {t('general/form:commonLabels.cancel')}
            </Button>
            <Button variant="contained" color="primary" type="submit" onClick={callSubmit}>
              {t('general/form:commonLabels.export')}
            </Button>
          </>
        }
      />
    </Dialog>
  )
}

export const GroupTableExport = () => {
  const { t, i18n } = useTranslation(['platform/common', 'general/form'])
  const snackbar = useSnackbar()

  const [dialogStateId, setDialogStateId] = useState<UseControlledDialogProps['dialogId']>()
  const { open, onClose } = useControlledDialog({
    dialogId: dialogStateId,
    onClose: useCallback(reason => {
      setDialogStateId(undefined)
    }, []),
  })

  const filterProps = useTableFilter()
  const { sort, sortDirection } = useTableSort()
  const [filtered, setFiltered] = useState(false)

  const groupsVars = useMemo(() => {
    const query = buildGroupQuery(filterProps)
    return { sortBy: `${sort} ${sortDirection?.toUpperCase()}`, query }
  }, [sort, sortDirection, filterProps])

  const [doExport, { error }] = useStatefulApolloLazyQuery(GroupsApi.queryGroupsExport, {
    fetchPolicy: 'network-only',
    onCompleted: data => data?.userGroupsCsv && triggerDownload(localizeHeaders(data.userGroupsCsv.data, t), filtered, i18n),
  })

  const onExportClick = useCallback(event => {
    setDialogStateId(Symbol('export-dialog'))
  }, [])

  const onSubmit = useCallback(
    filtersFlag => {
      if (filtersFlag === 1) {
        setFiltered(true)
        doExport({ variables: groupsVars })
      } else {
        setFiltered(false)
        doExport({ variables: {} })
      }
      onClose()
    },
    [groupsVars, doExport, onClose],
  )

  useEffect(() => {
    if (error) {
      snackbar.enqueueMessage(t('groups.export.groupExportFailure'), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, t])

  return (
    <>
      <IconButton onClick={onExportClick}>
        <BasicExport />
      </IconButton>
      <ExportDialog open={open} onClose={onClose} onSubmit={onSubmit} />
    </>
  )
}
