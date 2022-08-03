
/**
 * @jest-environment jsdom
 */
// eslint-disable-next-line no-use-before-define
import React from 'react'
import { render, waitFor, screen, act } from '../lib/test-utils'
import '@testing-library/jest-dom'
import { EntryLine } from './EntryLine'
import { PaidEntry } from '../global'

const mockEntry = {
  isStableCoin: false,
  name: 'ACE',
  date: '2021-11-30 06:02:28',
  amountUsd: 20.40955709,
  amount: 157.154062
}

describe('<EntryLine />', () => {
  const renderEntryLine = (coinPrice: number, mockEntry: PaidEntry) => render(
    <EntryLine
      coinPrice={coinPrice}
      entry={mockEntry}
    />
  )

  test('Can render <EntryLine />', async () => {
    renderEntryLine(0.01, mockEntry)
  })

  test('Correct coin balance value & coloring', async () => {
    renderEntryLine(0.01, mockEntry)

    const coinBalanceEl = await waitFor(() => screen.queryByTestId('coin-balance'))

    expect(coinBalanceEl!.style.color).toEqual('red')
  })

  test('Correct USD balance value & coloring', async () => {
    renderEntryLine(0.01, mockEntry)

    await act(async () => {
      const toggleBtn = await waitFor(() => screen.queryByTestId('toggle-show-amount'))
      toggleBtn!.click()
    })

    const usdBalanceEl = await waitFor(() => screen.queryByTestId('usd-balance'))

    expect(usdBalanceEl!.style.color).toEqual('red')
  })
})
