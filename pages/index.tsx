import { useEffect, useState } from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { signIn, useSession } from 'next-auth/react'

import type { FC } from '../global'
import { API_ROOT } from '../lib/constants'

import { AssetSummary } from '../components'
import { CoinStats } from './api/coins/_types'
import { CoinsWheel } from '../components/CoinsWheel'
import { CoinPaidSummary } from '../components/CoinPaidSummary'

const Home: FC<{ coinStats: CoinStats }> = (props) => {
  const [coinStats] = useState(props.coinStats)
  const [showRefresh, setShowRefresh] = useState(false)
  const { status } = useSession({
    required: true,
    onUnauthenticated () {
      signIn()
    }
  })

  useEffect(() => {
    if (!showRefresh) return

    const timer = setTimeout(() => {
      setShowRefresh(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [showRefresh])

  if (status !== 'authenticated') return null

  return (
    <div className={'home'}
    >
      <Head>
        <title>{'#Pricer'}</title>
      </Head>
      <div id="coins-controls">
        <CoinsWheel coinStats={coinStats} />
        <AssetSummary coinStats={coinStats} />
      </div>
      <CoinPaidSummary coinStats={coinStats} />
    </div>
  )
}

export default Home

const fetchCoinStats = async (cookie: string) => {
  const res = await fetch(`${API_ROOT}/coins/`, {
    headers: {
      cookie
    }
  })

  console.info('/coins/', res.statusText)

  return res.ok
    ? await res.json() as CoinStats
    : null
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const coinStats = await fetchCoinStats(ctx.req?.headers?.cookie ?? '')

  return {
    props: {
      coinStats
    }
  }
}
