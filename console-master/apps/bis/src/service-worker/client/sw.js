import { Workbox } from 'workbox-window'

const load = async ({ entry = 'sw.js', publicPath = '/', externalEvents = true } = {}) => {
  const stateStyles = [
    'background-color: #0092cc',
    'color: white',
    'border-radius: 3px',
    'padding: 2px 0.5em',
    'float: right',
  ].join(';')
  const stateColor = {
    activated: 'hsl(148, 50%, 40%)',
    controlling: 'hsl(199, 75%, 40%)',
    installing: 'hsl(38, 64%, 50%)',
    installed: 'hsl(52, 64%, 50%)',
    waiting: 'hsla(0, 40%, 50%, 1)',
    uninitialized: 'hsla(0, 0%, 33%, 1)',
  }

  // eslint-disable-next-line camelcase
  const workbox = (window.workbox = new Workbox(publicPath + entry))
  window.onworkboxstatechange =
    window.onworkboxstatechange ||
    (() => {
      /* noop */
    })

  const handler = ({ sw, type, isUpdate }) => {
    const nextState = type.replace(/^external/, '')
    if (nextState === workbox.state) {
      return
    }
    workbox.state = nextState
    console.log(
      '%c%s %c%s',
      '',
      'ServiceWorker',
      [stateStyles, `background-color: ${stateColor[type]}`].join(';'),
      type,
      isUpdate ? 'update' : '',
    )
    window.onworkboxstatechange(workbox.state)
  }
  workbox.addEventListener('activated', handler)
  workbox.addEventListener('controlling', handler)
  workbox.addEventListener('installed', handler)
  workbox.addEventListener('waiting', handler)

  if (externalEvents) {
    workbox.addEventListener('externalactivated', handler)
    workbox.addEventListener('externalinstalled', handler)
    workbox.addEventListener('externalwaiting', handler)
  }

  // await workbox.register({ immediate: true })
  const reg = await workbox.register({ immediate: true })
  if (reg.active) {
    handler({ sw: reg.active, type: 'activated' })
  } else if (reg.installing) {
    handler({ sw: reg.installing, type: 'installing' })
  } else if (reg.waiting) {
    handler({ sw: reg.waiting, type: 'waiting' })
  } else {
    handler({ type: 'uninitialized' })
  }
}

export default async (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    return
  }
  try {
    await load(...args)
  } catch (error) {
    console.error(error)
  }
}
