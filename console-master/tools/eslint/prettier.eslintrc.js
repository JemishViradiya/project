const offValues = new Set('0', 'false', 'off')

module.exports = {
  plugins: offValues.has(process.env.ESLINT_PRETTIER) ? [] : ['prettier'],
}
