export const HARD_CODED_ACCOUNT = {
  username: 'alpha-sneu',
  password: '0420#Pricer...!'
}

export const SECRET = Object.values(HARD_CODED_ACCOUNT).join('')
export const API_ROOT = process.env.API_ROOT ?? 'http://localhost:3000/api'
export const USD_PRICE_IN_VND = 23_340
