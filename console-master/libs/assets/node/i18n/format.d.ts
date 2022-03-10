import type { MomentInput } from 'moment'

export enum I18nFormats {
  Date = 'date',
  DateShort = 'date-short',
  Time = 'time',
  DateTime = 'datetime',
  DateTimeShort = 'datetime-short',
  DateTimeUTC = 'datetime-utc',
  DateTimeRelative = 'datetime-relative',
  DateTimeForEvents = 'datetime-humanized',
  Number = 'number',
  Currency = 'currency',
}

export function format(
  value: unknown,
  formatStr?: I18nFormats | string,
  lng?: string,
  options?: InterpolationOptions & { [key: string]: unknown },
): string

export function onLanguageChange(lang: string): void

export function formatHumanizedDate(value: MomentInput, useRelativeFeature?: boolean): string
