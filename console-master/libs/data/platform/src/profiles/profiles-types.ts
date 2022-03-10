export interface ActivationProfile {
  id?: string
  name: string
  description?: string
  isDefault?: boolean
  // specifies if the desktop platform is enabled
  allowedMobilePlatformsEnabled?: boolean
  // this is the list of Mobile platform.  Posibble values are 'iOS', 'Android'
  allowedMobilePlatformsList?: string[]
  // potentially HTML text from the UI or it can be just plain text too.
  mobileWelcomeEmail?: string
  // for html format, contains the editor state to rebuild the editor with the content
  mobileEmailEditState?: string
  // the email subject for mobile
  mobileEmailSubject?: string
  // the email format for mobile (html or plaintext)
  mobileEmailFormat?: string
  // specifies if the desktop platform is enabled
  allowedDesktopPlatformsEnabled?: boolean
  // this is the list of desktop platform.  Posibble values are 'Windows', 'macOS'
  allowedDesktopPlatformsList?: string[]
  // potentially HTML text from the UI or it can be just plain text too.
  desktopWelcomeEmail?: string
  // for html format, contains the editor state to rebuild the editor with the content
  desktopEmailEditState?: string
  // the email subject for desktop
  desktopEmailSubject?: string
  // the email format for desktop (html or plaintext)
  desktopEmailFormat?: string
  created?: string
  modified?: string
  // this flag indicates if need to resend email upon updating
  resendEmail?: boolean
}

export default void 0
