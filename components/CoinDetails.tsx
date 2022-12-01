import { FC, useState } from 'react'
import { formatMoney } from '../lib/formatters'
import { CoinApiRecord } from '../pages/api/coins/_types'
import { PercentageBadge } from './PercentageBadge'

export const CoinDetails: FC<{
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
