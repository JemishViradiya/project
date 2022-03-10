import cn from 'classnames'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ClickAwayListener, IconButton, Typography } from '@material-ui/core'
import InfoOutlined from '@material-ui/icons/InfoOutlined'
import SaveAlt from '@material-ui/icons/SaveAlt'
import Visibility from '@material-ui/icons/Visibility'

import { useDrawerStyles } from '@ues-info/shared'
import { BasicNoteEmpty } from '@ues/assets'

import { useEventsPermissions } from '../useEventsPermission'

const FileDetailsView = ({ data, handleEvidenceFileDownload }) => {
  const { t } = useTranslation(['dlp/common'])
  const classNames = useDrawerStyles()
  const [isFileSummaryDialogOpen, setFileSummaryDialogOpen] = useState<boolean>(false)
  const [isFileSnippetsDialogOpen, setFileSnippetsDialogOpen] = useState<boolean>(false)
  const fileSummaryDialogClickEvent = useRef(null)
  const fileSnippetsDialogClickEvent = useRef(null)

  const { canReadSettings, canReadFileSummary, canReadFileContent } = useEventsPermissions()

  const fileSummaryDialogOpen = function (e) {
    fileSummaryDialogClickEvent.current = e.nativeEvent
    setFileSummaryDialogOpen(true)
  }

  const onClickAway = (e: React.MouseEvent<Document>) => {
    if (e !== fileSummaryDialogClickEvent.current) {
      setFileSummaryDialogOpen(false)
    }
    if (e !== fileSnippetsDialogClickEvent.current) {
      setFileSnippetsDialogOpen(false)
    }
  }

  const fileSnippetsDialogOpen = e => {
    fileSnippetsDialogClickEvent.current = e.nativeEvent
    setFileSnippetsDialogOpen(true)
  }

  const getFileType = fileType => {
    const format = fileType?.replace('.', '')
    if (!format) {
      return null
    }
    switch (format) {
      case 'txt':
        return t('events.drawer.fileSection.txtFileFormat')
      case 'doc':
      case 'docx':
        return t('events.drawer.fileSection.doc(x)FileFormat')
      case 'xlsx':
        return t('events.drawer.fileSection.xlsxFileFormat')
      case 'pdf':
        return t('events.drawer.fileSection.pdfFileFormat')
      default:
        return t('events.drawer.fileSection.defaultFileFormat', { format: format })
    }
  }

  const nonEmptySnippetDetails = data?.dataEntityDetails.filter(i => i.snippetDetails?.length !== 0)

  const printOutSnippets = d => {
    return d?.snippetDetails.length
      ? d.snippetDetails.map((s, i) => {
          return <li key={`${s?.dataEntityGuid}-${i}`}>"{s?.content}"</li>
        })
      : null
  }
  return (
    <div className={classNames.fileDetailsIcons}>
      {canReadSettings && canReadFileSummary && (
        <IconButton size="small">
          <InfoOutlined onClick={fileSummaryDialogOpen} className={classNames.icon} />
        </IconButton>
      )}
      {canReadFileSummary && (
        <IconButton size="small" className={classNames.icon}>
          <Visibility onClick={fileSnippetsDialogOpen} />
        </IconButton>
      )}
      {canReadFileContent && (
        <IconButton size="small" className={classNames.icon}>
          <SaveAlt className={classNames.saveAlt} onClick={handleEvidenceFileDownload} />
        </IconButton>
      )}
      <ClickAwayListener onClickAway={event => onClickAway(event)}>
        <div className={cn(classNames.fileSummaryDialog, { opened: isFileSummaryDialogOpen })}>
          <div className={classNames.fileSummaryHeading}>
            <span className={classNames.fileIcon}>
              <BasicNoteEmpty />
            </span>
            <div className={classNames.fileInfo}>
              <Typography variant="h2" gutterBottom>
                {data.fileName}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                <div>{getFileType(data.fileType)}</div>
                {data.fileSize} KB
              </Typography>
            </div>
          </div>
          <Typography variant="body2" className={classNames.fileInfoTitle}>
            {t('events.drawer.fileSection.sensitiveData')}
          </Typography>
          {data?.dataEntityDetails.map((d, i) => {
            return (
              <div key={`${d.dataEntityName}-${i}`} className={classNames.dataEntites}>
                {d.numberOfOccurrence ? `${d.dataEntityName} (${d.numberOfOccurrence})` : null}
              </div>
            )
          })}
        </div>
      </ClickAwayListener>
      <ClickAwayListener onClickAway={event => onClickAway(event)}>
        <div className={cn(classNames.fileSummaryDialog, { opened: isFileSnippetsDialogOpen })}>
          <div className={classNames.fileSummaryHeading}>
            <span className={classNames.fileIcon}>
              <BasicNoteEmpty />
            </span>
            <div className={classNames.fileInfo}>
              <Typography variant="h2" gutterBottom>
                {data.fileName}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                <div>{getFileType(data.fileType)}</div>
                {data.fileSize} KB
              </Typography>
            </div>
          </div>
          <Typography variant="body2" className={classNames.fileInfoTitle}>
            {nonEmptySnippetDetails.length === 0
              ? t('events.drawer.fileSection.emptySnippets')
              : t('events.drawer.fileSection.contentSnippets')}
          </Typography>
          <ol className={classNames.snipetsList}>
            {nonEmptySnippetDetails.length === 0
              ? null
              : nonEmptySnippetDetails.map((d, i) => {
                  return printOutSnippets(d)
                })}
          </ol>
        </div>
      </ClickAwayListener>
    </div>
  )
}

export default FileDetailsView
