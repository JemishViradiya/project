import React from 'react'
import { Route, Switch } from 'react-router-dom'

import BackButton from '../../../../components/BackButton'
import NotFound from '../../../../components/elements/NotFound'
import PageHeader from '../../../../components/PageHeader'
import ProtectedRoute from '../../../../components/Routes/Protected'
import MaterialTabs from '../../../../components/Tabs/MaterialTabs'
import PartnerDetails from './PartnerDetails'
import PartnerProductUsage from './PartnerProductUsage'

class PartnerDetailsSection extends React.Component {
  state = {
    tabs: [
      {
        url: `/partner/details/${this.props.match.params.partnerId}`,
        alias: 'Partner Info',
        permissions: 'partnerReadPermission',
      },
      {
        url: `/partner/details/${this.props.match.params.partnerId}/product-usage`,
        alias: 'Product Usage',
        permissions: 'partnerReadPermission',
      },
    ],
    title: '',
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search)
    const partnerName = params.get('name')
    this.setState({ title: partnerName })
  }

  render() {
    return (
      <div id="main-container">
        <PageHeader>
          <BackButton name={this.state.title} url="/partner/list" />
          <MaterialTabs tabs={this.state.tabs} />
        </PageHeader>
        <Switch>
          <ProtectedRoute
            exact
            path="/partner/details/:partnerId"
            hasPermission={this.props.partnerReadPermission}
            trueElement={PartnerDetails}
          />
          <ProtectedRoute
            exact
            path="/partner/details/:partnerId/product-usage"
            hasPermission={this.props.partnerReadPermission}
            trueElement={PartnerProductUsage}
          />
          <Route component={NotFound} />
        </Switch>
      </div>
    )
  }
}

export default PartnerDetailsSection
