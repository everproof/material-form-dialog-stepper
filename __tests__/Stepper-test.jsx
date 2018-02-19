import React from 'react'
import { createShallow } from 'material-ui/test-utils'

import Stepper from '../src/Stepper'

describe('<Stepper />', () => {
  let shallow

  beforeEach(() => {
    shallow = createShallow()
  })

  test('initial', () => {
    const wrapper = shallow(<Stepper steps={2} />)
      .dive()
      .dive()

    expect(wrapper.props().nextButton.props.type).toEqual('button')
  })

  test('has form', () => {
    const wrapper = shallow(<Stepper form="1" steps={2} />)
      .dive()
      .dive()

    expect(wrapper.props().nextButton.props.type).toEqual('submit')
  })

  test('submitting', () => {
    const wrapper = shallow(<Stepper form="1" steps={2} submitting />)
      .dive()
      .dive()

    expect(wrapper.props().nextButton.props.children[0]).toEqual('Saving')
    expect(wrapper.props().nextButton.props.disabled).toEqual(true)
  })

  test('has form at end', () => {
    const wrapper = shallow(<Stepper atEnd form="2" steps={2} />)
      .dive()
      .dive()

    expect(wrapper.props().nextButton.props.type).toEqual('submit')
  })

  test('says close at end of form-less steps', () => {
    const wrapper = shallow(<Stepper atEnd steps={2} />)
      .dive()
      .dive()

    expect(wrapper.props().nextButton.props.children[0]).toEqual('Close')
  })
})
