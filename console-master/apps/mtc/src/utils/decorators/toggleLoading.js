export default function ToggleLoading(loadingKey) {
  return (target, name, descriptor) => {
    const func = descriptor.value
    descriptor.value = async function (...args) {
      this.setState({ [loadingKey]: true })
      const value = await func.apply(this, args)
      this.setState({ [loadingKey]: false })
      return value
    }
    return descriptor
  }
}
