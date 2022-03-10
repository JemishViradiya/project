import React, { useMemo } from 'react'

import Hidden from '@material-ui/core/Hidden'
import Slider from '@material-ui/core/Slider'
import { useTheme, withStyles } from '@material-ui/core/styles'

import { getRiskLevelColor } from '../../../common/RiskLevelColor'
import RiskEnginesInput from '../Input'
import { RangeType } from '../RangeType'
import type { SliderProps } from '../types'
import useStyles from './styles'

const addPercentage = value => `${value}%`

const getSliderStyles = (railColor, trackBackground) => ({
  root: {
    color: railColor,
  },
  thumb: {
    'z-index': '1',
    '&:focus,&:hover': {
      boxShadow: 'inherit',
    },
  },
  rail: {
    opacity: 1,
    height: '3px',
    color: railColor,
  },
  track: {
    height: 3,
    backgroundColor: `${trackBackground} !important`,
  },
  marked: {
    'margin-bottom': '7px',
  },
  valueLabel: {
    fontSize: '0.875rem',
  },
})

const RISK_SLIDER_MIN = 1
const RISK_SLIDER_MAX = 100

const RiskEnginesSlider = ({ disabled, handleSliderChange, handleSliderInputChange, value, riskLevel }: SliderProps) => {
  const styles = useStyles()
  const theme = useTheme()
  const StyledSlider = useMemo(
    () => withStyles(getSliderStyles(getRiskLevelColor(riskLevel, theme), theme.palette.grey['300']))(Slider),
    [riskLevel, theme],
  )
  return (
    !disabled && (
      <div className={styles.inputSliderWrapper}>
        <RiskEnginesInput
          value={value.min}
          onChange={handleSliderInputChange}
          rangeType={RangeType.MIN}
          min={RISK_SLIDER_MIN}
          max={RISK_SLIDER_MAX}
        />
        <Hidden smDown>
          <div className={styles.sliderWrapper}>
            <StyledSlider
              value={value.min}
              onChange={handleSliderChange}
              valueLabelDisplay="on"
              getAriaValueText={addPercentage}
              aria-labelledby="discrete-slider-always"
              getAriaLabel={index => `thumb-${index}`}
              track="inverted"
              min={RISK_SLIDER_MIN}
              max={RISK_SLIDER_MAX}
            />
          </div>
          <p className={styles.labelText}>100 %</p>
        </Hidden>
      </div>
    )
  )
}

export default RiskEnginesSlider
