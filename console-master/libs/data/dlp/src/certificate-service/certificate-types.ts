//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

//TODO check contract (there isn't "description" field on the wiki; there isn't "issuer" field in the microservice code)
export type Certificate = {
  alias: string
  subject: string
  description?: string
  created: string
  expiryDate: string
  thumbprint: string
  issuer: string
}

export type UploadCertificateView = {
  certificate: string
}
