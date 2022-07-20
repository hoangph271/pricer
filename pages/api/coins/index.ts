import type { NextApiHandler } from 'next'
import fetch from 'node-fetch'
import { getSession } from 'next-auth/react'
import HttpStatus from 'http-status'
import { cors, runMiddleware, statusRes } from '../_api_helpers'
import { PaidEntry } from '../../../global'
import { paidEntries } from './_paid_entries/_paid_entries._trade.data'

export type CoinStats = {
  prices: Record<string, number>
  usdPrice: number
  totalHave: number
  totalSpent: number
  paids: Record<string, PaidEntry[]>,
  apiResponse: ApiResponse
}

export type CoinApiRecord = {
  id: number
  name: string
  symbol: string
  slug: string
  num_market_pairs: number
  date_added: Date
  tags: string[]
  max_supply: number
  circulating_supply: number
  total_supply: number
  platform: {
    id: number
    name: string
    symbol: string
    slug: string
    token_address: string
  }
  is_active: number
  cmc_rank: number
  is_fiat: number
  self_reported_circulating_supply: number
  self_reported_market_cap: number
  last_updated: Date
  quote: {
    USD: {
      price: number
      volume_24h: number
      volume_change_24h: number
      percent_change_1h: number
      percent_change_24h: number
      percent_change_7d: number
      percent_change_30d: number
      percent_change_60d: number
      percent_change_90d: number
      market_cap: number
      market_cap_dominance: number
      fully_diluted_market_cap: number
      last_updated: Date
    }
  }
}
export type ApiResponse = Record<string, CoinApiRecord>

/* eslint camelcase: "off", no-use-before-define: "off", */
const getPrices = async (...names: string[]): Promise<{
  prices: number[],
  apiResponse: ApiResponse
}> => {
  return await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${names.join(',')}`, {
    headers: {
      'X-CMC_PRO_API_KEY': 'deb827df-a1a6-4ceb-940c-3114e9adca4d'
    }
  }).then(async res => {
    const { data: apiResponse } = await res.json() as { data: ApiResponse }

    console.info(`From API:\n${JSON.stringify(apiResponse, null, 2)}`)

    return {
      apiResponse,
      prices: Object
        .values(apiResponse)
        .map((val: any) => val.quote.USD.price as number)
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

    const allEntries = Object.values(paidEntries).flat(1)
    const totalSpent = allEntries.reduce((sum, entry) => entry.amountUsd + sum, 0)
    const cryptoSymbols = Object.getOwnPropertyNames(paidEntries).sort()
    const { prices: coinPrices, apiResponse } = await getPrices(...cryptoSymbols)

    const [
      cryptoPrices,
      [[usdPrice]]
    ] = await Promise.all([
      coinPrices,
      // ! FIXME: Get USD price somewhere else
      [[22_896]]
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
      usdPrice,
      apiResponse
    }

    res.status(200).json(resBody)
  } catch (error) {
    console.error(error)
    res.status(500).end('Internal Server Error')
  }
}

export default handler
