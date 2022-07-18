import { FC } from '../global'

export const PercentageBadge: FC<{ percentage: number, compareTo?: number, showMinus?: boolean }> = props => {
  const { percentage, compareTo = 100 } = props

  return (
    <span style={{ color: percentage < compareTo ? 'red' : 'green' }}>
      {Math.abs(percentage).toFixed(2)}%
    </span>
  )
}
