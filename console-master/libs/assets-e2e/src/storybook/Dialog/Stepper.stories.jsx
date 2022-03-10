import React, { useState } from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@material-ui/core'

import { BasicClose } from '@ues/assets'

const StepActions = props => {
  const { handleBack, handleNext, activeStep, isFinalStep, handleSubmit } = props
  const buttonText = isFinalStep ? 'Finish' : 'Next'
  const buttonAction = isFinalStep ? handleSubmit : handleNext

  return (
    <DialogActions>
      <Grid container justify="space-between">
        <Grid item>
          <Button className="cancelButton-root" variant="outlined" onClick={handleSubmit}>
            Cancel
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={buttonAction}>
            {buttonText}
          </Button>
        </Grid>
      </Grid>
    </DialogActions>
  )
}

const StepContent = ({ toggleOpen }) => {
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    setActiveStep(activeStep + 1)
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  const handleSubmit = () => {
    toggleOpen()
  }

  const steps = ['The first step in the journey that is this form', 'The second step', 'The last and final step']

  const isFinalStep = activeStep === steps.length - 1

  function getStepContent() {
    switch (activeStep) {
      case 0:
        return 'Step one...'
      case 1:
        return 'Step two?'
      case 2:
        return 'Step three!'
      default:
        return 'Unknown stepIndex'
    }
  }

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <DialogContent>
        <Typography variant="body2">{getStepContent()}</Typography>
      </DialogContent>
      <StepActions
        activeStep={activeStep}
        isFinalStep={isFinalStep}
        handleNext={handleNext}
        handleBack={handleBack}
        handleSubmit={handleSubmit}
      />
    </>
  )
}

export const dialogStepper = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [open, setOpen] = useState(false)

  const toggleOpen = () => {
    setOpen(!open)
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={toggleOpen}>
        Open Stepper
      </Button>
      <Dialog scroll="paper" open={open} onClose={toggleOpen} disableBackdropClick>
        <DialogTitle disableTypography>
          <Typography variant="h2">Modal Title</Typography>
          <IconButton size="small" onClick={toggleOpen}>
            <BasicClose />
          </IconButton>
        </DialogTitle>
        <StepContent toggleOpen={toggleOpen} />
      </Dialog>
    </div>
  )
}
export default {
  title: 'Modal',
}
