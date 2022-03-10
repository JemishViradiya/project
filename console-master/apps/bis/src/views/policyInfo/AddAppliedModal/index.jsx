import PropTypes from 'prop-types'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Typography from '@material-ui/core/Typography'

import { useControlledDialog } from '@ues/behaviours'

import { default as UserAndGroupByQueryProvider } from '../../../providers/UserAndGroupByQueryProvider'
import { Button, Modal } from '../../../shared'
import AddAppliedTable from '../AddAppliedTable'
import AutocompleteComponent from './Autocomplete'

export const AddAppliedModal = ({ dialogId, onAdd, onClose, policyName, context, saving }) => {
  const { data: alreadyApplied } = useContext(context)
  const { t } = useTranslation()
  const [appliedData, setAppliedData] = useState([])
  const [searchText, setSearchText] = useState('')

  const handleCloseModal = useCallback(() => {
    setAppliedData([])
    onClose()
  }, [onClose])
  const handleAddApplied = useCallback(() => {
    onAdd(appliedData)
  }, [appliedData, onAdd])

  const addAppliedItem = useCallback(
    value => {
      if (!value.id) return
      const alreadyAdded = appliedData.find(applied => applied.id === value.id && applied.__typename === value.__typename)
      if (alreadyAdded) return
      setAppliedData([...appliedData, value])
    },
    [appliedData],
  )

  const deleteAppliedItem = useCallback(
    id => {
      if (!id) return
      setAppliedData(appliedData.filter(applied => applied.id !== id))
    },
    [appliedData],
  )

  useEffect(() => {
    return () => {
      setSearchText('')
    }
  }, [])

  const { open, onClose: controlledOnClose } = useControlledDialog({
    dialogId,
    onClose: handleCloseModal,
  })

  return (
    <Modal
      open={open}
      scroll="paper"
      onClose={controlledOnClose}
      title={t('policies.details.appliedDialogTitle', { policyName })}
      actions={
        <>
          <Button onClick={controlledOnClose}>{t('common.cancel')}</Button>
          <Button.Confirmation loading={saving} onClick={handleAddApplied} disabled={!appliedData.length}>
            {t('common.save')}
          </Button.Confirmation>
        </>
      }
    >
      <Typography id="autocomplete-desc" gutterBottom>
        {t('policies.details.appliedDialogDescription')}
      </Typography>
      <UserAndGroupByQueryProvider searchText={searchText}>
        <AutocompleteComponent
          addAppliedItem={addAppliedItem}
          setSearchText={setSearchText}
          appliedData={appliedData}
          alreadyApplied={alreadyApplied}
        />
      </UserAndGroupByQueryProvider>
      {appliedData.length > 0 && <AddAppliedTable data={appliedData} deleteAppliedItem={deleteAppliedItem} />}
    </Modal>
  )
}
AddAppliedModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  policyName: PropTypes.string.isRequired,
  context: PropTypes.object,
  saving: PropTypes.bool,
}

AddAppliedModal.defaultProps = {
  policyName: '',
}

AddAppliedModal.displayName = 'AddAppliedModal'
