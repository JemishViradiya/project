/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo, useContext, useMemo } from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

import { CssBaseline } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Icon from '@material-ui/core/SvgIcon'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import type { ChartProps, DashboardTime, DrilldownProps } from '@ues-behaviour/dashboard'
import {
  AddWidgetsDrawer,
  ChartErrorHandler,
  ChartHeader,
  chartIcon,
  ChartType,
  DashboardActions,
  DashboardHeader,
  DashboardLayout,
  DashboardProvider,
  DrillDownDrawer,
  GenericDashboardError,
  getDateRangeISOString,
  getInitialGlobalTime,
  GroupBySelect,
  NoDataError,
  TimeIntervalId,
  TimeSelect,
  TimeSelectSmall,
  TotalCount,
  useCustomTimeSelect,
  useDashboard,
  useDataZoom,
  useGlobalTimeSelect,
  useGroupBy,
  useTotalCount,
  WidgetTabs,
} from '@ues-behaviour/dashboard'
import { DEFAULT_TIME_INTERVAL } from '@ues-data/dashboard'
import {
  MockProvider,
  Permission,
  PermissionsApi,
  PermissionsContext,
  ServiceEnabledContext,
  UesReduxStore,
} from '@ues-data/shared'
import type { ServiceId } from '@ues-data/shared-types'
import { SnackbarProvider } from '@ues/behaviours'

import { chartLibrary } from './chartLibrary'
import { outOfBoxConfigs } from './outOfBoxConfigs'

const containerStyle = {
  display: 'flex',
  minWidth: '100%',
  minHeight: '100%',
  maxHeight: '100%',
  flexFlow: 'row nowrap',
}

const useStyles = makeStyles(theme => ({
  // @global:root style is for storybook only, not needed for apps.
  '@global': {
    '#root': {
      display: 'flex',
      flexGrow: 1,
      flexFlow: 'row nowrap',
      justifyContent: 'stretch',
      margin: '-1em',
      maxHeight: 'calc(100vh - 4px)',
      minHeight: 'calc(100vh - 4px)',
      position: 'relative',
    },
  },
  timeInterval: {
    position: 'absolute',
    top: theme.spacing(4),
    left: theme.spacing(1),
    color: theme.palette.grey[600],
    display: 'grid',
  },
  dataZoom: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(1),
    color: theme.palette.grey[600],
  },
}))

const useChartStyles = makeStyles(theme => ({
  chartContainer: {
    height: `calc(100% - ${theme.spacing(6)}px)`,
  },
  chartHeader: {
    paddingTop: 0,
    paddingBottom: theme.spacing(2),
  },
  countChartContainer: {
    height: '100%',
  },
  selectContainer: {
    display: 'inline-flex',
    marginLeft: 'auto',
    '&>*': {
      marginLeft: theme.spacing(1),
    },
  },
  chartPlaceHolder: {
    width: '100%',
    height: `calc(100% - ${theme.spacing(4)}px)`,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.grey[300],
  },
  tabs: {
    marginBottom: theme.spacing(0),
  },
}))

const StoryContext = React.createContext({ noData: false, error: false })

interface DashboardMainProps {
  editable?: boolean
}

type timeIntervalViewType = {
  showCustomTime: boolean
  customTime: DashboardTime
  globalTime: DashboardTime
}

let showTimeInterval = false

const TimeIntervalView = (props: timeIntervalViewType) => {
  const { showCustomTime, customTime, globalTime } = props
  const styles = useStyles()
  const time = showCustomTime ? getDateRangeISOString(customTime) : getDateRangeISOString(globalTime)
  const nowTime = showCustomTime ? customTime.nowTime : globalTime.nowTime
  return (
    <div className={styles.timeInterval}>
      <Typography variant={'caption'}>{`Start: ${time.startDate}`}</Typography>
      <Typography variant={'caption'}>{`End: ${time.endDate}`}</Typography>
      <Typography variant={'caption'}>{`Now: ${nowTime.toISOString()}`}</Typography>
    </div>
  )
}

