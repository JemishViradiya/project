//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

const DOMAIN_REGEX = /^\.*|\.*$/g

// Replace any leading or trailing dots
export const sanitizeDomain = (zone: string): string => zone.replace(DOMAIN_REGEX, '')
