# RideDesk MCP servers

[RideDesk](https://ridedesk.app) is booking & dispatch software for transfer,
chauffeur, taxi and vehicle-rental operators. It exposes two kinds of
[Model Context Protocol](https://modelcontextprotocol.io) servers, both
published in the [Official MCP Registry](https://registry.modelcontextprotocol.io)
under the `app.ridedesk/*` namespace. This repository holds their registry
definitions (`server.json`) and connection notes — the product itself is not
open source.

## `app.ridedesk/docs` — developer documentation server

```
https://ridedesk.app/api/mcp
```

Auth-free and read-only. Serves RideDesk's developer documentation as
queryable tools, so a coding agent can pull the exact API contract while it
builds a booking website:

| Tool | Purpose |
| --- | --- |
| `list_docs` | The available documentation topics |
| `get_doc` | One topic as markdown (pass the operator's domain as `host` for tailored examples) |
| `search_docs` | Keyword search across all topics |
| `get_integration_brief` | A self-contained brief for building a booking site on the REST API |
| `get_widget_snippets` | Copy-paste embed/attribution/live-chat tags |

Add it to Claude Code:

```
claude mcp add --transport http ridedesk-docs https://ridedesk.app/api/mcp
```

## `app.ridedesk/bookings` — per-operator booking server

```
https://{tenant_domain}/api/mcp
```

Every RideDesk account is its own MCP server on its own domain
(`<workspace>.ridedesk.app` or a verified custom domain). Connect Claude,
ChatGPT or any MCP client and the agent can fetch live, server-priced quotes
and create real bookings on that operator's desk.

- **Tools:** `list_options`, `get_quote`, `book_transfer`, `get_booking`
- **Auth:** OAuth 2.1 (RFC 7591 dynamic client registration, PKCE) for chat
  apps — paste the URL as a custom connector and approve as signed-in staff —
  or a static `Authorization: Bearer <key>` for CLI/IDE clients
- **Money is server-authoritative:** an agent can never set, compute or
  invent a price; every figure comes from the operator's own rate card via
  the stored quote

Requires the operator's **AI agents** add-on, enabled in their panel under
Settings → AI agents.

## Documentation

- Human-readable docs: https://ridedesk.app/developers
- Machine-readable map: https://ridedesk.app/llms.txt
- Registry entries: `curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=ridedesk"`

## Maintainer

RideDesk is operated by RidenRank Ltd (UK). Contact: hello@ridedesk.app
