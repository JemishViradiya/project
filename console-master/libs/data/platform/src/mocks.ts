import * as BffPlatform from './ecs-bff-platform/mock'

export { usersMock, devicesMock, mockEndpointGuids } from './users/common/users-mock'
export { activationProfilesMocks, mockActivationProfileGuids } from './profiles/profiles-mock'
export { groupsMock as userGroupsMock } from './users/common/users-groups-mock'
export { groupsMock, usersInGroupMock } from './group/common/group-mock'
export { assignedProfilesMock as assignedUserProfilesMock, EffectiveUsersPolicyMock } from './users/common/users-policies-mock'
export { mockUser } from './users/apollo/mock'
export { profilesMock, definitionsMock } from './reco/reco-mock'
export { directoryInstanceMock, mockSyncState } from './directory/directory-mock'
export { bcnInstanceMock } from './bcn/common/bcn-mock'

export { BffPlatform }
