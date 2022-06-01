import { PaidEntry } from '../../../../global'
import { CoinSpentEntry } from './_paid_entries.types'
import { toPaidEntry } from './_paid_entries.utils'

const spentBtcEntries: CoinSpentEntry[] = [
  ['2021-11-21 05:16:51', 42.316, 0.00071],
  ['2021-11-23 02:33:37', 33.04, 0.00059],
  ['2022-01-04 22:51:14', 24.51380880, 0.00052],
  ['2022-01-07 01:12:03', 20.972, 0.00049],
  ['2022-01-20 18:15:29', 42.17337, 0.001],
  ['2022-01-22 20:54:05', 29.8848312, 0.00084],
  ['2022-05-01 05:03:20', 21.4241944, 0.00056],
  ['2022-05-19 15:53:36', 14.5, 0.0005],
  ['2022-05-29 11:00:00', 4, 0.00013],
]

export const BTC: PaidEntry[] = spentBtcEntries.map(toPaidEntry('BTC'))
