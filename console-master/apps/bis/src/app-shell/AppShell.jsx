import React, { memo, Suspense, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import SideNav from '../components/nav/SideNav'
import Notification from '../components/Notification'
import Loading from '../components/util/Loading'
import loadingStyles from '../components/util/Loading.module.less'
import TopBar from '../components/widgets/TopNavBar'
import styles from './AppShell.module.less'

const viewClass = `${styles.view} ${loadingStyles.loadingAbsoluteParent}`

const hideNavBarPaths = ['/settings/general']

const AppShell = memo(({ children, ...props }) => {
  const location = useLocation()
  const [showNavBar, setShowNavBar] = useState(null)

  useEffect(() => {
    setShowNavBar(!hideNavBarPaths.includes(location.pathname))
  }, [location.pathname, showNavBar])

  return (
    <>
      <div className={viewClass} {...props}>
        <SideNav className={styles.sideNav}>
          <main className={styles.content}>
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </main>
        </SideNav>
      </div>
      {showNavBar && (
        <div className={styles.topNavBar}>
          <TopBar />
        </div>
      )}
      <Notification />
    </>
  )
})

export default AppShell
