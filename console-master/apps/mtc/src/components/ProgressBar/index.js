import React from 'react'

import Tooltip from '@material-ui/core/Tooltip'

require('./ProgressBar.scss')

const MultiColorProgressBar = props => {
  const { data, percentageTotal } = props

  return (
    <div className={`multicolor-bar ${percentageTotal > 100 ? 'error' : ''}`}>
      <div className="bars">
        {data &&
          data.length &&
          data.map(item => {
            if (percentageTotal > 100) {
              return <div className="bar" key={item.name} />
            } else if (item.value > 0) {
              return (
                <Tooltip title={item.name} key={item.name}>
                  <div className="bar" style={{ backgroundColor: item.color, width: `${item.value}%` }}>
                    <span className="bar-text">{item.value}%</span>
                  </div>
                </Tooltip>
              )
            } else {
              return <div className="bar" key={item.name} />
            }
          })}
      </div>
    </div>
  )
}

export default MultiColorProgressBar
