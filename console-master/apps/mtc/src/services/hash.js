class Hash {
  static parseHash(hashString) {
    if (hashString.indexOf('?') !== -1) {
      const parsed = hashString.substring(hashString.indexOf('?') + 1)
      return JSON.parse(`{"${decodeURI(parsed).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`)
    } else {
      return {}
    }
  }

  static updateParams(model) {
    const parsed = '?'
    const keys = Object.keys(model)
    let queryString = ''
    for (let i = 0; i < keys.length; i++) {
      if (model[keys[i]] !== null) {
        queryString += `${keys[i]}=${encodeURIComponent(model[keys[i]])}&`
      }
    }
    if (queryString[queryString.length - 1] === '&') {
      queryString = queryString.substring(0, queryString.length - 1)
    }
    return parsed + queryString
  }
}

export default Hash
