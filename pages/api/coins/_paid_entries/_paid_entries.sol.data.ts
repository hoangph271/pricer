import { PaidEntry } from '../../../../global'
import { CoinSpentEntry } from './_paid_entries.types'
import { toPaidEntry } from './_paid_entries.utils'

const spentSolEntries: CoinSpentEntry[] = [
  ['2021-12-29 13:14:36', 43.75, 0.25],
  ['2022-01-20 18:16:09', 49.608, 0.36],
  ['2022-03-01 11:24:00', 24.31, 0.25]
]

export const SOL: PaidEntry[] = spentSolEntries.map(toPaidEntry('SOL'))
