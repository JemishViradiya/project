import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'

import NotFound from '../../../../components/elements/NotFound'
import PageHeader from '../../../../components/PageHeader'
import ProtectedRoute from '../../../../components/Routes/Protected'
import MaterialTabs from '../../../../components/Tabs/MaterialTabs'
import PartnerList from '../list/PartnerList'

class Partner extends React.Component {
  state = {
    tabs: [
      {
        url: '/partner/list',
        alias: 'Partners',
        permissions: 'partnerListPermission',
      },
    ],
  }

  render() {
    return (
      <div id="main-container">
        <PageHeader>
          <MaterialTabs tabs={this.state.tabs} />
        </PageHeader>
        <Switch>
          <ProtectedRoute exact path="/partner/list" hasPermission={this.props.partnerListPermission} trueElement={PartnerList} />
          <Redirect exact from="/partner" to="/partner/list" />
          <Route component={NotFound} />
        </Switch>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    partnerListPermission: !!state.auth.permissions['partner:list'],
  }
}

export default connect(mapStateToProps, null)(Partner)
