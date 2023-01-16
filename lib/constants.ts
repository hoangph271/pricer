export const {
  HARD_CODED_USERNAME,
  HARD_CODED_PASSWORD,
  API_ROOT = 'http://localhost:3000/api',
  'X-CMC_PRO_API_KEY': X_CMC_PRO_API_KEY = 'X-CMC_PRO_API_KEY'
} = process.env

export const SECRET = [HARD_CODED_USERNAME, HARD_CODED_PASSWORD].join('')
