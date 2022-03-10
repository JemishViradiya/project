import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BackgroundCheck } from '../../auth/state'
import useTenant from './useTenant'

const selectAuth = ({ auth }) => auth

let isShown = !document.firstElementChild.style.visibility
const ensureShownOnce = canShow => {
  if (!isShown && canShow) {
    console.log('app.FinallyShowing')
    document.firstElementChild.style = ''
    isShown = true
  }
}

export default () => {
  const { tenant } = useTenant()
  const { isAuthenticated, headless, loading, tenant: authenticatedTenant, isInitial, idpIdentity, lastAccessTime } = useSelector(
    selectAuth,
  )
  const dispatch = useDispatch()

  useEffect(() => {
    if (tenant !== authenticatedTenant) {
      dispatch(BackgroundCheck({ tenant: tenant.toLowerCase() }))
    }
  }, [tenant, authenticatedTenant, dispatch])

  // deciding to show on headless is a guess based on ~11.94 hours of max_age for eid
  const canShow = !isInitial || isAuthenticated || (headless && idpIdentity && lastAccessTime + 43000000 > Date.now())
  useEffect(() => ensureShownOnce(canShow), [canShow])

  return { isAuthenticated, loading }
}
