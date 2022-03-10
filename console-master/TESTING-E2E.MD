# Table of contents

1. [Prerequisites](#prerequisites)
   1. [XRDP Setup](#xRdpSetup)
   2. [Environment Setup](#envSetup)
2. [Running E2E Tests](#runningTests)
3. [Writing E2E Tests](#writingTests)
   1. [Best Practices for Locating Elements](#locators)
4. [Developing Storybook Component E2E Tests](#storybook)
5. [Integration Testing Accounts](#integrationUsers)

## Prerequisites <a name="prerequisites"></a>

Follow the Setup instructions in [README.md](./README.md) before proceeding.

You must install an X server on your Windows machine before you can use the Cypress test runner, since Windows/Windows Subsystem for Linux (WSL) environments require an X server to run graphical applications from a Linux development environment.

### XRDP Setup <a name="xRdpSetup"></a>

1. Setup XRDP in ubuntu/wsl2

   sudo apt-get install xrdp
   sudo systemctl enable dbus
   sudo systemctl enable xrdp

1. Launch Windows Remote Desktop Connection, or mstsc from the Windows Start menu

   - Enter `localhost:3390` and connect. You will be prompt by this screen keep the session as xorg, and enter your WSL2 username and password.

### [Deprecated] X Server Setup <a name="xServerSetup"></a>

Follow [this article](https://wiki.ubuntu.com/WSL#Running_Graphical_Applications).

Most of our developers use **[https://mobaxterm.mobatek.net/](MobaXTerm)**.

### Environment Setup <a name="envSetup"></a>

1. Launch VS Code and connect to your UC UI workspace.
2. Open a terminal window (**Terminal > New Terminal**).
3. Add the following exports to your _~/.bashrc_ configuration.

   - If using WSL:

     export DISPLAY=:0
     export LIBGL_ALWAYS_INDIRECT=1

   - If using WSL2:

     export DISPLAY=$(awk '/nameserver / {print $2; exit}' /etc/resolv.conf 2>/dev/null):0
     export LIBGL_ALWAYS_INDIRECT=1

4. Install Cypress in your Linux workspace environment.

   npm install cypress --save-dev

5. Install other required dependencies.

   sudo apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

## Running E2E Tests <a name="runningTests"></a>

#### Cypress

- ` yarn e2 partial/partial-e2e`- to execute tests with Cypress

##### References:

- [Cypress home](https://docs.cypress.io/api)
- [The Cypress Test Runner](https://docs.cypress.io/guides/core-concepts/test-runner.html)

#### CodeceptJS

- ` yarn integration partial/partial-e2e`- to execute tests with CodeceptJS
- ` yarn integration partial/partial-e2e --env qa2`- to execute tests with CodeceptJS against qa2 environment

##### Running tests against local UES:

- ` yarn integration partial/partial-e2e --env local-dev`- to execute tests with CodeceptJS against local dev

If you run into certificate errors, certificate [BlackBerry Enterprise RSA Root CA 1](https://crt.rim.net/BlackBerry-Enterprise-Root-CA-1.crt) will need to be added to your ms-playwright Chrome browser.

Adding certificate for **linux/wsl2**:

In VS Code terminal

```
wget https://crt.rim.net/BlackBerry-Enterprise-Root-CA-1.crt --no-check-certificate
sudo mv BlackBerry-Enterprise-Root-CA-1.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates
```

Open ms-playwright Chrome browser

```
cd ~/.cache/ms-playwright/chromium-939194
chrome-linux/chrome
```

In Chrome `Settings -> Manage certificates -> Authorities` import the certificate.

##### References:

- [CodeceptJS home](https://codecept.io/)
- [The Playwright Helper](https://codecept.io/helpers/Playwright)
- [The WebDriver Helper](https://codecept.io/helpers/WebDriver)

##### Command Line Options

- `--steps` Show step-by-step execution.
- `--headless` Whether or not to open the CodeceptJS application to run the tests. If set to 'true', will run in headless mode
- `--debug` output additional information
- `--verbose` output internal logging information
- `--browser` The browser to run tests in.
- `--env` A config environment to load from config/condecept/<env>.yml
- `--command` The codeceptjs command to execute (default=run) (default: run)
- `--watch` Launch the codecept-ui for live-reload of test scenarios (default: run)
- `--no-exit` To run tests without exiting the Cypress Test Runner afterward

##### Environment Variables

See [the configuration environment overrides](./config/codeceptjs/custom-environment-variables.yml)

Example:
`CODECEPT_RUNNER=WebDriver WEBDRIVER_HOST=[address.of.selenium.grid] yarn integration [project]`

### Getting Started

1. Get the latest console UI project code from the repo.
2. Run the following commands to download dependency packages and build the console.

   yarn
   yarn all:shared
   make dev-deps

3. Ensure your chosen X-server is setup and running
4. Execute the Cypress/CodeceptJS tests for the desired pillar/project. Above you have command with command line options.

   > Note: After you run the command, the X server may prompt you for permission to connect, and you may have to click **Yes** several times before the test runner starts.

## Writing E2E Tests <a name="writingTests"></a>

##### References:

- [Introduction to Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html)
- [Writing and Organizing Tests](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html)
- [Interacting with DOM Elements](https://docs.cypress.io/guides/core-concepts/interacting-with-elements.html)
- [Best Practices Guide](https://docs.cypress.io/guides/references/best-practices.html)

### Best Practices for Locating Elements <a name="locators"></a>

1. Accessible Rich Internet Applications (ARIA) defines a set of attributes that can be applied to UI elements to make web content and web applications more accessible to people with disabilities. It's not only a good practice to use ARIA attributes for accessibility purposes, but these attributes can also be used to locate elements in Cypress tests.

- [Using ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques)
- [TUTORIAL](https://www.accessibilityoz.com/videos/aria-labelledby-vs-aria-describedby-vs-aria-label/)

For example, this element...

```
<div className={styles.expanderRow} role="button" tabIndex="-1" aria-expanded={open} onClick={toggle}>
```

...can be located by its ARIA role in a Cypress test.

```
I.findByRole('button').click()
```

2. Make sure all locators are stable and will not change over time.
3. **_Never_** use _-nth-_ selectors, minified class names, or element tags (div, span, img, svg) to locate an element.
4. Where possible, leverage the translation files and use localized string values to locate elements. For example:

```
describe('my test', () => {
  before(() => {
    I.loadI18nNamespaces('myNamespace')
  })

  it('test submit', () => {
    I.findByRole('button', { name: t('myNamespace:submitBtnText') }).click()
  })

  it('test cancel', () => {
    I.findByText(I.translate('myNamespace:cancelBtnText')).click()
  })
})
```

## Developing Storybook Component E2E Tests <a name="storybook"></a>

Tests for **behaviours** storybook components are located in the _behaviours-e2e_ project. Some example storybook tests can be found in _libs/behaviours-e2e/src/integration/tables_.

To run the storybook tests:

    yarn e2e behaviours-e2e

When writing tests for a storybook component, you first need to identify the component's storybook page so the Cypress Test Runner can visit it. For example, for the [Simple table](https://ues-console-sites.sw.rim.net/sites/master/docs/behaviours/?path=/story/table--simple) component:

    I.visit('/iframe.html?id=table--simple&viewMode=story')

An example of this can be found in _libs/behaviours-e2e/src/integration/tables/simpleTable.spec.ts_.

## Integration Testing Accounts <a name="integrationUsers"></a>

See the [Integration Testing Automation Accounts wiki](https://wikis.rim.net/pages/viewpage.action?pageId=909575392)
