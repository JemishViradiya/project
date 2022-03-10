import PropTypes from 'prop-types'
import React, { memo, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import TooltipTrigger from 'react-popper-tooltip'

import { ArrowChevronDown, ArrowChevronRight } from '@ues/assets'

import useToggle from '../components/hooks/useToggle'
import { Icon } from '../components/icons/Icon'
import Button from '../components/widgets/Button'
import styles from './Filter.module.less'
import FilterOptions from './FilterOptions'

export const Expander = memo(({ label, children }) => {
  const [open, toggle] = useToggle()
  return (
    <div aria-label={label} className={styles.expanderOption}>
      <div className={styles.expanderRow} role="button" tabIndex="-1" aria-expanded={open} onClick={toggle}>
        <span className={open ? styles.expanderOpen : undefined}>{label}</span>
        <span className={styles.expander}>
          <Icon icon={open ? ArrowChevronDown : ArrowChevronRight} />
        </span>
      </div>
      {open ? children : null}
    </div>
  )
})

Expander.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export const FilterLink = memo(({ id, label, query, variables, dataAccessor, options: optionsProp }) => {
  const { t } = useTranslation()
  const [showMenu, toggleMenu, setShowMenu] = useToggle()

  const options = useRef({})

  const setOptionRef = useCallback(({ field, key }, input) => {
    if (!options.current[field]) {
      options.current[field] = []
    }
    options.current[field][key] = input
  }, [])

  const onClear = useCallback(() => {
    for (const option of Object.values(options.current)) {
      for (const input of Object.values(option)) {
        if (input) {
          input.checked = false
        }
      }
    }

    optionsProp.forEach(option => {
      const levels = option.levels
      levels.forEach(level => {
        if (level.checked) {
          level.onToggle()
        }
      })
    })
    setShowMenu(false)
  }, [optionsProp, setShowMenu])

  const onApply = useCallback(() => {
    Object.keys(options.current).forEach(key => {
      const levels = optionsProp.find(x => x.field === key).levels
      levels.forEach(level => {
        const hasValue = options.current[key] && options.current[key][level.key]
        if (hasValue && options.current[key][level.key].checked !== level.checked) {
          level.onToggle()
        }
      })
    })
    setShowMenu(false)
  }, [optionsProp, setShowMenu])

  const renderOptions = useCallback(() => {
    return optionsProp.map(option => {
      return (
        <Expander key={`expander-${option.field}`} label={t(option.label)}>
          <FilterOptions
            query={query}
            variables={variables}
            dataAccessor={dataAccessor}
            options={option.levels}
            field={option.field}
            setRef={setOptionRef}
          />
        </Expander>
      )
    })
  }, [dataAccessor, optionsProp, query, setOptionRef, variables, t])

  const renderTooltip = useCallback(
    ({ getTooltipProps, tooltipRef }) => {
      return (
        <div
          {...getTooltipProps({
            ref: tooltipRef,
          })}
          className={styles.menuContainer}
        >
          <div className={styles.allOptions}>{renderOptions()}</div>
          <div className={styles.bottomControls}>
            <Button
              size="small"
              variant="text"
              aria-label="clear button"
              key="button-clear"
              className={styles.clearLink}
              tabIndex="-1"
              onClick={onClear}
            >
              {t('common.clearAll')}
            </Button>
            <Button
              size="small"
              aria-label="apply button"
              key="button-show"
              className={styles.showButton}
              tabIndex="-1"
              onClick={onApply}
            >
              {t('common.showResults')}
            </Button>
          </div>
        </div>
      )
    },
    [onApply, onClear, renderOptions, t],
  )

  const renderTrigger = useCallback(
    ({ getTriggerProps, triggerRef }) => (
      <span id={id} {...getTriggerProps({ ref: triggerRef, className: styles.filterLink })}>
        {label}
      </span>
    ),
    [id, label],
  )

  return (
    <TooltipTrigger
      placement="bottom-start"
      trigger="click"
      tooltipShown={showMenu}
      onVisibilityChange={toggleMenu}
      tooltip={renderTooltip}
    >
      {renderTrigger}
    </TooltipTrigger>
  )
})

FilterLink.displayName = 'FilterLink'

FilterLink.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
  query: PropTypes.object.isRequired,
  variables: PropTypes.object,
  dataAccessor: PropTypes.func.isRequired,
}

export default FilterLink
