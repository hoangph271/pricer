import type React from 'react'

export type FC<T = any> = React.FC<T & { className?: string }>
