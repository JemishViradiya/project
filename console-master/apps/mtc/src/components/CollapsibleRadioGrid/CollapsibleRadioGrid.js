import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Radio from '@material-ui/core/Radio'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

require('./CollapsibleRadioGrid.scss')

const getTestId = (identifier, modifier) => {
  if (identifier) {
    if (modifier) {
      return modifier + identifier.split(/\s/).join('-').toLowerCase()
    }
    return identifier
  }
  return undefined
}

const RadioInput = ({ checked, value, onChange, disabled, testId, hidden }) => (
  <Grid item className="radio-grid-input" xs={2}>
    {hidden ? null : (
      <Radio
        checked={checked}
        value={value}
        onChange={onChange}
        onClick={e => e.stopPropagation()}
        disabled={disabled}
        data-autoid={testId}
      />
    )}
  </Grid>
)

const RadioInputRow = ({ header, columns, currentValue, onChange, disabled, hiddenOption }) => {
  const radioInputs = []
  const category = header
  for (let i = 1; i < columns.length; i++) {
    const column = columns[i]
    const { value } = column
    const testId = getTestId([category, column.header].join(' '), 'radio-grid-input-')
    radioInputs.push(
      column.hidden ? null : (
        <RadioInput
          key={`${category}-${i}`}
          checked={currentValue === value}
          value={value}
          onChange={onChange}
          disabled={disabled}
          hidden={hiddenOption === value}
          testId={testId}
        />
      ),
    )
  }

  return (
    <div>
      <Grid container spacing={0}>
        <Grid item xs className="radio-grid-input-label">
          {category}
        </Grid>
        {radioInputs}
      </Grid>
    </div>
  )
}

const RadioGridHeader = ({ columns }) => {
  const headerColumns = columns ? (
    columns.map((col, index) => {
      if (col.hidden) {
        return null
      } else if (index === 0) {
        return (
          <Grid item key={`${col.header}-index`} xs className="radio-grid-accordion-label">
            {col.header}
          </Grid>
        )
      } else {
        const testId = getTestId(col.header, 'radio-grid-header-')
        return (
          <Grid item key={`${col.header}-index`} xs={2} className="radio-grid-header-label" data-autoid={testId}>
            {col.header}
          </Grid>
        )
      }
    })
  ) : (
    <p>No Columns Received!</p>
  )

  return (
    <Card className="accordion-header-card">
      <CardContent>
        <Grid container spacing={0}>
          {headerColumns}
        </Grid>
      </CardContent>
    </Card>
  )
}

const SelectAllRadios = ({ columns, columnValues, category, onChange, disabled }) => {
  const selectAllRadioInputs = []
  for (let i = 1; i < columns.length; i++) {
    const column = columns[i]
    const checkedAllState = columnValues.filter(value => value !== column.value).length === 0
    const testId = getTestId([category, column.header].join(' '), 'radio-grid-selectall-input-')
    selectAllRadioInputs.push(
      column.hidden ? null : (
        <RadioInput
          key={`${category}-${i}`}
          checked={checkedAllState}
          value={column.value}
          onChange={onChange}
          disabled={disabled}
          testId={testId}
        />
      ),
    )
  }
  return selectAllRadioInputs
}
class CollapsibleRadioGrid extends Component {
  state = {
    subCategories: false,
    values: [],
  }

  componentDidMount() {
    const { data } = this.props
    if (!isEmpty(data)) {
      if (Object.keys(data[0]).indexOf('subCategories') >= 0) {
        this.setState({ subCategories: true, values: data })
      } else {
        this.setState({ values: data })
      }
    }
  }

  getCurrentColVals = (category, currentVals) => {
    return currentVals.find(row => row.category === category).subCategories.map(subCategory => subCategory.value)
  }

