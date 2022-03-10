export default function MethodLogger(target, key, descriptor) {
  const func = descriptor.value
  descriptor.value = function (...args) {
    console.log(`${name}#${key} called with the following arguments: ${args}`) // eslint-disable-line
    return func.apply(this, args)
  }
  return descriptor
}
