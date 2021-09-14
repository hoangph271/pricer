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
          {`${formatUsd(entry.amountUsd / entry.amount).replace(/\$/, '@')}`}
        </span>
      )}
    </li>
  )
}

const Home: FC<{ coinStats: CoinStats }> = (props) => {
  const { totalHave, totalSpent, paids, usdPrice } = props.coinStats
  const [coinName, setCoinName] = useState('FIL')

  const coinEntries = paids[coinName]
  const totalCoins = coinEntries.reduce((prev, entry) => entry.amount + prev, 0)
  const coinPrice = (props.coinStats as any)[`${coinName.toLowerCase()}Price`] as number

  return (
    <div className="home">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <MoneyBadge title="Earn" usdAmount={totalHave - totalSpent} usdPrice={usdPrice} />
        <MoneyBadge title="Have" usdAmount={totalHave} usdPrice={usdPrice} />
        <MoneyBadge title="Cost" usdAmount={totalSpent} usdPrice={usdPrice} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100vw' }}>
        <div>
          <button
            className={`nes-btn is-${coinName === 'FIL' ? 'success' : ''}`}
            onClick={() => setCoinName('FIL')}
          >
            FIL
          </button>
          <button
            className={`nes-btn is-${coinName === 'ADA' ? 'success' : ''}`}
            onClick={() => setCoinName('ADA')}
          >
            ADA
          </button>
        </div>
        <p style={{ margin: '0' }}>
          {`${totalCoins.toFixed(4)}@${formatMoney(coinPrice)}`}
        </p>
      </div>
      <ul>
        {coinEntries.map((entry, i) => (
          <Entry entry={entry} key={i} />
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
