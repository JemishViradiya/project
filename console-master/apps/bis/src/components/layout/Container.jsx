import React, { memo } from 'react'

import Box from '@material-ui/core/Box'

const Container = memo(({ children, className }) => {
  return (
    <Box pl={8} pr={8} className={className}>
      {children}
    </Box>
  )
})

Container.displayName = 'Container'

export default Container
