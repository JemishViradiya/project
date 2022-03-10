import cn from 'classnames'
import React, { memo, useMemo } from 'react'

import type { Theme } from '@material-ui/core'
import { Box, ListItem, ListItemText, makeStyles, Tooltip, Typography, useTheme } from '@material-ui/core'

import { ChartList } from '../dashboard/ChartList'
import type { EnhancedChartProps } from './types'

const useStyles = makeStyles(theme => ({
  listItem: (props: { isClickable: boolean }) => ({
    padding: `${theme.spacing(3.25)}px ${theme.spacing(2)}px ${theme.spacing(3.25)}px 0px`,
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      ...(props.isClickable && { cursor: 'pointer' }),
      backgroundColor: theme.palette['logicalGrey'][100],
    },
  }),

  index: {
    alignSelf: 'flex-start',
  },
  label: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  text: {
    margin: theme.spacing(0, 0, 0, 0.5),
  },
  count: {
    marginLeft: 'auto',
    color: theme.palette.info.main,
  },
  clickable: {
    cursor: 'pointer',
  },
}))

const DEFAULT_OPTIONS = {
  showTooltip: true,
}

export interface TopListData {
  count: number
  label: string
  secondary?: string
}

export interface TopListProps extends EnhancedChartProps<TopListData> {
  options?: { showTooltip?: boolean }
  formatter?: (value: number) => string
}

const getListData = (data: TopListProps['data']) => data.sort((a, b) => b.count - a.count)

const getLabel = ({
  item,
  showTooltip,
  theme,
  labelClass,
}: {
  item: TopListData
  showTooltip: boolean
  theme: Theme
  labelClass: string
}) =>
  showTooltip ? (
    <Tooltip
      placement="bottom-start"
      enterDelay={theme.transitions.duration.standard}
      enterNextDelay={theme.transitions.duration.standard}
      title={<span>{item.label}</span>}
    >
      <Typography className={labelClass}>{item.label}</Typography>
    </Tooltip>
  ) : (
    <Typography className={labelClass}>{item.label}</Typography>
  )

export const TopList: React.FC<TopListProps> = memo(({ data, formatter, onInteraction, options = {} }) => {
  const theme = useTheme()
  const isClickable = typeof onInteraction === 'function'
  const classes = useStyles({ isClickable })
  const listData = getListData(data)

  const listOptions = { ...DEFAULT_OPTIONS, ...options }

  return useMemo(() => {
    return (
      <ChartList>
        {listData.map((item, index) => (
          <ListItem
            key={`listitem_${index}`}
            classes={{ root: classes.listItem }}
            onClick={() => (isClickable ? onInteraction(item) : undefined)}
          >
            <Box className={classes.index}>
              <Typography variant="body2">{`${index + 1}.`}</Typography>
            </Box>
            <ListItemText
              primary={getLabel({ item, showTooltip: listOptions.showTooltip, theme, labelClass: classes.label })}
              secondary={item.secondary ? item.secondary : null}
              classes={{ root: classes.text }}
              primaryTypographyProps={{ variant: 'body2' }}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
            <Box className={cn({ [classes.count]: isClickable })}>
              <Typography className={cn({ [classes.clickable]: isClickable })} variant="body2">
                {formatter ? formatter(item.count) : item.count}
              </Typography>
            </Box>
          </ListItem>
        ))}
      </ChartList>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listData, listOptions])
})
