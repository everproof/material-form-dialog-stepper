import React from 'react'
import { createShallow } from 'material-ui/test-utils'

import Stepper from '../src/Stepper'

describe('<Stepper />', () => {
  let shallow

  beforeEach(() => {
    shallow = createShallow()
  })

  test('initial', () => {
    const wrapper = shallow(<Stepper />)
      .dive()
      .dive()

    expect(wrapper.props().nextButton.props.type).toEqual('button')
  })

  test('has form', () => {
    const wrapper = shallow(<Stepper form="1" />)
      .dive()
      .dive()

    expect(wrapper.props().nextButton.props.type).toEqual('submit')
  })

  test('has form at end', () => {
    const wrapper = shallow(<Stepper atEnd form="2" />)
      .dive()
      .dive()

    expect(wrapper.props().nextButton.props.type).toEqual('submit')
  })
})
