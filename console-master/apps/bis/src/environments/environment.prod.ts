export const environment = {
  production: true,
  map: {
    streetView: {
      maxRadius: 100,
    },
    zoom: {
      minAutoZoom: 2,
      maxAutoZoom: 18,
      boundsPadding: 0.5,
      defaultMaxZoom: 21,
      defaultMaxZoomPrivacyModeOn: 10,
      defaultMinZoom: 2,
    },
    mockedApiKey: '...', // used only for mocked version in local development - demo/review site is handled differently, on prod it's not used
  },
  defaults: {
    support: {
      helpUrl: 'https://docs.blackberry.com/en/unified-endpoint-security/blackberry-persona-uem/latest',
    },
  },
}
