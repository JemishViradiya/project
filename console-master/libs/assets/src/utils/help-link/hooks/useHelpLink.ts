/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

export const useHelpLink = (Id: string) => {
  const language = i18next.use(LanguageDetector)?.language || 'en'
  return `https://docs.blackberry.com/${language}/unified-endpoint-security/console/help/${Id}`
}
