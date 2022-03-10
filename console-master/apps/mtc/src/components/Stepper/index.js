import React, { useState } from 'react'

import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import MaterialStepper from '@material-ui/core/Stepper'

import Button from '../Button'

require('./stepper.scss')

const Stepper = ({ steps, confirmModal, confirmText, totalTenants, reason }) => {
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  return (
    <div className="stepper">
      <MaterialStepper className="step-container" activeStep={activeStep}>
        {steps.map(({ label }) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          )
        })}
      </MaterialStepper>
      {activeStep === steps.length - 1 ? (
        <div>
          <div className="stepper-content">{steps[activeStep].content}</div>
          <Button className="previous-button" outlined disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button className="next-button" onClick={confirmModal}>
            {confirmText}
          </Button>
        </div>
      ) : (
        <div>
          <div className="stepper-content">{steps[activeStep].content}</div>
          <Button
            outlined
            className={`previous-button ${activeStep === 0 ? 'hide' : 'show'}`}
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          {activeStep < 1 ? (
            <Button className={`next-button ${totalTenants > 0 ? ' selectable' : ' not-selectable'}`} onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button className={`next-button ${reason > 0 ? ' selectable' : ' not-selectable'}`} onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

Stepper.defaultProps = {
  steps: [],
}

export default Stepper
