import attempt from 'lodash/fp/attempt'
import defaultTo from 'lodash/fp/defaultTo'
import flow from 'lodash/fp/flow'
import get from 'lodash/fp/get'
import isError from 'lodash/fp/isError'

/**
 * Safe way to access elements in array
 * or an object's properties.
 * If the value is undefined,
 * null, or NaN, the default value
 * will be used
 * Recommended usage:
 * ---------------
 * If you have an entire file where your default value are always going
 * to be the same then hoist up the first function call as high as you can.
 * For example if I knew that each time we use safeGet I want it to have a default of empty string
 * You could call it at the top of your component file
 * const safeGetWithDefault = safeGet('');
 * Then elsewhere in the component file you could just called safeGetWithDefault(path, data);
 * --------------------------
 * The goal is to apply the arguments in a way that promotes reusability.
 */
const safeGet = defaultValue => flow([get, defaultTo(defaultValue)])

/**
 * Safe way to call a function
 * Returns an object in the shape of { result, isError }
 * and should guarantee that the error is not actually thrown
 */
const safeCall = (fn, ...args) => {
  const appliedFn = () => fn(...args)
  const result = attempt(appliedFn)
  return {
    result,
    isError: isError(result),
  }
}

export { safeGet, safeCall }
