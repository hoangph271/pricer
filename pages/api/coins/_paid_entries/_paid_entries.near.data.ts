import { PaidEntry } from '../../../../global'
import { CoinSpentEntry } from './_paid_entries.types'
import { toPaidEntry } from './_paid_entries.utils'

const spentNearEntries: CoinSpentEntry[] = [
  ['2022-04-22 01:07:22', 17.8893, 1.1],
  ['2022-07-20 10:18:01', 10.8336, 2.4],
]

export const NEAR: PaidEntry[] = spentNearEntries.map(toPaidEntry('NEAR'))
