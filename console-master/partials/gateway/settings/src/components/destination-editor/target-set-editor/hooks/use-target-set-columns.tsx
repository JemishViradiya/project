//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import cn from 'classnames'
import React, { useCallback } from 'react'
import type { UseFormMethods } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { GridSize } from '@material-ui/core'
import { Box, IconButton, Tooltip } from '@material-ui/core'

import type { FormGridLayoutProps } from '@ues-behaviour/hook-form'
import { FieldModelType, InputGroups } from '@ues-behaviour/hook-form'
import { TargetSetPortProtocol } from '@ues-data/gateway'
import { Components, Config, Utils } from '@ues-gateway/shared'
import { BasicInfo, BasicMoreHoriz } from '@ues/assets'
import { AriaElementLabel } from '@ues/assets-e2e'

import { ConjunctionLabel } from '../../../conjunction-label'
import useConjunctionLabelStyles from '../../../conjunction-label/styles'
import { SELECT_DEFAULT_VALUE, TARGET_SET_COLUMNS, TOOLTIP_DELAY, TOOLTIP_PLACEMENT } from '../constants'
import { TargetSetFieldName } from '../types'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { isValidPort, isValidIPOrRange, isValidDomainOrFQDN, MIN_PORT_NUMBER, MAX_PORT_NUMBER } = Utils
const { EntityDetailsViewContext } = Components

const appendItem = (gridIndex: string, fieldsCount: number, setsInitialLength: any) => {
  const [rowIndex, colIndex] = gridIndex.split('')
  const colName = TARGET_SET_COLUMNS[colIndex]

  if (setsInitialLength?.[rowIndex]?.[colName] > fieldsCount) {
    return (
      <Box mt={3}>
        <BasicMoreHoriz />
      </Box>
    )
  }
}

interface TargetSetCellProps {
  rowIndex: number
  rowsCount: number
  showConjunctionLabel?: boolean
  setsInitialLength: any
}

const AddressesCell: React.FC<TargetSetCellProps> = ({
  showConjunctionLabel,
  rowIndex,
  rowsCount,
  setsInitialLength,
  ...restInputGroupsProps
}) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  return (
    <Box display="flex">
      {showConjunctionLabel && <ConjunctionLabel showText={rowsCount > 1 && rowIndex !== 0} />}
      <Box>
        <InputGroups
          appendItem={(gridIndex, fieldsCount) => appendItem(gridIndex, fieldsCount, setsInitialLength)}
          fieldsModel={{
            destination: {
              type: FieldModelType.Text,
              name: 'destination',
              validationRules: {
                validate: {
                  validateDestination: value =>
                    value
                      ? isValidIPOrRange(value) ||
                        isValidDomainOrFQDN(value) ||
                        (t('networkServices.destinationValidationMessage') as string)
                      : true,
                },
              },
              muiProps: { placeholder: t('common.address') },
            },
          }}
          {...restInputGroupsProps}
        />
      </Box>
    </Box>
  )
}

type UseTargetSetColumnsFn = (setsInitialLength, showConjunctionLabel: boolean) => FormGridLayoutProps['columns']

