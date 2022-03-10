import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Button, Dialog } from '@material-ui/core'

import type { MobileProtectData } from '@ues-data/mtd'
import { getParseAppFile, mutationParseAppFile } from '@ues-data/mtd'
import { usePrevious, useStatefulReduxMutation } from '@ues-data/shared'
import { DialogChildren, FileUpload, ProgressButton, useSnackbar } from '@ues/behaviours'

export interface AppUploadDialogProps<T> {
  openDialog: boolean
  resultType: MobileProtectData.AppUploadParseResultType
  iosEnabled?: boolean
  onClose?: () => void
  onSubmit?: (parsedAppInfo: T) => void
}

const AppFileUploadDialog: React.FC<AppUploadDialogProps<MobileProtectData.IParsedAppInfo>> = ({
  openDialog,
  onClose,
  onSubmit,
  resultType,
  iosEnabled = true,
}) => {
  const { t } = useTranslation(['mtd/common'])
  const snackbar = useSnackbar()

  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File>(null)
  const [fileContent, setFileContent] = useState<ArrayBuffer>()

  const setDefaultValues = () => {
    setLoading(false)
    setSelectedFile(null)
    setFileContent(null)
  }

  const onCloseHandler = () => {
    setDefaultValues()
    onClose()
  }

  const handleSelectFiles = (files: Array<File>) => {
    const file = files[0]
    setSelectedFile(file)

    const fileReader = new FileReader()
    fileReader.onloadend = ev => {
      setFileContent(ev.target.result as ArrayBuffer)
    }
    fileReader.readAsArrayBuffer(file)
  }

  const [parseAppFileAction, parseAppFileTask] = useStatefulReduxMutation(mutationParseAppFile)

  const parsedAppInfo: MobileProtectData.IParsedAppInfo = useSelector(getParseAppFile)

  const parseAppFileTaskPrev = usePrevious(parseAppFileTask)
  useEffect(() => {
    if (!parseAppFileTask.loading && parseAppFileTaskPrev.loading && parseAppFileTask.error) {
      const statusCode: number = (parseAppFileTask as any).error.response?.data?.subStatusCode
      snackbar.enqueueMessage(getErrorMessage(statusCode), 'error')
      setDefaultValues()
    } else if (!parseAppFileTask.loading && parseAppFileTaskPrev.loading) {
      if (!iosEnabled && parseAppFileTask.data?.platform == 'IOS') {
        snackbar.enqueueMessage(t('exclusion.appFileUpload.errorUnsupportedFileType'), 'error')
      } else if (onSubmit && loading) {
        if (parsedAppInfo.fileName == selectedFile.name) {
          onSubmit(parsedAppInfo)
        } else {
          parseAppFileAction({ fileName: selectedFile.name, content: fileContent, resultType: resultType })
          return
        }
      }
      setDefaultValues()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parseAppFileTask])

  const getErrorMessage = (statusCode: number) => {
    if (statusCode === 100) {
      if (iosEnabled) {
        return t('exclusion.appFileUpload.errorUnsupportedFileTypeNotIPAOrAPK')
      } else {
        return t('exclusion.appFileUpload.errorUnsupportedFileTypeNotAPK')
      }
    } else if (statusCode === 143 || statusCode === 101) {
      return t('exclusion.appFileUpload.parseError')
    } else if ((statusCode >= 120 && statusCode <= 124) || (statusCode >= 140 && statusCode <= 147)) {
      return t('exclusion.appFileUpload.invalidContentError')
    } else {
      return t('exclusion.appFileUpload.error')
    }
  }

  const handleFileSubmission = () => {
    if (selectedFile && !loading) {
      setLoading(true)
      parseAppFileAction({ fileName: selectedFile.name, content: fileContent, resultType: resultType })
    }
  }

  return (
    <Dialog open={openDialog} onClose={onCloseHandler} maxWidth="sm" fullWidth={true}>
      <DialogChildren
        title={t('exclusion.appFileUpload.title')}
        description={
          iosEnabled ? t('exclusion.appFileUpload.description') : t('exclusion.appFileUpload.descriptionIosRestrictedDisabled')
        }
        onClose={onCloseHandler}
        content={<FileUpload onSelectFiles={handleSelectFiles} />}
        actions={
          <>
            <Button variant="outlined" size="medium" onClick={onCloseHandler}>
              {t('common.close')}
            </Button>
            <ProgressButton loading={loading} variant="contained" color="primary" type="submit" onClick={handleFileSubmission}>
              {t('common.submit')}
            </ProgressButton>
          </>
        }
      />
    </Dialog>
  )
}

export default AppFileUploadDialog
