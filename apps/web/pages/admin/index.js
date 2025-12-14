import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { DollarSign, Users, TrendingUp, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
      totalLeads: 0,
      newLeads: 0,
      closedWon: 0,
      totalRevenue: 0,
      leadStatusDistribution: [],
      topAgents: []
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setStats(data))
    .catch(console.error);
  }, []);

  return (
    <AdminLayout>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                  <div className="p-2 bg-emerald-50 rounded-lg"><DollarSign className="w-5 h-5 text-emerald-600" /></div>
              </div>
              <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-emerald-600 mt-2 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +12% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm font-medium">Total Leads</h3>
                  <div className="p-2 bg-blue-50 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalLeads}</p>
              <p className="text-sm text-blue-600 mt-2 font-medium">{stats.newLeads} New today</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm font-medium">Conversion Rate</h3>
                  <div className="p-2 bg-purple-50 rounded-lg"><Activity className="w-5 h-5 text-purple-600" /></div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalLeads > 0 ? ((stats.closedWon / stats.totalLeads) * 100).toFixed(1) : 0}%</p>
              <p className="text-sm text-gray-400 mt-2">Target: 15%</p>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Lead Distribution Mock Chart */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-lg font-bold text-gray-900 mb-6">Lead Pipeline</h2>
               <div className="space-y-4">
                   {stats.leadStatusDistribution.map((item) => (
                       <div key={item.status}>
                           <div className="flex justify-between text-sm mb-1">
                               <span className="font-medium text-gray-700">{item.status}</span>
                               <span className="text-gray-500">{item._count.status}</span>
                           </div>
                           <div className="w-full bg-gray-100 rounded-full h-2">
                               <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(item._count.status / stats.totalLeads) * 100}%` }}></div>
                           </div>
                       </div>
                   ))}
               </div>
           </div>

           {/* Top Agents */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-lg font-bold text-gray-900 mb-6">Top Performing Agents</h2>
               <div className="space-y-6">
                   {stats.topAgents.map((stat, i) => (
                       <div key={i} className="flex items-center justify-between">
                           <div className="flex items-center">
                               <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 mr-3">
                                   {stat.user.name.charAt(0)}
                               </div>
                               <div>
                                   <p className="font-medium text-gray-900">{stat.user.name}</p>
                                   <p className="text-xs text-gray-500">{stat.totalLeads} Active Leads</p>
                               </div>
                           </div>
                           <div className="text-right">
                               <p className="font-bold text-emerald-600">${stat.totalRevenue.toLocaleString()}</p>
                               <p className="text-xs text-gray-400">Revenue</p>
                           </div>
                       </div>
                   ))}
               </div>
           </div>
       </div>
    </AdminLayout>
  );
}
