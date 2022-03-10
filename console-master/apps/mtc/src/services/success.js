import { createSuccessNotification } from '@mtc/partials'

import { store } from '../store'

class SuccessService {
  static resolve(message) {
    store.dispatch(createSuccessNotification(message, null))
  }
}

export default SuccessService
