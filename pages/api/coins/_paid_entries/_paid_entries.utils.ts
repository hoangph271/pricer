import { PaidEntry } from '../../../../global'

export const toPaidEntry = (name: string) => {
  return (args: [string, number, number]) => {
    const [date, amountUsd, amount] = args
    return ({ name, date, amountUsd, amount }) as PaidEntry
  }
}