const DataZoomView = () => {
  const styles = useStyles()
  return (
    <Typography variant={'caption'} className={styles.dataZoom}>
      {'Data zoom on'}
    </Typography>
  )
}

const ChartWidget = (props: ChartProps) => {
  const { id, chartId, width, height, globalTime, chartType } = props
  const { noData, error } = useContext(StoryContext)
  if (noData) throw new NoDataError()
  if (error) throw new GenericDashboardError(undefined, 'Localized error message')

  const chartStyles = useChartStyles()

  const placeHolderIconSize = chartType === ChartType.Count ? Math.min(width, height - 48) : Math.min(width, height - 100)

  const { showCustomTime, customDashboardTime, setCustomDashboardTime } = useCustomTimeSelect({
    id,
    defaultTimeInterval: TimeIntervalId.Last24Hours,
  })

  const { groupBy, setGroupBy } = useGroupBy({ id, defaultGroupBy: '1' })
  const { showDataZoom } = useDataZoom({ id })
  const { showTotalCount } = useTotalCount({ id })

  const { setDrillDownOpen, setDrillDownContext } = useDashboard()

  const time = showCustomTime ? getDateRangeISOString(customDashboardTime) : getDateRangeISOString(globalTime)

  return useMemo(() => {
    const handleTotalClick = (drilldownProps): void => {
      setDrillDownContext(drilldownProps)
      setDrillDownOpen(true)
    }

    return (
      <div className={chartType === ChartType.Count ? chartStyles.countChartContainer : chartStyles.chartContainer}>
        {chartType !== ChartType.Count && (
          <ChartHeader className={chartStyles.chartHeader}>
            {showTotalCount && (
              <TotalCount
                count={'99,999'}
                description={'description'}
                onInteraction={() =>
                  handleTotalClick({
                    chartId: chartId,
                    context: { timeInterval: time, total: '99,999' },
                  })
                }
              />
            )}
            <div className={chartStyles.selectContainer}>
              {chartType === ChartType.Line && <GroupBySelect groupBy={groupBy} setGroupBy={setGroupBy} />}
              {showCustomTime && <TimeSelectSmall dashboardTime={customDashboardTime} setDashboardTime={setCustomDashboardTime} />}
            </div>
          </ChartHeader>
        )}
        <div className={chartStyles.chartPlaceHolder}>
          <Icon style={{ fontSize: placeHolderIconSize }} component={chartIcon(chartType)} />
          {showDataZoom && <DataZoomView />}
          {showTimeInterval && (
            <TimeIntervalView showCustomTime={showCustomTime} customTime={customDashboardTime} globalTime={globalTime} />
          )}
        </div>
      </div>
    )
  }, [
    chartId,
    chartStyles,
    chartType,
    customDashboardTime,
    globalTime,
    groupBy,
    placeHolderIconSize,
    setCustomDashboardTime,
    setDrillDownContext,
    setDrillDownOpen,
    setGroupBy,
    showCustomTime,
    showDataZoom,
    showTotalCount,
    time,
  ])
}

const DrilldownWidget = (props: DrilldownProps) => {
  const { chartId, context } = props
  const timeIntervalStr = `${context['timeInterval'].startDate} - ${context['timeInterval'].endDate}`
  return (
    <div
      style={{
        height: '100%',
        textAlign: 'center',
      }}
    >
      <div>{`Drilldown chartId: ${chartId}`}</div>
      <div>{`Drilldown context (total, timeInterval): ${context['total']}, ${timeIntervalStr}`}</div>
    </div>
  )
}

