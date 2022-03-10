import { UesReduxStore } from '@ues-data/shared'

import { getApps } from './store'

export const getNavApps = () => getApps(UesReduxStore.getState())
