import './NotFound.scss'

import React from 'react'
import { Helmet } from 'react-helmet'

const NotFound = props => [
  <Helmet key="metadata">
    <title>Page Not Found</title>
  </Helmet>,
  <div className="notfound-container" key="not-found">
    <div className="notfound-box">
      <div className="notfound-svg" />
      <h3>Oops, we can&apos;t find this page...</h3>
      <p>Sorry about that, let&apos;s head back instead</p>
      <button className="ui primary button" onClick={() => props.history.push('/')}>
        Go back to Multi-Tenant Console
      </button>
    </div>
  </div>,
]

export default NotFound
