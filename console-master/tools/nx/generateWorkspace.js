#!/usr/bin/env node
const fs = require('fs')
const { resolve } = require('path')
const prettier = require('prettier')
const deepMerge = require('deepmerge')

const workspace = require('../../workspace.json')
const nx = require('../../nx.json')

const executors = [require('./app.workspace'), require('./assets.workspace')]

const nxBuilders = [require('./collect.nx')]

const prettierRc = JSON.parse(fs.readFileSync(resolve(__dirname, '../../.prettierrc')))

const combineMerge = (target, source, options) => {
  const destination = target.slice()

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
    } else if (options.isMergeableObject(item)) {
      destination[index] = deepMerge(target[index], item, options)
    } else if (target.indexOf(item) === -1) {
      destination.push(item)
    }
  })
  return destination
}

const applyConfig = (src, opts) => {
  return deepMerge(src, opts, {
    arrayMerge: combineMerge,
  })
  // Object.assign(build['options'], opts.options)

  // if (!build.configurations) {
  //   build.configurations = {}
  // }
  // if (!build.configurations.production) {
  //   build.configurations.production = {}
  // }
  // Object.assign(build.configurations.production, opts.configurations.production)
}

/**
 *
 * @param {*} workspace Nx workspace.json
 */
const writeCustomWebpack = (workspace, nxConfig) => {
  try {
    const { projects } = workspace

    Object.keys(projects).forEach(project => {
      const current = projects[project]
      const targets = current['targets']

      if (!('build' in targets || 'cdn' in targets || 'assets' in targets)) {
        return
      }

      for (const executor of executors) {
        if (nxConfig.projects[project].tags.includes(executor.tag)) {
          console.warn(`${project} with tag ${executor.tag}`)
          current['targets'] = applyConfig(targets, executor(project, targets))
        }
      }
    })

    fs.writeFileSync(
      './workspace.json',
      prettier.format(JSON.stringify(workspace, null, 2), {
        filepath: './workspace.json',
        ...prettierRc,
      }),
      'utf-8',
    )

    console.log('workspace.json generated')
  } catch (error) {
    console.log('Something went wrong while trying to use custom webpack', error)
    process.exit(1)
  }
}

const writeCustomNx = (workspace, nxConfig) => {
  try {
    const { projects } = nxConfig

    Object.keys(projects).forEach(project => {
      const current = projects[project]

      for (const executor of nxBuilders) {
        if (current.tags.includes(executor.tag)) {
          console.warn(`${project} with tag ${executor.tag}`)
          Object.assign(current, executor(project, nxConfig))
        }
      }
    })

    fs.writeFileSync(
      './nx.json',
      prettier.format(JSON.stringify(nxConfig, null, 2), {
        filepath: './nx.json',
        ...prettierRc,
      }),
      'utf-8',
    )

    console.log('nx.json generated')
  } catch (error) {
    console.log('Something went wrong while trying to use custom nx', error)
    process.exit(1)
  }
}

console.log('Overwriting nx.json to use custom cdn...')
writeCustomNx(workspace, nx)

console.log('Overwriting workspace.json to use custom webpack...')
writeCustomWebpack(workspace, nx)
