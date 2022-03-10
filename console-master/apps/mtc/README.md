# Multi-Tenant Console (MTC)

---

## JIRA Backlog

https://jirasd.rim.net/secure/RapidBoard.jspa?projectKey=MSSP&rapidView=3576&view=planning

## Ownership

Ownership (required merge approvals) is controlled through GitLab's [CODEOWNERS](./CODEOWNERS) file.

## Developement

### Running

Build the shared dependencies (pwa, assets, api)

    yarn affected:shared

Or rebuild all dependencies (pwa, assets, api.)

    yarn all:shared

Install dependencies

    yarn install

Start your appliction's development server, eg: dashboard

    yarn start mtc

Navigate to the host alias that corresponds to the environment you wish to hit, i.e. http://localhost:4200/ for the local environment.

## Testing

### Unit tests

Run your MTC's tests

    yarn test mtc

### E2E tests

Run your MTC's tests

    yarn e2e mtc-e2e

See [TESTING](./TESTING.md) and [TESTING-E2E](./TESTING-E2E.md) for more information

## Additional Commands

### ESLint

Run linting check

    yarn lint mtc

Run linting check with autofix

    yarn lint mtc --fix

### Prettier

Run format check

    yarn format

Run format check with autofix

    yarn format --fix
