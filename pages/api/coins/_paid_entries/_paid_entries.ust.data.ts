import { PaidEntry } from '../../../../global'
import { CoinSpentEntry } from './_paid_entries.types'
import { toPaidEntry } from './_paid_entries.utils'

const spentUstEntries: CoinSpentEntry[] = [
  ['2022-04-22 01:07:22', 17.8893, 1.1],
]

export const UST: PaidEntry[] = spentUstEntries.map(toPaidEntry('UST'))
