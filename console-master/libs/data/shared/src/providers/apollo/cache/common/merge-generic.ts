import type { FieldMergeFunction } from '@apollo/client'

export const mergeGeneric: FieldMergeFunction = (existing, incoming, { args }) => {
  if (args.cursor === undefined || !existing) {
    return incoming
  } else if (existing) {
    const newResult = [...existing.elements, ...incoming.elements]
    return { ...incoming, elements: newResult }
  }
}
