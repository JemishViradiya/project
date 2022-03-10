import React, { useCallback, useMemo } from 'react'
import type { Namespace } from 'react-i18next'
import { useTranslation } from 'react-i18next'

import { Tab } from '@material-ui/core'

import { usePropDrivenState } from '@ues-behaviour/react'
import { useFeatures } from '@ues-data/shared'

import type { UesTabsProps } from './Tabs'

type TabProps<T> = T & {
  component: React.ReactNode
  disabled?: boolean
  hidden?: boolean
  translations: {
    label: string
  }
  features?: string[]
}

export interface StatefulTabProps<T> {
  tabs: TabProps<T>[]
  /**
   * i18n namespace(s) to load translations required by tabs[].translations.label
   */
  tNs: Namespace
  defaultSelectedTabIndex?: number
  onChange?: (value: number, tabs?: TabProps<T>) => void
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const useStatefulTabsProps = <T extends {} = {}>({
  defaultSelectedTabIndex,
  tabs,
  onChange: onChangeProp,
  tNs,
}: StatefulTabProps<T>): Pick<UesTabsProps, 'value' | 'onChange' | 'children' | 'tabs'> => {
  const { t } = useTranslation(tNs)
  const [value, setValue] = usePropDrivenState<number>(defaultSelectedTabIndex)
  const { isEnabled } = useFeatures()

  const filteredTabs = useMemo(
    () => tabs.filter(tab => !tab.hidden && (!tab.features || tab.features.filter(isEnabled).length === tab.features.length)),
    [tabs, isEnabled],
  )

  const onChange: UesTabsProps['onChange'] = useCallback(
    (event: React.ChangeEvent | React.FormEvent, value?: number) => {
      setValue(value)
      if (onChangeProp) onChangeProp(value, filteredTabs[value])
    },
    [filteredTabs, onChangeProp, setValue],
  )

  return {
    value,
    onChange,
    tabs: filteredTabs.map((tab, index) => (
      <Tab key={index} value={index} label={t(tab.translations?.label)} disabled={tab.disabled} />
    )),
    children: filteredTabs[String(value)]?.component,
  }
}
