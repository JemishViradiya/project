/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { CustomI18n as i18nInterface, TFunction } from 'i18next'
import type { MomentInput } from 'moment'

import type { I18nFormats } from '.'
import { format as defaultFormat } from './format'
import { loadI18nCore } from './loadI18nCore'

declare module 'i18next' {
  interface IFormat {
    (
      value: string,
      format?: undefined,
      lng?: string,
      options?: InterpolationOptions & {
        [key: string]: any
      },
    ): string
    (
      value: MomentInput,
      format?:
        | I18nFormats.Date
        | I18nFormats.DateShort
        | I18nFormats.Time
        | I18nFormats.DateTime
        | I18nFormats.DateTimeShort
        | I18nFormats.DateTimeUTC
        | I18nFormats.DateTimeRelative
        | I18nFormats.DateTimeForEvents,
      lng?: string,
      options?: InterpolationOptions & {
        [key: string]: any
      },
    ): string
    (
      value: number,
      format?: I18nFormats.Number | I18nFormats.Currency,
      lng?: string,
      options?: InterpolationOptions & {
        [key: string]: any
      },
    ): string

    specifier(format: I18nFormats): string
  }
  interface CustomI18n extends i18n {
    format: IFormat
  }
}

declare module 'react-i18next' {
  export function useTranslation(
    ns?: Namespace,
    options?: UseTranslationOptions,
  ): [TFunction, i18nInterface, boolean] & {
    t: TFunction
    i18n: i18nInterface
    ready: boolean
  }
}

export const loadI18n: typeof loadI18nCore = (env, opts = {}): void => loadI18nCore(env, { format: defaultFormat, ...opts })
