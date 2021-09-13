import type React from 'react'

export type FC<T> = React.FC<T & { className?: string }>

export type PaidEntry = {
  date: string,
  amountUsd: number,
  amountFil: number
}