  getCurrentVal = (category, subCategory) => {
    if (this.state.values.length > 0) {
      return this.state.subCategories
        ? this.state.values
            .find(data => data.category === category)
            .subCategories.find(nestedCategory => nestedCategory.category === subCategory).value
        : this.state.values.find(data => data.category === category).value
    } else {
      return null
    }
  }

  handleRadioChange = (row, e) => {
    const updatedValues = this.state.values.map(val => JSON.parse(JSON.stringify(val)))
    updatedValues.find(data => data.category === row.category).value = e.target.value
    this.setState(
      {
        values: updatedValues,
      },
      () => this.props.onChange(updatedValues),
    )
  }

  handleNestedRadioChange = (category, subCategory, e) => {
    const updatedValues = this.state.values.map(val => JSON.parse(JSON.stringify(val)))
    updatedValues
      .find(data => data.category === category)
      .subCategories.find(nestedCategory => nestedCategory.category === subCategory).value = e.target.value
    this.setState({ values: updatedValues }, () => this.props.onChange(updatedValues))
  }

  handleSelectAllRadioChange = (row, e) => {
    const updatedValues = this.state.values.map(val => JSON.parse(JSON.stringify(val)))
    updatedValues
      .find(data => data.category === row)
      .subCategories.forEach(subCategory => {
        Object.assign(subCategory, { value: e.target.value })
      })

    this.setState(
      {
        values: updatedValues,
      },
      () => this.props.onChange(updatedValues),
    )
  }

  render() {
    const { id, columns, data, selectAll, disabled } = this.props
    const { subCategories } = this.state
    return (
      <div data-autoid={id}>
        <RadioGridHeader columns={columns} />
        {
          // If there are subCategories, render the expandable radio grid
          subCategories ? (
            data.map(row => (
              <div key={row.category}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} className="radio-grid-accordion-header">
                    <Grid item sm={4} className="radio-grid-accordion-header">
                      {row.category}
                    </Grid>
                    {selectAll && (
                      <SelectAllRadios
                        columns={columns}
                        columnValues={this.getCurrentColVals(row.category, this.state.values)}
                        category={row.category}
                        onChange={this.handleSelectAllRadioChange.bind(this, row.category)}
                        disabled={disabled}
                      />
                    )}
                  </AccordionSummary>
                  <AccordionDetails className="radio-grid-accordion-subitem">
                    {row.subCategories.map(subCategory => (
                      <RadioInputRow
                        key={subCategory.category}
                        header={subCategory.category}
                        columns={columns}
                        currentValue={this.getCurrentVal(row.category, subCategory.category)}
                        onChange={this.handleNestedRadioChange.bind(this, row.category, subCategory.category)}
                        disabled={disabled}
                        hiddenOption={subCategory.hiddenOption}
                      />
                    ))}
                  </AccordionDetails>
                </Accordion>
              </div>
            ))
          ) : (
            // If there aren't subCategories, render a regular radio grid
            <Card>
              <CardContent>
                {data.map(row => (
                  <RadioInputRow
                    key={row.category}
                    header={row.category}
                    columns={columns}
                    currentValue={this.getCurrentVal(row.category)}
                    onChange={this.handleRadioChange.bind(this, row)}
                    disabled={disabled}
                    hiddenOption={row.hiddenOption}
                  />
                ))}
              </CardContent>
            </Card>
          )
        }
      </div>
    )
  }
}

CollapsibleRadioGrid.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      value: PropTypes.any,
      hidden: PropTypes.bool,
    }),
  ),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      value: PropTypes.any,
      hiddenOption: PropTypes.string,
      subCategories: PropTypes.arrayOf(
        PropTypes.shape({
          category: PropTypes.string.isRequired,
          value: PropTypes.any.isRequired,
          hiddenOption: PropTypes.string,
        }),
      ),
    }),
  ),
  selectAll: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
}

CollapsibleRadioGrid.defaultProps = {
  columns: [],
  data: [{}],
  onChange: null,
}

export default CollapsibleRadioGrid
