import React from 'react'

const EmailReport = React.lazy(() => import('./EmailReport'))
const EmailReports = React.lazy(() => import('./EmailReports'))

export const Reports = {
  path: '/reporting*',
  children: [
    { path: '/', element: <EmailReports /> },
    { path: '/add', element: <EmailReport /> },
    { path: '/:guid', element: <EmailReport /> },
  ],
}
