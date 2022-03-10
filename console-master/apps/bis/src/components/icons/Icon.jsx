import PropTypes from 'prop-types'
import React, { memo, useMemo } from 'react'

import styles from './Icon.module.less'

export const Icon = memo(
  ({ icon: Icon, isOldStaticIcon, title, component: Component = React.Fragment, handleClick, onClick, ...props }) => {
    const iconStr = Icon.toString()

    const setInnerHTML = useMemo(() => ({ __html: `<use xlink:href="${iconStr}" />` }), [iconStr])
    if (isOldStaticIcon) {
      // some icons are delivered from 'static' folder with icons, we should probably get rid off them at some time
      const svg = (
        <svg
          role="img"
          width="1em"
          height="1em"
          fill="currentColor"
          onClick={onClick}
          dangerouslySetInnerHTML={setInnerHTML}
          {...props}
        />
      )

      return <Component key={iconStr}>{svg}</Component>
    }

    if (title) {
      const svg = <Icon {...props} />

      if (onClick) {
        return (
          <Component key={iconStr}>
            <span className={styles.iconSpan} role="button" tabIndex="0" title={title} aria-label={title} onClick={onClick}>
              {svg}
            </span>
          </Component>
        )
      }
      return (
        <Component key={iconStr}>
          <span className={styles.iconSpan} title={title} aria-label={title}>
            {svg}
          </span>
        </Component>
      )
    } else {
      const svg = <Icon role="img" onClick={onClick} {...props} />
      return <Component key={iconStr}>{svg}</Component>
    }
  },
)

Icon.displayName = 'Icon'
Icon.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  isOldStaticIcon: PropTypes.bool,
  title: PropTypes.string,
  component: PropTypes.node,
  handleClick: PropTypes.func,
  onClick: PropTypes.func,
}
