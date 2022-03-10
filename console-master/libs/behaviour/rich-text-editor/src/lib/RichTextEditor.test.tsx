import '@testing-library/jest-dom'

import React from 'react'
import { useForm } from 'react-hook-form'

import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react'

import RichTextEditor from './RichTextEditor'
import { StartStateType } from './RichTextEditorTypes'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}))

type FormData = {
  testField: string
}

const fieldName = 'testField'
const fieldLabel = 'testField1234Label'
const somePlainTextInput = 'someTextField'
const qlEditorSelector = '.ql-editor'

function getQlEditor(view: any): HTMLInputElement {
  return view.container.querySelector('#' + fieldName + 'quillEditor').querySelector(qlEditorSelector)
}

function getRequiredHintElement(view: any) {
  return view.getByTestId(fieldName + 'RequiredHint')
}

describe('RichTextEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(cleanup)

  const TestWrapperRichTextEditor = props => {
    const { register } = useForm<FormData>({
      mode: 'onBlur',
    })

    const handleOnFocus = () => {
      console.log('simple text handle on focus./..')
    }

    return (
      <div>
        <input id={somePlainTextInput} type="text" onFocus={handleOnFocus}></input>
        <RichTextEditor
          fieldName={fieldName}
          fieldLabel={fieldLabel}
          startEditorStateType={StartStateType.HTML}
          startEditorState={props.startHtml}
          readOnly={false}
          register={register}
          required={props.required === undefined ? true : props.required}
        />
      </div>
    )
  }

  test('Test required when editor is empty from non-empty', async () => {
    // start as not empty
    const view = await render(<TestWrapperRichTextEditor startHtml={'hello'} />)
    const requiredHintElement = getRequiredHintElement(view)
    await waitFor(() => {
      expect(requiredHintElement).not.toBeVisible()
    })

    const qlEditor: HTMLInputElement = getQlEditor(view)
    const someTextField: HTMLInputElement = view.container.querySelector('#' + somePlainTextInput)

    await act(async () => {
      fireEvent.change(someTextField, { target: { value: 'Text' } })
    })

    await act(async () => {
      fireEvent.input(qlEditor, { target: { textContent: '' } })
    })

    // react re-renders async
    // so wait for the required hint to be visible
    await waitFor(() => {
      expect(requiredHintElement).toBeVisible()
    })

    view.unmount()
  })

  test('Test required hint gone when editor from empty to non-empty ', async () => {
    // start as not empty
    const view = await render(<TestWrapperRichTextEditor startHtml={''} />)
    const requiredHintElement = getRequiredHintElement(view)
    const qlEditor: HTMLInputElement = getQlEditor(view)

    await act(async () => {
      fireEvent.input(qlEditor, { target: { textContent: ' ' } })
    })

    await waitFor(() => {
      expect(requiredHintElement).toBeVisible()
    })

    await act(async () => {
      fireEvent.input(qlEditor, { target: { textContent: 'hello' } })
    })

    // react re-render in async manner
    // we need to wait for the required hint to not be visible
    await waitFor(() => {
      expect(requiredHintElement).not.toBeVisible()
    })

    view.unmount()
  })

  test('Test no required hint when editor is not required ', async () => {
    // start as not empty
    const view = await render(<TestWrapperRichTextEditor startHtml={''} required={false} />)
    const requiredHintElement = getRequiredHintElement(view)
    const qlEditor: HTMLInputElement = getQlEditor(view)

    await act(async () => {
      fireEvent.input(qlEditor, { target: { textContent: ' ' } })
    })

    await waitFor(() => {
      expect(requiredHintElement).not.toBeVisible()
    })

    view.unmount()
  })
})
