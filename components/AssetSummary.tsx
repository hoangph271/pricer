import { FC } from '../global'
import { CoinStats } from '../pages/api/coins/_types'
import { MoneyBadge } from './MoneyBadge'
import { PercentageBadge } from './PercentageBadge'

export const AssetSummary: FC<{ coinStats: CoinStats }> = (props) => {
  const { totalHave, totalSpent, usdPrice } = props.coinStats
  const netProfit = totalHave - totalSpent
  const balanceColor = netProfit < 0 ? 'red' : 'green'

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span>
        <MoneyBadge usdAmount={totalHave} usdPrice={usdPrice} textColor={balanceColor} />
        <span>{'/'}</span>
        <MoneyBadge usdAmount={totalSpent} usdPrice={usdPrice} textColor="" />
      </span>
      <span className="total-have">
        <span>{'['}</span>
        <PercentageBadge percentage={(totalHave / totalSpent) * 100} />
        <span>{' - '}</span>
        <MoneyBadge usdAmount={netProfit} usdPrice={usdPrice} textColor={balanceColor} />
        <span>{']'}</span>
      </span>
    </div>
  )
}
