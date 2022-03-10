//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

export interface NetworkProtectionConfig {
  intrusionProtectionEnabled?: boolean
  ipRep?: {
    enabled?: boolean
    threshold?: string
  }
  notify?: {
    enabled?: boolean
    message?: string
  }
}
