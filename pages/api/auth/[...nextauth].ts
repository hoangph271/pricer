// @ts-nocheck
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { HARD_CODED_PASSWORD, HARD_CODED_USERNAME, SECRET } from '../../../lib/constants'

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
      async authorize ({ username, password }) {
        const isAuthed = username === HARD_CODED_USERNAME && password === HARD_CODED_PASSWORD

        return isAuthed ? { username: '@Me' } : null
      }
    })
  ],
  theme: {
    colorScheme: 'auto',
    logo: 'https://pricer.sneu.date/icon.png'
  }
})
