import './RichTextEditorQuill.css'

import imageType from 'image-type'
import type * as QuillTypes from 'quill'
import Quill from 'quill'
import * as Delta from 'quill-delta'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill'

import { makeStyles } from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel'

import { ErrorType, StartStateType } from './RichTextEditorTypes'

const DEFAULT_IMAGE_TYPE_FALLBACK = 'image/jpeg'
const WHITELISTED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const WHITELISTED_MIME_TYPES_STRING = WHITELISTED_MIME_TYPES.join(',')
const BYTES_IN_MB = 1024 * 1024
const DEFAULT_MAX_FILE_IMG_SIZE_MB = 5
const DEFAULT_MAX_IMG_WIDTH = 800
const DEFAULT_MAX_IMG_HEIGHT = 800
const IMG_QUALITY = 0.7
const STYLE_NO_MARGIN_AND_NO_PADDING_ONLY = 'margin:0;padding:0;'
const STYLE_NO_MARGIN_PADDING_RESPECT_SPACE = STYLE_NO_MARGIN_AND_NO_PADDING_ONLY + 'white-space:pre-wrap;'

export interface RichTextEditorProps {
  // the field name that should be unique in the context of the page otherwise two or more editor will collide
  fieldName: string
  // the friendly display label of the ditor
  fieldLabel: string
  // the editor state type to start with (html or deltaJson)
  // in the case of predefined from server, it can be html directly
  startEditorStateType: StartStateType
  // the editor state to start with.  it can be delta JSON string format or html
  startEditorState?: string
  // flag that indicates if readOnly or not
  readOnly: boolean
  // on change method to call when editor content is changed
  onChange?: (content: string, delta: QuillTypes.Delta, source: QuillTypes.Sources, editor: any) => void
  // the useForm register method
  register: any
  // indicates if required or not
  required: boolean
  // indicates if should display error state
  error?: boolean
  // the max image size in MB
  imageMaxFileSizeMb?: number
  // the max image width pixels that the uploaded image should be resized to
  imageMaxWidth?: number
  // the max image height pixels that the uploaded image should be resized to
  imageMaxHeight?: number
  // callback for handling any error and up for the parent how to display it
  onError?: (localizedErrorMsg: string, error: ErrorType, details?: any) => void
}

const useStyles = makeStyles(theme => ({
  richTextEditor: {
    '& .ql-editor': {
      minHeight: `13em`,
    },
    '& .ql-container.ql-snow': {
      border: '0px',
    },
    '& .ql-container .ql-editor': {
      overflow: 'visible',
    },
  },
  richTextEditorToolBar: {
    /** this is the color of when the mouse hover over the button */
    /** secondary-dark: #42ab2a **/
    '--hoverColor': theme.palette.secondary.dark,
    /** when button is active (say is Bold was applied to certain text) this is the color **/
    '--activeColor': theme.palette.secondary.main,
  },
  richTextEditorScrollContainer: {
    overflow: 'auto',
    height: '180px',
  },
  richTextEditorContainer: {
    border: '1px solid #ccc',
    overflow: 'auto',
    height: '180px',
  },
  spacer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  showRequiredError: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(1),
    marginBottom: '0px',
    display: 'block',
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
  },
  hide: {
    display: 'none',
  },
  notOnScreen: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    opacity: 0,
  },
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}))

const getEditorModules = (toolbarId: string) => {
  return {
    toolbar: {
      container: toolbarId,
    },
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  }
}

const getContentAsDelta = (startEditorState: string): Delta => {
  let contentAsDelta = null
  try {
    contentAsDelta = startEditorState ? new Delta(JSON.parse(startEditorState)) : null
  } catch (_e) {
    contentAsDelta = undefined
  }
  return contentAsDelta
}

let quillInitialized = false

