import { useEffect, useState } from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { formatUsd, formatVnd, formatMoney, formatDate, str2Date } from '../lib/formatters'

import type { CoinStats } from './api/coins'
import type { FC, PaidEntry } from '../global'

const getColor = (colored: boolean | string, usdAmount: number) => {
  if (typeof colored === 'string') return colored

  if (colored) {
    return usdAmount < 0 ? 'red' : 'green'
  }

  return ''
}
const MoneyBadge: FC<{ usdAmount: number, usdPrice: number, title?: string, colored?: boolean | string }> = (props) => {
  const { usdAmount, usdPrice, title, colored = true } = props
  const [showInUsd, setShowInUsd] = useState(true)

  const money = showInUsd ? formatUsd(usdAmount) : formatVnd(usdAmount * usdPrice)

  return (
    <span className="not-badge" onClick={() => setShowInUsd(!showInUsd)}>
      <span style={{ color: getColor(colored, usdAmount) }}>
        {title ? (
          <span>{`${title}: ${money}`}</span>
        ) : (
          <span>{money}</span>
        )}
      </span>
    </span>
  )
}
const PercentageBadge: FC<{ percentage: number }> = props => {
  const { percentage } = props

  return (
    <span style={{ color: percentage < 100 ? 'red' : 'green' }}>
      {percentage.toFixed(2)}%
    </span>
  )
}

const Entry: FC<{ entry: PaidEntry }> = props => {
  const { entry: { amount, amountUsd, date } } = props
  const [showAmount, setShowAmount] = useState(false)

  const usdPrice = formatMoney(amountUsd / amount)

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
        <PercentageBadge percentage={(totalHave / totalSpent) * 100} />
        <span>{' - '}</span>
        <MoneyBadge usdAmount={totalHave} usdPrice={usdPrice} />
        <span>{']'}</span>
      </span>
  </div>
  )
}
const CoinPaidSummary: FC<{ coinStats: CoinStats }> = props => {
  const { coinStats } = props
  const searchParams = new URLSearchParams(location.search)

  const { prices, paids, usdPrice } = coinStats
  const coinNames = Object.keys(prices)
  const displayCoinName = searchParams.get('coinName') ?? coinNames[0]

  const [earnInUsd, setEarnInUsd] = useState(false)
  // const [displayCoinName, setDisplayCoinName] = useState()

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
            <Link
              href={`/?coinName=${coinName}`}
              key={coinName}
            >
              <button
                style={{ margin: '0.4rem' }}
                className={`nes-btn is-${coinName === displayCoinName ? 'success' : ''}`}
              >
                {coinName}
              </button>
            </Link>
          ))}
        </div>
      </div>
      <div style={{ margin: '0' }}>
        <div>
          {`${totalCoins.toFixed(totalCoins > 1000 ? 0 : 4)}@${formatMoney(coinPrice)}`}
        </div>
        <div>
          <span>{'['}</span>
          <span onClick={() => setEarnInUsd(prev => !prev)}>
            {earnInUsd ? (
              <span>
                <MoneyBadge
                  usdAmount={(coinEarnRatio - 1) * coinSpent}
                  usdPrice={usdPrice}
                />
              </span>
            ) : (
              <PercentageBadge percentage={coinEarnRatio * 100} />
            )}
          </span>
          <span>{' - '}</span>
          <span>
            <MoneyBadge
              usdPrice={usdPrice}
              usdAmount={coinSpent}
              colored={coinEarnRatio < 1 ? 'red' : 'green'}
            />
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
  const [coinStats] = useState(props.coinStats)
  const [showRefresh, setShowRefresh] = useState(false)
  const { status } = useSession({
    required: true,
    onUnauthenticated () {
      signIn()
    }
  })

  useEffect(() => {
    if (!showRefresh) return

    const timer = setTimeout(() => {
      setShowRefresh(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [showRefresh])

  if (status !== 'authenticated') return null

  return (
    <div className={'home'}
    >
        <Head>
          <title>{'#Pricer'}</title>
        </Head>
        <AssetSummary coinStats={coinStats} />
        <CoinPaidSummary coinStats={coinStats} />
    </div>
  )
}

export default Home

const API_ROOT = process.env.API_ROOT ?? 'http://localhost:3000/api'

const fetchCoinStats = async (cookie: string) => {
  const res = await fetch(`${API_ROOT}/coins/`, {
    headers: {
      cookie
    }
  })

  console.info('/coins/', res.statusText)

  return res.ok
    ? await res.json() as CoinStats
    : null
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const coinStats = await fetchCoinStats(ctx.req?.headers?.cookie ?? '')

  return {
    props: {
      coinStats
    }
  }
}
