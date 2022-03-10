import React, { Suspense } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { Route, Routes, useMatch } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import { useNavigationApps } from '@ues-behaviour/app-shell'
import {
  NavigationApps as Apps,
  ResponsiveDrawer as ResponsiveDrawerComponent,
  ResponsiveDrawerProvider,
} from '@ues-behaviour/nav-drawer'
import { MockProvider, UesReduxStore } from '@ues-data/shared'

import Content from './Content'

const HashRouter = React.Fragment

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
}))

const RouteContent = () => {
  const match = useMatch('/:id') || { params: { id: 'root' } }
  const fullMatch = useMatch('/:id/:sub') || match
  return <Content match={fullMatch} />
}

const UserInfo = () => (
  <>
    <div>Ues Developer</div>
    <div>uesdev@ahem.sw.rim.net</div>
    <div>User Role</div>
  </>
)

export const ResponsiveDrawer = storyBookArgs => {
  const classes = useStyles()
  const userNavigation = {
    name: 'myAccount',
    route: `#/dashboard`,
    icon: '',
    navigation: [],
  }
  const NavigationProps = {
    ...useNavigationApps({ mock: null }),
    userNavigation: storyBookArgs.showUserMenu ? userNavigation : undefined,
  }
  return (
    <div className={classes.root}>
      <ResponsiveDrawerProvider responsive={storyBookArgs.responsive}>
        <HashRouter>
          {/* <WaitForServiceWorker> */}
          <ResponsiveDrawerComponent
            nav={
              <Suspense fallback="">
                <Apps {...NavigationProps} UserInfo={<UserInfo />} />
              </Suspense>
            }
            content={
              <Suspense fallback="">
                <Routes>
                  <Route path="*" element={<RouteContent />} />
                </Routes>
              </Suspense>
            }
            responsive={true}
            title={storyBookArgs.name === 'None' ? '' : storyBookArgs.name}
          />
        </HashRouter>
      </ResponsiveDrawerProvider>
    </div>
  )
}

const decorator = Story => (
  <MockProvider value={true}>
    <ReduxProvider store={UesReduxStore}>
      <Story />
    </ReduxProvider>
  </MockProvider>
)
ResponsiveDrawer.args = {
  responsive: true,
  showUserMenu: true,
}

ResponsiveDrawer.decorators = [decorator]

export default {
  title: 'Navigation/Responsive Drawer',
  argTypes: {
    name: {
      control: {
        type: 'select',
        options: ['None', 'Product Name', 'Short', 'Super Awesome Product Name'],
      },
      defaultValue: 'None',
    },
  },
}
