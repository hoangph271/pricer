import { useEffect, useState } from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'

import { formatMoney, str2Date } from '../lib/formatters'

import type { CoinStats } from './api/coins'
import type { FC, PaidEntry } from '../global'
import { API_ROOT } from '../lib/constants'

import { MoneyBadge, PercentageBadge, EntryLine } from '../components'
import { queryCoinNameOrDefault } from '../lib/utils'

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

  const { prices, paids, usdPrice } = coinStats
  const coinNames = Object.keys(prices)

  // ! FIXME: Maybe redirect...?
  const displayCoinName = queryCoinNameOrDefault(paids, coinNames[0])

  const [earnInUsd, setEarnInUsd] = useState(false)

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
              <EntryLine entry={entry} key={i} />
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
