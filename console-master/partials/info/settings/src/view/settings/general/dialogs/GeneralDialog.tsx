import React from 'react'

import { Box } from '@material-ui/core'

import type { BrowserDomain } from '@ues-data/dlp'

import GeneralDomainForm from '../forms/GeneralDomainForm'

type DialogProps = {
  onCreate?: (entity?: BrowserDomain) => void
  onEdit?: (entity?: BrowserDomain) => void
  selectedItem?: BrowserDomain
  openDialog: boolean
  handleClose: () => void
}

const GeneralDialog = ({ onCreate, onEdit, selectedItem, openDialog, handleClose }: DialogProps) => {
  return (
    <Box>
      {openDialog && (
        <GeneralDomainForm
          onCreate={onCreate}
          onEdit={onEdit}
          selectedItem={selectedItem}
          formOpen={openDialog}
          setFormOpen={handleClose}
        />
      )}
    </Box>
  )
}

export default GeneralDialog
