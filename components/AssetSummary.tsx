import { useCallback, useState } from 'react'
import { FC } from '../global'
import { CoinStats } from '../pages/api/coins/_types'
import { MoneyBadge } from './MoneyBadge'
import { PercentageBadge } from './PercentageBadge'

const useToggle = (initVal: boolean): [boolean, () => void] => {
  const [value, setValue] = useState(initVal)

  const toggleValue = useCallback(() => {
    setValue(prev => !prev)
  }, [])

  return [value, toggleValue]
}

export const AssetSummary: FC<{ coinStats: CoinStats }> = (props) => {
  const { totalHave, totalSpent } = props.coinStats
  const netProfit = totalHave - totalSpent
  const balanceColor = netProfit < 0 ? 'red' : 'green'
  const [showPercentage, toggleShowPercentage] = useToggle(true)

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span onClick={toggleShowPercentage}>
        {showPercentage ? (
          <PercentageBadge percentage={(totalHave / totalSpent) * 100} />
        ) : (
          <MoneyBadge usdAmount={totalHave} textColor={balanceColor} />
        )}
        <span>{' of '}</span>
        <MoneyBadge usdAmount={totalSpent} textColor="" />
      </span>
      <span className="total-have">
        <span>{netProfit < 0 ? 'Lost ' : 'Gain '}</span>
        <MoneyBadge usdAmount={Math.abs(netProfit)} textColor={balanceColor} />
      </span>
    </div>
  )
}
