import React from 'react'

import { yellow } from '@material-ui/core/colors'
import Tooltip from '@material-ui/core/Tooltip'
import Warning from '@material-ui/icons/Warning'

import Button from '../../../Button'

require('./RetryProvisioningCell.scss')

class RetryProvisioningCell extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      retrying: false,
    }
  }

  handleRetry = () => {
    if (this.state.retrying) {
      return
    }
    this.setState({ retrying: true })
    this.props.callback(this.props.row.row.id)
  }

  render() {
    const { row } = this.props
    return (
      <span className="retry-provisioning-cell">
        <Tooltip title={row.value}>
          <Warning className="warning-icon" style={{ color: yellow[700] }} />
        </Tooltip>
        &nbsp;&nbsp;
        <Button className="button" onClick={this.handleRetry} disabled={this.state.retrying}>
          {this.state.retrying ? 'Retrying...' : 'Retry'}
        </Button>
      </span>
    )
  }
}

export default RetryProvisioningCell
