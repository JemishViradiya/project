const path = require('path')
const Cobertura = require('istanbul-reports/lib/cobertura')

class CoberturaProject extends Cobertura {
  constructor(opts) {
    super(opts)
    this.projectName = path.basename(this.projectRoot)
    this.projectRoot = path.dirname(this.projectRoot)
  }

  onSummary(node) {
    if (node.isRoot()) {
      return
    }
    const metrics = node.getCoverageSummary(true)
    if (!metrics) {
      return
    }
    this.xml.openTag('package', {
      name: asJavaPackage(node, this.projectName),
      'line-rate': metrics.lines.pct / 100.0,
      'branch-rate': metrics.branches.pct / 100.0,
    })
    this.xml.openTag('classes')
  }
}

module.exports = CoberturaProject

function asJavaPackage(node, packageName) {
  return `${packageName}.${node.getRelativeName().replace(/\//g, '.').replace(/\\/g, '.').replace(/\.$/, '')}`
}
