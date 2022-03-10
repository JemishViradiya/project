import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { act, fireEvent, render } from '@testing-library/react'

import { BasicApps as AppActionIcon, BasicGroupUser as GroupUserIcon } from '@ues/assets'

import MultiTierList from './MultiTierList'

const getMultiTierListOptions = () => [
  {
    title: 'FIRST_TIER_OPTION_TITLE_1',
    icon: <GroupUserIcon />,
    showOption: true,
    secondTierOptions: [
      {
        key: 'SECOND_TIER_OPTION_KEY_1',
        title: 'SECOND_TIER_OPTION_TITLE_1',
        showOption: true,
        onClick: '',
        disabled: false,
      },
      {
        key: 'SECOND_TIER_OPTION_KEY_2',
        title: 'SECOND_TIER_OPTION_TITLE_2',
        showOption: true,
        onClick: '',
        disabled: false,
      },
    ],
    noSecondTierOptionsText: 'NO_SECOND_TIER_OPTIONS_AVAILABLE',
    secondTierOptionsAsPopper: true,
  },
  {
    title: 'FIRST_TIER_OPTION_TITLE_2',
    icon: <AppActionIcon />,
    showOption: true,
    secondTierOptionsAsPopper: false,
    secondTierOptions: [
      {
        title: 'SECOND_TIER_OPTION_TITLE_1',
        thirdTierOptions: [
          {
            key: 'THIRD_TIER_OPTION_KEY_1',
            title: 'THIRD_TIER_OPTION_TITLE_1',
            showOption: true,
            onClick: '',
            disabled: false,
          },
          {
            key: 'THIRD_TIER_OPTION_KEY_2',
            title: 'THIRD_TIER_OPTION_TITLE_2',
            showOption: true,
            onClick: console.log,
            disabled: false,
          },
        ],
        showOption: true,
        noThirdTierOptionsText: 'NO_THIRD_TIER_OPTIONS_AVAILABLE',
      },
      {
        title: 'SECOND_TIER_OPTION_TITLE_2',
        onClick: console.log,
        showOption: true,
        disabled: false,
      },
      {
        title: 'SECOND_TIER_OPTION_TITLE_3',
        onClick: console.log,
        showOption: true,
        disabled: false,
      },
    ],
  },
]

const createSut = (listOptions = getMultiTierListOptions()) => {
  return render(<MultiTierList listOptions={listOptions} />)
}

const flushPromises = () => new Promise(setTimeout)

const mouseOverThirdTierOptionOrOptionAsPopper = async (sut, optionText) => {
  const optionToHover = sut.getByText(optionText)
  await act(async () => fireEvent.mouseOver(optionToHover))
  await flushPromises()
}

