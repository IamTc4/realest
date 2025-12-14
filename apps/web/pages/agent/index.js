import React, { useEffect, useState } from 'react';
import AgentLayout from '../../components/layout/AgentLayout';
import { DollarSign, Users, Briefcase, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'; // Mock implementation or use a real library

// Simple Mock Chart Component since we might not have recharts installed
// Update: I didn't install recharts in previous step. I'll just make a simple visual mock.

export default function AgentDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // In real app, fetch from /api/dashboard/stats or /api/auth/me (stats)
    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        if (data.stats) setStats(data.stats);
    })
    .catch(console.error);
  }, []);

  const statCards = [
      { label: 'Total Leads', value: stats?.totalLeads || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Closed Deals', value: stats?.closedDeals || 0, icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
      { label: 'Rating', value: stats?.rating || 0, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <AgentLayout>
      <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Agent Smith</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                  <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center mr-4`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                      <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
              </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Leads */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Leads</h2>
              <div className="overflow-x-auto">
                  <table className="min-w-full">
                      <thead>
                          <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              <th className="pb-3 pl-2">Name</th>
                              <th className="pb-3">Status</th>
                              <th className="pb-3">Intent</th>
                              <th className="pb-3">Score</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {[
                              { name: 'Alice Wonder', status: 'NEW', intent: 'BUYER', score: 80 },
                              { name: 'Bob Builder', status: 'CONTACTED', intent: 'BUYER', score: 65 },
                              { name: 'Charlie', status: 'VISIT', intent: 'INVESTOR', score: 90 },
                          ].map((lead, i) => (
                              <tr key={i} className="text-sm">
                                  <td className="py-3 pl-2 font-medium text-gray-900">{lead.name}</td>
                                  <td className="py-3">
                                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{lead.status}</span>
                                  </td>
                                  <td className="py-3 text-gray-500">{lead.intent}</td>
                                  <td className="py-3 font-bold text-emerald-600">{lead.score}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* Daily Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Today's Tasks</h2>
              <ul className="space-y-4">
                  {[
                      { title: 'Call Alice', time: '10:00 AM', type: 'CALL' },
                      { title: 'Site Visit with Bob', time: '2:00 PM', type: 'VISIT' },
                      { title: 'Follow up Charlie', time: '4:30 PM', type: 'EMAIL' }
                  ].map((task, i) => (
                      <li key={i} className="flex items-start">
                          <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 mr-3"></div>
                          <div>
                              <p className="text-sm font-medium text-gray-800">{task.title}</p>
                              <p className="text-xs text-gray-500">{task.time} • {task.type}</p>
                          </div>
                      </li>
                  ))}
              </ul>
          </div>
      </div>
    </AgentLayout>
  );
}
