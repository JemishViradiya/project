/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'

import { Accordion as AccordionComponent, AccordionDetails, AccordionSummary, Paper, Typography } from '@material-ui/core'

import { ChevronDown } from '@ues/assets'

import type { AccordionProps, RowProps } from '../types'
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

const AccordionContents = React.memo(({ title, altTitle, subTitle }: AccordionProps) => {
  const classNames = useAccordionDetailsTableStyles()
  return (
    <>
      <div className={classNames.title}>
        <Typography variant="h3">{title}</Typography>
        {altTitle ? <Typography variant="h3">{altTitle}</Typography> : null}
      </div>
      {subTitle ? <Typography>{subTitle}</Typography> : null}
    </>
  )
})

export const Accordion: React.FC<AccordionProps> = ({ title, altTitle, subTitle, rows, noRows }) => {
  const classNames = useAccordionDetailsTableStyles()
  return (
    <Paper className={classNames.paper} elevation={0}>
      <AccordionComponent defaultExpanded={true}>
        <AccordionSummary classes={{ expandIcon: subTitle ? 'subtitle' : null }} expandIcon={<ChevronDown />}>
          <AccordionContents title={title} altTitle={altTitle} subTitle={subTitle} rows={rows} />
        </AccordionSummary>
        <AccordionDetails className={'rows'}>
          {rows?.map((item, key) => {
            return <Row key={key} {...item} />
          })}
        </AccordionDetails>
      </AccordionComponent>
    </Paper>
  )
}
