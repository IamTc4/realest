import React, { useEffect, useState } from 'react';
import ClientLayout from '../../components/layout/ClientLayout';
import { Search, MapPin, Bed, Bath, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ClientHome() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/properties')
      .then(res => res.json())
      .then(data => {
          setProperties(data);
          setLoading(false);
      })
      .catch(err => {
          console.error(err);
          setLoading(false);
      });
  }, []);

  return (
    <ClientLayout>
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8 bg-emerald-900 h-64 flex items-center justify-center">
         <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center"></div>
         <div className="relative z-10 text-center px-4">
             <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Find Your Dream Home</h1>
             <p className="text-emerald-100 mb-6">Explore the best properties in the city.</p>

             {/* Search Bar */}
             <div className="bg-white p-2 rounded-full shadow-lg flex items-center max-w-md mx-auto">
                 <MapPin className="text-gray-400 w-5 h-5 ml-3" />
                 <input type="text" placeholder="Search location..." className="flex-1 px-3 py-2 outline-none text-gray-700" />
                 <button className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700">
                     <Search className="w-5 h-5" />
                 </button>
             </div>
         </div>
      </div>

      {/* Featured Properties */}
      <section>
          <div className="flex justify-between items-end mb-6">
              <div>
                  <h2 className="text-xl font-bold text-gray-900">Featured Properties</h2>
                  <p className="text-sm text-gray-500">Handpicked for you</p>
              </div>
              <Link href="/client/search" className="text-emerald-600 text-sm font-medium flex items-center hover:underline">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
          </div>

          {loading ? (
              <div className="text-center py-10">Loading...</div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map(property => {
                      const images = JSON.parse(property.images || '[]');
                      return (
                          <Link href={`/client/properties/${property.id}`} key={property.id} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
                              <div className="relative h-48 bg-gray-200">
                                  {images[0] && <img src={images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
                                      {property.type}
                                  </div>
                              </div>
                              <div className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                      <h3 className="font-bold text-lg text-gray-900 truncate pr-4">{property.title}</h3>
                                      <p className="font-bold text-emerald-600 whitespace-nowrap">${property.price.toLocaleString()}</p>
                                  </div>
                                  <div className="flex items-center text-gray-500 text-sm mb-4">
                                      <MapPin className="w-4 h-4 mr-1" />
                                      {property.location}
                                  </div>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
                                      <div className="flex items-center">
                                          <Bed className="w-4 h-4 mr-1 text-gray-400" /> {property.bedrooms} Beds
                                      </div>
                                      <div className="flex items-center">
                                          <Bath className="w-4 h-4 mr-1 text-gray-400" /> {property.bathrooms} Baths
                                      </div>
                                      <div className="flex items-center">
                                          <span className="font-medium mr-1">{property.areaSqFt}</span> Sq Ft
                                      </div>
                                  </div>
                              </div>
                          </Link>
                      )
                  })}
              </div>
          )}
      </section>

      {/* Categories / New Section */}
      <section className="mt-12">
           <h2 className="text-xl font-bold text-gray-900 mb-6">Explore by Type</h2>
           <div className="grid grid-cols-3 gap-4">
               {['Apartment', 'Villa', 'Plot'].map((type) => (
                   <div key={type} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center hover:border-emerald-500 cursor-pointer transition-colors">
                       <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
                           <BuildingIcon type={type} />
                       </div>
                       <span className="font-medium text-gray-800">{type}s</span>
                   </div>
               ))}
           </div>
      </section>
    </ClientLayout>
  );
}

const BuildingIcon = ({ type }) => {
    // Simple icon switching
    return <Building className="w-6 h-6" />;
}

import { Building } from 'lucide-react';
