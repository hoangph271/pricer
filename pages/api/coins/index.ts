import type { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'
import fetch from 'node-fetch'
import { cors, runMiddleware } from '../_api_helpers'

const credentials = { installed: { client_id: '551315315389-6keh2vo91kh06ce6d1n21h8oha50l09q.apps.googleusercontent.com', project_id: 'crusty-194406', auth_uri: 'https://accounts.google.com/o/oauth2/auth', token_uri: 'https://oauth2.googleapis.com/token', auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs', client_secret: '7a2vnKGfpeytVNJrWFiuQs1K', redirect_uris: ['urn:ietf:wg:oauth:2.0:oob', 'http://localhost'] } }
const token = { access_token: 'ya29.a0ARrdaM9-58kuGHUZgPp58a1J6sc5pyuwt8JHtTlqX8LFVOeHnCLc8yO82m6QYrwyqfjcmYk4us3LeZnCfYiGvPLSrirOsVJ-dC4J6qjdaCtRPDiCl99wpyzfkNTrJkUCjk43Ql8dESE3wS1IYLcIBi_X6GAY', refresh_token: '1//0ePaIsKB4KG0dCgYIARAAGA4SNwF-L9Irj0fj-tyqywc_xyHy8FDzVdE2VW7HAWFS-7UJUVud-QD9hRTaR-XQAbY82iOCsj6Z6M0', scope: 'https://www.googleapis.com/auth/spreadsheets.readonly', token_type: 'Bearer', expiry_date: 1625222830174 }

const getFilPrice = async (): Promise<number> => {
  return await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=FIL', {
    headers: {
      'X-CMC_PRO_API_KEY': 'deb827df-a1a6-4ceb-940c-3114e9adca4d'
    }
  }).then(async res => {
    const { data } = await res.json()
    return data.FIL.quote.USD.price as number
  })
}

type PaidEntry = {
  date: string,
  amountUsd: number,
  amountFil: number
}
const paidEntries: PaidEntry[] = [
  ['2021-06-22 17:14:57', 118.25, 2.2766],
  ['2021-06-23 20:56:01', 84.59, 1.55307328],
  ['2021-06-29 17:08:47', 24.63, 0.41705047],
  ['2021-06-30 06:01:21', 22.68, 0.35828591],
  ['2021-07-02 12:07:45', 25.63, 0.45742699],
  ['2021-07-08 15:43:38', 22, 0.39876166],
  ['2021-07-13 08:32:34', 20, 0.3795729],
  ['2021-07-15 10:09:31', 20, 0.40355858],
  ['2021-07-19 22:06:47', 22.87, 0.49870146],
  ['2021-08-08 07:07:11', 65, 0.93932672]
].map(([date, amountUsd, amountFil]) => ({ date, amountUsd, amountFil }) as PaidEntry)

export type CoinStats = {
  totalFils: number,
  filPrice: number,
  usdPrice: number,
  balanceChanges: number,
  paidEntries: PaidEntry[]
}
export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors)

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

  const totalSpent = paidEntries.reduce((sum, entry) => entry.amountUsd + sum, 0)
  const totalFils = paidEntries.reduce((sum, entry) => entry.amountFil + sum, 0)

  const [
    filPrice,
    [[usdPrice]]
  ] = await Promise.all([
    getFilPrice(),
    getValues('C7')
  ])

  const balanceChanges = filPrice * totalFils - totalSpent

  const resBody: CoinStats = {
    totalFils,
    filPrice,
    balanceChanges,
    paidEntries,
    usdPrice
  }

  res.status(200).json(resBody)
}
