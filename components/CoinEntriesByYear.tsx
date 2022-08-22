import { FC, useState } from 'react'
import { PaidEntry } from '../global'
import { formatMoney } from '../lib/formatters'
import { EntryLine } from './EntryLine'

export const CoinEntriesByYear: FC<{ year: number, entries: PaidEntry[], coinPrice: number }> = (props) => {
  const { year, entries, coinPrice } = props
  const isThisYear = year === new Date().getFullYear()
  const [isOpen, setIsOpen] = useState(isThisYear)
  const totalCoins = entries.reduce((prev, val) => prev + val.amount, 0)
  const totalSpents = entries.reduce((prev, val) => prev + val.amountUsd, 0)
  const averagePrice = totalSpents / totalCoins
  const { isStableCoin } = entries[0]

  return (
    <div key={year}>
      {isStableCoin || (
        <h4
          style={{ fontWeight: 'normal' }}
          onClick={() => setIsOpen(prev => !prev)}
        >
          {`- ${year} [${formatMoney(totalCoins)}@${formatMoney(averagePrice, 4)}] -`}
        </h4>
      )}
      {isOpen && (
        <ul>
          {entries.map((entry, i) => (
            <EntryLine entry={entry} key={`${i}-${entry.name}`} coinPrice={coinPrice} />
          ))}
        </ul>
      )}
    </div>
  )
}
