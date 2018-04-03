// @flow
import React from 'react'
import Button from 'material-ui/Button'
import MobileStepper from 'material-ui/MobileStepper'
import { KeyboardArrowLeft, KeyboardArrowRight } from 'material-ui-icons'
import { withStyles } from 'material-ui/styles'

export default withStyles({ mobileStepper: { flex: '0 0 38px' } })(
  ({
    activeStep,
    atEnd,
    atStart,
    classes: { mobileStepper },
    form,
    handleBack,
    handleNext,
    steps,
    submitting,
  }: {
    activeStep: number,
    atEnd: boolean,
    atStart: boolean,
    classes: { mobileStepper: string },
    form: string,
    handleBack: () => void,
    handleNext: () => void,
    steps: number,
    submitting?: ?boolean,
  }) => (
    <MobileStepper
      activeStep={activeStep}
      className={mobileStepper}
      position="static"
      steps={steps}
      type="dots"
      backButton={
        <Button size="small" onClick={handleBack}>
          {!atStart && <KeyboardArrowLeft />}
          {atStart ? 'Close' : 'Back'}
        </Button>
      }
      nextButton={
        <Button
          size="small"
          disabled={Boolean(submitting)}
          form={form}
          onClick={handleNext}
          type={form ? 'submit' : 'button'}
        >
          {((): string => {
            if (form) {
              if (submitting) {
                return 'Saving'
              }

              return 'Save'
            } else if (atEnd) {
              return 'Close'
            }

            return 'Next'
          })()}
          {!atEnd && <KeyboardArrowRight />}
        </Button>
      }
    />
  ),
)
