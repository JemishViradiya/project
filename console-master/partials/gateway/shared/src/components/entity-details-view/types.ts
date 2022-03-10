//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ReduxMutation } from '@ues-data/shared'
import type { ConfirmationProps, PageTitlePanelProps } from '@ues/behaviours'

import type { NotificationMessages, useBigPermissions } from '../../hooks'
import type { Task } from '../../utils'

export interface EntityDetailsViewAction {
  dataLayer?: ReduxMutation<any, any, any>
  getArgs?: () => Record<string, unknown>
  notificationMessages?: NotificationMessages & { nameAlreadyUsedError?: string }
  onNavigateTo?: () => string
  onSuccess?: (response: any) => void
}

export interface BaseEntityData extends Record<string, unknown> {
  name?: string
}

export interface EntityDetailsViewProps {
  copyAction?: EntityDetailsViewAction
  pageHeading: Pick<PageTitlePanelProps, 'title' | 'subtitle' | 'helpId'>
  parentPage: string
  permissions: Parameters<typeof useBigPermissions>
  redux: {
    selectors: {
      getHasUnsavedChanges: (state: unknown) => boolean
      getIsEntityDefinitionValid?: (state: unknown) => boolean
      getEntityTask: (state: unknown) => Task<BaseEntityData>
    }
    actions?: { exitView: () => unknown }
  }
  readOnly?: boolean
  removeAction?: EntityDetailsViewAction
  saveAction?: EntityDetailsViewAction
  deleteConfirmationProps?: Partial<ConfirmationProps>
}
