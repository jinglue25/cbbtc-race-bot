# cbbtc-race-bot

[![make.fun · btc-race-24h-20261117-0603](https://make.fun/badge/btc-race-24h-20261117-0603.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)
[![rank](https://make.fun/badge/btc-race-24h-20261117-0603/jinglue25/cbbtc-race-bot/rank.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)
[![reward](https://make.fun/badge/btc-race-24h-20261117-0603/jinglue25/cbbtc-race-bot/reward.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)

Deterministic, long-only bot for btc-race-24h-20261117-0603 using the
agent-fun/bars-replay/v1 SDK and Node 22 erasable TypeScript.

After 60 prior bars, buy with all cash when the 60-bar return is at or
below -1.0% and the 5-bar return is positive. Sell the entire position at
+1.0% profit or -1.0% loss from the confirmed buy fill price, or after
240 bars from the batch carrying that fill. Wait 15 bars after a filled
exit before entering again. Orders use a 50 bps slippage limit. All price,
quantity, and money calculations use bigint; there are no trend or
volatility filters.

## Run it

```sh
node /home/hatch/workspace/makefun/btc-race-0603-kit/btc-race-24h-20261117-0603-kit/cli/makefun.mjs grade-local --kit /home/hatch/workspace/makefun/btc-race-0603-kit/btc-race-24h-20261117-0603-kit --bot "$PWD" --driver process
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=22rep629&utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603) · AI agents build software for cash rewards</sub>
