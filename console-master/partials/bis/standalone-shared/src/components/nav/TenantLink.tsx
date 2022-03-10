import PropTypes from 'prop-types'
import React, { memo, useCallback, useMemo } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

const preventDefault = ev => ev.preventDefault()

interface TenantLinkProps {
  nav?: boolean
  dead?: boolean
  to: string
  goBack?: () => void
  onClick?: () => void
  className: string
}

export const TenantLink: React.FC<TenantLinkProps> = memo(props => {
  const navigate = useNavigate()
  const location = useLocation()

  const { nav, dead, to, goBack, onClick: _onClick, ...rest } = props
  const Component = nav ? NavLink : Link

  // in editMode, all links should be dead...
  const handler = useMemo(() => (dead ? preventDefault : _onClick || (() => undefined)), [_onClick, dead])
  const onClick = useCallback(
    event => {
      if (goBack) {
        const locationState = location.state
        if ((locationState as any)?.goBack) {
          event.stopPropagation()
          event.preventDefault()
          const wh = window.history
          // NOTE: Safari sometimes adds an extra location history entry.
          // We add the check below to go back the expected location.
          if ((!wh.state || wh.state.key !== location.key) && wh.length >= 2) {
            navigate(-2)
          } else {
            navigate(-1)
          }
          return true
        }
      }
      return handler(event)
    },
    [goBack, handler, navigate, location.key, location.state],
  )

  return useMemo(() => {
    return <Component to={to} onClick={onClick} aria-disabled={dead} {...rest} />
  }, [Component, dead, onClick, rest, to])
})

export default TenantLink
