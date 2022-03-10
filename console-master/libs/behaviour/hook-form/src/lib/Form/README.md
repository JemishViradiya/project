### ✨ Form component

This form component is built on top of Material UI components, React Hook Form and YUP.

## 🔨 Usage

```tsx
import React from 'react'
import Form, { FormInstance } from 'form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// optional yup resolver
// see https://react-hook-form.com/advanced-usage/#CustomHookwithResolver for a yup example
// and https://github.com/react-hook-form/react-hook-form/blob/master/examples/customValidation.tsx for a custom example
const validationSchema = yup.object().shape({
  name: yup.string().required('Enter the name!'),
  age: yup.number().required('Enter the age!').positive().integer(),
  email: yup.string().email(),
  birthDate: yup
    .date()
    .required()
    // optional param which allow to add custom form field validation
    .test('', 'Here should go error message', hereShouldGoCustomValidationFunction),
})
const resolver = yupResolver(validationSchema)

const fieldsConfiguration = [
  {
    type: 'text',
    label: 'Username',
    name: 'name',
    // optional param, you can disable the field for example when you perform HTTP request or are in View Mode
    disabled: loading || isViewMode || orSomethingElse,
  },
  {
    type: 'text',
    label: 'E-mail',
    name: 'email',
  },
  {
    type: 'text',
    label: 'Age',
    name: 'age',
  },
  {
    type: 'date',
    label: 'Birth date',
    name: 'birthDate',
  },
  {
    type: 'select',
    label: 'Country',
    name: 'country',
    options: [
      {
        label: 'Poland',
        value: 'pl',
      },
      {
        label: 'Germany',
        value: 'de',
      },
      {
        label: 'Norwegian',
        value: 'no',
      },
    ],
  },
  {
    type: 'multi-select',
    label: 'Hobbies',
    name: 'hobbies',
    options: [
      {
        label: 'Football',
        value: 'football-id',
      },
      {
        label: 'Cooking',
        value: 'cooking-id',
      },
      {
        label: 'Basketball',
        value: 'basketball-id',
      },
    ],
  },
]

const SimpleAddUserFormExampleDialog = () => {
  const handleFormSubmit = formData => {
    try {
      await addUser(formData)
      // handle success
    } catch (error) {
      // handle error
    }
  }

  return (
    <Form
      onSubmit={handleFormSubmit}
      onCancel={() => closeDialog()}
      validationSchema={validationSchema}
      fields={fieldsConfiguration}
    />
  )
}

const AddUserFormWithCustomButtonsExample = () => {
  const [formInstance, setFormInstance] = useState<FormInstance>()
  const [loading, setLoading] = useState(false)

  const handleFormSubmit = () => {
    setPending(true)
    try {
      await addUser(formInstance.values)
      // handle success
      setPending(false)
      formInstance.resetForm()
    } catch (error) {
      // handle error
      setPending(false)
    }
  }

  return (
    <div>
      <Form
        getFormInstance={setFormInstance}
        resolver={resolver}
        fields={fieldsConfiguration}
        // optional param, which hides default form buttons, so you can perform your own logic for it
        hideButtons
      />

      <div className="custom-buttons">
        <button onClick={() => formInstance.resetForm()}>Cancel</button>
        <button
          onClick={() => handleFormSubmit()}
          disabled={!formInstance.isFormValid() || !formInstance.isFormChanged() || pending}
        >
          Submit
        </button>
      </div>
    </div>
  )
}
```

### Support for nested properties

In case if you have more advanced form configuration like deep nested object properties, this form can handle it:

```tsx
const validationSchema = yup.object().shape({
  userDetails: {
    name: yup.string().required('Enter the name!'),
    age: yup.number().required('Enter the age!').positive().integer(),
    email: yup.string().email(),
    birthDate: yup
      .date()
      .required()
      // optional param which allow to add custom form field validation
      .test('', 'Here should go error message', hereShouldGoCustomValidationFunction),
  },
})
```

and fields configuration config should look like this,

```tsx
const fieldsConfiguration = [
  {
    name: 'userDetails.name',
  },
  {
    name: 'userDetails.email',
  },
  {
    name: 'userDetails.age',
  },
  {
    name: 'userDetails.birthDate',
  },
  {
    name: 'userDetails.country',
  },
  {
    name: 'userDetails.hobbies',
  },
]
```

it's helpful when you have advanced data model from the backend (example mentioned above), then you simply can pass it into initialValues without any data mapping

```tsx
const [userDetails, setUserDetails] = useState()

const fetchUserData = () => {
  try {
    const userDetails = await userDetails
    // handle success
    setUserDetails(userDetails)
  } catch (error) {
    // handle error
  }
}

return <Form initialValues={userDetails} ... />
```

### Validation

This form can handle any validation use case including custom form validation, validation process is being followed by [YUP](https://github.com/jquense/yup/blob/master/README.md) specification

Example of custom form validation:

```tsx
import {isValidDomainsAndFQDNs} from 'custom-validation';
import Form from 'form';
import * as yup from 'yup'

const validationSchema = yup.object().shape({
  fqdns: yup
    .array()
    .required()
    .test('', 'Invalid fqdns format', isValidDomainsAndFQDNs),
})
const resolver = yupResolver(validationSchema)

<Form
  fields={[
    {
      type: 'multiLine',
      name: 'fqdns',
      label: 'Enter fdns',
      helpLabel: 'Enter FQDNs (one per line)'
    }
  ]}
  resolver={resolver}
/>
```

### Links

- [React Hook Form](https://react-hook-form.com/)
- [YUP](https://github.com/jquense/yup/blob/master/README.md)
