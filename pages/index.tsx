import { FC } from 'react'
import type { CoinStats } from './api/coins'

const formatUsd = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 4,
    minimumFractionDigits: 4
  }).format(amount)
}
const sheetsDayToDate = (days: number) => {
  const dayZero = new Date('1899-12-31T16:53:20.000Z')
  dayZero.setDate(dayZero.getDate() + days)

  return dayZero
}

const Home: FC<{ coinStats: CoinStats }> = (props) => {
  const { balanceChanges, totalFils, filPrice, paidEntries } = props.coinStats

  return (
    <div>
      <div className="nes-badge">
        <span className={`is-${balanceChanges > 0 ? 'success' : 'error'}`}>
          {formatUsd(balanceChanges)}
        </span>
      </div>
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
