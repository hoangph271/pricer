import { useState } from 'react'
import { FC } from '../global'
import { formatUsd, formatVnd } from '../lib/formatters'
import { getColor } from '../lib/utils'

type MoneyBadgeProps = {
  usdAmount: number,
  usdPrice: number,
  title?: string,
  colored?: boolean | string,
  compareTo?: number
}
export const MoneyBadge: FC<MoneyBadgeProps> = (props) => {
  const { usdAmount, usdPrice, title, colored = true, compareTo = 0 } = props
  const [showInUsd, setShowInUsd] = useState(true)

  const money = showInUsd ? formatUsd(usdAmount) : formatVnd(usdAmount * usdPrice)

  return (
    <span className="not-badge" onClick={() => setShowInUsd(!showInUsd)}>
      <span style={{ color: getColor(colored, usdAmount, compareTo) }}>
        {title ? (
          <span>{`${title}: ${money}`}</span>
        ) : (
          <span>{money}</span>
        )}
      </span>
    </span>
  )
}
