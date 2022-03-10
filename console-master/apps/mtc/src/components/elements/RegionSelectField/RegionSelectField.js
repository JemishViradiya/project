import './RegionSelectField.scss'

import React from 'react'

import SelectField from '../SelectField'

const options = [
  {
    value: 'us',
    text: 'North America',
  },
  {
    value: 'eu',
    text: 'Europe',
  },
  {
    value: 'sp',
    text: 'South America',
  },
  {
    value: 'au',
    text: 'Australia',
  },
  {
    value: 'jp',
    text: 'Japan',
  },
  {
    value: 'gc',
    text: 'Gov Cloud',
  },
]

const RegionSelectField = ({ tabIndex, value, touched, errors, handleChange, handleBlur, mockModeAvailable, testid }) => {
  if (mockModeAvailable && typeof options.find(option => option.value === 'mock') === 'undefined') {
    options.push({
      value: 'mock',
      text: 'Mock Mode',
    })
  }
  return (
    <SelectField
      name="region"
      label="Region"
      tabIndex={tabIndex}
      value={value}
      error={touched && errors}
      touched={touched}
      handleChange={handleChange}
      handleBlur={handleBlur}
      options={options}
      testid={testid}
    />
  )
}

export default RegionSelectField
