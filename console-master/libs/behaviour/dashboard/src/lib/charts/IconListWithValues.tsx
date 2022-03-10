import React, { memo, useCallback, useMemo } from 'react'

import { Link, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core'
import type { ClassNameMap } from '@material-ui/styles'

import type { StatusMedium } from '@ues/assets'

import { ChartList } from '../dashboard/ChartList'

const useStyles = makeStyles(theme => ({
  listItem: {
    padding: theme.spacing(0.5, 0),
  },
  icon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  label: {
    color: theme.palette.text.primary,
  },
  count: {
    flexGrow: 0,
    marginLeft: 'auto',
    color: theme.palette.info.main,
    paddingRight: theme.spacing(2),
  },
}))

interface IconListWithValuesData {
  icon: typeof StatusMedium
  color: string
  label: string
  count: number
  onInteraction?: (data: IconListWithValuesData) => void
  interactionLink?: string
}

export interface IconListWithValuesProps {
  data: IconListWithValuesData[]
}

interface ChartItemProps {
  item: IconListWithValuesData
  index: number
  classes: ClassNameMap
}

const navigateToUrl = (url: string) => window.location.assign(url)

const ChartItem: React.FC<ChartItemProps> = memo(({ item, index, classes }) => {
  const { interactionLink, onInteraction, label, icon, count, color } = item
  const isInteractable = typeof onInteraction === 'function'
  const Icon: typeof StatusMedium = icon
  const Counter = useMemo(
    () => <ListItemText classes={{ root: classes.count }} primaryTypographyProps={{ variant: 'body2' }} primary={count} />,
    [classes.count, count],
  )
  const isClickable = isInteractable || interactionLink
  const onClick = useCallback(() => {
    if (isInteractable) {
      onInteraction(item)
    } else {
      navigateToUrl(interactionLink)
    }
  }, [interactionLink, isInteractable, item, onInteraction])

  const linkProps = useMemo(
    () => ({
      onClick,
      ...(interactionLink ? { href: interactionLink } : { component: 'button' }),
    }),
    [interactionLink, onClick],
  )

  const CounterComp = useMemo(() => (isClickable ? <Link {...linkProps}>{Counter}</Link> : Counter), [
    Counter,
    isClickable,
    linkProps,
  ])

  return (
    <ListItem classes={{ root: classes.listItem }}>
      <ListItemIcon classes={{ root: classes.icon }}>
        <Icon fontSize="inherit" style={{ color }} />
      </ListItemIcon>
      <ListItemText classes={{ root: classes.label }} primaryTypographyProps={{ variant: 'body2' }} primary={label} />
      {CounterComp}
    </ListItem>
  )
})

export const IconListWithValues: React.FC<IconListWithValuesProps> = memo(({ data }) => {
  const classes = useStyles()

  return useMemo(
    () => (
      <ChartList>
        {data.map((item, index) => (
          <ChartItem key={'chartitem_' + index} item={item} index={index} classes={classes} />
        ))}
      </ChartList>
    ),
    [data, classes],
  )
})
