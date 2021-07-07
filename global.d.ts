import type React from 'react'

declare global {
  export type FC<T> = React.FC<T & { className?: string }>
}
