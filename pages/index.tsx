import { useState } from 'react'
import type { CoinStats } from './api/coins'
import type { FC, PaidEntry } from '../global'

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
    minimumFractionDigits: 4
  }).format(amount)
}
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
const formatDate = (date: string) => {
  const _date = new Date(date)

  return [
    _date.getDate().toString().padStart(2, '0'),
    (_date.getMonth() + 1).toString().padStart(2, '0')
  ].join('/')
}

const MoneyBadge: FC<{ usdAmount: number, usdPrice: number, title: string }> = (props) => {
  const { usdAmount, usdPrice, title } = props
  const [showInUsd, setShowInUsd] = useState(true)

  const money = showInUsd ? formatUsd(usdAmount) : formatVnd(usdAmount * usdPrice)

  return (
    <div className="not-badge" onClick={() => setShowInUsd(!showInUsd)}>
      <span className={`is-${usdAmount > 0 ? 'success' : 'error'}`}>
        <span>{`${title}: ${money}`}</span>
      </span>
    </div>
  )
}

const Entry: FC<{ entry: PaidEntry }> = props => {
  const { entry } = props
  const [showAmount, setShowAmount] = useState(false)

  return (
    <li>
      <span>{formatDate(entry.date)}</span>
      {showAmount ? (
        <span onClick={() => setShowAmount(prev => !prev)}>
          {`${formatUsd(entry.amountUsd)}`}
        </span>
      ) : (
        <span onClick={() => setShowAmount(prev => !prev)}>
          {`${formatUsd(entry.amountUsd / entry.amountFil).replace(/\$/, '@')}`}
        </span>
      )}
    </li>
  )
}

const Home: FC<{ coinStats: CoinStats }> = (props) => {
  const { balanceChanges, totalFils, filPrice, paidEntries, usdPrice } = props.coinStats

  return (
    <div className="home">
      <p>{`${totalFils.toFixed(4)}@${formatMoney(filPrice)}`}</p>
      <ul>
        {paidEntries.map((entry, i) => (
          <Entry entry={entry} key={i} />
        ))}
      </ul>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <MoneyBadge title="Earn" usdAmount={balanceChanges} usdPrice={usdPrice} />
        <MoneyBadge title="Have" usdAmount={totalFils * filPrice} usdPrice={usdPrice} />
        <MoneyBadge title="Cost" usdAmount={totalFils * filPrice - balanceChanges} usdPrice={usdPrice} />
      </div>
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
