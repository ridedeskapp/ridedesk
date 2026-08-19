// The RideDesk integration in three calls: quote → book → obey the checkout
// contract. Runs on Node 18+ (built-in fetch), no dependencies.
//
//   RIDEDESK_DOMAIN=your-company.ridedesk.app node quote-and-book.mjs
//
// Replace the placeholder domain with a real operator's RideDesk domain
// (<workspace>.ridedesk.app or their verified custom domain). Full docs:
// https://ridedesk.app/developers — or ask the docs MCP server at
// https://ridedesk.app/api/mcp (tool: get_integration_brief).

const BASE = `https://${process.env.RIDEDESK_DOMAIN || 'your-company.ridedesk.app'}`;

// 1) Price it — the server measures the route and prices EVERY vehicle class.
//    No captcha on /api/quote; it is rate-limited per IP instead.
const { quote } = await fetch(`${BASE}/api/quote`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pickup_location: 'Frankfurt Airport (FRA)',
    dropoff_location: 'Hauptbahnhof, Koblenz',
    trip_type: 'one_way',            // one_way | return | hourly
    pickup_date: '2026-09-06T14:30', // enables surcharges & early-booking discounts
    voucher_code: 'WELCOME10',       // optional — validated server-side
  }),
}).then((r) => r.json());

// quote.prices = { Economy: { total }, Business: { total }, … } — FINAL figures.
// Never compute or adjust a price yourself; the quote is the contract.
console.log('Quoted classes:', Object.keys(quote.prices));
console.log('Business total:', quote.prices.Business?.total);

// 2) Book the quote — price, route and voucher come from the stored record.
//    The quote ref locks the price for 45 minutes, one booking per ref.
//    If the operator has captcha enforcement on, browser bookings also need a
//    turnstile_token from the Turnstile widget on your page.
const res = await fetch(`${BASE}/api/transfers`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    quote_ref: quote.ref,
    vehicle_type: 'Business',
    pickup_location: 'Frankfurt Airport (FRA)',
    dropoff_location: 'Hauptbahnhof, Koblenz',
    pickup_date: '2026-09-06T14:30',
    price: quote.prices.Business.total,
    client_name: 'Jane Doe',
    client_email: 'jane@example.com',
    client_phone: '+49 170 1234567',
  }),
}).then((r) => r.json());

// 3) Obey the checkout contract — never hardcode a payment flow.
//    The operator decides what happens after a booking once, in their panel,
//    and the response carries the answer:
//      res.checkout.mode === 'email'  → show a thank-you page; the pay link is emailed
//      res.checkout.mode === 'link'   → redirect the customer to res.checkout.pay_url
//      res.checkout.mode === 'inline' → render Stripe on your page with
//                                       res.checkout.publishable_key
console.log('Booking created:', res.id);
console.log('Checkout mode:', res.checkout?.mode);
