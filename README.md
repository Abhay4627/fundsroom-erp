# Fundsroom ERP – Mini ERP + CRM Operations Portal

A full-stack Mini ERP + CRM Operations Portal developed as a technical case study for Fundsroom.

The application provides customer management, product and inventory management, stock movement tracking, sales challan processing, authentication, and role-based access control.

## Live Application

**Frontend:**  
https://fundsroom-erp-iota.vercel.app

**Backend:**  
https://fundsroom-erp-9ro1.onrender.com

**Health Check:**  
https://fundsroom-erp-9ro1.onrender.com/health

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| ADMIN | admin@fundsroom.com | Admin@123 |
| SALES | sales@fundsroom.com | Admin@123 |
| WAREHOUSE | warehouse@fundsroom.com | Admin@123 |
| ACCOUNTS | accounts@fundsroom.com | Admin@123 |

## Role-Based Access

- **ADMIN** – Full access to all modules
- **SALES** – Customer management and Sales Challans
- **WAREHOUSE** – Product and Stock Movement management
- **ACCOUNTS** – View operational data

## Features

- JWT-based authentication
- Role-based access control
- Customer management
- Add, edit, search, and view customer details
- Customer follow-up date and notes
- Product management
- Inventory management
- Stock movement tracking
- Sales challan management
- Multiple products in a single challan
- Draft, Confirmed, and Cancelled challan status
- Automatic stock deduction for confirmed challans
- Negative stock prevention
- Insufficient stock validation
- Dashboard with operational summary

## Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- TypeScript
- JWT
- bcryptjs

### Database

- PostgreSQL
- Neon PostgreSQL

### Deployment

- Vercel – Frontend
- Render – Backend
- Neon – Database

## Main API Endpoints

### Authentication

```text
POST /auth/login

GET /customers
GET /customers/:id
POST /customers
PUT /customers/:id

GET /products
GET /products/:id
POST /products
PUT /products/:id

GET /stock-movements
POST /stock-movements

GET /challans
GET /challans/:id
POST /challans

GET /health


### STEP 8 — API Documentation

```md
## API Documentation

A Postman collection is included for testing the REST APIs.

The collection covers:

- Authentication
- Customers
- Products
- Stock Movements
- Sales Challans
- Health Check

## Database Modules

- Users
- Customers
- Products
- Stock Movements
- Challans
- Challan Items
- Follow Ups
## Business Logic

When a sales challan is created with status `Confirmed`, the system:

1. Validates available product stock.
2. Creates the sales challan.
3. Creates challan items.
4. Deducts the sold quantity from product stock.
5. Creates an `OUT` stock movement.

Draft challans do not reduce inventory.

If the requested quantity is greater than available stock, the system returns an error and prevents the transaction.

## Project Structure

```text
fundsroom-erp/
├── backend/
│   ├── src/
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
├── fundsroom_backup.sql
├── README.md
└── .gitignore


### STEP 12 — Local Setup

```md
## Local Setup

### Backend

```bash
cd backend
npm install
npm run build
npm start


## Environment Variables

Create a `.env` file inside the backend directory:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret


### STEP 14 — Assumptions & Limitations

Iske neeche:

```md
## Assumptions & Limitations

- JWT is used for authentication.
- Role-based access control is enforced by the backend.
- Confirmed challans reduce available stock.
- Draft challans do not reduce inventory.
- Negative stock is not allowed.
- Neon PostgreSQL is used for the deployed database.
- Vercel is used for frontend deployment.
- Render is used for backend deployment.
- This project is implemented as a technical case-study solution.
- Advanced ERP features such as invoicing, payment processing, purchase orders, and financial accounting are outside the current scope.

## Testing

The application was tested for:

- User authentication
- Role-based access
- Customer CRUD operations
- Product CRUD operations
- Inventory display
- Stock movement tracking
- Sales challan creation
- Multiple products per challan
- Draft challan behavior
- Confirmed challan stock deduction
- Insufficient stock validation
- REST API responses
- Live deployed application functionality



