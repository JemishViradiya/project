/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  isEmpty,
  isValidDisplayName,
  isValidEmail,
  isValidLength,
  isValidSpacing,
  maxEmailLength,
  maxNameLength,
} from '../../../utils/validation'
import DetailTextField from './DetailTextField'

const UserDetailsForm = ({ userDetails, editable, setUserDetails, setValidForm }) => {
  const { current: emailEditable } = useRef(!userDetails.emailAddress)
  const { t } = useTranslation(['platform/common', 'platform/validation'])
  const firstNameField = t('users.add.input.firstName')
  const lastNameField = t('users.add.input.lastName')
  const displayNameField = t('users.add.input.displayName')
  const emailAddressField = t('users.add.input.emailAddress')
  const [isDisplayNameFormatted, setDisplayNameFormatted] = useState(false)
  const getLengthValidationMessage = max => fieldName => t('platform/validation:maxLength', { fieldName, max })
  const getEmptyFieldValidationMessage = fieldName => t('platform/validation:emptyField', { fieldName })
  const getInvalidFieldValidationMessage = fieldName => t('platform/validation:invalidField', { fieldName })
  const VALIDATION_ERRORS = {
    firstName: {
      isError: false,
      helperText: '',
      name: firstNameField,
      validators: [
        { validator: isValidLength(maxNameLength), getMessage: getLengthValidationMessage(maxNameLength) },
        { validator: isEmpty, getMessage: getEmptyFieldValidationMessage },
        { validator: isValidSpacing, getMessage: getInvalidFieldValidationMessage },
      ],
    },
    lastName: {
      isError: false,
      helperText: '',
      name: lastNameField,
      validators: [
        { validator: isValidLength(maxNameLength), getMessage: getLengthValidationMessage(maxNameLength) },
        { validator: isEmpty, getMessage: getEmptyFieldValidationMessage },
        { validator: isValidSpacing, getMessage: getInvalidFieldValidationMessage },
      ],
    },
    displayName: {
      isError: false,
      helperText: '',
      name: displayNameField,
      validators: [
        { validator: isValidDisplayName, getMessage: getInvalidFieldValidationMessage },
        { validator: isEmpty, getMessage: getEmptyFieldValidationMessage },
        { validator: isValidSpacing, getMessage: getInvalidFieldValidationMessage },
      ],
    },
    emailAddress: {
      isError: false,
      helperText: '',
      name: emailAddressField,
      validators: [
        { validator: isEmpty, getMessage: getEmptyFieldValidationMessage },
        { validator: isValidEmail, getMessage: getInvalidFieldValidationMessage },
        { validator: isValidLength(maxEmailLength), getMessage: getLengthValidationMessage(maxEmailLength) },
      ],
    },
  }
  const [errors, setErrors] = useState({ ...VALIDATION_ERRORS })

  const validate = (id, value) => {
    const { validators, name } = errors[id]

    for (let i = 0; i < validators.length; i++) {
      const { validator, getMessage } = validators[i]
      const valid = validator(value)

      if (!valid) {
        setErrors(prevState => ({
          ...prevState,
          [id]: {
            ...prevState[id],
            isError: true,
            helperText: getMessage(name),
          },
        }))

        break
      } else {
        setErrors(prevState => ({
          ...prevState,
          [id]: { ...prevState[id], isError: false, helperText: '' },
        }))
      }
    }
  }
  useEffect(() => {
    if (userDetails.firstName === '' && userDetails.lastName === '' && userDetails.displayName === '') {
      setDisplayNameFormatted(false)
    }
  }, [userDetails])
  const handleTextChange = (id, value) => {
    let temporaryDisplayName
    if (id !== 'emailAddress') {
      if (id === 'firstName') {
        temporaryDisplayName = t('users.add.displayName', { firstName: value, lastName: userDetails.lastName })
      } else if (id === 'lastName') {
        temporaryDisplayName = t('users.add.displayName', { firstName: userDetails.firstName, lastName: value })
      }
      if (id === 'displayName') {
        if (value === '') {
          setDisplayNameFormatted(false)
          userDetails.displayName = temporaryDisplayName
        } else {
          setDisplayNameFormatted(true)
        }
      }
      if ((id === 'firstName' || id === 'lastName') && !isDisplayNameFormatted) {
        userDetails.displayName = temporaryDisplayName
      }
    }
    setUserDetails(prevState => ({ ...prevState, [id]: value }))
    validate(id, value)
  }

  useEffect(() => {
    let valid = true
    if (editable) {
      for (const [key, value] of Object.entries(errors)) {
        if (value.isError || userDetails[key] === '') {
          valid = false
        }
      }
    } else {
      setErrors({ ...VALIDATION_ERRORS })
    }
    setValidForm(valid)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails])

  return (
    <>
      <DetailTextField
        spacingSide="right"
        disabled={!editable}
        required={editable}
        id="firstName"
        value={userDetails.firstName}
        onChange={e => handleTextChange(e.target.id, e.target.value)}
        label={firstNameField}
        error={errors.firstName.isError}
        helperText={errors.firstName.helperText}
      />
      <DetailTextField
        spacingSide="left"
        disabled={!editable}
        required={editable}
        id="lastName"
        value={userDetails.lastName}
        onChange={e => handleTextChange(e.target.id, e.target.value)}
        label={lastNameField}
        error={errors.lastName.isError}
        helperText={errors.lastName.helperText}
      />
      <DetailTextField
        spacingSide="right"
        disabled={!editable}
        required={editable}
        id="displayName"
        value={userDetails.displayName}
        onChange={e => handleTextChange(e.target.id, e.target.value)}
        label={displayNameField}
        error={errors.displayName.isError}
        helperText={errors.displayName.helperText}
      />
      <DetailTextField
        spacingSide="left"
        disabled={!editable || !emailEditable}
        required={editable}
        id="emailAddress"
        value={userDetails.emailAddress}
        onChange={e => handleTextChange(e.target.id, e.target.value)}
        label={emailAddressField}
        error={errors.emailAddress.isError}
        helperText={errors.emailAddress.helperText}
      />
    </>
  )
}

export default UserDetailsForm
