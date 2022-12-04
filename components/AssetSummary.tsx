import { FC } from '../global'
import { CoinStats } from '../pages/api/coins/_types'
import { MoneyBadge } from './MoneyBadge'
import { PercentageBadge } from './PercentageBadge'

export const AssetSummary: FC<{ coinStats: CoinStats }> = (props) => {
  const { totalHave, totalSpent } = props.coinStats
  const netProfit = totalHave - totalSpent
  const balanceColor = netProfit < 0 ? 'red' : 'green'

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span>
        <MoneyBadge usdAmount={totalHave} textColor={balanceColor} />
        <span>{'/'}</span>
        <MoneyBadge usdAmount={totalSpent} textColor="" />
      </span>
      <span className="total-have">
        <span>{'['}</span>
        <PercentageBadge percentage={(totalHave / totalSpent) * 100} />
        <span>{' - '}</span>
        <MoneyBadge usdAmount={Math.abs(netProfit)} textColor={balanceColor} />
        <span>{']'}</span>
      </span>
    </div>
  )
}
