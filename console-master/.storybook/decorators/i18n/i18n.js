/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import i18n from 'i18next'
import { setI18n } from 'react-i18next'

import { loadI18n } from '@ues/assets/i18n'

loadI18n(process.env.NODE_ENV, {
  ns: ['navigation', 'dashboard', 'profiles', 'components', 'formats'],
  defaultNS: '',
})

setI18n(i18n)

export default i18n
