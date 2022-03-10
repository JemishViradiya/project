import React, { useRef } from 'react'

import { DialogChildren } from '@ues/behaviours'

export const DialogContent = ({ title, ...rest }) => {
  const { current: titleRef } = useRef(title)

  return <DialogChildren {...rest} title={titleRef} />
}
