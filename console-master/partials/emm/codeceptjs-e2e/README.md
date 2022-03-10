## Local test execution

```
cd e2e
yarn e2e - to run headless tests, all suites
yarn e2e:debug - debug mode, to see browser
yarn e2e --steps - to have all steps printed
yarn e2e --verbose - to get more detailed logs
yarn e2e --grep "signin" - Run only tests with "signin" word in name
```

Also after 'Scenario' you can add tag '.only' to run only one scenario.

More custome options: [CodeceptJS commands](https://codecept.io/commands/)

## Executing tests on firefox

Change in json to firefox. Also here you can choose headless or not headless mode.

```
e2e:debug": "cross-env NODE_CONFIG_DIR=../config codeceptjs run --config codecept.conf.js -o '{\"helpers\":{\"Puppeteer\":{\"show\":true,\"slow\":true,\"browser\":\"firefox\",\"firefox\":{\"headless\":false}}}}
```