const ChartWidgetWithTabs = (props: ChartProps) => {
  const { id, width, height, globalTime, chartType } = props

  const placeHolderIconSize = Math.min(width, height - 120)

  const { showCustomTime, customDashboardTime, setCustomDashboardTime } = useCustomTimeSelect({
    id,
    defaultTimeInterval: TimeIntervalId.Last24Hours,
  })

  const chartStyles = useChartStyles()

  type chartTabComponentType = {
    count: string
    chartType: ChartType
  }

  return useMemo(() => {
    const ChartTabComponent = (compProps: chartTabComponentType) => {
      const { count, chartType } = compProps
      const { showTotalCount } = useTotalCount({ id })

      const { noData, error } = useContext(StoryContext)

      return (
        <>
          <ChartHeader className={chartStyles.chartHeader}>
            {showTotalCount && <TotalCount count={count} description={'description'} />}
            <div className={chartStyles.selectContainer}>
              {showCustomTime && <TimeSelectSmall dashboardTime={customDashboardTime} setDashboardTime={setCustomDashboardTime} />}
            </div>
          </ChartHeader>
          <ChartErrorHandler
            noData={noData}
            errorMessage={error && 'Localized error message'}
            requiredPermissions={[Permission.BIG_REPORTING_READ]}
            fallbackStyles={{ height: height - 120 }}
          >
            <div className={chartStyles.chartPlaceHolder}>
              <Icon style={{ fontSize: placeHolderIconSize }} component={chartIcon(chartType)} />
              {showTimeInterval && (
                <TimeIntervalView showCustomTime={showCustomTime} customTime={customDashboardTime} globalTime={globalTime} />
              )}
            </div>
          </ChartErrorHandler>
        </>
      )
    }

    return (
      <div className={chartStyles.chartContainer}>
        <WidgetTabs
          id={id}
          items={[
            {
              label: 'Bar',
              component: <ChartTabComponent count={'3587'} chartType={chartType} />,
            },
            {
              label: 'Line',
              component: <ChartTabComponent count={'1562'} chartType={ChartType.Line} />,
            },
            {
              label: 'Column',
              component: <ChartTabComponent count={'458'} chartType={ChartType.Column} />,
            },
          ]}
        />
      </div>
    )
  }, [
    chartStyles,
    chartType,
    customDashboardTime,
    globalTime,
    id,
    placeHolderIconSize,
    setCustomDashboardTime,
    showCustomTime,
    height,
  ])
}

const myComponent = (props: ChartProps): JSX.Element => {
  return <ChartWidget {...props} />
}

const myDrilldownComponent = (props: DrilldownProps): JSX.Element => {
  return <DrilldownWidget {...props} />
}

const myComponentWithTabs = (props: ChartProps): JSX.Element => {
  return <ChartWidgetWithTabs {...props} />
}

