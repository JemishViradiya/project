module.exports = () => ({
  ...[
    'camelCase',
    'cloneDeep',
    'debounce',
    'get',
    'isEqual',
    'isFunction',
    'isMatch',
    'isNil',
    'isUndefined',
    'memoize',
    'omit',
    'omitBy',
    'once',
    'throttle',
  ].reduce((agg, item) => {
    agg[`lodash.${item.toLowerCase()}$`] = `lodash-es/${item}`
    return agg
  }, {}),
  lodash$: 'lodash-es',
})
