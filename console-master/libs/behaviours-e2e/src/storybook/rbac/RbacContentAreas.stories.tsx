/* eslint-disable react/jsx-no-useless-fragment */
import React, { memo, useCallback, useMemo } from 'react'
import { Navigate, useRoutes } from 'react-router'

import type { TableCellProps } from '@material-ui/core'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  makeStyles,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core'
import Link from '@material-ui/core/Link'

import { MockProvider, PermissionsApi, PermissionsContext, ServiceEnabledContext, usePermissions } from '@ues-data/shared'
import type { ServiceId } from '@ues-data/shared-types'
import { Permission } from '@ues-data/shared-types'
import { BasicAdd, BasicAddRound, BasicDelete } from '@ues/assets'
import type { TabRouteObject } from '@ues/behaviours'
import {
  BasicTable,
  ContentArea,
  ContentAreaPanel,
  GenericErrorBoundary,
  PageTitlePanel,
  RootErrorHandler,
  SecuredContent,
  SecuredContentBoundary,
  TableProvider,
  TableToolbar,
  Tabs,
  TransferList,
  useRoutedTabsProps,
  useSecuredContent,
  useStatefulTabsProps,
} from '@ues/behaviours'

const createData = (name, toppings, calories) => {
  return { name, toppings, calories }
}

const ROW_DATA = [
  createData('Frozen yoghurt', 'Sprinkles', 6.0),
  createData('Ice cream sandwich', 'Chocolate', 237),
  createData('Eclair', 'Skittles', 262),
  createData('Cupcake', 'Peanuts', 305),
  createData('Gingerbread', 'Strawberries', 356),
]

const rightValues = ['4', '5', '6']
const allValues = ['1', '2', '3', ...rightValues]

const DessertPermission = {
  READ: Permission.BIG_TENANT_READ,
  CREATE: Permission.BIG_TENANT_CREATE,
  UPDATE: Permission.BIG_TENANT_UPDATE,
  DELETE: Permission.BIG_TENANT_DELETE,
} as const
const ToppingPermission = {
  READ: Permission.ECS_DIRECTORY_READ,
} as const

enum RoleType {
  Admin = 'Admin',
  ReadOnly = 'ReadOnly',
  Custom = 'Custom',
}

const AllDessertPermissions = Object.values(DessertPermission)
const AllToppingPermissions = Object.values(ToppingPermission)

function numSort(a, b) {
  const a1 = a.split('.')
  const b1 = b.split('.')
  const len = Math.max(a1.length, b1.length)

  for (let i = 0; i < len; i++) {
    const _a = +a1[i] || 0
    const _b = +b1[i] || 0
    if (_a === _b) continue
    else return _a > _b ? 1 : -1
  }
  return 0
}

const useStyles = makeStyles(theme => ({
  outerContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    width: '100%',
  },
  innerContainer: {
    height: '100%',
    margin: theme.spacing(6),
  },
}))

