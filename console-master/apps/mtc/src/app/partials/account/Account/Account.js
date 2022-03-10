import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import BackButton from '../../../../components/BackButton'
import PageHeader from '../../../../components/PageHeader'
import ProtectedRoute from '../../../../components/Routes/Protected'
import MaterialTabs from '../../../../components/Tabs/MaterialTabs'
import AccountInfo from '../AccountInfo'
import AccountProductUsage from '../AccountProductUsage'

import('./Account.scss')

class Account extends React.Component {
  state = {
    tabs: [
      {
        url: '/account/info',
        alias: 'Partner Info',
      },
      {
        url: '/account/product-usage',
        alias: 'Product Usage',
      },
    ],
  }

  render() {
    return (
      <div id="main-container">
        <PageHeader>
          <BackButton name="Account Overview" url="/tenant/list" />
          <MaterialTabs tabs={this.state.tabs} />
        </PageHeader>
        <Switch>
          <Route exact path="/account/info" component={AccountInfo} />
          <ProtectedRoute exact path="/account/product-usage" hasPermission trueElement={AccountProductUsage} />
          <Redirect exact from="/account" to="/account/info" />
        </Switch>
      </div>
    )
  }
}

export default Account
