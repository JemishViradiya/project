import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Collapse from '@material-ui/core/Collapse'

import styles from './MultiTierList.module.less'
import { Option, SubList, SubMenu } from './NestedMenu'

const OptionsAsPopper = memo(({ options, onClick, title, icon, noOptionsText, open, disabled, t }) =>
  disabled ? (
    <SubList disabled={disabled} title={title} open={open} icon={icon} t={t} />
  ) : (
    <SubMenu key={title} onClick={onClick} title={title} open={open} icon={icon}>
      {options.length
        ? options.map(({ title, disabled, onClick, key, showOption, alreadyTranslated }, index) =>
            showOption ? (
              <Option
                key={key || title}
                title={title}
                onClick={onClick}
                disabled={disabled}
                index={index}
                t={t}
                alreadyTranslated={alreadyTranslated}
              />
            ) : null,
          )
        : t(noOptionsText)}
    </SubMenu>
  ),
)

const SecondTierListOptions = memo(({ secondTierOptions, t }) =>
  secondTierOptions.map(({ showOption, title, thirdTierOptions, onClick, disabled, noThirdTierOptionsText }, index) => {
    return showOption ? (
      <div role="menuitem" data-index={index} key={title}>
        {thirdTierOptions ? (
          <OptionsAsPopper
            options={thirdTierOptions}
            key={title}
            title={title}
            noOptionsText={noThirdTierOptionsText}
            disabled={disabled}
            t={t}
          />
        ) : (
          <Option key={title} title={title} onClick={onClick} disabled={disabled} t={t} />
        )}
      </div>
    ) : null
  }),
)

const SecondTierListWrapper = memo(({ secondTierOptions, t, open, isLastOption }) => (
  <Collapse in={open} timeout={{ appear: 0, exit: 0, enter: 0 }} unmountOnExit>
    <div role="menu" className={cn(isLastOption ? styles.nestedOption : [styles.nestedOption, styles.optionWrapper])}>
      <SecondTierListOptions secondTierOptions={secondTierOptions} t={t} />
    </div>
  </Collapse>
))

const ListOptions = memo(({ options, t, openObj, handleOpenClick }) =>
  options.map((option, index) => {
    const { secondTierOptions, title, icon, showOption, secondTierOptionsAsPopper, noSecondTierOptionsText, disabled } = option
    const open = openObj[title]
    const isLastOption = options.length - 1 === index

    return showOption ? (
      <div role="menuitem" aria-label={t(title)} key={title}>
        {secondTierOptionsAsPopper ? (
          <OptionsAsPopper
            options={secondTierOptions}
            noOptionsText={noSecondTierOptionsText}
            onClick={() => handleOpenClick(title)}
            title={title}
            open={open}
            icon={icon}
            disabled={disabled}
            t={t}
          />
        ) : disabled ? (
          <SubList disabled={disabled} title={title} open={open} icon={icon} t={t} />
        ) : (
          <>
            <SubList onClick={() => handleOpenClick(title)} title={title} open={open} icon={icon} t={t} />
            <SecondTierListWrapper secondTierOptions={secondTierOptions} t={t} open={open} isLastOption={isLastOption} />
          </>
        )}
      </div>
    ) : null
  }),
)

const MultiTierList = memo(({ listOptions }) => {
  const options = useMemo(() => listOptions.filter(option => !!option.showOption), [listOptions])
  const [open, setOpen] = useState(
    options.reduce((obj, item) => {
      return {
        ...obj,
        [item.title]: false,
      }
    }, {}),
  )
  const { t } = useTranslation()
  const handleOpenClick = useCallback(
    title => {
      setOpen({ ...open, [title]: !open[title] })
    },
    [open],
  )
  return <ListOptions options={options} t={t} openObj={open} handleOpenClick={handleOpenClick} />
})

MultiTierList.displayName = 'MultiTierList'

const OptionSchema = {
  key: PropTypes.string,
  title: PropTypes.string.isRequired,
  showOption: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
}

// IMPORTANT: a title of each option has to be unique
MultiTierList.propTypes = {
  listOptions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      showOption: PropTypes.bool.isRequired,
      secondTierOptions: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.shape(OptionSchema),
          PropTypes.shape({
            title: PropTypes.string.isRequired,
            thirdTierOptions: PropTypes.arrayOf(PropTypes.shape(OptionSchema)),
            showOption: PropTypes.bool.isRequired,
            disabled: PropTypes.bool.isRequired,
            noThirdTierOptionsText: PropTypes.string.isRequired,
          }),
        ]),
      ),
      noSecondTierOptionsText: PropTypes.string,
      secondTierOptionsAsPopper: PropTypes.bool.isRequired,
    }).isRequired,
  ).isRequired,
}

export default MultiTierList
