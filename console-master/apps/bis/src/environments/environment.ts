// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

import { environment as defaultEnv } from './environment.prod'

export const environment = {
  ...defaultEnv,
  production: false,
}
