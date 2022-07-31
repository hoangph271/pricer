import { FC, useEffect, useState } from 'react'
import { PaidEntry } from '../global'
import { formatMoney, formatDate, formatUsd } from '../lib/formatters'

export const EntryLine: FC<{ entry: PaidEntry, coinPrice: number }> = props => {
  const { entry: { amount, amountUsd, date, isStableCoin }, coinPrice } = props
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

  const usdPrice = amountUsd / amount
  const usdBalance = amount * coinPrice
  const isAtLost = usdBalance < amountUsd

  return (
    <li style={{ display: 'flex', gap: '0', columnGap: '1rem', flexWrap: 'wrap' }}>
      {date && <span>{formatDate(date)}</span>}
      {showAmount ? (
        <span onClick={toggleShowAmount}>
          <span style={{ color: isAtLost ? 'red' : 'green' }}>
            {formatUsd(usdBalance)}
          </span>
          {`/${formatUsd(amountUsd)}`}
        </span>
      ) : (
        <span onClick={toggleShowAmount}>
          {isAtLost ? '-' : ''}
          {formatMoney(amount)}
          {isStableCoin ? '' : `@${formatMoney(usdPrice)}`}
        </span>
      )}
    </li>
  )
}
