//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { APOLLO_DESTINATION, NetworkServices, Permission } from '@ues-data/shared'

export const ReadEventsPermissions = new Set([Permission.MTD_EVENTS_READ])
export const UpdateEventsPermissions = new Set([Permission.MTD_EVENTS_UPDATE])
export const ReadPolicyPermissions = new Set([Permission.MTD_EVENTS_UPDATE])
export const VulnerabilitiesPermissions = new Set([Permission.ECS_VULNERABILITIES_READ])
export const ReadDevicesPermissions = new Set([Permission.ECS_DEVICES_READ])

export const mtdThreatEventExportApi = `${NetworkServices[APOLLO_DESTINATION.REST_API]}/mtd/v1/bff/threat-events/export`
export const mtdThreatEventExportGroupByDetectionApi = `${
  NetworkServices[APOLLO_DESTINATION.REST_API]
}/mtd/v1/bff/threat-events/exportGroupByDetection`
export const mtdThreatEventExportGroupByDeviceApi = `${
  NetworkServices[APOLLO_DESTINATION.REST_API]
}/mtd/v1/bff/threat-events/exportGroupByDevice`
