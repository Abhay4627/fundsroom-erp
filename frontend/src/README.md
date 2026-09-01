# Fundsroom ERP

A Mini ERP + CRM Operations Portal developed as a technical case study for Fundsroom.

## Project Overview

Fundsroom ERP is a web-based business operations portal designed to manage customers, products, inventory, stock movements, and sales challans from a single dashboard.

The application provides a simple workflow for CRM and operational management with a React frontend, Node.js/Express backend, and PostgreSQL database.

## Features

### Authentication
- Admin login
- JWT-based authentication
- Password hashing using bcrypt
- Protected user session using local storage

### Dashboard
- Total customers
- Total products
- Current stock
- Total sales challans

### Customer Management
- Add customers
- View customer list
- Customer type management
- Customer status management
- GST and business details
- Follow-up date and notes

### Product Management
- Product name
- SKU
- Category
- Unit price
- Current stock
- Minimum stock quantity
- Warehouse location

### Inventory Management
- Current stock tracking
- Minimum stock level
- Warehouse location
- Stock visibility

### Stock Movements
- IN stock movements
- OUT stock movements
- Movement reason
- Automatic OUT movement for confirmed sales challans

### Sales Challans
- Create sales challans
- Draft and Confirmed status
- Automatic challan number generation
- Customer-wise challan tracking
- Product quantity tracking
- Stock validation before confirmation
- Automatic stock deduction after confirmation

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- HTML/CSS

### Backend
- Node.js
- Express.js
- TypeScript
- JWT
- bcryptjs

### Database
- PostgreSQL

### Development Tools
- VS Code
- Git
- GitHub
- Postman

## System Architecture

```text
React Frontend
      |
      | HTTP REST API
      v
Node.js + Express Backend
      |
      | SQL Queries
      v
PostgreSQL Database