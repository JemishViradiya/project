function defaultTemplate({ template }, opts, { imports, interfaces, componentName, props, jsx, exports }) {
  const plugins = ['jsx']
  if (opts.typescript) {
    plugins.push('typescript')
  }
  const typeScriptTpl = template.smart({ plugins })
  /* ${interfaces} */
  /* React.createElement('title', {}, props.title || ${babel.types.stringLiteral(
    componentName.name.replace(/Svg[A-Z][a-z0-9]+/, ''),
  )}) */
  return typeScriptTpl.ast`
    ${imports}
    import { SvgIcon } from '@material-ui/core'

    ${interfaces}
    const ${componentName} = (${props}) => React.createElement(SvgIcon, props, ${jsx.children})
    ${exports}`
}
module.exports = defaultTemplate
