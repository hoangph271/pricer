// @ts-nocheck
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const HARD_CODED_ACCOUNT = {
  username: 'alpha-sneu',
  password: '0420#Pricer...!'
}
export default NextAuth({
  secret: Object.values(HARD_CODED_ACCOUNT).join(''),
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
