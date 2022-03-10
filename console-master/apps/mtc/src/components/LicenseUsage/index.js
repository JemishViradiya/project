import React from 'react'
import { Form } from 'semantic-ui-react'

import MultiColorProgressBar from '../ProgressBar'

require('./LicenseUsage.scss')

const LicenseUsage = props => {
  const {
    allocatedName,
    allocated,
    title,
    usage,
    usage2,
    editClass,
    onChange,
    onBlur,
    name,
    error,
    hidden,
    usageName,
    usageName2,
  } = props
  const noAllocated = allocated === 0 || allocated === null
  if (noAllocated && hidden) {
    return null
  } else {
    const colorList = ['#4caf50', '#2B99DB', '#ffc304', '#FD9200']
    const data = []

    const usageCount = usage === null || typeof usage === 'undefined' ? 0 : usage
    const usageCount2 = usage2 === null || typeof usage2 === 'undefined' ? 0 : usage2
    let percentageTotal

    if (usage2) {
      data.push(
        {
          value: ((usage / allocated) * 100).toFixed(0),
          name: usageName,
          color: colorList[0],
        },
        {
          value: ((usage2 / allocated) * 100).toFixed(0),
          name: usageName2,
          color: colorList[1],
        },
      )
      percentageTotal = (((usageCount + usageCount2) / allocated) * 100).toFixed(0)
    } else {
      data.push({
        value: ((usage / allocated) * 100).toFixed(0),
        name: usageName,
        color: colorList[0],
      })
      percentageTotal = ((usageCount / allocated) * 100).toFixed(0)
    }

    return (
      <div className="license-usage">
        <div>
          <h3>{title}</h3>
          {!noAllocated && (
            <p className={`percent-used ${percentageTotal > 100 ? 'overused' : ''}`}>{percentageTotal}% licenses in use</p>
          )}
        </div>
        {!noAllocated && (
          <div>
            <MultiColorProgressBar data={data} percentageTotal={percentageTotal} />
          </div>
        )}
        <div>
          <div className="license-usage-left-column">
            <div>
              <h4>{usageName}</h4>
              <p>{usageCount}</p>
            </div>
            {usageName2 && (
              <div>
                <h4>{usageName2}</h4>
                <p>{usageCount2}</p>
              </div>
            )}
          </div>
          <div>
            <h4>{allocatedName}</h4>
            {editClass === 'form-visible' && (
              <div className={`input-container ${editClass}`}>
                <Form.Input name={name} onChange={onChange} value={allocated} min="0" onBlur={onBlur} />
                <span className={error !== '' ? 'visible-error' : ''}>{error}</span>
              </div>
            )}
            {editClass === 'form-invisible' && <p>{allocated}</p>}
          </div>
        </div>
      </div>
    )
  }
}

export default LicenseUsage
