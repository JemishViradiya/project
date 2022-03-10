/* eslint-disable @typescript-eslint/no-var-requires */
const React = require('react')
const { chain } = require('lodash-es')

const UesIcons = require('@ues/assets/src/icons/icons-index')
const CylanceIcons = require('@ues/assets/src/icons/cylance')
const UesLogos = require('@ues/assets/src/icons/logos-index')

const iconSizesStyles = {
  maxWidth: '225px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const renderIconSizes = ({ icon: Icon, id }) => {
  return (
    <div style={iconSizesStyles}>
      <Icon titleAccess={id} fontSize="small" />
      <Icon titleAccess={id} />
      <Icon titleAccess={id} fontSize="large" />
      <Icon titleAccess={id} style={{ fontSize: 40 }} />
      <Icon titleAccess={id} style={{ fontSize: 56 }} />
      <code
        style={{
          fontSize: 10,
          padding: '4.5px 10px',
          marginLeft: 16,
          whiteSpace: 'nowrap',
          border: '1px solid rgba(128,128,128,0.33)',
          borderRadius: 3,
        }}
      >
        {id}
      </code>
    </div>
  )
}

const renderIconSet = iconData => {
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {iconData.map(iconObject => (
        <div key={iconObject.id}>{renderIconSizes(iconObject)}</div>
      ))}
    </>
  )
}

const CylanceRenamedIcons = Object.entries(CylanceIcons).reduce((agg, [key, value]) => {
  agg[`Cylance${key}`] = value
  return agg
}, {})
const Icons = { ...UesIcons, ...UesLogos, ...CylanceRenamedIcons }
const ReactIcons = Object.keys(Icons).filter(key => /^[A-Z]/.test(key))
const Stories = chain(ReactIcons)
  .groupBy(key => key[0] + key.split(/[A-Z]/)[1])
  .mapValues(iconNames => {
    const iconSet = iconNames.map(id => ({
      id,
      icon: Icons[id],
    }))
    return () => renderIconSet(iconSet)
  })
  .value()

Stories.default = {
  title: 'Icons',
}

module.exports = Stories
