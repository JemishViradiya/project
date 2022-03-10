import React from 'react'

import { makeStyles } from '@material-ui/core'

import { SplitView as SplitViewComponent } from '@ues/behaviours'

interface Arguments {
  initialSplitPosition: number
  minSize: number
  direction: 'horizontal' | 'vertical'
}

const useStyles = makeStyles({
  container: {
    height: '400px',
    width: '100%',
  },
})

export const SplitView = (args: Arguments) => {
  const classNames = useStyles()
  const initialSizes = [args.initialSplitPosition, 100 - args.initialSplitPosition]

  return (
    <SplitViewComponent
      className={classNames.container}
      direction={args.direction}
      initialSizes={initialSizes}
      minSize={args.minSize}
    >
      <div>Pane 1</div>
      <div>Pane 2</div>
    </SplitViewComponent>
  )
}

const args: Arguments = {
  initialSplitPosition: 50,
  direction: 'horizontal',
  minSize: 100,
}

SplitView.args = args

export default {
  title: 'SplitView',
  argTypes: {
    direction: {
      control: {
        type: 'inline-radio',
        options: ['horizontal', 'vertical'],
      },
    },
    initialSplitPosition: {
      control: { type: 'number' },
    },
    minSize: {
      control: { type: 'number' },
    },
  },
}
