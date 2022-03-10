import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

const InvalidToken = () => [
  <Helmet key="metadata">
    <title>Invalid Token</title>
  </Helmet>,
  <div id="main-container" key="invalid-token">
    <div id="invalid-token-container" className="external-page-content-container">
      <h1>Sorry, this registration link has expired...</h1>
      <p>Let&rsquo;s get you back to dry land.</p>
      <Link to="/">
        <button>Go to Multi-Tenant Console</button>
      </Link>
    </div>
  </div>,
]

export default InvalidToken
