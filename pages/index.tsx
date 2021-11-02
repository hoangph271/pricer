import { useState } from 'react'
import Head from 'next/head'
import { signIn, useSession } from 'next-auth/react'
import { formatUsd, formatVnd, formatMoney, formatDate, str2Date } from '../lib/formatters'

import type { CoinStats } from './api/coins'
import type { FC, PaidEntry } from '../global'
import { GetServerSideProps } from 'next'

const MoneyBadge: FC<{ usdAmount: number, usdPrice: number, title?: string, colored?: boolean }> = (props) => {
  const { usdAmount, usdPrice, title, colored = true } = props
  const [showInUsd, setShowInUsd] = useState(true)

  const money = showInUsd ? formatUsd(usdAmount) : formatVnd(usdAmount * usdPrice)

  return (
    <span className="not-badge" onClick={() => setShowInUsd(!showInUsd)}>
      <span className={colored ? `is-${usdAmount > 0 ? 'success' : 'error'}` : ''}>
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
  const { entry: { amount, amountUsd, date } } = props
  const [showAmount, setShowAmount] = useState(false)

  const usdPrice = formatMoney(amountUsd / amount, 2)

  return (
    <li style={{ display: 'flex', gap: '0', columnGap: '1rem', flexWrap: 'wrap' }}>
      <span>{formatDate(date)}</span>
      {showAmount ? (
        <span onClick={() => setShowAmount(prev => !prev)}>
          {`${formatUsd(amountUsd)}`}
        </span>
      ) : (
        <span onClick={() => setShowAmount(prev => !prev)}>
          {`${formatMoney(amount)}@${usdPrice}`}
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
  const { prices, paids, usdPrice } = props.coinStats
  const coinNames = Object.keys(prices)

  const [earnInUsd, setEarnInUsd] = useState(false)
  const [displayCoinName, setDisplayCoinName] = useState(coinNames[0])

  const coinEntries = paids[displayCoinName]
  const totalCoins = coinEntries.reduce((prev, entry) => entry.amount + prev, 0)
  const coinPrice = props.coinStats.prices[displayCoinName] as number
  const coinSpent = coinEntries.reduce((prev, val) => prev + val.amountUsd, 0)
  const coinEarnRatio = coinSpent > 0
    ? (coinPrice * totalCoins) / coinSpent
    : 0

  const coinEntriesByYear: Map<number, PaidEntry[]> = new Map()
  coinEntries.forEach((entry) => {
    const year = str2Date(entry.date).getFullYear()

    if (coinEntriesByYear.has(year)) {
      coinEntriesByYear.get(year)!.push(entry)
    } else {
      coinEntriesByYear.set(year, [entry])
    }
  })

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
          <span>
            <MoneyBadge usdAmount={coinSpent} usdPrice={usdPrice} colored={false} />
          </span>
          <span>{']'}</span>
        </div>
      </div>
      {Array.from(coinEntriesByYear.keys()).map(year => (
        <div key={year}>
          <h4 style={{ fontWeight: 'normal' }}>
          {`- ${year} -`}
          </h4>
          <ul>
            {coinEntriesByYear.get(year)!.map((entry, i) => (
              <Entry entry={entry} key={i} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

const Home: FC<{ coinStats: CoinStats }> = (props) => {
  const { coinStats } = props
  const { status } = useSession({
    required: true,
    onUnauthenticated () {
      signIn()
    }
  })

  if (status !== 'authenticated') return null

  return (
    <div className="home">
      <Head>
        <title>{'#Pricer'}</title>
      </Head>
      <AssetSummary coinStats={coinStats} />
      <CoinPaidSummary coinStats={coinStats} />
    </div>
  )
}

export default Home

const { API_ROOT = 'http://0.0.0.0:3000/api' } = process.env

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await fetch(`${API_ROOT}/coins/`, {
    headers: {
      cookie: ctx.req?.headers?.cookie ?? ''
    }
  })

  console.info('/coins/', res.statusText)

  return {
    props: {
      coinStats: res.ok ? (await res.json() as CoinStats) : null
    }
  }
}
