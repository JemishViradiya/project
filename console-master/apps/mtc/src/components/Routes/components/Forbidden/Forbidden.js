import React from 'react'
import { Redirect } from 'react-router-dom'

const ForbiddenRedirect = () => <Redirect to="/forbidden" />

export default ForbiddenRedirect
