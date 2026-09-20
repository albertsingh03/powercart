# Power Cart personal-use roadmap

## Current state

Working: private website, compact inventory list, product lookup with manual fallback, daily-use estimates, stock corrections, purchases, batch opening and planning dates, shopping list, receipt storage, history and undo.

Partial: Siri opens a staged update for confirmation; Apple Reminders use a manual handoff. Product catalogue coverage varies. Receipt extraction and scheduled price monitoring are not connected.

## Next: make initial setup easy

- [ ] Accept product names, pack sizes and usage as plain text in chat.
- [ ] Convert supported amounts into canonical units and return a concise review of uncertain details.
- [ ] Provide a secure, authenticated bulk-edit handoff so confirmed chat details can update the existing website records without copying fields individually.
- [ ] Preserve product IDs and stock history, with stale-version checks and duplicate prevention.
- [ ] Leave current stock unknown until the user supplies a count; never treat setup as a purchase.
- [ ] Support approximate consumption and irregular schedules without presenting guesses as confirmed measurements.

## Then: everyday stock updates

- [ ] Initial stock snapshot with open/closed packs where relevant.
- [ ] Confirm Siri workflow on the user's iPhone.
- [ ] Reduce routine updates to Bought, Opened, Finished, Correct stock and Undo.
- [ ] Improve handling of products absent from online catalogues using product links or label photos.

## Later, after personal use validates the workflow

- [ ] Receipt item extraction, batch review, uncertain-match correction and duplicate-import checks.
- [ ] Supported retailer price sources, comparable unit prices, delivered cost and price history.
- [ ] Replenishment recommendations constrained by existing stock, use rate, expiry and storage.
- [ ] Apple Reminders integration and store-specific reminders.

Commercialisation is outside the current scope. Changes should reduce the owner's effort first.
