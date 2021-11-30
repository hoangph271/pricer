import { FC } from '../global'

export const PercentageBadge: FC<{ percentage: number }> = props => {
  const { percentage } = props

  return (
    <span style={{ color: percentage < 100 ? 'red' : 'green' }}>
      {percentage.toFixed(2)}%
    </span>
  )
}
