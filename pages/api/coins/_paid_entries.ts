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
    ['2021-11-22 09:28:18', 24.96, 0.48],
  ].map((toPaidEntry('FIL') as any)),
  ADA: [
    ['2021-09-14 12:42:16', 23.8699, 10],
    ['2021-09-14 17:46:27', 27.5901, 11.4961624],
    ['2021-10-20 11:14:33', 21.38, 10.18696754],
    ['2021-10-25 21:24:56', 25, 11.64534792],
    ['2021-10-28 16:41:03', 25, 12.41446434],
  ].map((toPaidEntry('ADA') as any)),
  ETH: [
    ['2021-11-16 17:01:50', 18.999, 0.00449550],
    ['2021-11-22 10:35:01', 99.63, 0.0243]
  ].map(toPaidEntry('ETH') as any),
  BETA: [
    ['2021-11-10 20:47:50', 21.19754, 13]
  ].map(toPaidEntry('BETA') as any),
  DOT: [
    ['2021-11-13 17:24:03', 34.15457339, 0.75011746],
  ].map(toPaidEntry('DOT') as any),
  BTC: [
    ['2021-11-21 05:16:51', 42.316, 0.00071],
    ['2021-11-23 02:33:37', 33.04, 0.00059],
  ].map(toPaidEntry('BTC') as any),
  SHIB: [
    ['2021-11-19 22:40:20', 25.9 + 22, 505365.85 + 427267.43],
  ].map(toPaidEntry('SHIB') as any),
  TLM: [
    // ['2021-11-21 23:02:50', 21.2, 53]
  ].map(toPaidEntry('TLM') as any),
  MINA: [
    ['2021-11-23 16:33:56', 54.75840000, 12.4]
  ].map(toPaidEntry('MINA') as any),
}

Object.getOwnPropertyNames(paidEntries)
  .forEach(key => {
    if (paidEntries[key].length === 0) {
      delete paidEntries[key]
    }
  })

Object.freeze(paidEntries)
