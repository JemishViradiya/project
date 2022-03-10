import React, { useState } from 'react'

import {
  Button,
  ButtonGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'

import { ContentArea, ContentAreaPanel, Tabs, useStatefulTabsProps } from '@ues/behaviours'

const createData = (name, calories, fat, carbs, protein) => {
  return { name, calories, fat, carbs, protein }
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
]

const ContentAreaAndVertTabsStory = () => {
  const statefulTabProps = useStatefulTabsProps({
    defaultSelectedTabIndex: 0,
    tNs: [],
    tabs: [
      {
        translations: {
          label: 'Page 1',
        },
        component: (
          <ContentAreaPanel title="Page 1" subtitle="Page 1 subtitle">
            <Typography variant="body2">Place the content of Page 1 here</Typography>
          </ContentAreaPanel>
        ),
      },
      {
        translations: {
          label: 'Page 2',
        },
        component: (
          <ContentAreaPanel title="Page 2" subtitle="Page 2 subtitle">
            <Typography variant="body2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet.
              Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
              donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit adipiscing bibendum est
              ultricies integer quis. Cursus quis viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
              leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
              arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus
              et molestie ac.
            </Typography>
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Dessert (100g serving)</TableCell>
                    <TableCell align="right">Calories</TableCell>
                    <TableCell align="right">Fat&nbsp;(g)</TableCell>
                    <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                    <TableCell align="right">Protein&nbsp;(g)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.calories}</TableCell>
                      <TableCell align="right">{row.fat}</TableCell>
                      <TableCell align="right">{row.carbs}</TableCell>
                      <TableCell align="right">{row.protein}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </ContentAreaPanel>
        ),
      },
      {
        translations: {
          label: 'Page 3',
        },
        component: (
          <ContentAreaPanel title="Page 3" subtitle="Page 3 subtitle">
            <Typography variant="body2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet.
              Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
              donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit adipiscing bibendum est
              ultricies integer quis. Cursus quis viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
              leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
              arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus
              et molestie ac.
            </Typography>
            <ButtonGroup color="default" variant="outlined">
              <Button>Button 1</Button>
              <Button>Button 2</Button>
              <Button>Button 3</Button>
            </ButtonGroup>

            <FormControl component="fieldset">
              <FormLabel component="legend">Only fruits are enabled!</FormLabel>
              <RadioGroup>
                <FormControlLabel value="Apples" control={<Radio />} label="Apples" />
                <FormControlLabel value="Oranges" control={<Radio />} label="Oranges" />
                <FormControlLabel value="Bananas" control={<Radio />} label="Bananas" />
                <FormControlLabel value="Asparagus" disabled control={<Radio />} label="Asparagus" />
              </RadioGroup>
            </FormControl>
          </ContentAreaPanel>
        ),
      },
    ],
  })
  return (
    <ContentArea alignItems="left">
      <Tabs orientation="vertical" aria-label="Example of vertical tab" {...statefulTabProps} />
    </ContentArea>
  )
}

export const ContentAreaAndVertTabs = ContentAreaAndVertTabsStory.bind({})

export default {
  title: 'Layout/Page specs/Content area (vertical nav)',
}
