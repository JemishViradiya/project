import { useMock } from '@ues-data/shared'

export default () => {
  const mock = useMock()
  return { tenant: mock ? '' : window.location.pathname.split('/')[1] }
}
