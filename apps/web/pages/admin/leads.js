import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Search, Filter, ChevronRight, User } from 'lucide-react';
import Link from 'next/link';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Admin should see ALL leads. The API logic for 'AGENT' role filters by agentId.
    // Ideally, ADMIN role should see all. Let's verify API endpoint behavior.
    // In apps/api/index.js:
    // if (req.user.role === 'AGENT') { where.agentId = req.user.id; }
    // So ADMIN gets all. Correct.
    fetch('http://localhost:3001/api/leads', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        setLeads(data);
        setLoading(false);
    })
    .catch(console.error);
  }, []);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Leads (Master View)</h1>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
              Export CSV
          </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
              <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search across all leads..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-emerald-500 bg-white" />
              </div>
              <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-white bg-white shadow-sm transition-all">
                  <Filter className="w-4 h-4 mr-2" /> Filter
              </button>
          </div>

          {/* List */}
          {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
              <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                      <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lead Name</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Agent</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Intent</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Score</th>
                          <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                      {leads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors group">
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs mr-3 group-hover:bg-white group-hover:shadow-sm transition-all">
                                          {lead.name.charAt(0)}
                                      </div>
                                      <div className="text-sm font-semibold text-gray-900">{lead.name}</div>
                                  </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                  {lead.agent ? (
                                      <div className="flex items-center text-sm text-gray-600">
                                          <User className="w-3 h-3 mr-1 text-gray-400" /> {lead.agent.name}
                                      </div>
                                  ) : (
                                      <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded">Unassigned</span>
                                  )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wider
                                    ${lead.status === 'NEW' ? 'bg-blue-50 text-blue-700' :
                                      lead.status === 'CLOSED_WON' ? 'bg-emerald-50 text-emerald-700' :
                                      'bg-gray-100 text-gray-600'}`}>
                                      {lead.status}
                                  </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.intent}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                      <div className="flex-1 h-1.5 w-16 bg-gray-100 rounded-full mr-2 overflow-hidden">
                                          <div className={`h-full rounded-full ${lead.score > 70 ? 'bg-emerald-500' : lead.score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${lead.score}%` }}></div>
                                      </div>
                                      <span className="text-xs font-bold text-gray-700">{lead.score}</span>
                                  </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button className="text-emerald-600 hover:text-emerald-900 font-semibold text-xs uppercase tracking-wide border border-emerald-200 px-3 py-1 rounded hover:bg-emerald-50 transition-colors">
                                      Manage
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          )}
      </div>
    </AdminLayout>
  );
}
