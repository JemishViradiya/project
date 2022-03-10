# UES Console

This project uses a mulit-spa architecture managed by [Nx.dev](./NX.md).

🔎 _Nx is a set of Extensible Dev Tools for Monorepos._

## Git and GitLab

This project uses a single-branch delivery model based on the [master](https://gitlab.rim.net/UES/console/-/tree/master) branch.
The following branches are available to developers to generate merge requests:

- feature/\*
- hotfix/\*
- topic/\*

[GitLab Pages](https://ues.pages.rim.net/console/) are used to host documenation (inculding storybook) and build artifact microsites.

See [GITLAB](./GITLAB.md) for details

## Ownership

Ownership (required merge approvals) is controlled through GitLab's [CODEOWNERS](./CODEOWNERS) file.

## Standards

1. Technology
   - [React](https://reactjs.org/)
   - [Material-UI](https://material-ui.com)
1. Style is enforced with [Prettier](https://prettier.io/) and [ESLint](https://eslint.org)

See [STANDARDS](./STANDARDS.md) for details

## Developement

### Requirements

- [Yarn](https://classic.yarnpkg.com/en/docs/install) ^1.20
- [Node.js](https://nodejs.org/) >= 12.16
- [Node-Gyp Dependencies](https://github.com/nodejs/node-gyp) for your platform
- [GNU Make](https://www.gnu.org/software/make/)

### Recommended hardware

**Development Standard** as indicated [here](https://itsh.rim.net/portal/app/portlets/results/viewsolution.jsp?solutionid=130930125731000).

### IDE

[Visual Studio Code](https://code.visualstudio.com/) is the suggested development IDE.

### Setup

1. Add the following to your hosts file (`C:\WINDOWS\System32\drivers\etc\hosts` on Windows or `/etc/hosts` on linux)
   ```
   127.0.0.1 local-dev-ues.cylance.com
   127.0.0.1 local-staging-ues.cylance.com
   127.0.0.1 qa2-ues.cylance.com
   127.0.0.1 r00-ues.cylance.com
   127.0.0.1 ues.cylance.com
   127.0.0.1 ues-euc1.cylance.com
   127.0.0.1 ues-apne1.cylance.com
   127.0.0.1 ues-sae1.cylance.com
   ```
2. For Windows development follow [WINDOWS](./WINDOWS.md) to setup WSL2 and install node.js, yarn, build-essential, etc
3. Follow [GIT](./GIT.md) to setup Git.
4. Follow [VSCODE](./VSCODE.md) to setup Visual Studio Code.
5. Set up open SSL

   - for MAC users:

     1. open a terminal and download the cert at https://crt.rim.net/BlackBerry-Enterprise-Root-CA-1.crt with `wget` or `curl` (i.e. `wget https://crt.rim.net/BlackBerry-Enterprise-Root-CA-1.crt`)
     2. concat the downloaded cert to the existing certificate chain with:
        ```
        cat ~/Downloads/BlackBerry-Enterprise-Root-CA-1.crt | sudo tee -a /etc/ssl/cert.pem
        ```
     3. add these lines:
        ```
        export NODE_EXTRA_CA_CERTS=/etc/ssl/cert.pem
        export SSL_CERT_FILE=/etc/ssl/cert.pem
        ```
        to these shells:
        - /etc/profile (i.e. `sudo nano /etc/profile`)
        - /etc/zprofile (i.e. `sudo nano /etc/zprofile`)
          and save
     4. close and reopen the terminal (or if using the VS Code terminal, close and reopen VS Code)
     5. enter `env | grep -i node` and confirm `NODE_OPTIONS` is pointing to `--use-openssl-ca`

   - for Linux / WSL users:
     1. open a terminal and download the cert at https://crt.rim.net/BlackBerry-Enterprise-Root-CA-1.crt with `wget` or `curl` (i.e. `wget https://crt.rim.net/BlackBerry-Enterprise-Root-CA-1.crt`)
     2. install the cert to /usr/local/share/ca-certificates/ and update the system ca with:
        ```
        sudo mv BlackBerry-Enterprise-Root-CA-1.crt /usr/local/share/ca-certificates
        sudo update-ca-certificates
        ```
     3. add these lines:
        ```
        export NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt
        ```
        to the global environment in `/etc/environment`
     4. Logout of your desktop session (linux) or restart wsl2 (windows)

6. In VSCode terminal, install the project dependencies. This must be done periodically as dependencies are modified.
   ```
   yarn install
   ```

#### Configuring Node

1. Configure node via [n](https://github.com/tj/n).
   ```
   npm install -g n
   ```
   Alternatively on macOS:
   ```
   brew install -g n
   ```
2. Set N_PREFIX to a directory in your home directory.
   On macOS you do the following:
   ```
   export N_PREFIX=/usr/local/Homebrew
   ```
3. If needed, update your path to include $N_PREFIX/bin.
4. If needed, update the version of node via `n <version>`. For example `n 12` to use node version 12.

#### To see all apps

Build a development copy of the project. (TODO: update this to delegate to cloudfront in the lab)

    yarn affected:build

### Running

Build the shared dependencies (pwa, assets, api)

    yarn affected:shared

Or rebuild all dependencies (pwa, assets, api.)

    yarn all:shared

Install dependencies

    yarn install

Start your appliction's development server, eg: dashboard

    yarn start dashboard

To return mock data from the data-layer, set the following in your local storage:

    localStorage.setItem('UES_DATA_MOCK', true)

Navigate to the host alias that corresponds to the environment you wish to hit, i.e. https://local-dev-ues.cylance.com:4200/ for the local environment, https://qa2-ues.cylance.com:4200/ for the QA2 environment, etc.

## Testing

### Unit tests

Run tests

    yarn all:test

Run your application's tests, eg: dashboard

    yarn test dashboard

### E2E tests

Run your application's tests, eg: dashboard

    yarn e2e dashboard-e2e

See [TESTING](./TESTING.md) and [TESTING-E2E](./TESTING-E2E.md) for more information

### Pact tests

Run tests

    yarn all:test-pact

Run your application's tests and generate pact files, eg: data

    yarn test-pact data

## Storybook

[Storybook](https://storybook.js.org/) is a UI Component development tool that provides interactive component views with support for device emulation, theme selection and component knobs to adjust the variations of a given component.

To add a storybook to an existing library, see the [NX Documentation](./NX.md).

The main UI Component storybook is in the `assets` library.
This storybook will provide the UX-approved variations of Material-UI components for use in all applications.

Run a storybook locally (eg: assets)

    yarn storybook assets

## Icons

The `@ues/icons` package exports both svg and react components.
Usage:

    import { basicAdd, BasicAdd } from '@ues/assets'

    <BasicAdd color="primary" /> // all @material-ui/core/SvgIcon props supported
    <img src={basicAdd} />

## Translations

The `@ues/i18n` package exports a common i18n interface and modular translation assets.
The translation structure can be found under `./libs/translations/src`:

    pillarx/
        {lng}.json
    pillarx/subns
        {lng}.json

This structure allows for both common and pillar-specific translation namespace sets.
See [TRANSLATIONS.md](./TRANSLATIONS.md) for more information
