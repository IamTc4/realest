const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
        // Basic Logic for Scoring
        let score = 0;
        if (req.body.budgetMin > 1000000) score += 20;
        if (req.body.intent === 'BUYER') score += 30;
        if (req.body.intent === 'INVESTOR') score += 20;
        if (req.body.timeline === 'Immediate') score += 20;

        const lead = await prisma.lead.create({
            data: {
                ...req.body,
                score,
                status: 'NEW'
            }
        });

        // Auto-assign logic (Simple Round Robin or Load based - simplified here to Load based)
        // Find agent with least leads
        if (!lead.agentId) {
             const agents = await prisma.user.findMany({
                 where: { role: 'AGENT', status: 'ACTIVE' },
                 include: { _count: { select: { leads: true } } }
             });
             if (agents.length > 0) {
                 const bestAgent = agents.sort((a, b) => a._count.leads - b._count.leads)[0];
                 await prisma.lead.update({
                     where: { id: lead.id },
                     data: { agentId: bestAgent.id }
                 });
                 // Log interaction
                 await prisma.interaction.create({
                     data: {
                         leadId: lead.id,
                         type: 'SYSTEM',
                         content: `Auto-assigned to ${bestAgent.name} based on workload.`
                     }
                 });
             }
        }

        res.json(lead);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put('/api/leads/:id', authenticateToken, async (req, res) => {
    try {
        const lead = await prisma.lead.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(lead);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/leads/:id/interaction', authenticateToken, async (req, res) => {
    try {
        const interaction = await prisma.interaction.create({
            data: {
                leadId: req.params.id,
                ...req.body
            }
        });

        // Update lead status if needed based on interaction type
        if (req.body.type === 'SITE_VISIT') {
            await prisma.lead.update({ where: { id: req.params.id }, data: { status: 'SITE_VISIT' }});
        }

        res.json(interaction);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Properties
app.get('/api/properties', async (req, res) => {
    try {
        const properties = await prisma.property.findMany();
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

// Dashboard Analytics
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        const totalLeads = await prisma.lead.count();
        const newLeads = await prisma.lead.count({ where: { status: 'NEW' } });
        const closedWon = await prisma.lead.count({ where: { status: 'CLOSED_WON' } });

        // Revenue (Mock calculation based on closed leads * avg deal size, or sum of closed deals)
        // In a real app we'd have a Deal/Transaction table. I'll sum user stats revenue.
        const revenueAgg = await prisma.agentStat.aggregate({
            _sum: { totalRevenue: true }
        });

        const leadStatusDistribution = await prisma.lead.groupBy({
            by: ['status'],
            _count: { status: true }
        });

        const topAgents = await prisma.agentStat.findMany({
            orderBy: { totalRevenue: 'desc' },
            take: 5,
            include: { user: { select: { name: true, email: true } } }
        });

        res.json({
            totalLeads,
            newLeads,
            closedWon,
            totalRevenue: revenueAgg._sum.totalRevenue || 0,
            leadStatusDistribution,
            topAgents
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Automations
app.get('/api/automations', authenticateToken, async (req, res) => {
    try {
        const automations = await prisma.automation.findMany();
        res.json(automations);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
