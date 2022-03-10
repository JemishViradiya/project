import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { memo, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import TooltipTrigger from 'react-popper-tooltip'

import { BasicClose } from '@ues/assets'

import useToggle from '../components/hooks/useToggle'
import Button from '../components/widgets/Button'
import { Icon } from '../shared'
import filterStyles from './Filter.module.less'
import styles from './FilterButton.module.less'
import FilterOptions from './FilterOptions'

const stylesFilterButton = cn(styles.suggestion, styles.filterButton)
const stylesFilterButtonSingle = cn(styles.filterButton, styles.singleSelection, styles.suggestionSingleSelection)
const stylesFilterButtonSelected = cn(stylesFilterButton, styles.selected)
const stylesFilterButtonSelectedSingle = cn(styles.filterButton, styles.singleSelection)

const cancelIconNoOptions = cn(styles.close, styles.closeSingleSelection)

const buttonStyles = {
  empty: cn(styles.empty, styles.filterButton),
  critical: cn(styles.critical, styles.filterButton),
  high: cn(styles.high, styles.filterButton),
  medium: cn(styles.medium, styles.filterButton),
  low: cn(styles.low, styles.filterButton),
  unknown: cn(styles.unknown, styles.filterButton),
}
const selectedButtonStyles = {
  empty: cn(styles.selected, buttonStyles.empty),
  critical: cn(styles.selected, buttonStyles.critical),
  high: cn(styles.selected, buttonStyles.high),
  medium: cn(styles.selected, buttonStyles.medium),
  low: cn(styles.selected, buttonStyles.low),
  unknown: cn(styles.selected, buttonStyles.unknown),
}

const CloseIcon = ({ t, onClose, singleSelection = false }) => (
  <Icon
    role="button"
    tabIndex="-1"
    aria-label={t('common.close')}
    className={!singleSelection ? styles.close : cancelIconNoOptions}
    icon={BasicClose}
    onClick={onClose}
    title={t('common.remove')}
  />
)

const OptionChitButton = memo(({ activeClass, activeLabel, showMenu, onClose, toggleMenu, t, triggerRef, ...triggerProps }) => (
  <span
    role="button"
    tabIndex="-1"
    className={(showMenu ? selectedButtonStyles : buttonStyles)[activeClass]}
    ref={triggerRef}
    onClick={toggleMenu}
    {...triggerProps}
  >
    {t(activeLabel)}
    <CloseIcon onClose={onClose} t={t} />
  </span>
))
OptionChitButton.displayName = 'OptionChitButton'

const useCloseChit = onToggle =>
  useCallback(
    e => {
      e.stopPropagation()
      onToggle()
    },
    [onToggle],
  )

const SingleSelectionChitButton = ({ t, onToggle, singleSelection, checked, id, label, buttonStyles }) => {
  const onButtonClick = useCloseChit(onToggle)
  return (
    <span
      role="button"
      tabIndex="-1"
      id={id}
      title={t('common.list.applyFilter')}
      disabled={checked}
      onClick={onButtonClick}
      className={buttonStyles}
    >
      {label}
      {checked && <CloseIcon onClose={onButtonClick} t={t} singleSelection={singleSelection} />}
    </span>
  )
}

const SecondaryOptionChit = ({ setShowMenu, onToggle, activeColor, buttonTooltip, ...props }) => {
  const onClose = useCloseChit(onToggle)
  return <OptionChitButton onClose={onClose} {...props} />
}

const OptionChit = memo(({ activeLabel, activeClass, onToggle, showMenu, toggleMenu, setShowMenu, buttonTooltip, t }) => {
  const onClose = useCloseChit(onToggle)

  const activeButtonContents = useMemo(
    () => ({ getTriggerProps, triggerRef }) => (
      <OptionChitButton
        activeClass={activeClass}
        activeLabel={activeLabel}
        showMenu={showMenu}
        toggleMenu={toggleMenu}
        t={t}
        {...getTriggerProps({ triggerRef })}
        onClose={onClose}
      />
    ),
    [activeClass, activeLabel, showMenu, toggleMenu, onClose, t],
  )

  return (
    <TooltipTrigger
      placement="bottom-start"
      trigger="click"
      tooltipShown={showMenu}
      onVisibilityChange={setShowMenu}
      tooltip={buttonTooltip}
    >
      {activeButtonContents}
    </TooltipTrigger>
  )
})
OptionChit.displayName = 'OptionChit'

const FilterButton = memo(({ id, options, label, query, variables, dataAccessor, field, singleSelection = false, styleClass }) => {
  const { t } = useTranslation()
  const [showMenu, toggleMenu, setShowMenu] = useToggle(false)
  const optionsRef = useRef({})
  const setOptionRef = useCallback(({ key }, input) => (optionsRef.current[key] = input), [optionsRef])
  const stylesButtonWithOptions = cn(styleClass, showMenu ? stylesFilterButtonSelected : stylesFilterButton)
  const stylesButtonSingleSelection = cn(
    styleClass,
    singleSelection && options[0].checked ? stylesFilterButtonSelectedSingle : stylesFilterButtonSingle,
  )

  const onApply = useCallback(() => {
    for (const option of options) {
      const value = optionsRef.current[option.key].checked
      if (value !== option.checked) {
        option.onToggle()
      }
    }
    setShowMenu(false)
  }, [options, setShowMenu, optionsRef])

  const buttonTooltip = useMemo(
    () => ({ getTooltipProps, tooltipRef }) => (
      <div
        {...getTooltipProps({
          ref: tooltipRef,
        })}
        id={`${id}-container`}
        className={filterStyles.menuContainer}
      >
        <FilterOptions
          query={query}
          variables={variables}
          dataAccessor={dataAccessor}
          options={options}
          field={field}
          setRef={setOptionRef}
        />
        <Button
          className={filterStyles.apply}
          size="small"
          color="primary"
          aria-label="apply button"
          tabIndex="-1"
          onClick={onApply}
        >
          {t('common.apply')}
        </Button>
      </div>
    ),
    [id, query, variables, dataAccessor, options, field, setOptionRef, onApply, t],
  )

  const buttonContents = useMemo(
    () => ({ getTriggerProps, triggerRef }) => (
      <span
        id={id}
        title={t('common.list.applyFilter')}
        role="button"
        tabIndex="-1"
        {...getTriggerProps({
          ref: triggerRef,
          className: stylesButtonWithOptions,
        })}
      >
        {label}
      </span>
    ),
    [id, label, t, stylesButtonWithOptions],
  )

  const active = options
    .filter(option => option.checked && !singleSelection)
    .map((option, i) => {
      const Component = i === 0 ? OptionChit : SecondaryOptionChit
      return (
        <Component
          key={`FilterButton-label-${option.activeLabel}`}
          showMenu={showMenu}
          toggleMenu={toggleMenu}
          setShowMenu={setShowMenu}
          buttonTooltip={buttonTooltip}
          t={t}
          {...option}
        />
      )
    })

  if (active.length !== 0) {
    return active
  }

  return !singleSelection ? (
    <TooltipTrigger
      placement="bottom-start"
      trigger="click"
      tooltipShown={showMenu}
      onVisibilityChange={setShowMenu}
      tooltip={buttonTooltip}
    >
      {buttonContents}
    </TooltipTrigger>
  ) : (
    <SingleSelectionChitButton
      t={t}
      id={id}
      checked={options[0].checked}
      toggleMenu={toggleMenu}
      onToggle={options[0].onToggle}
      singleSelection={singleSelection}
      buttonStyles={stylesButtonSingleSelection}
      label={label}
    />
  )
})

FilterButton.displayName = 'FilterButton'

FilterButton.propTypes = {
  field: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array,
  query: PropTypes.object,
  variables: PropTypes.object,
  dataAccessor: PropTypes.func,
  singleSelection: PropTypes.bool,
  styleClass: PropTypes.string,
}

export default FilterButton
