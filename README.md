# Novamart B2B2C Platform

This is a production-grade B2B2C e-commerce platform built with Next.js (App Router), Node.js/Express, PostgreSQL (Prisma), and MongoDB.

## Features
- **Strict RBAC**: Admin, Manufacturer, Dealer, Customer.
- **Escrow Payments**: State-driven money flow.
- **Dispute Resolution**: Evidence-based admin dashboard.
- **Silent Tracking**: Behavioral analytics via MongoDB.
- **Audit Logging**: Immutable transaction logs.

## Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/)
- [MongoDB](https://www.mongodb.com/) (Optional, used for tracking)

### 2. Environment Configuration
Edit the `.env` file in the root directory:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/novamart?schema=public"
MONGODB_URI="mongodb://localhost:27017/novamart"
JWT_SECRET="your_secure_random_string"
```

### 3. Database Migration
Run the following commands to set up the PostgreSQL schema:
```bash
npx prisma db push
```

### 4. Installation
```bash
npm install
```

### 5. Run the Project
To run both the Frontend (Next.js) and Backend (Express) concurrently:
```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

## API Modules
Located in `src/api/` and `src/services/`:
- `auth`: Registration and JWT logic.
- `escrow`: Fund holding and release logic.
- `order`: Inventory locking and lifecycle management.
- `dispute`: Conflict resolution and evidence tracking.
```

## Dashboard Routes
- `/dashboard/admin`
- `/dashboard/manufacturer`
- `/dashboard/dealer`
- `/dashboard/customer`
