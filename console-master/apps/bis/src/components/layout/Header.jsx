import PropTypes from 'prop-types'
import React, { memo } from 'react'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import Container from './Container'
import styles from './Header.module.less'

const Header = memo(({ children, actions, title, mb = 2 }) => {
  return (
    <Container>
      <Box component="header" mt={18} mb={mb}>
        <div className={styles.header}>
          <Typography variant="h2" data-testid="title">
            {title}
          </Typography>
          {actions}
        </div>

        {children}
      </Box>
    </Container>
  )
})

Header.displayName = 'Header'

Header.propTypes = {
  children: PropTypes.node,
  actions: PropTypes.node,
  title: PropTypes.node.isRequired,
}

Header.defaultProps = {
  children: null,
  actions: null,
}

export default Header
