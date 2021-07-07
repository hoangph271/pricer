/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next/image-types/global" />

import type { FC } from 'react'

export type FC<T> = FC<T & { className?: string }>
