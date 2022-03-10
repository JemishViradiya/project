class LaunchDarklyService {
  static setUser(ldClient, userId, userRegion) {
    const ldCurrentUser = ldClient.getUser()
    if (ldCurrentUser.key !== userId) {
      const user = {
        key: userId,
        custom: {
          region: userRegion,
        },
      }
      ldClient.identify(user)
    }
  }
}

export default LaunchDarklyService
