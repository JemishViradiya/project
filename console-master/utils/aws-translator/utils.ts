import path from 'path'
import Debug from 'debug'

const console = createLogger('translator')

export { allNamespaces, createLogger, flattenObject, emptyObjectRemover }

function allNamespaces() {
  const glob = require('glob')
  const opts = {
    cwd: path.join(__dirname, '..', '..', 'libs', 'translations', 'src'),
    matchBase: true,
    // nomount: true,
    // nobrace: true,
    // noext: true,
  }
  const matches = glob.sync('en.json', opts) as string[]
  return matches.map(match => path.dirname(match)).filter(ns => !ns.startsWith('venue'))
}

function createLogger(name: string) {
  return {
    info: Debug(`${name}:info`),
    warn: Debug(`${name}:warn`),
    error: Debug(`${name}:error`),
    debug: Debug(`${name}:debug`),
    log: Debug(`${name}:info`),
  }
}

function flattenObject(obj: Record<string, any>, roots = [], sep = '.') {
  return (
    Object
      // find props of given object
      .keys(obj)
      // return an object by iterating props
      .reduce(
        (memo, prop) =>
          Object.assign(
            // create a new object
            {},
            // include previously returned object
            memo,
            Object.prototype.toString.call(obj[prop]) === '[object Object]'
              ? // keep working if value is an object
                // @ts-ignore
                flattenObject(obj[prop], roots.concat([prop]))
              : // include current prop and value and prefix prop with the roots
                // @ts-ignore
                { [roots.concat([prop]).join(sep)]: obj[prop] },
          ),
        {},
      )
  )
}

function emptyObjectRemover(key: string, value: any, nested = false) {
  if (typeof value === 'object') {
    const keys = Object.keys(value)
    value = keys.reduce((agg, k) => {
      const v = emptyObjectRemover(k, value[k], true)
      if (v) agg[k] = v
      return agg
    }, {})

    if (Object.keys(value).length === 0) {
      return key || nested ? undefined : {}
    }
    return value
  }
  return value
}
