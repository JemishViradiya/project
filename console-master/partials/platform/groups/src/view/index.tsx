import React, { lazy } from 'react'

const GroupsTable = lazy(() => import('./groupsTable/GroupsTable'))
const AddLocalGroup = lazy(() => import('./addGroups/local/AddLocalGroup'))
const AddDirectoryGroup = lazy(() => import('./addGroups/directory/AddDirectoryGroup'))
const LocalGroup = lazy(() => import('./groupDetails/local/LocalGroup'))
const DirectoryGroup = lazy(() => import('./groupDetails/directory/DirectoryGroup'))
const AssignUsersPage = lazy(() => import('./assignedUsers/AssignUsersPage'))

export const PlatformGroups = {
  path: '/groups',
  children: [
    { path: '/', element: <GroupsTable /> },
    { path: '/add/local', element: <AddLocalGroup /> },
    { path: '/add/directory', element: <AddDirectoryGroup /> },
    { path: '/local/:id', element: <LocalGroup /> },
    { path: '/directory/:id', element: <DirectoryGroup /> },
    { path: '/addUsers/:groupId', element: <AssignUsersPage /> },
  ],
}
