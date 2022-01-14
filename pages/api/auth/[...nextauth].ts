// @ts-nocheck
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { HARD_CODED_ACCOUNT, SECRET } from '../../../lib/constants'

export default NextAuth({
  secret: SECRET,
  providers: [
    // ? FIXME: Correct the TS checking & remove // @ts-nocheck
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'alpha-sneu' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize (credentials) {
        const isAuthed = credentials.username === HARD_CODED_ACCOUNT.username &&
          credentials.password === HARD_CODED_ACCOUNT.password

        return isAuthed ? { username: '@Me' } : null
      }
    })
  ],
  theme: {
    colorScheme: 'auto',
    logo: 'https://pricer.alpha-sneu.xyz/icon.png'
  }
})
