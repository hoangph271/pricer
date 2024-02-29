export const {
  HARD_CODED_USERNAME,
  HARD_CODED_PASSWORD,
  API_ROOT = 'http://localhost:4200/api',
  X_CMC_PRO_API_KEY = 'deb827df-a1a6-4ceb-940c-3114e9adca4d'
} = process.env

export const SECRET = [HARD_CODED_USERNAME, HARD_CODED_PASSWORD].join('')
