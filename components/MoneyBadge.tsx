import { FC } from '../global'
import { formatUsd } from '../lib/formatters'
import { getColor } from '../lib/utils'

type MoneyBadgeProps = {
  usdAmount: number,
  title?: string,
  textColor?: string,
  compareTo?: number
}
export const MoneyBadge: FC<MoneyBadgeProps> = (props) => {
  const { usdAmount, title, textColor, compareTo = 0 } = props
  const money = formatUsd(usdAmount)

  return (
    <span className="not-badge">
      <span style={{ color: textColor ?? getColor(usdAmount, compareTo) }}>
        {title ? (
          <span>{`${title}: ${money}`}</span>
        ) : (
          <span>{money}</span>
        )}
      </span>
    </span>
  )
}
