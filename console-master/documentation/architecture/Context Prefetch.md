## Session context prefetch (features/services)

## Browser Flow:

- Try to prefetch context with call to SW /uc/session-context
  If SW is not yet registered => response 404
  If SW registered but has no session => empty response
  If SW registered and has session => return response with combined features/services content

- FeaturizationProvider checks prefetched result and gets features (same for servces)
  If prefetch failed or empty make api call

## SW Flow:

- Register /uc/session-context endpoint to handle prefetch calls
  On incomming request try to get accessToken/tenant from current session
  Make api calls with creds for current session to populate response
  Populate cache for features and services

- On session loaded event trigger session context cache update
