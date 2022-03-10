import hoistNonReactStatic from 'hoist-non-react-statics'
import PropTypes from 'prop-types'
import React from 'react'

import { Context } from './Provider'

export default (Component, name = undefined) => {
  class WithPowerUpComp extends React.PureComponent {
    constructor(props, context) {
      super(props, context)
      this.childRender = ({ value: { f11n = {} } = {} }) => {
        let newProps = {}
        if (name) {
          const f11n = f11n[name]
          newProps = f11n ? { ...this.props, [name]: f11n } : this.props
        } else {
          newProps = { ...this.props, f11n }
        }
        return <Component {...newProps} ref={this.props.forwardedRef} />
      }
    }

    render() {
      return <Context.Consumer>{this.childRender}</Context.Consumer>
    }
  }
  WithPowerUpComp.propTypes = {
    forwardedRef: PropTypes.any,
  }

  const WithPowerUp = React.forwardRef((props, ref) => <WithPowerUpComp {...props} forwardedRef={ref} />)
  WithPowerUp.displayName = `WithPowerUp<${Component.displayName}>`

  return hoistNonReactStatic(WithPowerUp, Component)
}
