module.exports = assetLoader

function assetLoader() {
  const path = JSON.stringify(this.resourcePath)
  return `export default new URL(${path}, import.meta.url).toString();`
}
