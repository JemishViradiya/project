import { createWarningNotification } from 'app/actions'
import { store } from 'app/store'

class WarningService {
  static resolve(message) {
    store.dispatch(createWarningNotification(message, null))
  }
}

export default WarningService
