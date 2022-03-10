import moment from 'moment'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { Domain } from '@ues-data/dlp'
import { useStatefulReduxQuery } from '@ues-data/shared'
import { StatusHigh, StatusSuccess } from '@ues/assets'

const useStyles = makeStyles(theme => ({
  textResult: {
    display: 'flex',
    alignItems: 'center',
  },
  errorIcon: {
    color: theme.palette.error.main,
    fontSize: `${theme.spacing(5)}px`,
    marginLeft: `${theme.spacing(1.5)}px`,
  },
  successIcon: {
    color: theme.palette.success.main,
    fontSize: `${theme.spacing(5)}px`,
    marginLeft: `${theme.spacing(1.5)}px`,
  },
}))

const ValidateForm = ({ domainName, validateCounter, setLoadingValidateState }) => {
  const { t } = useTranslation(['dlp/common'])
  const classes = useStyles()
  const { loading, data, error, refetch } = useStatefulReduxQuery(Domain.validateBrowserDomain, {
    variables: { domainName: domainName },
  })

  useEffect(() => {
    validateCounter !== 1 && refetch({ domainName: domainName })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateCounter])

  const checkStatusCode = httpStatusCode => {
    if (httpStatusCode && httpStatusCode === 400) {
      return t('setting.general.domain.validation.verificationFailedText')
    } else if (httpStatusCode && httpStatusCode === 417) {
      return t('setting.general.domain.validation.unreachableDomainText')
    } else {
      return t('setting.general.domain.validation.unknownError')
    }
  }

  setLoadingValidateState(loading)

  return (
    <Typography className={classes.textResult}>
      {error && !loading && (
        <>
          {checkStatusCode(data?.httpStatusCode)}
          <StatusHigh className={classes.errorIcon} />
        </>
      )}
      {!error && !loading && (
        <>
          {t('setting.general.domain.validation.verificationSuccessText', { date: moment(new Date()).format('lll') })}
          <StatusSuccess className={classes.successIcon} />
        </>
      )}
    </Typography>
  )
}

export default ValidateForm
