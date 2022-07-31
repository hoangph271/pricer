import { PaidEntry } from '../../../global'

/* eslint camelcase: "off", no-use-before-define: "off", */

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
export type CoinStats = {
  prices: Record<string, number>
  usdPrice: number
  totalHave: number
  totalSpent: number
  paids: Record<string, PaidEntry[]>,
  apiResponse: ApiResponse
}
