// import 'react-dates/initialize'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import 'react-dates/lib/css/_datepicker.css'
import './app.scss'

import React, { Component, Suspense } from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import { compose } from 'recompose'
import { bindActionCreators } from 'redux'

import {
  Account,
  Auth,
  Forbidden,
  MainContainer,
  NotificationContainer,
  Partner,
  PartnerCreate,
  PartnerDetailsSection,
  Profile,
} from '@mtc/partials'

import { CssBaseline, ThemeProvider } from '@material-ui/core'
// import { CYLANCE_THEME } from '@cylance/ui-theme-lib'
import { createTheme } from '@material-ui/core/styles'

import NotFound from '../components/elements/NotFound'
import ProtectedRoute from '../components/Routes/Protected'
import history from '../configureHistory'
import { setEnvironment } from '../redux/app/actions'
import { requestFeatures } from '../redux/feature/actions'
import { maintenanceRedirect } from '../redux/maintenance/actions'
import Storage from '../Storage'

// should be deleted
const TenantListCompExample = () => <h1>Hello from tenant list</h1>

class App extends Component {
  componentDidMount() {
    this.props.setEnvironment(window.location.host)
    this.props.maintenanceRedirect()
    this.props.requestFeatures()
  }

  render() {
    const muiTheme = createTheme({})
    const loading = null
    return (
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Router history={history}>
          <div>
            <Suspense fallback={null}>
              <NotificationContainer />
            </Suspense>
            <Suspense fallback={loading}>
              <Route
                path="/"
                render={() =>
                  Storage.checkBearerTokenNotExpired() ? (
                    <MainContainer>
                      <Suspense fallback={loading}>
                        <Switch>
                          <Redirect exact from="/tenant/details/devices/:tenantId" to="/tenant/details/:tenantId/devices" />
                          <Redirect
                            exact
                            from="/tenant/details/global-list/:tenantId/quarantine"
                            to="/tenant/details/:tenantId/global-list/quarantine"
                          />
                          <Redirect
                            exact
                            from="/tenant/details/global-list/:tenantId/safelist"
                            to="/tenant/details/:tenantId/global-list/safelist"
                          />
                          <Redirect exact from="/tenant/details/policies/:tenantId" to="/tenant/details/:tenantId/policies" />
                          <Redirect exact from="/tenant/details/threats/:tenantId" to="/tenant/details/:tenantId/threats" />
                          <Redirect exact from="/tenant/details/users/:tenantId" to="/tenant/details/:tenantId/users" />
                          <Redirect exact from="/tenant/details/zones/:tenantId" to="/tenant/details/:tenantId/zones" />

                          {/*<ProtectedRoute*/}
                          {/*  exact*/}
                          {/*  path="/tenant/details/:tenantId/users/create"*/}
                          {/*  hasPermission={!!this.props.permissions["tenant:manage"]}*/}
                          {/*  trueElement={TenantUserCreate}*/}
                          {/*/>*/}
                          {/*<ProtectedRoute*/}
                          {/*  path="/tenant/details/:tenantId/users/edit"*/}
                          {/*  hasPermission={!!this.props.permissions["tenant:manage"]}*/}
                          {/*  trueElement={TenantUserEdit}*/}
                          {/*/>*/}
                          {/*<ProtectedRoute*/}
                          {/*  path="/tenant/details/:tenantId"*/}
                          {/*  hasPermission={!!this.props.permissions["tenant:read"]}*/}
                          {/*  trueElement={TenantDetailsContainer}*/}
                          {/*/>*/}
                          {/*<ProtectedRoute*/}
                          {/*  exact*/}
                          {/*  path="/tenant/create"*/}
                          {/*  hasPermission={!!this.props.permissions["tenant:manage"]}*/}
                          {/*  trueElement={TenantCreate}*/}
                          {/*/>*/}
                          {/*<Route path="/tenant" component={Tenant} />*/}

                          {/*this should be deleted*/}
                          <ProtectedRoute exact path="/tenant/list" hasPermission={true} trueElement={TenantListCompExample} />

                          {/*<ProtectedRoute*/}
                          {/*  exact*/}
                          {/*  path="/user/create"*/}
                          {/*  hasPermission={!!this.props.permissions["user:manage"]}*/}
                          {/*  trueElement={UserCreate}*/}
                          {/*/>*/}
                          {/*<ProtectedRoute*/}
                          {/*  exact*/}
                          {/*  path="/user/roles/edit"*/}
                          {/*  hasPermission={!!this.props.permissions["role:manage"]}*/}
                          {/*  trueElement={EditRole}*/}
                          {/*/>*/}
                          {/*<ProtectedRoute*/}
                          {/*  exact*/}
                          {/*  path="/user/roles/create"*/}
                          {/*  hasPermission={!!this.props.permissions["role:manage"]}*/}
                          {/*  trueElement={CreateRole}*/}
                          {/*/>*/}
                          {/*<ProtectedRoute*/}
                          {/*  exact*/}
                          {/*  path="/user/:userId/edit"*/}
                          {/*  hasPermission={!!this.props.permissions["user:manage"]}*/}
                          {/*  trueElement={UserEdit}*/}
                          {/*/>*/}
                          {/*<ProtectedRoute*/}
                          {/*  path="/user"*/}
                          {/*  hasPermission={!!this.props.permissions["user:list"]}*/}
                          {/*  trueElement={User}*/}
                          {/*/>*/}

                          {/*<ProtectedRoute*/}
                          {/*  exact*/}
                          {/*  path="/reports/create"*/}
                          {/*  hasPermission={!!this.props.permissions["report:manage"]}*/}
                          {/*  trueElement={CreateReport}*/}
                          {/*/>*/}
                          {/*<ProtectedRoute*/}
                          {/*  exact*/}
                          {/*  path="/reports/:reportId/details"*/}
                          {/*  hasPermission={!!this.props.permissions["report:read"]}*/}
                          {/*  trueElement={UpdateReport}*/}
                          {/*/>*/}
                          {/*<ProtectedRoute*/}
                          {/*  exact*/}
                          {/*  path="/reports/:reportId/update"*/}
                          {/*  hasPermission={!!this.props.permissions["report:manage"]}*/}
                          {/*  trueElement={UpdateReport}*/}
                          {/*/>*/}

                          <ProtectedRoute
                            path="/partner/details/:partnerId"
                            hasPermission={!!this.props.permissions['partner:read']}
                            trueElement={PartnerDetailsSection}
                            partnerReadPermission={!!this.props.permissions['partner:read']}
                          />
                          <ProtectedRoute
                            exact
                            path="/partner/create"
                            hasPermission={!!this.props.permissions['partner:manage']}
                            trueElement={PartnerCreate}
                          />
                          <Route path="/partner" component={Partner} />
                          <Route exact path="/profile" component={Profile} />
                          {/*<Route exact path="/audit" component={Audit} />*/}
                          <Route path="/account" component={Account} />
                          {/*<Route path="/settings" component={Settings} />*/}
                          {/*<ProtectedRoute*/}
                          {/*  path="/reports"*/}
                          {/*  hasPermission={!!this.props.permissions["report:read"]}*/}
                          {/*  trueElement={Report}*/}
                          {/*/>*/}
                          <Route exact path="/forbidden" component={Forbidden} />
                          <Route exact path="/404" component={NotFound} />
                          <Redirect exact from="/auth/login" to="/tenant/list" />
                          <Redirect exact from="/auth/external-login" to="/tenant/list" />
                          <Redirect exact from="/" to="/tenant/list" />
                          {/*<Route path="/auth/accept-eula" component={MSSPEula} />*/}
                          <Route component={NotFound} />
                        </Switch>
                      </Suspense>
                    </MainContainer>
                  ) : (
                    <Switch>
                      <Route path="/auth" component={Auth} />
                      <Route exact path="/forbidden" component={Forbidden} />
                      <Redirect to="/auth/login" />
                    </Switch>
                  )
                }
              />
            </Suspense>
          </div>
        </Router>
      </ThemeProvider>
    )
  }
}

function mapStateToProps(state) {
  return {
    permissions: state.auth.permissions,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      requestFeatures: requestFeatures,
      maintenanceRedirect: maintenanceRedirect,
      setEnvironment: setEnvironment,
    },
    dispatch,
  )
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(App)
