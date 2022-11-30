import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { ArcElement, Chart, Tooltip, ChartData, Legend } from 'chart.js'

import { CoinStats } from '../pages/api/coins/_types'
import { PaidEntry } from '../global'
import { formatUsd } from '../lib/formatters'

Chart.register(ArcElement, Tooltip, Legend)

const randomChannelValue = () => Math.floor(Math.random() * (235 - 52 + 1) + 52)
const randomRgb = () => `rgb(${randomChannelValue()}, ${randomChannelValue()}, ${randomChannelValue()})`

export const CoinsWheel = ({ coinStats }: { coinStats: CoinStats }) => {
  const router = useRouter()
  const [showAll] = useState(false)

  const chartData: ChartData<'doughnut', number[], unknown> = useMemo(() => {
    const sumEntries = (entries: PaidEntry[]) => {
      return entries.reduce((prev, val) => val.amount * coinStats.prices[val.name] + prev, 0)
    }
    const sumSpentEntries = (entries: PaidEntry[]) => {
      return entries.reduce((prev, val) => val.amountUsd + prev, 0)
    }

    const coinNames = Object.keys(coinStats.paids)
      .filter((coinName) => {
        const coinSum = sumSpentEntries(coinStats.paids[coinName])

        return showAll || (coinSum > 0)
      })
      .sort((coinName1, coinName2) => {
        const coinSum1 = sumEntries(coinStats.paids[coinName1])
        const coinSum2 = sumEntries(coinStats.paids[coinName2])

        return coinSum2 - coinSum1
      })
    const paidEntries = coinNames.map(coinName => coinStats.paids[coinName])

    return {
      labels: coinNames,
      datasets: [{
        data: paidEntries.map(sumEntries),
        backgroundColor: paidEntries.map(randomRgb),
      }]
    }
  }, [coinStats, showAll])

  return (
    <div
      style={{ height: '200px', width: '600px', overflowX: 'auto', maxWidth: '100%' }}
    >
      <Doughnut
        style={{ margin: 'auto', height: 400 }}
        data={chartData}
        options={{
          aspectRatio: 3,
          onClick (_, [activeElement]) {
            if (!activeElement) return

            const coinName = chartData.labels![activeElement.index]
            router.push(`/?coinName=${coinName}`)
          },
          plugins: {
            legend: {
              position: 'right',
            },
            tooltip: {
              callbacks: {
                label (context) {
                  return `${context.label} - ${formatUsd(context.parsed)}`
                }
              }
            }
          }
        }}
      />
    </div>
  )
}
