A distinct stanza exists in proxy.config.json that reserves the "jp" context prefix
allowing the console to connect to a local instance of the platform bff. To connect to a localhost
platform bff instance simply modify the 'platform.bff' prefix within data/src/lib/network/index.js,
replacing the "/us/" prefix with "/jp/" as follows:

'platform.bff': '/jp/api/platform/v1/bff/platform/graphql',
