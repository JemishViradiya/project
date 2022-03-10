import { camelCase, kebabCase } from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'
import { withState } from 'recompose'
import { Dropdown } from 'semantic-ui-react'

require('./Tabs.scss')

const Tabs = props => {
  const { tabs, open, toggleOpen, currentTab, onClick } = props
  return (
    <ul className="tabs">
      {tabs
        .filter(tab => tab !== null)
        .map(tab => (
          <li key={camelCase(tab.alias)} tabIndex="0" aria-label="Tab Option" role="menuitem">
            {typeof tab.children === 'undefined' ? (
              <Link
                to={`${tab.url}`}
                className={`${kebabCase(tab.alias)}-tab ${window.location.hash.slice(1) === tab.url ? 'active' : ''}`}
              >
                <p>{tab.alias}</p>
              </Link>
            ) : (
              <Dropdown
                text={currentTab}
                className={window.location.hash.includes(tab.url) ? 'active' : ''}
                open={open}
                onMouseOver={() => toggleOpen(() => true)}
                onMouseLeave={() => toggleOpen(() => false)}
                options={tab.children.map(child => ({
                  value: child.alias,
                  text: child.alias,
                }))}
              >
                <Dropdown.Menu>
                  {tab.children.map(child => (
                    <Dropdown.Item key={child.alias} onClick={onClick} value={child.alias} text={child.alias}>
                      <Link activeclassname="active" to={`${child.url}`}>
                        <p>{child.alias}</p>
                      </Link>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </li>
        ))}
    </ul>
  )
}

const enhanced = withState('open', 'toggleOpen', false)

export default enhanced(Tabs)
