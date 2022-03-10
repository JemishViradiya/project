import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import Slider from '@material-ui/core/Slider'
import { makeStyles, withStyles } from '@material-ui/core/styles'

import type { RiskLevelTypes as RiskLevel } from '@ues-data/bis/model'

import RiskSettingLabel from '../RiskSettingLabel'

const RISK_SLIDER_MIN = 1
const RISK_SLIDER_MAX = 100
const DEFAULT_VALUE = []

const addPercentage = value => `${value}%`

interface CustomRailProps {
  color: string
  leftPosition: number
  index: number
  className: string
}

const CustomRail: React.FC<CustomRailProps> = memo(({ color, leftPosition, index, className }) => (
  <span style={{ backgroundColor: color, left: leftPosition }} className={className} data-testid={`custom-rail-${index}`} />
))

const marks = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 100,
    label: '100%',
  },
]

const sliderStyles = {
  root: {
    color: 'transparent',
  },
  thumb: {
    'z-index': '1',
    '&:focus,&:hover,&$active': {
      boxShadow: 'inherit',
    },
  },
  rail: {
    opacity: 1,
    height: '3px',
    color: '',
  },
  active: {},
  mark: {
    display: 'none',
  },
  marked: {
    'margin-bottom': '7px',
  },
}

const useStyles = makeStyles(() => ({
  customRail: {
    position: 'absolute',
    top: 13,
    right: 0,
    bottom: 0,
    height: 3,
  },
}))

const StyledSlider = withStyles(sliderStyles)(Slider)

interface SliderSettings {
  key: RiskLevel
  color: string
  text: string
}

interface Range {
  min: number
  max: number
}

interface SliderValue {
  level: RiskLevel
  range: Range
}

interface BehaviorRiskSliderProps {
  settings: SliderSettings[]
  name: string
  value: [SliderValue]
  onChange: (level: any, range?: any) => void
  min?: number
  max?: number
  disabled: boolean
}

const BehaviorRiskSlider: React.FC<BehaviorRiskSliderProps> = memo(
  ({ settings, value = DEFAULT_VALUE, onChange, min = RISK_SLIDER_MIN, max = RISK_SLIDER_MAX, disabled }) => {
    const { t } = useTranslation()
    const styles = useStyles()
    const sortedValue = [...value].sort((a, b) => b.range.max - a.range.max)
    const sliderValue = sortedValue
      .slice(1)
      .map(risk => risk.range.max)
      .reverse()

    sliderStyles.rail.color = settings[0].color

    const convertSliderValuesToRiskLevels = useCallback(
      sliderValues =>
        sortedValue.map((risk, index, arr) => {
          const length = sliderValues.length
          const riskLevel = {
            level: risk.level,
            range: null,
          }
          if (index === 0) {
            riskLevel.range = { min: sliderValues[length - index - 1], max: risk.range.max }
          } else if (index !== arr.length - 1) {
            riskLevel.range = { min: sliderValues[length - index - 1], max: sliderValues[length - index] }
          } else {
            riskLevel.range = { min: risk.range.min, max: sliderValues[length - index] }
          }

          return riskLevel
        }),
      [sortedValue],
    )

    const handleChange = useCallback(
      (e, newSliderValue) => {
        // don't allow to select the same value twice
        const isAnyValueOverlaping = newSliderValue
          .filter((v, index) => index !== newSliderValue.length - 1)
          .some((value, index) => value === sliderValue[index + 1] || newSliderValue[index + 1] === sliderValue[index])

        if (isAnyValueOverlaping) return

        const newRiskLevels = convertSliderValuesToRiskLevels(newSliderValue)
        onChange(newRiskLevels)
      },
      [onChange, sliderValue, convertSliderValuesToRiskLevels],
    )

    const ThumbComponent = useCallback(
      props => {
        const color = settings[props['data-index'] + 1].color
        props.style.color = color
        return (
          <>
            <span {...props}>{props.children}</span>
            <CustomRail className={styles.customRail} color={color} leftPosition={props.style.left} index={props['data-index']} />
          </>
        )
      },
      [settings, styles.customRail],
    )

    const riskTexts = useMemo(
      () =>
        settings.reduce((acc, curr) => {
          acc[curr.key] = curr.text
          return acc
        }, {}),
      [settings],
    )

    return (
      <>
        {!disabled && (
          <Box width={250} mt={14} pl={4} pr={4}>
            <StyledSlider
              value={sliderValue}
              onChange={handleChange}
              valueLabelDisplay="on"
              getAriaValueText={addPercentage}
              getAriaLabel={index => `thumb-${index}`}
              marks={marks}
              min={min}
              max={max}
              track={false}
              disabled={disabled}
              ThumbComponent={ThumbComponent}
            />
          </Box>
        )}

        <Box mt={6}>
          <List>
            {sortedValue.map(risk => (
              <RiskSettingLabel riskText={riskTexts[risk.level]} key={risk.level} level={risk.level}>
                {`${addPercentage(risk.range.min)} - ${addPercentage(risk.range.max)} ${t('risk.common.riskScore')}`}
              </RiskSettingLabel>
            ))}
          </List>
        </Box>
      </>
    )
  },
)

export default BehaviorRiskSlider
