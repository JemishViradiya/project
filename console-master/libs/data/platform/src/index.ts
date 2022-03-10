/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { Directory, DirectoryMock } from './directory'
import { Groups, GroupsMock } from './group/common'
import { ActivationProfiles, ActivationProfilesMock } from './profiles/profiles'

const PlatformApi = {
  ActivationProfiles,
  Groups,
  Directory,
}

const PlatformApiMock = {
  ActivationProfiles: ActivationProfilesMock,
  Groups: GroupsMock,
  Directory: DirectoryMock,
}

export { PlatformApi, PlatformApiMock }
export * from './profiles/profiles-types'
export * from './ecs-bff-platform/profiles'
export * from './ecs-bff-platform/profile-members'
export * from './ecs-bff-platform/profile-non-members'
export * from './ecs-reco/assign-users-groups'
export * from './ecs-reco/rank-update'

export * from './profiles/hooks/useBaseProfilesData'
export * from './profiles/hooks/useBaseProfileAssignmentsData'

export * from './directory'
export * from './email-template'

export * from './group'
export * from './users'
export * from './endpoints'
export * from './bcn'
export * from './shared'
