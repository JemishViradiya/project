import jwtDecode from 'jwt-decode'

import history from '../../../configureHistory'

export default function postLogin(token) {
  const decoded = jwtDecode(token)
  if (decoded.per === 'eula:sign' || decoded.per.includes('eula:sign')) {
    history.push('/auth/accept-eula')
  } else {
    let url = '/'
    if (sessionStorage.getItem('login_redirect') !== null && typeof sessionStorage.getItem('login_redirect') !== 'undefined') {
      url = sessionStorage.getItem('login_redirect')
      sessionStorage.removeItem('login_redirect')
    }
    history.push(url)
  }
}
