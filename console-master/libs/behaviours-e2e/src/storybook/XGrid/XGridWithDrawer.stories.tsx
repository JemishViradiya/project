import React, { useCallback, useMemo, useState } from 'react'

import { Accordion, AccordionDetails, AccordionSummary, Button, makeStyles, Paper, Typography } from '@material-ui/core'
import { GridRowParams } from '@material-ui/x-grid'

import { MockProvider } from '@ues-data/shared'
import type { UesTheme } from '@ues/assets'
import { BasicDownload, ChevronDown } from '@ues/assets'
import type { DrawerAction } from '@ues/behaviours'
import { AppliedFilterPanel, ContentAreaPanel, Drawer, TableProvider, TableToolbar, useDrawer } from '@ues/behaviours'

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { XGrid } from '../../../../behaviour/x-grid/src'
import markdown from './drawer.md'
import { useStorybookTable, useXGridColumns } from './x-grid-stories.helpers'

const useStyles = makeStyles<UesTheme>(theme => ({
  root: {
    '& .MuiDataGrid-row': {
      '&:hover': {
        cursor: 'pointer',
      },
      '&.openedDrawerSelection': {
        backgroundColor: `${theme.props.colors.secondary[500]}33`,
        '&:hover': {
          backgroundColor: theme.props.colors.grey[100],
        },
      },
    },
  },
  accordionDetails: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(2),
  },
  accordionRow: {
    display: 'flex',
    marginBottom: theme.spacing(2),
  },
  accordionRowTitle: {
    width: '125px',
    marginRight: theme.spacing(2),
    flexShrink: 0,
  },
}))

const SimpleText = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in
    hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Odio morbi
    quis commodo odio aenean sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis
    viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis imperdiet massa
    tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit
    sed ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
  `

const XGridTableWithDrawer = ({ size, actionsQuantity, content, dense }) => {
  const contentOther = content === 'other'
  const columns = useXGridColumns()
  const classes = useStyles()
  const [selectedRowId, setSelectedRowId] = useState(null)

  const multipleActions: DrawerAction[] = useMemo(
    () => [
      {
        value: 'Update',
        onClick: () => {},
      },
      {
        value: 'Copy',
        onClick: () => {},
      },
      {
        value: 'Delete',
        onClick: () => {},
      },
    ],
    [],
  )

  const singleAction: DrawerAction[] = useMemo(
    () => [
      {
        icon: <BasicDownload />,
        onClick: () => {},
      },
    ],
    [],
  )

  const wrapperStyle = useMemo(() => ({ height: window.innerHeight - 150, width: '100%' }), [])

  const dropRowSelection = useCallback(() => setSelectedRowId(null), [])

  const { open, toggleDrawer, onClickAway } = useDrawer(dropRowSelection)
  const [drawerContentData, setDrawerContent] = useState({} as { [key: string]: any })

  const onRowClick = useCallback(
    params => {
      setSelectedRowId(params.id)

      if (!open) toggleDrawer(params.api.windowRef.current)
      setDrawerContent(params.row)
    },
    [open, toggleDrawer],
  )

  const { providerProps, selectedCount, totalRows, tableProps } = useStorybookTable({
    columns,
    onRowClick,
  })

  const drawerContent = useMemo(() => {
    if (contentOther) return SimpleText

    return (
      <Paper elevation={0}>
        <Accordion>
          <AccordionSummary expandIcon={<ChevronDown />}>
            <Typography variant="h3">Information</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetails}>
            {Object.entries(drawerContentData).map(([key, value]) => {
              return (
                <div key={key} className={classes.accordionRow}>
                  <Typography className={classes.accordionRowTitle} variant="subtitle2">
                    {key}
                  </Typography>
                  <Typography variant="body2">{String(value)}</Typography>
                </div>
              )
            })}
          </AccordionDetails>
        </Accordion>
      </Paper>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerContentData, content])

  const markRowAsSelected = useCallback(
    (params: GridRowParams) => {
      if (params.id === selectedRowId) {
        return 'openedDrawerSelection'
      }
    },
    [selectedRowId],
  )

  return (
    <ContentAreaPanel fullWidth>
      <TableProvider {...providerProps}>
        <TableToolbar
          bottom={<AppliedFilterPanel {...providerProps.filterProps} {...providerProps.filterLabelProps} />}
          begin={
            selectedCount > 0 && (
              <>
                <Typography>Selected: {selectedCount} </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => alert(JSON.stringify(providerProps?.selectedProps?.selectionModel))}
                >
                  Show selected
                </Button>
              </>
            )
          }
          end={<Typography>Total rows: {totalRows} </Typography>}
        />
        <XGrid
          classes={{ root: classes.root }}
          wrapperStyle={wrapperStyle}
          getRowClassName={markRowAsSelected}
          dense={dense}
          {...tableProps}
        />
        <Drawer
          title="Desert info"
          size={size}
          open={open}
          background={contentOther ? 'white' : 'grey'}
          actions={actionsQuantity === 'single' ? singleAction : multipleActions}
          onClickAway={onClickAway}
          toggleDrawer={toggleDrawer}
        >
          {drawerContent}
        </Drawer>
      </TableProvider>
    </ContentAreaPanel>
  )
}

export const TableWithDrawer = XGridTableWithDrawer.bind({})

const decorator = Story => (
  <MockProvider value={true}>
    <Story />
  </MockProvider>
)

TableWithDrawer.args = {
  size: 'medium',
  content: 'accordion',
  actionsQuantity: 'single',
  dense: false,
}

TableWithDrawer.argTypes = {
  size: {
    control: {
      type: 'inline-radio',
      options: ['small', 'medium'],
    },
    defaultValue: { summary: 'medium' },
    description: 'Size',
  },
  content: {
    control: {
      type: 'inline-radio',
      options: ['accordion', 'other'],
    },
    description: 'Content',
  },
  actionsQuantity: {
    control: {
      type: 'inline-radio',
      options: ['single', 'multiple'],
    },
    description: 'Actions quantity',
  },
  dense: {
    control: 'boolean',
    defaultValue: {
      summary: false,
    },
    description: 'Dense grid enabled',
  },
}

TableWithDrawer.parameters = {
  notes: markdown,
}

TableWithDrawer.decorators = [decorator]

export default {
  title: 'Table/MUI X-Grid',
}
