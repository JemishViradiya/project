import React from 'react'
import { Checkbox, Form } from 'semantic-ui-react'

require('./RadioButtons.scss')

class RadioButtons extends React.Component {
  state = {
    value: '',
  }

  handleChange = (e, { value }) => {
    this.setState({ value })
  }

  render() {
    return (
      <Form className="radio-container">
        <Form.Field>
          <Checkbox
            radio
            label={this.props.firstChoice}
            name="checkboxRadioGroup"
            value="this"
            checked={this.state.value === 'this'}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label={this.props.secondChoice}
            name="checkboxRadioGroup"
            value="that"
            checked={this.state.value === 'that'}
            onChange={this.handleChange}
          />
        </Form.Field>
      </Form>
    )
  }
}

export default RadioButtons
