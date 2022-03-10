### ✨ Tabs component

## 🔨 Usage

```tsx
import React, { useState } from 'react'
import Tabs from 'tabs'
import ProfileInfo from 'profile-info'
import ProfilePreferences from 'profile-preferences'

const SettingsView = () => (
  <Tabs
    items={[
      {
        label: 'Profile info',
        component: <ProfileInfo />,
      },
      {
        label: 'Profile preferences',
        component: <ProfilePreferences />,
        //optional param, allows to hide tab
        hidden: true,
      },
      {
        label: 'Profile theme',
        component: <ProfileTheme />,
        //optional param, allows to disable tab
        disabled: true,
      },
    ]}
    onChange={newSelectedTabIndex => console.log('perform custom logic when tab change', newSelectedTabIndex)}
    variant="fullWidth"
  />
)
```
