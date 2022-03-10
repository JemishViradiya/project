import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { environment } from '../../environments/environment'
import useClientParams from '../hooks/useClientParams'
import style from './LearnMore.module.less'

const BIS_PORTAL_LINK = environment.defaults.support.helpUrl

export default memo(({ hash }) => {
  const { t } = useTranslation()
  const parameters = useClientParams('support')
  let link = (parameters && parameters.helpUrl) || BIS_PORTAL_LINK
  if (hash) {
    link += `#${hash}`
  }

  return (
    <a className={style.learnMoreLink} href={link} target="_blank" rel="noopener noreferrer">
      {t('common.learnMore')}
    </a>
  )
})
