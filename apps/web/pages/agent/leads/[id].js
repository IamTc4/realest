import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AgentLayout from '../../../components/layout/AgentLayout';
import { Phone, Mail, Calendar, MessageSquare, Clock } from 'lucide-react';

export default function LeadDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [lead, setLead] = useState(null);

  useEffect(() => {
    if (id) {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3001/api/leads/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setLead(data))
        .catch(console.error);
    }
  }, [id]);

  if (!lead) return <AgentLayout><div className="p-8">Loading...</div></AgentLayout>;

  return (
    <AgentLayout>
      <div className="flex flex-col md:flex-row gap-6">
          {/* Main Info */}
          <div className="flex-1 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center">
                          <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-2xl mr-4">
                              {lead.name.charAt(0)}
                          </div>
                          <div>
                              <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
                              <p className="text-gray-500">Added on {new Date(lead.createdAt).toLocaleDateString()}</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold">
                              {lead.status}
                          </span>
                          <p className="mt-2 font-bold text-lg text-gray-700">Score: {lead.score}</p>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-gray-700 p-3 bg-gray-50 rounded-lg">
                          <Phone className="w-5 h-5 mr-3 text-emerald-600" /> {lead.phone}
                      </div>
                      <div className="flex items-center text-gray-700 p-3 bg-gray-50 rounded-lg">
                          <Mail className="w-5 h-5 mr-3 text-emerald-600" /> {lead.email}
                      </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                      <h3 className="font-bold text-gray-900 mb-4">Requirements</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                              <p className="text-xs text-gray-500 uppercase">Budget</p>
                              <p className="font-medium text-gray-900">${(lead.budgetMin/1000)}k - ${(lead.budgetMax/1000)}k</p>
                          </div>
                          <div>
                              <p className="text-xs text-gray-500 uppercase">Location</p>
                              <p className="font-medium text-gray-900">{lead.location}</p>
                          </div>
                          <div>
                              <p className="text-xs text-gray-500 uppercase">Type</p>
                              <p className="font-medium text-gray-900">{lead.propertyType}</p>
                          </div>
                          <div>
                              <p className="text-xs text-gray-500 uppercase">Timeline</p>
                              <p className="font-medium text-gray-900">{lead.timeline}</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Activity Timeline */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Timeline</h3>
                  <div className="space-y-6">
                      {lead.interactions && lead.interactions.length > 0 ? lead.interactions.map((interaction) => (
                          <div key={interaction.id} className="flex gap-4">
                              <div className="flex-shrink-0 mt-1">
                                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                      <MessageSquare className="w-4 h-4 text-gray-500" />
                                  </div>
                              </div>
                              <div>
                                  <p className="text-sm font-medium text-gray-900">{interaction.type}</p>
                                  <p className="text-sm text-gray-600">{interaction.content}</p>
                                  <p className="text-xs text-gray-400 mt-1">{new Date(interaction.createdAt).toLocaleString()}</p>
                              </div>
                          </div>
                      )) : <p className="text-gray-500 text-sm">No interactions yet.</p>}
                  </div>
              </div>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-80 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                      <button className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                          <Phone className="w-4 h-4 mr-2" /> Call Now
                      </button>
                      <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">
                          <MessageSquare className="w-4 h-4 mr-2" /> WhatsApp
                      </button>
                      <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">
                          <Calendar className="w-4 h-4 mr-2" /> Schedule Visit
                      </button>
                  </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Tasks</h3>
                  <div className="space-y-4">
                      {lead.tasks && lead.tasks.map(task => (
                          <div key={task.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                              <input type="checkbox" className="mt-1 mr-3" />
                              <div>
                                  <p className="text-sm font-medium text-gray-900">{task.title}</p>
                                  <p className="text-xs text-gray-500 flex items-center mt-1">
                                      <Clock className="w-3 h-3 mr-1" /> {new Date(task.dueDate).toLocaleDateString()}
                                  </p>
                              </div>
                          </div>
                      ))}
                      <button className="text-sm text-emerald-600 font-medium hover:underline">+ Add Task</button>
                  </div>
              </div>
          </div>
      </div>
    </AgentLayout>
  );
}
