import type { NextApiHandler } from 'next'
import { google } from 'googleapis'
import fetch from 'node-fetch'
import { getSession } from 'next-auth/react'
import HttpStatus from 'http-status'
import { cors, runMiddleware, statusRes } from '../_api_helpers'
import { PaidEntry } from '../../../global'
import { paidEntries } from './_paid_entries'

const credentials = { installed: { client_id: '551315315389-6keh2vo91kh06ce6d1n21h8oha50l09q.apps.googleusercontent.com', project_id: 'crusty-194406', auth_uri: 'https://accounts.google.com/o/oauth2/auth', token_uri: 'https://oauth2.googleapis.com/token', auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs', client_secret: '7a2vnKGfpeytVNJrWFiuQs1K', redirect_uris: ['urn:ietf:wg:oauth:2.0:oob', 'http://localhost'] } }
const token = { access_token: 'ya29.a0ARrdaM9-58kuGHUZgPp58a1J6sc5pyuwt8JHtTlqX8LFVOeHnCLc8yO82m6QYrwyqfjcmYk4us3LeZnCfYiGvPLSrirOsVJ-dC4J6qjdaCtRPDiCl99wpyzfkNTrJkUCjk43Ql8dESE3wS1IYLcIBi_X6GAY', refresh_token: '1//0ePaIsKB4KG0dCgYIARAAGA4SNwF-L9Irj0fj-tyqywc_xyHy8FDzVdE2VW7HAWFS-7UJUVud-QD9hRTaR-XQAbY82iOCsj6Z6M0', scope: 'https://www.googleapis.com/auth/spreadsheets.readonly', token_type: 'Bearer', expiry_date: 1625222830174 }

const getPrices = async (...names: string[]): Promise<number[]> => {
  return await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${names.join(',')}`, {
    headers: {
      'X-CMC_PRO_API_KEY': 'deb827df-a1a6-4ceb-940c-3114e9adca4d'
    }
  }).then(async res => {
    const { data } = await res.json() as any

    return Object.values(data).map((val: any) => val.quote.USD.price as number)
  })
}

export type CoinStats = {
  prices: Record<string, number>
  usdPrice: number
  totalHave: number
  totalSpent: number
  paids: Record<string, PaidEntry[]>
}
const handler: NextApiHandler<CoinStats> = async (req, res) => {
  await runMiddleware(req, res, cors)

  const session = await getSession({ req })

  if (!session) {
    return statusRes(res, HttpStatus.UNAUTHORIZED)
  }

  const { client_id, client_secret, redirect_uris } = credentials.installed
  const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
  auth.setCredentials(token)

  async function getValues (range: string): Promise<any[][]> {
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.get({
        spreadsheetId: '1C59C-pFA1pNE2lq6BQGmUaBkwOnfsD_DdbisseDXB2s',
        range: `#Coined!${range}`,
        valueRenderOption: 'UNFORMATTED_VALUE'
      }, (err, res) => {
        err ? reject(err) : resolve(res?.data?.values ?? [])
      })
    })
  }

  const sheets = google.sheets({ version: 'v4', auth })

  const allEntries = Object.values(paidEntries).flat(1)
  const totalSpent = allEntries.reduce((sum, entry) => entry.amountUsd + sum, 0)
  const cryptoSymbols = Object.getOwnPropertyNames(paidEntries).sort()

  const [
    cryptoPrices,
    [[usdPrice]]
  ] = await Promise.all([
    getPrices(...cryptoSymbols),
    getValues('C7')
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
    usdPrice
  }

  res.status(200).json(resBody)
}

export default handler
