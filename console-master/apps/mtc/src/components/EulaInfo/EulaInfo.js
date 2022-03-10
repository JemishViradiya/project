import moment from 'moment'
import React from 'react'
import { Col, Row } from 'react-grid-system'

import { DATEFORMAT } from '../../constants/DateFormat'

require('./EulaInfo.scss')

const EulaInfo = props => (
  <div id={`eula-${props.data.licenseMode}-info`} className="eula-info">
    <Row>
      <Col width={10}>
        <Row>
          <Col width={12} className="eula-header">
            <h3>{props.data.licenseMode === 'production' ? 'Customer EULA' : 'Evaluation EULA'}</h3>
          </Col>
        </Row>
        <Row>
          <Col width={12} className="eula-info-container">
            <h4>EULA Version</h4>
            <p>{props.data.eulaVersion !== null ? props.data.eulaVersion : '—'}</p>
          </Col>
          <Col width={12} className="eula-info-container">
            <h4>EULA Start Date</h4>
            <p>{props.data.startDate !== null ? moment(props.data.startDate).format(DATEFORMAT.DATETIME) : '—'}</p>
          </Col>
          <Col width={12} className="eula-info-container">
            <h4>Accepted Date</h4>
            <p>{props.data.acceptedDateTime !== null ? moment(props.data.acceptedDateTime).format(DATEFORMAT.DATETIME) : '—'}</p>
          </Col>
          <Col width={12} className="eula-info-container">
            <h4>Accepted By</h4>
            <p>{props.data.acceptedUserEmail !== null ? props.data.acceptedUserEmail : '—'}</p>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
)

export default EulaInfo
