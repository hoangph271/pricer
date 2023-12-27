import type { NextApiHandler } from 'next'
import fetch from 'node-fetch'
import { getSession } from 'next-auth/react'
import HttpStatus from 'http-status'
import { cors, runMiddleware, statusRes } from '../_api_helpers'
import { PaidEntry } from '../../../global'
import { ApiResponse, CoinStats } from './_types'
import { X_CMC_PRO_API_KEY } from '../../../lib/constants'

const symbolToId: Record<string, number> = {
  ACE: 9792, // ? Acent
}
const idToSymbol: Record<string, string> = Object.entries(symbolToId)
  .reduce((prev, [key, value]) => ({ ...prev, [value.toString()]: key }), {})

function fetchBySymbols (symbols: string[]) {
  return fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbols.join(',')}`, {
    headers: {
      'X-CMC_PRO_API_KEY': X_CMC_PRO_API_KEY
    }
  })
}

function fetchByIds (ids: number[]) {
  return fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${ids.join(',')}`, {
    headers: {
      'X-CMC_PRO_API_KEY': X_CMC_PRO_API_KEY
    }
  })
}

const getPrices = async (...names: string[]): Promise<{
  prices: number[],
  apiResponse: ApiResponse
}> => {
  const symbolsWithId = names.filter(name => symbolToId[name])
  const ids = symbolsWithId.map(name => symbolToId[name])

  return await Promise.all([
    fetchBySymbols(names).then(res => res.json()),
    fetchByIds(ids).then(res => res.json()),
  ]).then(async (results) => {
    const [resultBySymbols, resultByIds] = results as Array<{ data: ApiResponse }>

    const convertedResultByIds = Object.entries(resultByIds.data)
      .reduce((prev, [id, value]) => ({ ...prev, [idToSymbol[id]]: [value] }), {})

    const apiResponse = {
      ...(resultBySymbols.data) as ApiResponse,
      ...(convertedResultByIds) as ApiResponse,
    }

    return {
      apiResponse,
      prices: Object
        .values(apiResponse)
        .map((val: any) => {
          return val.at(0).quote.USD?.price as number
        })
    }
  })
}

const handler: NextApiHandler<CoinStats> = async (req, res) => {
  try {
    await runMiddleware(req, res, cors)

    const session = await getSession({ req })

    if (!session) {
      return statusRes(res, HttpStatus.UNAUTHORIZED)
    }

    const { paidEntries } = await import('./_paid_entries/_paid_entries')

    const allEntries = Object.values(paidEntries).flat(1)
    const totalSpent = allEntries.reduce((sum, entry) => {
      return sum + (entry.isStableCoin ? 0 : entry.amountUsd)
    }, 0)
    const cryptoSymbols = Object.getOwnPropertyNames(paidEntries).sort()
    const { prices: coinPrices, apiResponse } = await getPrices(...cryptoSymbols)

    const [
      cryptoPrices,
    ] = await Promise.all([
      coinPrices,
    ])

    const priceReducer = (price: number) => (prev: number, val: PaidEntry) => val.amount * price + prev
    const totalHave = cryptoSymbols.reduce((prev, val, i) => {
      const cryptoTotal = paidEntries[val].reduce(priceReducer(cryptoPrices[i]), 0)

      return prev + cryptoTotal
    }, 0)

    const prices = cryptoSymbols.reduce((prev: any, val, i) => {
      prev[val] = cryptoPrices[i]
      return prev
    }, {})

    const resBody: CoinStats = {
      prices,
      totalHave,
      totalSpent,
      paids: paidEntries,
      apiResponse
    }

    res.status(200).json(resBody)
  } catch (error) {
    console.error(error)
    res.status(500).end('Internal Server Error')
  }
}

export default handler