const initializeQuill = () => {
  if (quillInitialized) return

  // this will make sure to use inline CSS instead of class so that HTML rendering works.
  Quill.register(Quill.import('attributors/attribute/direction'), true)
  Quill.register(Quill.import('attributors/style/align'), true)
  Quill.register(Quill.import('attributors/style/background'), true)
  Quill.register(Quill.import('attributors/style/color'), true)
  Quill.register(Quill.import('attributors/style/direction'), true)
  Quill.register(Quill.import('attributors/style/size'), true)
  const Parchment = Quill.import('parchment')

  class IndentAttributor extends Parchment.Attributor.Style {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(indent, textIndent, scopeData) {
      super(indent, textIndent, scopeData)
    }
    add = (node, value) => {
      value = parseInt(value)
      if (value === 0) {
        this.remove(node)
        return true
      } else {
        return super.add(node, `${value}em`)
      }
    }
  }
  // indent style will convert to inline style for the indent functionality
  const IndentStyle = new IndentAttributor('indent', 'text-indent', {
    scope: Parchment.Scope.BLOCK,
    whitelist: ['1em', '2em', '3em', '4em', '5em', '6em', '7em', '8em', '9em'],
  })
  Quill.register(IndentStyle, true)

  // this is based on Quill font.js, but we will not whitelist whatever is defined
  // in the 'ql-font' drop down so that it will work automatically
  const fontConfig = {
    scope: Parchment.Scope.INLINE,
    whitelist: null,
  }

  class FontStyleAttributor extends Parchment.Attributor.Style {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(indent, textIndent, scopeData) {
      super(indent, textIndent, scopeData)
    }
    value(node: any) {
      return super.value(node).replace(/["']/g, '')
    }
  }

  // this will map 'ql-font' to this inline style attribute of 'font-family'
  const FontStyle = new FontStyleAttributor('font', 'font-family', fontConfig)
  Quill.register(FontStyle, true)

  quillInitialized = true
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  fieldName,
  fieldLabel,
  startEditorStateType,
  startEditorState,
  readOnly,
  onChange,
  onError,
  register,
  required,
  error = false,
  imageMaxFileSizeMb = DEFAULT_MAX_FILE_IMG_SIZE_MB,
  imageMaxWidth = DEFAULT_MAX_IMG_WIDTH,
  imageMaxHeight = DEFAULT_MAX_IMG_HEIGHT,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}): JSX.Element => {
  const reactQuillRef = useRef(null)
  const classes = useStyles()
  const [toolbarInitialized, setToolbarInitialized] = useState(false)
  const { t } = useTranslation(['behaviour/rich-text-editor'])

  initializeQuill()

  const editorStateToStartWith =
    startEditorStateType === StartStateType.HTML ? startEditorState : getContentAsDelta(startEditorState)

  const [highLightRequired, setHighLightRequired] = useState(false)

  const handleEditorChange = (html: string, delta, source, editor: any) => {
    const isEditorNotEmpty = computeIfEditorIsNotEmpty(editor)
    if (source === 'user') {
      highlightRequiredIfNeeded(isEditorNotEmpty)
    }
    let embeddedStyleHtml = html
    // replace <p><br></p> with just no margin and padding p and br
    embeddedStyleHtml = embeddedStyleHtml.replace(
      new RegExp(`<p><br></p>`, 'g'),
      `<p id="pbr" style="${STYLE_NO_MARGIN_AND_NO_PADDING_ONLY}"><br></p>`,
    )
    embeddedStyleHtml = addStyleToTag(embeddedStyleHtml, 'p', STYLE_NO_MARGIN_PADDING_RESPECT_SPACE)
    embeddedStyleHtml = addStyleToTag(
      embeddedStyleHtml,
      'blockquote',
      `${STYLE_NO_MARGIN_PADDING_RESPECT_SPACE}border-left:4px solid #ccc;margin-bottom:5px;margin-top:5px;padding-left:16px;`,
    )
    embeddedStyleHtml = addStyleToTag(embeddedStyleHtml, 'pre', STYLE_NO_MARGIN_PADDING_RESPECT_SPACE)
    embeddedStyleHtml = addStyleToTag(embeddedStyleHtml, 'ol', `${STYLE_NO_MARGIN_PADDING_RESPECT_SPACE}padding-left:3em;`)
    embeddedStyleHtml = addStyleToTag(embeddedStyleHtml, 'ul', `${STYLE_NO_MARGIN_PADDING_RESPECT_SPACE}padding-left:3em;`)
    embeddedStyleHtml = addStyleToTag(embeddedStyleHtml, 'li', 'margin-left:1.5em;')
    embeddedStyleHtml = addStyleToTag(embeddedStyleHtml, 'h1', STYLE_NO_MARGIN_PADDING_RESPECT_SPACE)
    embeddedStyleHtml = addStyleToTag(embeddedStyleHtml, 'h2', STYLE_NO_MARGIN_PADDING_RESPECT_SPACE)
    embeddedStyleHtml = addStyleToTag(embeddedStyleHtml, 'h3', STYLE_NO_MARGIN_PADDING_RESPECT_SPACE)
    embeddedStyleHtml = addStyleToTag(embeddedStyleHtml, 'h4', STYLE_NO_MARGIN_PADDING_RESPECT_SPACE)
    embeddedStyleHtml = addStyleToTag(embeddedStyleHtml, 'h5', STYLE_NO_MARGIN_PADDING_RESPECT_SPACE)

    // this one ensures that default font and size is respected when user did not select other font and/or font size
    const wrappedWithDivHtml = `<div style="margin:0;padding:0;line-height:1.42;font-family:Helvetica, Arial, sans-serif;font-size:13px;word-wrap: break-word;">${embeddedStyleHtml}</div>`

    if (onChange) {
      onChange(isEditorNotEmpty ? wrappedWithDivHtml : '', delta, source, editor)
    }
  }

  const addStyleToTag = (html: string, tag: string, style: string) => {
    return html
      .replace(new RegExp(`<${tag} style="`, 'g'), `<${tag} style="${style}`)
      .replace(new RegExp(`<${tag}>`, 'g'), `<${tag} style="${style}">`)
  }
  /**
   * Helper function to determine if the editor has some embedded image
   */
  const hasEmbeddedImage = (editor: any): boolean => {
    const ops = editor.getContents().ops
    return ops && ops.findIndex(op => op.insert && op.insert.image) >= 0
  }

  const computeIfEditorIsNotEmpty = (editor: any) => {
    const editorText = editor.getText()
    return editorText && (editorText.trim() !== '' || hasEmbeddedImage(editor))
  }

  const highlightRequiredIfNeeded = (isEditorNotEmpty: boolean) => {
    if (required) {
      // if the editor has text now, then set the highlight as false
      if (isEditorNotEmpty) {
        setHighLightRequired(false)
      }
      // otherwise, set the highlight as required as true
      else {
        setHighLightRequired(true)
      }
    }
  }

  const getQuillEditor = React.useCallback(() => {
    return reactQuillRef && reactQuillRef.current && typeof reactQuillRef.current.getEditor === 'function'
      ? reactQuillRef.current.getEditor()
      : null
  }, [reactQuillRef])

  // when the editor is blur, it means that the user has clicked away (for example tab or submit)
  // so this allows us to highlight the field as required
  const handleEditorOnBlur = (_previousRange, _source, editor) => {
    highlightRequiredIfNeeded(computeIfEditorIsNotEmpty(editor))
  }
  const focusRichTextEditor = () => {
    const quillEditor = getQuillEditor()
    if (quillEditor) {
      quillEditor.focus()
    }
  }

  const onFocusOnTextFieldNoOnScreen = e => {
    // cancel the focus on the not on-screen text field
    e.preventDefault()
    // focus rich text editor
    focusRichTextEditor()
  }

  const isRequiredError = () => {
    return !readOnly && (highLightRequired || (required && error))
  }

  const disableEvent = event => {
    event.preventDefault()
    return false
  }

  const clampDimension = (originalWidth, originalHeight, maxWidth, maxHeight) => {
    if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
      return [originalWidth, originalHeight]
    }
    if (originalWidth > maxWidth) {
      const newWidth = maxWidth
      // determine new height based on the scale of original height and width
      const newHeight = Math.floor((originalHeight / originalWidth) * newWidth)

      if (newHeight > maxHeight) {
        const newHeight = maxHeight
        const newWidth = Math.floor((originalWidth / originalHeight) * newHeight)
        return [newWidth, newHeight]
      } else {
        return [newWidth, newHeight]
      }
    }
    if (originalHeight > maxHeight) {
      const newHeight = maxHeight
      const newWidth = Math.floor((originalWidth / originalHeight) * newHeight)
      return [newWidth, newHeight]
    }
  }

  const convertToDataURL = async arrayBuffer => {
    const reader = new FileReader()
    let dataURL = null
    reader.readAsDataURL(new Blob([arrayBuffer]))
    try {
      await new Promise<void>((resolve, reject) => {
        reader.onload = e => {
          dataURL = e.target.result
          resolve()
        }
        reader.onerror = () => {
          reject()
        }
      })
    } catch (ex) {
      // an error happening converting the array buffer to dataURL (should not happen)
      return
    }
    return dataURL
  }

  const determineImageType = arrayBuffer => {
    const imgType = imageType(arrayBuffer)
    if (imgType !== null && imgType.mime !== null && WHITELISTED_MIME_TYPES.includes(imgType.mime)) {
      return imgType.mime
    }
    return DEFAULT_IMAGE_TYPE_FALLBACK
  }

  // Take an image URL, downscale it to the given width, and return a new image URL.
  const reEncodeImage = React.useCallback(
    async arrayBuffer => {
      const dataURL = await convertToDataURL(arrayBuffer)
      // Create a temporary image so that we can compute the height of the downscaled image.
      const image = new Image()
      image.src = dataURL
      try {
        await new Promise<void>((resolve, reject) => {
          image.onload = () => {
            resolve()
          }
          image.onerror = () => {
            reject()
          }
        })
      } catch (ex) {
        // the browser could not load the image (is not a supported type or is invalid image)
        return
      }

      // determine the image type using library so that to encode with the most appropriate type
      const imageType = determineImageType(arrayBuffer)

      // resize if needed to ensure w <= maxWidth and h <= maxHeight
      const [newWidth, newHeight] = clampDimension(image.width, image.height, imageMaxWidth, imageMaxHeight)

      // Create a temporary canvas to draw the downscaled image on.
      const canvas = document.createElement('canvas')
      canvas.width = newWidth
      canvas.height = newHeight

      // Draw the downscaled image on the canvas and return the new data URL.
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0, newWidth, newHeight)

      return canvas.toDataURL(imageType, IMG_QUALITY)
    },
    [imageMaxWidth, imageMaxHeight],
  )

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const handleInsertEmbeddedImage = React.useCallback(() => {
    const quill = getQuillEditor()
    if (quill) {
      const toolBarContainer = document.getElementById(fieldName + 'ToolBarId')
      let fileInput: HTMLInputElement = toolBarContainer.querySelector('input.ql-image[type=file]')
      if (fileInput == null) {
        fileInput = document.createElement('input')
        fileInput.setAttribute('type', 'file')
        fileInput.setAttribute('accept', WHITELISTED_MIME_TYPES_STRING)
        fileInput.setAttribute('style', 'visibility:hidden')
        fileInput.classList.add('ql-image')
        fileInput.addEventListener('change', () => {
          const files = fileInput.files
          if (files != null && files[0] != null) {
            const aFile = files[0]
            const fileSizeBytes = aFile.size
            if (fileSizeBytes < imageMaxFileSizeMb * BYTES_IN_MB) {
              const reader = new FileReader()
              reader.onload = async e => {
                const range = quill.getSelection()
                const reEncodedDataURL = await reEncodeImage(e.target.result)
                if (reEncodedDataURL !== undefined) {
                  quill.updateContents(
                    new Delta().retain(range.index).delete(range.length).insert({ image: reEncodedDataURL }),
                    'user',
                  )
                  quill.setSelection(range.index + 1, 'silent')
                } else {
                  if (onError) onError(t('uploadedFileUnrecognizedImage'), ErrorType.UploadedFileUnrecognizedImage)
                }
                fileInput.value = ''
                // this is example to disable the image button
                //toolBarContainer.querySelector('#' + fieldName + 'ImageButton').setAttribute('disabled', 'true')
              }
              reader.readAsArrayBuffer(aFile)
            } else {
              if (onError)
                onError(
                  t('uploadedFileSizeExceeded', {
                    maxFileSizeMB: imageMaxFileSizeMb,
                  }),
                  ErrorType.UploadedFileSizeExceeded,
                  imageMaxFileSizeMb,
                )
            }
          }
        })
        toolBarContainer.appendChild(fileInput)
        window.requestAnimationFrame(() => {
          if (fileInput.parentNode !== null) {
            fileInput.parentNode.removeChild(fileInput)
          }
        })
      }
      fileInput.click()
    }
  }, [getQuillEditor, fieldName, imageMaxFileSizeMb, reEncodeImage, onError, t])

  // override the toolbar image, video, and link after component is mounted
  useEffect(() => {
    if (toolbarInitialized) return
    const qEditor = getQuillEditor()
    const toolbar = qEditor.getModule('toolbar')
    qEditor.root.setAttribute('role', 'textbox')
    qEditor.root.setAttribute('aria-multiline', 'true')
    qEditor.root.setAttribute('aria-labelledby', fieldName + 'InputLabel')
    if (toolbar) {
      toolbar.addHandler('image', handleInsertEmbeddedImage)
      toolbar.addHandler('video', () => {
        // override default behaviour to do nothing
      })
      toolbar.addHandler('link', () => {
        // override default behaviour to do nothing
      })
      setToolbarInitialized(true)
    }
  }, [toolbarInitialized, getQuillEditor, handleInsertEmbeddedImage, fieldName])

  return (
    <div className={classes.container}>
      <div className={classes.spacer} />
      <InputLabel id={fieldName + 'InputLabel'} disabled={readOnly} error={isRequiredError()}>
        {fieldLabel}
      </InputLabel>
      <input
        ref={register({ required: required })}
        name={fieldName}
        type="text"
        onFocusCapture={onFocusOnTextFieldNoOnScreen}
        className={classes.notOnScreen}
      />
      <p className={isRequiredError() ? classes.showRequiredError : classes.hide} data-testid={fieldName + 'RequiredHint'}>
        This field is required.
      </p>
      <div className={classes.spacer}></div>
      <div id={fieldName + 'ToolBarId'} className={classes.richTextEditorToolBar} role="toolbar">
        <span className="ql-formats">
          <select className="ql-font">
            <option value="Open Sans, Helvetica, Arial, sans-serif">Sans Serif</option>
            <option value="Georgia, Times New Roman, serif">Serif</option>
            <option value="Courier, monospace">Monospace</option>
          </select>
          <select className="ql-size" defaultValue="13px">
            <option value="10px">10px</option>
            <option value="13px">13px</option>
            <option value="18px">18px</option>
            <option value="32px">32px</option>
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>
          <button className="ql-strike"></button>
        </span>
        <span className="ql-formats">
          <select className="ql-color"></select>
          <select className="ql-background"></select>
        </span>
        <span className="ql-formats">
          <button className="ql-blockquote"></button>
          <button id={fieldName + 'ImageButton'} className="ql-image"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-header" value="1"></button>
          <button className="ql-header" value="2"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered"></button>
          <button className="ql-list" value="bullet"></button>
          <button className="ql-indent" value="-1"></button>
          <button className="ql-indent" value="+1"></button>
        </span>
        <span className="ql-formats">
          <select className="ql-align"></select>
        </span>
        <span className="ql-formats">
          <button className="ql-script" value="sub"></button>
          <button className="ql-script" value="super"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-clean"></button>
        </span>
      </div>
      <div className={classes.richTextEditorContainer} onDrop={disableEvent}>
        <ReactQuill
          id={fieldName + 'quillEditor'}
          defaultValue={editorStateToStartWith}
          theme="snow"
          className={classes.richTextEditor}
          scrollingContainer={classes.richTextEditorScrollContainer}
          readOnly={readOnly}
          onChange={handleEditorChange}
          onBlur={handleEditorOnBlur}
          modules={getEditorModules('#' + fieldName + 'ToolBarId')}
          ref={reactQuillRef}
        />
      </div>
    </div>
  )
}

export default RichTextEditor
