import { PaidEntry } from '../../../../global'
import { CoinSpentEntry } from './_paid_entries.types'
import { toPaidEntry } from './_paid_entries.utils'

const spentBusdEntries: CoinSpentEntry[] = [
  ['2022-07-22 08:32:00', 60.4631479, 60.4631479]
]

export const BUSD: PaidEntry[] = spentBusdEntries.map(toPaidEntry('BUSD'))
