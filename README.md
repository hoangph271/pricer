- Create `pages/api/coins/_paid_entries` module as following:

```ts
export const paidEntries: Record<string, PaidEntry[]> = {
  BTC,
  ETH,
  // ...Other coins/tokens
}

// With PaidEntry:
type PaidEntry = {
  name: string,
  date: string,
  amountUsd: number,
  amount: number
}
```

- Run `yarn deploy:latest`
