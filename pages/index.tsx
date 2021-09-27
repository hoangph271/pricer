import { useState } from 'react'
import type { CoinStats } from './api/coins'
import type { FC, PaidEntry } from '../global'

const formatMoney = (amount: number, digits = 4) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(amount)
}
const formatUsd = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(amount)
}
const formatVnd = (amount: number) => {
  return `${Math.floor(amount).toLocaleString()} VND`
}
const formatDate = (date: string) => {
  const _date = new Date(date)

  return _date.toLocaleDateString()
}

const MoneyBadge: FC<{ usdAmount: number, usdPrice: number, title?: string }> = (props) => {
  const { usdAmount, usdPrice, title } = props
  const [showInUsd, setShowInUsd] = useState(true)

  const money = showInUsd ? formatUsd(usdAmount) : formatVnd(usdAmount * usdPrice)

  return (
    <span className="not-badge" onClick={() => setShowInUsd(!showInUsd)}>
      <span className={`is-${usdAmount > 0 ? 'success' : 'error'}`}>
        {title ? (
          <span>{`${title}: ${money}`}</span>
        ) : (
          <span>{money}</span>
        )}
      </span>
    </span>
  )
}

const Entry: FC<{ entry: PaidEntry }> = props => {
  const { entry } = props
  const [showAmount, setShowAmount] = useState(false)

  const usdPrice = formatMoney(entry.amountUsd / entry.amount, 2)

  return (
    <li style={{ display: 'flex', gap: '0', columnGap: '1rem', flexWrap: 'wrap' }}>
      <span>{formatDate(entry.date)}</span>
      {showAmount ? (
        <span onClick={() => setShowAmount(prev => !prev)}>
          {`${formatUsd(entry.amountUsd)}`}
        </span>
      ) : (
        <span onClick={() => setShowAmount(prev => !prev)}>
          {`@${usdPrice}`}
        </span>
      )}
    </li>
  )
}

const AssetSummary: FC<{ coinStats: CoinStats }> = (props) => {
  const { totalHave, totalSpent, usdPrice } = props.coinStats

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span>
        <MoneyBadge usdAmount={totalHave - totalSpent} usdPrice={usdPrice} />
        <span>{'/'}</span>
        <MoneyBadge usdAmount={totalSpent} usdPrice={usdPrice} />
      </span>
      <span className="total-have">
        <span>{'['}</span>
        <MoneyBadge usdAmount={totalHave} usdPrice={usdPrice} />
        <span>{']'}</span>
      </span>
  </div>
  )
}
const CoinPaidSummary: FC<{ coinStats: CoinStats }> = props => {
  const { paids } = props.coinStats
  const coinNames = Object.keys(paids)

  const [earnInUsd, setEarnInUsd] = useState(false)
  const [displayCoinName, setDisplayCoinName] = useState(coinNames[0])

  const coinEntries = paids[displayCoinName]
  const totalCoins = coinEntries.reduce((prev, entry) => entry.amount + prev, 0)
  const coinPrice = (props.coinStats as any)[`${displayCoinName.toLowerCase()}Price`] as number
  const coinSpent = coinEntries.reduce((prev, val) => prev + val.amountUsd, 0)
  const coinEarnRatio = (coinPrice * totalCoins) / coinSpent

  return (
    <div className="col-flex-mini-gap">
      <div className="col-flex-mini-gap">
        <div>
          {coinNames.map(coinName => (
            <button
              key={coinName}
              style={{ margin: '0.4rem' }}
              onClick={() => setDisplayCoinName(coinName)}
              className={`nes-btn is-${coinName === displayCoinName ? 'success' : ''}`}
            >
              {coinName}
            </button>
          ))}
        </div>
      </div>
      <div style={{ margin: '0' }}>
        <div>
          {`${totalCoins.toFixed(4)}@${formatMoney(coinPrice)}`}
        </div>
        <div>
          <span>{'['}</span>
          <span
            onClick={() => setEarnInUsd(prev => !prev)}
            style={{ color: coinEarnRatio > 1 ? 'green' : 'red' }}
          >
            {earnInUsd ? formatUsd((coinEarnRatio - 1) * coinSpent) : `${(coinEarnRatio * 100).toFixed(2)}%`}
          </span>
          <span>{' - '}</span>
          <span>{formatUsd(coinSpent)}</span>
          <span>{']'}</span>
        </div>
      </div>
      <ul>
        {coinEntries.map((entry, i) => (
          <Entry entry={entry} key={i} />
        ))}
      </ul>
    </div>
  )
}

const Home: FC<{ coinStats: CoinStats }> = (props) => {
  const { coinStats } = props

  return (
    <div className="home">
      <AssetSummary coinStats={coinStats} />
      <CoinPaidSummary coinStats={coinStats} />
    </div>
  )
}

export default Home

const { API_ROOT = 'http://0.0.0.0:3000/api' } = process.env

export async function getServerSideProps () {
  const res = await fetch(`${API_ROOT}/coins/`)
  const text = await res.text()

  return {
    props: {
      coinStats: JSON.parse(text) as CoinStats
    }
  }
}
