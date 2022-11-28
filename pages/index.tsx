import { useEffect, useState } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import { GetServerSideProps } from 'next'
import { signIn, useSession } from 'next-auth/react'

import { formatMoney, str2Date } from '../lib/formatters'

import type { FC, PaidEntry } from '../global'
import { API_ROOT } from '../lib/constants'

import { MoneyBadge, PercentageBadge, CoinEntriesByYear, AssetSummary } from '../components'
import { queryCoinNameOrDefault } from '../lib/utils'
import { CoinApiRecord, CoinStats } from './api/coins/_types'
import { CoinsWheel } from '../components/CoinsWheel'

const CoinDetails: FC<{
  totalCoins: number,
  coinSpent: number,
  coinRecord: CoinApiRecord,
}> = (props) => {
  const { coinSpent, totalCoins, coinRecord } = props
  const [showMore, setShowMore] = useState(false)

  const usdQuote = coinRecord.quote.USD

  return showMore ? (
    <div
      className="nes-container is-centered"
    >
      <div onClick={() => setShowMore(false)}>
        {`•DCA@${formatMoney(coinSpent / totalCoins)}•`}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {[
          usdQuote.percent_change_1h,
          usdQuote.percent_change_24h,
          usdQuote.percent_change_7d,
          usdQuote.percent_change_60d,
        ]
          .map((percentage, i) => (
            <PercentageBadge
              key={i}
              percentage={percentage}
              compareTo={0}
            />
          ))}
      </div>
    </div>
  ) : (
    <div onClick={() => setShowMore(true)}>
      {`•DCA@${formatMoney(coinSpent / totalCoins)}•`}
    </div>
  )
}

const getCoinEntriesByYear = (coinEntries: PaidEntry[]) => {
  const coinEntriesByYear: Map<number, PaidEntry[]> = new Map()

  coinEntries.forEach((entry) => {
    const year = str2Date(entry.date).getFullYear()

    if (coinEntriesByYear.has(year)) {
      coinEntriesByYear.get(year)!.push(entry)
    } else {
      coinEntriesByYear.set(year, [entry])
    }
  })

  return coinEntriesByYear
}
const CoinPaidSummary: FC<{ coinStats: CoinStats }> = props => {
  const { coinStats } = props
  const [earnInUsd, setEarnInUsd] = useState(false)

  const { prices, paids, usdPrice, apiResponse } = coinStats
  const allCoinNames = Object.keys(prices)
  const queryCoinName = queryCoinNameOrDefault(allCoinNames)

  if (queryCoinName === null) {
    Router.push(`/?coinName=${allCoinNames[0]}`)
    return null
  }

  const coinEntries = paids[queryCoinName]
  const totalCoins = coinEntries.reduce((prev, entry) => entry.amount + prev, 0)
  const coinPrice = coinStats.prices[queryCoinName] as number
  const coinSpent = coinEntries.reduce((prev, val) => {
    if (val.isStableCoin && val.amountUsd < 0) return prev

    return prev + val.amountUsd
  }, 0)
  const coinEarnRatio = coinSpent > 0
    ? (coinPrice * totalCoins) / coinSpent
    : 0

  const coinEntriesByYear = getCoinEntriesByYear(coinEntries)

  const { isStableCoin } = coinEntries[0]
  const formattedTotalCoin = (isStableCoin
    ? Math.abs(totalCoins)
    : totalCoins).toFixed(totalCoins > 1000 ? 0 : 4)

  return (
    <div className="col-flex-mini-gap">
      <div className="col-flex-mini-gap row-flex small-gap" id="coin-metadata">
        <div style={{ margin: '0' }}>
          <div>
            {isStableCoin || (
              <div>
                {formattedTotalCoin}
                @
                {formatMoney(coinPrice)}
              </div>
            )}
            {isStableCoin || (
              <CoinDetails
                coinRecord={apiResponse[queryCoinName]}
                totalCoins={totalCoins}
                coinSpent={coinSpent}
              />
            )}
          </div>
          <div>
            <span>{'['}</span>
            {isStableCoin ? null : (
              <>
                <span onClick={() => setEarnInUsd(prev => !prev)}>
                  {earnInUsd ? (
                    <span>
                      <MoneyBadge
                        usdAmount={coinEarnRatio * coinSpent}
                        usdPrice={usdPrice}
                        compareTo={coinSpent}
                      />
                    </span>
                  ) : (
                    <PercentageBadge percentage={coinEarnRatio * 100} />
                  )}
                </span>
                <span>{' - '}</span>
              </>
            )}
            <span>
              <MoneyBadge
                usdPrice={usdPrice}
                usdAmount={coinSpent}
                textColor=""
              />
            </span>
            <span>{']'}</span>
          </div>
        </div>
      </div>
      {[...coinEntriesByYear].map(([year, entries]) => {
        const [{ name }] = entries

        return (
          <CoinEntriesByYear
            key={year}
            year={year}
            entries={entries}
            coinPrice={coinStats.prices[name]}
          />
        )
      })}
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CoinsWheel coinStats={coinStats} />
        <AssetSummary coinStats={coinStats} />
      </div>
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
