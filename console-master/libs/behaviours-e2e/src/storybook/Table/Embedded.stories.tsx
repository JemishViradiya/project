import React, { useMemo, useState } from 'react'

import type { TableCellProps } from '@material-ui/core'
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Link,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme,
} from '@material-ui/core'
// components
import Card from '@material-ui/core/Card'

import { MockProvider } from '@ues-data/shared'
import { BasicAddRound, BasicAllow, BasicBlock, BasicDelete, useTextCellStyles } from '@ues/assets'
import { BasicTable, TableProvider } from '@ues/behaviours'

import markdown from './embedded.md'
import { getDataForDifferentTypes } from './table.data'
// constants
const ROW_DATA = getDataForDifferentTypes()

const idFunction = row => row.id

const useStyles = makeStyles(theme => ({
  sectionContainer: {
    marginTop: theme.spacing(3),
  },
  marginsContainer: {
    padding: theme.spacing(3),
    '& > *': {
      marginBottom: theme.spacing(3),
    },
  },
  marginsIcon: {
    marginTop: theme.spacing(1.5),
  },
}))

const EmbeddedTable = ({ ...args }) => {
  const { marginsContainer, sectionContainer } = useStyles()
  const theme = useTheme()
  const { marginsIcon } = useStyles(theme)
  const { twoLinesCell } = useTextCellStyles()
  const align: TableCellProps['align'] = 'right'
  const COLUMNS = useMemo(
    () => [
      {
        dataKey: 'name',
        label: 'Item name',
        width: 300,
        renderCell: (rowData: any, rowDataIndex: number) => {
          return <Link>{rowData['name']}</Link>
        },
      },
      {
        dataKey: 'description',
        label: 'Description',
        width: 300,
      },
      {
        dataKey: 'descriptionInTwoLines',
        label: 'In two lines',
        width: 200,
        renderCell: (rowData: any, rowDataIndex: number) => {
          return <div className={twoLinesCell}>{rowData['description']}</div>
        },
      },
      {
        dataKey: 'numeric',
        label: 'Numeric value',
      },
      {
        dataKey: 'date',
        label: 'Date value',
        width: 200,
        renderCell: (rowData: any, rowDataIndex: number) => {
          const date = rowData['date']
          return date ? date.toDateString() : undefined
        },
      },
      {
        dataKey: 'icon',
        icon: true,
        label: 'Icon',
        renderCell: (rowData: any, rowDataIndex: number) => {
          if (rowData['icon'] === -1) return undefined
          return rowData['icon'] ? (
            <BasicAllow className={marginsIcon} fontSize="small" />
          ) : (
            <BasicBlock className={marginsIcon} fontSize="small" />
          )
        },
      },
      {
        dataKey: 'action',
        icon: true,
        label: 'Action',
        align: align,
        renderCell: (rowData: any, rowDataIndex: number) => {
          if (rowData['icon'] === -1) return undefined
          return (
            <IconButton size="small">
              <BasicDelete />
            </IconButton>
          )
        },
        renderLabel: () => (
          <IconButton size="small">
            <BasicAddRound />
          </IconButton>
        ),
      },
    ],
    [marginsIcon, twoLinesCell],
  )

  const basicProps = useMemo(
    () => ({
      columns: COLUMNS,
      idFunction,
      embedded: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const [selectedRadio, setSelectedRadio] = useState(-1)
  const handleSelectRadio = (event, idx) => {
    setSelectedRadio(idx)
  }

  return (
    <Card>
      <Box className={marginsContainer}>
        <Typography variant="h2">Page content</Typography>
        <TextField fullWidth size="small" label="Some text field" />

        <FormControl component="fieldset" className={sectionContainer} size="small">
          <FormLabel>Options</FormLabel>
          <RadioGroup aria-label="options" name="options1" value={selectedRadio}>
            <FormControlLabel
              value="op1"
              control={<Radio size="small" onClick={e => handleSelectRadio(e, 1)} checked={selectedRadio === 1} />}
              label="Option1"
            />
            <FormControlLabel
              value="op2"
              control={<Radio size="small" onClick={e => handleSelectRadio(e, 2)} checked={selectedRadio === 2} />}
              label="Option2"
            />
            <FormControlLabel
              value="op3"
              control={<Radio size="small" onClick={e => handleSelectRadio(e, 3)} checked={selectedRadio === 3} />}
              label="Option3"
            />
          </RadioGroup>
        </FormControl>

        <Typography style={{ marginBottom: theme.spacing(1) }} variant="h2">
          Table content
        </Typography>
        <TableProvider basicProps={basicProps}>
          <BasicTable data={ROW_DATA ?? []} noDataPlaceholder="No data" />
        </TableProvider>

        <Typography variant="h2" className={sectionContainer}>
          Content below the table
        </Typography>
        <TextField fullWidth size="small" label="Some text area" multiline />
      </Box>
    </Card>
  )
}

export const Embedded = EmbeddedTable.bind({})

const decorator = Story => (
  <MockProvider value={true}>
    <Story />
  </MockProvider>
)

Embedded.decorators = [decorator]
Embedded.parameters = { notes: markdown }
