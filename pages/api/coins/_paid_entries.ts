import { PaidEntry } from '../../../global'

const toPaidEntry = (name: string) => {
  return (args: [string, number, number]) => {
    const [date, amountUsd, amount] = args
    return ({ name, date, amountUsd, amount }) as PaidEntry
  }
}

export const paidEntries: Record<string, PaidEntry[]> = {
  FIL: [
    ['2021-06-22 17:14:57', 118.25, 2.2766],
    ['2021-06-23 20:56:01', 84.59, 1.55307328],
    ['2021-06-29 17:08:47', 24.63, 0.41705047],
    ['2021-06-30 06:01:21', 22.68, 0.35828591],
    ['2021-07-02 12:07:45', 25.63, 0.45742699],
    ['2021-07-08 15:43:38', 22, 0.39876166],
    ['2021-07-13 08:32:34', 20, 0.3795729],
    ['2021-07-15 10:09:31', 20, 0.40355858],
    ['2021-07-19 22:06:47', 22.87, 0.49870146],
    ['2021-08-08 07:07:11', 65, 0.93932672],
    ['2021-10-27 15:39:21', 20, 0.34453948],
    ['2021-10-28 09:45:29', 33.62, 0.60436864],
  ].map((toPaidEntry('FIL') as any)),
  ADA: [
    ['2021-09-14 12:42:16', 23.8699, 10],
    ['2021-09-14 17:46:27', 27.5901, 11.4961624],
    ['2021-10-20 11:14:33', 21.38, 10.18696754],
    ['2021-10-25 21:24:56', 25, 11.64534792],
    ['2021-10-28 16:41:03', 25, 12.41446434],
  ].map((toPaidEntry('ADA') as any)),
  ETH: [
    ['2021-09-20 07:50:25', 22.89, 0.00697167]
  ].map(toPaidEntry('ETH') as any)
}
