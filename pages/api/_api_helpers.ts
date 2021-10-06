import Cors from 'cors'
import { NextApiRequest, NextApiResponse } from 'next'
import HttpStatus from 'http-status'

export const cors = Cors()

export const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export const statusRes = (res: NextApiResponse, status: number) => {
  res.status(status)
    .send(`${status} | ${HttpStatus[`${status}_NAME`]}`)
}
