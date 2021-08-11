import { useState } from 'react'
import styled from 'styled-components'
import type { CoinStats } from './api/coins'
import type { FC } from '../global'

import { API_ROOT, formatUsd, formatVnd, formatMoney } from '../utils'

const MoneyBadge: FC<{ usdAmount: number, usdPrice: number }> = (props) => {
  const { usdAmount, usdPrice, className } = props
  const [showInUsd, setShowInUsd] = useState(true)

  return (
    <div className={className} onClick={() => setShowInUsd(!showInUsd)} style={{ width: '13rem' }}>
      <span className={`is-${usdAmount > 0 ? 'success' : 'error'}`}>
        <span>{showInUsd ? formatUsd(usdAmount) : formatVnd(usdAmount * usdPrice)}</span>
      </span>
    </div>
  )
}
const StyledMoneyBadge = styled(MoneyBadge)`
  .is-success {
    color: green;
  }
`

const Home: FC<{ coinStats: CoinStats }> = (props) => {
  const { className } = props
  const { balanceChanges, totalFils, filPrice, paidEntries, usdPrice } = props.coinStats

  return (
    <div className={className}>
      <p>{`${totalFils.toFixed(4)}@${formatMoney(filPrice)}`}</p>
      <ul>
        {paidEntries.map((entry, i) => (
          <li key={i}>
            <span>{entry.date}</span>
            <span>{formatUsd(entry.amountUsd)}</span>
          </li>
        ))}
      </ul>
      <StyledMoneyBadge usdAmount={balanceChanges} usdPrice={usdPrice} />
      <StyledMoneyBadge usdAmount={totalFils * filPrice} usdPrice={usdPrice} />
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

export async function getServerSideProps () {
  const res = await fetch(`${API_ROOT}/coins/`)

  return {
    props: {
      coinStats: await res.json() as CoinStats
    }
  }
}
