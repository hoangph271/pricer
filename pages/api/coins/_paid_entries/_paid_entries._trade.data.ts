import { PaidEntry } from '../../../../global'

import { toPaidEntry } from './_paid_entries.utils'

export const paidEntries: Record<string, PaidEntry[]> = {
  BUSD: [
    ['2022-07-20 22:45:22', 50.12, 50.12],
  ].map(toPaidEntry('BUSD') as any),
}

Object.getOwnPropertyNames(paidEntries)
  .forEach(key => {
    if (paidEntries[key].length === 0) {
      delete paidEntries[key]
    }
  })

Object.freeze(paidEntries)
