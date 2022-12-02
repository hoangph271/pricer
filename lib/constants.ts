export const HARD_CODED_ACCOUNT = {
  username: 'alpha-sneu',
  password: '0420#Pricer...!'
}

export const SECRET = Object.values(HARD_CODED_ACCOUNT).join('')
export const {
  API_ROOT = 'http://localhost:3000/api',
  X_CMC_PRO_API_KEY = 'X-CMC_PRO_API_KEY'
} = process.env
