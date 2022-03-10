import React from 'react'
import { useTranslation } from 'react-i18next'

import type { TableCellBaseProps } from '@material-ui/core'
import { IconButton, TableCell } from '@material-ui/core'

import { ArrowChevronDown, ArrowChevronUp } from '@ues/assets'

export const CollapsibleCell = ({
  open = false,
  setOpen,
  component = 'td',
  style,
}: {
  open: boolean
  setOpen: (o: any) => void
  component?: React.ElementType<TableCellBaseProps>
  style?: any
}) => {
  const { t } = useTranslation('tables')
  return (
    <TableCell padding="checkbox" component={component} style={style}>
      <IconButton aria-label={t('expandRow')} size="small" onClick={() => setOpen(!open)}>
        {open ? <ArrowChevronUp /> : <ArrowChevronDown />}
      </IconButton>
    </TableCell>
  )
}
