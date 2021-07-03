import { FC, useState } from 'react'
import type { CoinStats } from './api/coins'

const formatUsd = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 4,
    minimumFractionDigits: 4
  }).format(amount)
}
const formatVnd = (amount: number) => {
  return `${Math.floor(amount).toLocaleString()} VND`
}
const sheetsDayToDate = (days: number) => {
  const dayZero = new Date('1899-12-31T16:53:20.000Z')
  dayZero.setDate(dayZero.getDate() + days)

  return dayZero
}

const MoneyBadge: FC<{ usdAmount: number, usdPrice: number }> = (props) => {
  const { usdAmount, usdPrice } = props
  const [showInUsd, setShowInUsd] = useState(true)

  return (
    <div className="nes-badge" onClick={() => setShowInUsd(!showInUsd)} style={{ width: '13rem' }}>
      <span className={`is-${usdAmount > 0 ? 'success' : 'error'}`}>
        <span>{showInUsd ? formatUsd(usdAmount) : formatVnd(usdAmount * usdPrice)}</span>
      </span>
    </div>
  )
}
const Home: FC<{ coinStats: CoinStats }> = (props) => {
  const { balanceChanges, totalFils, filPrice, paidEntries, usdPrice } = props.coinStats

  return (
    <div>
      <MoneyBadge usdAmount={balanceChanges} usdPrice={usdPrice} />
      <h3 style={{ color: balanceChanges > 0 ? '#78b861' : '#d82525', fontWeight: 'bold' }}>
      </h3>
      <p>{`${totalFils} FIL at ${formatUsd(filPrice)}`}</p>
      <ul>
        {paidEntries.map(([time, amount], i) => (
          <li key={i}>
            <span>{sheetsDayToDate(time).toLocaleDateString()}</span>
            <span>{' - '}</span>
            <span>{formatUsd(amount)}</span>
          </li>
        ))}
      </ul>
      <MoneyBadge usdAmount={totalFils * filPrice} usdPrice={usdPrice} />
    </div>
  )
}

export default Home

const { API_ROOT = 'http://0.0.0.0:3000/api' } = process.env

export async function getServerSideProps () {
  const res = await fetch(`${API_ROOT}/coins/`)

  return {
    props: {
      coinStats: await res.json() as CoinStats
    }
  }
}
