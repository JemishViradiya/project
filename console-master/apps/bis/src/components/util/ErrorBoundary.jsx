import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { withTranslation } from 'react-i18next'

import { LogoBlackBerry } from '@ues/assets'

import styles from './ErrorBoundary.module.less'
import { reportClientError } from './errorHelper'

// TODO: For future, make a HoC to wrap rather than explicitly requiring the component
export class ErrorBoundaryCmp extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error(error, info)
    reportClientError(error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className={styles.center}>
          <LogoBlackBerry className={styles.logo} viewBox="0 0 16 16" role="img" alt-text="BlackBerry" />
          <div>{this.props.t('common.errorPleaseContact')}</div>
        </div>
      )
    }
    return this.props.children
  }
}

ErrorBoundaryCmp.propTypes = {
  children: PropTypes.node.isRequired,
  t: PropTypes.func.isRequired,
}

export default withTranslation()(ErrorBoundaryCmp)
