import { PaidEntry } from '../../../../global'
import { CoinSpentEntry } from './_paid_entries.types'
import { toPaidEntry } from './_paid_entries.utils'

const spentDotEntries: CoinSpentEntry[] = [
  ['2021-11-13 17:24:03', 34.15457339, 0.75011746],
  ['2021-11-30 22:55:18', 19.9969, 0.53],
  ['2022-01-07 01:08:15', 26, 1],
]

export const DOT: PaidEntry[] = spentDotEntries.map(toPaidEntry('DOT'))
