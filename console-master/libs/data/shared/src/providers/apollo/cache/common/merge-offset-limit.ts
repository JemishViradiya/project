import type { ApolloCache, FieldFunctionOptions, FieldPolicy } from '@apollo/client'

import { createApolloEntitiesQuery } from '../../../../utils/apollo'

type KeyArgs = FieldPolicy<any>['keyArgs']

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

interface OffsetLimitArgs {
  offset?: number
  limit: number
}

// eslint-disable-next-line @typescript-eslint/ban-types
type SafeReadonly<T> = T extends object ? Readonly<T> : T

declare interface AsT<T> {
  (obj, mergeField?: string): T
}

const tryReadMergeField = <T>(mergeField: string, cache: ApolloCache<any>, factory: AsT<T> = obj => obj) => {
  try {
    const [, typeSpec] = mergeField.split('@')
    const typeName = JSON.parse(typeSpec.slice(5, -1)).name
    const query = createApolloEntitiesQuery(typeName)
    const data = cache.readQuery({ query })
    if (data && data[typeName]) {
      const elements = data[typeName]
      return factory({ [mergeField]: elements } as unknown, mergeField)
    }
  } catch (error) {
    console.warn(error)
  }
}

const offsetLimitMerge = <TMergeField extends string, T extends Record<TMergeField, unknown[]>>(
  mergeField: TMergeField,
  factory: AsT<T>,
) => (
  _existing: SafeReadonly<T> | undefined,
  incoming: SafeReadonly<T>,
  opts: FieldFunctionOptions<Partial<OffsetLimitArgs>, Partial<OffsetLimitArgs>>,
) => {
  const { args, variables } = opts
  const existing = _existing || tryReadMergeField<T>(mergeField, opts.cache, factory)
  // Assume an offset of 0 if args.offset omitted.
  const offset = args?.offset || variables.offset || 0
  const merged = existing && offset ? existing[mergeField].slice(0) : []
  const toMerge = incoming ? incoming[mergeField] : []
  if (args) {
    for (let i = 0; i < toMerge.length; ++i) {
      merged[offset + i] = toMerge[i]
    }
  } else {
    // It's unusual (probably a mistake) for a paginated field not
    // to receive any arguments, so you might prefer to throw an
    // exception here, instead of recovering by appending incoming
    // onto the existing array.
    merged.push(...toMerge)
  }
  return {
    ...incoming,
    [mergeField]: merged,
  }
}

export function offsetLimitPagination<TMergeField extends string, T extends Record<TMergeField, unknown[]>>(
  keyArgs: KeyArgs = false,
  mergeField: TMergeField,
  read: { factory?: AsT<T> } = {},
): FieldPolicy<T> {
  return {
    keyArgs,
    read: !read
      ? undefined
      : (existing, { variables: { offset, limit }, cache }) => {
          if (!existing) return tryReadMergeField<T>(mergeField, cache, read.factory)
          return {
            ...existing,
            [mergeField]: existing[mergeField],
          }
        },
    merge: offsetLimitMerge<TMergeField, T>(mergeField, read.factory),
  }
}

interface OffsetLimitSortByArgs<TSortableKeys = string> extends OffsetLimitArgs {
  sortBy?: TSortableKeys
  sortDirection?: SortDirection
}

type Sorter<T = Record<string, any>> = (
  sortBy: keyof T,
  sortDirection: SortDirection,
  readField: (k: keyof T, t: T) => string,
) => (a: T, b: T) => number

const defaultSort: Sorter<Record<string, string>> = (sortBy, sortDirection, readField) => (
  a: Record<string, string>,
  b: Record<string, string>,
) =>
  (sortDirection === SortDirection.ASC ? 1 : -1) *
  new Intl.Collator('en', { sensitivity: 'base' }).compare(readField(sortBy, a), readField(sortBy, b))

const sortData = (processed, { args, variables = {}, readField }, sortFn) => {
  const { sortBy, sortDirection = SortDirection.ASC } = Object.assign({}, variables, args)
  if (sortBy) {
    processed = [...processed].sort(sortFn(sortBy, sortDirection, readField))
  }
  return processed
}