export const useTargetSetColumns: UseTargetSetColumnsFn = (setsInitialLength, showConjunctionLabel) => {
  const conjunctionLabelClasses = useConjunctionLabelStyles()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const getInputGroup = (formFieldName: string, formInstance: UseFormMethods) => {
    const [gridRowIndex, inputGroupIndex] = formFieldName.split('.')

    return {
      inputGroup: formInstance.getValues()?.[gridRowIndex]?.[inputGroupIndex],
      gridIndex: { gridRowIndex, inputGroupIndex },
    }
  }

  const makeFieldName = (gridIndex: { gridRowIndex: string; inputGroupIndex: string }, field: TargetSetFieldName) =>
    `${gridIndex.gridRowIndex}.${gridIndex.inputGroupIndex}.${field}`

  const handleOnBlur = useCallback(
    ({ value, formInstance, formFieldName }: { value: number | string; formInstance: UseFormMethods; formFieldName: string }) => {
      const { inputGroup, gridIndex } = getInputGroup(formFieldName, formInstance)

      if (value !== '' && inputGroup?.max === '') {
        formInstance.setValue(makeFieldName(gridIndex, TargetSetFieldName.MaxPort), value)
        formInstance.trigger(makeFieldName(gridIndex, TargetSetFieldName.MaxPort))
      }

      if (value !== '' && inputGroup?.min === '') {
        formInstance.setValue(makeFieldName(gridIndex, TargetSetFieldName.MinPort), value)
        formInstance.trigger(makeFieldName(gridIndex, TargetSetFieldName.MinPort))
      }
    },
    [],
  )

  const validateMinPort = useCallback(
    (value: number | string, formInstance: UseFormMethods, formFieldName: string) => {
      const { inputGroup, gridIndex } = getInputGroup(formFieldName, formInstance)

      if (value !== '' && !isValidPort(value as string)) {
        return t('networkServices.portValidationMessage', { minPortNumber: MIN_PORT_NUMBER, maxPortNumber: MAX_PORT_NUMBER })
      }

      if (
        (value !== '' && value <= Number(inputGroup?.max)) ||
        (value === '' && inputGroup?.max === '' && inputGroup?.protocol === SELECT_DEFAULT_VALUE)
      ) {
        formInstance.clearErrors(makeFieldName(gridIndex, TargetSetFieldName.MaxPort))
      }

      if (value === '' && inputGroup?.max === '') {
        formInstance.clearErrors(makeFieldName(gridIndex, TargetSetFieldName.Protocol))
      }

      if (value !== '' && inputGroup?.max === '') {
        formInstance.trigger(makeFieldName(gridIndex, TargetSetFieldName.MaxPort))
      }

      if (value !== '' && inputGroup?.protocol === SELECT_DEFAULT_VALUE) {
        formInstance.trigger(makeFieldName(gridIndex, TargetSetFieldName.Protocol))
      }

      if (value !== '' && inputGroup?.max !== '' && value > Number(inputGroup?.max)) {
        return t('networkServices.minPortValidationMessage')
      }

      if (value === '' && (inputGroup?.max !== '' || inputGroup?.protocol !== SELECT_DEFAULT_VALUE)) {
        return t('general/form:validationErrors.required')
      }
    },
    [t],
  )

  const validateMaxPort = useCallback(
    (value: number | string, formInstance: UseFormMethods, formFieldName: string) => {
      const { inputGroup, gridIndex } = getInputGroup(formFieldName, formInstance)

      if (value !== '' && !isValidPort(value as string)) {
        return t('networkServices.portValidationMessage', { minPortNumber: MIN_PORT_NUMBER, maxPortNumber: MAX_PORT_NUMBER })
      }

      if (
        (value !== '' && inputGroup?.min !== '' && value >= Number(inputGroup?.min)) ||
        (value === '' && inputGroup?.min === '' && inputGroup?.protocol === SELECT_DEFAULT_VALUE)
      ) {
        formInstance.clearErrors(makeFieldName(gridIndex, TargetSetFieldName.MinPort))
      }

      if (value === '' && inputGroup?.min === '') {
        formInstance.clearErrors(makeFieldName(gridIndex, TargetSetFieldName.Protocol))
      }

      if (value !== '' && value < Number(inputGroup?.min)) {
        return t('networkServices.maxPortValidationMessage')
      }

      if (value !== '' && inputGroup?.min === '') {
        formInstance.trigger(makeFieldName(gridIndex, TargetSetFieldName.MinPort))
      }

      if (value !== '' && inputGroup?.protocol === SELECT_DEFAULT_VALUE) {
        formInstance.trigger(makeFieldName(gridIndex, TargetSetFieldName.Protocol))
      }

      if (value === '' && (inputGroup?.min !== '' || inputGroup?.protocol !== SELECT_DEFAULT_VALUE)) {
        return t('general/form:validationErrors.required')
      }
    },
    [t],
  )

  return [
    {
      dataKey: TARGET_SET_COLUMNS[0],
      renderCell: (rowIndex, rowsCount) => (
        <AddressesCell
          rowIndex={rowIndex}
          rowsCount={rowsCount}
          setsInitialLength={setsInitialLength}
          showConjunctionLabel={showConjunctionLabel}
        />
      ),
      renderLabel: () => (
        <Box className={cn({ [conjunctionLabelClasses.placeholder]: showConjunctionLabel })}>
          {t('common.address')}
          <Tooltip title={t('networkServices.tooltipAddress')} placement={TOOLTIP_PLACEMENT} enterDelay={TOOLTIP_DELAY}>
            <IconButton size="small" aria-label={AriaElementLabel.TargetSetShowDestinationTooltipButton}>
              <BasicInfo />
            </IconButton>
          </Tooltip>
        </Box>
      ),
      muiProps: { xs: 4 as GridSize },
    },
    {
      dataKey: TARGET_SET_COLUMNS[1],
      renderCell: () => (
        <InputGroups
          appendItem={(gridIndex, fieldsCount) => appendItem(gridIndex, fieldsCount, setsInitialLength)}
          onBlur={handleOnBlur}
          fieldsModel={{
            protocol: {
              type: FieldModelType.Select,
              name: 'protocol',
              options: [
                { label: t('common.protocol'), value: SELECT_DEFAULT_VALUE },
                { label: TargetSetPortProtocol.TCP, value: TargetSetPortProtocol.TCP },
                { label: TargetSetPortProtocol.UDP, value: TargetSetPortProtocol.UDP },
                { label: TargetSetPortProtocol.TCPorUDP, value: TargetSetPortProtocol.TCPorUDP },
              ],
              validationRules: {
                validate: (value, formInstance, formFieldName) => {
                  const { inputGroup, gridIndex } = getInputGroup(formFieldName, formInstance)

                  if (value === SELECT_DEFAULT_VALUE && (inputGroup.min !== '' || inputGroup.max !== '')) {
                    return t('networkServices.protocolValidationMessage') as string
                  }

                  if (value === SELECT_DEFAULT_VALUE && inputGroup.min === '' && inputGroup.max === '') {
                    formInstance.clearErrors(makeFieldName(gridIndex, TargetSetFieldName.MinPort))
                    formInstance.clearErrors(makeFieldName(gridIndex, TargetSetFieldName.MaxPort))
                  }

                  if (value !== SELECT_DEFAULT_VALUE && inputGroup.min === '' && inputGroup.max === '') {
                    formInstance.trigger(makeFieldName(gridIndex, TargetSetFieldName.MinPort))
                    formInstance.trigger(makeFieldName(gridIndex, TargetSetFieldName.MaxPort))
                  }
                },
              },
              muiProps: {
                defaultValue: SELECT_DEFAULT_VALUE,
              },
            },
            min: {
              type: FieldModelType.Text,
              name: 'min',
              validationRules: {
                validate: validateMinPort,
              },
              muiProps: {
                type: 'number',
                placeholder: t('common.from'),
                inputProps: {
                  min: MIN_PORT_NUMBER,
                  max: MAX_PORT_NUMBER,
                },
              },
            },
            max: {
              type: FieldModelType.Text,
              name: 'max',
              validationRules: {
                validate: validateMaxPort,
              },
              muiProps: {
                type: 'number',
                placeholder: t('common.to'),
                inputProps: {
                  min: MIN_PORT_NUMBER,
                  max: MAX_PORT_NUMBER,
                },
              },
            },
          }}
        />
      ),
      renderLabel: () => (
        <Box>
          {t('networkServices.labelProtocolPort')}
          <Tooltip title={t('networkServices.tooltipProtocol')} placement={TOOLTIP_PLACEMENT} enterDelay={TOOLTIP_DELAY}>
            <IconButton size="small" aria-label={AriaElementLabel.TargetSetShowProtocolTooltipButton}>
              <BasicInfo />
            </IconButton>
          </Tooltip>
        </Box>
      ),
      muiProps: { xs: 6 as GridSize },
    },
  ]
}
