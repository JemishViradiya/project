import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'

import Storage from '../../Storage'

class LanguageSelect extends Component {
  state = {
    currentLanguage: 'en',
    options: [
      { key: 'en', value: 'en', text: 'English' },
      { key: 'es', value: 'es', text: 'Spanish' },
    ],
  }

  componentDidMount() {
    const storedLanguage = Storage.getLanguage()
    if (storedLanguage !== null) {
      this.setState({
        currentLanguage: storedLanguage,
      })
    }
  }

  _handleChange = (event, data) => {
    const newLanguage = data.value
    if (newLanguage !== this.state.currentLanguage) {
      this.setState(
        {
          currentLanguage: newLanguage,
        },
        () => {
          Storage.setLanguage(newLanguage)
        },
      )
    }
  }

  render() {
    return (
      <div className="language-select" name="language-select">
        <Dropdown
          id="language-dropdown"
          options={this.state.options}
          onChange={this._handleChange}
          defaultValue={this.state.currentLanguage}
        />
      </div>
    )
  }
}

export default LanguageSelect
