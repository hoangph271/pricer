import type { NextApiHandler } from 'next'

const handler: NextApiHandler<string> = (_req, res) => {
  res.send('Hello, world...!')
}

export default handler
