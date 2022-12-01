import { FC } from 'react'
import Router from 'next/router'
import { Chart as ChartJs, LinearScale, PointElement, Title, Legend, LineElement, CategoryScale } from 'chart.js'
import { Chart } from 'react-chartjs-2'

import { formatMoney } from '../lib/formatters'
import { queryCoinNameOrDefault } from '../lib/utils'
import { CoinStats } from '../pages/api/coins/_types'

ChartJs.register(LinearScale, PointElement, Title, Legend, LineElement, CategoryScale)

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
      <Chart
        type="bubble"
        data={{
          datasets: [
            {
              type: 'bubble' as const,
              label: `${formattedTotalCoin}@${formatMoney(coinSpent / totalCoins)}`,
              data: coinEntries.map(entry => ({
                x: new Date(entry.date).getTime(),
                y: entry.amountUsd / entry.amount,
                r: entry.amount / maxAmount * 10,
              }))
            },
            {
              type: 'line' as const,
              label: `${queryCoinName}@${formatMoney(coinPrice)}`,
              backgroundColor: 'rgb(99, 235, 99)',
              borderColor: 'rgb(99, 235, 99)',
              borderWidth: 1,
              pointRadius: 1,
              fill: false,
              data: coinEntries.map((entry) => ({
                x: new Date(entry.date).getTime(),
                y: coinPrice,
                r: 1
              })),
            }
          ]
        }}
        options={{
          plugins: {
            legend: {
              labels: {
                padding: 4,
                font: {
                  weight: 'bold',
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
                  const { date, amountUsd, amount } = coinEntries[val.dataIndex]
                  const dateStr = new Date(date).toLocaleDateString()
                  const price = amountUsd / amount

                  return `${amount}@$${formatMoney(price)} in ${dateStr}`
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