export const Dashboard = storyBookArgs => {
  const styles = useStyles()

  showTimeInterval = storyBookArgs.showTimeInterval

  const dashboardId = 'myDashboardId'

  const dasboardTitle = 'Sample Dashboard'

  function getInitialLayoutState() {
    return [
      { i: 'card1', x: 0, y: 0, w: 6, h: 5 },
      { i: 'card2', x: 6, y: 0, w: 6, h: 5 },
      { i: 'card3', x: 12, y: 0, w: 12, h: 5 },
      { i: 'card4', x: 0, y: 5, w: 6, h: 7 },
      { i: 'card5', x: 6, y: 5, w: 18, h: 7 },
      { i: 'card9', x: 0, y: 10, w: 6, h: 7 },
      { i: 'card10', x: 6, y: 10, w: 6, h: 7 },
      { i: 'card11', x: 12, y: 10, w: 12, h: 7 },
      { i: 'card12', x: 0, y: 14, w: 6, h: 6 },
    ]
  }

  function getInitialCardState() {
    return {
      card1: {
        chartId: 'chart1',
      },
      card2: {
        chartId: 'chart2',
      },
      card3: {
        chartId: 'chart3',
      },
      card4: {
        chartId: 'chart4',
        options: {
          totalCount: true,
          customTime: 'last90Days',
        },
      },
      card5: {
        chartId: 'chart5',
        options: { customTime: 'last7Days', dataZoom: false, groupBy: '24' },
      },
      card9: {
        chartId: 'chart9',
        options: { groupBy: '1' },
      },
      card10: {
        chartId: 'chart10',
      },
      card11: {
        chartId: 'chart11',
        options: { totalCount: true },
      },
      card12: {
        chartId: 'chart12',
      },
    }
  }

  const chartLibrary = {
    chart1: {
      title: 'Card title 1',
      defaultWidth: 3,
      defaultHeight: 2.5,
      chartType: ChartType.Count,
      showCardTitle: false,
      component: myComponent,
      permissions: [Permission.BIG_REPORTING_READ],
    },
    chart2: {
      title: 'Card title 2',
      defaultWidth: 3,
      defaultHeight: 2.5,
      chartType: ChartType.Count,
      showCardTitle: false,
      component: myComponent,
    },
    chart3: {
      title: 'Card title 3',
      defaultWidth: 6,
      defaultHeight: 2.5,
      chartType: ChartType.Count,
      showCardTitle: false,
      component: myComponent,
    },
    chart4: {
      title: 'Card title 4',
      defaultWidth: 3,
      defaultHeight: 7,
      component: myComponent,
      drilldownComponent: myDrilldownComponent,
      chartType: ChartType.Donut,
      availableOptions: { totalCount: true, customTime: true },
    },
    chart5: {
      title: 'Card title 5',
      defaultWidth: 9,
      defaultHeight: 7,
      component: myComponent,
      drilldownComponent: myDrilldownComponent,
      chartType: ChartType.Line,
      availableOptions: { totalCount: true, customTime: true, dataZoom: true },
    },
    chart6: {
      title: 'Card title 6',
      defaultWidth: 4,
      defaultHeight: 5,
      component: myComponent,
      chartType: ChartType.Bar,
      availableOptions: { customTime: true, dataZoom: true },
    },
    chart7: {
      title: 'Card title 7',
      defaultWidth: 4,
      defaultHeight: 5,
      component: myComponent,
      chartType: ChartType.Column,
      availableOptions: { customTime: true, dataZoom: true },
    },
    chart8: {
      title: 'Card title 8',
      defaultWidth: 4,
      defaultHeight: 5,
      component: myComponent,
      chartType: ChartType.Toplist,
      availableOptions: { customTime: true, dataZoom: true },
    },
    chart9: {
      title: 'Card title 9',
      defaultWidth: 3,
      defaultHeight: 6,
      component: myComponent,
      drilldownComponent: myDrilldownComponent,
      chartType: ChartType.Line,
      availableOptions: { totalCount: true, dataZoom: true },
    },
    chart10: {
      title: 'Card title 10',
      defaultWidth: 3,
      defaultHeight: 6,
      component: myComponent,
      drilldownComponent: myDrilldownComponent,
      chartType: ChartType.Pie,
      availableOptions: { totalCount: true, dataZoom: true },
    },
    chart11: {
      title: 'Card title 11',
      defaultWidth: 3,
      defaultHeight: 6,
      component: myComponentWithTabs,
      drilldownComponent: myDrilldownComponent,
      chartType: ChartType.Bar,
      availableOptions: { customTime: true, totalCount: true },
    },
    chart12: {
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      defaultWidth: 3,
      defaultHeight: 6,
      component: myComponent,
      drilldownComponent: myDrilldownComponent,
      chartType: ChartType.Column,
      availableOptions: { totalCount: true, dataZoom: true },
    },
  }

  const DashboardMain = memo(({ editable }: DashboardMainProps) => {
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.up('md'))
    const showActions = editable && matches
    const { containerProps, addWidgetsDrawerOpen, drillDownOpen, setDrillDownOpen } = useDashboard()

    return (
      <>
        <div {...containerProps}>
          <DashboardHeader widgetDrawerOpen={addWidgetsDrawerOpen}>
            <TimeSelect testid={'globalTime'} {...useGlobalTimeSelect()} />
            {showActions && <DashboardActions outOfBoxConfigs={outOfBoxConfigs} />}
          </DashboardHeader>
          <DashboardLayout />
        </div>
        {showActions && <AddWidgetsDrawer />}
        <DrillDownDrawer open={drillDownOpen} setOpen={setDrillDownOpen} />
      </>
    )
  })

  const dashboardProps = {
    id: dashboardId,
    title: dasboardTitle,
    globalTime: getInitialGlobalTime(DEFAULT_TIME_INTERVAL),
    layoutState: getInitialLayoutState(),
    cardState: getInitialCardState(),
    chartLibrary: chartLibrary,
    nonPersistent: true,
    editable: storyBookArgs.editable,
  }

  const client = new ApolloClient({ cache: new InMemoryCache(), uri: null })

  return (
    <ApolloProvider client={client}>
      <StoryContext.Provider value={{ noData: storyBookArgs.showNoData, error: storyBookArgs.showError }}>
        <DashboardProvider dashboardProps={dashboardProps}>
          <DashboardMain editable={dashboardProps.editable} />
        </DashboardProvider>
      </StoryContext.Provider>
    </ApolloProvider>
  )
}

