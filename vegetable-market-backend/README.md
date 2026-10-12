# Vegetable Market Backend

Node.js + Express + PostgreSQL backend for a vegetable market demo.

## Features

- Vegetable CRUD APIs
- Search by vegetable name and paginated listing
- Product image upload (JPEG, PNG, WEBP, GIF; max 5 MB)
- Local image serving from `/uploads`
- PostgreSQL health check
- Cash-on-delivery checkout that calculates totals on the server and does not persist customer/order details
- Checkout validates and decrements inventory inside a database transaction

## Requirements

- Node.js 18+
- PostgreSQL
- npm

## Setup

1. Create a PostgreSQL database named `vegetable_market`.
2. In pgAdmin Query Tool connected to that database, run `sql/schema.sql`.
3. Copy `.env.example` to `.env`.
   - Windows CMD: `copy .env.example .env`
   - PowerShell: `Copy-Item .env.example .env`
   - macOS/Linux: `cp .env.example .env`
4. Update `DB_PASSWORD` in `.env` to your PostgreSQL password.
5. Install packages: `npm install`
6. Start the development server: `npm run dev`
7. Open `http://localhost:3000/api/health`.

## API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Check API and database |
| GET | `/api/vegetables` | List vegetables |
| GET | `/api/vegetables?search=tomato&page=1&limit=20` | Search and paginate |
| GET | `/api/vegetables/:id` | Get one vegetable |
| POST | `/api/vegetables` | Create vegetable; JSON or multipart form |
| PUT | `/api/vegetables/:id` | Update vegetable; JSON or multipart form |
| DELETE | `/api/vegetables/:id` | Delete vegetable |
| POST | `/api/checkout/cod` | Validate COD checkout without saving an order |

### Add vegetable with photo

Send a `POST` request to `/api/vegetables` as `multipart/form-data` with fields:

- `name` (required)
- `price` (required)
- `stock_quantity` (required integer)
- `unit` (optional; defaults to `kg`)
- `description` (optional)
- `is_available` (optional boolean text, e.g. `true`)
- `image` (optional file)

Photo URLs are returned as paths such as `/uploads/1720000000000-tomato.jpg`. In Angular, prefix these paths with `http://localhost:3000`.

### Add vegetable without photo (JSON)

```json
{
  "name": "Spinach",
  "description": "Fresh green spinach",
  "price": 20,
  "stock_quantity": 50,
  "unit": "bunch"
}
```

### COD checkout example

`POST /api/checkout/cod` with JSON:

```json
{
  "customer_name": "Demo Customer",
  "phone": "9876543210",
  "address": "Delivery address for this demo",
  "items": [
    { "id": 1, "quantity": 2 },
    { "id": 2, "quantity": 1 }
  ]
}
```

The checkout response includes a calculated total and item summary. Customer details and orders are not persisted. Inventory is decremented. Since there is no stored order, the API cannot provide order history or admin order management.

## Test with curl

List products:
```bash
curl http://localhost:3000/api/vegetables
```

Create product:
```bash
curl -X POST http://localhost:3000/api/vegetables \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Spinach\",\"price\":20,\"stock_quantity\":50,\"unit\":\"bunch\"}"
```

## Important security notes

- This is a development/demo backend. Admin create/update/delete APIs are not authenticated yet. Add admin authentication and authorization before deploying publicly.
- Local uploads are not durable cloud storage and may be lost on redeploy.
- Do not commit `.env` or real customer information to source control.
- Because orders are not stored, there is no order history, fulfillment queue, or persistent proof of purchase.
