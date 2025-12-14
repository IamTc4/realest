import React, { useEffect, useState } from 'react';
import AgentLayout from '../../../components/layout/AgentLayout';
import { Search, Filter, ChevronRight } from 'lucide-react';
import Link from 'next/link';

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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intent</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                          <th className="relative px-6 py-3"><span className="sr-only">View</span></th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                      {leads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs mr-3">
                                          {lead.name.charAt(0)}
                                      </div>
                                      <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                                  </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                    ${lead.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                                      lead.status === 'CLOSED_WON' ? 'bg-green-100 text-green-800' :
                                      'bg-gray-100 text-gray-800'}`}>
                                      {lead.status}
                                  </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.intent}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {lead.budgetMin ? `$${(lead.budgetMin/1000)}k - $${(lead.budgetMax/1000)}k` : '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">{lead.score}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Link href={`/agent/leads/${lead.id}`} className="text-emerald-600 hover:text-emerald-900">
                                      <ChevronRight className="w-5 h-5" />
                                  </Link>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          )}
      </div>
    </AgentLayout>
  );
}
