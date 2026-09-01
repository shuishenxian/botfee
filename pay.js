const fs = require("fs");
const { privateKeyToAccount } = require("viem/accounts");
const { wrapFetchWithPayment, decodeXPaymentResponse } = require("x402-fetch");

(async () => {
  const pk = fs.readFileSync(__dirname + "/.payer_key", "utf8").trim();
  const account = privateKeyToAccount(pk);
  console.log("payer:", account.address);
  const fetchWithPay = wrapFetchWithPayment(fetch, account);
  const res = await fetchWithPay("https://botfee.com/paid");
  console.log("HTTP", res.status);
  const pr = res.headers.get("x-payment-response");
  if (pr) console.log("settlement:", JSON.stringify(decodeXPaymentResponse(pr), null, 2));
  const body = await res.text();
  console.log(body.slice(0, 200).replace(/\s+/g, " "));
})().catch(e => { console.error("FAIL:", (e && e.message) || e); process.exit(1); });
