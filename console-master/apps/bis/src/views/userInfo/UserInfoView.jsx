import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import MapSplitter from '../../list/MapSplitter'
import EventListProvider, { EventListContext } from '../../providers/EventListProvider'
import { default as RiskEngineSettingsProvider } from '../../providers/RiskEngineSettingsProvider'
import { Context } from '../../providers/StateProvider'
import UserRiskEventProvider, { Context as UserInfoContext } from '../../providers/UserRiskEventProvider'
import { Loading } from '../../shared'
import EventList from '../events/EventList'
import UserInfoClusterMap from './UserInfoClusterMap'
import UserInfoDetails from './UserInfoDetails'
import styles from './UserInfoView.module.less'

const INITIAL_FETCH_SIZE = 25

const UserInfoViewComponents = ({ userInfoVariables, setSortState }) => {
  const [highlightEvent, setHighlightEvent] = useState()
  const [selectedEvent, setSelectedEvent] = useState()
  const { t } = useTranslation()
  const onHighlightChanged = setHighlightEvent
  const onRiskEventSelected = useCallback(selected => setSelectedEvent(selected), [setSelectedEvent])

  const listPayload = useContext(EventListContext)
  const userPayload = useContext(UserInfoContext)

  const { error: listError, data: riskEvents } = listPayload
  const { error: userError, data: { userInfo } = {} } = userPayload
  if (listError || userError) {
    // FIXME: report error to UI if needed in future.
    console.log('Error when fetching user risk events: ', listError || userError)
  }

  const selectionState = useMemo(() => (selectedEvent ? { selected: { [selectedEvent.id]: selectedEvent } } : undefined), [
    selectedEvent,
  ])

  const hasRiskEvents = riskEvents && riskEvents.length > 0
  let focusedEvent = selectedEvent
  const outOfScope = false
  if (hasRiskEvents) {
    // outOfScope = !!(focusedEvent && !riskEvents.find(ev => ev.id === focusedEvent.id))
    if (!focusedEvent || outOfScope) {
      focusedEvent = riskEvents[0]
      // Simulate an event selection.
      setTimeout(() => {
        onRiskEventSelected(focusedEvent)
      }, 10)
    }
  } else {
    focusedEvent = undefined
  }

  const makeInfoView = useCallback(
    ({ infoRef }) => (
      <UserInfoDetails
        onHighlightChanged={onHighlightChanged}
        onRiskEventSelected={onRiskEventSelected}
        range={userInfoVariables.range}
        userId={userInfoVariables.userId}
        userInfo={userInfo}
        selectedEvent={focusedEvent && focusedEvent.rowData ? focusedEvent.rowData : focusedEvent}
        highlightEvent={highlightEvent}
        ref={infoRef}
        list={
          <EventList
            noCounter
            onSort={setSortState}
            onRowClick={onRiskEventSelected}
            selectionState={selectionState}
            // TODO: previous feature support
            // onHighlightChanged={onHighlightChanged}
            // onRiskEventSelected={onRiskEventSelected}
            // highlightEvent={highlightEvent}
            // riskEvents={riskEvents}
            // selectedEvent={selectedEvent}
            className={styles.list}
          />
        }
      />
    ),
    [
      focusedEvent,
      highlightEvent,
      onHighlightChanged,
      onRiskEventSelected,
      selectionState,
      setSortState,
      userInfo,
      userInfoVariables.range,
      userInfoVariables.userId,
    ],
  )

  const makeMap = useCallback(
    mapRef => {
      if (hasRiskEvents) {
        return (
          <UserInfoClusterMap
            variables={userInfoVariables}
            // TODO: previous feature support
            // onHighlightChanged={onHighlightChanged}
            // highlightEvent={highlightEvent}
            selectedEvent={focusedEvent && focusedEvent.rowData ? focusedEvent.rowData : focusedEvent}
            onEventSelected={onRiskEventSelected}
            ref={mapRef}
          />
        )
      }
      return <div className={styles.noMap}>{t('usersEvents.noRiskEvent')}</div>
    },
    [focusedEvent, hasRiskEvents, onRiskEventSelected, t, userInfoVariables],
  )

  if (!riskEvents || listError || !userInfo) {
    return <Loading />
  }

  return (
    <MapSplitter showMap primaryMinSize={340} secondaryMinSize={0} className={styles.mapSplitter}>
      {makeInfoView}
      {makeMap}
    </MapSplitter>
  )
}

const UserInfoView = memo(({ userId }) => {
  const { currentTimePeriod: range } = useContext(Context)

  const [sortState, setSortState] = useState(() => ({
    sortBy: 'datetime',
    sortDirection: 'ASC',
  }))

  const eventListVariables = useMemo(() => {
    return { ...sortState, size: INITIAL_FETCH_SIZE, offset: 0, range, userIds: [userId] }
  }, [range, userId, sortState])
  const userInfoVariables = useMemo(() => ({ range, userId }), [range, userId])

  return (
    <UserRiskEventProvider variables={userInfoVariables}>
      <EventListProvider variables={eventListVariables}>
        <RiskEngineSettingsProvider>
          <UserInfoViewComponents userInfoVariables={userInfoVariables} setSortState={setSortState} />
        </RiskEngineSettingsProvider>
      </EventListProvider>
    </UserRiskEventProvider>
  )
})

UserInfoView.propTypes = {
  userId: PropTypes.string,
}
UserInfoView.displayName = 'UserInfoView'

export default UserInfoView
