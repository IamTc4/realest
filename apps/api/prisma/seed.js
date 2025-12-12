const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Cleanup
  await prisma.interaction.deleteMany();
  await prisma.task.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.property.deleteMany();
  await prisma.agentStat.deleteMany();
  await prisma.automation.deleteMany();
  await prisma.user.deleteMany();

  // 1. Users
  const password = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@realestate.com',
      password,
      role: 'ADMIN',
    },
  });

  const agent1 = await prisma.user.create({
    data: {
      name: 'Sarah Realtor',
      email: 'sarah@realestate.com',
      password,
      role: 'AGENT',
    },
  });

  const agent2 = await prisma.user.create({
    data: {
      name: 'Mike Broker',
      email: 'mike@realestate.com',
      password,
      role: 'AGENT',
    },
  });

  console.log('Created Users');

  // 2. Stats
  await prisma.agentStat.create({
      data: { userId: agent1.id, totalRevenue: 1500000, closedDeals: 12, rating: 4.8 }
  });
  await prisma.agentStat.create({
      data: { userId: agent2.id, totalRevenue: 980000, closedDeals: 8, rating: 4.5 }
  });

  // 3. Properties
  const propertyTypes = ['APARTMENT', 'VILLA', 'PLOT'];
  const locations = ['Downtown', 'Suburbs', 'Beachfront', 'City Center'];

  const propertiesData = [
      { title: 'Luxury Villa with Sea View', price: 2500000, beds: 5, baths: 6, area: 4500, type: 'VILLA' },
      { title: 'Modern City Apartment', price: 450000, beds: 2, baths: 2, area: 1200, type: 'APARTMENT' },
      { title: 'Spacious Family Home', price: 850000, beds: 4, baths: 3, area: 2800, type: 'VILLA' },
      { title: 'Investment Plot', price: 150000, beds: 0, baths: 0, area: 5000, type: 'PLOT' },
      { title: 'Penthouse Suite', price: 1200000, beds: 3, baths: 3, area: 2200, type: 'APARTMENT' },
      { title: 'Cozy Studio', price: 250000, beds: 1, baths: 1, area: 600, type: 'APARTMENT' },
  ];

  for (const p of propertiesData) {
      await prisma.property.create({
          data: {
              title: p.title,
              price: p.price,
              location: locations[Math.floor(Math.random() * locations.length)],
              type: p.type,
              bedrooms: p.beds,
              bathrooms: p.baths,
              areaSqFt: p.area,
              images: JSON.stringify([
                  `https://source.unsplash.com/800x600/?house,${p.type.toLowerCase()}`,
                  `https://source.unsplash.com/800x600/?interior,living`
              ]),
              amenities: 'Pool,Gym,Parking,Security',
              status: 'AVAILABLE'
          }
      });
  }
  console.log('Created Properties');

  // 4. Leads
  const leadsData = [
      { name: 'John Doe', intent: 'BUYER', budget: 500000, status: 'NEW' },
      { name: 'Jane Smith', intent: 'INVESTOR', budget: 1000000, status: 'CONTACTED' },
      { name: 'Robert Johnson', intent: 'SELLER', budget: 0, status: 'NEW' },
      { name: 'Emily Davis', intent: 'BUYER', budget: 300000, status: 'SITE_VISIT' },
      { name: 'Michael Brown', intent: 'BUYER', budget: 750000, status: 'NEGOTIATION' },
      { name: 'Jessica Wilson', intent: 'INVESTOR', budget: 2000000, status: 'CLOSED_WON' },
      { name: 'David Miller', intent: 'BUYER', budget: 400000, status: 'FOLLOW_UP' },
      { name: 'Sarah Anderson', intent: 'BUYER', budget: 600000, status: 'NEW' },
  ];

  for (const l of leadsData) {
      const agentId = Math.random() > 0.3 ? (Math.random() > 0.5 ? agent1.id : agent2.id) : null;
      const lead = await prisma.lead.create({
          data: {
              name: l.name,
              email: l.name.toLowerCase().replace(' ', '.') + '@example.com',
              phone: '+1 555 ' + Math.floor(Math.random() * 9000 + 1000),
              intent: l.intent,
              budgetMin: l.budget * 0.9,
              budgetMax: l.budget * 1.1,
              status: l.status,
              source: ['ADS', 'REFERRAL', 'WEB'][Math.floor(Math.random() * 3)],
              score: Math.floor(Math.random() * 60) + 40,
              agentId
          }
      });

      // Interactions
      await prisma.interaction.create({
          data: {
              leadId: lead.id,
              type: 'SYSTEM',
              content: 'Lead created from Landing Page'
          }
      });

      if (l.status !== 'NEW') {
          await prisma.interaction.create({
              data: {
                  leadId: lead.id,
                  type: 'CALL',
                  content: 'Initial discovery call completed. Client is interested in 3BHK.'
              }
          });
      }
  }
  console.log('Created Leads');

  // 5. Automations
  await prisma.automation.create({
      data: {
          name: 'New Lead Welcome',
          triggerType: 'STATUS_CHANGE',
          triggerValue: 'NEW',
          isActive: true,
          actions: JSON.stringify([
              { icon: 'Mail', text: "Send Welcome Email" },
              { icon: 'Clock', text: "Wait 10 Minutes" },
              { icon: 'MessageSquare', text: "Send WhatsApp Intro" },
              { icon: 'Clock', text: "Wait 24 Hours" },
              { icon: 'Play', text: "Assign Task: Follow-up Call" }
          ])
      }
  });

  await prisma.automation.create({
      data: {
          name: 'Site Visit Confirmation',
          triggerType: 'STATUS_CHANGE',
          triggerValue: 'SITE_VISIT',
          isActive: true,
          actions: JSON.stringify([
              { icon: 'Mail', text: "Send Location & Details" },
              { icon: 'Clock', text: "Wait 1 Hour Before" },
              { icon: 'MessageSquare', text: "Send SMS Reminder" }
          ])
      }
  });

  await prisma.automation.create({
      data: {
          name: 'Cold Lead Re-engagement',
          triggerType: 'NO_ACTIVITY',
          triggerValue: '30_DAYS',
          isActive: false,
          actions: JSON.stringify([
              { icon: 'Mail', text: "Send 'Still Looking?' Email" },
              { icon: 'Clock', text: "Wait 3 Days" },
              { icon: 'Play', text: "Move to 'ARCHIVED' if no reply" }
          ])
      }
  });
  console.log('Created Automations');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
