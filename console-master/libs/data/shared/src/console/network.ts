export const encodeRedirectUri = (forwardParam = false) => {
  if (forwardParam) {
    let search = window.location.search
    if (!search) {
      const hash = window.location.hash
      const qIndex = hash.indexOf('?')
      if (qIndex !== -1) {
        search = hash.slice(qIndex)
      }
    }
    if (search) {
      const params = new URLSearchParams(search)
      const forwarded = params.get('redirect_uri')
      if (forwarded) {
        return encodeURIComponent(forwarded)
      }
    }
  }
  return encodeURIComponent(window.location.pathname + window.location.search + window.location.hash)
}
