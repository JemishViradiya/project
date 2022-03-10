import invert from 'lodash/invert'

const authTypeTo = {
  OneLogin: 1,
  Okta: 2,
  Azure: 3,
  Custom: 4,
  PingOne: 5,
}

const authTypeFrom = invert(authTypeTo)

export { authTypeTo, authTypeFrom }
