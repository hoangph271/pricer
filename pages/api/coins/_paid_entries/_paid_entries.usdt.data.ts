import { PaidEntry } from '../../../../global'
import { CoinSpentEntry } from './_paid_entries.types'
import { toPaidEntry } from './_paid_entries.utils'

const spentUsdtEntries: CoinSpentEntry[] = [
  ['2022-06-01 00:00:00', 20, 20],
]

export const USDT: PaidEntry[] = spentUsdtEntries.map(toPaidEntry('USDT'))
