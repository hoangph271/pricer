import { PaidEntry } from '../../../../global'
import { CoinSpentEntry } from './_paid_entries.types'
import { toPaidEntry } from './_paid_entries.utils'

const spentBnbEntries: CoinSpentEntry[] = [
  ['2022-05-29 11:00:00', 6, 0.01992]
]

export const BNB: PaidEntry[] = spentBnbEntries.map(toPaidEntry('BNB'))