const clickOnOption = async (sut, optionText) => {
  const optionToClick = sut.getByText(optionText)
  await act(async () => fireEvent.click(optionToClick))
  await flushPromises()
}
describe('MultiTierList component tests', () => {
  describe('basic renders', () => {
    it('renders corectly', () => {
      const sut = createSut()

      expect(sut.getByRole('button')).not.toBeNull()
      expect(sut.getAllByRole('img')).not.toBeNull()
    })

    it('renders corectly a first tier options', () => {
      const sut = createSut()

      expect(sut.getByText('FIRST_TIER_OPTION_TITLE_1')).toBeTruthy()
      expect(sut.getByText('FIRST_TIER_OPTION_TITLE_2')).toBeTruthy()
    })

    it('renders corectly a second tier options after a first tier option is clicked', async () => {
      const sut = createSut()
      await clickOnOption(sut, 'FIRST_TIER_OPTION_TITLE_2')

      expect(sut.getByText('SECOND_TIER_OPTION_TITLE_1')).toBeTruthy()
      expect(sut.getByText('SECOND_TIER_OPTION_TITLE_2')).toBeTruthy()
      expect(sut.getByText('SECOND_TIER_OPTION_TITLE_3')).toBeTruthy()
    })

    it('renders corectly a third tier options after a first tier option is clicked and a second tier option is hovered', async () => {
      const sut = createSut()
      await clickOnOption(sut, 'FIRST_TIER_OPTION_TITLE_2')
      await mouseOverThirdTierOptionOrOptionAsPopper(sut, 'SECOND_TIER_OPTION_TITLE_1')

      expect(sut.getByText('THIRD_TIER_OPTION_TITLE_1')).toBeTruthy()
      expect(sut.getByText('THIRD_TIER_OPTION_TITLE_2')).toBeTruthy()
    })

    it('renders the second tier options as a popper when given options have the secondTierOptionsAsPopper prop set to true', async () => {
      const listOptions = getMultiTierListOptions()
      listOptions[1].secondTierOptionsAsPopper = true

      const sut = createSut(listOptions)
      await mouseOverThirdTierOptionOrOptionAsPopper(sut, 'FIRST_TIER_OPTION_TITLE_2')

      expect(sut.getByText('SECOND_TIER_OPTION_TITLE_1')).toBeTruthy()
      expect(sut.getByText('SECOND_TIER_OPTION_TITLE_2')).toBeTruthy()
      expect(sut.getByText('SECOND_TIER_OPTION_TITLE_3')).toBeTruthy()
    })
  })
  describe('renders when options for the second and third tier are not provided', () => {
    it('renders noSecondTierOptionsText after hover, when options for a second tier are not provided and are set to display as a popper', async () => {
      const listOptions = getMultiTierListOptions()
      listOptions[0].secondTierOptions = []

      const sut = createSut(listOptions)
      await mouseOverThirdTierOptionOrOptionAsPopper(sut, 'FIRST_TIER_OPTION_TITLE_1')

      expect(sut.getByText('NO_SECOND_TIER_OPTIONS_AVAILABLE')).toBeTruthy()
    })

    it('renders noThirdTierOptionsText after a first tier option is clicked and a second tier option is hovered when options for a third tier are not provided ', async () => {
      const listOptions = getMultiTierListOptions()
      listOptions[1].secondTierOptions[0].thirdTierOptions = []

      const sut = createSut(listOptions)
      await clickOnOption(sut, 'FIRST_TIER_OPTION_TITLE_2')
      await mouseOverThirdTierOptionOrOptionAsPopper(sut, 'SECOND_TIER_OPTION_TITLE_1')

      expect(sut.getByText('NO_THIRD_TIER_OPTIONS_AVAILABLE')).toBeTruthy()
    })
  })

  describe('renders when showOption is set to true', () => {
    it('does not render the first tier option if the given option has a prop showOption set to false', async () => {
      const listOptions = getMultiTierListOptions()
      listOptions[1].showOption = false

      const sut = createSut(listOptions)

      expect(sut.queryByText('FIRST_TIER_OPTION_TITLE_1')).toBeTruthy()
      expect(sut.queryByText('FIRST_TIER_OPTION_TITLE_2')).toBeFalsy()
    })

    it('does not render the second tier option if the given option has a prop showOption set to false', async () => {
      const listOptions = getMultiTierListOptions()
      listOptions[1].secondTierOptions[0].showOption = false

      const sut = createSut(listOptions)
      await clickOnOption(sut, 'FIRST_TIER_OPTION_TITLE_2')

      expect(sut.queryByText('SECOND_TIER_OPTION_TITLE_1')).toBeFalsy()
      expect(sut.queryByText('SECOND_TIER_OPTION_TITLE_2')).toBeTruthy()
    })

    it('does not render the third tier option if the given option has a prop showOption set to false', async () => {
      const listOptions = getMultiTierListOptions()
      listOptions[1].secondTierOptions[0].thirdTierOptions[0].showOption = false

      const sut = createSut(listOptions)
      await clickOnOption(sut, 'FIRST_TIER_OPTION_TITLE_2')
      await mouseOverThirdTierOptionOrOptionAsPopper(sut, 'SECOND_TIER_OPTION_TITLE_1')

      expect(sut.queryByText('THIRD_TIER_OPTION_TITLE_2')).toBeTruthy()
      expect(sut.queryByText('THIRD_TIER_OPTION_TITLE_1')).toBeFalsy()
    })
  })

  describe('renders when an option is disabled', () => {
    it('disable a second tier option if the given option has a prop disabled set to true', async () => {
      const listOptions = getMultiTierListOptions()
      listOptions[1].secondTierOptions[1].disabled = true

      const sut = createSut(listOptions)
      await clickOnOption(sut, 'FIRST_TIER_OPTION_TITLE_2')

      expect(sut.getByText('SECOND_TIER_OPTION_TITLE_2').parentElement).toHaveClass('disabledOption')
      expect(sut.getByText('SECOND_TIER_OPTION_TITLE_3').parentElement).not.toHaveClass('disabledOption')
    })

    it('disable a third tier option if the given option has a prop disabled set to true', async () => {
      const listOptions = getMultiTierListOptions()
      listOptions[1].secondTierOptions[0].thirdTierOptions[0].disabled = true

      const sut = createSut(listOptions)
      await clickOnOption(sut, 'FIRST_TIER_OPTION_TITLE_2')
      await mouseOverThirdTierOptionOrOptionAsPopper(sut, 'SECOND_TIER_OPTION_TITLE_1')

      expect(sut.getByText('THIRD_TIER_OPTION_TITLE_1').parentElement).toHaveClass('disabledOption')
      expect(sut.getByText('THIRD_TIER_OPTION_TITLE_2').parentElement).not.toHaveClass('disabledOption')
    })
  })

  describe('triggers click function on click', () => {
    it('triggers click function on click on a second tier option displayed as the popper', async () => {
      const listOptions = getMultiTierListOptions()
      const mockedClickOptionFn = jest.fn()
      listOptions[0].secondTierOptions[0].onClick = mockedClickOptionFn

      const sut = createSut(listOptions)
      await mouseOverThirdTierOptionOrOptionAsPopper(sut, 'FIRST_TIER_OPTION_TITLE_1')
      await clickOnOption(sut, 'SECOND_TIER_OPTION_TITLE_1')

      expect(mockedClickOptionFn).toBeCalledTimes(1)
    })

    it('triggers click function on click on a second tier option', async () => {
      const listOptions = getMultiTierListOptions()
      const mockedClickOptionFn = jest.fn()
      listOptions[1].secondTierOptions[1].onClick = mockedClickOptionFn

      const sut = createSut(listOptions)
      await clickOnOption(sut, 'FIRST_TIER_OPTION_TITLE_2')
      await clickOnOption(sut, 'SECOND_TIER_OPTION_TITLE_2')

      expect(mockedClickOptionFn).toBeCalledTimes(1)
    })

    it('triggers click function on click on a third tier option', async () => {
      const listOptions = getMultiTierListOptions()
      const mockedClickOptionFn = jest.fn()
      listOptions[1].secondTierOptions[0].thirdTierOptions[1].onClick = mockedClickOptionFn

      const sut = createSut(listOptions)
      await clickOnOption(sut, 'FIRST_TIER_OPTION_TITLE_2')
      await mouseOverThirdTierOptionOrOptionAsPopper(sut, 'SECOND_TIER_OPTION_TITLE_1')
      await clickOnOption(sut, 'THIRD_TIER_OPTION_TITLE_2')

      expect(mockedClickOptionFn).toBeCalledTimes(1)
    })
  })
})
