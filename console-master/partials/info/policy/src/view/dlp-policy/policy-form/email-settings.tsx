import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Link, MenuItem, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { EMAIL_RULE, PolicyData } from '@ues-data/dlp'
import { Permission } from '@ues-data/shared'
import { ContentAreaPanel, SecuredContentBoundary, Select, useSecuredContent } from '@ues/behaviours'

import { usePoliciesPermissions } from '../usePoliciesPermission'

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiFormControl-root': {
      marginBottom: 0,
    },
  },
  select: {
    width: `${theme.spacing(90)}px!important`,
  },
}))

const EmailSettings = () => {
  useSecuredContent(Permission.BIP_POLICY_READ)

  const { t } = useTranslation('dlp/policy')
  const styles = useStyles()
  const dispatch = useDispatch()
  const localPolicyData = useSelector(PolicyData.getLocalPolicyData)
  const { canUpdate } = usePoliciesPermissions()
  const [selectedValue, setSelectedValue] = useState(localPolicyData?.emailDomainsRule || EMAIL_RULE.NONE)

  const handleActionSelect = e => {
    setSelectedValue(e.target.value)
    dispatch(
      PolicyData.updateLocalPolicyData({
        emailDomainsRule: e.target.value,
      }),
    )
  }

  return (
    <div className={styles.root}>
      <ContentAreaPanel
        title={t('policy.sections.emailSettings.title')}
        ContentWrapper={SecuredContentBoundary}
        boxProps={{ marginTop: 6 }}
      >
        <Typography variant="body2">
          <Typography variant="body2">
            <Trans
              t={t}
              i18nKey="policy.sections.emailSettings.description"
              components={[<Link href="#/settings/whitelisting"></Link>]}
            />
          </Typography>
        </Typography>
        <Select
          className={styles.select}
          name={'email-domain'}
          aria-label="email-domain"
          size="small"
          variant="filled"
          onChange={handleActionSelect}
          value={selectedValue}
          helperText={t('policy.sections.emailSettings.helperText')}
          disabled={!canUpdate}
        >
          <MenuItem aria-label="email-domain-none" value="NONE">
            {t('policy.sections.emailSettings.recipients.none')}
          </MenuItem>
          <MenuItem aria-label="email-domain-internal" value="INTERNAL_RECIPIENTS_ONLY">
            {' '}
            {t('policy.sections.emailSettings.recipients.internal')}
          </MenuItem>
          <MenuItem aria-label="email-domain-all" value="FOR_ALL_RECIPIENTS">
            {t('policy.sections.emailSettings.recipients.all')}
          </MenuItem>
        </Select>
      </ContentAreaPanel>
    </div>
  )
}

export default EmailSettings
