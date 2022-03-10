import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TooltipTrigger from 'react-popper-tooltip'

import { useEventHandler } from '@ues-behaviour/react'
import { StatusUnknown } from '@ues/assets'

import styles from './HelpTip.module.less'
import { Icon } from './icons/Icon'
import Tooltip from './Tooltip'

const stopPropagation = e => {
  e.stopPropagation()
  e.nativeEvent && e.nativeEvent.stopImmediatePropagation()
}

const HelpTip = memo(({ wrappedText, helpText }) => {
  const [showTip, setShowTip] = useState(false)
  const { t } = useTranslation()

  const onTipClick = useEventHandler(
    e => {
      stopPropagation(e)
      setShowTip(false)
    },
    [setShowTip],
  )

  const helpTip = ({ getTooltipProps, tooltipRef }) => {
    // nodrag must be added to stop dragging tiles from underneath because the tooltip is
    // not a child of the tile

    const tipStyle = cn('nodrag', styles.popup)

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div {...getTooltipProps({ ref: tooltipRef })} className={tipStyle} onClick={onTipClick}>
        <Tooltip>{helpText}</Tooltip>
      </div>
    )
  }

  return (
    <TooltipTrigger
      trigger="click"
      placement="right-start"
      tooltipShown={showTip}
      onVisibilityChange={setShowTip}
      tooltip={helpTip}
    >
      {({ getTriggerProps, triggerRef }) => (
        <span {...getTriggerProps({ ref: triggerRef, onClick: stopPropagation })} className={styles.helpTip}>
          <span className={styles.wrappedText}>{wrappedText}</span>
          {!showTip ? <Icon className={styles.helpIcon} icon={StatusUnknown} title={t('common.learnMore')} /> : null}
        </span>
      )}
    </TooltipTrigger>
  )
})

HelpTip.propTypes = {
  wrappedText: PropTypes.string.isRequired,
  helpText: PropTypes.string.isRequired,
}

export default HelpTip
