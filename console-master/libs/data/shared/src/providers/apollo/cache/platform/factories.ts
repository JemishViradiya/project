export const ecsPagingFactory = (obj, mergeField) => {
  const count = obj[mergeField].length
  return Object.assign(obj, {
    count,
    navigation: { next: null, previous: null },
    totals: { pages: null, elements: count },
  })
}

export const ecsPartialPagingFactory = (obj, mergeField) => {
  const count = obj[mergeField].length
  return Object.assign(obj, {
    count,
    totals: { elements: count },
  })
}
