# ShopKart

ShopKart is a full-stack e-commerce application with a React frontend and an Express API backed by MongoDB. It includes customer registration and login, product browsing, a wishlist, a customer cart, order history, and Razorpay checkout.

## Features

- React 19 and Vite storefront with product search, category filtering, and price sorting.
- Express and Mongoose API for customer accounts, products, carts, wishlists, and orders.
- Password hashing with bcrypt and JWT authentication stored in an HttpOnly cookie.
- MongoDB persistence for customer, product, and order data.
- Razorpay payment-order creation and server-side payment signature verification.

## Requirements

- Node.js 20.19 or newer (required by the Vite 8 toolchain).
- npm.
- A MongoDB database, either a local MongoDB server or a MongoDB Atlas cluster.
- Razorpay test API credentials for checkout. The backend requires a non-empty Razorpay key ID at startup; the placeholder in `.env.example` is enough to boot the API, but real test credentials are needed to complete payments.

## Setup

### 1. Configure the backend

In a terminal at the repository root:

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Edit `backend/.env` with your local MongoDB connection string and a private JWT secret:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shopkart
JWT_SECRET=replace-with-a-long-random-secret
NODE_ENV=development
RAZORPAY_KEY_ID=your-razorpay-test-key-id
RAZORPAY_KEY_SECRET=your-razorpay-test-key-secret
```

For MongoDB Atlas, use the connection string provided by Atlas as `MONGO_URI`, and ensure your current IP address is allowed by the cluster network access rules. Keep the database username and password inside the local `.env` file.

Start the API from the `backend` directory:

```powershell
npm run dev
```

The API listens on `http://localhost:5000`. Visit that URL to confirm the server is running.

### 2. Configure and start the frontend

Open a second terminal at the repository root:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`). The frontend currently calls the API at `http://localhost:5000`; the backend CORS configuration allows the Vite development origin at port `5173`.

### 3. Add sample products (optional)

To populate the storefront, stop using any database that contains data you want to keep, then run this from the `backend` directory:

```powershell
node seed.js
```

**Warning:** the seed script deletes all existing customer and product documents in the configured database before adding sample products. Point `MONGO_URI` at a disposable development database first. It does not seed orders.

## Database integration

The backend loads `MONGO_URI` from `backend/.env` and connects with Mongoose before it starts accepting requests. Customer registration/login and protected cart, wishlist, and order endpoints use MongoDB-backed models. Product data is also read from MongoDB, so a fresh database will show no products until you seed it or add product documents.

After starting the backend, `GET http://localhost:5000/products` returns the product list. A successful response with an empty `products` array means the API and database are reachable but the database has not been populated yet. If the backend reports a connection error, verify the URI, local MongoDB service or Atlas network access, and database credentials.

## API overview

All routes are served from `http://localhost:5000`:

| Route | Methods | Purpose |
| --- | --- | --- |
| `/customers/register`, `/customers/login` | `POST` | Create an account and log in |
| `/customers/me`, `/customers/logout`, `/customers/change-password` | `GET`, `POST`, `PATCH` | Authenticated customer profile and account actions |
| `/products`, `/products/:id` | `GET` | List and view products; list supports `search`, `category`, and `sort` query parameters |
| `/cart`, `/cart/:productId` | `GET`, `POST`, `PATCH`, `DELETE` | Manage the signed-in customer's cart |
| `/wishlist`, `/wishlist/:productId` | `GET`, `POST`, `DELETE` | Manage the signed-in customer's wishlist |
| `/orders`, `/orders/:id` | `GET` | View the signed-in customer's orders |
| `/orders/create-payment-order`, `/orders/verify-payment` | `POST` | Create an order and verify a Razorpay payment |

Cart, wishlist, customer account, and order routes require the login cookie. Use Razorpay test credentials for checkout testing; placeholder values do not authorize payments.

## Production build

Build and preview the frontend from the `frontend` directory:

```powershell
npm run build
npm run preview
```

For a deployment, configure the frontend API base URL and backend CORS origin for the deployed domains, set production MongoDB/JWT/Razorpay environment variables in the hosting provider, and use HTTPS so secure authentication cookies work. The current frontend API URL and backend CORS origin are configured for local development.

## Secrets and environment files

Never commit `.env` files, database credentials, JWT secrets, or Razorpay secrets. The backend `.gitignore` excludes environment files while allowing `.env.example`, which contains placeholders only. If a secret has already been committed, rotate it; adding it to `.gitignore` does not remove it from Git history.
