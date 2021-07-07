import type { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'
import fetch from 'node-fetch'

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

type PaidEntry = [string, number]
const paidEntries: PaidEntry[] = [
  ['6/22/2021', 2_747_058],
  ['6/23/2021', 2_000_000],
  ['6/29/2021', 579_790],
  ['6/30/2021', 333_742],
  ['6/30/2021', 200_000],
  ['7/1/2021', 604_777],
]

export type CoinStats = {
  totalFils: number,
  filPrice: number,
  usdPrice: number,
  balanceChanges: number,
  paidEntries: PaidEntry[]
}
export default async function handler (_: NextApiRequest, res: NextApiResponse) {
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

  const totalSpent = paidEntries.reduce((sum, [_, amount]) => amount + sum, 0)
  const totalFils = 5.06243665 // ! FIXME: Don't hardcode

  const [
    filPrice,
    [[usdPrice]]
  ] = await Promise.all([
    getFilPrice(),
    getValues('C7')
  ])

  const balanceChanges = filPrice * totalFils - (totalSpent / usdPrice)

  const resBody: CoinStats = {
    totalFils,
    filPrice,
    balanceChanges,
    paidEntries: paidEntries.map(([sheetsDate, amountVnd]) => ([
      sheetsDate,
      amountVnd / usdPrice as number
    ])),
    usdPrice
  }

  res.status(200).json(resBody)
}
