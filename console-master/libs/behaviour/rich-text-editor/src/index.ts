import React from 'react'

export { StartStateType, ErrorType } from './lib/RichTextEditorTypes'
export const RichTextEditor = React.lazy(() => import('./lib/RichTextEditor'))
