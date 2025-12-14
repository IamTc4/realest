import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/properties')
      .then(res => res.json())
      .then(data => {
          setProperties(data);
          setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center">
              <Plus className="w-4 h-4 mr-2" /> Add Property
          </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
              <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                      <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                      {properties.map((property) => (
                          <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                  <div className="flex items-center">
                                      {/* <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-lg mr-3"></div> */}
                                      <div>
                                          <div className="text-sm font-medium text-gray-900">{property.title}</div>
                                          <div className="text-sm text-gray-500">{property.location}</div>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.type}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">${property.price.toLocaleString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                      {property.status}
                                  </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                                      <Edit className="w-4 h-4" />
                                  </button>
                                  <button className="text-red-600 hover:text-red-900">
                                      <Trash2 className="w-4 h-4" />
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
