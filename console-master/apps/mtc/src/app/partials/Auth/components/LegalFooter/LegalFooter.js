import './LegalFooter.scss'

import moment from 'moment'
import React from 'react'

const LegalFooter = () => (
  <div className="legal-footer">
    <p>&copy; {moment().year()} Cylance. All rights reserved.</p>
  </div>
)

export default LegalFooter
