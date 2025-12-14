import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { DollarSign, Users, Building, TrendingUp, AlertTriangle, UserCheck } from 'lucide-react';

const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        setData(data);
        setLoading(false);
    })
    .catch(console.error);
  }, []);

  if (loading) return <AdminLayout><div className="flex h-screen items-center justify-center text-slate-500">Loading Enterprise Dashboard...</div></AdminLayout>;

  return (
    <AdminLayout>
       {/* Top KPI Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard title="Total Revenue" value={`$${(data.kpi.totalRevenue / 1000000).toFixed(2)}M`} change={data.kpi.revenueGrowth > 0 ? `+${data.kpi.revenueGrowth}%` : `${data.kpi.revenueGrowth}%`} icon={DollarSign} color="text-emerald-600" bg="bg-emerald-50" />
          <KpiCard title="Total Leads" value={data.kpi.totalLeads} change={data.kpi.leadsGrowth > 0 ? `+${data.kpi.leadsGrowth}%` : `${data.kpi.leadsGrowth}%`} icon={Users} color="text-blue-600" bg="bg-blue-50" />
          <KpiCard title="Sales Velocity" value={`${data.kpi.salesVelocity} Days`} sub="Avg time to close" icon={TrendingUp} color="text-indigo-600" bg="bg-indigo-50" />
          <KpiCard title="Conversion Rate" value={`${((data.conversionFunnel.find(f=>f.name==='CLOSED_WON')?.value / data.kpi.totalLeads) * 100).toFixed(1)}%`} change="+2.1%" icon={UserCheck} color="text-amber-600" bg="bg-amber-50" />
       </div>

       {/* Main Charts Section */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
           {/* Revenue Trend */}
           <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h3 className="text-lg font-bold text-slate-800 mb-4 font-serif">Revenue Performance</h3>
               <div className="h-80">
                   <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={data.revenueTrend}>
                           <defs>
                               <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#059669" stopOpacity={0.1}/>
                                   <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                               </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                           <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(val) => `$${val/1000}k`} />
                           <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} itemStyle={{color: '#fff'}} />
                           <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                       </AreaChart>
                   </ResponsiveContainer>
               </div>
           </div>

           {/* Lead Sources */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h3 className="text-lg font-bold text-slate-800 mb-4 font-serif">Lead Sources</h3>
               <div className="h-60">
                   <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                           <Pie
                               data={data.leadSources}
                               cx="50%"
                               cy="50%"
                               innerRadius={60}
                               outerRadius={80}
                               paddingAngle={5}
                               dataKey="value"
                           >
                               {data.leadSources.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                               ))}
                           </Pie>
                           <Tooltip />
                           <Legend verticalAlign="bottom" height={36}/>
                       </PieChart>
                   </ResponsiveContainer>
               </div>
               <div className="mt-4 text-center">
                   <p className="text-sm text-slate-500">Most leads come from <span className="font-bold text-emerald-600">Digital Campaigns</span></p>
               </div>
           </div>
       </div>

       {/* Secondary Section */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
           {/* Conversion Funnel */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h3 className="text-lg font-bold text-slate-800 mb-4 font-serif">Sales Funnel</h3>
               <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.conversionFunnel} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10}} />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#64748b', fontSize: 12 }}>
                                {data.conversionFunnel.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
               </div>
               <div className="flex justify-between text-xs text-slate-500 mt-2 px-4">
                   <span>Leads</span>
                   <span className="text-red-400 font-bold">42% Drop-off</span>
                   <span>Deals</span>
               </div>
           </div>

           {/* Alerts & Notifications */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800 font-serif">System Alerts</h3>
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full uppercase">3 Action Required</span>
               </div>
               <div className="space-y-4">
                   <AlertItem type="critical" message="5 Premium Leads unassigned for > 2 hours" time="10 mins ago" />
                   <AlertItem type="warning" message="Inventory low in 'Downtown' sector" time="2 hours ago" />
                   <AlertItem type="info" message="Weekly Agent Performance Report generated" time="5 hours ago" />
                   <AlertItem type="warning" message="Agent Sarah has 3 overdue follow-ups" time="1 day ago" />
               </div>
           </div>
       </div>

       {/* Top Agents Table */}
       <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-100">
                   <h3 className="text-lg font-bold text-slate-800 font-serif">Top Performing Agents</h3>
               </div>
               <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Agent</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Rev</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Deals</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Eff</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {data.topAgents.map((agent, i) => (
                            <tr key={agent.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                                                {agent.name.charAt(0)}
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-slate-900">{agent.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm font-bold text-emerald-600">${(agent.stats?.totalRevenue / 1000).toFixed(0)}k</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm text-slate-900">{agent.stats?.closedDeals || 0}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                                        {(agent.stats?.rating || 4.5).toFixed(1)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
               </div>
           </div>

           {/* Property Performance Table */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-100">
                   <h3 className="text-lg font-bold text-slate-800 font-serif">Property Engagement</h3>
               </div>
               <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Property</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Views</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Leads</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {data.propertyStats && data.propertyStats.map((prop, i) => (
                            <tr key={prop.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm font-medium text-slate-900 truncate max-w-[150px]">{prop.title}</div>
                                    <div className="text-xs text-slate-500">${(prop.price / 1000).toFixed(0)}k</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm text-slate-900">{prop.views}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm font-bold text-blue-600">{prop.enquiries}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-xs text-slate-500">{prop.daysOnMarket}d</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
               </div>
           </div>
       </div>
    </AdminLayout>
  );
}

const KpiCard = ({ title, value, change, sub, icon: Icon, color, bg }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${bg}`}>
                <Icon className={`h-6 w-6 ${color}`} />
            </div>
        </div>
        <div>
            {change && <span className={`text-sm font-bold ${change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>{change}</span>}
            {sub && <span className="text-xs text-slate-400 ml-2">{sub}</span>}
            <span className="text-xs text-slate-400 ml-1">vs last month</span>
        </div>
    </div>
);

const AlertItem = ({ type, message, time }) => {
    let icon, color, bg;
    switch(type) {
        case 'critical': icon = AlertTriangle; color = 'text-red-600'; bg = 'bg-red-50'; break;
        case 'warning': icon = AlertTriangle; color = 'text-amber-600'; bg = 'bg-amber-50'; break;
        default: icon = UserCheck; color = 'text-blue-600'; bg = 'bg-blue-50'; break;
    }
    const Icon = icon;
    return (
        <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
            <div className={`p-2 rounded-full ${bg} flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{message}</p>
                <p className="text-xs text-slate-400 mt-1">{time}</p>
            </div>
        </div>
    )
}
