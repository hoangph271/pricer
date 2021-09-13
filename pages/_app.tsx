import type { AppProps } from 'next/app'
import { useEffect } from 'react'

import '../styles/globals.css'

function MyApp ({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.title = '#Pricer...!'
  }, [])
  return <Component {...pageProps} />
}
export default MyApp
