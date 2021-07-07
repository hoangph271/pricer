import type React from 'react'

export type FC<T> = React.FC<T & { className?: string }>
