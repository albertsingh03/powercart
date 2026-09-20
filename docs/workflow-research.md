# Workflow research

Reviewed 20 September 2026. These are first-party feature descriptions, not independent accuracy tests.

## Useful patterns

| Product | Documented workflow | Application to Power Cart |
| --- | --- | --- |
| WiseList | Photograph a receipt, review recognised lines, correct uncertain matches, then save. Duplicate detection compares store, date and total. | Batch purchase review and idempotent imports; never silently assume an uncertain product match. |
| WiseList | Purchased shopping items can move into pantry stock; manual and barcode entry coexist; opened/sealed status is separate. | One purchase event should update stock and the shopping list together. Opening belongs to a stock batch. |
| Grocy | External barcode lookup with in-place selection/creation for unknown products; minimum-stock shopping lists. | Catalogue failure must not block setup. Support manually confirmed details, links and labels. |
| KitchenPal | Text, voice and barcode entry; quantities and expiry; suggestions based on finished, low and frequently purchased items. | Let users make short everyday corrections instead of maintaining every field every day. |

Sources:
- https://www.wiselist.app/help/how-to-use-scan-receipt/
- https://www.wiselist.app/help/how-to-use-the-fridge-and-pantry-list/
- https://grocy.info/
- https://github.com/grocy/grocy#barcode-lookup-via-external-services
- https://kitchenpalapp.com/en/

## Recommended order for personal use

1. Set up exact products and usual consumption from plain text in chat. Review only missing or ambiguous information. Leave current stock unknown until counted.
2. Save confirmed names and aliases on the existing product record, preserving its ID and history.
3. Make a separate initial stock count, distinguishing open stock from unopened packs where useful.
4. Use Bought, Opened, Finished, Correct stock and Undo for everyday updates.
5. Add receipt extraction with one review screen and duplicate-import protection after the manual workflow is proven.

## Boundaries

- Product identity lookup is separate from live price comparison.
- A catalogue miss does not mean the product is unavailable online.
- Record actual usage; do not infer supplement or medicine doses.
- Irregular usage, gym-day-only usage and approximate bottle lifetimes need explicit modelling. The current app supports one average daily rate only.
- Reliable learned consumption forecasting and universal duplicate detection are proposed improvements, not verified competitor capabilities.
- WiseList's documented receipt coverage focuses on Coles, Woolworths and ALDI; pharmacy and supplement coverage must be tested separately.
- Receipt corrections should create auditable stock corrections rather than erase already-consumed purchase history.
