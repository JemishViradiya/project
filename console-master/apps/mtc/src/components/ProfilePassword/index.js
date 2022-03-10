import React from 'react'
import { Col, Row } from 'react-grid-system'
import { Dimmer, Form, Loader } from 'semantic-ui-react'

import PasswordStrengthIndicator from '../elements/PasswordStrengthIndicator'

require('./ProfilePassword.scss')

const ProfilePassword = props => (
  <div id="profile-password">
    <Row>
      <Col md={12}>
        <div className="card">
          <Row>
            <Col md={6}>
              <Form id="profile-password-form">
                <Dimmer active={props.loading} inverted>
                  <Loader inverted content="Setting..." />
                </Dimmer>
                <Row className="form-row">
                  <Col md={12}>
                    <h3>Update Password</h3>
                  </Col>
                </Row>
                <Row className="form-row">
                  <Col md={12}>
                    <div className="input-container">
                      <Form.Input
                        placeholder="********"
                        name="currentPassword"
                        onChange={props.passwordChangedCallback}
                        label="Current Password"
                        type="password"
                        autoComplete="off"
                        id="profile-password-form-current-password"
                      />
                    </div>
                  </Col>
                </Row>
                <Row className="form-row">
                  <Col md={12}>
                    <div className="input-container">
                      <Form.Input
                        placeholder="********"
                        name="newPassword"
                        onChange={props.newPasswordChangedCallback}
                        label="New Password"
                        type="password"
                        autoComplete="off"
                        id="profile-password-form-new-password"
                      />
                    </div>
                  </Col>
                </Row>
                <Row className="form-row">
                  <Col md={12}>
                    <div className="input-container">
                      <input
                        type="submit"
                        id="profile-password-form-submit"
                        value="Update Password"
                        onClick={props.passwordSubmittedCallback}
                        disabled={!props.isValid || props.loading}
                      />
                    </div>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col md={6}>
              <PasswordStrengthIndicator validation={props.passwordValidation} />
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  </div>
)

export default ProfilePassword
