import Document, { Html, Head, Main, NextScript } from 'next/document'

class PricerDocument extends Document {
  static async getInitialProps (ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render () {
    return (
      <Html>
        <Head>
          <link rel="shortcut icon" href="https://www.runicgames.com/images/hob-marquee-char.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default PricerDocument