export const Custom = storyBookArgs => {
  const DashboardMain = memo(() => {
    const theme = useTheme()
    useStyles()
    const matches = useMediaQuery(theme.breakpoints.up('md'))
    const showActions = matches && storyBookArgs.editable
    const { addWidgetsDrawerOpen, containerProps } = useDashboard()

    return (
      <>
        <div {...containerProps}>
          <DashboardHeader widgetDrawerOpen={addWidgetsDrawerOpen}>
            <TimeSelect testid={'globalTime'} {...useGlobalTimeSelect()} />
            {showActions && <DashboardActions outOfBoxConfigs={outOfBoxConfigs} />}
          </DashboardHeader>
          <DashboardLayout />
        </div>
        {showActions && <AddWidgetsDrawer />}
      </>
    )
  })

  const dashboardProps = {
    id: 'customDashboardId',
    title: 'Custom dashboard',
    globalTime: getInitialGlobalTime(DEFAULT_TIME_INTERVAL),
    layoutState: [],
    cardState: {},
    chartLibrary: chartLibrary,
    nonPersistent: true,
    editable: storyBookArgs.editable,
  }

  return (
    <DashboardProvider dashboardProps={dashboardProps}>
      <DashboardMain />
    </DashboardProvider>
  )
}

Dashboard.args = {
  editable: true,
  showTimeInterval: false,
  canAccess: true,
  showNoData: false,
  showError: false,
}

Custom.args = {
  editable: true,
}

const fullAccess = PermissionsApi(new Set([Permission.BIG_REPORTING_READ]))
const noPermission = PermissionsApi(new Set<Permission>())

function decorator(Story: React.ElementType, { args }) {
  const value = args.canAccess ? fullAccess : noPermission
  return (
    <>
      <CssBaseline />
      <div style={containerStyle}>
        <MockProvider value={true}>
          <ServiceEnabledContext.Provider value={{ isEnabled: (_key: ServiceId) => args.hasService }}>
            <PermissionsContext.Provider value={value}>
              <ReduxProvider store={UesReduxStore}>
                <SnackbarProvider>
                  <Story />
                </SnackbarProvider>
              </ReduxProvider>
            </PermissionsContext.Provider>
          </ServiceEnabledContext.Provider>
        </MockProvider>
      </div>
    </>
  )
}

export default {
  title: 'Dashboard/Dashboard',
  decorators: [decorator],
  argTypes: {
    editable: {
      control: { type: 'boolean' },
      description: 'Editable',
      defaultValue: {
        summary: 'true',
      },
    },
    showTimeInterval: {
      control: { type: 'boolean' },
      description: 'Show time intervals',
      defaultValue: {
        summary: 'false',
      },
    },
    canAccess: {
      control: { type: 'boolean' },
      description: 'Can access',
      defaultValue: {
        summary: 'true',
      },
    },
    hasService: {
      control: { type: 'boolean' },
      description: 'Has service enabled',
      defaultValue: {
        summary: 'true',
      },
    },
    showNoData: {
      control: { type: 'boolean' },
      description: 'Show no data',
      defaultValue: {
        summary: 'false',
      },
    },
    showError: {
      control: { type: 'boolean' },
      description: 'Show error',
      defaultValue: {
        summary: 'false',
      },
    },
  },
}
