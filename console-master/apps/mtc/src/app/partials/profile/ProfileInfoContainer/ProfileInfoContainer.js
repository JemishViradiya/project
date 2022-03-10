import React, { Component } from 'react'

import ProfileInfo from '../../../../components/ProfileInfo'
import Storage from '../../../../Storage'

class ProfileInfoContainer extends Component {
  state = {
    model: {
      partnerName: '',
      userName: '',
      roleName: '',
      email: '',
    },
  }

  componentDidMount() {
    const userId = Storage.getUserId()
    this.setState({ requestInProcess: true })
    this.props
      .getProfile(userId)
      .then(userProfileResponse => {
        this.setState({
          requestInProcess: false,
          model: {
            partnerName: userProfileResponse.data.partnerName,
            userName: `${userProfileResponse.data.firstName} ${userProfileResponse.data.lastName}`,
            roleName: userProfileResponse.data.roleName,
            email: userProfileResponse.data.email,
          },
        })
      })
      .catch(() => {
        // this.props.logger.logError('GET Profile Info Failed', error);
        this.setState({
          requestInProcess: false,
        })
      })
  }

  render() {
    return <ProfileInfo model={this.state.model} requestInProcess={this.state.requestInProcess} />
  }
}

export default ProfileInfoContainer
