# Vegetable Market Frontend

Angular customer storefront and admin CRUD dashboard for the Node.js/Express backend.

## Requirements
- Node.js 20.11+ recommended
- PostgreSQL-backed backend already running at `http://localhost:3000`

## Run
1. Extract this ZIP.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:4200`.

## Included
- Customer storefront without customer login
- Search, product cards, quantity selection and cart
- Cash on Delivery checkout
- Admin product listing, add, edit, delete
- Image upload via multipart/form-data
- Separate HTML, CSS and TypeScript files for App, Home, Cart and Admin components
- Responsive layout for mobile browsers
- API base URL in `src/app/services/vegetable-api.service.ts`

## Backend endpoints expected
- `GET /api/vegetables?search=...&page=1&limit=100` returns `{ data, pagination }`
- `GET /api/vegetables/:id`
- `POST /api/vegetables` with multipart fields `name`, `description`, `price`, `stock_quantity`, `unit`, `is_available`, and optional `image`
- `PUT /api/vegetables/:id` with the same fields
- `DELETE /api/vegetables/:id`
- `POST /api/checkout/cod` with `customer_name`, `phone`, `address`, `items: [{id, quantity}]`

The backend serves local images under `/uploads/...`; the frontend prefixes relative image paths with `http://localhost:3000`.

## Admin access note
This starter includes an admin panel route (`/admin`) without authentication for local development only. Do not expose it publicly until backend admin endpoints are protected and the frontend includes admin authentication.

## Troubleshooting
- If products fail to load, check `http://localhost:3000/api/health` and ensure the backend is running.
- If the browser reports CORS errors, ensure backend `CORS_ORIGINS` includes `http://localhost:4200`, then restart the backend.
- If product images do not load, verify the returned `image_url` begins with `/uploads/` and the image file exists in backend `uploads`.
