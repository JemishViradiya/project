import React from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@material-ui/core/Button'

const SubmitButton = (): JSX.Element => {
  const { t: translate } = useTranslation(['general/form'])

  return (
    <Button type="submit" variant="contained" color="primary" data-autoid="application-control-add-exclusion-submit-button">
      {translate('commonLabels.add')}
    </Button>
  )
}

export default SubmitButton
