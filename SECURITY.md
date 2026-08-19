# Security policy

RideDesk's booking servers handle live customer bookings and payments, so we
take reports seriously.

## Reporting a vulnerability

Email **hello@ridedesk.app** with the details. Please include:

- The endpoint or server affected (`https://ridedesk.app/api/mcp` or a tenant's
  `https://<domain>/api/mcp`)
- Steps to reproduce
- What you were able to access or do

We will acknowledge within 3 business days. Please do not open a public issue
for security reports, and do not test against live operators' accounts —
booking endpoints create real dispatch jobs.

## Scope notes

- This repository holds registry definitions and examples only; the product
  itself is closed source. Reports about the hosted service are still welcome
  here via email.
- The docs server (`app.ridedesk/docs`) is deliberately auth-free and
  read-only. The bookings server requires OAuth 2.1 or an operator-issued API
  key, and agents can never set prices — money is always computed server-side
  from the operator's own rate card.