export function offsetLimitSortByPagination<TMergeField extends string, T extends Record<TMergeField, unknown[]>>(
  keyArgs: KeyArgs = false,
  mergeField: TMergeField,
  read: { factory?: AsT<T>; sort?: Sorter<Record<string | number | symbol, any>> } = {},
): FieldPolicy<T> {
  const sortFn = read?.sort || ((defaultSort as unknown) as typeof read.sort)
  return {
    keyArgs,
    read: !read
      ? undefined
      : (existing, opts: FieldFunctionOptions<OffsetLimitSortByArgs<keyof T>, OffsetLimitSortByArgs<keyof T>>) => {
          if (!existing) return tryReadMergeField<T>(mergeField, opts.cache, x => x)

          const processed = (existing ? existing[mergeField] : []) as Record<string, any>[]
          return {
            ...existing,
            [mergeField]: sortData(processed, opts, sortFn),
          }
        },
    merge: offsetLimitMerge<TMergeField, T>(mergeField, read.factory),
  }
}

interface OffsetLimitSortByQueryArgs<TSortableKeys = string> extends OffsetLimitSortByArgs<TSortableKeys> {
  query?: string
}

export function offsetLimitSortByQueryPagination<TMergeField extends string, T extends Record<TMergeField, unknown[]>>(
  keyArgs: KeyArgs = false,
  mergeField: TMergeField,
  read: { factory?: AsT<T>; sort?: Sorter<Record<string | number | symbol, any>> } = {},
): FieldPolicy<T> {
  const sortFn = read?.sort || ((defaultSort as unknown) as typeof read.sort)
  return {
    keyArgs,
    read: !read
      ? undefined
      : (existing, opts: FieldFunctionOptions<OffsetLimitSortByQueryArgs<keyof T>, OffsetLimitSortByQueryArgs<keyof T>>) => {
          if (!existing) return tryReadMergeField<T>(mergeField, opts.cache, read.factory)

          const { args, variables, readField } = opts
          const query = args.query || variables.query

          let processed = (existing ? existing[mergeField] : []) as Record<string, any>[]
          if (query) {
            const [field, pattern] = query.split(/[<>]?=/)
            const test = new RegExp(pattern.replace(/[*]/g, '.*'), 'i')
            processed = processed.filter(item => test.test(readField(field, item)))
          }
          return {
            ...existing,
            [mergeField]: sortData(processed, opts, sortFn),
          }
        },
    merge: offsetLimitMerge<TMergeField, T>(mergeField, read.factory),
  }
}

function testStringValue(subqueries, item, readField) {
  let passed = true
  subqueries.forEach(([field, pattern]) => {
    const test = new RegExp(pattern.replace(/[*]/g, '.*'), 'i')
    passed = passed && test.test(readField(field, item))
  })
  return passed
}

export function offsetLimitPartialQueryPagination<TMergeField extends string, T extends Record<TMergeField, unknown[]>>(
  keyArgs: KeyArgs = false,
  mergeField: TMergeField,
  read: { factory?: AsT<T>; sort?: Sorter<Record<string | number | symbol, any>>; omit?: string[] } = {},
): FieldPolicy<T> {
  const sortFn = read?.sort || ((defaultSort as unknown) as typeof read.sort)
  return {
    keyArgs,
    read: !read
      ? undefined
      : (existing, opts: FieldFunctionOptions<OffsetLimitSortByQueryArgs<keyof T>, OffsetLimitSortByQueryArgs<keyof T>>) => {
          if (!existing) return tryReadMergeField<T>(mergeField, opts.cache, read.factory)

          const { args, variables, readField } = opts
          const query = args.query || variables.query

          let processed = (existing ? existing[mergeField] : []) as Record<string, any>[]
          if (query) {
            const omitedFields = read?.omit || []
            const subqueries = query
              .split(',')
              .map(s => s.split(/[<>=]{1,2}/))
              .filter(s => !omitedFields.includes(s[0]))
            processed = processed.filter(item => testStringValue(subqueries, item, readField))
          }
          return {
            ...existing,
            [mergeField]: sortData(processed, opts, sortFn),
          }
        },
    merge: offsetLimitMerge<TMergeField, T>(mergeField, read.factory),
  }
}
