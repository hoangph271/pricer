import { PaidEntry } from '../../../../global'

import { toPaidEntry } from './_paid_entries.utils'

export const paidEntries: Record<string, PaidEntry[]> = {
  BMI: [
    // ['2022-03-01 17:03:28', 25.592, 225],
  ].map(toPaidEntry('BMI') as any),
}

Object.getOwnPropertyNames(paidEntries)
  .forEach(key => {
    if (paidEntries[key].length === 0) {
      delete paidEntries[key]
    }
  })

Object.freeze(paidEntries)
