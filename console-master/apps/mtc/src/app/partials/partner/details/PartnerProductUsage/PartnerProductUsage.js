import FileSaver from 'file-saver'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Loader } from 'semantic-ui-react'

import BillingHistoryChart from '../../../../../components/BillingHistoryChart'
import BillingHistoryItem from '../../../../../components/BillingHistoryItem'
import { PartnerAPI } from '../../../../../services/api'
// ToDo-Migration: plugin-proposal-decorators vs. Nx.dev/web
// import { ToggleLoading } from '../../../../../utils/decorators'
import either from '../../../../../utils/either'
import { clearPartnerBillingHistory, getPartnerBillingHistory } from '../../redux/actions'

import('./PartnerProductUsage.scss')

class PartnerProductUsage extends Component {
  componentDidMount() {
    this._fetchBillingHistory()
  }

  // ToDo-Migration: plugin-proposal-decorators vs. Nx.dev/web
  // @ToggleLoading('billingHistoryLoading')
  async _fetchBillingHistory() {
    const { partnerId } = this.props.match.params
    await this.props.getPartnerBillingHistory(partnerId)
  }

  _fetchCSV = async (billingReportId, reportName, cb) => {
    const { partnerId } = this.props.match.params
    const [err, res] = await either(PartnerAPI.downloadBillingCSV(partnerId, billingReportId))
    if (err) {
      // this.props.logger.logError('Download Billing History CSV Failed', err)
    } else {
      FileSaver.saveAs(res.data, reportName)
      // this.props.logger.logEvent('Partner Product Usage', 'Download', 'Billing History')
    }
    cb()
  }

  render() {
    return [
      <Loader key="billing-history-loader" content="Loading" active={this.props.billingHistoryLoading} />,
      <BillingHistoryChart key="billing-history-chart" data={this.props.billingHistoryData} />,
      <div className="billing-history-list" key="billing-history-list">
        {this.props.billingHistoryData !== null &&
          this.props.billingHistoryData.map(listItem => {
            return <BillingHistoryItem data={listItem} csvCallback={this._fetchCSV} />
          })}
        {this.props.billingHistoryData !== null && this.props.billingHistoryData.length === 0 && (
          <h3>No Product Usage to Display.</h3>
        )}
      </div>,
    ]
  }
}

function mapStateToProps(state) {
  return {
    billingHistoryData: state.partners.partnerBillingHistory,
    billingHistoryLoading: state.requests.inProcess['get-partner-billing-history'],
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPartnerBillingHistory: getPartnerBillingHistory,
      clearPartnerBillingHistory: clearPartnerBillingHistory,
    },
    dispatch,
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(PartnerProductUsage)
