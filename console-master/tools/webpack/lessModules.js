/* eslint-disable @typescript-eslint/no-var-requires */
const findLessRule = rule => rule.test.source.indexOf('.less$') !== -1

const findSassModuleRule = rule => rule.test.source.indexOf('\\.module\\.(scss|sass)$') !== -1

module.exports = ({ lessPlugins, extraCssLoaderOptions = {} } = {}) =>
  function getMtdWebpackConfig(config) {
    const sassModuleRule = config.module.rules.find(findLessRule).oneOf.find(findSassModuleRule)
    // console.dir(sassModuleRule, { depth: 10 })

    config.module.rules
      .find(findLessRule)
      .oneOf.filter(findLessRule)
      .map(rule => {
        if (!rule.exclude) return rule

        const lessUse = rule.use[rule.use.length - 1]
        lessUse.options = Object.assign(lessUse.options || {}, lessPlugins)

        rule.use = sassModuleRule.use.slice(0, -1).concat([lessUse])

        rule.use.forEach((r, index) => {
          const { loader, options } = r
          if (loader.includes('/css-loader/')) {
            rule.use[index] = { ...r, options: { ...options, ...extraCssLoaderOptions } }
          }
        })
        // console.dir(rule, { depth: 10 })
        return rule
      })

    // throw new Error('Break')
    return config
  }
