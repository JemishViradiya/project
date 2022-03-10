import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { makeStyles } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(() => ({
  wrapper: {
    display: 'block',
  },
}))

interface SwitchControlCollapseSectionProps {
  label: string
  onChange: (checked: boolean) => void
  disabled: boolean
  checked: boolean
}

interface SwitchControlCollapseSectionContainerProps {
  label: string
  name: string
  disabled: boolean
}

const SwitchControlCollapseSection: React.FC<SwitchControlCollapseSectionProps> = ({
  label,
  children,
  onChange,
  disabled,
  checked,
}) => {
  const styles = useStyles()

  return (
    <FormControl margin="normal" role="group" className={styles.wrapper}>
      <FormControlLabel
        disabled={disabled}
        label={
          <Box ml={4}>
            <Typography variant="h4">{label}</Typography>
          </Box>
        }
        control={<Switch edge="end" checked={checked} onChange={event => onChange(event.target.checked)} disableRipple />}
      />
      {children && (
        <Collapse in={checked} timeout="auto">
          <Box mt={4}>{children}</Box>
        </Collapse>
      )}
    </FormControl>
  )
}

const SwitchControlCollapseSectionContainer: React.FC<SwitchControlCollapseSectionContainerProps> = ({
  label,
  children,
  name,
  disabled,
}) => {
  const { control } = useFormContext()

  const renderSection = useCallback(
    ({ onChange, value }) => (
      <SwitchControlCollapseSection label={label} children={children} disabled={disabled} checked={value} onChange={onChange} />
    ),
    [disabled, label, children],
  )

  return (
    <Box mt={2} mb={8}>
      <Controller name={name} control={control} render={renderSection} />
    </Box>
  )
}

SwitchControlCollapseSectionContainer.displayName = 'SwitchControlCollapseSection'

export default SwitchControlCollapseSectionContainer
