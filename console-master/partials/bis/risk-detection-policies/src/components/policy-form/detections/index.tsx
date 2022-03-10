import React, { useCallback, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Button, MenuItem, Popover } from '@material-ui/core'

import { ArrowCaretDown, BasicAdd, dropdownMenuProps } from '@ues/assets'
import { usePopover } from '@ues/behaviours'

import { ViewContext } from '../../../contexts/view-context'
import type { DetectionsValue } from '../../../model'
import { DetectionsContextProvider } from './context'
import { DetectionsDrawer, useDetectionsDrawerProps } from './detections-drawer'
import { DetectionsTable } from './detections-table'

export interface DetectionsFieldProps {
  onChange: (value: DetectionsValue) => void
  readOnly: boolean
  value: DetectionsValue
}

export const DetectionsField: React.FC<DetectionsFieldProps> = ({ value, onChange, readOnly }) => {
  const { t } = useTranslation('bis/ues')

  const detectionsDrawerProps = useDetectionsDrawerProps()
  const { openDrawer } = detectionsDrawerProps
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  const handleAddDetectionsButtonClick = useCallback(() => {
    openDrawer()
    handlePopoverClose()
  }, [openDrawer, handlePopoverClose])

  const { persistentDrawer } = useContext(ViewContext)

  useEffect(
    () => () => {
      persistentDrawer.setIsOpen(false)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <>
      <Box>
        <Button
          color="secondary"
          onClick={handlePopoverClick}
          size="medium"
          variant="contained"
          startIcon={<BasicAdd />}
          endIcon={<ArrowCaretDown />}
          disabled={readOnly}
        >
          {t('bis/ues:detectionPolicies.assessment.buttons.addDetections')}
        </Button>
      </Box>

      <Popover open={popoverIsOpen} anchorEl={popoverAnchorEl} onClose={handlePopoverClose} {...dropdownMenuProps}>
        <MenuItem onClick={handleAddDetectionsButtonClick}>{t('bis/ues:detectionPolicies.assessment.buttons.detections')}</MenuItem>
      </Popover>

      <DetectionsContextProvider onChange={onChange} value={value}>
        <DetectionsTable readOnly={readOnly} />
        <DetectionsDrawer {...detectionsDrawerProps} readOnly={readOnly} />
      </DetectionsContextProvider>
    </>
  )
}
