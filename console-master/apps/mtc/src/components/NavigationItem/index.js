import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown } from 'semantic-ui-react'

import history from '../../configureHistory'

require('./NavigationItem.scss')

class NavigationItem extends Component {
  state = {
    toggleClass: false,
  }

  _handleMouseOver = () => {
    this.setState({
      toggleClass: true,
    })
  }

  _handleMouseLeave = () => {
    this.setState({
      toggleClass: false,
    })
  }

  _handleClick = () => {
    history.push(this.props.path)
  }

  render() {
    let activeClass = ''
    if (window.location.hash.startsWith(`#${this.props.path}`)) {
      activeClass = 'active-link'
    }
    return (
      <Dropdown
        id={`nav-${this.props.class}-dropdown`}
        className={`nav-dropdown ${this.state.toggleClass ? 'toggle-open' : 'toggle-close'} ${activeClass}`}
        onMouseOver={this._handleMouseOver}
        onMouseLeave={this._handleMouseLeave}
        trigger={
          <Link to={this.props.path}>
            <span className={this.props.icon} />
          </Link>
        }
        onClick={this._handleClick}
        open
      >
        <Dropdown.Menu>
          <Dropdown.Item>
            <Link to={this.props.path}>{this.props.text}</Link>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

export default NavigationItem
