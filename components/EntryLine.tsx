import { FC, useState } from 'react'
import { PaidEntry } from '../global'
import { formatMoney, formatDate, formatUsd } from '../lib/formatters'

export const EntryLine: FC<{ entry: PaidEntry }> = props => {
  const { entry: { amount, amountUsd, date } } = props
  const [showAmount, setShowAmount] = useState(false)

  const usdPrice = amountUsd / amount
  const usdBalance = amount * usdPrice

  return (
    <li style={{ display: 'flex', gap: '0', columnGap: '1rem', flexWrap: 'wrap' }}>
      {date && <span>{formatDate(date)}</span>}
      {showAmount ? (
        <span onClick={() => setShowAmount(prev => !prev)}>
          {`${formatUsd(usdBalance)}/${formatUsd(amountUsd)}`}
        </span>
      ) : (
        <span onClick={() => setShowAmount(prev => !prev)}>
          {`${formatMoney(amount)}@${formatMoney(usdPrice)}`}
        </span>
      )}
    </li>
  )
}
