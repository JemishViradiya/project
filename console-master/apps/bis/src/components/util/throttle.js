const idleThrottle = (fn, handle) => {
  if (handle) {
    window.cancelIdleCallback(handle)
  }
  return window.requestIdleCallback(fn)
}

const timeoutThrottle = (fn, handle) => {
  if (handle) {
    clearTimeout(handle)
  }
  return setTimeout(fn, 1)
}

const throttle = window.requestIdleCallback ? idleThrottle : timeoutThrottle

export default throttle
