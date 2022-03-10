import { useTranslation } from 'react-i18next'

// Updates the tab title name
export const usePageTitle = (pageTitle?: string) => {
  const { t } = useTranslation('general/page')

  const brandingEnabled = process.env.BB_BRANDING === 'true'
  //console.debug(`process.env.BB_BRANDING: ${process.env.BB_BRANDING}, branding enabled: ${brandingEnabled}`)

  const pageTitleProps = {
    companyName: brandingEnabled ? t('companyName.blackBerry') : t('companyName.cylance'),
    pageTitle: pageTitle,
  }

  //console.debug('Page title props: ' + JSON.stringify(pageTitleProps))

  if (pageTitle) {
    document.title = t('title', pageTitleProps)
  } else {
    document.title = pageTitleProps.companyName
  }
}
