import { PaidEntry } from '../../../../global'
import { CoinSpentEntry } from './_paid_entries.types'
import { toPaidEntry } from './_paid_entries.utils'

const spentAdaEntries: CoinSpentEntry[] = [
  ['2021-09-14 12:42:16', 23.8699, 10],
  ['2021-09-14 17:46:27', 27.5901, 11.4961624],
  ['2021-10-20 11:14:33', 21.38, 10.18696754],
  ['2021-10-25 21:24:56', 25, 11.64534792],
  ['2021-10-28 16:41:03', 25, 12.41446434],
  ['2022-01-07 11:19:15', 18.96, 15.8],
]

export const ADA: PaidEntry[] = spentAdaEntries.map(toPaidEntry('ADA'))
