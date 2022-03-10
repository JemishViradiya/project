import isEmpty from 'lodash/isEmpty'
import React from 'react'

import { Accordion as AccordionComponent, AccordionDetails, AccordionSummary, Divider, Paper, Typography } from '@material-ui/core'

import { ChevronDown } from '@ues/assets'

import { useAccordionDetailsTableStyles } from './styles'
import type { AccordionProps, RowProps } from './types'

const Row = React.memo(({ hidden, label, value, secondaryRows }: RowProps) => {
  const classNames = useAccordionDetailsTableStyles()
  return (
    !hidden && (
      <>
        <div className={classNames.rowStyles}>
          <div className={classNames.rowTitle}>
            {!React.isValidElement(label) ? <Typography variant="subtitle2">{label}</Typography> : label}
          </div>
          <div className={classNames.rowDetails}>{!React.isValidElement(value) ? <Typography>{value}</Typography> : value}</div>
        </div>
        {secondaryRows?.map(
          row =>
            !row.hidden && (
              <div className={classNames.rowStyles}>
                {row.label && (
                  <div className={classNames.rowTitle}>
                    <Typography variant="subtitle2">{row.label}</Typography>
                  </div>
                )}
                {row.value && (
                  <div className={classNames.rowDetails}>
                    <Typography>{row.value}</Typography>
                  </div>
                )}
              </div>
            ),
        )}
        {!isEmpty(secondaryRows) && <Divider className={classNames.divider} />}
      </>
    )
  )
})

const AccordionContents = React.memo(({ alternateTitle, subtitle, title }: AccordionProps) => {
  const classNames = useAccordionDetailsTableStyles()
  return (
    <>
      <div className={classNames.title}>
        <Typography variant="h3">{title}</Typography>
        {alternateTitle ? (
          <Typography style={{ paddingRight: 4 }} variant="h3">
            {alternateTitle}
          </Typography>
        ) : null}
      </div>
      {subtitle ?? ''}
    </>
  )
})

export const Accordion: React.FC<AccordionProps> = ({ alternateTitle, element, hidden, subtitle, title, rows }) => {
  const classNames = useAccordionDetailsTableStyles()
  return (
    <Paper hidden={hidden} className={classNames.paper} elevation={0}>
      <AccordionComponent defaultExpanded={true}>
        <AccordionSummary classes={{ expandIcon: subtitle ? 'subtitle' : null }} expandIcon={<ChevronDown />}>
          <AccordionContents title={title} subtitle={subtitle} alternateTitle={alternateTitle} />
        </AccordionSummary>
        <AccordionDetails className={'rows'}>
          {element}
          {rows?.map((item, index) => (
            <Row key={index} {...item} />
          ))}
        </AccordionDetails>
      </AccordionComponent>
    </Paper>
  )
}
