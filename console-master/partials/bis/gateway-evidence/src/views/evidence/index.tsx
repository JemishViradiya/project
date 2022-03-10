import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { makeStyles } from '@material-ui/core'

import { useQueryParams } from '@ues-behaviour/react'
import { FeatureName, useFeatures } from '@ues-data/shared'
import { HelpLinks } from '@ues/assets'
import { ContentAreaPanel, PageTitlePanel, useFeatureCheck } from '@ues/behaviours'

import { Table } from '../../components'

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    display: 'flex',
    borderColor: theme.palette.grey[400],
  },
  content: {
    padding: theme.spacing(6),
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
  },
}))

const Evidence: React.FC<{
  showPageTitle?: boolean
  features?: FeatureName[]
}> = memo(({ showPageTitle = true, features = [] }) => {
  useFeatureCheck(isEnabled => features.every(featureName => isEnabled(featureName)))
  const { t } = useTranslation(['bis/ues', 'bis/shared'])
  const classes = useStyles()
  const navigate = useNavigate()
  const { state }: any = useLocation()
  const { isEnabled } = useFeatures()
  const gatewayAlertsTransition = isEnabled(FeatureName.UESNavigationGatewayAlertsTransition)

  const queryParams = useQueryParams()

  const { name = state?.name } = useMemo(() => {
    const params: Record<string, string> = {}
    queryParams.forEach((value, key) => (params[key] = value))

    return params
  }, [queryParams])

  return (
    <div className={classes.container}>
      {showPageTitle ? (
        <PageTitlePanel
          title={[t(gatewayAlertsTransition ? 'gatewayEvidence.eventTitle' : 'gatewayEvidence.title'), name]}
          goBack={() => navigate(-1)}
          borderBottom
          helpId={HelpLinks.Alerts}
        />
      ) : null}
      <div className={classes.content}>
        <ContentAreaPanel fullHeight boxProps={{ width: '100%', maxWidth: 'none' }}>
          <Table tableTitle={!showPageTitle ? t('gatewayEvidence.tableTitle') : null} />
        </ContentAreaPanel>
      </div>
    </div>
  )
})

export default Evidence
