import type React from 'react'

export type FC<T> = React.FC<T & { className?: string }>

export type PaidEntry = {
  isStableCoin: boolean,
  name: string,
  date: string,
  amountUsd: number,
  amount: number
}
