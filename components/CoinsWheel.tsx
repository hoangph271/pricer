import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { ArcElement, Chart, Tooltip, ChartData } from 'chart.js'
Chart.register(ArcElement, Tooltip)

import { CoinStats } from '../pages/api/coins/_types'
import { PaidEntry } from '../global'
import { formatUsd } from '../lib/formatters'

export const CoinsWheel = ({ coinStats }: { coinStats: CoinStats }) => {
  const router = useRouter()

  const chartData: ChartData<'doughnut', number[], unknown> = useMemo(() => {
    const randomChannelValue = () => Math.floor(Math.random() * (235 - 52 + 1) + 52)
    const randomRgb = () => `rgb(${randomChannelValue()}, ${randomChannelValue()}, ${randomChannelValue()})`
    const sumEntries = (prev: number, val: PaidEntry) => val.amount * coinStats.prices[val.name] + prev

    const coinNames = Object.keys(coinStats.paids).sort((coinName1, coinName2) => {
      const coinSum1 = coinStats.paids[coinName1].reduce(sumEntries, 0)
      const coinSum2 = coinStats.paids[coinName2].reduce(sumEntries, 0)

      return coinSum2 - coinSum1
    })
    const paidEntries = coinNames.map(coinName => coinStats.paids[coinName])

    return {
      labels: coinNames,
      datasets: [{
        data: paidEntries
          .map((entries) => {
            return entries.reduce(sumEntries, 0)
          }),
        backgroundColor: paidEntries
          .map(() => randomRgb()),
      }]
    }
  }, [coinStats])

  return (
    <div
      style={{ height: '200px', width: '200px' }}
    >
      <Doughnut
        data={chartData}
        options={{
          onClick (_, activeElements) {
            const [{ index }] = activeElements
            const coinName = chartData.labels![index]

            router.push(`/?coinName=${coinName}`)
          },
          plugins: {
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