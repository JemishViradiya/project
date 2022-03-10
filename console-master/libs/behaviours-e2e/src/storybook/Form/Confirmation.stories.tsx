import React, { useCallback, useMemo, useRef } from 'react'
import type { UseFormMethods } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'
import { Link as A, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'

import { Form as FormComponent } from '@ues-behaviour/hook-form'
import { useDialogPrompt } from '@ues/behaviours'

import markdown from './confirmation.md'

const ConfirmationStory = args => {
  const ConfirmationDialogComponent = () => {
    const { formState } = useFormContext()
    return useDialogPrompt(
      'If you navigate away - your changes will not be saved. Do you wish to navigate to "{{url}}"?',
      formState.isDirty,
    )
  }
  const ConfirmationDialog = useCallback(ConfirmationDialogComponent, [])

  // Manually navigate away via useNavigate()
  const navigate = useNavigate()
  const handleNavigateButton = useCallback(() => {
    navigate('/somewhere-else')
  }, [navigate])

  const handleSubmit = useCallback((formData: Record<string, unknown>, formInstance: UseFormMethods<Record<string, unknown>>) => {
    alert('Form Submitted')
    setTimeout(() => {
      formInstance.reset()
    }, 1)
  }, [])

  return (
    <>
      <h3>Navigation Links</h3>
      <nav style={{ display: 'flex', flexFlow: 'column nowrap', alignItems: 'flex-start' }}>
        <Link href="about:blank" target="_self">{`via <a href= />`}</Link>
        <br />
        <Link component={A} to="/somewhere-else">
          {`via react-router's <Link />`}
        </Link>
        <br />
        <Button onClick={handleNavigateButton} style={{ flexGrow: 0 }}>
          {'via <Button /> onClick handler'}
        </Button>
      </nav>
      <br />
      <h3>Example Form</h3>
      <FormComponent
        onSubmit={handleSubmit}
        initialValues={{ device: 'macBookAir' }}
        fields={[
          {
            type: 'radioGroup',
            name: 'device',
            label: 'Select Device',
            options: [
              { label: 'MacBook Air', value: 'macBookAir' },
              { label: 'MacBook Pro', value: 'macBookPro' },
            ],
            disabled: false,
          },
        ]}
      >
        <ConfirmationDialog />
      </FormComponent>
    </>
  )
}

export const Confirmation = ConfirmationStory.bind({})

const SomewhereElse = () => {
  const navigate = useNavigate()
  const goBack = useCallback(() => navigate(-1), [navigate])
  return (
    <>
      <h2>Somewhere Else</h2>
      <Link onClick={goBack}>Go Back</Link>
    </>
  )
}

const StoryRoutes = (story, ctx) => {
  const El = () => story(ctx)
  return (
    <Routes>
      <Route path="/somewhere-else" element={<SomewhereElse />} />
      <Route path="/" element={<El />} />
    </Routes>
  )
}
Confirmation.decorators = [StoryRoutes]

export default {
  title: 'Form/FormConfirmation',
  component: ConfirmationStory,
  parameters: {
    notes: { Introduction: markdown },
    router: { backend: 'hash' },
  },
  argTypes: {
    layout: {
      control: {
        type: 'inline-radio',
        options: ['inline', 'vertical'],
      },
      defaultValue: 'vertical',
      description: 'Layout style',
    },
  },
}
