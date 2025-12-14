import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Shield, Lock, Download, Search, FileText } from 'lucide-react';

export default function AuditLogsPage() {
  const logs = [
      { id: 1, user: 'Admin User', action: 'EXPORT_DATA', resource: 'Leads (All)', ip: '192.168.1.10', time: '10 mins ago' },
      { id: 2, user: 'Agent Smith', action: 'LOGIN_SUCCESS', resource: 'Portal', ip: '10.0.0.5', time: '1 hour ago' },
      { id: 3, user: 'System', action: 'AUTO_BACKUP', resource: 'Database (Daily)', ip: 'Localhost', time: '2 hours ago' },
      { id: 4, user: 'Sarah Connor', action: 'UPDATE_LEAD', resource: 'Lead #1024', ip: '10.0.0.8', time: '3 hours ago' },
      { id: 5, user: 'Agent Smith', action: 'LOGIN_FAILED', resource: 'Portal', ip: '10.0.0.5', time: '5 hours ago' },
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
          <div>
              <h1 className="text-2xl font-bold text-slate-900 font-serif">Security & Audit Logs</h1>
              <p className="text-slate-500">Monitor system access, data exports, and compliance events.</p>
          </div>
          <div className="flex space-x-2">
               <span className="flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                   <Lock className="w-3 h-3 mr-1" /> Encrypted
               </span>
               <span className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                   <Shield className="w-3 h-3 mr-1" /> GDPR Compliant
               </span>
          </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex gap-4">
              <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search logs by user, action or IP..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-emerald-500" />
              </div>
              <button className="flex items-center px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  <Download className="w-4 h-4 mr-2" /> Export CSV
              </button>
          </div>

          <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                  <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Resource</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">IP Address</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                  {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.user}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full
                                ${log.action.includes('FAILED') ? 'bg-red-100 text-red-800' :
                                  log.action.includes('BACKUP') ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'}`}>
                                  {log.action}
                              </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{log.resource}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ip}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.time}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </AdminLayout>
  );
}
