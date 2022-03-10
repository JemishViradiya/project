import React from 'react'
import { Col, Row } from 'react-grid-system'
import { Dimmer, Loader, Segment } from 'semantic-ui-react'

require('./ProfileInfo.scss')

const ProfileInfo = props => (
  <div id="profile-info">
    <Row>
      <Col md={12}>
        <div className="card">
          <Dimmer.Dimmable as={Segment} dimmed={props.requestInProcess}>
            <Dimmer inverted active={props.requestInProcess}>
              <Loader inverted content="Loading..." />
            </Dimmer>
            <Row>
              <Col md={12}>
                <h3>My Profile</h3>
              </Col>
            </Row>
            <Row className="info-row">
              <Col md={2}>Partner Account</Col>
              <Col md={8}>{props.model.partnerName}</Col>
            </Row>
            <Row className="info-row">
              <Col md={2}>Partner User</Col>
              <Col md={8}>{props.model.userName}</Col>
            </Row>
            <Row className="info-row">
              <Col md={2}>Role</Col>
              <Col md={8}>{props.model.roleName}</Col>
            </Row>
            <Row className="info-row">
              <Col md={2}>Email</Col>
              <Col md={8}>{props.model.email}</Col>
            </Row>
          </Dimmer.Dimmable>
        </div>
      </Col>
    </Row>
  </div>
)

export default ProfileInfo
