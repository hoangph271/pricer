import { FC, useState } from 'react'
import Router from 'next/router'
import { Chart, LinearScale, PointElement } from 'chart.js'
import { Bubble } from 'react-chartjs-2'

import { formatMoney } from '../lib/formatters'
import { queryCoinNameOrDefault } from '../lib/utils'
import { CoinApiRecord, CoinStats } from '../pages/api/coins/_types'
import { MoneyBadge } from './MoneyBadge'
import { PercentageBadge } from './PercentageBadge'

Chart.register(LinearScale, PointElement)

export const CoinPaidSummary: FC<{ coinStats: CoinStats }> = props => {
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
  const maxAmount = coinEntries.sort((e1, e2) => e2.amount - e1.amount)[0].amount
  const coinSpent = coinEntries.reduce((prev, val) => {
    if (val.isStableCoin && val.amountUsd < 0) return prev

    return prev + val.amountUsd
  }, 0)
  const coinEarnRatio = coinSpent > 0
    ? (coinPrice * totalCoins) / coinSpent
    : 0

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
              <CoinDetails
                coinRecord={apiResponse[queryCoinName]}
                totalCoins={totalCoins}
                coinSpent={coinSpent}
              />
            )}
          </div>
          <div>
            <span>{'['}</span>
            {isStableCoin || (
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
      <Bubble
        data={{
          datasets: [{
            label: `${queryCoinName} - ${formattedTotalCoin}@${formatMoney(coinPrice)}`,
            data: coinEntries.map(entry => ({
              x: new Date(entry.date).getTime(),
              y: entry.amountUsd / entry.amount,
              r: entry.amount / maxAmount * 10,
            }))
          }]
        }}
        options={{
          plugins: {
            tooltip: {
              callbacks: {
                label (val) {
                  const { x, y: price, r: amountUsd } = val.raw as Record<string, number>
                  const date = new Date(x).toLocaleDateString()
                  const amount = formatMoney(amountUsd / price)

                  return `${amount}@${formatMoney(price)} in ${date}`
                }
              }
            }
          },
          elements: {
            point: {
              backgroundColor (val) {
                const { y: price } = val.raw as { y: number }

                return price > coinPrice ? 'red' : 'green'
              },
            }
          },
          scales: {
            x: {
              ticks: {
                callback (val) {
                  const date = new Date(val)
                  return `${date.getMonth() + 1}/${date.getFullYear()}`
                }
              }
            }
          }
        }}
      />
    </div>
  )
}

// const getCoinEntriesByYear = (coinEntries: PaidEntry[]) => {
//   const coinEntriesByYear: Map<number, PaidEntry[]> = new Map()

//   coinEntries.forEach((entry) => {
//     const year = str2Date(entry.date).getFullYear()

//     if (coinEntriesByYear.has(year)) {
//       coinEntriesByYear.get(year)!.push(entry)
//     } else {
//       coinEntriesByYear.set(year, [entry])
//     }
//   })

//   return coinEntriesByYear
// }

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
