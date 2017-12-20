import React from 'react'
import { createMount, createShallow } from 'material-ui/test-utils'
import configureStore from 'redux-mock-store'

import DialogStepper from '../src'

const mockStore = configureStore()

describe('<DialogStepper />', () => {
  let mount
  let shallow

  beforeEach(() => {
    mount = createMount()
    shallow = createShallow()
  })

  afterEach(() => {
    mount.cleanUp()
  })

  test('componentWillReceiveProps', () => {
    const children = [<form key="1" />, <form key="2" />]
    const wrapper = shallow(
      <DialogStepper forms={['1', '2']} subheadings={[]} store={mockStore()}>
        {children}
      </DialogStepper>,
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()

    wrapper.setProps({ children, open: true })
    expect(wrapper.state('activeStep')).toBe(0)

    wrapper.setProps({ children, open: true, submitting: true })
    expect(wrapper.state('activeStep')).toBe(0)

    wrapper.setProps({
      children,
      open: true,
      submitSucceeded: true,
      submitting: false,
    })
    expect(wrapper.state('activeStep')).toBe(1)

    wrapper.setProps({
      children,
      open: true,
      submitSucceeded: true,
      submitting: false,
    })
    expect(wrapper.state('activeStep')).toBe(1)

    wrapper.setProps({ children, open: true, submitting: true })
    expect(wrapper.state('activeStep')).toBe(1)

    wrapper.setProps({
      children,
      open: true,
      submitSucceeded: true,
      submitting: false,
    })
    expect(wrapper.state('activeStep')).toBe(1)

    wrapper.setProps({
      children,
      open: true,
      submitSucceeded: true,
      submitting: false,
    })
    expect(wrapper.state('activeStep')).toBe(1)
  })

  test('handleBack from start', () => {
    const children = [<form key="1" />, <form key="2" />]
    const wrapper = shallow(
      <DialogStepper
        forms={['1', '2']}
        onClose={() => {}}
        open
        subheadings={[]}
        store={mockStore()}
      >
        {children}
      </DialogStepper>,
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()

    wrapper.instance().handleBack()
    expect(wrapper.state('activeStep')).toBe(0)
  })

  test('handleNext from start, then handleNext to close', () => {
    const children = [<div key="1" />, <div key="2" />]
    const wrapper = shallow(
      <DialogStepper open subheadings={[]} store={mockStore()}>
        {children}
      </DialogStepper>,
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()

    wrapper.instance().handleNext()
    expect(wrapper.state('activeStep')).toBe(1)

    wrapper.instance().handleNext()
    expect(wrapper.state('activeStep')).toBe(1)
  })

  test('handleNext from start, then handleBack', () => {
    const children = [<div key="1" />, <div key="2" />]
    const wrapper = shallow(
      <DialogStepper open subheadings={[]} store={mockStore()}>
        {children}
      </DialogStepper>,
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()

    wrapper.instance().handleNext()
    expect(wrapper.state('activeStep')).toBe(1)

    wrapper.instance().handleBack()
    expect(wrapper.state('activeStep')).toBe(0)
  })

  test('handleNext to submit', () => {
    const children = [<form key="1" />, <form key="2" />]
    const wrapper = shallow(
      <DialogStepper
        forms={['1', '2']}
        open
        subheadings={[]}
        store={mockStore()}
      >
        {children}
      </DialogStepper>,
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()

    wrapper.instance().handleNext()
    expect(wrapper.state('activeStep')).toBe(0) // would nav when form finishes submitting
  })

  test('mount', () => {
    const children = [<div key="1" />, <div key="2" />]
    const wrapper = mount(
      <DialogStepper
        open
        subheadingAlign={() => 'left'}
        subheadings={[]}
        store={mockStore()}
      >
        {children}
      </DialogStepper>,
    )

    expect(wrapper.length).toBe(1)
  })

  test('mount fullScreen', () => {
    const children = [<div key="1" />, <div key="2" />]
    const wrapper = mount(
      <DialogStepper
        fullScreen
        open
        subheadingAlign={() => 'left'}
        subheadings={[]}
        store={mockStore()}
      >
        {children}
      </DialogStepper>,
    )

    expect(wrapper.length).toBe(1)
  })
})
