import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import { usePrevious } from '@ues-behaviour/react'
import type { UploadCertificateView } from '@ues-data/dlp'
import { CertificateData } from '@ues-data/dlp'
import { useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { DialogChildren, FileUpload, useSnackbar } from '@ues/behaviours'

export interface CertUploadDialogProps<T> {
  openDialog: boolean
  onClose?: () => void
  onSubmit?: () => void
}

const ALLOWED_FILE_TYPES = '.crt,.der,.cer'

const CertificateFileUploadDialog: React.FC<CertUploadDialogProps<UploadCertificateView>> = ({ openDialog, onClose, onSubmit }) => {
  const { t } = useTranslation(['dlp/common'])
  const snackbar = useSnackbar()

  const [selectedFile, setSelectedFile] = useState<boolean>(false)
  const [fileContent, setFileContent] = useState<string>()

  const handleSelectFiles = async (files: Array<File>) => {
    setSelectedFile(!!files[0])

    const fileReader = new FileReader()
    fileReader.onloadend = ev => {
      const base64Str = btoa(String.fromCharCode(...new Uint8Array(ev.target.result as ArrayBuffer)))
      setFileContent(base64Str)
    }
    fileReader.readAsArrayBuffer(files[0])
  }

  //create certificates
  const [createCertificateStartAction, createCertificateTask] = useStatefulReduxMutation(CertificateData.mutationCreateCertificate)
  const createCertificateTaskPrev = usePrevious(createCertificateTask)
  useEffect(() => {
    if (!createCertificateTask.loading && createCertificateTaskPrev.loading && createCertificateTask.error) {
      snackbar.enqueueMessage(t('setting.trustedCertificates.error.addToYourList'), 'error')
    } else if (!createCertificateTask.loading && createCertificateTaskPrev.loading) {
      snackbar.enqueueMessage(t('setting.trustedCertificates.success.addToYourList'), 'success')
      setSelectedFile(false)
      setFileContent(null)
      onSubmit && onSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createCertificateTask])

  const handleFileSubmission = () => {
    createCertificateStartAction({ certificate: fileContent })
  }

  return (
    <Dialog open={openDialog} onClose={onClose} maxWidth="sm" fullWidth={true}>
      <DialogChildren
        title={t('setting.trustedCertificates.dialogs.addToYourList.title')}
        description={t('setting.trustedCertificates.dialogs.addToYourList.subTitle')}
        onClose={onClose}
        content={<FileUpload onSelectFiles={handleSelectFiles} acceptedFiles={ALLOWED_FILE_TYPES} />}
        actions={
          <>
            <Button variant="outlined" size="medium" onClick={onClose}>
              {t('setting.trustedCertificates.dialogs.addToYourList.cancelBtn')}
            </Button>
            <Button variant="contained" color="primary" type="submit" onClick={handleFileSubmission} disabled={!selectedFile}>
              {t('setting.trustedCertificates.dialogs.addToYourList.confirmBtn')}
            </Button>
          </>
        }
      />
    </Dialog>
  )
}

export default CertificateFileUploadDialog
