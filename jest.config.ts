import type { Config } from '@jest/types'

export default async function jestConfig (): Promise<Config.InitialOptions> {
  return {
    verbose: true,
    testEnvironment: 'jest-environment-jsdom',
  }
}
