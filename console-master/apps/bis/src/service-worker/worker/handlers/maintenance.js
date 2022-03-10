import matchPrecache from '../lib/matchPrecache'

const { precacheOptions, maintenancePage } = self.swConfig
const fallbackPrecacheOptions = { ...precacheOptions, ignoreURLParametersMatching: [/.*/] }

export default async context => {
  const req = matchPrecache(maintenancePage, fallbackPrecacheOptions)
  if (req) {
    return req
  }

  return Response.error()
}
