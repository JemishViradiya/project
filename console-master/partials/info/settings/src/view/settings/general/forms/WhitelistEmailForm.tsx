import { Form } from 'formik'
import { isEmpty } from 'lodash-es'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FormControl, TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { CONFIG_KEY } from '@ues-data/dlp'
import { FormButtonPanel } from '@ues/behaviours'

import { useDlpSettingsPermissions } from '../../../useDlpSettingsPermissions'
import makeStyles from '../styles'

interface WhitelistEmailFormProps {
  values: any[]
  handleChange: any
  handleSubmit: any
  handleBlur: any
  setFieldValue: any
  dirty: any
  errors: any
}

const WhitelistEmailForm: React.FC<WhitelistEmailFormProps> = ({
  values,
  handleSubmit,
  handleBlur,
  setFieldValue,
  dirty,
  errors,
}) => {
  const classes = makeStyles()
  const { t } = useTranslation(['dlp/common'])
  const { canUpdate } = useDlpSettingsPermissions()

  const findEmailDomainsValue = () => {
    return JSON.parse(values?.filter(config => config.key === CONFIG_KEY.EMAIL_DOMAINS)[0]?.value).join(', ')
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const prevEmailDomains = useMemo(() => findEmailDomainsValue(), [])
  const [emailDomainsValue, setEmailDomainsValue] = useState(findEmailDomainsValue)
  const [validEmailDomains, setValidEmailDomains] = useState(true)
  const emailDomainConfig = values.find(config => config.key === CONFIG_KEY.EMAIL_DOMAINS)
  const emailDomainIndex = values.findIndex(config => config.key === CONFIG_KEY.EMAIL_DOMAINS)

  const emailDomainsCheck = value => {
    if (/(?<!,)\s|(,)\1+|^[^a-zA-Z0-9]|[^a-zA-Z0-9]$/g.test(value)) {
      return setValidEmailDomains(false)
    }
    return setValidEmailDomains(
      value
        .trim()
        .split(',')
        .filter(Boolean)
        .map(domain => !!domain.match(/([a-z0-9]+\.)*[a-z0-9]+\.[a-z]{2,3}$/))
        .every(isDomainMatch => isDomainMatch),
    )
  }

  const onReset = () => {
    setEmailDomainsValue(prevEmailDomains)
    setValidEmailDomains(true)
  }

  const handleOnChange = e => {
    emailDomainsCheck(e.target.value)
    setEmailDomainsValue(e.target.value)
    setFieldValue(`${emailDomainIndex}.value`, JSON.stringify(e.target.value.split(',').map(domain => domain.trim())))
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Typography variant="h2">{t('setting.general.whitelistEmailDomains.title')}</Typography>
      <Typography variant="body2" className={classes.description}>
        {t('setting.general.whitelistEmailDomains.description')}
      </Typography>
      <FormControl fullWidth className={classes.margin} variant="outlined">
        <TextField
          id={emailDomainConfig.key}
          name={emailDomainConfig.value}
          className={classes.margin}
          variant="filled"
          margin="dense"
          multiline={true}
          error={!isEmpty(errors) || !validEmailDomains}
          onChange={handleOnChange}
          onBlur={handleBlur}
          value={emailDomainsValue}
          disabled={!canUpdate}
          placeholder={t('setting.general.whitelistEmailDomains.placeholder')}
          helperText={
            !validEmailDomains
              ? t('setting.general.whitelistEmailDomains.invalidValue')
              : t('setting.general.whitelistEmailDomains.helperText')
          }
        />
      </FormControl>
      {
        <FormButtonPanel show={dirty}>
          <Button variant="contained" type="reset" onClick={onReset}>
            {t('setting.buttons.cancel')}
          </Button>
          <Button color="secondary" variant="contained" type="submit" disabled={!validEmailDomains}>
            {t('setting.buttons.save')}
          </Button>
        </FormButtonPanel>
      }
    </Form>
  )
}

export default WhitelistEmailForm
