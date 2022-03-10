import React from 'react'

import type { SelectProps } from '@ues/behaviours'
import { Select as SelectComponent } from '@ues/behaviours'

import { useStandalone as isStandalone } from '../../hooks'

const defaultVariant = isStandalone() ? 'outlined' : 'filled'

const Select = ({ variant = defaultVariant, ...props }: SelectProps) => <SelectComponent variant={variant} {...props} />

export default Select
