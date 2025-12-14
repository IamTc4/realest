# DeveloperBee Platform - Deployment Guide

This guide covers how to deploy the Hybrid Real Estate App (DeveloperBee) for both development and production environments.

## System Architecture

The project follows a Monorepo structure:
- **Root**: Configuration files.
- **apps/api**: Node.js/Express Backend + Prisma ORM + SQLite (Production-ready for PostgreSQL).
- **apps/web**: Next.js 14 Frontend + Tailwind CSS.

---

## 🛠 Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git**

---

## 🚀 1. Database Setup

The backend uses **Prisma ORM**. By default, it is configured to use SQLite for easy prototyping, but can be switched to PostgreSQL.

### Initialize the Database
Navigate to the API folder and install dependencies:

```bash
cd apps/api
npm install
```

### Apply Schema & Seed Data
Create the database tables and populate them with the "Alive" enterprise demo data:

```bash
# Push schema to database
npx prisma db push

# Seed historical data (Leads, Properties, Stats, Organizations)
node prisma/seed.js
```

*Note: The seed script generates 6 months of historical data to ensure dashboards look active immediately.*

---

## 🖥 2. Backend Deployment (API)

The backend runs on port `3001` by default.

### Development Mode
```bash
cd apps/api
npm install
# Install nodemon for hot-reloading if not installed
npm install -g nodemon
nodemon index.js
```

### Production Mode
For production, use a process manager like `pm2`.

```bash
cd apps/api
npm install --production

# Start using PM2
pm2 start index.js --name "developerbee-api"
```

**Environment Variables (`apps/api/.env`):**
Create a `.env` file in `apps/api/`:
```env
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secure-secret-key-change-this"
```

---

## 🌐 3. Frontend Deployment (Web)

The frontend runs on port `3000` by default and connects to the API at `http://localhost:3001` (configurable).

### Development Mode
```bash
cd apps/web
npm install
npm run dev
```

### Production Build
Next.js produces an optimized production build.

```bash
cd apps/web
npm install
npm run build
npm start
```

For persistent production execution using PM2:
```bash
pm2 start npm --name "developerbee-web" -- start
```

**Configuration:**
If deploying to a remote server, update the API URL in the frontend code or use an environment variable (e.g., `NEXT_PUBLIC_API_URL`) if implemented in the fetch calls. Currently, the prototype defaults to `localhost:3001`.

---

## 🐳 Docker Deployment (Optional)

The project includes `Dockerfile` configurations in both apps.

### Using Docker Compose
(If a `docker-compose.yml` exists at root)

```bash
docker-compose up --build -d
```

This will spin up both the API and Web containers.

---

## ✅ Verification Checklist

After deployment, verify the following:

1.  **Landing Page**: Go to `http://localhost:3000`. You should see the Client Landing Page.
2.  **Admin Login**: Go to `http://localhost:3000/admin`.
    *   **Credentials**: `admin@developerbee.com` / `password123`
    *   **Verify**: Check "Total Revenue" chart shows a trend line.
3.  **Agent Portal**: Go to `http://localhost:3000/agent`.
    *   **Credentials**: `agent@developerbee.com` / `password123`
    *   **Verify**: Check "Agent Score" and "Pipeline" visual.
4.  **API**: Visit `http://localhost:3001/api/properties` to ensure JSON data is returned.

---

## ⚠️ Troubleshooting

**Prisma Errors**:
If you see "Prisma Client not initialized":
```bash
cd apps/api
npx prisma generate
```

**Frontend Connection Refused**:
Ensure the backend is running on Port 3001. If hosted remotely, update the fetch URLs in `apps/web/pages` to point to the production IP/Domain.
