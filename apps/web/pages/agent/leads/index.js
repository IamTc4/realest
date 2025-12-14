import React, { useEffect, useState } from 'react';
import AgentLayout from '../../../components/layout/AgentLayout';
import { Search, Filter, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
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
    <AgentLayout>
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
              Add New Lead
          </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex gap-4">
              <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search leads..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-emerald-500" />
              </div>
              <button className="flex items-center px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
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
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lead Profile</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status & Score</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lifecycle</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Next Action</th>
                          <th className="relative px-6 py-3"><span className="sr-only">View</span></th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                      {leads.map((lead) => {
                          // Mock "Time since last contact" and "Next Action" based on data
                          const isStale = Math.random() > 0.7;
                          const nextAction = lead.status === 'NEW' ? 'First Call' : lead.status === 'CONTACTED' ? 'Schedule Visit' : 'Follow Up';

                          return (
                          <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-serif font-bold text-sm mr-4 border border-slate-200">
                                          {lead.name.charAt(0)}
                                      </div>
                                      <div>
                                          <div className="text-sm font-bold text-slate-900">{lead.name}</div>
                                          <div className="text-xs text-slate-500">{lead.intent} • {lead.budgetMin ? `$${(lead.budgetMin/1000)}k+` : 'N/A'}</div>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex flex-col items-start space-y-1">
                                      <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-bold rounded border ${
                                          lead.status === 'NEW' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                          lead.status === 'CLOSED_WON' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                          'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                          {lead.status}
                                      </span>
                                      <div className="flex items-center text-xs">
                                        <span className={`font-bold mr-1 ${lead.score > 70 ? 'text-emerald-600' : 'text-amber-600'}`}>{lead.score}%</span>
                                        <span className="text-slate-400">Match Probability</span>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-xs text-slate-600 space-y-1">
                                      <div className="flex items-center">
                                          <Clock className="w-3 h-3 mr-1 text-slate-400" />
                                          Created {formatDistanceToNow(new Date(lead.createdAt))} ago
                                      </div>
                                      <div className="text-slate-500">
                                          Last active: 2h ago
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                      {isStale && <AlertCircle className="w-4 h-4 text-red-500 mr-2" />}
                                      <span className={`text-sm font-medium ${isStale ? 'text-red-600' : 'text-slate-700'}`}>
                                          {isStale ? 'Overdue: ' : 'Due Today: '} {nextAction}
                                      </span>
                                  </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Link href={`/agent/leads/${lead.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-400 hover:text-emerald-600 transition-colors">
                                      <ChevronRight className="w-5 h-5" />
                                  </Link>
                              </td>
                          </tr>
                      )})}
                  </tbody>
              </table>
          )}
      </div>
    </AgentLayout>
  );
}
