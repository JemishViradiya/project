import './Forbidden.scss'

import React from 'react'
import { Helmet } from 'react-helmet'

const Forbidden = () => [
  <Helmet key="metadata">
    <title>Forbidden</title>
  </Helmet>,
  <div className="forbidden" key="forbidden">
    <h1>403: FORBIDDEN - This is not the page you are looking for... *waves hand*</h1>
  </div>,
]

export default Forbidden
