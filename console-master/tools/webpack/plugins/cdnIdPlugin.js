class CdnIdsPlugin {
  constructor(options) {
    this.options = options || {}
  }

  /**
   * Apply the plugin
   * @param {import("webpack").Compiler} compiler the compiler instance
   * @returns {void}
   */
  apply(compiler) {
    const matchChunkName = this.options.chunkName
    compiler.hooks.compilation.tap('CdnIdsPlugin', compilation => {
      compilation.hooks.chunkIds.tap('CdnIdsPlugin', chunks => {
        for (const chunk of chunks) {
          if (chunk.idNameHints.has(matchChunkName)) {
            chunk.id = chunk.name
            chunk.ids = [chunk.id]
          }
        }
      })
    })
  }
}

module.exports = CdnIdsPlugin
