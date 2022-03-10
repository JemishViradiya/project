import cn from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Accordion as AccordionComponent, AccordionDetails, AccordionSummary, Paper, Typography } from '@material-ui/core'

import { ChevronDown } from '@ues/assets'

import { useAccordionTableStyles } from './styles'
import type { AccordionProps, RowProps } from './types'

const Row = React.memo(({ hidden, label, value, rowTitleGrow }: RowProps) => {
  const classNames = useAccordionTableStyles()
  return (
    !hidden && (
      <div className={classNames.rowStyles}>
        <div className={cn(classNames.rowTitle, value ? null : 'full', rowTitleGrow ? 'rowTitleGrow' : null)}>
          {!React.isValidElement(label) ? <Typography variant="subtitle2">{label}</Typography> : label}
        </div>
        {value && (
          <div className={classNames.rowDetails}>{!React.isValidElement(value) ? <Typography>{value}</Typography> : value}</div>
        )}
      </div>
    )
  )
})

const AccordionContents = React.memo(({ alternateTitle, subtitle, title }: AccordionProps) => {
  const classNames = useAccordionTableStyles()
  return (
    <>
      <div className={classNames.title}>
        <Typography variant="h3">{title}</Typography>
        {alternateTitle ? (
          <Typography className={classNames.paddingRight} variant="h3">
            {alternateTitle}
          </Typography>
        ) : null}
      </div>
      {subtitle ?? ''}
    </>
  )
})

export const Accordion: React.FC<AccordionProps> = ({ alternateTitle, chart, hidden, subtitle, title, rows, underlined }) => {
  const { t } = useTranslation(['dlp/common'])
  const classNames = useAccordionTableStyles()

  return (
    <Paper hidden={hidden} className={classNames.paper} elevation={0}>
      <AccordionComponent defaultExpanded={true}>
        <AccordionSummary classes={{ expandIcon: subtitle ? 'subtitle' : null }} expandIcon={<ChevronDown />}>
          <AccordionContents title={title} subtitle={subtitle} alternateTitle={alternateTitle} />
        </AccordionSummary>
        <AccordionDetails className={'rows'}>
          {chart}
          {rows?.map((item, index) => (
            <div key={index}>
              <Row value={item.value} label={item.label} rowTitleGrow={underlined} hidden={item.hidden} />
              {underlined && item?.value && <hr className={classNames.hr} />}
            </div>
          ))}
        </AccordionDetails>
      </AccordionComponent>
    </Paper>
  )
}
