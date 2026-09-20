# Power Cart

A personal recurring-purchase inventory and replenishment website. Track what you own, estimate when it will run low, and make repeat shopping easier.

## Current features

- Compact inventory list with product setup and stock actions.
- Product-name and barcode lookup, manual entry and duplicate protection.
- Daily-use estimates, stock corrections, purchase history and undo.
- Batch label dates and after-opening limits.
- Shopping list based on low stock and pinned items.
- Receipt photo storage.
- Siri Shortcuts handoff that opens an update for review.

## Status and limits

This is a personal-use prototype. Receipt item extraction, background price monitoring and automatic Apple Reminders sync are not implemented. Product catalogue coverage varies, especially for health and personal-care items. Usage is a manually supplied daily average, not a learned consumption model.

This public source snapshot contains generic sample products only. It excludes personal inventory, purchase records, receipts, credentials and the private site's deployment identity.

## Architecture

React and Vinext, Cloudflare Workers, D1 for user-scoped records, R2 for receipt files. Production sign-in is supplied by the Sites platform. A separate authentication layer is required before deploying on another host; do not trust client-supplied identity headers.

The live website remains deployed separately. Pushing this repository does not deploy it automatically.

## Development

Use Node 22.13 or newer and the pnpm version declared in package.json. Install dependencies with the supplied install script. The repository includes a Sites-compatible build and local development scripts. Production requires configured D1/R2 bindings and schema migrations; an empty clone is not a deployed service.

```sh
node scripts/install-ci.mjs
npm run dev
npm run build
node --experimental-strip-types --test tests/*.test.mjs
node node_modules/typescript/bin/tsc --noEmit
```

Local sign-in helpers are development-only. Never deploy mock authentication or real user data as seed fixtures.

## How stock works

An initial count establishes the current stock. Purchases add stock; corrections replace estimates. Product setup does not assume ownership. Usage consumes stock against batch planning dates. Opened batches retain their opening clock. Updates are version-checked and auditable.

For health and supplement products, usage means the owner's reported consumption, never a recommended dose.

## Next steps

See [personal-use roadmap](docs/roadmap.md) and [workflow research](docs/workflow-research.md). Priorities are plain-text setup, secure bulk review and simple daily stock updates.

Third-party notices remain with their source files. No project-wide open-source licence has been selected yet.
