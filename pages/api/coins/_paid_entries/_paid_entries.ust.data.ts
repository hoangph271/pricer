import { PaidEntry } from '../../../../global'
import { CoinSpentEntry } from './_paid_entries.types'
import { toPaidEntry } from './_paid_entries.utils'

const spentUstEntries: CoinSpentEntry[] = [
]

export const UST: PaidEntry[] = spentUstEntries.map(toPaidEntry('UST'))
