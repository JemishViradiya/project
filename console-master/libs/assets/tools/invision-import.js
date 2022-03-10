/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const prettier = require('prettier')
const { stringify: jsStringify } = require('javascript-stringify')

const { extractPalette, extractTypography } = require('./invision-import.extract')

const prettierConfig = JSON.parse(fs.readFileSync('../../.prettierrc', { encoding: 'utf-8' }))

const INVISION_KEY = 'BJf2i2_Sv'
const DSM_NAME = 'bb-design-system'
const INVISION_EXPORT_URL = 'https://blackberry.invisionapp.com/dsm-export/black-berry'

/* download and place this file in \libs\assets\dsm */
const rawFilename = 'style-data-raw.json'
const rawOutput = `./dsm/${rawFilename}`
const output = './src/dsm/themes/ues/dsm.js'
const outputDisplayName = path.relative(path.resolve(__dirname, '../../..'), rawOutput)

const download = async ({ force = false } = {}) => {
  console.log(path.resolve(rawOutput))
  if (fs.existsSync(rawOutput)) {
    try {
      const data = fs.readFileSync(rawOutput, { encoding: 'utf-8' })
      const parsed = JSON.parse(data)
      console.log(`Using cached ${outputDisplayName}`)
      return parsed
    } catch (error) {
      console.error(error)
    }
  }

  console.log(`Downloading new ${rawFilename}`)
  const res = await fetch(`${INVISION_EXPORT_URL}/${DSM_NAME}/style-data.json?exportFormat=list&key=${INVISION_KEY}`)
  const { list: data } = await res.json()
  if (!fs.existsSync(path.dirname(rawOutput))) {
    fs.mkdirSync(path.dirname(rawOutput))
  }
  fs.writeFileSync(
    rawOutput,
    prettier.format(JSON.stringify(data, null, 2), {
      filepath: rawOutput,
      ...prettierConfig,
    }),
  )
  console.log(`Downloaded new ${outputDisplayName}`)

  return data
}

const run = async () => {
  const data = await download()

  const palette = extractPalette(data.list)
  const typography = extractTypography(data.list)

  console.log(`Using DSM palette:
${jsStringify({ palette, typography }, null, 2)}`)

  const jsModule = `/* eslint-disable sonarjs/no-duplicate-string */
const colors = ${jsStringify(palette.colors)}
const base = ${jsStringify(palette.base)}
const light = ${jsStringify(palette.light)}
const dark = ${jsStringify(palette.dark)}
const typography = ${jsStringify(typography)}

export {
  colors,
  base,
  light,
  dark,
  typography,
}
`
  fs.writeFileSync(
    output,
    prettier.format(jsModule, {
      filepath: output,
      ...prettierConfig,
    }),
  )
  console.log(`Constructed new ${path.join('libs/assets', output)}`)
}

run()
