//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

// defines the system predefined email (template)
export interface PredefinedEmail {
  // this is the default email content
  content?: string
  // the subject for the email
  subject?: string
  // the format of the content (html or plaintext)
  format?: string
}
export const PredefinedEmail = void 0
