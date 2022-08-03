import { FC, useEffect, useState } from 'react'
import { PaidEntry } from '../global'
import { formatMoney, formatDate, formatUsd } from '../lib/formatters'
import { getColor } from '../lib/utils'

export const EntryLine: FC<{ entry: PaidEntry, coinPrice: number }> = props => {
  const { entry: { amount, amountUsd: spentUsd, date, isStableCoin }, coinPrice } = props
  const [showAmount, setShowAmount] = useState(false)

  useEffect(() => {
    if (isStableCoin) {
      setShowAmount(false)
    }
  }, [isStableCoin])

  const toggleShowAmount = () => {
    if (isStableCoin) return

    setShowAmount(prev => !prev)
  }

  const usdPrice = spentUsd / amount
  const usdBalance = amount * coinPrice

  return (
    <li style={{ display: 'flex', gap: '0', columnGap: '1rem', flexWrap: 'wrap' }}>
      {date && <span>{formatDate(date)}</span>}
      {showAmount ? (
        <span data-testid="toggle-show-amount" onClick={toggleShowAmount}>
          <span
            data-testid="usd-balance"
            style={{ color: getColor(usdBalance, spentUsd) }}
          >
            {formatUsd(usdBalance)}
          </span>
          {`/${formatUsd(spentUsd)}`}
        </span>
      ) : (
        <span onClick={toggleShowAmount} data-testid="toggle-show-amount">
          <span
            data-testid="coin-balance"
            style={{ color: getColor(usdBalance, spentUsd) }}
          >
            {formatMoney(amount)}
          </span>
          <span>{isStableCoin ? '' : `@${formatMoney(usdPrice)}`}</span>
        </span>
      )}
    </li>
  )
}
