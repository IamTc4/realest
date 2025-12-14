import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Bot, Zap, MessageSquare, CheckCircle, Clock } from 'lucide-react';

export default function AutomationsPage() {
  return (
    <AdminLayout>
      <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 font-serif">AI & Automations</h1>
          <p className="text-slate-500">Manage intelligent workflows and roadmap status.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* AI Lead Scoring Panel */}
          <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-emerald-600 rounded-full filter blur-[100px] opacity-20"></div>
              <div className="relative z-10">
                  <div className="flex items-center mb-6">
                      <div className="p-3 bg-white/10 rounded-lg mr-4"><Bot className="w-8 h-8 text-emerald-400" /></div>
                      <div>
                          <h3 className="text-xl font-bold font-serif">AI Lead Scoring</h3>
                          <p className="text-slate-400 text-sm">Active Model v2.4</p>
                      </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                          <div className="text-2xl font-bold text-emerald-400">92%</div>
                          <div className="text-xs text-slate-400 uppercase">Accuracy</div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                          <div className="text-2xl font-bold text-blue-400">1.2s</div>
                          <div className="text-xs text-slate-400 uppercase">Latency</div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                          <div className="text-2xl font-bold text-purple-400">15k</div>
                          <div className="text-xs text-slate-400 uppercase">Scored</div>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-300">Hot Lead Threshold</span>
                          <span className="font-mono text-emerald-400">&gt; 80</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1">
                          <div className="bg-emerald-500 h-1 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Chatbot Performance */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6 font-serif flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-600" /> Chatbot Performance
              </h3>

              <div className="space-y-6">
                  <div className="flex items-center justify-between">
                      <div>
                          <p className="font-medium text-slate-900">Queries Handled</p>
                          <p className="text-xs text-slate-500">Last 24 hours</p>
                      </div>
                      <span className="text-xl font-bold text-slate-900">1,240</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{width: '65%'}}></div>
                  </div>

                  <div className="flex items-center justify-between">
                      <div>
                          <p className="font-medium text-slate-900">Leads Generated</p>
                          <p className="text-xs text-slate-500">Auto-captured from chat</p>
                      </div>
                      <span className="text-xl font-bold text-emerald-600">85</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{width: '40%'}}></div>
                  </div>

                  <div className="flex items-center justify-between">
                      <div>
                          <p className="font-medium text-slate-900">Escalation Rate</p>
                          <p className="text-xs text-slate-500">Transferred to human agent</p>
                      </div>
                      <span className="text-xl font-bold text-amber-500">12%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{width: '12%'}}></div>
                  </div>
              </div>
          </div>
      </div>

      {/* Roadmap Visualization */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-slate-900 mb-8 font-serif">Product Roadmap Status</h3>

          <div className="relative">
              {/* Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              {/* Phase 1 */}
              <div className="relative pl-24 pb-12">
                  <div className="absolute left-4 top-0 w-8 h-8 rounded-full bg-emerald-600 border-4 border-white shadow-sm flex items-center justify-center text-white">
                      <CheckCircle className="w-4 h-4" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Phase 1: MVP Core (Live)</h4>
                  <p className="text-slate-500 text-sm mt-1 mb-4">Foundation built. CRM, Listings, Agent Portal active.</p>
                  <div className="flex gap-2">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">Lead Capture</span>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">Property Mgmt</span>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">Basic Analytics</span>
                  </div>
              </div>

              {/* Phase 2 */}
              <div className="relative pl-24 pb-12">
                  <div className="absolute left-4 top-0 w-8 h-8 rounded-full bg-blue-600 border-4 border-white shadow-sm flex items-center justify-center text-white animate-pulse">
                      <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Phase 2: Growth (In Progress)</h4>
                  <p className="text-slate-500 text-sm mt-1 mb-4">Adding intelligence layer and deeper automation.</p>
                  <div className="flex gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">AI Chatbot</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">Lead Scoring</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded border border-gray-200">Multi-channel</span>
                  </div>
              </div>

              {/* Phase 3 */}
              <div className="relative pl-24">
                  <div className="absolute left-4 top-0 w-8 h-8 rounded-full bg-gray-200 border-4 border-white shadow-sm flex items-center justify-center text-gray-500">
                      <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-400">Phase 3: Scale / SaaS (Planned)</h4>
                  <p className="text-slate-400 text-sm mt-1 mb-4">Multi-tenancy and advanced prediction models.</p>
                  <div className="flex gap-2 opacity-50">
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded border border-gray-200">White-labeling</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded border border-gray-200">Predictive Analytics</span>
                  </div>
              </div>
          </div>
      </div>
    </AdminLayout>
  );
}
