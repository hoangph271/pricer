import { FC } from 'react'
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { PaidEntry } from '../global'
import { formatMoney, formatDate, formatUsd } from '../lib/formatters'

export const EntryLine: FC<{ entry: PaidEntry }> = props => {
  const { entry: { amount, amountUsd, date } } = props

  const usdPrice = formatMoney(amountUsd / amount)

  return (
    <ListItemButton>
      <ListItemIcon>
        {formatDate(date)}
      </ListItemIcon>
      <ListItemText
        primary={formatUsd(amountUsd)}
        secondary={`${formatMoney(amount)}@${usdPrice}`}
      />
    </ListItemButton>
  )
}
