import { PaidEntry } from '../../../../global'
import { CoinSpentEntry } from './_paid_entries.types'
import { toPaidEntry } from './_paid_entries.utils'

const spentBetaEntries: CoinSpentEntry[] = [
  ['2021-11-10 20:47:50', 21.19754, 13]
]

export const BETA: PaidEntry[] = spentBetaEntries.map(toPaidEntry('BETA'))
