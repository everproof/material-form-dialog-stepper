// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { destroy, hasSubmitSucceeded, isSubmitting, submit } from 'redux-form'
import { AppBar, Button, Divider, Toolbar, Typography } from 'material-ui'
import Dialog, {
  DialogContent,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog'
import MobileStepper from 'material-ui/MobileStepper'
import { withStyles } from 'material-ui/styles'
import { KeyboardArrowLeft, KeyboardArrowRight } from 'material-ui-icons'
import Slide from 'material-ui/transitions/Slide'
import type { Node } from 'react'

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
      appBar: { position: 'relative' },
      dialogContent: { display: 'flex', flexDirection: 'column' },
      dialogTitle: { display: 'flex', justifyContent: 'space-between' },
      header: { flex: 1 },
      mobileStepper: { flex: '0 0 38px' },
      paper: { width: spacing.unit * 58, height: spacing.unit * 73 },
      fullScreen: { width: '100%', height: '100%' },
      [breakpoints.down('sm')]: {
        dialogContent: { padding: spacing.unit * 3 },
      },
    }),
  )(
    withMobileDialog({ breakpoint: 'xs' })(
      class DialogStepper extends Component<Props, State> {
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

        Header = () => {
          const { SubHeading } = this
          const Header = () => (
            <Typography
              color="inherit"
              className={this.props.classes.header}
              gutterBottom
              noWrap
              type="title"
            >
              {this.props.title}
            </Typography>
          )

          const HeaderSteps = () => (
            <Typography color="inherit">{`Step ${this.state.activeStep +
              1} of ${this.steps}`}</Typography>
          )

          return this.props.fullScreen ? (
            <div>
              <AppBar className={this.props.classes.appBar}>
                <Toolbar>
                  <Header />
                  <HeaderSteps />
                </Toolbar>
              </AppBar>
            </div>
          ) : (
            <DialogTitle disableTypography>
              <div className={this.props.classes.dialogTitle}>
                <Header />
                <HeaderSteps />
              </div>
              <SubHeading />
            </DialogTitle>
          )
        }

        SubHeading = () => (
          <Typography
            type="subheading"
            color="inherit"
            align={
              this.props.subheadingAlign &&
              this.props.subheadingAlign(this.state.activeStep)
            }
          >
            {this.props.subheadings[this.state.activeStep]}
          </Typography>
        )

        Stepper = () => (
          <MobileStepper
            activeStep={this.state.activeStep}
            className={this.props.classes.mobileStepper}
            position="static"
            steps={this.steps}
            type="dots"
            backButton={
              <Button dense onClick={this.handleBack}>
                {!this.atStart && <KeyboardArrowLeft />}
                {this.atStart ? 'Close' : 'Back'}
              </Button>
            }
            nextButton={
              <Button
                dense
                form={this.form}
                onClick={this.handleNext}
                type={this.form ? 'submit' : 'button'}
              >
                {(() => {
                  if (this.atEnd) {
                    return 'Close'
                  } else if (this.form) {
                    return 'Save'
                  }

                  return 'Next'
                })()}
                {!this.atEnd && <KeyboardArrowRight />}
              </Button>
            }
          />
        )

        render() {
          const { Header, SubHeading, Stepper } = this

          return (
            <Slide direction="up" in={this.props.open}>
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
              >
                <Header />
                {this.props.fullScreen && (
                  <div style={{ padding: '16px 24px 0' }}>
                    <SubHeading />
                  </div>
                )}
                <DialogContent className={this.props.classes.dialogContent}>
                  {this.props.children[this.state.activeStep]}
                </DialogContent>
                <Divider />
                <Stepper />
              </Dialog>
            </Slide>
          )
        }
      },
    ),
  ),
)
