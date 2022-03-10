require('colors')

const FS = require('fs'),
  PATH = require('path'),
  FSEXTRA = require('fs-extra'),
  promisify = require('util.promisify'),
  readdir = promisify(FS.readdir),
  readFile = promisify(FS.readFile),
  writeFile = promisify(FS.writeFile),
  ensureDir = promisify(FSEXTRA.ensureDir),
  SVGO = require('svgo'),
  removeCustomAttrs = require('./removeCustomAttrs'),
  regSVGFile = /\.svg$/

removeCustomAttrs.params.elemSeparator = ';'
removeCustomAttrs.params.attrs = ['.*;(fill|stroke);(?!none|currentColor|url[(]).*', 'data-.*', 'svg;(xml:space|id)']

const debugArg = !!process.argv.find(arg => arg === '--debug')
const logger = !debugArg
  ? () => {
      /* empty */
    }
  : console.log.bind(console)

const svgo = new SVGO({
    full: false,
    multipass: true,
    plugins: [
      {
        convertStyleToAttrs: true,
      },
      {
        removeViewBox: false,
      },
      {
        moveGroupAttrsToElems: false,
      },
      {
        removeDimensions: true,
      },
      {
        removeUnknownsAndDefaults: {
          unknownContent: true,
          unknownAttrs: true,
          defaultAttrs: true,
          uselessOverrides: true,
          keepDataAttrs: true,
          keepAriaAttrs: true,
          keepRoleAttr: false,
        },
      },
      {
        removeAttrs: false,
      },
      {
        removeCustomAttrs,
      },
    ],
  }),
  config = {
    quiet: false,
  }

const dest = process.argv[process.argv.length - 1]

const run = async () => {
  await Promise.all(['icons', 'logos'].map(folder => optimizeFolder(config, `./src/${folder}`, `../../${dest}/${folder}`)))
}

module.exports = run

run()

/**
 * Optimize SVG files in a directory.
 * @param {Object} config options
 * @param {string} dir input directory
 * @param {string} output output directory
 * @return {Promise}
 */
function optimizeFolder(config, dir, output) {
  if (!config.quiet) {
    logger(`Processing directory '${dir}':\n`)
  }

  return ensureDir(output).then(readdir(dir).then(files => processDirectory(config, dir, files, output)))
}

/**
 * Process given files, take only SVG.
 * @param {Object} config options
 * @param {string} dir input directory
 * @param {Array} files list of file names in the directory
 * @param {string} output output directory
 * @return {Promise}
 */
function processDirectory(config, dir, files, output) {
  // take only *.svg files
  const svgFiles = files.filter(name => regSVGFile.test(name))
  return svgFiles.length
    ? Promise.all(svgFiles.map(name => optimizeFile(config, PATH.resolve(dir, name), PATH.resolve(output, name))))
    : Promise.reject(new Error(`No SVG files have been found in '${dir}' directory.`))
}

/**
 * Read SVG file and pass to processing.
 * @param {Object} config options
 * @param {string} file
 * @param {string} output
 * @return {Promise}
 */
function optimizeFile(config, file, output) {
  return readFile(file, 'utf8').then(
    data => processSVGData(config, { input: 'file', path: file }, data, output, file),
    error => {
      throw new Error(`Unable to optiomize svg ${file}': ${error.message}`)
    },
  )
}

/**
 * Optimize SVG data.
 * @param {Object} config options
 * @param {string} data SVG content to optimize
 * @param {string} output where to write optimized file
 * @param {string} [input] input file name (being used if output is a directory)
 * @return {Promise}
 */
function processSVGData(config, info, data, output, input) {
  const startTime = Date.now(),
    prevFileSize = Buffer.byteLength(data, 'utf8')

  return svgo.optimize(data, info).then(function (result) {
    const resultFileSize = Buffer.byteLength(result.data, 'utf8'),
      processingTime = Date.now() - startTime

    return writeOutput(input, output, result.data).then(
      function () {
        if (!config.quiet && output !== '-') {
          if (input) {
            logger(`\n${PATH.basename(input)}:`)
          }
          printTimeInfo(processingTime)
          printProfitInfo(prevFileSize, resultFileSize)
        }
      },
      error => Promise.reject(new Error(error.code === 'ENOTDIR' ? `Error: output '${output}' is not a directory.` : error)),
    )
  })
}

/**
 * Write result of an optimization.
 * @param {string} input
 * @param {string} output output file name. '-' for stdout
 * @param {string} data data to write
 * @return {Promise}
 */
function writeOutput(input, output, data) {
  if (output === '-') {
    console.log(data)
    return Promise.resolve()
  }
  return writeFile(output, data, 'utf8').catch(error => checkWriteFileError(input, output, data, error))
}

/**
 * Check for saving file error. If the output is a dir, then write file there.
 * @param {string} input
 * @param {string} output
 * @param {string} data
 * @param {Error} error
 * @return {Promise}
 */
function checkWriteFileError(input, output, data, error) {
  if (error.code === 'EISDIR' && input) {
    return writeFile(PATH.resolve(output, PATH.basename(input)), data, 'utf8')
  } else {
    return Promise.reject(error)
  }
}

/**
 * Write a time taken by optimization.
 * @param {number} time time in milliseconds.
 */
function printTimeInfo(time) {
  logger(`Done in ${time} ms!`)
}

/**
 * Write optimizing information in human readable format.
 * @param {number} inBytes size before optimization.
 * @param {number} outBytes size after optimization.
 */
function printProfitInfo(inBytes, outBytes) {
  const profitPercents = 100 - (outBytes * 100) / inBytes

  logger(
    Math.round((inBytes / 1024) * 1000) / 1000 +
      ' KiB' +
      (profitPercents < 0 ? ' + ' : ' - ') +
      String(Math.abs(Math.round(profitPercents * 10) / 10) + '%').green +
      ' = ' +
      Math.round((outBytes / 1024) * 1000) / 1000 +
      ' KiB',
  )
}
