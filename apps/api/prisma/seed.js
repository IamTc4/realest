const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Cleanup
  try {
    await prisma.interaction.deleteMany();
    await prisma.task.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.savedProperty.deleteMany();
    await prisma.property.deleteMany();
    await prisma.agentStat.deleteMany();
    await prisma.user.deleteMany();
    await prisma.automationRule.deleteMany();
    await prisma.organization.deleteMany();
  } catch(e) { console.log('Cleanup skipped or partial'); }

  // 1.1 Organization (SaaS)
  await prisma.organization.create({
    data: {
        name: 'DeveloperBee HQ',
        brandColor: '#059669', // Emerald
        plan: 'ENTERPRISE',
        leadsLimit: 5000
    }
  });

  // 1.2 Automations (Phase 2)
  const rules = [
      { name: 'New Lead Auto-Reply', trigger: 'LEAD_CREATED', actionType: 'SEND_WHATSAPP', template: 'welcome_msg', isActive: true },
      { name: 'Follow-up Reminder (24h)', trigger: 'NO_RESPONSE_24H', actionType: 'CREATE_TASK', template: 'call_reminder', isActive: true },
      { name: 'Hot Lead Alert', trigger: 'SCORE_ABOVE_80', actionType: 'NOTIFY_ADMIN', template: 'hot_lead_alert', isActive: true },
  ];

  for (const rule of rules) {
      await prisma.automationRule.create({ data: rule });
  }

  // 2. Users
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@developerbee.com',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  const agent1 = await prisma.user.create({
    data: {
      name: 'Agent Smith',
      email: 'agent@developerbee.com',
      password: hashedPassword,
      role: 'AGENT',
      status: 'ACTIVE',
      stats: { create: { totalLeads: 45, closedDeals: 12, totalRevenue: 12500000, rating: 4.9 } }
    },
  });

  const agent2 = await prisma.user.create({
    data: {
      name: 'Sarah Connor',
      email: 'sarah@developerbee.com',
      password: hashedPassword,
      role: 'AGENT',
      status: 'ACTIVE',
      stats: { create: { totalLeads: 38, closedDeals: 8, totalRevenue: 8500000, rating: 4.7 } }
    },
  });

  const client = await prisma.user.create({
    data: {
      name: 'John Buyer',
      email: 'client@example.com',
      password: hashedPassword,
      role: 'CLIENT',
      status: 'ACTIVE',
    },
  });

  // 3. Properties (More data)
  const propertyTypes = ['APARTMENT', 'VILLA', 'PLOT', 'COMMERCIAL'];
  const locations = ['Downtown', 'Beverly Hills', 'Suburbs', 'Beachfront', 'Tech Park', 'Green Valley'];

  const properties = [];
  for (let i = 0; i < 20; i++) {
    const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const price = Math.floor(Math.random() * 5000000) + 200000;
    const prop = await prisma.property.create({
      data: {
        title: `${type === 'VILLA' ? 'Luxury ' : 'Modern '}${type} in ${locations[i % locations.length]}`,
        description: 'A premium property with state-of-the-art amenities.',
        type: type,
        status: Math.random() > 0.8 ? 'SOLD' : 'AVAILABLE',
        price: price,
        location: locations[i % locations.length],
        builder: 'Premium Builders Inc',
        bedrooms: Math.floor(Math.random() * 5) + 1,
        bathrooms: Math.floor(Math.random() * 4) + 1,
        areaSqFt: Math.floor(Math.random() * 4000) + 800,
        images: JSON.stringify([
          `https://source.unsplash.com/800x600/?house,${type.toLowerCase()}`,
          'https://source.unsplash.com/800x600/?interior,living'
        ]),
        amenities: 'Pool,Gym,Security,Parking',
      }
    });
    properties.push(prop);
  }

  // 4. Leads & Historical Data
  const leadStatuses = ['NEW', 'CONTACTED', 'SITE_VISIT', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];
  const leadSources = ['WEBSITE', 'FACEBOOK', 'GOOGLE_ADS', 'REFERRAL', 'WHATSAPP'];
  const intents = ['BUYER', 'INVESTOR', 'SELLER'];

  // Generate 100 leads over last 6 months
  const now = new Date();
  for (let i = 0; i < 100; i++) {
    const monthsAgo = Math.floor(Math.random() * 6);
    const createdAt = new Date(now.getFullYear(), now.getMonth() - monthsAgo, Math.floor(Math.random() * 28));

    const status = leadStatuses[Math.floor(Math.random() * leadStatuses.length)];
    const source = leadSources[Math.floor(Math.random() * leadSources.length)];

    // Weighted Agent Assignment
    const assignedAgent = Math.random() > 0.5 ? agent1 : (Math.random() > 0.5 ? agent2 : null);

    const lead = await prisma.lead.create({
      data: {
        name: `Lead ${i + 1}`,
        email: `lead${i + 1}@example.com`,
        phone: `+1555000${i.toString().padStart(4, '0')}`,
        budgetMin: 500000,
        budgetMax: 1500000,
        location: locations[Math.floor(Math.random() * locations.length)],
        propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
        timeline: 'Immediate',
        intent: intents[Math.floor(Math.random() * intents.length)],
        status: status,
        source: source,
        score: Math.floor(Math.random() * 100),
        agentId: assignedAgent ? assignedAgent.id : null,
        createdAt: createdAt,
        updatedAt: createdAt
      }
    });

    // Add interactions
    if (status !== 'NEW') {
        await prisma.interaction.create({
            data: {
                leadId: lead.id,
                type: 'CALL',
                content: 'Introductory call completed.',
                createdAt: new Date(createdAt.getTime() + 86400000)
            }
        });
    }
    if (status === 'CLOSED_WON') {
         // Update agent revenue manually for this seed
         if (assignedAgent) {
             // In real app we'd update atomic, here just simplified
         }
    }
  }

  console.log('Deep Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
