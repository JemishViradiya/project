export default {
  core: {
    cacheNames: {
      prefix: 'wb-',
      suffix: '',
    },
    _private: { getFriendlyURL: u => u },
  },
  routing: {
    registerRoute: jest.fn(),
  },
}
