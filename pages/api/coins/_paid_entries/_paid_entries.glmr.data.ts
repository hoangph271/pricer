import { PaidEntry } from '../../../../global'
import { CoinSpentEntry } from './_paid_entries.types'
import { toPaidEntry } from './_paid_entries.utils'

const spentGlmrEntries: CoinSpentEntry[] = [
  ['2022-01-13 13:05:43', 27.12045, 3.5],
  ['2022-07-19 21:33:36', 10.55069, 14.9],
]

export const GLMR: PaidEntry[] = spentGlmrEntries.map(toPaidEntry('GLMR'))
