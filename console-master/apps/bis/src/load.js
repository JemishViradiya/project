/* eslint-disable prefer-template, sonarjs/cognitive-complexity, sonarjs/no-collapsible-if */
/* global __webkit_public_path__ */

;(function (self) {
  var isStandalone = !(
    /[-.]ues\./.test(window.location.origin) ||
    /\.cylance\.com$/.test(window.location.origin) ||
    window.location.origin.includes('ues-console-sites.sw.rim.net')
  )
  if (!isStandalone) return

  var location = self.location || { pathname: __webkit_public_path__ }

  var pathParts = location.pathname.split('/')
  var tenant = pathParts[1] || ''
  if (!document.firstElementChild || !self.localStorage || !self.URLSearchParams) {
    location.href = location.origin + '/unsupportedBrowser?tenant=' + (tenant || '')
  } else {
    var idpIdentity = self.localStorage.getItem(tenant + '.idpIdentity')
    let expiry = self.localStorage.getItem(tenant + '.accessTokenExpiry')
    expiry = expiry ? (parseInt(expiry, 10) - 1) * 1000 : 0
    if (tenant && (!idpIdentity || expiry < Date.now())) {
      console.log('app.InitialSSOHeadless', tenant, !!idpIdentity, expiry)
      var url = new URL(location.href)
      url.pathname = '/' + tenant + '/login'
      url.search = ''
      var searchParams = new URLSearchParams(location.search.slice(1))
      if (!searchParams.has('redirect_uri')) {
        var redirect = pathParts.slice(2).join('/')
        if (redirect) {
          searchParams.set('redirect_uri', redirect)
        }
        var search = searchParams.toString()
        if (search) {
          url.search = '?' + search
        }
        if (location.href !== url.href) {
          location.href = url.href
        }
      }
    }

    if (tenant) {
      document.documentElement.classList.add('show-loading-summary')
    }
  }
})(window || global)
