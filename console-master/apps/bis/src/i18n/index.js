/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import i18n from 'i18next'

import { useStandalone as isStandalone } from '@ues-bis/shared'
import { loadI18n } from '@ues/assets/i18n'

const standalone = isStandalone()
const defaultNS = standalone ? 'bis/standalone/common' : 'bis/ues'

const env = process.env.NODE_ENV
loadI18n(env, {
  ns: [defaultNS, 'bis/shared', 'general/form'],
  defaultNS,
  fallbackNS: 'bis/shared',
  ...(env === 'test' && {
    // can't use utils/test-utils.js because translation files are not loaded correctly (e.g. plurals are not working)
    resources: {
      en: {
        'bis/shared': require('../../../../libs/translations/src/bis/shared/en.json'),
        ...(standalone
          ? {
              'bis/standalone/common': require('../../../../libs/translations/src/bis/standalone/common/en.json'),
              'bis/standalone/errors': require('../../../../libs/translations/src/bis/standalone/errors/en.json'),
            }
          : {
              'bis/ues': require('../../../../libs/translations/src/bis/ues/en.json'),
            }),
        'general/form': require('../../../../libs/translations/src/general/form/en.json'),
      },
    },
  }),
})

export default i18n
