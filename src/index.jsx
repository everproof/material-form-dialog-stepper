// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { destroy, hasSubmitSucceeded, isSubmitting, submit } from 'redux-form'
import Divider from 'material-ui/Divider'
import Dialog, { DialogContent, withMobileDialog } from 'material-ui/Dialog'
import { withStyles } from 'material-ui/styles'
import Slide from 'material-ui/transitions/Slide'
import type { Node } from 'react'

import Header from './Header'
import Stepper from './Stepper'

type Props = {
  children: Array<Node>,
  classes: {
    appBar: string,
    dialogContent: string,
    dialogTitle: string,
    fullScreen: string,
    header: string,
    mobileStepper: string,
    paper: string,
  },
  destroy: (form: string) => void,
  forms?: Array<string>,
  fullScreen: boolean,
  onClose?: (activeStep: number) => void,
  open: boolean,
  subheadingAlign?: (activeStep: number) => 'left' | 'center' | 'right',
  subheadings: Array<string>,
  submit: (form: string) => void,
  submitSucceeded?: boolean, // eslint-disable-line react/no-unused-prop-types
  submitting?: boolean, // eslint-disable-line react/no-unused-prop-types
  title: string,
}

type State = { activeStep: number }

const isOpening = ({ open: currentOpen }, { open: nextOpen }) =>
  !currentOpen && nextOpen

const isOpen = ({ open: currentOpen }, { open: nextOpen }) =>
  currentOpen && nextOpen

const submitIsSuccessful = (
  { submitSucceeded: currentSubmitSucceeded, submitting: currentSubmitting },
  { submitSucceeded: nextSubmitSucceeded, submitting: nextSubmitting },
) =>
  !currentSubmitSucceeded &&
  nextSubmitSucceeded &&
  currentSubmitting &&
  !nextSubmitting

const submitWasSuccessful = (
  { submitSucceeded: currentSubmitSucceeded, submitting: currentSubmitting },
  { submitSucceeded: nextSubmitSucceeded, submitting: nextSubmitting },
) =>
  !currentSubmitSucceeded &&
  nextSubmitSucceeded &&
  !currentSubmitting &&
  !nextSubmitting

const Transition = (props: Object) => <Slide direction="up" {...props} />

export default connect(
  (state: Object, { forms = [] }: Props) => ({
    submitting: forms.reduce(
      (result, form) => result || isSubmitting(form)(state),
      false,
    ),
    submitSucceeded: forms.reduce(
      (result, form) => result || hasSubmitSucceeded(form)(state),
      false,
    ),
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
      fullScreen: { width: '100%', height: '100%' },
      [breakpoints.down('sm')]: {
        dialogContent: { padding: spacing.unit * 3 },
      },
    }),
  )(
    withMobileDialog({ breakpoint: 'xs' })(
      class DialogStepper extends Component<Props, State> {
        static defaultProps = { forms: [] }

        state = { activeStep: 0 }

        componentWillReceiveProps(nextProps: Props) {
          if (isOpening(this.props, nextProps)) {
            this.setState({ activeStep: 0 })
          } else if (isOpen(this.props, nextProps)) {
            if (submitIsSuccessful(this.props, nextProps)) {
              this.goToNextStep()
            } else if (
              submitWasSuccessful(this.props, nextProps) &&
              this.previousForm
            ) {
              this.props.destroy(this.previousForm)
            }
          }
        }

        shouldComponentUpdate(
          { fullScreen, open }: Props,
          { activeStep }: State,
        ) {
          return (
            this.props.fullScreen !== fullScreen ||
            this.props.open !== open ||
            this.state.activeStep !== activeStep
          )
        }

        get atStart(): boolean {
          return this.state.activeStep <= 0
        }

        get atEnd(): boolean {
          return this.state.activeStep >= this.steps - 1
        }

        get form(): string {
          return (this.props.forms || [])[this.state.activeStep]
        }

        get previousForm(): string {
          return (this.props.forms || [])[this.state.activeStep - 1]
        }

        get steps(): number {
          return this.props.children.length
        }

        goToNextStep = () => {
          if (this.atEnd) {
            this.handleRequestClose()
          } else {
            this.setState({ activeStep: this.state.activeStep + 1 })
          }
        }

        handleBack = () => {
          if (this.atStart) {
            this.handleRequestClose()
          } else {
            this.setState({ activeStep: this.state.activeStep - 1 })
          }
        }

        handleNext = () => {
          if (this.form) {
            this.props.submit(this.form)
          } else {
            this.goToNextStep()
          }
        }

        handleRequestClose = () => {
          if (this.props.onClose) {
            this.props.onClose(this.state.activeStep)
          }
        }

        Header = () => (
          <Header
            activeStep={this.state.activeStep}
            fullScreen={this.props.fullScreen}
            steps={this.steps}
            subheadingAlign={this.props.subheadingAlign}
            subheadings={this.props.subheadings}
            title={this.props.title}
          />
        )

        Stepper = () => (
          <Stepper
            activeStep={this.state.activeStep}
            atEnd={this.atEnd}
            atStart={this.atStart}
            form={this.form}
            handleBack={this.handleBack}
            handleNext={this.handleNext}
            steps={this.steps}
          />
        )

        render() {
          const { Header: ThisHeader, Stepper: ThisStepper } = this

          return (
            <Dialog
              classes={{
                fullScreen: this.props.classes.fullScreen,
                paper: this.props.classes.paper,
              }}
              fullScreen={this.props.fullScreen}
              ignoreBackdropClick
              ignoreEscapeKeyUp
              onClose={this.props.onClose}
              open={this.props.open}
              transition={Transition}
            >
              <ThisHeader />
              <DialogContent className={this.props.classes.dialogContent}>
                {this.props.children[this.state.activeStep]}
              </DialogContent>
              <Divider />
              <ThisStepper />
            </Dialog>
          )
        }
      },
    ),
  ),
)
