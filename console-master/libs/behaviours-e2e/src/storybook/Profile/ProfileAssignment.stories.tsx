import React, { useCallback, useEffect, useState } from 'react'

import { Box, Card, Dialog, makeStyles } from '@material-ui/core'

import { Permission, PermissionsApi, PermissionsContext } from '@ues-data/shared'
import {
  useProfileAssignments,
  useProfileAssignmentToolbar,
  useUnassignMembersConfirmation,
  useUserGroupAssignmentDialog,
} from '@ues-platform/policy-common'
import { ConfirmationDialog, InfiniteTable, InfiniteTableProvider, TableToolbar } from '@ues/behaviours'

import { populateDialog, populateTable, t } from './utils'

const sortUserGroup = sortDirection => {
  return (a, b) => {
    const aName = a.name ? a.name : a.displayName
    const bName = b.name ? b.name : b.displayName
    return sortDirection === 'ASC' ? aName.localeCompare(bName) : bName.localeCompare(aName)
  }
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
}))

const ProfileAssignmentStory = ({ itemsCount }) => {
  const ProfileAssignment = ({ itemsCount }) => {
    const classes = useStyles()
    const assignableItems = populateDialog()
    const assignedItems = populateTable(itemsCount)
    const [filteredAssignable, setFilteredAssignable] = useState([])
    const [filteredAssigned, setFilteredAssigned] = useState(assignedItems)
    const [localData, setLocalData] = useState([])
    const [cursor, setCursor] = useState<string>()

    const handleSearch = (str: string) => {
      if (str) {
        setFilteredAssignable(assignableItems.filter(i => i.displayName.toLowerCase().includes(str.toLowerCase())))
      } else {
        setFilteredAssignable([])
      }
    }

    useEffect(() => {
      setLocalData(filteredAssigned.slice(0, 50))
    }, [filteredAssigned])

    useEffect(() => {
      setFilteredAssigned(assignedItems)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsCount])

    const fetchMore = useCallback(
      async ({ variables }) => {
        const { cursor, max } = variables
        if (cursor === undefined) {
          setLocalData(filteredAssigned.slice(0, max))
          if (max < filteredAssigned.length) {
            setCursor('cursor1')
          }
        } else {
          setLocalData([...localData, ...filteredAssigned.slice(localData.length, localData.length + max)])
        }
      },
      [localData, filteredAssigned],
    )

    const handleSort = async (direction: string) => {
      setFilteredAssigned(assignedItems.sort(sortUserGroup(direction)))
    }

    const { tableProps, providerProps } = useProfileAssignments({
      data: { elements: localData, cursor, count: { total: filteredAssigned.length } },
      fetchMore,
    })

    const { confirmationOptions, confirmDelete } = useUnassignMembersConfirmation(
      providerProps?.selectedProps,
      localData ?? [],
      a => {
        /* call unassign */
      },
    )

    const { dialogOptions, setDialogId } = useUserGroupAssignmentDialog({
      data: filteredAssignable,
      loading: false,
      handleSearch,
      submitAssignment: () => {
        /* call assign */
      },
    })

    const toolbarProps = useProfileAssignmentToolbar({
      selectedIds: providerProps?.selectedProps?.selected,
      items: filteredAssigned.length,
      onAdd: () => setDialogId(Symbol('assignmentId')),
      onDelete: confirmDelete,
      loading: false,
    })

    return (
      <Box display="flex" flexDirection="column" height="90vh">
        <Card className={classes.container}>
          <TableToolbar {...toolbarProps} />
          <InfiniteTableProvider {...providerProps}>
            <InfiniteTable {...tableProps} />
          </InfiniteTableProvider>
          <Dialog {...dialogOptions} />
        </Card>
        <ConfirmationDialog {...confirmationOptions} />
      </Box>
    )
  }

  return <ProfileAssignment itemsCount={itemsCount} />
}

export const Assignment = ProfileAssignmentStory.bind({})

Assignment.args = {
  itemsCount: 50,
  canUpdate: true,
}

const canUpdate = PermissionsApi(new Set([Permission.ECS_USERS_UPDATE]))
const readOnly = PermissionsApi(new Set<Permission>())

function decorator(Story: React.ElementType, { args }) {
  const value = args.canUpdate ? canUpdate : readOnly
  return (
    <PermissionsContext.Provider value={value}>
      <Story />
    </PermissionsContext.Provider>
  )
}

export default {
  title: 'Profile/Assignments',
  component: ProfileAssignmentStory,
  decorators: [decorator],
  argTypes: {
    itemsCount: {
      control: { type: 'number', min: 0 },
    },
    canUpdate: {
      control: { type: 'boolean' },
      description: 'Can update',
      defaultValue: {
        summary: 'true',
      },
    },
  },
}
