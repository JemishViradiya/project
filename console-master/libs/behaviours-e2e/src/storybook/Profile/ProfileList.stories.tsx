import React, { useCallback, useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import { Button, Card, Link, makeStyles } from '@material-ui/core'

import { useDeleteProfilesConfirmation, useProfilesList, useProfilesListToolbar, useRankable } from '@ues-platform/policy-common'
import {
  ConfirmationDialog,
  DraggableTable,
  DraggableTableProvider,
  FormButtonPanel,
  TableToolbar,
  useDialogPrompt,
} from '@ues/behaviours'

const populateTable = items => {
  const tableData = []
  for (let i = 0; i < items; i++) {
    tableData.push({
      entityId: 'id' + i,
      rank: i + 1,
      name: 'Profile name ' + i,
      description: 'Long description that may take a whole line',
      userCount: Math.floor(Math.random() * 100 + 1),
      groupCount: Math.floor(Math.random() * 100 + 1),
    })
  }
  return tableData
}

const useStyles = makeStyles(theme => ({
  list: {
    flexGrow: 1,
  },
}))

const ProfileListStory = ({ items, rankable, canCreate, canDelete, canUpdate }) => {
  const ProfileList = ({ items, rankable, canUpdate, canCreate, canDelete }) => {
    const navigate = useNavigate()
    const classes = useStyles()
    const [localPoliciesData, setLocalPoliciesData] = useState<
      {
        entityId: string
        name?: string
        rank?: number
        description?: string
        userCount?: number
        groupCount?: number
      }[]
    >(populateTable(items))
    const [rankingSaved, setRankingSaved] = useState<boolean>(true)

    useEffect(() => {
      setLocalPoliciesData(populateTable(items))
    }, [items])

    const {
      unselectAll,
      tableProps,
      providerProps,
      rankMode,
      setRankMode,
      selectedItems,
      handleSearch,
      resetDrag,
    } = useProfilesList({
      rankable,
      getNamePath: () => '#', // relative path to the profile page
      data: localPoliciesData,
      setRankingSaved,
      selectionEnabled: canDelete,
      tableName: 'policiesStoryTable',
    })
    const { confirmationOptions, confirmDelete } = useDeleteProfilesConfirmation(unselectAll, () => {
      /* call delete profiles */
    })

    const toolbarProps = useProfilesListToolbar({
      selectedItems: selectedItems,
      onRank: canUpdate && rankable ? () => setRankMode(true) : undefined,
      items: localPoliciesData?.length ?? 0,
      onSearch: handleSearch,
      onAddPolicy: canCreate
        ? () => {
            /* navigate to add policy page */
          }
        : undefined,
      onDeletePolicies: canDelete
        ? items => {
            canDelete && confirmDelete(items)
          }
        : undefined,
      loading: false,
    })

    const rankProps = useRankable({
      rankMode,
      setRankMode,
      resetDrag: resetDrag,
      data: tableProps.data,
      updateRank: a => {
        /* call update rank */
      },
      rankingSaved,
      setRankingSaved,
    })

    const UnsavedConfirmationDialogComponent = () => {
      return useDialogPrompt('Do you want to leave this page? Your changes have not been saved.', !rankingSaved)
    }
    const UnsavedConfirmationDialog = useCallback(UnsavedConfirmationDialogComponent, [rankingSaved])

    const handleNavigateButton = useCallback(() => {
      navigate('/somewhere-else')
      setRankingSaved(false)
    }, [navigate])

    return (
      <>
        <Card className={classes.list}>
          {!rankingSaved && (
            <>
              <Button variant="outlined" onClick={handleNavigateButton}>
                Emulate Leave page with React router
              </Button>
              <br />
              <br />
              <Link href="about:blank" target="_self">
                {'Emulate Leave page with <a href= />'}
              </Link>
            </>
          )}
          {!rankMode && <TableToolbar {...toolbarProps} />}
          <DraggableTableProvider {...providerProps}>
            <DraggableTable {...tableProps} rankMode={rankMode} />
          </DraggableTableProvider>
          {/* add this only if profile is rankable, otherwise skip */}
          {canUpdate && rankable && <FormButtonPanel {...rankProps} />}
        </Card>
        <ConfirmationDialog {...confirmationOptions} />
        <UnsavedConfirmationDialog />
      </>
    )
  }

  return <ProfileList items={items} rankable={rankable} canCreate={canCreate} canDelete={canDelete} canUpdate={canUpdate} />
}

const SomewhereElse = () => {
  const navigate = useNavigate()
  const goBack = useCallback(() => navigate(-1), [navigate])
  return (
    <>
      <h2>Somewhere Else</h2>
      <Button onClick={goBack} variant="outlined">
        Go Back
      </Button>
    </>
  )
}

const StoryRoutes = (story, ctx) => {
  const El = () => story(ctx)
  return (
    <Routes>
      <Route path="/somewhere-else" element={<SomewhereElse />} />
      <Route path="/" element={<El />} />
    </Routes>
  )
}

export const List = ProfileListStory.bind({})

List.args = {
  items: 50,
  rankable: true,
  canUpdate: true,
  canCreate: true,
  canDelete: true,
}

export default {
  title: 'Profile/Profiles list',
  component: ProfileListStory,
  decorators: [StoryRoutes],
  argTypes: {
    items: {
      control: { type: 'number', min: 0 },
    },
    rankable: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
      },
    },
    canUpdate: {
      control: { type: 'boolean' },
      table: {
        type: {
          summary: 'boolean',
          defaultValue: { summary: true },
        },
      },
    },
    canCreate: {
      control: { type: 'boolean' },
      table: {
        type: {
          summary: 'boolean',
          defaultValue: { summary: true },
        },
      },
    },
    canDelete: {
      control: { type: 'boolean' },
      table: {
        type: {
          summary: 'boolean',
          defaultValue: { summary: true },
        },
      },
    },
  },
}
