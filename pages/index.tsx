import { useState } from 'react'
import styled from 'styled-components'
import type { CoinStats } from './api/coins'
import type { FC } from '../global'

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
    minimumFractionDigits: 4
  }).format(amount)
}
const formatUsd = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 4,
    minimumFractionDigits: 4
  }).format(amount)
}
const formatVnd = (amount: number) => {
  return `${Math.floor(amount).toLocaleString()} VND`
}

const MoneyBadge: FC<{ usdAmount: number, usdPrice: number }> = (props) => {
  const { usdAmount, usdPrice } = props
  const [showInUsd, setShowInUsd] = useState(true)

  return (
    <div className="nes-badge" onClick={() => setShowInUsd(!showInUsd)} style={{ width: '13rem' }}>
      <span className={`is-${usdAmount > 0 ? 'success' : 'error'}`}>
        <span>{showInUsd ? formatUsd(usdAmount) : formatVnd(usdAmount * usdPrice)}</span>
      </span>
    </div>
  )
}
const Home: FC<{ coinStats: CoinStats }> = (props) => {
  const { className } = props
  const { balanceChanges, totalFils, filPrice, paidEntries, usdPrice } = props.coinStats

  return (
    <div className={className}>
      <p>{`${totalFils}@${formatMoney(filPrice)}`}</p>
      <ul>
        {paidEntries.map(([time, amount], i) => (
          <li key={i}>
            <span>{time}</span>
            <span>{formatUsd(amount)}</span>
          </li>
        ))}
      </ul>
      <MoneyBadge usdAmount={balanceChanges} usdPrice={usdPrice} />
      <MoneyBadge usdAmount={totalFils * filPrice} usdPrice={usdPrice} />
    </div>
  )
}
const StyledHome = styled(Home)`
  display: flex;
  flex-direction: column;
  align-items: center;

  ul {
    padding: 0;
    width: calc(100% - 0.4rem);
    margin: auto;
    list-style: none;

    li {
      display: flex;
      width: 100%;
      justify-content: space-between;
    }
  }
`

export default StyledHome

const { API_ROOT = 'http://0.0.0.0:3000/api' } = process.env

export async function getServerSideProps () {
  const res = await fetch(`${API_ROOT}/coins/`)

  return {
    props: {
      coinStats: await res.json() as CoinStats
    }
  }
}
