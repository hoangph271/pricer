import { FC } from 'react'
import Router from 'next/router'
import { Chart, LinearScale, PointElement, Title, Legend } from 'chart.js'
import { Bubble } from 'react-chartjs-2'

import { formatMoney } from '../lib/formatters'
import { queryCoinNameOrDefault } from '../lib/utils'
import { CoinStats } from '../pages/api/coins/_types'

Chart.register(LinearScale, PointElement, Title, Legend)

export const CoinPaidSummary: FC<{ coinStats: CoinStats }> = props => {
  const { coinStats } = props
  const { prices, paids } = coinStats
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
  const totalValue = totalCoins * coinPrice
  const coinSpent = coinEntries.reduce((prev, val) => {
    if (val.isStableCoin && val.amountUsd < 0) return prev

    return prev + val.amountUsd
  }, 0)
  const coinEarnRatio = coinSpent > 0
    ? (coinPrice * totalCoins) / coinSpent
    : 0

  const { isStableCoin } = coinEntries[0]
  const formattedTotalCoin = formatMoney((isStableCoin
    ? Math.abs(totalCoins)
    : totalCoins))

  return (
    <div className="col-flex-mini-gap">
      <Bubble
        data={{
          datasets: [{
            label: `${queryCoinName}@${formatMoney(coinPrice)} - ${formattedTotalCoin} buy at $${formatMoney(coinSpent / totalCoins)}`,
            data: coinEntries.map(entry => ({
              x: new Date(entry.date).getTime(),
              y: entry.amountUsd / entry.amount,
              r: entry.amount / maxAmount * 10,
            }))
          }]
        }}
        options={{
          plugins: {
            legend: {
              labels: {
                padding: 4,
                font: {
                  weight: 'normal',
                  family: 'monospace'
                },
                usePointStyle: true,
              }
            },
            title: {
              display: true,
              padding: 0,
              text: [
                `$${formatMoney(totalValue)}/$${formatMoney(coinSpent)} (${(coinEarnRatio * 100).toFixed(2)}%)`,
              ],
              font: {
                weight: 'normal',
                family: 'monospace'
              }
            },
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

                return price > coinPrice
                  ? 'rgba(235, 0, 0, 0.9)'
                  : 'rgba(0, 225, 0, 0.8)'
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
