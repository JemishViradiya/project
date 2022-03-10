//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { useContext } from 'react'

import type { ConfirmationProps } from '../Confirmation'
import { ConfirmationContext } from './ConfirmationProvider'
import type { ConfirmationState } from './types'

type UseConfirmationOptions = Pick<
  ConfirmationProps,
  'maxWidth' | 'title' | 'content' | 'description' | 'confirmButtonLabel' | 'cancelButtonLabel'
>

/**
 * Represents a book.
 * If you want to use this hook you have to add confirmation provider
 *  to you root dir provider component module:behaviours/src/components/Confirmation/confirmationProvider
 * @module behaviours/src/components/Confirmation/ConfirmationProvider
 */
/** Returns ConfirmationContext
 * @returns {ProviderContext} ConfirmationContext.Provider which handles confirmation window settings
 */
export const useConfirmation = (): ((options: UseConfirmationOptions) => Promise<ConfirmationState>) =>
  useContext(ConfirmationContext)
