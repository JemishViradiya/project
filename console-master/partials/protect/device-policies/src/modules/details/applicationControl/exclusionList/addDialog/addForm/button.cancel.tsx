import React from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@material-ui/core/Button'

interface CancelButtonPropTypes {
  onClick: () => void
}

const CancelButton = ({ onClick }: CancelButtonPropTypes): JSX.Element => {
  const { t: translate } = useTranslation(['general/form'])

  return (
    <Button variant="outlined" onClick={onClick} data-autoid="application-control-add-exclusion-cancel-button">
      {translate('commonLabels.cancel')}
    </Button>
  )
}

export default CancelButton
