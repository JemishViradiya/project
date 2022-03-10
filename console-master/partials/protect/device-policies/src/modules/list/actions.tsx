import React from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { BasicAdd, BasicDelete } from '@ues/assets'
import { useTableSelection } from '@ues/behaviours'

interface ActionsPropTypes {
  onAdd: () => void
  onDelete: () => void
}

const Actions = ({ onAdd, onDelete }: ActionsPropTypes): JSX.Element => {
  const { t: translate } = useTranslation(['protect', 'general/form'])

  const { selected } = useTableSelection()

  // --TODO: RBAC roles

  return (
    <>
      {selected.length ? (
        <Typography variant="body2">
          {translate('general/form:commonLabels.selectedRowCount', { count: selected.length })}
        </Typography>
      ) : null}
      <Button onClick={onAdd} startIcon={<BasicAdd />} variant="contained" color="secondary" data-autoid="add-policy-button">
        {translate('addPolicy')}
      </Button>
      {selected.length ? (
        <Button
          onClick={onDelete}
          variant="contained"
          color="primary"
          startIcon={<BasicDelete />}
          data-autoid="policy-list-remove-button"
        >
          {translate('general/form:commonLabels.delete')}
        </Button>
      ) : null}
    </>
  )
}

export default Actions
