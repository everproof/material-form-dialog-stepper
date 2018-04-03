// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { destroy, hasSubmitSucceeded, isSubmitting, submit } from 'redux-form'
import { Dialog, Divider } from 'material-ui'
import { DialogContent, withMobileDialog } from 'material-ui/Dialog'
import withStyles from 'material-ui/styles/withStyles'
import Slide from 'material-ui/transitions/Slide'
import type { Node } from 'react'
import type { Destroy, Submit } from 'redux-form/lib/actions.types.js.flow'

import Header from './Header'
import Stepper from './Stepper'

type Props = {
  children: Array<Node> | Node,
  classes: {
    appBar: string,
    dialogContent: string,
    dialogTitle: string,
    paperFullScreen: string,
    header: string,
    mobileStepper: string,
    paper: string,
  },
  destroy: Destroy,
  forms?: Array<string>,
  fullScreen: boolean,
  onClose?: (activeStep: number) => void,
  open: boolean,
  subheadingAlign?: (activeStep: number) => 'left' | 'center' | 'right',
  subheadings: Array<string>,
  submit: Submit,
  submitSucceeded: Array<?boolean>, // eslint-disable-line react/no-unused-prop-types
  submitting: Array<?boolean>, // eslint-disable-line react/no-unused-prop-types
  title: string,
}

type State = { activeStep: number }

const isOpening = ({ open: currentOpen }, { open: nextOpen }) =>
  !currentOpen && nextOpen

const isOpen = ({ open: currentOpen }, { open: nextOpen }) =>
  currentOpen && nextOpen

const Transition = (props: Object) => <Slide direction="up" {...props} />

class DialogStepper extends Component<Props, State> {
  static defaultProps = { forms: [] }

  state = { activeStep: 0 }

  componentWillReceiveProps(nextProps: Props) {
    if (isOpening(this.props, nextProps)) {
      this.setState({ activeStep: 0 })
    } else if (isOpen(this.props, nextProps)) {
      const currentSubmitSucceeded = this.reduceSubmit(
        this.props.submitSucceeded,
      )

      const nextSubmitSucceeded = this.reduceSubmit(nextProps.submitSucceeded)

      const currentSubmitting = this.reduceSubmit(this.props.submitting)

      const nextSubmitting = this.reduceSubmit(nextProps.submitting)

      if (
        !currentSubmitSucceeded &&
        nextSubmitSucceeded &&
        currentSubmitting &&
        !nextSubmitting
      ) {
        this.goToNextStep()
      }
    }
  }

  shouldComponentUpdate(
    { fullScreen, open, submitting }: Props,
    { activeStep }: State,
  ) {
    return (
      this.props.fullScreen !== fullScreen ||
      this.props.open !== open ||
      this.props.submitting !== submitting ||
      this.state.activeStep !== activeStep
    )
  }

  atStart = () => this.state.activeStep <= 0

  atEnd = () => this.state.activeStep >= this.steps() - 1

  form = () => (this.props.forms || [])[this.state.activeStep]

  previousForm = () => (this.props.forms || [])[this.state.activeStep - 1]

  steps = () =>
    Array.isArray(this.props.children) ? this.props.children.length : 1

  goToNextStep = () => {
    if (this.atEnd()) {
      this.handleRequestClose()
    } else {
      this.setState({ activeStep: this.state.activeStep + 1 }, () => {
        if (this.previousForm()) {
          this.props.destroy(this.previousForm())
        }
      })
    }
  }

  handleBack = () => {
    if (this.atStart()) {
      this.handleRequestClose()
    } else {
      this.setState({ activeStep: this.state.activeStep - 1 })
    }
  }

  handleNext = () => {
    if (this.form()) {
      this.props.submit(this.form())
    } else {
      this.goToNextStep()
    }
  }

  handleRequestClose = () => {
    if (this.props.onClose) {
      this.props.onClose(this.state.activeStep)
    }

    this.props.destroy(...(this.props.forms || []))
  }

  reduceSubmit = submitArr =>
    submitArr
      .slice(this.state.activeStep)
      .reduce((result, next) => result || next, false)

  Header = () => (
    <Header
      activeStep={this.state.activeStep}
      fullScreen={this.props.fullScreen}
      steps={this.steps()}
      subheadingAlign={this.props.subheadingAlign}
      subheadings={this.props.subheadings}
      title={this.props.title}
    />
  )

  Stepper = () => (
    <Stepper
      activeStep={this.state.activeStep}
      atEnd={this.atEnd()}
      atStart={this.atStart()}
      form={this.form()}
      handleBack={this.handleBack}
      handleNext={this.handleNext}
      steps={this.steps()}
      submitting={this.props.submitting[this.state.activeStep]}
    />
  )

  render() {
    const { Header: ThisHeader, Stepper: ThisStepper } = this

    return (
      <Dialog
        classes={{
          paperFullScreen: this.props.classes.paperFullScreen,
          paper: this.props.classes.paper,
        }}
        fullScreen={this.props.fullScreen}
        disableBackdropClick
        disableEscapeKeyDown
        onClose={this.props.onClose}
        open={this.props.open}
        transition={Transition}
      >
        <ThisHeader />
        <DialogContent className={this.props.classes.dialogContent}>
          {Array.isArray(this.props.children)
            ? this.props.children[this.state.activeStep]
            : this.props.children}
        </DialogContent>
        <Divider />
        <ThisStepper />
      </Dialog>
    )
  }
}

export default connect(
  (state: Object, { forms = [] }: Props) => ({
    submitSucceeded: forms.map(form => hasSubmitSucceeded(form)(state)),
    submitting: forms.map(form => isSubmitting(form)(state)),
  }),
  { destroy, submit },
)(
  withStyles(
    ({
      breakpoints,
      spacing,
    }: {
      breakpoints: { down: (breakpoint: string) => string },
      spacing: { unit: number },
    }) => ({
      dialogContent: { display: 'flex', flexDirection: 'column' },
      paper: { width: spacing.unit * 58, height: spacing.unit * 73 },
      paperFullScreen: { width: '100%', height: '100%' },
      [breakpoints.down('sm')]: {
        dialogContent: { padding: spacing.unit * 3 },
      },
    }),
  )(withMobileDialog({ breakpoint: 'xs' })(DialogStepper)),
)
