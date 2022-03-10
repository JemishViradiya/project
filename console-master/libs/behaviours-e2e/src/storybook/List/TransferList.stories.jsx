import React from 'react'

import { TransferList as TransferListComponent } from '@ues/behaviours'

import markdown from './TransferList.md'

function numSort(a, b) {
  const a1 = a.split('.')
  const b1 = b.split('.')
  const len = Math.max(a1.length, b1.length)

  for (let i = 0; i < len; i++) {
    const _a = +a1[i] || 0
    const _b = +b1[i] || 0
    if (_a === _b) continue
    else return _a > _b ? 1 : -1
  }
  return 0
}
export const TransferList = args => {
  const { allowRightColumnEmpty, allowLeftColumnEmpty, disabled } = args

  const rightValues = ['4', '5', '6']
  const allValues = ['1', '2', '3', ...rightValues]

  const handleChange = (left, right) =>
    window.alert('Handle change\nLeft: ' + JSON.stringify(left) + '\nRight: ' + JSON.stringify(right))

  return (
    <TransferListComponent
      disabled={disabled}
      allValues={allValues}
      rightValues={rightValues}
      listLabel="List label"
      rightLabel="Right label"
      leftLabel="Left label"
      allowLeftEmpty={allowLeftColumnEmpty}
      allowRightEmpty={allowRightColumnEmpty}
      onChange={(left, right) => handleChange(left, right)}
      sortFunction={numSort}
    />
  )
}
TransferList.args = {
  allowRightColumnEmpty: true,
  allowLeftColumnEmpty: true,
  disabled: false,
}

export default {
  title: 'Transfer List',
  parameters: {
    notes: markdown,
  },
  argTypes: {
    allowRightColumnEmpty: {
      control: { type: 'boolean' },
      description: 'Allow empty right column.',
    },
    allowLeftColumnEmpty: {
      control: { type: 'boolean' },
      description: 'Allow empty left column.',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled',
    },
  },
}
