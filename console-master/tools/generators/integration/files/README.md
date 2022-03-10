## Integration test execution

```
yarn integration <%= fullName %> - to run headless tests, all suites
yarn integration <%= fullName %> --watch - watch mode, to see browser
yarn integration <%= fullName %> --steps - to have all steps printed
yarn integration <%= fullName %> --verbose - to get more detailed logs
yarn integration <%= fullName %> --help to see more options
```

Also after 'Scenario' you can add tag '.only' to run only one scenario.

More custome options: [CodeceptJS commands](https://codecept.io/commands/)

## Environment variables

- `CODECEPT_BROWSER` browser to run (firefox, webkit, chromium, etc)
- `CODECEPT_SLOW` slow interactions for visual debugging
- `CODECEPT_EXECUTOR` Playwright or WebDriver

### WebDriver environment variables

- `WEBDRIVER_HOST` - selenium-grid remote host
- `WEBDRIVER_PORT` - selenium-grid remote port
- `WEBDRIVER_PATH` - selenium-grid remote path
- `WEBDRIVER_PROTECOL` - selenium-grid remote protocol
