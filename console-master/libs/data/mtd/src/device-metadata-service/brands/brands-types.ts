//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

interface Vendor {
  name: string
}

export interface Brand {
  name: string
  vendor: Vendor
}
