import { PaidEntry } from '../../../../global'
import { CoinSpentEntry } from './_paid_entries.types'
import { toPaidEntry } from './_paid_entries.utils'

const spentEthEntries: CoinSpentEntry[] = [
  ['2021-11-16 17:01:50', 18.999, 0.00449550],
  ['2021-11-19 21:07:08', 99.63, 0.0243],
  ['2021-11-22 10:35:01', 55.9475, 0.0139],
  ['2021-12-29 13:14:03', 44.8511, 0.0119],
  ['2022-01-07 01:09:40', 20.06, 0.0059],
  ['2022-01-11 13:54:04', 31, 0.01],
  ['2022-01-20 18:15:29', 31.48, 0.01],
  ['2022-01-22 22:17:54', 28.08, 0.0117],
  ['2022-02-05 13:54:29', 24.705042, 0.0082],
  ['2022-02-13 13:03:55', 29, 0.01],
  ['2022-03-01 11:21:59', 29, 0.01],
]

export const ETH: PaidEntry[] = spentEthEntries.map(toPaidEntry('ETH'))