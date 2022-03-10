export enum UesLoginDeploymentHosting {
  SELF = 'SELF',
  STANDALONE = 'STANDALONE',
}

const SELF_HOSTED = [
  'https://staging.ues.labs.blackberry.com',
  'https://local-staging-ues.cylance.com:4200',
  'https://dev.ues.labs.blackberry.com',
  'https://local-dev-ues.cylance.com:4200',
  'https://r00-ues.cylance.com:4200',
  'https://qa2-ues.cylance.com:4200',
  'https://ues.cylance.com:4200',
  'https://ues-euc1.cylance.com:4200',
  'https://ues-apne1.cylance.com:4200',
  'https://ues-sae1.cylance.com:4200',
  'https://ues-au.cylance.com:4200',
]

export const UES_LOGIN_DEPLOYMENT: UesLoginDeploymentHosting =
  SELF_HOSTED.indexOf(globalThis.origin) !== -1 ? UesLoginDeploymentHosting.SELF : UesLoginDeploymentHosting.STANDALONE
