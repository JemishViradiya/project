import PropTypes from 'prop-types'
import React, { memo, useMemo } from 'react'

import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  iconSpan: {
    display: 'inlineFlex',
    alignItems: 'center',
  },
}))

interface IconProps {
  icon: any
  isOldStaticIcon?: boolean
  title: string
  component?: any
  handleClick?: () => void
  onClick?: () => void
  style: any
  'aria-label': string
  className?: string
}

export const Icon: React.FC<IconProps> = memo(
  ({ icon: Icon, isOldStaticIcon, title, component: Component = React.Fragment, handleClick, onClick, ...props }) => {
    const iconStr = Icon.toString()
    const styles = useStyles()

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
            <span
              className={styles.iconSpan}
              role="button"
              tabIndex={0}
              title={title}
              aria-label={title}
              onClick={onClick}
              onKeyDown={undefined}
            >
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
