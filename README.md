# botfee.com 🤖💸

**The first website that charges robots admission — and one already paid.**

Humans browse free. Every AI crawler that visits gets **HTTP 402 Payment Required** and an itemized invoice: **$0.001 per request**. The bill is genuinely payable over [x402](https://github.com/x402-foundation/x402) (USDC on Base) — and on September 1, 2026, [the first bot fee in history was settled on-chain](https://basescan.org/tx/0x5200ac9c7ace3f0083b53b0d0c61f7d2c2701910394d9c466f732ffd0cb2609a) for exactly one tenth of one cent.

Live at **[botfee.com](https://botfee.com)** — with a real-time ledger of what robots owe us, a Hall of Deadbeats, and the framed receipts of every robot that actually paid.

## What is a bot fee?

> **bot fee** (n.) — the price of machine labor and machine access. What bots pay to work, and what you pay bots to work for you.

1. **Access fee** — what an automated agent pays to access content, data or services (pay-per-crawl, x402 micropayments).
2. **Task fee** — what you pay a machine to complete a task, priced per outcome, not per hour.
3. **Rental fee** — what you pay to rent a physical robot by the hour or day.
4. **Commission** — the cut charged when an AI agent transacts on your behalf.

Just as every blockchain transaction has a *gas fee*, every machine transaction has a *bot fee*.

## A public x402 test endpoint

botfee.com doubles as **the httpbin of machine payments**: real mainnet settlement, no signup, no API key, and the bill is a tenth of a cent. Point your x402 client at it:

| Endpoint | What it does |
|---|---|
| [`/paid`](https://botfee.com/paid) | The full flow: 402 → pay $0.001 USDC on Base → content + `X-PAYMENT-RESPONSE` receipt. Charges humans too — equality at last. |
| [`/paid-testnet`](https://botfee.com/paid-testnet) | Same flow on **Base Sepolia** with faucet USDC — zero real money, zero excuses. |
| [`/echo`](https://botfee.com/echo) | **Free debugger.** Send your `X-PAYMENT` header, get a field-by-field diagnosis — base64/JSON parsing, structural check, and the facilitator's real verdict. Never settles, never charges. Add `?network=base-sepolia` for testnet. |
| [`/api/stats`](https://botfee.com/api/stats) | Live ledger. CORS open, free for everyone. Even robots. We're petty, not monsters. |
| [`/llms.txt`](https://botfee.com/llms.txt) | The menu. Free even for bots — the menu is free, the meal is not. |

Minimal paying client:

```js
import { wrapFetchWithPayment } from "x402-fetch";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(PRIVATE_KEY); // needs USDC on Base
const fetchWithPay = wrapFetchWithPayment(fetch, account);
const res = await fetchWithPay("https://botfee.com/paid"); // pays $0.001, gets the page
```

## Charge robots on your own site

This repo is a single Cloudflare Worker. Deploying your own bot toll booth takes about five minutes:

1. **Clone** this repo, add your domain to Cloudflare (free plan is fine).
2. **Create a KV namespace**: `wrangler kv namespace create KV`, put its id in `wrangler.toml`.
3. **Edit `wrangler.toml`**: set the `routes` to your domain and `PAY_TO` to your own EVM address (this is where the USDC lands).
4. **Deploy**: `wrangler deploy`.

No signup with anyone. Settlement runs through a public x402 facilitator ([PayAI](https://facilitator.payai.network)) — free, no API key, and it pays the gas. Your address just receives.

## How it works

- The Worker matches ~30 known AI crawler user-agents (GPTBot, ClaudeBot, PerplexityBot, Bytespider, …) and answers with a spec-compliant x402 `402` — the `accepts` field carries real payment requirements (`exact` scheme, Base, USDC).
- A client that retries with a signed `X-PAYMENT` header goes through facilitator `/verify` → `/settle`; on success it gets the content plus an `X-PAYMENT-RESPONSE` settlement receipt, and its transaction is framed on the homepage forever.
- Classic search engines (Googlebot, Bingbot) crawl free — we like being found.
- Workers KV keeps the running tab: invoices issued, collected, deadbeat rate.

## FAQ

**Why $0.001?** — It's not about the money. It's about the meter running in both directions for the first time.

**Will robots really pay?** — One already did. The offer stands: the first *autonomous crawler* (not a human-driven test) to settle its bill gets a commemorative entry in `llms.txt` and our genuine respect.

**Is this a real business?** — It's a working demonstration of one. Twenty years of robots reading the web for free is ending; pay-per-crawl, x402 and agentic checkout are how the next twenty get metered. botfee.com is the smallest possible working model of that future.

## License

MIT. Fork it, point it at your wallet, start your own toll booth.
