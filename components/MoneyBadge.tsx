import { useState } from 'react'
import { FC } from '../global'
import { formatUsd, formatVnd } from '../lib/formatters'
import { getColor } from '../lib/utils'

export const MoneyBadge: FC<{ usdAmount: number, usdPrice: number, title?: string, colored?: boolean | string }> = (props) => {
  const { usdAmount, usdPrice, title, colored = true } = props
  const [showInUsd, setShowInUsd] = useState(true)

  const money = showInUsd ? formatUsd(usdAmount) : formatVnd(usdAmount * usdPrice)

  return (
    <span className="not-badge" onClick={() => setShowInUsd(!showInUsd)}>
      <span style={{ color: getColor(colored, usdAmount) }}>
        {title ? (
          <span>{`${title}: ${money}`}</span>
        ) : (
          <span>{money}</span>
        )}
      </span>
    </span>
  )
}
