import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { memo, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import TooltipTrigger from 'react-popper-tooltip'

import { ArrowCaretDown, ArrowCaretRight, ArrowCaretUp } from '@ues/assets'

import { Icon, useToggle } from '../../../../../shared'
import TooltipToggleContext from '../providers/NestedMenuProvider'
import styles from './NestedMenu.module.less'

const renderMenu = (children, label) => ({ getTooltipProps, tooltipRef }) => {
  return (
    <div role="menu" aria-label={label} className={styles.menu} {...getTooltipProps({ ref: tooltipRef })}>
      {children}
    </div>
  )
}

export const Option = memo(({ title, onClick, disabled = false, index, t, alreadyTranslated }) => (
  <div
    role="button"
    tabIndex="-1"
    data-index={index}
    className={cn(disabled ? styles.disabledOption : styles.menuOption, styles.menuItem)}
    onClick={onClick}
    key={title}
  >
    <span className={styles.menuLabel}>{alreadyTranslated ? title : t(title)}</span>
  </div>
))

const ignoreEvent = e => {
  e.stopImmediatePropagation()
}

export const SubMenu = memo(({ icon = null, title, children }) => {
  /*
    clicking on a hover trigger should not close it

    react-popper-tooltip handles 'click outside' events with an event listener on the document body
    so it isn't possible to ignore the click on a tooltip with a react event handler
    see https://github.com/facebook/react/issues/7094
  */
  const ref = useRef(null)
  const { t } = useTranslation()
  const label = t('common.titleMenu', { title })
  const menu = useMemo(() => renderMenu(children, label), [children, label])

  useEffect(() => {
    const node = ref.current
    node.addEventListener('click', ignoreEvent)

    return () => {
      node.removeEventListener('click', ignoreEvent)
    }
  }, [ref])

  return (
    <TooltipTrigger key={title} placement="right-start" tooltip={menu}>
      {({ getTriggerProps, triggerRef }) => (
        <div ref={ref} className={styles.itemWrapper}>
          <div {...getTriggerProps({ ref: triggerRef })} className={styles.menuItem}>
            {icon ? <span className={styles.menuIcon}>{icon}</span> : null}
            <span className={styles.menuLabel}>{t(title)}</span>
            <Icon className={styles.menuIcon} icon={ArrowCaretRight} aria-label={t('common.expand')} />
          </div>
        </div>
      )}
    </TooltipTrigger>
  )
})

export const SubList = memo(({ icon = null, title, onClick, open, disabled, t }) => (
  <div role="button" aria-expanded={open} tabIndex="-1" onClick={onClick} className={cn(styles.itemWrapper, styles.menuOption)}>
    <div className={disabled ? styles.menuItemDisabled : styles.menuItem}>
      {icon ? <span className={styles.menuIcon}>{icon}</span> : null}
      <span className={styles.menuLabel}>{t(title)}</span>
      {open ? <Icon className={styles.menuIcon} icon={ArrowCaretUp} /> : <Icon className={styles.menuIcon} icon={ArrowCaretDown} />}
    </div>
  </div>
))

export const NestedMenu = memo(({ children, trigger, triggerVisibility, label }) => {
  const [tooltipVisibility, setTooltipVisibility] = useToggle(false)
  const menu = useMemo(() => renderMenu(children, label), [children, label])
  if (triggerVisibility) {
    return (
      <TooltipToggleContext setFunction={setTooltipVisibility}>
        <TooltipTrigger
          className={styles.nestedMenu}
          trigger="click"
          placement="right-start"
          tooltip={menu}
          onVisibilityChange={setTooltipVisibility}
          tooltipShown={tooltipVisibility}
        >
          {({ getTriggerProps, triggerRef }) => (
            <div role="button" aria-haspopup="true" aria-expanded={tooltipVisibility} {...getTriggerProps({ ref: triggerRef })}>
              {trigger}
            </div>
          )}
        </TooltipTrigger>
      </TooltipToggleContext>
    )
  } else {
    return null
  }
})

Option.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  index: PropTypes.number,
  alreadyTranslated: PropTypes.bool,
}

SubMenu.propTypes = {
  icon: PropTypes.element,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node).isRequired, PropTypes.node]),
}

NestedMenu.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf([PropTypes.node]), PropTypes.node]),
  trigger: PropTypes.element.isRequired,
  triggerVisibility: PropTypes.bool,
  label: PropTypes.string,
}

NestedMenu.defaultProps = {
  triggerVisibility: true,
}
