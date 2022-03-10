import React from 'react'

import centered from '@storybook/addon-centered'
import { storiesOf } from '@storybook/react'

import FilterMenu from '../FilterMenu'

const stories = storiesOf('FilterMenu', module)

stories.addDecorator(centered)

class MyComponent extends React.Component {
  state = {
    filterValue: '',
    filterMenuItems: [
      { id: '1', title: 'First One', description: 'This is the first element' },
      { id: '2', title: 'Second One', description: 'This is the second element' },
      { id: '3', title: 'Third One', description: 'This is the third element' },
      { id: '4', title: 'Fourth One', description: 'This is the fourth element' },
      { id: '5', title: 'Fifth One', description: 'This is the fifth element' },
    ],
    menuOptions: [
      { label: 'Tenant Name', value: 'Tenant Name' },
      { label: 'Date Created', value: 'Date Created' },
      { label: 'License Type', value: 'License Type' },
    ],
    selectedItem: '',
  }
  handleFilterChange = e => {
    const newMenuItem = {
      id: (this.state.filterMenuItems.length + 1).toString(),
      title: e.target.value,
      description: `This is a description for ${e.target.value}`,
    }
    const newFilterMenuItems = [...this.state.filterMenuItems]
    newFilterMenuItems.unshift(newMenuItem)
    this.setState({ filterValue: e.target.value, filterMenuItems: newFilterMenuItems })
  }

  handleItemClose = id => {
    const newFilterMenuItems = [...this.state.filterMenuItems].filter(item => item.id !== id)
    this.setState({ filterMenuItems: newFilterMenuItems })
  }

  handleItemSelection = id => {
    this.setState({ selectedItem: id })
  }

  render() {
    return (
      <FilterMenu
        filterValue={this.state.filterValue}
        onFilterChange={this.handleFilterChange}
        menuItems={this.state.filterMenuItems}
        menuOptions={this.state.menuOptions}
        onSelect={this.handleItemSelection}
        onClose={this.handleItemClose}
        selectedItemId={this.state.selectedItem}
      />
    )
  }
}

stories.add('default', () => (
  <div style={{ width: '500px', height: '300px' }}>
    <MyComponent />
  </div>
))