const RBACStory = storyBookArgs => {
  const classNames = useStyles()
  const rightAlign: TableCellProps['align'] = 'right'

  const ActionCell: React.FC = () => {
    const { hasPermission } = usePermissions()
    if (!hasPermission(DessertPermission.DELETE)) return null
    return (
      <IconButton size="small">
        <BasicDelete />
      </IconButton>
    )
  }
  const ActionLabel: React.FC = () => {
    const { hasPermission } = usePermissions()
    if (!hasPermission(DessertPermission.CREATE)) return null
    return (
      <IconButton size="small">
        <BasicAddRound />
      </IconButton>
    )
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const TopppingsCell: React.FC<{ toppings: any }> = ({ toppings: children }) => {
    const { hasPermission } = usePermissions()
    return hasPermission(ToppingPermission.READ) ? <Link>{children}</Link> : children
  }
  const COLUMNS = useMemo(
    () => [
      {
        dataKey: 'name',
        label: 'Dessert (100g serving)',
        width: 100,
        renderCell: (rowData: any, rowDataIndex: number) => {
          return rowData.name
        },
      },
      {
        dataKey: 'toppings',
        label: 'Toppings',
        width: 100,
        renderCell: (rowData: any, rowDataIndex: number) => <TopppingsCell {...rowData} />,
      },
      {
        dataKey: 'calories',
        label: 'Calories',
        styles: { width: 50 },
        align: rightAlign,
        renderCell: (rowData: any, rowDataIndex: number) => {
          return rowData.calories
        },
      },
      {
        dataKey: 'action',
        icon: true,
        label: 'Action',
        align: rightAlign,
        renderCell: (rowData: any, rowDataIndex: number) => <ActionCell />,
        renderLabel: () => <ActionLabel />,
        width: 80,
        styles: { textAlign: 'right', display: 'flex', height: '41px' },
      },
    ],
    [],
  )
  const idFunction = row => row.id
  const basicProps = useMemo(
    () => ({
      columns: COLUMNS,
      idFunction,
      embedded: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const ActionsPanel = ({ storyBookArgs }) => {
    const { hasPermission } = usePermissions()
    return hasPermission(ToppingPermission.READ, DessertPermission.UPDATE) ? (
      <Button startIcon={<BasicAdd />} color="secondary" variant="contained">
        Add a topping
      </Button>
    ) : (
      <></>
    )
  }
  const goBack = useCallback(() => {
    console.log('do nothing')
  }, [])

  const Page1Permissions = new Set([DessertPermission.READ])
  const Page1Panel: React.FC = () => {
    useSecuredContent(Page1Permissions)
    return (
      <>
        <Typography variant="body2">
          Here is a list of desserts. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi
          tempus imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum
          velit laoreet id donec ultrices.
        </Typography>

        <TableToolbar begin={<ActionsPanel storyBookArgs={storyBookArgs} />} />
        <TableProvider basicProps={basicProps}>
          <BasicTable data={ROW_DATA ?? []} noDataPlaceholder="No data" />
        </TableProvider>
      </>
    )
  }
  const Page2Permissions = new Set([DessertPermission.READ])
  const Page2Panel: React.FC = () => {
    const { hasPermission } = usePermissions()
    const disabled = !hasPermission(DessertPermission.UPDATE)
    return (
      <SecuredContent requiredPermissions={Page2Permissions}>
        <Typography variant="body2">
          Edit the dessert. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
        </Typography>

        <FormControl component="fieldset" disabled={disabled}>
          <FormLabel component="legend">Toppings</FormLabel>
          <RadioGroup>
            <FormControlLabel value="Sprinkles" control={<Radio />} label="Sprinkles" checked />
            <FormControlLabel value="Chocolate" control={<Radio />} label="Chocolate" />
            <FormControlLabel value="Skittles" control={<Radio />} label="Skittles" />
            <FormControlLabel value="Peanuts" control={<Radio />} label="Peanuts" />
          </RadioGroup>
          <FormLabel component="legend">Sizes</FormLabel>
          <FormControlLabel
            control={<Checkbox size="small" color="secondary" name="checkbox1" key="1" />}
            label={<Typography variant="body2">Small</Typography>}
            id="checkbox1"
          />
          <FormControlLabel
            control={<Checkbox size="small" color="secondary" name="checkbox2" key="2" />}
            label={<Typography variant="body2">Medium</Typography>}
            id="checkbox2"
          />
          <FormControlLabel
            control={<Checkbox size="small" color="secondary" name="checkbox3" defaultChecked key="3" />}
            label={<Typography variant="body2">Super Size</Typography>}
            id="checkbox3"
          />
          <FormControlLabel control={<Switch name="switch1" />} label={<Typography variant="body2">Pick topping</Typography>} />
          <FormControlLabel
            control={<Switch name="switch2" checked />}
            label={<Typography variant="body2">Mystery topping</Typography>}
          />
          <TextField fullWidth size="small" label="Notes" minRows={3} multiline />
          <TransferList
            allValues={allValues}
            rightValues={rightValues}
            listLabel="Ingredient list"
            rightLabel="Right label"
            leftLabel="Left label"
            allowLeftEmpty={true}
            allowRightEmpty={true}
            sortFunction={numSort}
          />
        </FormControl>
      </SecuredContent>
    )
  }

  const statefulVerticalTabProps = useStatefulTabsProps({
    defaultSelectedTabIndex: 0,
    tNs: [],
    tabs: [
      {
        translations: {
          label: 'Page 1',
        },
        component: (
          <ContentAreaPanel title="Desserts" subtitle="Subtitle" ContentWrapper={SecuredContentBoundary}>
            <Page1Panel />
          </ContentAreaPanel>
        ),
      },
      {
        translations: {
          label: 'Page 2',
        },
        component: (
          <ContentAreaPanel title="Edit a dessert" subtitle="Subtitle" ContentWrapper={SecuredContentBoundary}>
            <Page2Panel />
          </ContentAreaPanel>
        ),
      },
    ],
  })

  interface TabPanelProps {
    title?: string
    children?: React.ReactNode
    fullWidth?: boolean
  }

  const TabPanelComponent = (props: TabPanelProps) => {
    const { title, children, fullWidth } = props

    return (
      <ContentAreaPanel title={title} fullWidth={fullWidth} ContentWrapper={SecuredContentBoundary}>
        {children}
      </ContentAreaPanel>
    )
  }

  const tabs: TabRouteObject[] = [
    {
      path: '/Desserts',
      translations: {
        label: 'Desserts',
      },
      element: <Tabs orientation="vertical" aria-label="Example of vertical tab" {...statefulVerticalTabProps} />,
    },
    {
      path: '/Sandwiches',
      translations: {
        label: 'Sandwiches',
      },
      element: (
        <TabPanelComponent title="Sandwiches">
          <Typography>Sandwiches</Typography>
        </TabPanelComponent>
      ),
    },
    {
      path: '/Drinks',
      translations: {
        label: 'Drinks',
      },
      element: (
        <TabPanelComponent title="Drinks">
          <Typography>Drinks</Typography>
        </TabPanelComponent>
      ),
    },
  ]

  const HTabPanels = args => {
    const tabsProps = useRoutedTabsProps({ tabs })

    return (
      <Tabs navigation {...tabsProps}>
        <ContentArea>{tabsProps.children}</ContentArea>
      </Tabs>
    )
  }

  const HorizontalRoutes = memo(() =>
    useRoutes([
      {
        path: '/',
        element: <HTabPanels />,
        children: [{ path: '/', element: <Navigate to={`./Desserts`} /> }, ...tabs],
      },
    ]),
  )

  return (
    <Box className={classNames.outerContainer}>
      <Box display="flex" flexDirection="column" flex="1">
        <PageTitlePanel goBack={goBack} title={'Go Back Somewhere'} />
        <HorizontalRoutes />
      </Box>
    </Box>
  )
}

export default {
  title: 'RBAC/Roles',
  component: RBACStory,
}

export const OutOfBox = RBACStory.bind({})
OutOfBox.argTypes = {
  role: {
    control: {
      type: 'select',
      options: [RoleType.Admin, RoleType.ReadOnly],
    },
    name: 'Role',
    defaultValue: RoleType.Admin,
    description: 'Role',
  },
}
OutOfBox.decorators = [
  (Story: React.ElementType, { args }) => {
    const { role } = args
    let permissions: Set<Permission>
    if (role === RoleType.Admin) {
      permissions = (new Set([...AllToppingPermissions, ...AllDessertPermissions]) as unknown) as Set<Permission>
    } else if (role === RoleType.ReadOnly) {
      permissions = (new Set([DessertPermission.READ, ToppingPermission.READ]) as unknown) as Set<Permission>
    } else {
      permissions = new Set()
    }

    return decorator(Story, permissions, true)
  },
]

export const Custom = RBACStory.bind({})
Custom.args = {
  role: RoleType.Custom,
}
Custom.argTypes = {
  role: {
    table: {
      disable: true,
    },
    name: 'Role',
    defaultValue: RoleType.Custom,
    description: 'Role',
  },
  dessertPermissions: {
    control: {
      type: 'inline-check',
      options: Object.keys(DessertPermission),
    },
    name: 'Dessert Permissions',
    defaultValue: Object.keys(DessertPermission),
    description: 'Permissions for dessert in a custom role',
  },
  dessertService: {
    control: {
      type: 'boolean',
    },
    defaultValue: { summary: true },
    description: 'Indicates if dessert service is enabled.',
  },
  toppingPermissions: {
    control: {
      type: 'inline-check',
      options: Object.keys(ToppingPermission),
    },
    name: 'Topping Permissions',
    defaultValue: Object.keys(ToppingPermission),
    description: 'Permissions for topping in a custom role',
  },
}
Custom.decorators = [
  (Story: React.ElementType, { args }) => {
    const { toppingPermissions, dessertPermissions, dessertService } = args
    console.log(...toppingPermissions, dessertPermissions, dessertService)
    return decorator(
      Story,
      new Set([...toppingPermissions.map(p => ToppingPermission[p]), ...dessertPermissions.map(p => DessertPermission[p])]),
      dessertService,
    )
  },
]

function decorator(Story, permissions: Set<Permission>, serviceEnabled: boolean) {
  return (
    <MockProvider value={true}>
      <GenericErrorBoundary fallback={<RootErrorHandler />}>
        <ServiceEnabledContext.Provider value={{ isEnabled: (_key: ServiceId) => serviceEnabled }}>
          <PermissionsContext.Provider value={PermissionsApi(permissions)}>
            <Story />
          </PermissionsContext.Provider>
        </ServiceEnabledContext.Provider>
      </GenericErrorBoundary>
    </MockProvider>
  )
}
