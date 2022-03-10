import FileSaver from 'file-saver'
import React, { Component } from 'react'
import { Loader } from 'semantic-ui-react'

import BillingHistoryChart from '../../../../components/BillingHistoryChart'
import BillingHistoryItem from '../../../../components/BillingHistoryItem'
import { PartnerAPI } from '../../../../services/api'
import Storage from '../../../../Storage'
// ToDo-Migration: plugin-proposal-decorators vs. Nx.dev/web
// import { ToggleLoading } from '../../../../utils/decorators'
import either from '../../../../utils/either'

import('./AccountProductUsage.scss')

class AccountProductUsage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      billingHistoryLoading: false,
      billingHistoryData: null,
    }
    this._fetchBillingHistory = this._fetchBillingHistory.bind(this)
  }

  componentDidMount() {
    this._fetchBillingHistory()
  }

  // ToDo-Migration: plugin-proposal-decorators vs. Nx.dev/web
  // @ToggleLoading('billingHistoryLoading')
  async _fetchBillingHistory() {
    const { pid } = Storage.getDecodedBearerToken()
    const [err, res] = await either(PartnerAPI.getBillingHistory(pid))
    if (err) {
      // this.props.logger.logError('GET Billing History Failed', err)
    } else {
      this.setState({ billingHistoryData: res.data })
    }
  }

  _fetchCSV = async (billingReportId, reportName, cb) => {
    const { pid } = Storage.getDecodedBearerToken()
    const [err, res] = await either(PartnerAPI.downloadBillingCSV(pid, billingReportId))
    if (err) {
      // this.props.logger.logError('Download Billing History CSV Failed', err)
    } else {
      FileSaver.saveAs(res.data, reportName)
      // this.props.logger.logEvent('Account Product Usage', 'Download', 'Billing History')
    }
    cb()
  }

  render() {
    return [
      <Loader key="apu-loader" content="Loading" active={this.state.billingHistoryLoading} />,
      <BillingHistoryChart key="chart" data={this.state.billingHistoryData} />,
      <div key="apu-container-div" className="billing-history-list">
        <Loader content="Loading" active={this.state.billingHistoryLoading} />
        {this.state.billingHistoryData !== null &&
          this.state.billingHistoryData.map(listItem => {
            return <BillingHistoryItem data={listItem} csvCallback={this._fetchCSV} />
          })}
        {this.state.billingHistoryData !== null && this.state.billingHistoryData.length === 0 && (
          <h3>No Product Usage to Display.</h3>
        )}
      </div>,
    ]
  }
}

export default AccountProductUsage
