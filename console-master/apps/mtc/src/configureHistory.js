/*
    This module exports a history object for use with React Router 4. Without this history object, the React Router History is unavailable outside of React components (so you can't use it in sagas or classes Storage). The history
    object only works with the regular Router component, it won't work with BrowserRouter, HashRouter, etc.
*/

import { createHashHistory } from 'history'

export default createHashHistory()
