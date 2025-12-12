# Real Estate Automation Suite

A fully functional, production-grade SaaS application designed for Real Estate Agencies, Brokers & Builders.

## 🚀 Features

- **Lead Capture & Management**: Capture leads from multiple sources, auto-assign to agents, and track status.
- **AI Lead Scoring**: Intelligent scoring based on budget, intent, and timeline.
- **Property Inventory**: Manage properties with images, details, and availability.
- **CRM Pipeline**: Kanban-style status tracking (New -> Contacted -> Site Visit -> Closed).
- **Automations**: Visual workflow builder for automated follow-ups (Email/SMS simulation).
- **Dashboard Analytics**: Real-time charts for revenue, lead sources, and agent performance.
- **Role-Based Access**: Admin, Agent, and Manager roles.

## 🛠 Tech Stack

- **Backend**: Node.js (Express), Prisma ORM
- **Database**: SQLite (Default for Showcase) / PostgreSQL (Production ready via Docker)
- **Frontend**: Next.js, Tailwind CSS, Recharts, Lucide Icons
- **Deployment**: Docker, Docker Compose

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js v18+
- Docker (optional, for containerized run)

### Local Development (Showcase Mode)

1. **Setup Backend & Database**
   ```bash
   cd apps/api
   npm install
   npx prisma generate
   npx prisma db push
   node prisma/seed.js  # Seeds the DB with realistic demo data
   node index.js        # Starts server on port 3001
   ```

2. **Setup Frontend**
   Open a new terminal:
   ```bash
   cd apps/web
   npm install
   npm run dev          # Starts client on port 3000
   ```

3. **Access the App**
   Open [http://localhost:3000](http://localhost:3000)

4. **Login Credentials**
   - **Admin**: `admin@realestate.com` / `password123`
   - **Agent**: `sarah@realestate.com` / `password123`

### Docker Deployment

To spin up the entire stack (Postgres + API + Web):

```bash
docker-compose up --build
```

## 🏗 System Architecture

```mermaid
graph TD
    User[User (Browser)] -->|HTTP/React| Web[Next.js Frontend]
    Web -->|REST API| API[Node.js Express API]
    API -->|ORM| DB[(PostgreSQL / SQLite)]
    API -->|Jobs| Redis[Redis Queue]
    Redis -->|Process| Worker[Background Worker]

    subgraph "External Services"
        API -->|Send| WhatsApp[WhatsApp API]
        API -->|Send| Email[SendGrid]
        API -->|Send| SMS[Twilio]
    end
```

The system follows a classic 3-tier architecture:
1. **Client**: Next.js app handling UI, State, and Visualizations.
2. **Server**: Express.js monolithic API handling business logic, auth, and data processing.
3. **Database**: Relational DB (Postgres) storing structured data for Leads, Users, and Properties.

## 📂 Project Structure

```
/
├── apps/
│   ├── api/          # Express Backend + Prisma + Seed Script
│   └── web/          # Next.js Frontend + Tailwind + Pages
├── docker-compose.yml
└── README.md
```

## 📄 License

MIT
