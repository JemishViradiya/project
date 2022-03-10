//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Box, Link, makeStyles, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import { useStatefulReduxQuery } from '@ues-data/shared'
import { Components, Config, Data, Types } from '@ues-gateway/shared'

import { AclList, AclProfileMetadata, AclTabContent } from './components'
import { useNavigateToView } from './hooks'

const { DEFAULT_LIST_QUERY_PARAMS, GATEWAY_TRANSLATIONS_KEY } = Config
const { queryCommittedAclRules, getHasAclRulesDraft, getFetchCommittedAclRulesProfileTask } = Data
const { AclRulesType } = Types
const { AclMigrationAlert } = Components

const useStyles = makeStyles(theme => ({
  alertBox: {
    marginBottom: theme.spacing(4),
  },
  link: {
    marginLeft: theme.spacing(1),
  },
}))

const AclRulesCommittedList = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const navigateToView = useNavigateToView()
  const classes = useStyles()
  const hasAclRulesDraft = useSelector(getHasAclRulesDraft)

  const { data, loading, refetch } = useStatefulReduxQuery(queryCommittedAclRules, {
    variables: { params: DEFAULT_LIST_QUERY_PARAMS },
  })

  return (
    <>
      {hasAclRulesDraft && (
        <Alert severity="info" variant="outlined" className={classes.alertBox}>
          <Box display="flex">
            <Typography variant="body2">{t('acl.committedListReadOnlyAlertMessage')}</Typography>
            <Link className={classes.link} onClick={() => navigateToView(AclRulesType.Draft)}>
              {t('acl.editDraftRulesLink')}
            </Link>
          </Box>
        </Alert>
      )}

      <AclList
        loading={loading}
        readOnly={hasAclRulesDraft}
        refetch={params => refetch({ params })}
        total={data?.response?.totals?.elements}
      />
    </>
  )
}

const AclCommitted: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const committedAclRulesProfileTask = useSelector(getFetchCommittedAclRulesProfileTask)

  return (
    <>
      <AclMigrationAlert />

      <AclTabContent
        title={t('acl.labelAclRulesTopLevelCommittedDescription')}
        description={<AclProfileMetadata data={committedAclRulesProfileTask?.data} />}
      >
        <AclRulesCommittedList />
      </AclTabContent>
    </>
  )
}

export default AclCommitted
