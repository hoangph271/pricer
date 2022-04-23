import { PaidEntry } from '../../../../global'
import { CoinSpentEntry } from './_paid_entries.types'
import { toPaidEntry } from './_paid_entries.utils'

const spentUsdtEntries: CoinSpentEntry[] = [
  ['', 1.44507382, 1.44507382],
]

export const USDT: PaidEntry[] = spentUsdtEntries.map(toPaidEntry('USDT'))
