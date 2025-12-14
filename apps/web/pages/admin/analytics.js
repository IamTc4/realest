import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter, ZAxis } from 'recharts';
import { ArrowUpRight, TrendingUp, Users, Activity } from 'lucide-react';

const roiData = [
  { source: 'Google Ads', spend: 5000, revenue: 25000, roi: 5 },
  { source: 'Facebook', spend: 3000, revenue: 12000, roi: 4 },
  { source: 'Email', spend: 1000, revenue: 8000, roi: 8 },
  { source: 'Referral', spend: 0, revenue: 15000, roi: 15 }, // Infinite strictly but capped visual
];

const velocityData = [
  { month: 'Jan', days: 45 },
  { month: 'Feb', days: 42 },
  { month: 'Mar', days: 38 },
  { month: 'Apr', days: 35 },
  { month: 'May', days: 30 },
  { month: 'Jun', days: 28 },
];

const agentEfficiency = [
  { name: 'Agent A', leads: 50, conversions: 10, score: 90 },
  { name: 'Agent B', leads: 60, conversions: 5, score: 60 },
  { name: 'Agent C', leads: 40, conversions: 8, score: 85 },
  { name: 'Agent D', leads: 30, conversions: 2, score: 40 },
  { name: 'Agent E', leads: 70, conversions: 12, score: 88 },
];

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Advanced Analytics</h1>
          <p className="text-slate-500">Deep dive into performance metrics and ROI.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AnalyticCard title="Avg Sales Velocity" value="28 Days" trend="-12%" trendUp={true} />
          <AnalyticCard title="Marketing ROI" value="5.2x" trend="+0.8x" trendUp={true} />
          <AnalyticCard title="Lead Quality Score" value="7.8/10" trend="+0.5" trendUp={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* ROI Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 font-serif">Marketing ROI by Source</h3>
              <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={roiData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="source" />
                          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                          <Tooltip />
                          <Bar yAxisId="left" dataKey="spend" fill="#94a3b8" name="Spend ($)" />
                          <Bar yAxisId="right" dataKey="revenue" fill="#059669" name="Revenue ($)" />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Sales Velocity */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 font-serif">Sales Velocity Trend (Avg Days to Close)</h3>
              <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={velocityData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="days" stroke="#3b82f6" strokeWidth={3} dot={{r: 6}} />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
              <p className="text-center text-sm text-slate-500 mt-2">Closing deals <span className="text-emerald-600 font-bold">17 days faster</span> than Jan.</p>
          </div>
      </div>

      {/* Agent Efficiency Scatter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4 font-serif">Agent Efficiency Matrix</h3>
          <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid />
                      <XAxis type="number" dataKey="leads" name="Leads Handled" unit="" />
                      <YAxis type="number" dataKey="conversions" name="Conversions" unit="" />
                      <ZAxis type="number" dataKey="score" range={[100, 500]} name="Efficiency Score" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Agents" data={agentEfficiency} fill="#8b5cf6" />
                  </ScatterChart>
              </ResponsiveContainer>
          </div>
          <p className="text-sm text-slate-500 mt-2 text-center">X: Leads Handled, Y: Conversions, Size: Efficiency Score</p>
      </div>
    </AdminLayout>
  );
}

const AnalyticCard = ({ title, value, trend, trendUp }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
        </div>
        <div className={`text-right ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
            <span className="text-lg font-bold flex items-center justify-end">
                {trendUp ? <ArrowUpRight className="w-5 h-5 mr-1" /> : <TrendingUp className="w-5 h-5 mr-1 rotate-180" />}
                {trend}
            </span>
            <p className="text-xs text-slate-400">vs last period</p>
        </div>
    </div>
);
