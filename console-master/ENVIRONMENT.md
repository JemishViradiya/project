# Local Development Environments

See [the Wiki](https://wikis.rim.net/display/UESUC/7.0+Labs+and+Environments) for more information about environments

Local cylance environments are setup in config/\*.yml

UES Environments are targetted via hostname, enabling partitioned use of state, session and service-worker

### labs

[dev aka r00](https://r00-ues.cylance.com:4200)
[staging aka qa2](https://qa2-ues.cylance.com:4200)
[r01](https://r01-ues.cylance.com:4200)
[r02](https://r02-ues.cylance.com:4200)

### production (per-region)

[us1](https://ues.cylance.com:4200)
[eu1](https://ues-euc1.cylance.com:4200)
[jp1](https://ues-apne1.cylance.com:4200)
[br1](https://ues-sae1.cylance.com:4200)

## Local Microservice Development

To enable local microservice development, you need to enable proxying of api requests through the local development proxy and map your microservice into the api-gateway api paths.

1.  Configure your `local-proxy.conf.json`, see [the example configuration](./local-proxy.conf.json.example).
    Map the specific api-gateway path of your microservice to the address of your local microservice, using the `"pathRewrite"` option to adjust the request path.

2.  Enable local development proxy in the console (for each domain you are using)

        localStorage.UES_LOCAL_PROXY = 'true'

3.  In order to proxy api requests to Bis local development server use below configuration (which also mimics production-like environments behavior):
    ```json
    [
      {
        "logLevel": "debug",
        "context": ["/local/api/bis/v1"],
        "target": "https://localhost:4000/",
        "secure": false,
        "ws": true,
        "pathRewrite": {
          "^/local/api/bis/": "/"
        }
      }
    ]
    ```

## Enabling Mock data

1. Open console in your web browser.
2. Run:
   ```
   localStorage.UES_DATA_MOCK = true
   ```
3. Refresh the page.
