import { getAccessToken, getTenant } from '../auth/state'
import { store } from '../ReduxSetup'

const port = process.env.NODE_ENV === 'production' ? window.location.port : '4000'

const download = params => {
  const { operationName, query, variables } = params
  const form = document.createElement('form')

  form.method = 'POST'
  form.action = `https://${window.location.hostname}:${port}/export`

  let element = document.createElement('input')
  element.name = 'operationName'
  element.value = encodeURIComponent(operationName)
  form.appendChild(element)

  element = document.createElement('input')
  element.name = 'query'
  element.value = encodeURIComponent(query)
  form.appendChild(element)

  element = document.createElement('input')
  element.name = 'variables'
  element.value = encodeURIComponent(JSON.stringify(variables))
  form.appendChild(element)

  const accessToken = getAccessToken(store.getState())
  element = document.createElement('input')
  element.name = 'authorization'
  element.value = encodeURIComponent(`Bearer ${accessToken}`)
  form.appendChild(element)

  const tenant = getTenant(store.getState())
  element = document.createElement('input')
  element.name = 'tenant'
  element.value = encodeURIComponent(tenant)
  form.appendChild(element)

  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}

export default download
