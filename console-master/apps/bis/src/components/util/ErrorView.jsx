import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { memo } from 'react'

import { LogoBlackBerry } from '@ues/assets'

import styles from './ErrorView.module.less'

export const DefaultHelpUrl = 'https://docs.blackberry.com/en/unified-endpoint-security/blackberry-persona-uem/latest'

/* eslint-disable react/jsx-no-target-blank */
const ErrorView = memo(({ to, summary, link, message, helpLink, helpUrl, onLinkClick, className, loading }) => {
  return (
    <main className={cn(styles.background, className)}>
      <dialog open className={styles.dialog}>
        <header className={styles.header}>
          <LogoBlackBerry className={styles.logo} viewBox="0 0 145 30" role="img" alt-text="BlackBerry" />
        </header>
        <div className={styles.bar}>
          <div className={styles.barProgress} />
        </div>
        <div className={styles.body}>
          <summary className={styles.summary}>{summary}</summary>
          {message}
          <a className={styles.link} href={to} onClick={onLinkClick}>
            {link}
          </a>
        </div>
        <footer className={styles.footer}>
          <a className={styles.help} href={helpUrl} target="_blank">
            {helpLink}
          </a>
        </footer>
      </dialog>
    </main>
  )
})

ErrorView.propTypes = {
  className: PropTypes.string,
  to: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  link: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  helpLink: PropTypes.string.isRequired,
  helpUrl: PropTypes.string,
}

ErrorView.defaultProps = {
  helpUrl: DefaultHelpUrl,
}

export default ErrorView
