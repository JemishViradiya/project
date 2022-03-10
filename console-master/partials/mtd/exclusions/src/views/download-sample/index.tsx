import React from 'react'
import { useTranslation } from 'react-i18next'

import { Link } from '@material-ui/core'

import type { CsvSampleFile } from './csv-sample-files'
import csvSampleFiles from './csv-sample-files'

export interface DownloadSampleLinkProps {
  csvSampleFile: CsvSampleFile
}

const DownloadSampleLink: React.FC<DownloadSampleLinkProps> = ({ csvSampleFile }) => {
  const { t } = useTranslation(['mtd/common'])

  const onDownloadSampleCSV = () => {
    const fileType = 'data:text/csv;charset=utf-8'

    const element = document.createElement('a')
    element.id = 'downloadLink'
    element.style.display = 'none'

    const csvFile = csvSampleFiles.get(csvSampleFile)

    element.setAttribute('href', `${fileType},${encodeURIComponent(csvFile.content)}`)
    element.setAttribute('download', csvFile.fileName)

    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    return false
  }

  return <Link onClick={onDownloadSampleCSV}>{t('common.downloadExample')}</Link>
}

export default DownloadSampleLink
