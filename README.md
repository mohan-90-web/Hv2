# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Watch Number Selection Backend

The serial-number picker UI is present, but its database-backed number chart and reservation API are not implemented in this project yet. The picker requests `/api/serials/chart?product=...`; in local development it resolves the portal origin from the picker script, so it currently requests the local Vite host, where that API does not exist. The grid cannot load until a backend is deployed and the picker is configured to use it, or Vite proxies the API during development.

### Database Requirements

- Map each watch product to a number pool or chapter. Preserve current IDs as migration references where useful: Veni `9059827024026`; Vici `9063617233050`; Vidi `9063535313050`; Ecru `9063653572762`; Jura Gruen `9063737753754`; Lac Leman `9063672447130`.
- Store number pools/chapters, tiers, and watch numbers. Each number needs its pool, numeral/display label, tier, reservation fee, and state (`available`, `held`, `sold`, or `withheld`). Enforce uniqueness of a numeral within its pool.
- Store holds with the number, session ID, private hold token, state, and expiry. Holds last 12 minutes. Creating or refreshing a hold must be atomic so concurrent shoppers cannot hold the same number.
- Link holds to orders/reservations. A paid order permanently marks the number sold; expiry, release, cancellation, and refund transitions must be handled.
- Add a waitlist table if the queue feature is enabled. Custom-number checks must use the same number register.

### Required API

- `GET /api/serials/chart?product=...`: return product and chapter details, tiers, and number rows. The picker reads row fields `n`, `display`, `tierId`, `status`, `feeInr`, and `freeInSeconds`.
- `GET /api/serials/custom?product=...&serial=...`: check a requested numeral and return whether it is available, its quote, and alternatives when unavailable.
- `POST /api/serials/hold`: atomically reserve a number and return the hold token, serial, expiry, fee, and tier details.
- `POST /api/serials/release`: release a hold by token.
- `POST /api/serials/queue`: add a shopper to the waitlist for a number.
- `POST /api/serials/revalidate`: validate all held numbers in the cart before checkout.

The picker implementation is in [`public/portal.czard.com/czard-serial-picker.js`](public/portal.czard.com/czard-serial-picker.js). Its API origin is configurable through the script's `data-portal` attribute. The backend must also validate input, rate-limit public endpoints, protect hold tokens, and perform inventory changes transactionally; database tables alone are not sufficient.
