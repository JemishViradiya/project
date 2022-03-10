import PropTypes from 'prop-types'
import React, { memo } from 'react'

import AvatarUnknownUser from '../static/icons/AvatarUnknownUser.svg'
import styles from './Avatar.module.less'
import { Icon } from './icons/Icon'

const Avatar = memo(({ userInfo }) => {
  if (userInfo.avatar) {
    return <img className={styles.avatar} alt="avatar" src={userInfo.avatar} />
  } else {
    let nameAbbr = ''
    if (userInfo.givenName) {
      nameAbbr = userInfo.givenName[0]
    }
    if (userInfo.familyName) {
      nameAbbr = `${nameAbbr}${userInfo.familyName[0]}`
    }
    if (!nameAbbr && userInfo.username) {
      nameAbbr = userInfo.username[0]
    }
    if (nameAbbr) {
      return <div className={styles.avatar}>{nameAbbr.toUpperCase()}</div>
    }
    return <Icon isOldStaticIcon icon={AvatarUnknownUser} className={styles.avatar} />
  }
})

Avatar.displayName = 'Avatar'
Avatar.propTypes = {
  userInfo: PropTypes.shape({
    avatar: PropTypes.string,
    givenName: PropTypes.string,
    familyName: PropTypes.string,
  }).isRequired,
}

export default Avatar
