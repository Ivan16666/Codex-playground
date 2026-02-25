# Orders Playground

A full-stack Next.js (App Router) TypeScript app with in-memory product and order management.

## Features

- Admin dashboard: create products, update price, adjust stock, view all orders.
- Customer app: browse products, cart interactions, stock-aware checkout.
- Orders API: creates orders with customer name, line items, total, and deducts stock.
- Responsive clean UI with simple sidebar navigation.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

> Note: Data is stored in memory (`lib/store.ts`) and resets when server restarts.
