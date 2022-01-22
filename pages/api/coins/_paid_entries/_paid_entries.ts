import { PaidEntry } from '../../../../global'
import { FIL } from './_paid_entries.fil.data'
import { ADA } from './_paid_entries.ada.data'
import { ETH } from './_paid_entries.eth.data'
import { BETA } from './_paid_entries.beta'

export const paidEntries: Record<string, PaidEntry[]> = {
  FIL,
  ADA,
  ETH,
  BETA,
  // SHIB: [
  //   ['2021-11-19 22:40:20', 25.9 + 22, 505365.85 + 427267.43],
  // ].map(toPaidEntry('SHIB') as any),
  // TLM: [
  //   ['2021-12-22 11:04:39', 29.8215, 135],
  //   ['2021-12-02 02:05:49', 15.99, 39],
  // ].map(toPaidEntry('TLM') as any),
  // MINA: [
  //   ['2021-11-26 17:50:00', 79.4288, 17.6],
  // ].map(toPaidEntry('MINA') as any),
  // BAT: [
  //   ['2021-11-29 11:28:03', 19.68000000, 12]
  // ].map(toPaidEntry('BAT') as any),
  // GALA: [
  //   ['2021-12-16 10:03:06', 49.942, 100]
  // ].map(toPaidEntry('GALA') as any),
  // SOL: [
  //   ['2021-12-29 13:14:36', 43.75, 0.25],
  //   ['2022-01-20 18:16:09', 49.608, 0.36],
  // ].map(toPaidEntry('SOL') as any),
  // CHZ: [
  //   ['2021-12-26 15:27:44', 65.8275, 201],
  // ].map(toPaidEntry('CHZ') as any),
  // AXS: [
  //   ['2021-12-30 19:05:21', 46.55, 0.49]
  // ].map(toPaidEntry('AXS') as any),
  // CEEK: [
  //   ['2021-11-17 11:24:42', 15.68, 23.112154895061089],
  //   ['2021-11-18 12:22:14', 18.53, 27.31632210060497],
  // ].map(toPaidEntry('CEEK') as any),
  // RACA: [
  //   ['2021-12-12 07:21:54', 21.2, 6611.75],
  // ].map(toPaidEntry('RACA') as any),
  // ACE: [
  //   ['2021-11-30 06:02:28', 20.40955709, 157.154062],
  // ].map(toPaidEntry('ACE') as any),
  // LIT: [
  //   ['2022-01-04 19:21:43', 25.128, 8],
  // ].map(toPaidEntry('LIT') as any),
  // // GLMR: [
  // //   ['2022-01-13 13:05:43', 26.2722, 3],
  // // ].map(toPaidEntry('GLMR') as any),
}

Object.getOwnPropertyNames(paidEntries)
  .forEach(key => {
    if (paidEntries[key].length === 0) {
      delete paidEntries[key]
    }
  })

Object.freeze(paidEntries)
