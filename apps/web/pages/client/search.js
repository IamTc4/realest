import React, { useState, useEffect } from 'react';
import ClientLayout from '../../components/layout/ClientLayout';
import { Search, Sliders, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
      location: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: ''
  });

  const fetchProperties = () => {
      setLoading(true);
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
          if (filters[key]) params.append(key, filters[key]);
      });

      fetch(`http://localhost:3001/api/properties?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
            setProperties(data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
  };

  useEffect(() => {
      fetchProperties();
  }, []);

  const handleChange = (e) => {
      setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
      e.preventDefault();
      fetchProperties();
  };

  return (
    <ClientLayout>
      <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Find Property</h1>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
                  <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="location"
                        placeholder="City, Area..."
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-500 text-sm"
                        value={filters.location}
                        onChange={handleChange}
                      />
                  </div>
              </div>

              <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                  <select
                    name="type"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-500 text-sm bg-white"
                    value={filters.type}
                    onChange={handleChange}
                  >
                      <option value="">Any Type</option>
                      <option value="APARTMENT">Apartment</option>
                      <option value="VILLA">Villa</option>
                      <option value="PLOT">Plot</option>
                  </select>
              </div>

              <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Bedrooms</label>
                  <select
                     name="bedrooms"
                     className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-500 text-sm bg-white"
                     value={filters.bedrooms}
                     onChange={handleChange}
                  >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                  </select>
              </div>

              <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Max Price</label>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Budget"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-500 text-sm"
                    value={filters.maxPrice}
                    onChange={handleChange}
                  />
              </div>

              <div className="flex items-end">
                  <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center">
                      <Search className="w-4 h-4 mr-2" /> Search
                  </button>
              </div>
          </form>
      </div>

      {/* Results */}
      {loading ? (
          <div className="text-center py-10">Loading...</div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.length > 0 ? properties.map(property => {
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
                                  <span className="font-medium">{property.bedrooms} Beds</span>
                                  <span className="font-medium">{property.bathrooms} Baths</span>
                                  <span className="font-medium">{property.areaSqFt} sqft</span>
                              </div>
                          </div>
                      </Link>
                  )
              }) : (
                  <div className="col-span-full text-center py-10 text-gray-500">
                      No properties found matching your criteria.
                  </div>
              )}
          </div>
      )}
    </ClientLayout>
  );
}
