# Fundsroom ERP – Mini ERP + CRM Operations Portal

A full-stack Mini ERP + CRM Operations Portal developed as a technical case study for Fundsroom.

## Live Application

Frontend:
https://fundsroom-erp-iota.vercel.app

Backend:
https://fundsroom-erp-9ro1.onrender.com

Health Check:
https://fundsroom-erp-9ro1.onrender.com/health

## Demo Credentials

Email: admin@fundsroom.com
Password: Admin@123

Role: ADMIN

## Features

- Admin login with JWT authentication
- Customer management
- Product management
- Inventory management
- Sales challan management
- Stock movement tracking
- Automatic stock deduction for confirmed challans
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
POST /auth/login

### Customers
GET /customers
GET /customers/:id
POST /customers
PUT /customers/:id

### Products
GET /products
GET /products/:id
POST /products
PUT /products/:id

### Inventory
GET /stock-movements
POST /stock-movements

### Sales Challans
GET /challans
GET /challans/:id
POST /challans

### Health
GET /health

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
5. Creates an OUT stock movement.

Draft challans do not reduce inventory.

## Project Structure

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

## Local Setup

### Backend

```bash
cd backend
npm install
npm run build
npm start