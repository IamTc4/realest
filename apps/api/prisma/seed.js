const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@developerbee.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@developerbee.com',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  const agent = await prisma.user.upsert({
    where: { email: 'agent@developerbee.com' },
    update: {},
    create: {
      name: 'Agent Smith',
      email: 'agent@developerbee.com',
      password: hashedPassword,
      role: 'AGENT',
      status: 'ACTIVE',
      stats: {
        create: {
          totalLeads: 10,
          closedDeals: 2,
          totalRevenue: 5000000,
          rating: 4.8
        }
      }
    },
  });

  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      name: 'John Buyer',
      email: 'client@example.com',
      password: hashedPassword,
      role: 'CLIENT',
      status: 'ACTIVE',
    },
  });

  // Properties
  const prop1 = await prisma.property.create({
    data: {
      title: 'Luxury Villa in Beverly Hills',
      description: 'A stunning 5-bedroom villa with a pool and garden.',
      type: 'VILLA',
      price: 4500000,
      location: 'Beverly Hills, CA',
      builder: 'Prestige Builders',
      bedrooms: 5,
      bathrooms: 6,
      areaSqFt: 5000,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=800&q=80'
      ]),
      amenities: 'Pool,Gym,Garden,Garage',
      status: 'AVAILABLE'
    }
  });

  const prop2 = await prisma.property.create({
    data: {
      title: 'Modern Apartment in Downtown',
      description: 'High-rise apartment with city view.',
      type: 'APARTMENT',
      price: 850000,
      location: 'Downtown, NY',
      builder: 'Urban Living',
      bedrooms: 2,
      bathrooms: 2,
      areaSqFt: 1200,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
      ]),
      amenities: 'Gym,Concierge,Rooftop',
      status: 'AVAILABLE'
    }
  });

  // Leads
  await prisma.lead.create({
    data: {
      name: 'Alice Wonder',
      email: 'alice@example.com',
      phone: '1234567890',
      budgetMin: 800000,
      budgetMax: 1000000,
      location: 'Downtown, NY',
      propertyType: 'APARTMENT',
      intent: 'BUYER',
      status: 'NEW',
      agentId: agent.id
    }
  });

  await prisma.lead.create({
    data: {
      name: 'Bob Builder',
      email: 'bob@example.com',
      phone: '0987654321',
      budgetMin: 4000000,
      budgetMax: 5000000,
      location: 'Beverly Hills, CA',
      propertyType: 'VILLA',
      intent: 'BUYER',
      status: 'CONTACTED',
      agentId: agent.id
    }
  });

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
