import { runBars } from './vendor/makefun-bars.ts';

const SYMBOL = 'CBBTC';
const WASHOUT_BARS = 60;
const TURN_BARS = 5;
const MAX_HOLD_BARS = 240;
const COOLDOWN_BARS = 15;

// Retain the current close and enough preceding closes for the 60-bar return.
const closes: bigint[] = [];
let entryPrice: bigint | null = null;
let holdingStart: number | null = null;
let lastExit: number | null = null;

await runBars({
  onBatch(state, batch) {
    for (const fill of batch.fills) {
      if (fill.symbol !== SYMBOL || fill.status !== 'filled') continue;
      if (fill.side === 'buy') {
        entryPrice = BigInt(fill.price);
        holdingStart = batch.seq;
      } else {
        entryPrice = null;
        holdingStart = null;
        lastExit = batch.seq;
      }
    }

    const bar = batch.bars.find((candidate) => candidate.symbol === SYMBOL);
    if (bar === undefined) return [];
    const close = BigInt(bar.c);
    closes.push(close);
    if (closes.length > WASHOUT_BARS + 1) closes.shift();
    if (state.warmingUp) return [];
    const held = state.positions.get(SYMBOL);

    if (held !== undefined && held.qty > 0n) {
      // Inclusive thresholds use the confirmed execution price, without rounding.
      const takeProfit = entryPrice !== null && close * 100n >= entryPrice * 101n;
      const stopLoss = entryPrice !== null && close * 100n <= entryPrice * 99n;
      const stale = holdingStart !== null && batch.seq - holdingStart >= MAX_HOLD_BARS;
      if (takeProfit || stopLoss || stale) {
        return [{ side: 'sell', symbol: SYMBOL, qty: held.qty, max_slippage_bps: 50 }];
      }
      return [];
    }

    if (lastExit !== null && batch.seq - lastExit < COOLDOWN_BARS) return [];
    if (state.positions.size > 0 || closes.length < WASHOUT_BARS + 1) return [];
    const washout = close * 100n <= closes[closes.length - 1 - WASHOUT_BARS]! * 99n;
    const turningUp = close > closes[closes.length - 1 - TURN_BARS]!;
    const protocolMinimum = BigInt(state.hello.fees.min_notional_quote_units);
    const oneUsdc = 10n ** BigInt(state.hello.capital.quote_scale);
    const minimumBuy = protocolMinimum > oneUsdc ? protocolMinimum : oneUsdc;
    if (washout && turningUp && state.cash >= minimumBuy) {
      return [{ side: 'buy', symbol: SYMBOL, notional_quote_units: state.cash, max_slippage_bps: 50 }];
    }
    return [];
  },
});
