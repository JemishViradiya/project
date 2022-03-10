# Browser Sessions for Daedalus

## Console Load Flow

### 1. Session State Initialization

executed when pages load in the browser from

- ues-nav injected into venue
- ues-console session provider
- login/logout flow completion views

```mermaid
sequenceDiagram
	autonumber
	participant Browser as Browser Tab
  participant SwLifecycle as SW: Lifecycle
  participant SwSession as SW: Session

  Note over SwLifecycle: Browser Service Worker

  ## 0.  Registration
  Browser->>SwLifecycle: new SwLifecycle( /sw.js )
  activate SwLifecycle

  alt not up to date
    Note over SwLifecycle: Install
    alt existing service worker
      SwLifecycle->>SwLifecycle: Fetch session state from previous SwLifecycle
    end
    SwLifecycle->>Browser: ClaimClients(to all tabs)
  end

  Note over SwLifecycle: Activate
  SwLifecycle->>Browser: Registration()
  deactivate SwLifecycle

  ## 0.  Request Session
  Browser->>SwSession: GET /uc/session/eid
  # activate SwSession
  # Note over SwLifecycle: Default behaviour

  SwSession->>Browser: No active session | Active session data
```

### 2. **SSO Flow**

used for Local User and External IDP flows when there is _no active session_

```mermaid
sequenceDiagram
	autonumber
	participant Browser as Browser Tab
  participant Iframe as Browser Tab: SSO Iframe
  participant SwSession as SW: Session
	participant SessionMgr as Session Manager

  Note over Browser,SwSession: IFrame SSO
  SwSession->>Browser: No active session

  Browser->>Iframe: SSO
  activate Iframe
  Iframe->>SwSession: Start or Re-Use Existing SSO Flow
  activate SwSession
  SwSession->>SwSession: get existing EID IdToken if present
  SwSession->>SessionMgr: GET /uc/session/sso?id_token_hint={EID IdToken}
  activate SessionMgr
  Note over SessionMgr: EID prompt=none SSO Flow
  SessionMgr->>Iframe: {EID JWT, Venue JWT} | {failure}
  deactivate SessionMgr

  Note over Iframe: Initialize SW Lifecycle
  Iframe->>SwSession: {...payload}
  activate SwSession
  alt Login Failure
    Note over SwSession: Clear In-Memory DB
    SwSession--xBrowser: Session.StateChange(login-failure)

  else Login Success
    Note over SwSession: Save to In-Memory DB
    SwSession->>Browser: Session.StateChange(login-success)
  end

  Note over SwSession: Broadcast to other tabs
  SwSession--xIframe: complete
  deactivate Iframe
  deactivate SwSession

  deactivate SwSession
```

### 3. **Local User Login Flow**

used for Local User flow when _sso fails_

```mermaid
sequenceDiagram
	autonumber
	participant Browser as Browser Tab
  participant Popup as Browser Popup
  participant SwSession as SW: Session
  participant VenueUI as Venue (Login Service)
	participant SessionMgr as Session Manager

  note over Browser: From login.cylance.com
  Browser->>VenueUI: login.cylance.com?RedirectUri={}
  activate VenueUI
  note over VenueUI: Local-user email address

  Browser->>Popup: Popup: Login
  activate Popup
  Popup->>SessionMgr: GET /uc/session/login {UserAssertion JWT}
  activate SessionMgr
  Note over SessionMgr: EID display=prompt Login Flow
  SessionMgr->>Popup: {EID JWT, Venue JWT} | {failure}
  deactivate SessionMgr

  Note over Popup: Initialize SW Lifecycle
  Popup->>SwSession: {...payload}
  activate SwSession
  alt Login Failure
    Note over SwSession: Clear In-Memory DB
    SwSession--xBrowser: opener.postMessage(login-failure)

  else Login Success
    Note over SwSession: Save to In-Memory DB
    SwSession->>Browser: opener.postMessage(login-success)
  end

  Note over SwSession: Broadcast to other tabs
  deactivate SwSession

  Popup->>Browser: close
  deactivate Popup

  note over Browser: Redirect to protect.cylance.com/{RedirectUri}
  deactivate VenueUI

```

### 3. **External IDP and Ghost Login Flow**

used for External IDP flow when _sso fails_ and Ghost Login flow from MTC

```mermaid
sequenceDiagram
	autonumber
	participant Browser as Browser Tab
  participant SwSession as SW: Session
  participant VenueUI as Venue (monolith)
	participant SessionMgr as Session Manager

  note over Browser: From login.cylance.com

  alt External IDP Flow
    Browser->>VenueUI: login.cylance.com?RedirectUri={}
    activate VenueUI
    note over VenueUI: External-IDP email address
  end
  VenueUI->>Browser: {User Assertion}
  deactivate VenueUI

  note over Browser: Redirect to Session Manager
  activate Browser
  Browser->>SessionMgr: GET /uc/session/login {UserAssertion JWT}
  activate SessionMgr
  Note over SessionMgr: EID Login Flow
  SessionMgr->>Browser: {EID JWT, Venue JWT} | {failure}
  deactivate SessionMgr

  Note over Browser: Initialize SW Lifecycle
  Browser->>SwSession: {...payload}
  activate SwSession
  alt Login Failure
    Note over SwSession: Clear In-Memory DB
    SwSession--xBrowser: opener.postMessage(login-failure)

  else Login Success
    Note over SwSession: Save to In-Memory DB
    SwSession->>Browser: opener.postMessage(login-success)
  end

  Note over SwSession: Broadcast to other tabs
  deactivate SwSession

  note over Browser: Redirect to protect.cylance.com/{RedirectUri}
  deactivate Browser
```

## Logout Flow

```mermaid
sequenceDiagram
	autonumber
	participant Browser as Browser Tab
  participant SwSession as SW: Session
  participant VenueUI as Venue (monolith)
	participant SessionMgr as Session Manager

  Browser->>VenueUI: /Account/LogOff?idTokenHint={EID IdToken}
  activate VenueUI

  alt not an EID-bound session
    Note over VenueUI: Clear session
    VenueUI--xBrowser: {Clear-Cookie, Redirect to Cylance Login}
  end

  VenueUI->>Browser: {Clear-Cookie, Redirect to Session Manager}
  #deactivate SwSession
  deactivate VenueUI
  activate Browser

  Browser->>SessionMgr: Logout?id_token_hint={EID IdToken}
  activate SessionMgr
  SessionMgr->>Browser: render logout template { logoutUrl}
  deactivate SessionMgr

  Browser->>SwSession: Clear Session

  activate SwSession
  note over SwSession: Clear In-Memory DB
  SwSession->>Browser: EID IdToken if present
  deactivate SwSession

  alt No EID IdToken
    Browser--xBrowser: Redirect to Cylance Login
  end

  deactivate Browser

  Browser->>Eid: Logout
  activate Eid
  Eid->>Browser: Redirect to Cylance Login
  deactivate Eid

```
