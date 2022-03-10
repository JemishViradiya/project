import { mount } from 'enzyme'
import React from 'react'

import CheckList from './'

describe('<CheckList />', () => {
  const data = [
    {
      label: 'Thing 1',
      accessor: '1',
      value: false,
    },
    {
      label: 'Thing 2',
      accessor: '2',
      value: false,
    },
    {
      label: 'Thing 3',
      accessor: '3',
      value: false,
    },
    {
      label: 'Thing 4',
      accessor: '4',
      value: false,
    },
  ]

  xit('Should render without props', () => {
    const wrapper = mount(<CheckList />)
    expect(wrapper.find('p')).to.have.length(1)
  })

  xit('Should render a checklist', () => {
    const wrapper = mount(<CheckList data={data} />)
    expect(wrapper.find('Checkbox')).to.have.length(4)
  })

  xit('Should track which items are checked', () => {
    const wrapper = mount(<CheckList data={data} />)
    wrapper.find('Checkbox').first().simulate('click')
    expect(wrapper.find('input[type="checkbox"]').first().props().checked).to.equal(true)
  })

  xit('Should render a check all box when passed selectAll prop', () => {
    const wrapper = mount(<CheckList data={data} selectAll />)
    expect(wrapper.find('ListItemText').first().props().primary).to.equal('Select All')
  })

  xit('Should render a filter when passed a filter prop', () => {
    const wrapper = mount(<CheckList data={data} filter />)
    expect(wrapper.find('CheckListFilter')).to.have.length(1)
  })

  xit('Should render horizontal dividers between elements when passed a dividers prop', () => {
    const wrapper = mount(<CheckList data={data} dividers />)
    expect(wrapper.find('hr')).to.have.length(4)
  })
})
