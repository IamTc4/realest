import React, { useEffect, useState } from 'react';
import AgentLayout from '../../components/layout/AgentLayout';
import { DollarSign, Users, Briefcase, TrendingUp, Bell, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AgentDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setUser(data))
    .catch(console.error);
  }, []);

  if (!user) return <AgentLayout><div className="flex h-screen items-center justify-center">Loading...</div></AgentLayout>;

  // Mock Data for Agent Visuals (since API gives aggregates mainly)
  const performanceData = [
      { day: 'Mon', leads: 2, calls: 15 },
      { day: 'Tue', leads: 4, calls: 20 },
      { day: 'Wed', leads: 3, calls: 12 },
      { day: 'Thu', leads: 6, calls: 25 },
      { day: 'Fri', leads: 5, calls: 18 },
      { day: 'Sat', leads: 2, calls: 8 },
      { day: 'Sun', leads: 1, calls: 5 },
  ];

  const pipelineData = [
      { stage: 'New', count: 12 },
      { stage: 'Contacted', count: 8 },
      { stage: 'Visit', count: 5 },
      { stage: 'Negotiation', count: 2 },
      { stage: 'Closed', count: user.stats?.closedDeals || 0 },
  ];

  return (
    <AgentLayout>
      <div className="flex justify-between items-center mb-8">
          <div>
              <h1 className="text-2xl font-bold text-slate-900 font-serif">Welcome back, {user.name.split(' ')[0]}</h1>
              <p className="text-slate-500">Here's your daily performance snapshot.</p>
          </div>
          <div className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-emerald-200">
              Target: 85% Achieved
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard label="Assigned Leads" value={user.stats?.totalLeads || 0} icon={Users} color="text-blue-600" bg="bg-blue-50" />
          <StatCard label="Closed Deals" value={user.stats?.closedDeals || 0} icon={Briefcase} color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard label="Revenue Generated" value={`$${((user.stats?.totalRevenue || 0)/1000).toFixed(0)}k`} icon={DollarSign} color="text-purple-600" bg="bg-purple-50" />
          <StatCard label="Client Rating" value={user.stats?.rating || 0} icon={TrendingUp} color="text-orange-600" bg="bg-orange-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Performance Trend */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 font-serif">Weekly Activity</h3>
              <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData}>
                          <defs>
                               <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                   <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                               </linearGradient>
                           </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip />
                          <Area type="monotone" dataKey="calls" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCalls)" strokeWidth={3} />
                          <Area type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={3} fill="none" />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Pipeline Funnel */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 font-serif">My Pipeline</h3>
              <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pipelineData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                          <XAxis type="number" hide />
                          <YAxis dataKey="stage" type="category" width={80} tick={{fontSize: 12}} />
                          <Tooltip cursor={{fill: 'transparent'}} />
                          <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                              {pipelineData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notifications */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 font-serif flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-amber-500" /> Recent Alerts
              </h3>
              <div className="space-y-4">
                  <div className="flex items-start p-3 bg-red-50 rounded-lg">
                      <div className="w-2 h-2 mt-2 rounded-full bg-red-500 mr-3"></div>
                      <div>
                          <p className="text-sm font-bold text-slate-900">Missed Follow-up: Lead #1024</p>
                          <p className="text-xs text-slate-500">Scheduled for yesterday at 2:00 PM</p>
                      </div>
                  </div>
                  <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                      <div>
                          <p className="text-sm font-bold text-slate-900">New Lead Assigned: John Doe</p>
                          <p className="text-xs text-slate-500">Source: Website • Budget: $1.2M</p>
                      </div>
                  </div>
                  <div className="flex items-start p-3 bg-emerald-50 rounded-lg">
                      <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 mr-3"></div>
                      <div>
                          <p className="text-sm font-bold text-slate-900">Deal Closed! Commission updated.</p>
                          <p className="text-xs text-slate-500">Property: Luxury Villa in Beverly Hills</p>
                      </div>
                  </div>
              </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h3 className="text-lg font-bold text-slate-800 mb-4 font-serif flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-indigo-500" /> Today's Schedule
              </h3>
              <ul className="space-y-4">
                  {[
                      { title: 'Call Alice Wonder', time: '10:00 AM', type: 'CALL' },
                      { title: 'Site Visit with Bob', time: '2:00 PM', type: 'VISIT' },
                      { title: 'Follow up Charlie', time: '4:30 PM', type: 'EMAIL' }
                  ].map((task, i) => (
                      <li key={i} className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0">
                          <div className="flex items-center">
                              <span className="text-xs font-bold text-slate-400 w-16">{task.time}</span>
                              <span className="text-sm font-medium text-slate-800">{task.title}</span>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-1 rounded">{task.type}</span>
                      </li>
                  ))}
              </ul>
          </div>
      </div>
    </AgentLayout>
  );
}

const StatCard = ({ label, value, icon: Icon, color, bg }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
        <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center mr-4`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
    </div>
);
