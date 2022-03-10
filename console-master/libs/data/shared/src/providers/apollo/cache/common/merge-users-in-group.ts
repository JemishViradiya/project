import type { FieldMergeFunction } from '@apollo/client'

export const mergeUsersInGroup: FieldMergeFunction = (existing, incoming, { args }) => {
  if (args.offset === 0 || !existing) {
    return incoming
  } else if (existing) {
    const newResult = [...existing.elements, ...incoming.elements]
    return { ...incoming, elements: newResult }
  }
}
