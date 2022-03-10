import matchPrecache from '../lib/matchPrecache'

const maintenanceHtml = `
<!DOCTYPE html>
<html>
  <head>
    <title>UES</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="referrer" content="no-referrer" />

    <link rel="shortcut icon" href="/pwa/images/v1/favicon.ico" />
    <link rel="icon" type="image/png" sizes="16x16" href="/pwa/images/v1/favicon-16x16.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/pwa/images/v1/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="48x48" href="/pwa/images/v1/favicon-48x48.png" />

  </head>
  <body>
    <main>
      <dialog open style="border:1px solid grey">
        <h3>
          Network Offline
        </h3>
        <div style="margin-top:2rem; margin-bottom:4rem">
          <summary>Unable to reach UES Console, please try again.</summary>
        </div>
        <footer>
          <a style="float:left"
            href="/"
            onClick="window.location.reload()"
          >Reload</a>
          <a style="float:right"
            href="https://docs.blackberry.com/en/endpoint-management/blackberry-intelligent-security/latest"
            target="_blank"
          >Help</a>
        </footer>
      </dialog>
    </main>
  </body>
</html
`

const { precacheOptions, maintenancePage } = self.swConfig
const fallbackPrecacheOptions = {
  ...precacheOptions,
  ignoreURLParametersMatching: [/.*/],
}

export default async (context: unknown): Promise<Response> => {
  const req = await matchPrecache(maintenancePage, fallbackPrecacheOptions)
  if (req) {
    return req
  }

  return new Response(maintenanceHtml, {
    status: 200,
    headers: { 'content-type': 'text/html; charset=UTF-8', 'cache-control': 'no-store,must-revalidate' },
  })
}
