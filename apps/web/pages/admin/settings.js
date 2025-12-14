import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Settings, CreditCard, Palette, Globe, Shield } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('branding');
  const [org, setOrg] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/api/organization', {
         headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setOrg(data))
    .catch(console.error);
  }, []);

  if (!org) return <AdminLayout><div className="flex h-screen items-center justify-center">Loading Settings...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 font-serif">SaaS Configuration</h1>
          <p className="text-slate-500">Manage white-labeling, billing, and system access.</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-gray-100">
                      <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Settings</h3>
                  </div>
                  <nav className="flex flex-col">
                      <SettingsTab icon={Palette} label="Branding" id="branding" active={activeTab} onClick={setActiveTab} />
                      <SettingsTab icon={CreditCard} label="Billing & Plan" id="billing" active={activeTab} onClick={setActiveTab} />
                      <SettingsTab icon={Globe} label="Domains" id="domains" active={activeTab} onClick={setActiveTab} />
                      <SettingsTab icon={Shield} label="Security" id="security" active={activeTab} onClick={setActiveTab} />
                  </nav>
              </div>
          </div>

          {/* Content */}
          <div className="col-span-12 md:col-span-9">
              {activeTab === 'branding' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                      <div className="flex justify-between items-start mb-6">
                           <div>
                               <h2 className="text-xl font-bold text-slate-900">White-Label Branding</h2>
                               <p className="text-sm text-slate-500">Customize the platform look and feel for your agency.</p>
                           </div>
                           <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">Enterprise Plan</span>
                      </div>

                      <div className="space-y-6 max-w-lg">
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Organization Name</label>
                              <input type="text" defaultValue={org.name} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">Brand Color</label>
                                  <div className="flex items-center space-x-2">
                                      <input type="color" defaultValue={org.brandColor} className="h-10 w-10 rounded border border-gray-200 cursor-pointer" />
                                      <span className="text-sm text-gray-500 font-mono">{org.brandColor}</span>
                                  </div>
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">Logo</label>
                                  <div className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg h-10 text-gray-400 text-sm cursor-pointer hover:border-emerald-500 hover:text-emerald-500">
                                      Upload Logo
                                  </div>
                              </div>
                          </div>

                          <div className="pt-4">
                              <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors">Save Changes</button>
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'billing' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                       <h2 className="text-xl font-bold text-slate-900 mb-6">Plan & Usage</h2>

                       <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 flex justify-between items-center">
                           <div>
                               <p className="text-sm text-slate-500 font-bold uppercase mb-1">Current Plan</p>
                               <h3 className="text-2xl font-bold text-emerald-600">Enterprise Scale</h3>
                               <p className="text-sm text-slate-600 mt-1">$499 / month • Billed Annually</p>
                           </div>
                           <button className="text-emerald-600 font-bold hover:underline">Manage Subscription</button>
                       </div>

                       <h3 className="font-bold text-slate-900 mb-4">Resource Usage</h3>
                       <div className="space-y-6">
                           <div>
                               <div className="flex justify-between text-sm mb-2">
                                   <span className="text-slate-600">Leads Generated</span>
                                   <span className="font-bold text-slate-900">1,240 / {org.leadsLimit}</span>
                               </div>
                               <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                   <div className="bg-blue-500 h-full" style={{ width: `${(1240 / org.leadsLimit)*100}%` }}></div>
                               </div>
                           </div>
                           <div>
                               <div className="flex justify-between text-sm mb-2">
                                   <span className="text-slate-600">Agent Seats</span>
                                   <span className="font-bold text-slate-900">5 / 20</span>
                               </div>
                               <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                   <div className="bg-purple-500 h-full" style={{ width: '25%' }}></div>
                               </div>
                           </div>
                       </div>
                  </div>
              )}
          </div>
      </div>
    </AdminLayout>
  );
}

const SettingsTab = ({ icon: Icon, label, id, active, onClick }) => (
    <button
        onClick={() => onClick(id)}
        className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${active === id ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500' : 'text-slate-600 hover:bg-gray-50'}`}
    >
        <Icon className={`w-4 h-4 mr-3 ${active === id ? 'text-emerald-600' : 'text-slate-400'}`} />
        {label}
    </button>
);
