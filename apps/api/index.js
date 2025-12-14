const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { startOfMonth, subMonths, format, startOfWeek, endOfWeek } = require('date-fns');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Middleware
app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Routes ---

// Auth
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/otp-login', async (req, res) => {
    const { phone } = req.body;
    try {
        let user = await prisma.user.findFirst({ where: { phone } });
        // Mock finding a client user or using the seeded one
        if (!user) user = await prisma.user.findUnique({ where: { email: 'client@example.com' }});
        if (!user) return res.status(400).json({ error: 'User not found' });

        const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, name: true, email: true, role: true, stats: true }
    });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Leads
app.get('/api/leads', authenticateToken, async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'AGENT') {
        where.agentId = req.user.id;
    }
    const leads = await prisma.lead.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        include: { agent: { select: { name: true } } }
    });
    res.json(leads);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/leads/:id', authenticateToken, async (req, res) => {
  try {
    const lead = await prisma.lead.findUnique({
        where: { id: req.params.id },
        include: {
            interactions: { orderBy: { createdAt: 'desc' } },
            tasks: { orderBy: { dueDate: 'asc' } },
            agent: { select: { name: true, id: true } }
        }
    });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/leads', authenticateToken, async (req, res) => {
    try {
        let score = 0;
        if (req.body.budgetMin > 1000000) score += 20;
        if (req.body.intent === 'BUYER') score += 30;
        if (req.body.intent === 'INVESTOR') score += 20;
        if (req.body.timeline === 'Immediate') score += 20;

        const leadData = { ...req.body, score, status: 'NEW' };

        // Auto-assignment Logic (Round Robin or Load Balancer Mock)
        // Find agent with fewest active leads
        const agents = await prisma.user.findMany({
            where: { role: 'AGENT' },
            include: { _count: { select: { leads: true } } }
        });

        if (agents.length > 0) {
            // Sort by lead count ascending
            agents.sort((a, b) => a._count.leads - b._count.leads);
            leadData.agentId = agents[0].id;
        }

        const lead = await prisma.lead.create({
            data: leadData
        });
        res.json(lead);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put('/api/leads/:id', authenticateToken, async (req, res) => {
    try {
        const { status, notes } = req.body;
        const updateData = {};
        if (status) updateData.status = status;
        // If other fields allowed

        const lead = await prisma.lead.update({
            where: { id: req.params.id },
            data: updateData
        });

        // Log interaction if notes provided during update
        if (notes) {
            await prisma.interaction.create({
                data: {
                    leadId: req.params.id,
                    type: 'NOTE',
                    notes: notes,
                    date: new Date()
                }
            });
        }

        res.json(lead);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/leads/:id/interaction', authenticateToken, async (req, res) => {
    try {
        const { type, notes } = req.body;
        const interaction = await prisma.interaction.create({
            data: {
                leadId: req.params.id,
                type: type || 'NOTE',
                notes: notes,
                date: new Date()
            }
        });
        res.json(interaction);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Properties
app.get('/api/properties', async (req, res) => {
    try {
        const { type, minPrice, maxPrice, location, bedrooms } = req.query;
        const where = {}; // Show all for demo list usually, but let's allow filtering

        if (type) where.type = type;
        if (location) where.location = { contains: location };
        if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms) };
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice);
            if (maxPrice) where.price.lte = parseFloat(maxPrice);
        }

        const properties = await prisma.property.findMany({ where });
        res.json(properties);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/properties/:id', async (req, res) => {
    try {
        const property = await prisma.property.findUnique({ where: { id: req.params.id }});
        res.json(property);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Phase 2: Automations Endpoint
app.get('/api/automations', authenticateToken, async (req, res) => {
    try {
        const rules = await prisma.automationRule.findMany();
        res.json(rules);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Phase 3: SaaS Organization Endpoint
app.get('/api/organization', authenticateToken, async (req, res) => {
    try {
        const org = await prisma.organization.findFirst();
        res.json(org);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- Enterprise Analytics Endpoints ---

app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        // Basic Counts
        const totalLeads = await prisma.lead.count();
        const newLeads = await prisma.lead.count({ where: { createdAt: { gte: startOfDay(new Date()) } } }); // Leads today
        const totalProperties = await prisma.property.count();
        const activeProperties = await prisma.property.count({ where: { status: 'AVAILABLE' } });
        const soldProperties = await prisma.property.count({ where: { status: 'SOLD' } });

        // Lead Sources (Pie Chart)
        const leadSourcesRaw = await prisma.lead.groupBy({
            by: ['source'],
            _count: { source: true }
        });
        const leadSources = leadSourcesRaw.map(s => ({ name: s.source, value: s._count.source }));

        // Conversion Funnel
        const funnelRaw = await prisma.lead.groupBy({
            by: ['status'],
            _count: { status: true }
        });
        // Normalize for funnel
        const funnelOrder = ['NEW', 'CONTACTED', 'SITE_VISIT', 'NEGOTIATION', 'CLOSED_WON'];
        const funnelMap = {};
        funnelRaw.forEach(f => funnelMap[f.status] = f._count.status);
        const conversionFunnel = funnelOrder.map(status => ({ name: status, value: funnelMap[status] || 0 }));

        // Monthly Revenue Trend (Last 6 Months)
        // Since we didn't seed strict transaction dates for revenue, we will mock this based on 'CLOSED_WON' leads creation date for demo
        const revenueTrend = [];
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(new Date(), i);
            const monthStart = startOfMonth(date);
            const nextMonthStart = startOfMonth(subMonths(new Date(), i - 1));

            // Count closed leads in this month
            const closedCount = await prisma.lead.count({
                where: {
                    status: 'CLOSED_WON',
                    createdAt: { gte: monthStart, lt: nextMonthStart }
                }
            });

            revenueTrend.push({
                name: format(date, 'MMM'),
                revenue: closedCount * 15000 + Math.floor(Math.random() * 50000) // Mock revenue per deal
            });
        }

        // Total Revenue (Sum of trend)
        const totalRevenue = revenueTrend.reduce((acc, curr) => acc + curr.revenue, 0);

        // --- New "Alive" Metrics ---

        // Growth: Leads This Month vs Last Month
        const startCurrentMonth = startOfMonth(new Date());
        const startLastMonth = startOfMonth(subMonths(new Date(), 1));

        const leadsThisMonth = await prisma.lead.count({ where: { createdAt: { gte: startCurrentMonth } } });
        const leadsLastMonth = await prisma.lead.count({ where: { createdAt: { gte: startLastMonth, lt: startCurrentMonth } } });
        const leadsGrowth = leadsLastMonth === 0 ? 100 : ((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100;

        // Growth: Revenue (Approximated from trend)
        const revThisMonth = revenueTrend[5].revenue;
        const revLastMonth = revenueTrend[4].revenue;
        const revenueGrowth = revLastMonth === 0 ? 100 : ((revThisMonth - revLastMonth) / revLastMonth) * 100;

        // Sales Velocity (Avg Days to Close) - Mocked/Approximated
        // Real logic: Avg(closedAt - createdAt) for CLOSED_WON leads
        // Mock:
        const salesVelocity = 24; // Days

        // Property Stats (Mocked/Derived)
        const properties = await prisma.property.findMany({ take: 5, orderBy: { price: 'desc' } }); // Top properties
        const propertyStats = properties.map(p => ({
            id: p.id,
            title: p.title,
            price: p.price,
            views: Math.floor(Math.random() * 500) + 50,
            enquiries: Math.floor(Math.random() * 50) + 5,
            daysOnMarket: Math.floor(Math.random() * 60) + 1,
            conversion: Math.floor(Math.random() * 10) + 1
        }));

        // Top Agents
        const topAgents = await prisma.user.findMany({
            where: { role: 'AGENT' },
            include: { stats: true },
            take: 5
        });
        // Sort by revenue/deals manually if needed, or rely on stats
        const sortedAgents = topAgents.sort((a, b) => (b.stats?.totalRevenue || 0) - (a.stats?.totalRevenue || 0));

        res.json({
            kpi: {
                totalProperties,
                activeProperties,
                soldProperties,
                totalLeads,
                newLeadsToday: newLeads,
                totalRevenue,
                leadsGrowth: leadsGrowth.toFixed(1),
                revenueGrowth: revenueGrowth.toFixed(1),
                salesVelocity
            },
            leadSources,
            conversionFunnel,
            revenueTrend,
            topAgents: sortedAgents,
            propertyStats // Added
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

function startOfDay(date) {
    const newDate = new Date(date);
    newDate.setHours(0,0,0,0);
    return newDate;
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
