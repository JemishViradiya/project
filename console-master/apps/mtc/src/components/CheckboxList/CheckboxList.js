import PropTypes from 'prop-types'
import React, { Component } from 'react'

import CheckboxListView from './CheckboxListView'
// CONSIDER DEPRECATING THIS COMPONENT, IT IS ONLY USED IN ONE AREA
require('./CheckboxList.scss')

class CheckboxList extends Component {
  state = {
    selected: {},
    initialSelected: [],
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options && Object.keys(this.state.selected).length === 0) {
      const selectedObject = {}
      Object.keys(nextProps.options).forEach(key => {
        selectedObject[key] = []
      })
      this.setState({ selected: selectedObject }, () => this.reconcileSelected())
    }
    if (nextProps.selected && nextProps.selected.length > 0 && !this.props.selected) {
      this.setState({ initialSelected: nextProps.selected }, () => this.reconcileSelected())
    }
  }

  reconcileSelected = () => {
    if (this.state.initialSelected.length > 0 && Object.keys(this.state.selected).length > 0) {
      this.state.initialSelected.forEach(id => {
        const headerKey = Object.keys(this.props.options).find(key => {
          return this.props.options[key].find(element => element.id === id)
        })
        this.handleChange(
          {
            name: id,
          },
          headerKey,
        )
      })
    }
  }

  handleChange = (obj, headerKey) => {
    const selected = this.toggle(obj, headerKey)
    this.setState({ selected }, this.updateParent)
  }

  updateParent = () => {
    this.props.onChange(
      this.props.fieldId,
      Object.values(this.state.selected).reduce((a, b) => a.concat(b), []),
    )
  }

  toggle = (obj, headerKey, state = null) => {
    const id = obj.name
    const selected = state === null ? { ...this.state.selected } : state
    let keyArray = selected[headerKey]
    if (keyArray.indexOf(id) !== -1) {
      keyArray = keyArray.filter(val => val !== id)
    } else {
      keyArray.push(id)
    }
    selected[headerKey] = keyArray

    return selected
  }

  toggleBatch = collection => {
    let selected = { ...this.state.selected }

    collection.forEach(item => {
      selected = this.toggle(item.obj, item.headerKey, selected)
    })

    this.setState({ selected }, this.updateParent)
  }

  mapSelected = options => {
    return options.map(option => ({
      obj: {
        name: option.id,
      },
      headerKey,
    }))
  }

  handleHeaderChange = (obj, headerKey) => {
    if (this.state.selected[headerKey].length === this.props.options[headerKey].length) {
      // all selected
      const selected = this.state.selected[headerKey].map(value => ({
        obj: {
          name: value,
        },
        headerKey,
      }))
      this.toggleBatch(selected)
    } else if (this.state.selected[headerKey].length === 0) {
      // none selected
      const selected = this.mapSelected(this.props.options[headerKey])
      this.toggleBatch(selected)
    } else {
      // IN DURR TURMINATOR
      const optionsToToggle = this.props.options[headerKey].filter(option => {
        return this.state.selected[headerKey].indexOf(option.id) === -1
      })
      const selected = this.mapSelected(optionsToToggle)
      this.toggleBatch(selected)
    }
  }

  render() {
    const { options } = this.props
    return (
      <CheckboxListView
        options={options}
        selected={this.state.selected}
        onChange={this.handleChange}
        onHeaderChange={this.handleHeaderChange}
      />
    )
  }
}

CheckboxList.propTypes = {
  options: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))),
  values: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  fieldId: PropTypes.string,
}

CheckboxList.defaultProps = {
  options: [],
  values: [],
}

export default CheckboxList
