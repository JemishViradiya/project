import React from 'react'
import { Helmet } from 'react-helmet'

import PageHeader from '../../../components/PageHeader'
import MaterialTabs from '../../../components/Tabs/MaterialTabs'
import { AuthAPI } from '../../../services/api'
import ProfileInfoContainer from './ProfileInfoContainer'
import ProfilePasswordContainer from './ProfilePasswordContainer'

class Profile extends React.Component {
  state = {
    tabs: [
      {
        url: '/profile',
        alias: 'My Profile',
      },
    ],
  }

  render() {
    return [
      <Helmet key="metadata">
        <title>My Profile Page</title>
      </Helmet>,
      <div id="main-container" key="profile">
        <PageHeader>
          <MaterialTabs tabs={this.state.tabs} />
        </PageHeader>
        <div>
          <ProfileInfoContainer getProfile={AuthAPI.getUserProfileById} />
          <ProfilePasswordContainer />
        </div>
      </div>,
    ]
  }
}

export default Profile
