import React, { memo } from 'react'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'

import styles from './Section.module.less'

const Section = memo(({ children }) => (
  <Paper className={styles.container}>
    <Box p={8} mb={2} mt={2} className={styles.container}>
      {children}
    </Box>
  </Paper>
))

export default Section
