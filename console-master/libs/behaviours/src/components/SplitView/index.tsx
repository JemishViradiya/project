import cn from 'classnames'
import React from 'react'
import Split from 'react-split'

import { makeStyles } from '@material-ui/core'

type PanesSizes = number[]

export interface SplitViewProps {
  /** Class assigned to the split view container */
  className?: string
  /** Initial sizes of the panes in pixels */
  initialSizes?: number[]
  /** Minimum pane size in pixels */
  minSize?: number
  /** Split type */
  direction?: 'vertical' | 'horizontal'
  onDrag?: (sizes: PanesSizes) => void
  onDragStart?: (sizes: PanesSizes) => void
  onDragEnd?: (sizes: PanesSizes) => void
}

interface StylesProps {
  direction: SplitViewProps['direction']
}

const useStyles = makeStyles(theme => ({
  container: ({ direction }: StylesProps) => ({
    '& > div': {
      display: 'flex',
      flexDirection: direction === 'horizontal' ? 'row' : 'column',
      height: '100%',
    },
    '& .gutter': {
      background: theme.palette.divider,
      display: 'block',
      margin: 0,
      position: 'relative',
      transition: theme.transitions.create('all'),
      '&:hover': {
        background: theme.palette.secondary.light,
        '&::before, &::after': {
          opacity: 0.15,
        },
      },
      '&::before, &::after': {
        background: theme.palette.secondary.main,
        content: '"  "',
        opacity: 0,
        position: 'absolute',
        transition: theme.transitions.create('all'),
      },

      '&.gutter-horizontal': {
        cursor: 'col-resize',
        width: 1,
        '&::before': {
          right: '100%',
        },
        '&::after': {
          left: '100%',
        },
        '&::before, &::after': {
          height: '100%',
          top: 0,
          width: theme.spacing(1),
        },
        '&:hover': {
          '&::before, &::after': {
            width: theme.spacing(1),
          },
        },
      },

      '&.gutter-vertical': {
        cursor: 'row-resize',
        height: 1,
        '&::before': {
          bottom: '100%',
        },
        '&::after': {
          top: '100%',
        },
        '&::before, &::after': {
          height: theme.spacing(1),
          left: 0,
          width: '100%',
        },
        '&:hover': {
          '&::before, &::after': {
            height: theme.spacing(1),
          },
        },
      },
    },
  }),
}))

export const SplitView: React.FC<SplitViewProps> = ({
  children,
  className,
  direction = 'horizontal',
  initialSizes = [50, 50],
  minSize = 100,
  onDrag,
  onDragEnd,
  onDragStart,
}) => {
  const classNames = useStyles({ direction })

  return (
    <div className={cn(classNames.container, className)}>
      <Split
        sizes={initialSizes}
        gutterSize={1}
        gutterAlign="center"
        dragInterval={1}
        direction={direction}
        cursor="col-resize"
        minSize={minSize}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
      >
        {children}
      </Split>
    </div>
  )
}
