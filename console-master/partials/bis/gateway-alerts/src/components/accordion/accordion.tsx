import React from 'react'

import { Accordion as AccordionComponent, AccordionDetails, AccordionSummary, Paper, Typography } from '@material-ui/core'

import { ChevronDown } from '@ues/assets'

import type { AccordionProps, RowProps } from '../types/types'
import { useAccordionDetailsTableStyles } from './styles'

const Row = React.memo(({ label, value }: RowProps) => {
  const classNames = useAccordionDetailsTableStyles()

  return (
    <div className={classNames.rowStyles}>
      <div className={classNames.rowTitle}>
        {!React.isValidElement(label) ? <Typography variant="subtitle2">{label}</Typography> : label}
      </div>
      <div className={classNames.rowDetails}>
        {!React.isValidElement(value) ? <Typography variant="body2">{value}</Typography> : value}
      </div>
    </div>
  )
})

const AccordionContents = React.memo(({ title, rows, subtitle }: AccordionProps) => {
  const classNames = useAccordionDetailsTableStyles()
  return (
    <>
      <div className={classNames.title}>
        <Typography variant="h3">{title}</Typography>
        {subtitle ? (
          <Typography style={{ paddingRight: 4 }} variant="h3">
            {rows.length}
          </Typography>
        ) : null}
      </div>
      {React.isValidElement(subtitle) ? subtitle : ''}
    </>
  )
})

export const Accordion: React.FC<AccordionProps> = ({ title, subtitle, rows, noRows }) => {
  const classNames = useAccordionDetailsTableStyles()

  return (
    <Paper className={classNames.paper} elevation={0}>
      <AccordionComponent defaultExpanded={true}>
        <AccordionSummary classes={{ expandIcon: subtitle ? 'subtitle' : null }} expandIcon={<ChevronDown />}>
          <AccordionContents title={title} subtitle={subtitle} rows={rows} />
        </AccordionSummary>
        <AccordionDetails className={'rows'}>
          {rows && rows.length ? (
            rows.map((item, key) => {
              return <Row key={key} {...item} />
            })
          ) : (
            <Typography variant="body2">{noRows}</Typography>
          )}
        </AccordionDetails>
      </AccordionComponent>
    </Paper>
  )
}
